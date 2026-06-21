// UsesEntry primitive (D-Uses-02, USES-02, UI-SPEC §Components/UsesEntry lines 593-614).
//
// Single `<li>` entry for the `/uses` page. Bold name + decorative em-dash +
// one-line rationale. The smallest new component added in Phase 2 — composed
// only by `src/app/uses/page.tsx` inside a parent `<ul className="space-y-3">`
// per category Section (one category Section per UsesCategory).
//
// The em-dash glyph is U+2014 (`—`), wrapped in `aria-hidden="true"` so screen
// readers don't announce "em-dash" once per entry — same convention as
// ExternalLink.tsx lines 60-67 (`↗`), RoleHeader, and EducationItem.
//
// `font-medium` (weight 500) is the only "bold" weight in the system (matches
// NumberedHeading.tsx line 29). The minimal-render shape mirrors Tag.tsx —
// no icons, no chips, no nested elements beyond the two spans.
//
// Server Component (no client-island directive). No event handlers.
type UsesEntryProps = {
  name: string;
  rationale: string;
};

export function UsesEntry({ name, rationale }: UsesEntryProps) {
  return (
    <li className="text-[length:var(--text-body)] leading-[var(--leading-body)] text-[color:var(--color-ink)]">
      <span className="font-medium">{name}</span>{" "}
      <span aria-hidden="true">—</span> {rationale}
    </li>
  );
}
