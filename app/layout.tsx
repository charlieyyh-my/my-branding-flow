import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { MobileNav } from "@/components/MobileNav";

export const metadata: Metadata = {
  title: "BrandOS — Century Mark Pacific",
  description:
    "Plan, create, approve, publish, and track branded content across every platform.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="flex min-h-screen">
          <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col overflow-y-auto border-r border-[var(--border-warm)] bg-[var(--surface)] p-4 md:flex">
            <Link href="/" className="mb-6 flex items-center gap-2 px-2">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-lg text-lg font-bold text-white"
                style={{ background: "var(--brand-red)" }}
              >
                B
              </span>
              <div className="leading-tight">
                <div className="text-sm font-bold text-stone-900">BrandOS</div>
                <div className="text-xs text-stone-500">Century Mark Pacific</div>
              </div>
            </Link>
            <Nav />
            <div className="mt-auto px-2 pt-6 text-xs text-stone-400">
              v1 · Demo mode (no login)
            </div>
          </aside>

          <div className="flex min-w-0 flex-1 flex-col">
            <MobileNav />
            <main className="mx-auto w-full max-w-6xl flex-1 p-4 sm:p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
