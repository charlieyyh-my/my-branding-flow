import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <div className="text-4xl">🔎</div>
      <h1 className="text-xl font-semibold text-stone-800">Not found</h1>
      <p className="text-sm text-stone-500">
        That record doesn’t exist or may have been deleted.
      </p>
      <Link href="/" className="btn-primary">
        Back to dashboard
      </Link>
    </div>
  );
}
