import { NextResponse } from "next/server";
import { getBrandGuidelines } from "@/lib/data";
import { generateText } from "@/lib/ai";

// AI drafting for a weekly theme's guiding message. Provider chain → template.
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let themeName = "";
  let campaign = "";
  try {
    const body = await request.json();
    themeName = (body?.themeName ?? "").trim();
    campaign = (body?.campaign ?? "").trim();
  } catch {
    // fields optional
  }

  if (!themeName) {
    return NextResponse.json(
      { error: "Add a theme name first so there’s something to work with." },
      { status: 400 },
    );
  }

  const guidelines = await getBrandGuidelines();
  const brandContext = guidelines.data
    .map((g) => `${g.section_title}: ${g.content ?? ""}`)
    .join("\n");

  const system = [
    "You write internal 'guiding message' statements for a content team at Century Mark Pacific, the only authorised Moutai importer in Malaysia.",
    "A guiding message is ONE or TWO sentences that tell the team the single idea every post for the week should reinforce.",
    "Speak to the team, not to customers. Be concrete and on-brand. Do not invent facts or prices.",
    "Return ONLY the guiding message text — no preamble, no quotation marks.",
    brandContext ? `\nBrand context:\n${brandContext}` : "",
  ].join("\n");

  const user = [
    `Weekly theme: ${themeName}`,
    campaign ? `Part of campaign: ${campaign}` : "",
    "\nWrite the guiding message now.",
  ]
    .filter(Boolean)
    .join("\n");

  const result = await generateText(system, user, { maxTokens: 400 });
  if (result?.text) {
    return NextResponse.json({ message: result.text, source: result.source });
  }

  const message = `This week, every post should reinforce “${themeName}” — remind the audience that Century Mark Pacific is the only authorised Moutai importer in Malaysia, and that authenticity and heritage are guaranteed in every bottle.`;
  return NextResponse.json({ message, source: "template" });
}
