import { NextRequest, NextResponse } from "next/server";
import { IJCC_STATIC_KNOWLEDGE } from "@/lib/ijccKnowledge";
import { getDynamicCmsKnowledge } from "@/lib/dynamicCmsKnowledge";

export const runtime = "nodejs";
export const maxDuration = 60;

function hasJapanese(text: string): boolean {
  return /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf]/.test(text);
}

function getSystemPrompt(language: string, userMessage: string, dynamicCmsText: string): string {
  const isJapaneseMode = language === "ja" || hasJapanese(userMessage);

  return `You are the official AI assistant for IJCC (Indo-Japan Chamber of Commerce) at ijcc.in.
Help users with all pages and services including Membership, Events, India-Japan Trade & Investment, Resources, State Policies, and our JESDC Japanese Language Education & Skilling Development Centres.

STATIC KNOWLEDGE BASE:
${IJCC_STATIC_KNOWLEDGE}

REAL-TIME DYNAMIC CMS KNOWLEDGE (Live updates from Sanity Studio across all pages):
${dynamicCmsText}

CRITICAL INSTRUCTIONS:
- Always prioritize the LIVE CMS updates above if there is fresh content or new centres/events added through Sanity CMS.
- Current user interface language: ${language === "ja" ? "Japanese (ja)" : "English (en)"}.
${
  isJapaneseMode
    ? "- You MUST answer in natural, polite, and professional Japanese (敬語・丁寧語・「です・ます」調). If the user asked in Japanese or if the current interface language is Japanese, reply in Japanese."
    : "- You MUST answer in English unless the user explicitly writes to you in Japanese."
}
- If the user asks in Japanese, ALWAYS respond in Japanese.
- If the user asks in English while language is English, respond in English.
- If the user asks about JESDC centres, programs, or admission, provide accurate info about Delhi, Kolkata, Patna (and any new centres in the CMS data), the 5 training programs, and helpline (+91-92679 19281 / ijcc.in/jesdc-centres).
- Always provide helpful, accurate, and concise information about IJCC and India-Japan bilateral relations.

Be professional, warm, and concise. Answer in 2-3 short paragraphs maximum.
Today: ${new Date().toDateString()}`;
}

const FALLBACK_RESPONSES_EN: Record<string, string> = {
  jesdc: "JESDC (Japanese Language Education & Skilling Development Centre) is IJCC's premier Japanese language and skills training initiative! We currently operate active centres across India:\n\n📍 **Delhi Centre**: D-21 Corporate Park, Sector 21, Dwarka, New Delhi\n📍 **Kolkata Centre**: Infinity Benchmark, Sector V, Salt Lake, Kolkata\n📍 **Patna Centre**: Maurya Centre, Fraser Road, Near Dak Bungalow, Patna\n\n**Programs Offered**:\n1. SSW / TITP Japanese (Blue-Collar & Technical Interns)\n2. Japanese for University Students (JLPT N5–N3)\n3. Japanese for Professionals (IT & Non-IT Business Japanese)\n4. Japanese for Further Studies (EJU & N2/N1 pathway)\n5. University Admission & Scholarship Assistance\n\n📞 **Helpline**: +91-92679 19281 | 🌐 **Explore & Enrol**: [ijcc.in/jesdc-centres](https://www.ijcc.in/jesdc-centres)",
  membership: "IJCC membership gives you access to exclusive networking events, our business directory, trade facilitation support, and introductions to partners in India and Japan. To apply, please visit ijcc.in/pricing or contact us directly at ijcc.in/contact.",
  events: "IJCC regularly organizes seminars, trade missions, networking dinners, and cultural programs connecting Indian and Japanese businesses. Please visit ijcc.in/events for the latest upcoming events.",
  trade: "India and Japan share strong bilateral trade ties exceeding $20B across automobiles, electronics, pharmaceuticals, and infrastructure. IJCC facilitates introductions, provides market intelligence, and helps businesses navigate both markets.",
  japan: "IJCC helps Indian businesses expand to Japan by providing market entry guidance, partner introductions, cultural briefings, and networking with Japanese companies already operating in India.",
  india: "IJCC assists Japanese companies entering India with market research, regulatory guidance, partner matching, and connections to Indian government and industry bodies.",
  default: "Thank you for reaching out to IJCC! We are the Indo-Japan Chamber of Commerce, dedicated to strengthening business, educational, and cultural ties between India and Japan.\n\nI can help you with:\n- **JESDC Japanese Language Centres** (Delhi, Kolkata, Patna: [ijcc.in/jesdc-centres](https://www.ijcc.in/jesdc-centres))\n- **Membership & Corporate Tiers** ([ijcc.in/pricing](https://www.ijcc.in/pricing))\n- **Events & B2B Delegations** ([ijcc.in/events](https://www.ijcc.in/events))\n- **Trade & Investment Facilitation**\n\nHow may I assist you today? You can also call us at +91-92679 19281.",
};

