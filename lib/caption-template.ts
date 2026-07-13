// Zero-cost caption drafting. Produces an on-brand starting caption from the
// post title, channel, any notes, and the brand pillars — no API key required.
// Used as the always-available fallback when no AI provider key is configured.

const HASHTAGS: Record<string, string[]> = {
  Facebook: ["#Moutai", "#CenturyMarkPacific", "#AuthorisedImporter"],
  Instagram: [
    "#Moutai",
    "#Feitian",
    "#CenturyMarkPacific",
    "#MalaysiaAuthorised",
    "#Baijiu",
    "#LuxuryGifting",
  ],
  Rednote: ["#Moutai", "#茅台", "#正品", "#马来西亚", "#送礼"],
};

const CTA: Record<string, string> = {
  Facebook: "Message us to enquire about authorised Moutai for your next occasion.",
  Instagram: "DM us to enquire. Authorised. Authentic. Only from Century Mark Pacific.",
  Rednote: "私信我们了解正品茅台 — 马来西亚唯一授权进口商。",
};

const OPENER: Record<string, string> = {
  Facebook: "",
  Instagram: "✨ ",
  Rednote: "📕 ",
};

function cleanTitle(title: string): string {
  // Drop trailing "— Instagram Carousel" style channel/format suffixes.
  return title.split("—")[0].split("-")[0].trim() || title.trim();
}

function firstSentence(text: string): string {
  const t = text.trim();
  if (!t) return "";
  const m = t.match(/^.*?[.!?](\s|$)/);
  return (m ? m[0] : t).trim();
}

export function buildTemplateCaption(input: {
  title?: string;
  platform?: string;
  brief?: string;
  brandPillars?: string;
}): string {
  const platform = input.platform && HASHTAGS[input.platform] ? input.platform : "Instagram";
  const hook = cleanTitle(input.title ?? "") || "Only the authorised choice";
  const briefLine = firstSentence(input.brief ?? "");

  const heritage =
    "Every bottle carries the seal of the only authorised Moutai importer in Malaysia — 2,000 years of baijiu heritage, guaranteed authentic.";

  const lines: string[] = [];
  lines.push(`${OPENER[platform]}${hook}`);
  lines.push("");
  if (briefLine && briefLine.toLowerCase() !== hook.toLowerCase()) {
    lines.push(briefLine);
    lines.push("");
  }
  lines.push(heritage);
  lines.push("");
  lines.push(CTA[platform]);
  lines.push("");
  lines.push(HASHTAGS[platform].join(" "));

  return lines.join("\n").trim();
}
