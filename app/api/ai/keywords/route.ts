import { NextResponse } from "next/server";
import { getBrandGuidelines, getSeoKeywords } from "@/lib/data";
import { generateText } from "@/lib/ai";
import { TEMPLATE_KEYWORDS, type KeywordSuggestion } from "@/lib/keyword-template";

// AI SEO/keyword idea generation. Provider chain → free template fallback.
export const dynamic = "force-dynamic";

function normalisePriority(p: unknown): "high" | "medium" | "low" {
  const v = String(p ?? "").toLowerCase();
  return v === "high" || v === "low" ? v : "medium";
}

export async function POST(request: Request) {
  let topic = "";
  try {
    const body = await request.json();
    topic = (body?.topic ?? "").trim();
  } catch {
    // topic is optional
  }

  const [guidelines, existing] = await Promise.all([
    getBrandGuidelines(),
    getSeoKeywords(),
  ]);
  const brandContext = guidelines.data
    .map((g) => `${g.section_title}: ${g.content ?? ""}`)
    .join("\n");
  const have = existing.data.map((k) => k.keyword.toLowerCase());

  const system = [
    "You are an SEO strategist for Century Mark Pacific, the only authorised Moutai importer in Malaysia.",
    "Suggest search keywords a Malaysian buyer might use to find authorised, genuine Moutai — for product discovery, corporate gifting, and trust/authenticity.",
    "Return ONLY a JSON array (no markdown, no prose) of up to 8 objects with exactly these keys:",
    '{"keyword": string, "category": string, "priority": "high"|"medium"|"low"}',
    "Keep keywords concrete and search-like (3–6 words). Do not invent prices or false claims.",
    brandContext ? `\nBrand context:\n${brandContext}` : "",
  ].join("\n");

  const user = [
    topic ? `Focus area: ${topic}` : "Focus: general brand + product discovery.",
    have.length ? `Avoid duplicating these existing keywords: ${have.join(", ")}` : "",
    "\nReturn the JSON array now.",
  ]
    .filter(Boolean)
    .join("\n");

  const result = await generateText(system, user, { maxTokens: 1200 });

  if (result?.text) {
    const parsed = parseKeywords(result.text);
    const fresh = parsed.filter((k) => !have.includes(k.keyword.toLowerCase()));
    if (fresh.length) {
      return NextResponse.json({ keywords: fresh.slice(0, 8), source: result.source });
    }
  }

  const fallback = TEMPLATE_KEYWORDS.filter(
    (k) => !have.includes(k.keyword.toLowerCase()),
  ).slice(0, 8);
  return NextResponse.json({
    keywords: fallback.length ? fallback : TEMPLATE_KEYWORDS.slice(0, 8),
    source: "template",
  });
}

function parseKeywords(text: string): KeywordSuggestion[] {
  // Strip any ```json fences the model may add, then parse the first array.
  const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  const start = cleaned.indexOf("[");
  const end = cleaned.lastIndexOf("]");
  if (start === -1 || end === -1 || end <= start) return [];
  try {
    const arr = JSON.parse(cleaned.slice(start, end + 1));
    if (!Array.isArray(arr)) return [];
    return arr
      .filter((x) => x && typeof x.keyword === "string" && x.keyword.trim())
      .map((x) => ({
        keyword: String(x.keyword).trim().slice(0, 120),
        category: String(x.category ?? "").trim().slice(0, 60) || "general",
        priority: normalisePriority(x.priority),
      }));
  } catch {
    return [];
  }
}
