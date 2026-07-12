import Link from "next/link";
import { getLeads } from "@/lib/data";
import {
  PageHeader,
  StatusBadge,
  EmptyState,
  ErrorState,
  ConfigNotice,
} from "@/components/ui";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const leads = await getLeads();

  return (
    <div>
      <PageHeader
        title="Leads & Enquiries"
        subtitle="Every enquiry logged, with follow-up status."
        action={
          <Link href="/leads/new" className="btn-primary">
            + New Lead
          </Link>
        }
      />

      {!leads.configured ? (
        <ConfigNotice />
      ) : leads.error ? (
        <ErrorState message={leads.error} />
      ) : leads.data.length === 0 ? (
        <EmptyState
          icon="📨"
          title="No enquiries yet"
          hint="Add your first lead."
          action={
            <Link href="/leads/new" className="btn-primary">
              + New Lead
            </Link>
          }
        />
      ) : (
        <>
          {/* Mobile: stacked cards */}
          <div className="space-y-3 md:hidden">
            {leads.data.map((l) => (
              <Link
                key={l.id}
                href={`/leads/${l.id}`}
                className="card block p-4 transition active:bg-[var(--surface-2)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-medium text-stone-900">
                      {l.contact_name || "—"}
                    </div>
                    {l.company ? (
                      <div className="text-xs text-stone-500">{l.company}</div>
                    ) : null}
                  </div>
                  <StatusBadge value={l.status} />
                </div>
                <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-stone-500">
                  {l.source ? <span>{l.source}</span> : null}
                  {l.follow_up_date ? (
                    <span>Follow-up {formatDate(l.follow_up_date)}</span>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>

          {/* Desktop / tablet: table */}
          <div className="card hidden overflow-x-auto md:block">
            <table className="w-full min-w-[680px] text-sm">
              <thead className="thead-warm border-b border-[var(--border-warm)] text-left text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Company</th>
                <th className="px-4 py-3 font-medium">Source</th>
                <th className="px-4 py-3 font-medium">Follow-up</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-warm)]">
              {leads.data.map((l) => (
                <tr key={l.id} className="row-hover">
                  <td className="px-4 py-3">
                    <Link
                      href={`/leads/${l.id}`}
                      className="font-medium text-stone-900 hover:text-[var(--brand-red)]"
                    >
                      {l.contact_name || "—"}
                    </Link>
                    {l.enquiry_type ? (
                      <div className="text-xs text-stone-400">
                        {l.enquiry_type}
                      </div>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-stone-600">{l.company || "—"}</td>
                  <td className="px-4 py-3 text-stone-600">{l.source || "—"}</td>
                  <td className="px-4 py-3 text-stone-600">
                    {formatDate(l.follow_up_date)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge value={l.status} />
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
