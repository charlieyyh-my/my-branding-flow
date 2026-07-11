import Link from "next/link";
import { isConfigured } from "@/lib/supabase/server";
import { createKeyword } from "@/lib/actions";
import { KeywordForm } from "@/components/KeywordForm";
import { PageHeader, Card, ConfigNotice } from "@/components/ui";

export const dynamic = "force-dynamic";

export default function NewKeywordPage() {
  return (
    <div>
      <PageHeader
        title="Add Keyword"
        action={
          <Link href="/keywords" className="btn-secondary">
            ← Back
          </Link>
        }
      />
      {!isConfigured() ? (
        <ConfigNotice />
      ) : (
        <Card className="max-w-2xl">
          <KeywordForm action={createKeyword} />
        </Card>
      )}
    </div>
  );
}
