// MetricCallout primitive (D-Metric-01..03, UI-SPEC §Components/MetricCallout).
//
// Big-number poster: value (Geist Mono, tabular-nums, --color-ink) + label
// (Geist Mono caption, --color-ink-muted). Used on every ProjectCard
// (`scale="card"`) and every /projects/[slug] detail page (`scale="detail"`).
//
// The value clamp expressions are inlined as `text-[length:clamp(...)]`
// arbitrary values per UI-SPEC line 108 — no new font-size token is added
// to globals.css. The contract budget (5 sizes / 2 weights) holds.
//
// Server Component (no client-island directive). No event handlers.
import type { ReactNode } from "react";

type MetricCalloutProps = {
  value: string;
  label: string;
  scale?: "card" | "detail";
};

export function MetricCallout({
  value,
  label,
  scale = "card",
}: MetricCalloutProps): ReactNode {
  const valueSize =
    scale === "detail"
      ? "text-[length:clamp(36px,1.5rem+3vw,48px)]"
      : "text-[length:clamp(28px,1.25rem+2vw,40px)]";

  return (
    <div className="my-6">
      <div
        className={`font-mono font-medium tracking-[-0.01em] tabular-nums ${valueSize} text-[color:var(--color-ink)]`}
      >
        {value}
      </div>
      <div className="mt-1 font-mono text-[length:var(--text-caption)] text-[color:var(--color-ink-muted)]">
        {label}
      </div>
    </div>
  );
}
