import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getBrandGuidelines } from "@/lib/data";
import { buildTemplateCaption } from "@/lib/caption-template";

// AI caption drafting (docs/AGENTIC_LAYER.md — low-risk `draft_caption`).
// Provider chain, all server-side: Claude (ANTHROPIC_API_KEY) → Gemini free
// tier (GEMINI_API_KEY) → free local template. The button always returns a
// caption, so it works with no key and upgrades automatically when one is set.
export const dynamic = "force-dynamic";

const PLATFORM_GUIDE: Record<string, string> = {
  Facebook:
    "Facebook: conversational and community-minded. 1–2 short paragraphs. A few relevant hashtags at most. A gentle call to action is welcome.",
  Instagram:
    "Instagram: punchy hook on the first line, then a short body. Use tasteful emoji and 5–10 relevant hashtags at the end.",
  Rednote:
    "Rednote (小红书 / Xiaohongshu): warm, personal, first-person 'sharing a find' tone. Short lines, emoji, and 3–6 topic hashtags. Lifestyle and authenticity forward.",
};

function buildPrompts(
  title: string,
  platform: string,
  brief: string,
  brandContext: string,
) {
  const system = [
    "You are a brand copywriter for Century Mark Pacific, the only authorised Moutai importer in Malaysia.",
    "Write a single social media caption. Match the brand voice and messaging pillars below exactly.",
    "Do not invent facts, prices, or claims. Keep it authentic, warm, and trustworthy — never salesy.",
    "Return ONLY the caption text — no preamble, no explanation, no quotation marks around it.",
    brandContext ? `\nBrand guidelines:\n${brandContext}` : "",
  ].join("\n");

  const user = [
    `Channel: ${platform}`,
    PLATFORM_GUIDE[platform] ? `Channel style — ${PLATFORM_GUIDE[platform]}` : "",
    title ? `Post title: ${title}` : "",
    brief ? `Brief / draft copy to work from:\n${brief}` : "",
    "\nWrite the caption now.",
  ]
    .filter(Boolean)
    .join("\n");

  return { system, user };
}

async function draftWithClaude(
  apiKey: string,
  system: string,
  user: string,
): Promise<string> {
  const client = new Anthropic({ apiKey });
  const response = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 600,
    system,
    messages: [{ role: "user", content: user }],
  });
  return response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();
}

async function draftWithGemini(
  apiKey: string,
  system: string,
  user: string,
): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts: [{ text: user }] }],
        generationConfig: { maxOutputTokens: 600, temperature: 0.9 },
      }),
    },
  );
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Gemini ${res.status}: ${detail.slice(0, 200)}`);
  }
  const data = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts ?? [];
  return parts
    .map((p: { text?: string }) => p.text ?? "")
    .join("")
    .trim();
}

export async function POST(request: Request) {
  let body: { title?: string; platform?: string; brief?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const title = (body.title ?? "").trim();
  const platform = (body.platform ?? "Instagram").trim();
  const brief = (body.brief ?? "").trim();

  if (!title && !brief) {
    return NextResponse.json(
      {
        error:
          "Add a title or some copy first so there’s something to work with.",
      },
      { status: 400 },
    );
  }

  const guidelines = await getBrandGuidelines();
  const brandContext = guidelines.data
    .map((g) => `${g.section_title}: ${g.content ?? ""}`)
    .join("\n");

  const { system, user } = buildPrompts(title, platform, brief, brandContext);

  // 1) Claude, if configured.
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const caption = await draftWithClaude(
        process.env.ANTHROPIC_API_KEY,
        system,
        user,
      );
      if (caption) return NextResponse.json({ caption, source: "claude-haiku-4-5" });
    } catch (e) {
      console.error("Claude caption failed, falling through:", e);
    }
  }

  // 2) Gemini free tier, if configured.
  if (process.env.GEMINI_API_KEY) {
    try {
      const caption = await draftWithGemini(
        process.env.GEMINI_API_KEY,
        system,
        user,
      );
      if (caption) return NextResponse.json({ caption, source: "gemini-2.0-flash" });
    } catch (e) {
      console.error("Gemini caption failed, falling through:", e);
    }
  }

  // 3) Always-available free template.
  const caption = buildTemplateCaption({ title, platform, brief, brandPillars: brandContext });
  return NextResponse.json({ caption, source: "template" });
}
