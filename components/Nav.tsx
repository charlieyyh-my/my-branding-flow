"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS, isActivePath } from "@/components/nav-links";

export function Nav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-0.5">
      {NAV_LINKS.map((l) => {
        const active = isActivePath(pathname, l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 rounded-lg border-l-4 px-3 py-2.5 text-sm font-medium transition ${
              active
                ? "border-[var(--brand-gold)] bg-[var(--brand-red)] text-white shadow-sm"
                : "border-transparent text-[var(--ink-soft)] hover:bg-[var(--surface-2)] active:bg-[var(--surface-2)]"
            }`}
          >
            <span aria-hidden className="text-base">
              {l.icon}
            </span>
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