const FALLBACK_RESPONSES_JA: Record<string, string> = {
  jesdc: "JESDC（日印日本語教育・スキル開発センター）は、印日商工会議所（IJCC）が運営する公式の日本語研修機関です！現在、インド国内3拠点（デリー、コルカタ、パトナ）で開校しています：\n\n📍 **デリーセンター**: D-21 Corporate Park, Sector 21, Dwarka, New Delhi\n📍 **コルカタセンター**: Infinity Benchmark, Sector V, Salt Lake, Kolkata\n📍 **パトナセンター**: Maurya Centre, Fraser Road, Patna\n\n**主な提供プログラム**:\n1. 特定技能（SSW）・技能実習（TITP）向け日本語\n2. 大学生向け日本語（JLPT N5〜N3取得）\n3. ビジネスプロフェッショナル・IT技術者向け日本語\n4. 日本留学・大学院進学準備コース\n5. 日本の大学進学・奨学金（MEXT等）サポート\n\n📞 **お問い合わせ**: +91-92679 19281 | 🌐 **詳細・見学予約**: [ijcc.in/jesdc-centres](https://www.ijcc.in/jesdc-centres)",
  membership: "IJCCの会員になると、限定ネットワーキングイベントへの参加、企業名鑑の閲覧、貿易促進サポート、日印両国の有力パートナーの紹介などをご利用いただけます。お申し込みはウェブサイト（ijcc.in/pricing）をご覧ください。",
  events: "IJCCは、日印両国の企業をつなぐセミナー、ビジネス使節団、ネットワーキングイベント、文化プログラムを定期的に開催しています。最新情報は ijcc.in/events をご覧ください。",
  trade: "日印両国は、自動車、電子機器、医薬品、インフラなど多岐にわたる分野で強固な二国間貿易関係を築いています。IJCCはパートナー紹介、市場情報の提供、両国市場への進出支援を行っています。",
  japan: "IJCCは、日本市場参入のガイダンス、現地パートナーの紹介、文化ブリーフィング、日本企業とのネットワーキングを通じて、インド企業の日本進出を支援します。",
  india: "IJCCは、市場調査、規制・法務ガイダンス、パートナーマッチング、インド政府および業界団体との連携を通じて、日本企業のインド進出を総合的にサポートします。",
  default: "IJCC（印日商工会議所）へのお問い合わせありがとうございます！私たちはインドと日本のビジネス、教育、文化連携の強化に尽力しています。\n\n以下についてご案内できます：\n- **JESDC日本語教育センター**（デリー・コルカタ・パトナ：[ijcc.in/jesdc-centres](https://www.ijcc.in/jesdc-centres)）\n- **メンバーシップ・会員制度**（[ijcc.in/pricing](https://www.ijcc.in/pricing)）\n- **イベント・セミナー**（[ijcc.in/events](https://www.ijcc.in/events)）\n- **日印貿易・投資支援**\n\nご質問がございましたらお気軽にお知らせください。電話番号：+91-92679 19281",
};

