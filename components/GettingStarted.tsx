import Link from "next/link";

interface Step {
  title: string;
  plain: string;
  cta: string;
  href: string;
  done: boolean;
}

export function GettingStarted({
  hasContent,
  hasReviewed,
  hasPublished,
  hasLead,
}: {
  hasContent: boolean;
  hasReviewed: boolean;
  hasPublished: boolean;
  hasLead: boolean;
}) {
  const steps: Step[] = [
    {
      title: "Write your first post",
      plain:
        "Pick a channel — Facebook, Instagram, or Rednote — and type what you want to say.",
      cta: "Write a post",
      href: "/content/new",
      done: hasContent,
    },
    {
      title: "Send it for review",
      plain:
        "Open your post and move it from Draft to In Review so a manager can check it.",
      cta: "Go to my posts",
      href: "/content",
      done: hasReviewed,
    },
    {
      title: "Approve, then publish",
      plain:
        "When it looks good, mark it Approved, then Published and paste the live link.",
      cta: "Open the calendar",
      href: "/calendar",
      done: hasPublished,
    },
    {
      title: "Log an enquiry",
      plain:
        "Someone messaged you about a post? Save them as a lead so you can follow up.",
      cta: "Add a lead",
      href: "/leads/new",
      done: hasLead,
    },
  ];

  const nextIndex = steps.findIndex((s) => !s.done);
  const allDone = nextIndex === -1;
  const doneCount = steps.filter((s) => s.done).length;

  return (
    <section className="card overflow-hidden">
      <div
        className="flex flex-wrap items-center justify-between gap-3 p-5"
        style={{
          background:
            "linear-gradient(90deg, rgba(214,69,69,0.14), rgba(214,185,95,0.08))",
        }}
      >
        <div>
          <h2 className="text-lg font-bold text-[var(--ink)]">
            {allDone ? "You’ve got the hang of it 🎉" : "Let’s post your first content 👋"}
          </h2>
          <p className="mt-0.5 text-sm text-[var(--ink-soft)]">
            {allDone
              ? "You’ve done a full round. Keep the momentum — write your next post."
              : "Four simple steps. Each one takes about a minute."}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--ink-soft)]">
          <span>{doneCount}/4 done</span>
          <div className="h-2 w-24 overflow-hidden rounded-full bg-[var(--surface-2)]">
            <div
              className="h-full rounded-full"
              style={{
                width: `${(doneCount / 4) * 100}%`,
                background: "var(--brand-gold)",
              }}
            />
          </div>
        </div>
      </div>

      <ol className="divide-y divide-[var(--border)]">
        {steps.map((s, i) => {
          const isNext = i === nextIndex;
          return (
            <li
              key={s.title}
              className={`flex flex-wrap items-center gap-4 p-4 sm:flex-nowrap ${
                isNext ? "bg-[var(--surface-2)]" : ""
              }`}
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                style={
                  s.done
                    ? { background: "var(--brand-gold)", color: "#1b1b1b" }
                    : isNext
                      ? { background: "var(--brand-red)", color: "#fff" }
                      : {
                          background: "var(--surface-2)",
                          color: "var(--ink-soft)",
                          border: "1px solid var(--border)",
                        }
                }
              >
                {s.done ? "✓" : i + 1}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p
                    className={`font-semibold ${
                      s.done ? "text-[var(--ink-soft)]" : "text-[var(--ink)]"
                    }`}
                  >
                    {s.title}
                  </p>
                  {isNext ? (
                    <span
                      className="pulse-soft rounded-full px-2 py-0.5 text-[11px] font-bold"
                      style={{ background: "var(--brand-red)", color: "#fff" }}
                    >
                      Do this next
                    </span>
                  ) : null}
                </div>
                <p className="mt-0.5 text-sm text-[var(--ink-soft)]">{s.plain}</p>
              </div>

              <Link
                href={s.href}
                className={`shrink-0 ${isNext ? "btn-primary" : "btn-secondary"}`}
              >
                {s.cta} →
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
