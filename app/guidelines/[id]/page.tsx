import Link from "next/link";
import { notFound } from "next/navigation";
import { getBrandGuidelines } from "@/lib/data";
import { updateGuideline, deleteGuideline } from "@/lib/actions";
import { GuidelineForm } from "@/components/GuidelineForm";
import { DeleteButton } from "@/components/DeleteButton";
import { PageHeader, Card, ConfigNotice, ErrorState } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function GuidelineDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const guidelines = await getBrandGuidelines();

  if (!guidelines.configured) {
    return (
      <div>
        <PageHeader title="Guideline" />
        <ConfigNotice />
      </div>
    );
  }
  if (guidelines.error) {
    return (
      <div>
        <PageHeader title="Guideline" />
        <ErrorState message={guidelines.error} />
      </div>
    );
  }
  const guideline = guidelines.data.find((g) => g.id === id);
  if (!guideline) notFound();

  return (
    <div>
      <PageHeader
        title={`Edit — ${guideline.section_title}`}
        action={
          <Link href="/guidelines" className="btn-secondary">
            ← All guidelines
          </Link>
        }
      />
      <div className="max-w-2xl space-y-6">
        <Card>
          <GuidelineForm action={updateGuideline} guideline={guideline} />
        </Card>
        <Card>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-500">
            Danger zone
          </h2>
          <form action={deleteGuideline}>
            <input type="hidden" name="id" value={guideline.id} />
            <DeleteButton
              label="Delete section"
              confirm={`Delete guideline "${guideline.section_title}"?`}
            />
          </form>
        </Card>
      </div>
    </div>
  );
}
