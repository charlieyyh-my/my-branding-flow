import { NextResponse } from "next/server";
import { getBrandGuidelines } from "@/lib/data";
import { buildTemplateCaption } from "@/lib/caption-template";
import { generateText } from "@/lib/ai";

// AI caption drafting (docs/AGENTIC_LAYER.md — low-risk `draft_caption`).
// Uses the shared provider chain, then a free local template fallback so the
// button always returns a caption.
export const dynamic = "force-dynamic";

const PLATFORM_GUIDE: Record<string, string> = {
  Facebook:
    "Facebook: conversational and community-minded. 1–2 short paragraphs. A few relevant hashtags at most. A gentle call to action is welcome.",
  Instagram:
    "Instagram: punchy hook on the first line, then a short body of 2–4 sentences. Use tasteful emoji and 6–10 relevant hashtags at the end.",
  Rednote:
    "Rednote (小红书 / Xiaohongshu): warm, personal, first-person 'sharing a find' tone. Short lines, emoji, and 3–6 topic hashtags. Lifestyle and authenticity forward.",
};

export async function POST(request: Request) {
  let body: {
    title?: string;
    platform?: string;
    brief?: string;
    instructions?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const title = (body.title ?? "").trim();
  const platform = (body.platform ?? "Instagram").trim();
  const brief = (body.brief ?? "").trim();
  const instructions = (body.instructions ?? "").trim().slice(0, 300);

  if (!title && !brief) {
    return NextResponse.json(
      { error: "Add a title or some copy first so there’s something to work with." },
      { status: 400 },
    );
  }

  const guidelines = await getBrandGuidelines();
  const brandContext = guidelines.data
    .map((g) => `${g.section_title}: ${g.content ?? ""}`)
    .join("\n");

  const system = [
    "You are a brand copywriter for Century Mark Pacific, the only authorised Moutai importer in Malaysia.",
    "Write ONE complete social media caption: an opening hook, a short body of 2–4 sentences, a call to action, then relevant hashtags on the last line.",
    "Match the brand voice and messaging pillars below exactly. Do not invent facts, prices, or claims. Authentic, warm, trustworthy — never salesy.",
    "Return ONLY the caption text — no preamble, no explanation, no surrounding quotation marks.",
    brandContext ? `\nBrand guidelines:\n${brandContext}` : "",
  ].join("\n");

  const user = [
    `Channel: ${platform}`,
    PLATFORM_GUIDE[platform] ? `Channel style — ${PLATFORM_GUIDE[platform]}` : "",
    title ? `Post title: ${title}` : "",
    brief ? `Brief / draft copy to work from:\n${brief}` : "",
    instructions ? `Adjustment requested — apply this: ${instructions}` : "",
    "\nWrite the full caption now.",
  ]
    .filter(Boolean)
    .join("\n");

  const result = await generateText(system, user, { maxTokens: 1600 });
  if (result?.text) {
    return NextResponse.json({ caption: result.text, source: result.source });
  }

  const caption = buildTemplateCaption({ title, platform, brief });
  return NextResponse.json({ caption, source: "template" });
}
