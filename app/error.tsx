"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <div className="text-4xl">⚠️</div>
      <h1 className="text-xl font-semibold text-[var(--ink)]">Something went wrong</h1>
      <p className="max-w-md text-sm text-[var(--ink-soft)]">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <button onClick={reset} className="btn-primary">
        Try again
      </button>
    </div>
  );
}
