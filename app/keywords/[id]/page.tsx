import Link from "next/link";
import { notFound } from "next/navigation";
import { getSeoKeywords } from "@/lib/data";
import { updateKeyword, deleteKeyword } from "@/lib/actions";
import { KeywordForm } from "@/components/KeywordForm";
import { DeleteButton } from "@/components/DeleteButton";
import { PageHeader, Card, ConfigNotice, ErrorState } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function KeywordDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const keywords = await getSeoKeywords();

  if (!keywords.configured) {
    return (
      <div>
        <PageHeader title="Keyword" />
        <ConfigNotice />
      </div>
    );
  }
  if (keywords.error) {
    return (
      <div>
        <PageHeader title="Keyword" />
        <ErrorState message={keywords.error} />
      </div>
    );
  }
  const keyword = keywords.data.find((k) => k.id === id);
  if (!keyword) notFound();

  return (
    <div>
      <PageHeader
        title="Edit Keyword"
        action={
          <Link href="/keywords" className="btn-secondary">
            ← All keywords
          </Link>
        }
      />
      <div className="max-w-2xl space-y-6">
        <Card>
          <KeywordForm action={updateKeyword} keyword={keyword} />
        </Card>
        <Card>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--ink-soft)]">
            Danger zone
          </h2>
          <form action={deleteKeyword}>
            <input type="hidden" name="id" value={keyword.id} />
            <DeleteButton
              label="Delete keyword"
              confirm={`Delete keyword "${keyword.keyword}"?`}
            />
          </form>
        </Card>
      </div>
    </div>
  );
}
