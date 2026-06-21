// RoleHeader composed component (D-Exp-04; UI-SPEC §Components/RoleHeader
// lines 463-495).
//
// Renders the `Title — Company` body line + `Dates — Location` caption line
// for a single work role inside ExperienceBlock. Two STACKED elements (not
// flex-baseline) — line 1 is always body+500 Sans, line 2 is always Mono
// caption with tabular-nums + --color-ink-muted, REGARDLESS of viewport.
//
// Em-dash separator is U+2014 (`—`) with single space each side, wrapped in
// <span aria-hidden="true"> so screen readers don't announce "em-dash" twice
// per role (matches ExternalLink's `↗` glyph treatment from Phase 1).
//
// FWD + Tax Analyst locations are populated in src/content/experience.ts so
// this primitive renders both halves unconditionally. If a future role
// ships with an empty `location`, the meta line still reads cleanly — the
// em-dash + empty trailing string is acceptable, but real content should
// always carry a location per D-Exp-04.
//
// <h3> keeps the heading outline coherent: <h1> hero on / → <h2> via
// NumberedHeading in Section → <h3> per role.
//
// Server Component (no client-island directive). No event handlers.

type RoleHeaderProps = {
  title: string;
  company: string;
  dates: string;
  location: string;
};

export function RoleHeader({
  title,
  company,
  dates,
  location,
}: RoleHeaderProps) {
  return (
    <header className="mb-4">
      <h3 className="text-[length:var(--text-body)] leading-[var(--leading-body)] font-medium text-[color:var(--color-ink)]">
        {title} <span aria-hidden="true">—</span> {company}
      </h3>
      <p className="mt-1 font-mono text-[length:var(--text-caption)] leading-[var(--leading-caption)] text-[color:var(--color-ink-muted)] tabular-nums">
        {location ? (
          <>
            {dates} <span aria-hidden="true">—</span> {location}
          </>
        ) : (
          dates
        )}
      </p>
    </header>
  );
}
