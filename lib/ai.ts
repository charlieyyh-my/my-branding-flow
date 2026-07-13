import Anthropic from "@anthropic-ai/sdk";

// Shared server-side text generation with a provider chain:
// Claude (ANTHROPIC_API_KEY) → Gemini free tier (GEMINI_API_KEY) → null.
// Keys are read from env and never leave the server. Returns null when no
// provider is configured or all fail, so callers fall back to templates.

const GEMINI_MODELS = [
  "gemini-flash-latest",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function withClaude(
  apiKey: string,
  system: string,
  user: string,
  maxTokens: number,
): Promise<string> {
  const client = new Anthropic({ apiKey });
  const response = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: maxTokens,
    system,
    messages: [{ role: "user", content: user }],
  });
  return response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();
}

async function withGemini(
  apiKey: string,
  system: string,
  user: string,
  maxTokens: number,
): Promise<string> {
  const requestBody = JSON.stringify({
    systemInstruction: { parts: [{ text: system }] },
    contents: [{ role: "user", parts: [{ text: user }] }],
    // thinkingBudget: 0 keeps 2.5-flash from spending the token budget on
    // hidden reasoning, which previously truncated the visible output.
    generationConfig: {
      maxOutputTokens: maxTokens,
      temperature: 0.9,
      thinkingConfig: { thinkingBudget: 0 },
    },
  });
  const requestBodyNoThinking = JSON.stringify({
    systemInstruction: { parts: [{ text: system }] },
    contents: [{ role: "user", parts: [{ text: user }] }],
    generationConfig: { maxOutputTokens: maxTokens, temperature: 0.9 },
  });

  let lastErr = "";
  for (const model of GEMINI_MODELS) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      let res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        { method: "POST", headers: { "Content-Type": "application/json" }, body: requestBody },
      );
      // Some models reject thinkingConfig → retry once without it.
      if (res.status === 400) {
        res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: requestBodyNoThinking,
          },
        );
      }
      if (res.ok) {
        const data = await res.json();
        const parts = data?.candidates?.[0]?.content?.parts ?? [];
        const text = parts
          .map((p: { text?: string }) => p.text ?? "")
          .join("")
          .trim();
        if (text) return text;
        lastErr = `${model}: empty`;
        break;
      }
      lastErr = `${model}: ${res.status} ${(await res.text()).slice(0, 100)}`;
      if (res.status === 503 && attempt < 3) {
        await sleep(1200 * attempt);
        continue;
      }
      break;
    }
  }
  throw new Error(`Gemini failed. ${lastErr}`);
}

export async function generateText(
  system: string,
  user: string,
  opts?: { maxTokens?: number },
): Promise<{ text: string; source: string } | null> {
  const maxTokens = opts?.maxTokens ?? 2048;

  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const text = await withClaude(
        process.env.ANTHROPIC_API_KEY,
        system,
        user,
        maxTokens,
      );
      if (text) return { text, source: "claude-haiku-4-5" };
    } catch (e) {
      console.error("Claude generation failed:", e);
    }
  }

  if (process.env.GEMINI_API_KEY) {
    try {
      const text = await withGemini(
        process.env.GEMINI_API_KEY,
        system,
        user,
        maxTokens,
      );
      if (text) return { text, source: "gemini" };
    } catch (e) {
      console.error("Gemini generation failed:", e);
    }
  }

  return null;
}
