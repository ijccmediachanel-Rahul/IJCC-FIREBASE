import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

// In-memory server cache to avoid redundant API calls
const serverCache = new Map<string, string>();

async function translateWithGoogle(text: string, target = "ja"): Promise<string> {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${target}&dt=t&q=${encodeURIComponent(
    text
  )}`;
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`Google translate failed: ${res.statusText}`);
  const data = await res.json();
  if (Array.isArray(data) && Array.isArray(data[0])) {
    const translated = data[0].map((chunk: any) => chunk[0]).join("");
    return translated;
  }
  throw new Error("Invalid Google translate response format");
}

async function translateWithGemini(texts: string[], target = "ja"): Promise<Record<string, string>> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY;
  if (!apiKey) return {};

  const prompt = `You are an expert bilingual Japanese-English translator for the Indo-Japan Chamber of Commerce.
Translate the following English business strings into natural, professional, polite Japanese.
If an input is a personal name with "Mr." or "Ms." or "Dr.", transliterate the name cleanly into Katakana and append "氏" (or "博士" for Dr.).
For example: "Mr. Palash Sen" -> "パラッシュ・セン氏".
Return a JSON object where the keys are the exact original English strings, and values are the Japanese translations.
Do NOT include markdown fences, just valid JSON.

Inputs to translate:
${JSON.stringify(texts, null, 2)}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 2000,
        },
      }),
    }
  );

  if (!response.ok) return {};
  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  const cleaned = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    return {};
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const texts: string[] = Array.isArray(body?.texts)
      ? body.texts.filter((t: any) => typeof t === "string" && t.trim().length > 0)
      : typeof body?.text === "string" && body.text.trim().length > 0
      ? [body.text]
      : [];

    const target = body?.target || "ja";
    if (texts.length === 0) {
      return NextResponse.json({ translations: {} });
    }

    const results: Record<string, string> = {};
    const uncached: string[] = [];

    for (const t of texts) {
      const cacheKey = `${target}:${t.trim()}`;
      if (serverCache.has(cacheKey)) {
        results[t] = serverCache.get(cacheKey)!;
      } else {
        uncached.push(t);
      }
    }

    if (uncached.length > 0) {
      // 1. Try Google translate in parallel
      const googlePromises = uncached.map(async (text) => {
        try {
          // Normalize Mr.Name without space (e.g. Mr.Palash Sen -> Mr. Palash Sen)
          const normalized = text.replace(/^(Mr\.|Ms\.|Dr\.)([^\s])/i, "$1 $2");
          const res = await translateWithGoogle(normalized, target);
          if (res) {
            results[text] = res;
            serverCache.set(`${target}:${text.trim()}`, res);
          }
        } catch {
          // Failed with Google, will try Gemini
        }
      });

      await Promise.all(googlePromises);

      // 2. Any still missing, fallback to Gemini
      const stillMissing = uncached.filter((t) => !results[t]);
      if (stillMissing.length > 0) {
        try {
          const geminiResults = await translateWithGemini(stillMissing, target);
          for (const [k, v] of Object.entries(geminiResults)) {
            if (v) {
              results[k] = v;
              serverCache.set(`${target}:${k.trim()}`, v);
            }
          }
        } catch (err) {
          console.warn("Gemini batch translation error:", err);
        }
      }
    }

    return NextResponse.json({ translations: results });
  } catch (err) {
    console.error("Translation route error:", err);
    return NextResponse.json({ translations: {}, error: "Translation failed" }, { status: 500 });
  }
}
