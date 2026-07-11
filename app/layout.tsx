import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "BrandOS — Century Mark Pacific",
  description:
    "Plan, create, approve, publish, and track branded content across every platform.",
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
          <aside className="hidden w-64 shrink-0 flex-col border-r border-stone-200 bg-white p-4 md:flex">
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
            <header className="flex items-center justify-between border-b border-stone-200 bg-white px-4 py-3 md:hidden">
              <span className="font-bold text-stone-900">BrandOS</span>
            </header>
            <main className="mx-auto w-full max-w-6xl flex-1 p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
