import Link from "next/link";
import { notFound } from "next/navigation";
import { getLead } from "@/lib/data";
import { updateLead, deleteLead } from "@/lib/actions";
import { LeadForm } from "@/components/LeadForm";
import { DeleteButton } from "@/components/DeleteButton";
import {
  PageHeader,
  Card,
  StatusBadge,
  ConfigNotice,
  ErrorState,
} from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const leadRes = await getLead(id);

  if (!leadRes.configured) {
    return (
      <div>
        <PageHeader title="Lead" />
        <ConfigNotice />
      </div>
    );
  }
  if (leadRes.error) {
    return (
      <div>
        <PageHeader title="Lead" />
        <ErrorState message={leadRes.error} />
      </div>
    );
  }
  const lead = leadRes.data;
  if (!lead) notFound();

  return (
    <div>
      <PageHeader
        title={lead.contact_name || "Lead"}
        subtitle={lead.company ?? undefined}
        action={
          <div className="flex items-center gap-3">
            <StatusBadge value={lead.status} />
            <Link href="/leads" className="btn-secondary">
              ← All leads
            </Link>
          </div>
        }
      />
      <div className="max-w-2xl space-y-6">
        <Card>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-stone-500">
            Edit lead
          </h2>
          <LeadForm action={updateLead} lead={lead} />
        </Card>
        <Card>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-500">
            Danger zone
          </h2>
          <form action={deleteLead}>
            <input type="hidden" name="id" value={lead.id} />
            <DeleteButton
              label="Delete lead"
              confirm={`Delete lead "${lead.contact_name}"?`}
            />
          </form>
        </Card>
      </div>
    </div>
  );
}
