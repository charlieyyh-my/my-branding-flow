// Single source of truth for the app navigation, shared by the desktop
// sidebar (Nav) and the mobile drawer (MobileNav).
export interface NavLink {
  href: string;
  label: string;
  icon: string;
}

export const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Dashboard", icon: "📊" },
  { href: "/calendar", label: "Content Calendar", icon: "🗓️" },
  { href: "/content", label: "Content Items", icon: "✍️" },
  { href: "/campaigns", label: "Campaigns", icon: "🎯" },
  { href: "/themes", label: "Weekly Themes", icon: "🧭" },
  { href: "/assets", label: "Asset Library", icon: "🖼️" },
  { href: "/keywords", label: "SEO Keywords", icon: "🔍" },
  { href: "/leads", label: "Leads & Enquiries", icon: "📨" },
  { href: "/guidelines", label: "Brand Guidelines", icon: "📐" },
  { href: "/audit", label: "Audit Log", icon: "🧾" },
];

export function isActivePath(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}
