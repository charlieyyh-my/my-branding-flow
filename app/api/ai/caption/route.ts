import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getBrandGuidelines } from "@/lib/data";

// AI caption drafting (docs/AGENTIC_LAYER.md — low-risk `draft_caption`).
// Runs server-side only; ANTHROPIC_API_KEY is never sent to the browser.
export const dynamic = "force-dynamic";

const PLATFORM_GUIDE: Record<string, string> = {
  Facebook:
    "Facebook: conversational and community-minded. 1–2 short paragraphs. A few relevant hashtags at most. A gentle call to action is welcome.",
  Instagram:
    "Instagram: punchy hook on the first line, then a short body. Use tasteful emoji and 5–10 relevant hashtags at the end.",
  Rednote:
    "Rednote (小红书 / Xiaohongshu): warm, personal, first-person 'sharing a find' tone. Short lines, emoji, and 3–6 topic hashtags. Lifestyle and authenticity forward.",
};

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "AI drafting isn’t set up yet. Add ANTHROPIC_API_KEY in Vercel → Settings → Environment Variables, then redeploy.",
      },
      { status: 400 },
    );
  }

  let body: {
    title?: string;
    platform?: string;
    brief?: string;
  };
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
      { error: "Add a title or some copy first so the AI has something to work with." },
      { status: 400 },
    );
  }

  // Pull brand voice + messaging pillars so the caption stays on-brand.
  const guidelines = await getBrandGuidelines();
  const brandContext = guidelines.data
    .map((g) => `${g.section_title}: ${g.content ?? ""}`)
    .join("\n");

  const client = new Anthropic({ apiKey });

  const system = [
    "You are a brand copywriter for Century Mark Pacific, the only authorised Moutai importer in Malaysia.",
    "Write a single social media caption. Match the brand voice and messaging pillars below exactly.",
    "Do not invent facts, prices, or claims. Keep it authentic, warm, and trustworthy — never salesy.",
    "Return ONLY the caption text — no preamble, no explanation, no quotation marks around it.",
    brandContext ? `\nBrand guidelines:\n${brandContext}` : "",
  ].join("\n");

  const userMsg = [
    `Channel: ${platform}`,
    PLATFORM_GUIDE[platform] ? `Channel style — ${PLATFORM_GUIDE[platform]}` : "",
    title ? `Post title: ${title}` : "",
    brief ? `Brief / draft copy to work from:\n${brief}` : "",
    "\nWrite the caption now.",
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 600,
      system,
      messages: [{ role: "user", content: userMsg }],
    });

    const caption = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();

    if (!caption) {
      return NextResponse.json(
        { error: "The AI returned an empty draft. Try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({ caption, source: "claude-haiku-4-5" });
  } catch (e) {
    const message = e instanceof Error ? e.message : "AI request failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
