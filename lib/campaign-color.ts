// Deterministic, warm-palette colour per campaign so the same campaign reads
// the same colour everywhere (list, calendar refs, dashboard).
const PALETTE = [
  "#8b0000", // brand red
  "#b8862f", // gold-brown
  "#2f6f4f", // pine
  "#3b5b92", // slate blue
  "#8a5a2b", // cinnamon
  "#7a4b7e", // plum
  "#a34a3c", // terracotta
  "#4f7a8a", // teal
];

export function campaignColor(seed?: string | null): string {
  if (!seed) return "#b8a888";
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return PALETTE[h % PALETTE.length];
}
