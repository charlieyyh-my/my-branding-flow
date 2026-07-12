// A small circular progress ring (SSR-friendly SVG; animates the stroke on
// mount via a CSS keyframe using per-instance CSS variables).
export function ProgressRing({
  done,
  total,
  size = 46,
  stroke = 5,
  color = "var(--brand-gold)",
}: {
  done: number;
  total: number;
  size?: number;
  stroke?: number;
  color?: string;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = total > 0 ? Math.min(done / total, 1) : 0;
  const target = circ * (1 - pct);

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      title={`${done} of ${total} published`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--surface-2)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          className="ring-anim"
          style={
            {
              ["--ring-from" as string]: `${circ}`,
              ["--ring-to" as string]: `${target}`,
              strokeDashoffset: target,
            } as React.CSSProperties
          }
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-[var(--ink)]">
        {Math.round(pct * 100)}%
      </div>
    </div>
  );
}
