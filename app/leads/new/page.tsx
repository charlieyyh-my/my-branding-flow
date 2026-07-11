import Link from "next/link";
import { isConfigured } from "@/lib/supabase/server";
import { createLead } from "@/lib/actions";
import { LeadForm } from "@/components/LeadForm";
import { PageHeader, Card, ConfigNotice } from "@/components/ui";

export const dynamic = "force-dynamic";

export default function NewLeadPage() {
  return (
    <div>
      <PageHeader
        title="New Lead"
        action={
          <Link href="/leads" className="btn-secondary">
            ← Back
          </Link>
        }
      />
      {!isConfigured() ? (
        <ConfigNotice />
      ) : (
        <Card className="max-w-2xl">
          <LeadForm action={createLead} />
        </Card>
      )}
    </div>
  );
}
