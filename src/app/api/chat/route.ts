import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const SYSTEM_PROMPT = `You are the official AI assistant for IJCC (Indo-Japan Chamber of Commerce) at ijcc.in.
Help users with membership, events, India-Japan trade, business networking, and investment opportunities.
Be professional, warm, and concise. Answer in 2-3 short paragraphs maximum.
Today: ${new Date().toDateString()}`;

const FALLBACK_RESPONSES: Record<string, string> = {
  membership: "IJCC membership gives you access to exclusive networking events, our business directory, trade facilitation support, and introductions to partners in India and Japan. To apply, please visit ijcc.in or contact us directly through the website.",
  events: "IJCC regularly organizes seminars, trade missions, networking events, and cultural programs connecting Indian and Japanese businesses. Please visit ijcc.in/events for the latest upcoming events.",
  trade: "India and Japan share strong bilateral trade ties across sectors including automobiles, electronics, pharmaceuticals, and infrastructure. IJCC facilitates introductions, provides market intelligence, and helps businesses navigate both markets.",
  japan: "IJCC helps Indian businesses expand to Japan by providing market entry guidance, partner introductions, cultural briefings, and networking with Japanese companies already operating in India.",
  india: "IJCC assists Japanese companies entering India with market research, regulatory guidance, partner matching, and connections to Indian government and industry bodies.",
  default: "Thank you for reaching out to IJCC! We are the Indo-Japan Chamber of Commerce, dedicated to strengthening business ties between India and Japan. How can I help you today? You can also reach us directly at ijcc.in.",
};

function getFallbackResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("member")) return FALLBACK_RESPONSES.membership;
  if (lower.includes("event") || lower.includes("seminar") || lower.includes("workshop")) return FALLBACK_RESPONSES.events;
  if (lower.includes("trade") || lower.includes("import") || lower.includes("export")) return FALLBACK_RESPONSES.trade;
  if (lower.includes("japan")) return FALLBACK_RESPONSES.japan;
  if (lower.includes("india")) return FALLBACK_RESPONSES.india;
  return FALLBACK_RESPONSES.default;
}

async function callGemini(messages: { role: string; content: string }[], apiKey: string): Promise<string> {
  const contents = messages.map(m => ({
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
            system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
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

  let body: any = {};
  try {
    const raw = await req.text();
    if (raw && raw.trim()) {
      try {
        body = JSON.parse(raw);
      } catch {
        // Fix bad escaped quotes from PowerShell/curl
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

  if (messages.length === 0) {
    return NextResponse.json({ text: FALLBACK_RESPONSES.default });
  }

  lastUserMessage = messages[messages.length - 1]?.content || "";

  try {

    const apiKey = process.env.GEMINI_API_KEY;

    // If no API key, use smart fallback instead of crashing
    if (!apiKey || apiKey.trim() === "" || apiKey === "your_gemini_api_key_here") {
      console.warn("GEMINI_API_KEY not configured — using fallback responses");
      return NextResponse.json({ text: getFallbackResponse(lastUserMessage) });
    }

    // Try Gemini with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    try {
      const text = await callGemini(messages, apiKey.trim());
      clearTimeout(timeout);
      return NextResponse.json({ text });
    } catch (geminiError) {
      clearTimeout(timeout);
      console.error("Gemini failed:", geminiError);
      // Fall through to smart fallback
      return NextResponse.json({ text: getFallbackResponse(lastUserMessage) });
    }

  } catch (error) {
    console.error("Route crashed:", error);
    return NextResponse.json({
      text: getFallbackResponse(lastUserMessage),
    });
  }
}
