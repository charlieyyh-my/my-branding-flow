import Link from "next/link";
import { getSeoKeywords } from "@/lib/data";
import {
  PageHeader,
  StatusBadge,
  EmptyState,
  ErrorState,
  ConfigNotice,
} from "@/components/ui";

export const dynamic = "force-dynamic";

const PRIORITY_RANK: Record<string, number> = { high: 0, medium: 1, low: 2 };

export default async function KeywordsPage() {
  const keywords = await getSeoKeywords();
  const sorted = [...keywords.data].sort(
    (a, b) =>
      (PRIORITY_RANK[a.priority ?? "medium"] ?? 1) -
      (PRIORITY_RANK[b.priority ?? "medium"] ?? 1),
  );

  return (
    <div>
      <PageHeader
        title="SEO & AI Search Keywords"
        subtitle="The keyword bank, ranked by priority."
        action={
          <Link href="/keywords/new" className="btn-primary">
            + Add Keyword
          </Link>
        }
      />

      {!keywords.configured ? (
        <ConfigNotice />
      ) : keywords.error ? (
        <ErrorState message={keywords.error} />
      ) : sorted.length === 0 ? (
        <EmptyState
          title="No keywords yet"
          hint="Build your keyword bank to guide content and SEO."
          action={
            <Link href="/keywords/new" className="btn-primary">
              + Add Keyword
            </Link>
          }
        />
      ) : (
        <>
          {/* Mobile: stacked cards */}
          <div className="space-y-3 md:hidden">
            {sorted.map((k) => (
              <Link
                key={k.id}
                href={`/keywords/${k.id}`}
                className="card block p-4 transition active:bg-[var(--surface-2)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 font-medium text-[var(--ink)]">
                    {k.keyword}
                  </div>
                  <StatusBadge value={k.priority} />
                </div>
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[var(--ink-soft)]">
                  {k.category ? <span>{k.category}</span> : null}
                  {k.target_url ? <span className="text-[var(--brand-red)]">has target</span> : null}
                </div>
                {k.notes ? (
                  <div className="mt-1 text-xs text-[var(--ink-faint)]">{k.notes}</div>
                ) : null}
              </Link>
            ))}
          </div>

          {/* Desktop / tablet: table */}
          <div className="card hidden overflow-x-auto md:block">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="thead-warm border-b border-[var(--border-warm)] text-left text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 font-medium">Keyword</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Priority</th>
                <th className="px-4 py-3 font-medium">Target</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-warm)]">
              {sorted.map((k) => (
                <tr key={k.id} className="row-hover">
                  <td className="px-4 py-3">
                    <Link
                      href={`/keywords/${k.id}`}
                      className="font-medium text-[var(--ink)] hover:text-[var(--brand-red)]"
                    >
                      {k.keyword}
                    </Link>
                    {k.notes ? (
                      <div className="text-xs text-[var(--ink-faint)]">{k.notes}</div>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-[var(--ink-soft)]">
                    {k.category ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge value={k.priority} />
                  </td>
                  <td className="px-4 py-3">
                    {k.target_url ? (
                      <a
                        href={k.target_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[var(--brand-red)] underline"
                      >
                        link
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
