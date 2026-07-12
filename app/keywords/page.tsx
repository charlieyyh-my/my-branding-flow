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
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="border-b border-stone-200 bg-stone-50 text-left text-xs uppercase tracking-wide text-stone-500">
              <tr>
                <th className="px-4 py-3 font-medium">Keyword</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Priority</th>
                <th className="px-4 py-3 font-medium">Target</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {sorted.map((k) => (
                <tr key={k.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/keywords/${k.id}`}
                      className="font-medium text-stone-900 hover:text-[var(--brand-red)]"
                    >
                      {k.keyword}
                    </Link>
                    {k.notes ? (
                      <div className="text-xs text-stone-400">{k.notes}</div>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-stone-600">
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
      )}
    </div>
  );
}
