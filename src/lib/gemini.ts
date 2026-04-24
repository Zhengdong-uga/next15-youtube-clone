import "server-only";

const GEMINI_API = "https://generativelanguage.googleapis.com/v1beta/models";
const DEFAULT_MODEL = "gemini-2.0-flash";

interface GeminiTextOptions {
  systemPrompt: string;
  userPrompt: string;
  model?: string;
}

/**
 * Minimal Gemini text-generation helper using the REST API
 * (so it works identically inside or outside an Upstash workflow).
 */
export async function generateGeminiText({
  systemPrompt,
  userPrompt,
  model = DEFAULT_MODEL,
}: GeminiTextOptions): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

  const res = await fetch(
    `${GEMINI_API}/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      }),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini API error (${res.status}): ${text}`);
  }

  const json = (await res.json()) as {
    candidates?: {
      content?: { parts?: { text?: string }[] };
    }[];
  };

  const text = json.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!text) throw new Error("Gemini returned empty response");
  return text;
}
