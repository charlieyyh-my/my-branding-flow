"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface ToastItem {
  id: number;
  msg: string;
}

// Fire a toast from anywhere on the client: toast("Saved").
export function toast(msg: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("brandos:toast", { detail: msg }));
  }
}

export function Toaster() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const pathname = usePathname();

  const push = useCallback((msg: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  // Server actions redirect with `?flash=…`; surface it as a toast on arrival
  // and strip it from the URL so a refresh doesn't re-show it.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const flash = params.get("flash");
    if (flash) {
      push(flash);
      params.delete("flash");
      const qs = params.toString();
      window.history.replaceState(
        {},
        "",
        window.location.pathname + (qs ? `?${qs}` : ""),
      );
    }
  }, [pathname, push]);

  // Inline (non-redirecting) saves dispatch the custom event.
  useEffect(() => {
    const handler = (e: Event) => push((e as CustomEvent<string>).detail);
    window.addEventListener("brandos:toast", handler as EventListener);
    return () =>
      window.removeEventListener("brandos:toast", handler as EventListener);
  }, [push]);

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className="pointer-events-auto flex items-center gap-2 rounded-full border border-[var(--border-warm)] bg-[var(--ink)] px-4 py-2.5 text-sm font-medium text-white shadow-lg"
        >
          <span
            className="flex h-4 w-4 items-center justify-center rounded-full text-[11px]"
            style={{ background: "var(--brand-gold)" }}
            aria-hidden
          >
            ✓
          </span>
          {t.msg}
        </div>
      ))}
    </div>
  );
}
