import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

function hasJapanese(text: string): boolean {
  return /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf]/.test(text);
}

function getSystemPrompt(language: string, userMessage: string): string {
  const isJapaneseMode = language === "ja" || hasJapanese(userMessage);

  return `You are the official AI assistant for IJCC (Indo-Japan Chamber of Commerce) at ijcc.in.
Help users with membership, events, India-Japan trade, business networking, and investment opportunities.

CRITICAL LANGUAGE INSTRUCTION:
- Current user interface language: ${language === "ja" ? "Japanese (ja)" : "English (en)"}.
${
  isJapaneseMode
    ? "- You MUST answer in natural, polite, and professional Japanese (敬語・丁寧語・「です・ます」調). If the user asked in Japanese or if the current interface language is Japanese, reply in Japanese."
    : "- You MUST answer in English unless the user explicitly writes to you in Japanese."
}
- If the user asks in Japanese, ALWAYS respond in Japanese.
- If the user asks in English while language is English, respond in English.
- Always provide helpful, accurate, and concise information about IJCC and India-Japan bilateral relations.

Be professional, warm, and concise. Answer in 2-3 short paragraphs maximum.
Today: ${new Date().toDateString()}`;
}

const FALLBACK_RESPONSES_EN: Record<string, string> = {
  membership: "IJCC membership gives you access to exclusive networking events, our business directory, trade facilitation support, and introductions to partners in India and Japan. To apply, please visit ijcc.in or contact us directly through the website.",
  events: "IJCC regularly organizes seminars, trade missions, networking events, and cultural programs connecting Indian and Japanese businesses. Please visit ijcc.in/events for the latest upcoming events.",
  trade: "India and Japan share strong bilateral trade ties across sectors including automobiles, electronics, pharmaceuticals, and infrastructure. IJCC facilitates introductions, provides market intelligence, and helps businesses navigate both markets.",
  japan: "IJCC helps Indian businesses expand to Japan by providing market entry guidance, partner introductions, cultural briefings, and networking with Japanese companies already operating in India.",
  india: "IJCC assists Japanese companies entering India with market research, regulatory guidance, partner matching, and connections to Indian government and industry bodies.",
  default: "Thank you for reaching out to IJCC! We are the Indo-Japan Chamber of Commerce, dedicated to strengthening business ties between India and Japan. How can I help you today? You can also reach us directly at ijcc.in.",
};

const FALLBACK_RESPONSES_JA: Record<string, string> = {
  membership: "IJCCの会員になると、限定ネットワーキングイベントへの参加、企業名鑑の閲覧、貿易促進サポート、日印両国の有力パートナーの紹介などをご利用いただけます。お申し込みはウェブサイト（ijcc.in）から直接お問い合わせください。",
  events: "IJCCは、日印両国の企業をつなぐセミナー、ビジネス使節団、ネットワーキングイベント、文化プログラムを定期的に開催しています。今後の最新イベントは ijcc.in/events をご覧ください。",
  trade: "日印両国は、自動車、電子機器、医薬品、インフラなど多岐にわたる分野で強固な二国間貿易関係を築いています。IJCCはパートナー紹介、市場情報の提供、両国市場への進出支援を行っています。",
  japan: "IJCCは、日本市場参入のガイダンス、現地パートナーの紹介、文化ブリーフィング、すでにインドに進出している日本企業とのネットワーキングを通じて、インド企業の日本進出を支援します。",
  india: "IJCCは、市場調査、規制・法務ガイダンス、パートナーマッチング、インド政府および業界団体との連携を通じて、日本企業のインド進出を総合的にサポートします。",
  default: "IJCC（印日商工会議所）へのお問い合わせありがとうございます！私たちはインドと日本のビジネス連携の強化に尽力しています。本日はどのようなご用件でしょうか？詳細については ijcc.in をご覧いただくか、直接ご連絡ください。",
};

function getFallbackResponse(message: string, language: string): string {
  const isJa = language === "ja" || hasJapanese(message);
  const dict = isJa ? FALLBACK_RESPONSES_JA : FALLBACK_RESPONSES_EN;
  const lower = message.toLowerCase();

  if (lower.includes("member") || message.includes("会員") || message.includes("メンバー")) return dict.membership;
  if (lower.includes("event") || lower.includes("seminar") || lower.includes("workshop") || message.includes("イベント") || message.includes("セミナー")) return dict.events;
  if (lower.includes("trade") || lower.includes("import") || lower.includes("export") || message.includes("貿易") || message.includes("ビジネス")) return dict.trade;
  if (lower.includes("japan") || message.includes("日本")) return dict.japan;
  if (lower.includes("india") || message.includes("インド")) return dict.india;
  return dict.default;
}

async function callGemini(
  messages: { role: string; content: string }[],
  apiKey: string,
  systemPrompt: string
): Promise<string> {
  const contents = messages.map((m) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.content }],
  }));

  const modelsToTry = ["gemini-flash-latest", "gemini-3.6-flash"];
  let lastError = "";

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
        }
      );

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      } else {
        lastError = await response.text();
      }
    } catch (err: any) {
      lastError = err?.message || String(err);
    }
  }

  throw new Error(`Gemini API failed: ${lastError}`);
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

  if (messages.length === 0) {
    return NextResponse.json({ text: getFallbackResponse("", language) });
  }

  lastUserMessage = messages[messages.length - 1]?.content || "";

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const systemPrompt = getSystemPrompt(language, lastUserMessage);

    // If no API key, use smart bilingual fallback instead of crashing
    if (!apiKey || apiKey.trim() === "" || apiKey === "your_gemini_api_key_here") {
      console.warn("GEMINI_API_KEY not configured — using fallback responses");
      return NextResponse.json({ text: getFallbackResponse(lastUserMessage, language) });
    }

    // Try Gemini with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    try {
      const text = await callGemini(messages, apiKey.trim(), systemPrompt);
      clearTimeout(timeout);
      return NextResponse.json({ text });
    } catch (geminiError) {
      clearTimeout(timeout);
      console.error("Gemini failed:", geminiError);
      return NextResponse.json({ text: getFallbackResponse(lastUserMessage, language) });
    }
  } catch (error) {
    console.error("Route crashed:", error);
    return NextResponse.json({
      text: getFallbackResponse(lastUserMessage, language),
    });
  }
}
