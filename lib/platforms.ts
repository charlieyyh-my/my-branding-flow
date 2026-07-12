// Shared per-channel styling for the three focus platforms.
export interface PlatformMeta {
  color: string; // solid brand colour for dots / accents
  mark: string; // short glyph shown in the badge dot
  chip: string; // tailwind classes for the pill background/text/border
}

export const PLATFORM_META: Record<string, PlatformMeta> = {
  Facebook: {
    color: "#1877F2",
    mark: "f",
    chip: "bg-[#eef4ff] text-[#1877F2] border-[#d7e6ff]",
  },
  Instagram: {
    color: "#C13584",
    mark: "◎",
    chip: "bg-[#fdeef6] text-[#c13584] border-[#f6d3e6]",
  },
  Rednote: {
    color: "#FF2442",
    mark: "小",
    chip: "bg-[#fff0f1] text-[#ff2442] border-[#ffd4d9]",
  },
};

export function platformColor(platform?: string | null): string {
  return (platform && PLATFORM_META[platform]?.color) || "#d6ccb8";
}
