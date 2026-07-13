// Zero-cost keyword suggestions used when no AI provider key is configured.
export interface KeywordSuggestion {
  keyword: string;
  category: string;
  priority: "high" | "medium" | "low";
}

export const TEMPLATE_KEYWORDS: KeywordSuggestion[] = [
  { keyword: "authorised Moutai importer Malaysia", category: "brand authority", priority: "high" },
  { keyword: "genuine Moutai Feitian Malaysia", category: "trust/authenticity", priority: "high" },
  { keyword: "Moutai corporate gift Malaysia", category: "lead generation", priority: "high" },
  { keyword: "buy Moutai online Malaysia", category: "product discovery", priority: "high" },
  { keyword: "Moutai CNY gift set", category: "seasonal", priority: "medium" },
  { keyword: "Chinese baijiu Malaysia", category: "category awareness", priority: "medium" },
  { keyword: "Moutai price Malaysia", category: "product discovery", priority: "medium" },
  { keyword: "luxury baijiu gifting", category: "positioning", priority: "medium" },
  { keyword: "Moutai 1935 Malaysia", category: "product discovery", priority: "low" },
  { keyword: "how to tell genuine Moutai", category: "trust/authenticity", priority: "low" },
];