function getFallbackResponse(
  message: string,
  language: string,
  cmsCentres: any[] = [],
  cmsEvents: any[] = [],
  cmsServices: any[] = [],
  cmsPricing: any[] = [],
  jesdcPage: any = null,
  cmsSettings: any = null
): string {
  const isJa = language === "ja" || hasJapanese(message);
  const lower = message.toLowerCase().trim();
  const dict = isJa ? FALLBACK_RESPONSES_JA : FALLBACK_RESPONSES_EN;

  // 1. INTENT: Enrolment, Registration, Counselling, How to Join JESDC
  if (
    lower.includes("enrol") ||
    lower.includes("enroll") ||
    lower.includes("counsel") ||
    lower.includes("admission") ||
    lower.includes("how to join") ||
    lower.includes("how can i join") ||
    lower.includes("register") ||
    lower.includes("apply") ||
    lower.includes("booking") ||
    lower.includes("book free") ||
    lower.includes("how to apply") ||
    lower.includes("form") ||
    message.includes("申し込み") ||
    message.includes("登録") ||
    message.includes("カウンセリング") ||
    message.includes("受講") ||
    message.includes("相談")
  ) {
    return isJa
      ? `JESDC日本語教育・研修への受講お申し込みと無料カウンセリングの手順：\n\n1. 公式センターページ [ijcc.in/jesdc-centres](https://www.ijcc.in/jesdc-centres) を開きます。\n2. 各センターカードの「無料カウンセリング予約（Book Free Counselling）」または「このプログラムに問い合わせる」をクリックします。\n3. ご希望のセンター（デリー、コルカタ、パトナ）およびコースを選択し、お名前とお電話番号をご入力ください。\n4. 24時間以内に専門のアカデミックコーディネーターよりご連絡し、オリエンテーション日程とレベル診断をご案内いたします。\n\n📞 お電話でのお申し込み：+91-92679 19281\n✉️ メール窓口：del@ijcc.in / ccu@ijcc.in / pat@ijcc.in`
      : `To enrol or book a free counselling session at JESDC, follow these simple steps:\n\n1. **Visit the JESDC Page**: Go to [ijcc.in/jesdc-centres](https://www.ijcc.in/jesdc-centres)\n2. **Choose your Centre & Program**: Click on **"Book Free Counselling"** or **"Enquire for this Program"** on any centre card (Delhi, Kolkata, or Patna).\n3. **Submit Your Details**: Enter your Name, Phone/WhatsApp number, and preferred course.\n4. **Personalized Assessment**: Our IJCC academic counsellor will call you back within 24 hours to schedule your free orientation and evaluate your learning goals!\n\n📞 **Direct Helpline / WhatsApp**: +91-92679 19281\n✉️ **Direct Emails**: del@ijcc.in | ccu@ijcc.in | pat@ijcc.in`;
  }

  // 2. INTENT: Centre Locations, Physical Addresses, Where to Learn
  if (
    lower.includes("where") ||
    lower.includes("location") ||
    lower.includes("address") ||
    lower.includes("near me") ||
    lower.includes("which city") ||
    lower.includes("cities") ||
    lower.includes("located") ||
    lower.includes("where are") ||
    message.includes("どこ") ||
    message.includes("場所") ||
    message.includes("住所") ||
    message.includes("拠点") ||
    message.includes("アクセス")
  ) {
    if (cmsCentres && cmsCentres.length > 0) {
      const dynamicList = cmsCentres
        .map(
          (c) =>
            `📍 **${c.name}** (${c.cityName || "India"}${c.stateName ? `, ${c.stateName}` : ""}):\n   - Address: ${c.address || "Contact for address"}\n   - Phone: ${c.phone || "+91-92679 19281"} | Email: ${c.email || "info@ijcc.in"}\n   - Coordinator: ${c.coordinatorName || "IJCC Academic Desk"}`
        )
        .join("\n\n");

      return isJa
        ? `JESDC（日印日本語教育・スキル開発センター）の開校拠点一覧：\n\n${dynamicList}\n\n🌐 各センターの見学・お問い合わせは [ijcc.in/jesdc-centres](https://www.ijcc.in/jesdc-centres) をご覧ください。`
        : `JESDC currently operates active centres across India:\n\n${dynamicList}\n\n🌐 **Explore & Book a Visit**: [ijcc.in/jesdc-centres](https://www.ijcc.in/jesdc-centres) | 📞 **Helpline**: +91-92679 19281`;
    }

    return isJa
      ? `JESDCの主な拠点一覧：\n\n📍 **デリーセンター（NCR）**: 3rd Floor, D-21 Corporate Park, Sector 21, Dwarka, New Delhi - 110077\n📞 +91-92679 19281 | del@ijcc.in\n\n📍 **コルカタセンター（東インド）**: 5th Floor, Infinity Benchmark, Sector V, Salt Lake, Kolkata - 700091\n📞 +91-92679 19281 | ccu@ijcc.in\n\n📍 **パトナセンター（ビハール）**: 2nd Floor, Maurya Centre, Fraser Road, Patna - 800001\n📞 +91-92679 19281 | pat@ijcc.in\n\n🌐 [ijcc.in/jesdc-centres](https://www.ijcc.in/jesdc-centres)`
      : `JESDC centres are active in 3 major regional hubs:\n\n📍 **Delhi JESDC Centre (NCR Hub)**:\n3rd Floor, D-21 Corporate Park, Sector 21, Dwarka, New Delhi - 110077\n📞 +91-92679 19281 | ✉️ del@ijcc.in\n\n📍 **Kolkata JESDC Centre (Eastern India Hub)**:\n5th Floor, Infinity Benchmark, Block EP & GP, Sector V, Salt Lake, Kolkata - 700091\n📞 +91-92679 19281 | ✉️ ccu@ijcc.in\n\n📍 **Patna JESDC Centre (Bihar & Regional Hub)**:\n2nd Floor, Maurya Centre, Fraser Road, Near Dak Bungalow, Patna - 800001\n📞 +91-92679 19281 | ✉️ pat@ijcc.in\n\n🌐 **Visit Page**: [ijcc.in/jesdc-centres](https://www.ijcc.in/jesdc-centres)`;
  }

  // 3. INTENT: Programs, Courses, Curriculum, What is taught
  if (
    lower.includes("program") ||
    lower.includes("course") ||
    lower.includes("curriculum") ||
    lower.includes("syllabus") ||
    lower.includes("what do you teach") ||
    lower.includes("jlpt") ||
    lower.includes("titp") ||
    lower.includes("ssw") ||
    lower.includes("blue collar") ||
    lower.includes("n5") ||
    lower.includes("n4") ||
    lower.includes("n3") ||
    lower.includes("n2") ||
    lower.includes("n1") ||
    message.includes("プログラム") ||
    message.includes("コース") ||
    message.includes("カリキュラム") ||
    message.includes("授業内容") ||
    message.includes("特定技能")
  ) {
    return isJa
      ? `JESDCで提供している5つの専門日本語・スキル教育プログラム：\n\n1. **特定技能（SSW）・技能実習（TITP）向け日本語**: 現場会話力（Kaiwa）、安全規則、介護・外食・建設・製造業の専門語彙、就労ビザ対策。\n2. **大学生向け日本語**: JLPT N5〜N3取得、漢字・語彙、日系グローバル企業への就職面接対策。\n3. **ビジネスプロフェッショナル・IT技術者向け日本語**: 敬語・ビジネスメール、クライアント商談、日本現地赴任準備。\n4. **日本留学・大学院進学準備コース**: 日本の大学進学を目指すアカデミック日本語、EJU試験、JLPT N2/N1対策。\n5. **大学進学・奨学金相談**: 文部科学省（MEXT）国費奨学金、JASSO支援、出願書類（SOP）指導。\n\n🌐 詳細情報：[ijcc.in/jesdc-centres](https://www.ijcc.in/jesdc-centres)`
      : `JESDC offers 5 specialized, industry-accredited training programs across all centres:\n\n1. **SSW / TITP Japanese (Blue-Collar & Technical Interns)**: Practical workplace conversational fluency (Kaiwa), job-specific vocabulary (caregiving, manufacturing, hospitality, construction), and Japan work visa clearance.\n2. **Japanese for University Students**: JLPT N5 to N3 certification preparation, reading, writing (Kanji, Hiragana, Katakana), and interview prep for Japanese MNCs.\n3. **Japanese for Professionals (IT & Non-IT)**: Business Japanese (Keigo), client communications, professional email drafting, and on-site deployment readiness for IT firms.\n4. **Japanese for Further Studies**: Academic Japanese preparation for students aspiring for undergraduate or masters programs in Japanese universities (EJU & N2/N1 pathway).\n5. **University Admission Assistance**: Complete guidance on Japanese Government MEXT scholarships, university selection, and student visa processing.\n\n🌐 **Full Details**: [ijcc.in/jesdc-centres](https://www.ijcc.in/jesdc-centres) | 📞 **Helpline**: +91-92679 19281`;
  }

  // 4. INTENT: College / Institutional Partnerships, Open a Centre
  if (
    lower.includes("college") ||
    lower.includes("university") ||
    lower.includes("open a centre") ||
    lower.includes("open a center") ||
    lower.includes("partner") ||
    lower.includes("affiliation") ||
    lower.includes("accredit") ||
    lower.includes("franchise") ||
    message.includes("提携") ||
    message.includes("大学") ||
    message.includes("開校") ||
    message.includes("パートナー")
  ) {
    return isJa
      ? `教育機関（大学・カレッジ・専門学校）向け JESDC 提携センター開設について：\n\nインド全国の大学や専門機関は、印日商工会議所（IJCC）と提携し、キャンパス内に公認の「JESDC日本語教育センター」を開設できます！\n\n**提携の主なメリット**：\n- IJCC公認カリキュラムと公式教材の提供\n- 教員研修（TOT）およびネイティブ講師の定期指導\n- JLPT / NAT-TEST試験対策の実施\n- 日系企業および日本現地企業への就職・インターン連携\n\n提携のご相談は [ijcc.in/jesdc-centres](https://www.ijcc.in/jesdc-centres) の「Partner with Us」セクション、または info@ijcc.in までお問い合わせください。`
      : `Universities, colleges, and polytechnics across India can partner with IJCC to establish an accredited **JESDC Centre** on their campus!\n\n**Institutional Benefits**:\n- **Official Accreditation**: Use the IJCC brand and industry-approved curriculum.\n- **Certified Faculty & Training**: Training of Trainers (TOT) and guest masterclasses by native Japanese Senseis.\n- **JLPT / NAT-TEST Training**: Comprehensive exam prep lab on campus.\n- **Placement Cell Linkages**: Direct hiring connections with Japanese companies in India and Japan.\n\nTo apply for institutional affiliation, visit: [ijcc.in/jesdc-centres](https://www.ijcc.in/jesdc-centres) and click **"Partner with Us"**, or write to us at **info@ijcc.in** / call **+91-92679 19281**.`;
  }

  // 5. INTENT: Fees, Pricing, Costs, Scholarships
  if (
    lower.includes("fee") ||
    lower.includes("cost") ||
    lower.includes("price") ||
    lower.includes("how much") ||
    lower.includes("charge") ||
    lower.includes("scholarship") ||
    lower.includes("mext") ||
    message.includes("費用") ||
    message.includes("料金") ||
    message.includes("学費") ||
    message.includes("奨学金")
  ) {
    return isJa
      ? `JESDCの受講料および奨学金について：\n\n- **無料カウンセリング**: 初回の進路相談およびレベル診断オリエンテーションは**完全無料**です。\n- **受講料**: コース（特定技能、一般大学生、社会人ITコース）および受講形式（平日集中 / 週末）によって異なります。\n- **奨学金サポート**: 日本の文部科学省（MEXT）国費外国人留学生奨学金およびJASSO支援の獲得指導を行っています。\n\n詳しい料金表や現在の募集枠については、お電話（+91-92679 19281）または [ijcc.in/jesdc-centres](https://www.ijcc.in/jesdc-centres) よりお問い合わせください。`
      : `JESDC Course Fees & Scholarship Information:\n\n- **Free Orientation Counselling**: The initial skill counselling and level assessment session is **100% complimentary (Free)**!\n- **Course Fees**: Fees vary depending on the chosen program (SSW / TITP vocational track, University student JLPT batch, or Professional Keigo course) and duration.\n- **Scholarship Support**: We guide eligible candidates on Japanese government **MEXT scholarships** and financial aid options.\n\n📞 For exact fee details and batch availability, call our coordinator at **+91-92679 19281** or book counselling at [ijcc.in/jesdc-centres](https://www.ijcc.in/jesdc-centres).`;
  }

  // 6. INTENT: Batches, Timings, Schedules
  if (
    lower.includes("batch") ||
    lower.includes("timing") ||
    lower.includes("schedule") ||
    lower.includes("when does it start") ||
    lower.includes("seat") ||
    lower.includes("weekend") ||
    lower.includes("weekday") ||
    message.includes("日程") ||
    message.includes("時間") ||
    message.includes("スケジュール")
  ) {
    return isJa
      ? `JESDCの開講日程・スケジュール：\n\n- **週末クラス**: 土曜・日曜（社会人および大学生向け、午前・午後枠）\n- **平日レギュラークラス**: 月曜〜金曜（特定技能・TITP集中コース）\n- **開講時間**: 各センター月〜土 9:00 AM 〜 6:00 PM\n\n現在、デリー、コルカタ、パトナ各センターで新規バッチの受講生を受付中です（少人数制：1クラス15〜20名限定）。\n\n🌐 空席確認・ご予約：[ijcc.in/jesdc-centres](https://www.ijcc.in/jesdc-centres) | 📞 +91-92679 19281`
      : `JESDC Batch Schedules & Timings:\n\n- **Weekend Batches**: Saturday & Sunday (Morning & Afternoon tracks tailored for college students and working professionals)\n- **Weekday Regular Batches**: Monday to Friday intensive sessions (ideal for SSW / TITP technical interns)\n- **Centre Operating Hours**: Monday to Saturday, 9:00 AM - 6:00 PM\n\nAdmissions are currently open for upcoming batches across Delhi, Kolkata, and Patna with limited batch sizes (15–20 students per classroom) to ensure personalized Sensei attention.\n\n🌐 **Reserve your seat**: [ijcc.in/jesdc-centres](https://www.ijcc.in/jesdc-centres) | 📞 **Helpline**: +91-92679 19281`;
  }

  // 7. INTENT: Contact Information, Phone, Helpline, Email
  if (
    lower.includes("phone") ||
    lower.includes("call") ||
    lower.includes("number") ||
    lower.includes("helpline") ||
    lower.includes("whatsapp") ||
    lower.includes("email") ||
    lower.includes("contact") ||
    message.includes("電話") ||
    message.includes("連絡") ||
    message.includes("メール")
  ) {
    return isJa
      ? `IJCC / JESDC 公式連絡先窓口：\n\n📞 **公式総合ヘルプライン / WhatsApp**: +91-92679 19281\n✉️ **公式代表メール**: info@ijcc.in\n\n📍 **各センター直接メール**:\n- デリーセンター: del@ijcc.in\n- コルカタセンター: ccu@ijcc.in\n- パトナセンター: pat@ijcc.in\n\n🌐 公式サイト: [ijcc.in](https://www.ijcc.in) | [ijcc.in/contact](https://www.ijcc.in/contact)`
      : `Official IJCC & JESDC Contact Details:\n\n📞 **Central Helpline / WhatsApp**: +91-92679 19281\n✉️ **Official Email**: info@ijcc.in\n\n📍 **Centre Direct Desks**:\n- **Delhi Centre**: del@ijcc.in\n- **Kolkata Centre**: ccu@ijcc.in\n- **Patna Centre**: pat@ijcc.in\n\n🌐 **Website**: [ijcc.in](https://www.ijcc.in) | **Contact Page**: [ijcc.in/contact](https://www.ijcc.in/contact)`;
  }

  // 8. INTENT: Events & Seminars (Dynamic from Sanity CMS)
  if (
    lower.includes("event") ||
    lower.includes("seminar") ||
    lower.includes("workshop") ||
    lower.includes("webinar") ||
    lower.includes("tour") ||
    lower.includes("business tour") ||
    message.includes("イベント") ||
    message.includes("セミナー")
  ) {
    if (cmsEvents && cmsEvents.length > 0) {
      const eventsList = cmsEvents
        .slice(0, 3)
        .map((e) => `🗓️ **${e.title}** (${e.date ? new Date(e.date).toLocaleDateString("en-IN") : "Upcoming"}) — ${e.location || "Hybrid"}`)
        .join("\n");
      return isJa
        ? `IJCCの最新イベント・セミナー（CMSリアルタイム更新）:\n\n${eventsList}\n\n詳細および参加登録は [ijcc.in/events](https://www.ijcc.in/events) をご覧ください。`
        : `Here are IJCC's latest events from our active calendar:\n\n${eventsList}\n\nFor registrations and event schedules, visit: [ijcc.in/events](https://www.ijcc.in/events).`;
    }
    return dict.events;
  }

  // 9. INTENT: Membership, Corporate Tiers, Pricing
  if (
    lower.includes("member") ||
    lower.includes("membership") ||
    lower.includes("pricing") ||
    lower.includes("corporate tier") ||
    lower.includes("join ijcc") ||
    message.includes("会員") ||
    message.includes("メンバー") ||
    message.includes("入会")
  ) {
    return isJa
      ? `IJCC（印日商工会議所）の会員制度について：\n\n会員には限定ネットワーキングイベントへの優先参加、会員企業ディレクトリへの掲載、貿易促進支援、日印有力ビジネスパートナーの紹介などの特典がございます。\n\n会員種別（法人会員、アソシエイト会員、MSME/スタートアップ会員等）や詳細な料金については [ijcc.in/pricing](https://www.ijcc.in/pricing) をご覧ください。お申し込みは [ijcc.in/contact](https://www.ijcc.in/contact) から承っております。`
      : `IJCC Membership benefits include access to exclusive networking dinners, inclusion in the bilateral business directory, B2B partner introductions, trade facilitation, and market intelligence reports.\n\nWe offer Corporate, Associate, MSME/Startup, and Institutional tiers.\n\nTo view fee structures and apply online, visit: [ijcc.in/pricing](https://www.ijcc.in/pricing) or fill out the inquiry form at [ijcc.in/contact](https://www.ijcc.in/contact).`;
  }

  // 10. INTENT: Trade, Investment, Bilateral Business
  if (
    lower.includes("trade") ||
    lower.includes("import") ||
    lower.includes("export") ||
    lower.includes("invest") ||
    lower.includes("business with japan") ||
    lower.includes("market entry") ||
    message.includes("貿易") ||
    message.includes("ビジネス") ||
    message.includes("進出")
  ) {
    return isJa
      ? `日印両国は、自動車、電子機器、医薬品、インフラなど多岐にわたる分野で200億ドルを超える強固な二国間貿易関係を築いています。IJCCはパートナー紹介、市場調査、現地規制・法務ガイダンス、両国市場への進出支援を総合的に提供しています。`
      : `India and Japan share strong bilateral trade ties exceeding $20B across automotive, electronics, chemicals, and infrastructure. IJCC facilitates high-level introductions, provides market intelligence, and helps businesses navigate trade regulations, partnerships, and market entry in both nations.`;
  }

  // 11. GENERAL / JESDC FALLBACK
  if (
    lower.includes("jesdc") ||
    lower.includes("japanese") ||
    lower.includes("language") ||
    message.includes("JESDC") ||
    message.includes("日本語")
  ) {
    return dict.jesdc;
  }

  return dict.default;
}

