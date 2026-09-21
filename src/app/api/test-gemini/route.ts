import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return new Response(JSON.stringify({ 
      status: "ERROR", 
      message: "GEMINI_API_KEY is not set in environment variables" 
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: "Say hello in one word" }] }]
        }),
      }
    );
    const data = await response.json();
    if (!response.ok) {
      return new Response(JSON.stringify({ 
        status: "ERROR", 
        httpStatus: response.status,
        geminiError: data 
      }), { status: 200, headers: { "Content-Type": "application/json" } });
    }
    return new Response(JSON.stringify({ 
      status: "OK", 
      message: "Gemini is working correctly",
      response: data?.candidates?.[0]?.content?.parts?.[0]?.text 
    }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ 
      status: "ERROR", 
      message: error instanceof Error ? error.message : "Unknown error" 
    }), { status: 200, headers: { "Content-Type": "application/json" } });
  }
}
