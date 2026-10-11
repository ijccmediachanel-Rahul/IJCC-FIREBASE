import { client } from "@/sanity/lib/client";

interface CachedKnowledge {
  text: string;
  centres: any[];
  events: any[];
  services: any[];
  pricing: any[];
  settings: any;
  jesdcPage: any;
  lastFetched: number;
}

let cachedData: CachedKnowledge | null = null;
const CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes auto-refresh

/**
 * Fetches dynamic content from Sanity CMS for all pages and centres.
 * Automatically keeps the AI Chatbot synchronized with CMS updates.
 */
export async function getDynamicCmsKnowledge(): Promise<{
  knowledgeText: string;
  centres: any[];
  events: any[];
  services: any[];
  pricing: any[];
  settings: any;
  jesdcPage: any;
}> {
  const now = Date.now();

  // Return cached version if still fresh
  if (cachedData && now - cachedData.lastFetched < CACHE_TTL_MS) {
    return {
      knowledgeText: cachedData.text,
      centres: cachedData.centres,
      events: cachedData.events,
      services: cachedData.services,
      pricing: cachedData.pricing,
      settings: cachedData.settings,
      jesdcPage: cachedData.jesdcPage,
    };
  }

  try {
    const [
      centres,
      jesdcPage,
      events,
      services,
      pricing,
      news,
      chapters,
      settings,
    ] = await Promise.all([
      client.fetch(
        `*[_type == "jesdcCentre" && hidden != true] | order(coalesce(order, 10) asc, name asc) {
          name, cityName, stateName, address, coordinatorName, phone, email, timings,
          programsAvailable, facilities, upcomingBatchDate, availableSeats
        }`
      ).catch(() => []),
      client.fetch(
        `*[_type == "jesdcPage"][0] {
          bannerTitle, bannerSubtitle, bannerTagline, bannerDescription,
          objectivesTitle, objectives[] { number, title, category, description, points },
          whyJesdcPoints[] { title, description },
          centralHelpline, centralEmail
        }`
      ).catch(() => null),
      client.fetch(
        `*[_type == "event"] | order(date desc)[0...6] {
          title, date, location, description
        }`
      ).catch(() => []),
      client.fetch(
        `*[_type == "serviceItem"] | order(coalesce(order, 99) asc) {
          title, shortDescription, "slug": slug.current
        }`
      ).catch(() => []),
      client.fetch(
        `*[_type == "membershipPricing"] | order(coalesce(order, 99) asc) {
          tierName, title, price, currency, eligibility, benefits
        }`
      ).catch(() => []),
      client.fetch(
        `*[_type == "newsArticle"] | order(publishedAt desc)[0...5] {
          title, publishedAt, excerpt
        }`
      ).catch(() => []),
      client.fetch(
        `*[_type == "chapter" && hidden != true] {
          title, region, chapterType
        }`
      ).catch(() => []),
      client.fetch(
        `*[_type == "siteSettings"][0] {
          phoneNumber, contactEmail, address
        }`
      ).catch(() => null),
    ]);

    // Build markdown structured dynamic knowledge block
    const sections: string[] = [];

    // 1. Live JESDC Centres & Page from CMS
    if (centres && centres.length > 0) {
      const centresInfo = centres
        .map(
          (c: any, i: number) =>
            `${i + 1}. **${c.name || "Centre"}** (${c.cityName || "India"}${c.stateName ? `, ${c.stateName}` : ""}):
   - Address: ${c.address || "Contact centre for address"}
   - Contact / Phone: ${c.phone || "+91-92679 19281"}
   - Email: ${c.email || "info@ijcc.in"}
   - Coordinator: ${c.coordinatorName || "IJCC Academic Desk"}
   - Timings: ${c.timings || "Mon - Sat: 9:00 AM - 6:00 PM"}
   - Upcoming Batch: ${c.upcomingBatchDate || "Open for Admissions"} (${c.availableSeats || "Limited Seats"})
   - Programs Available: ${Array.isArray(c.programsAvailable) ? c.programsAvailable.join(", ") : "All 5 standard programs"}
   - Facilities: ${Array.isArray(c.facilities) ? c.facilities.join(", ") : "Smart Audio-Visual Lab, JLPT Library"}`
        )
        .join("\n\n");

      sections.push(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LIVE JESDC CENTRES (From Sanity CMS):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${centresInfo}`);
    }

    if (jesdcPage?.objectives && jesdcPage.objectives.length > 0) {
      const objInfo = jesdcPage.objectives
        .map(
          (o: any) =>
            `- **${o.number || ""}. ${o.title || ""}** (${o.category || ""}): ${o.description || ""} ${Array.isArray(o.points) ? `[Key Points: ${o.points.join("; ")}]` : ""}`
        )
        .join("\n");

      sections.push(`JESDC OBJECTIVES & CURRICULUM (From Sanity CMS):
${objInfo}`);
    }

    // 2. Live Events from CMS
    if (events && events.length > 0) {
      const eventsInfo = events
        .map(
          (e: any) =>
            `- **${e.title}** | Date: ${e.date || "TBA"} | Location: ${e.location || "Online/Hybrid"}\n  Details: ${e.description || ""}`
        )
        .join("\n");

      sections.push(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
UPCOMING & RECENT EVENTS (From Sanity CMS):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${eventsInfo}`);
    }

    // 3. Live Services from CMS
    if (services && services.length > 0) {
      const servicesInfo = services
        .map(
          (s: any) =>
            `- **${s.title}**: ${s.shortDescription || ""} (URL: /services/${s.slug})`
        )
        .join("\n");

      sections.push(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IJCC SERVICES (From Sanity CMS):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${servicesInfo}`);
    }

    // 4. Live Membership Pricing from CMS
    if (pricing && pricing.length > 0) {
      const pricingInfo = pricing
        .map(
          (p: any) =>
            `- **${p.title || p.tierName}**: ${p.currency || "INR"} ${p.price || "Contact IJCC"} | Eligibility: ${p.eligibility || "Open"}${Array.isArray(p.benefits) ? `\n  Benefits: ${p.benefits.slice(0, 3).join("; ")}` : ""}`
        )
        .join("\n");

      sections.push(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MEMBERSHIP TIERS & PRICING (From Sanity CMS):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${pricingInfo}`);
    }

    // 5. Live News & Updates
    if (news && news.length > 0) {
      const newsInfo = news
        .map((n: any) => `- **${n.title}** (${n.publishedAt || ""}): ${n.excerpt || ""}`)
        .join("\n");

      sections.push(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LATEST NEWS & ANNOUNCEMENTS (From Sanity CMS):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${newsInfo}`);
    }

    // 6. Regional Chapters
    if (chapters && chapters.length > 0) {
      const chaptersInfo = chapters
        .map((ch: any) => `- ${ch.title} (${ch.region || ""})`)
        .join("\n");

      sections.push(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REGIONAL CHAPTERS (From Sanity CMS):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${chaptersInfo}`);
    }

    const dynamicText = sections.join("\n\n");

    cachedData = {
      text: dynamicText,
      centres,
      events,
      services,
      pricing,
      settings,
      jesdcPage,
      lastFetched: now,
    };

    return {
      knowledgeText: dynamicText,
      centres,
      events,
      services,
      pricing,
      settings,
      jesdcPage,
    };
  } catch (err) {
    console.warn("[Dynamic CMS Knowledge] Fetch error, returning fallback cache:", err);
    return {
      knowledgeText: cachedData?.text || "",
      centres: cachedData?.centres || [],
      events: cachedData?.events || [],
      services: cachedData?.services || [],
      pricing: cachedData?.pricing || [],
      settings: cachedData?.settings || null,
      jesdcPage: cachedData?.jesdcPage || null,
    };
  }
}
