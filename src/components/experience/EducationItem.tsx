// EducationItem composed component (D-Exp-01; UI-SPEC §Components/EducationItem
// lines 534-563).
//
// Single-row education entry: program (font-medium body) · institution (body)
// on the left; dates (mono caption + tabular-nums + --color-ink-muted) on the
// right. Stacks vertically at 375px (`flex-col`), flushes horizontally at ≥md
// (`md:flex-row md:items-baseline md:justify-between`).
//
// Middle-dot separator (`·`) is U+00B7 with single space each side. The
// program + institution share a single visible color (--color-ink) so the
// medium-weight program reads as the headline credential without the
// institution fading; the dates carry the only --color-ink-muted treatment.
//
// Composed inside `02. Experience` under the work-role hairline.
//
// Server Component (no client-island directive). No event handlers.

type EducationItemProps = {
  program: string;
  institution: string;
  dates: string;
};

export function EducationItem({
  program,
  institution,
  dates,
}: EducationItemProps) {
  return (
    <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between md:gap-4">
      <div className="text-[length:var(--text-body)] leading-[var(--leading-body)]">
        <span className="font-medium text-[color:var(--color-ink)]">
          {program}
        </span>
        <span className="text-[color:var(--color-ink)]"> · {institution}</span>
      </div>
      <div className="font-mono text-[length:var(--text-caption)] text-[color:var(--color-ink-muted)] tabular-nums">
        {dates}
      </div>
    </div>
  );
}
