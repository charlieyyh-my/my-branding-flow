"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
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

export function Nav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="flex flex-col gap-0.5">
      {LINKS.map((l) => {
        const active = isActive(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
              active
                ? "bg-[var(--brand-red)] text-white"
                : "text-stone-700 hover:bg-stone-100"
            }`}
          >
            <span aria-hidden>{l.icon}</span>
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