async function callGemini(
  messages: { role: string; content: string }[],
  apiKey: string,
  systemPrompt: string
): Promise<string | null> {
  const contents = messages.map((m) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.content }],
  }));

  const modelsToTry = ["gemini-1.5-flash", "gemini-2.0-flash"];

  for (const model of modelsToTry) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 600,
              topP: 0.9,
            },
          }),
          signal: AbortSignal.timeout(5000),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      } else {
        const errText = await response.text();
        if (response.status === 400 || response.status === 403 || errText.includes("API key not valid")) {
          return null;
        }
      }
    } catch {
      return null;
    }
  }

  return null;
}

export async function POST(req: NextRequest) {
  let lastUserMessage = "";
  let language = "en";

  let body: any = {};
  try {
    const raw = await req.text();
    if (raw && raw.trim()) {
      try {
        body = JSON.parse(raw);
      } catch {
        try {
          body = JSON.parse(raw.replace(/\\"/g, '"'));
        } catch {
          body = {};
        }
      }
    }
  } catch {
    body = {};
  }

  const messages: { role: string; content: string }[] = body?.messages || [];
  language = body?.language || "en";

  // Fetch live CMS data across all pages (cached 2 mins in memory)
  const { knowledgeText: dynamicCmsKnowledge, centres: cmsCentres, events: cmsEvents } =
    await getDynamicCmsKnowledge();

  if (messages.length === 0) {
    return NextResponse.json({
      text: getFallbackResponse("", language, cmsCentres, cmsEvents),
    });
  }

  lastUserMessage = messages[messages.length - 1]?.content || "";

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const systemPrompt = getSystemPrompt(language, lastUserMessage, dynamicCmsKnowledge);

    // Try Gemini AI if a key is provided
    let text: string | null = null;
    if (apiKey && apiKey.trim() !== "" && apiKey !== "your_gemini_api_key_here") {
      try {
        text = await callGemini(messages, apiKey.trim(), systemPrompt);
      } catch {
        text = null;
      }
    }

    // If Gemini succeeded, return AI response
    if (text) {
      return NextResponse.json({ text });
    }

    // Seamlessly provide live Sanity CMS-powered bilingual response
    return NextResponse.json({
      text: getFallbackResponse(lastUserMessage, language, cmsCentres, cmsEvents),
    });
  } catch (error: any) {
    console.warn("[Chat API] Handled gracefully:", error?.message);
    return NextResponse.json({
      text: getFallbackResponse(lastUserMessage, language, cmsCentres, cmsEvents),
    });
  }
}

