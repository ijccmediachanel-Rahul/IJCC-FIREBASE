import { groq } from 'next-sanity';

export const SITE_SETTINGS_QUERY = groq`
  *[_type == "siteSettings"][0] {
    contactEmail,
    phoneNumber,
    address,
    instagramUrl,
    linkedinUrl,
    facebookUrl,
    youtubeUrl
  }
`;

export const MEMBERSHIP_PRICING_QUERY = groq`
  *[_type == "membershipPricing"] | order(coalesce(order, 99) asc) {
    _id,
    tierId,
    tierName,
    title,
    eligibility,
    price,
    currency,
    benefits,
    order
  }
`;

export const ASSOCIATES_QUERY = groq`
  *[_type == "associate"] | order(coalesce(order, 99) asc, name asc) {
    _id,
    name,
    website,
    "logoUrl": coalesce(logo.asset->url, logoUrl),
    cardClass,
    order
  }
`;

export const MEMBERS_PAGE_QUERY = groq`
  *[_type == "membersPage"][0] {
    associatesTitle,
    associatesDescription,
    paymentTitle,
    paymentSubtitle,
    accountNameLabel,
    accountName,
    bankNameLabel,
    bankName,
    accountNoLabel,
    accountNo,
    branchLabel,
    branch,
    ifscCodeLabel,
    ifscCode,
    micrCodeLabel,
    micrCode,
    branchCodeLabel,
    branchCode,
    "qrImageUrl": coalesce(qrImage.asset->url, qrImageUrl),
    scanLabel,
    supportText,
    paymentNote,
    rulesTitle,
    rules,
    enrollmentTitle,
    enrollmentDescription,
    contactTitle
  }
`;

export const EVENTS_QUERY = groq`
  *[_type == "event"] | order(date desc) {
    _id,
    title,
    date,
    time,
    isVertical,
    location,
    description,
    registrationLink,
    "imageUrl": coalesce(image.asset->url, imageUrl)
  }
`;

export const EVENTS_PAGE_QUERY = groq`
  *[_type == "eventsPage"][0] {
    title,
    description,
    calendarTitle
  }
`;

export const MEMBERS_QUERY = groq`
  *[_type == "member"] | order(coalesce(order, 99) asc, name asc) {
    _id,
    name,
    name_ja,
    role,
    role_ja,
    category,
    bio,
    bio_ja,
    order,
    "imageUrl": coalesce(image.asset->url, imageUrl)
  }
`;

export const GALLERY_QUERY = groq`
  *[_type == "galleryImage"] | order(_createdAt desc) {
    _id,
    title,
    "imageUrl": image.asset->url
  }
`;

export const GALLERY_PAGE_QUERY = groq`
  *[_type == "galleryPage"][0] {
    title,
    description
  }
`;

export const HOME_PAGE_QUERY = groq`
  *[_type == "homePage"][0] {
    heroTitle,
    heroSubtitle,
    heroSlides[] {
      slideType,
      "imageUrl": coalesce(image.asset->url, imageUrl),
      videoUrl,
      alt
    },
    heroPrimaryButtonLink,
    heroSecondaryButtonLink,
    heroTertiaryButtonLink,
    aboutBadge,
    aboutTitle,
    aboutDescription,
    "aboutImageUrl": coalesce(aboutImage.asset->url, aboutImageUrl),
    aboutButtonLink,
    featuresBadge,
    featuresTitle,
    featuresDescription,
    "featuresBackgroundImageUrl": coalesce(featuresBackgroundImage.asset->url, featuresBackgroundImageUrl),
    featureCards[] {
      title,
      description,
      link
    },
    partnersTitle,
    partnersDescription,
    partners[] {
      name,
      website,
      "logoUrl": coalesce(logo.asset->url, logoUrl)
    },
    ctaTitle,
    ctaDescription,
    ctaButtonLink
  }
`;

export const ABOUT_PAGE_QUERY = groq`
  *[_type == "aboutPage"][0] {
    heroBadge,
    heroTitle,
    heroTagline,
    pageTitle,
    introduction,
    mission,
    missionTitle,
    visionTitle,
    visionDescription,
    history,
    factsTitle,
    facts[] { label, value },
    orgTypeLabel,
    orgTypeValue,
    hqLabel,
    hqValue,
    websiteLabel,
    websiteValue,
    objectivesTitle,
    objectivesSubtitle,
    objectives[] { title, description },
    verticalsTitle,
    verticalsSubtitle,
    verticals[] { title, description, points },
    benefitsTitle,
    benefitsSubtitle,
    benefits[] { title, points },
    leadershipTitle,
    leadershipSubtitle,
    advisoryTitle,
    advisorySubtitle,
    mouTitle,
    mouSubtitle,
    mouPartners[] { name, description },
    connectTitle,
    connectSubtitle
  }
`;

export const CONTACT_PAGE_QUERY = groq`
  *[_type == "contactPage"][0] {
    pageTitle,
    introduction,
    corporateOfficeTitle,
    corporateOfficeAddress,
    branchOfficeTitle,
    branchOfficeAddress,
    japanOfficeTitle,
    japanOfficeAddress,
    contactEmail,
    phoneIndia,
    phoneBranch,
    phoneJapan,
    faqTitle,
    officesTitle,
    faqs
  }
`;

export const NEWS_ARTICLES_QUERY = groq`
  *[_type == "newsArticle"] | order(publishDate desc) {
    _id,
    title,
    "slug": slug.current,
    publishDate,
    "featuredImageUrl": coalesce(featuredImage.asset->url, featuredImageUrl),
    excerpt,
    tag,
    content
  }
`;

export const NEWS_ARTICLE_BY_SLUG_QUERY = groq`
  *[_type == "newsArticle" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    publishDate,
    "featuredImageUrl": coalesce(featuredImage.asset->url, featuredImageUrl),
    excerpt,
    tag,
    content
  }
`;

export const NEWS_PAGE_QUERY = groq`
  *[_type == "newsPage"][0] {
    title,
    description
  }
`;

export const LEGAL_PAGE_QUERY = groq`
  *[_type == "legalPage" && _id == $id][0] {
    title,
    lastUpdated,
    content
  }
`;

export const RESOURCES_QUERY = groq`
  *[_type == "resourceItem"] | order(coalesce(order, 99) asc) {
    _id,
    resourceId,
    title,
    category,
    description,
    "fileUrl": file.asset->url,
    externalLink,
    linkUrl,
    isProtected,
    order
  }
`;

export const RESOURCES_PAGE_QUERY = groq`
  *[_type == "resourcesPage"][0] {
    title,
    description
  }
`;

export const SERVICES_QUERY = groq`
  *[_type == "serviceItem"] | order(coalesce(order, 99) asc) {
    _id,
    title,
    "slug": slug.current,
    iconName,
    shortDescription,
    sections[] {
      title,
      items[] { text, subItems }
    },
    order
  }
`;

export const SERVICE_DETAIL_QUERY = groq`
  *[_type == "serviceItem" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    iconName,
    shortDescription,
    sections[] {
      title,
      items[] { text, subItems }
    }
  }
`;
