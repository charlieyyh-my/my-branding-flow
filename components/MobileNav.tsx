"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Nav } from "@/components/Nav";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the drawer whenever the route changes (i.e. after a nav tap).
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll and support Escape-to-close while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--border-warm)] bg-[var(--surface)]/95 px-4 py-3 backdrop-blur md:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="mobile-drawer"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-[var(--ink-soft)] hover:bg-[var(--surface-2)] active:bg-[var(--surface-2)]"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M4 7h16M4 12h16M4 17h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <Link href="/" className="flex items-center gap-2">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg text-base font-bold text-white"
            style={{ background: "var(--brand-red)" }}
          >
            B
          </span>
          <span className="font-bold text-[var(--ink)]">BrandOS</span>
        </Link>

        {/* Spacer to keep the logo centred against the 40px button */}
        <span className="h-10 w-10" aria-hidden />
      </header>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-stone-900/40 transition-opacity md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
        aria-hidden
      />

      {/* Drawer */}
      <aside
        id="mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-[var(--border-warm)] bg-[var(--surface)] p-4 shadow-xl transition-transform duration-200 md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <span
              className="flex h-9 w-9 items-center justify-center rounded-lg text-lg font-bold text-white"
              style={{ background: "var(--brand-red)" }}
            >
              B
            </span>
            <div className="leading-tight">
              <div className="text-sm font-bold text-[var(--ink)]">BrandOS</div>
              <div className="text-xs text-[var(--ink-soft)]">Century Mark Pacific</div>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--ink-soft)] hover:bg-[var(--surface-2)]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto">
          <Nav onNavigate={() => setOpen(false)} />
        </div>
        <div className="mt-auto px-2 pt-6 text-xs text-[var(--ink-faint)]">
          v1 · Demo mode (no login)
        </div>
      </aside>
    </>
  );
}
