import { getAuditLogs } from "@/lib/data";
import {
  PageHeader,
  StatusBadge,
  EmptyState,
  ErrorState,
  ConfigNotice,
} from "@/components/ui";
import { formatDateTime, label } from "@/lib/format";

export const dynamic = "force-dynamic";

function summarise(oldValue: unknown, newValue: unknown): string {
  const o = oldValue as { status?: string } | null;
  const n = newValue as { status?: string; title?: string; contact_name?: string } | null;
  if (o?.status && n?.status) return `${label(o.status)} → ${label(n.status)}`;
  if (n?.title) return n.title;
  if (n?.contact_name) return n.contact_name;
  return "—";
}

export default async function AuditPage() {
  const logs = await getAuditLogs();

  return (
    <div>
      <PageHeader
        title="Audit Log"
        subtitle="Every status change and mutation, append-only."
      />

      {!logs.configured ? (
        <ConfigNotice />
      ) : logs.error ? (
        <ErrorState message={logs.error} />
      ) : logs.data.length === 0 ? (
        <EmptyState
          title="No audit entries yet"
          hint="Status changes and other mutations will appear here."
        />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="border-b border-stone-200 bg-stone-50 text-left text-xs uppercase tracking-wide text-stone-500">
              <tr>
                <th className="px-4 py-3 font-medium">When</th>
                <th className="px-4 py-3 font-medium">Actor</th>
                <th className="px-4 py-3 font-medium">Action</th>
                <th className="px-4 py-3 font-medium">Object</th>
                <th className="px-4 py-3 font-medium">Change</th>
                <th className="px-4 py-3 font-medium">Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {logs.data.map((l) => (
                <tr key={l.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3 whitespace-nowrap text-stone-500">
                    {formatDateTime(l.created_at)}
                  </td>
                  <td className="px-4 py-3 text-stone-600">{l.actor ?? "—"}</td>
                  <td className="px-4 py-3 font-medium text-stone-800">
                    {l.action}
                  </td>
                  <td className="px-4 py-3 text-stone-600">
                    {l.object_type ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-stone-600">
                    {summarise(l.old_value, l.new_value)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge value={l.risk_level} />
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
