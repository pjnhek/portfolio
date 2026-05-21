// NumberedHeading primitive (FOUND-07, FOUND-08, D-06).
//
// Renders the `01. About` pattern: Geist Mono + ink-muted number, Geist Sans +
// ink title, baseline-aligned. The literal `.` after the number lives HERE —
// callers pass `"01"`, never `"01."`.
//
// Server Component (no client-island directive). No event handlers.
import type { ReactNode } from "react";

type NumberedHeadingProps = {
  number: string;
  children: ReactNode;
  as?: "h1" | "h2";
};

export function NumberedHeading({
  number,
  children,
  as = "h2",
}: NumberedHeadingProps) {
  // Lowercase JSX identifiers are treated as HTML tags. Assign to a capitalized
  // local so React renders the dynamic tag correctly.
  const HeadingTag = as;
  return (
    <HeadingTag className="mb-8 flex items-baseline gap-2 md:mb-12">
      <span className="font-mono text-[length:var(--text-caption)] text-[color:var(--color-ink-muted)] tabular-nums">
        {number}.
      </span>
      <span className="text-[length:var(--text-heading)] font-medium tracking-[-0.01em] text-[color:var(--color-ink)]">
        {children}
      </span>
    </HeadingTag>
  );
}
