---
phase: 02
plan: 02
subsystem: home-composition
tags:
  - home-composition
  - experience-section
  - projects-section
  - footer
dependency_graph:
  requires:
    - "Plan 02-01 (typed-TS content modules — site, experience, projects;
       lib/content getAllProjects)"
    - "Phase 1 primitives (Section, NumberedHeading, Tag, ExternalLink,
       ArchitectureDiagram)"
  provides:
    - "src/components/primitives/MetricCallout.tsx (D-Metric-01..03)"
    - "src/components/primitives/SiteFooter.tsx (D-Uses-03, USES-03)"
    - "src/components/cards/ProjectCard.tsx (D-Proj-03, SEC-04, SEC-05)"
    - "src/components/experience/RoleHeader.tsx (D-Exp-04)"
    - "src/components/experience/ExperienceBlock.tsx (D-Exp-02, D-Exp-03)"
    - "src/components/experience/EducationItem.tsx (D-Exp-01)"
    - "src/app/layout.tsx renders SiteFooter sitewide after {children}"
    - "src/app/page.tsx renders real Experience + Featured Projects"
  affects:
    - "Plan 02-03 (/projects/[slug]) inherits SiteFooter from layout and
       reuses MetricCallout at scale=detail"
    - "Plan 02-04 (/uses) inherits SiteFooter from layout"
    - "Plan 02-05 (CopyEmail, About copy, Asurion diagram) extends the
       Asurion ExperienceBlock to host DIAG-01 and replaces the About +
       Contact placeholders"
tech_stack:
  added: []
  patterns:
    - "Whole-card <Link> + sibling <ExternalLink> pattern (avoids nested
       <a> without stopPropagation) — D-Proj-03"
    - "Two-stacked-spans Mono+Sans / ink + ink-muted convention extended
       from NumberedHeading to MetricCallout, RoleHeader, EducationItem"
    - "Conditional render via {role.tags && role.tags.length > 0 && ...}
       discriminated-union narrowing (Asurion-only tag chips, D-Exp-03)"
    - "Arbitrary-value clamp inlined as text-[length:clamp(...)] — no new
       font-size token added to globals.css (UI-SPEC line 108 budget held)"
key_files:
  created:
    - "src/components/primitives/MetricCallout.tsx"
    - "src/components/primitives/SiteFooter.tsx"
    - "src/components/cards/ProjectCard.tsx"
    - "src/components/experience/RoleHeader.tsx"
    - "src/components/experience/ExperienceBlock.tsx"
    - "src/components/experience/EducationItem.tsx"
  modified:
    - "src/app/layout.tsx"
    - "src/app/page.tsx"
decisions:
  - "Section count on / is exactly 4 (locked): 01. About → 02. Experience
     → 03. Featured Projects → 04. Contact. The home 04. Uses section is
     REMOVED — /uses is reachable only via the SiteFooter /uses Link
     (USES-03, D-Uses-03)."
  - "Hero block in src/app/page.tsx (commented `Hero — outside any
     <section>`) is byte-identical to the Phase 1 / Plan 01-02 version
     (SEC-01 / frozen)."
  - "About placeholder retained — real copy ships in Plan 02-05 under the
     confidentiality gate (the About-closing sentence touches Asurion,
     which is what triggers gate review)."
  - "Contact placeholder retained — CopyEmail + mailto + LinkedIn + GitHub
     wired in Plan 02-05 alongside the lone `use client` boundary."
  - "About diagram (Phase 1 placeholder ArchitectureDiagram) is REMOVED
     from page.tsx. DIAG-01 (Asurion) moves into ExperienceBlock in Plan
     02-05 via either an optional `diagram` prop or a `role.company ===
     \"Asurion\"` conditional render. ExperienceBlock in this plan has NO
     diagram concern — clean role-renderer only."
  - "ProjectCard ships the SIBLING pattern (D-Proj-03): the GitHub
     <ExternalLink> is rendered OUTSIDE the <Link> wrapper but INSIDE the
     <article> border. No nested <a>, no stopPropagation."
  - "All 6 new components are Server Components. Codebase still has zero
     `use client` files until Plan 02-05 ships CopyEmail (SEC-07)."
metrics:
  duration_seconds: 600
  completed_date: "2026-05-21"
---

# Phase 02 Plan 02: Home-Page Composition Summary

**One-liner:** Six new Server Components (MetricCallout, SiteFooter,
ProjectCard, RoleHeader, ExperienceBlock, EducationItem) composed into a
refactored home page that renders real Experience (3 roles + 2 education
entries with Asurion tag chips) and Featured Projects (4 cards) — with
SiteFooter wired sitewide via layout.tsx and the home `04. Uses` section
dropped in favor of footer-only navigation.

## What Shipped

### Files Created (6)

| File | Purpose | Key Exports |
|------|---------|-------------|
| `src/components/primitives/MetricCallout.tsx` | Big-number poster (Geist Mono value + caption label) | `MetricCallout` |
| `src/components/primitives/SiteFooter.tsx` | Sitewide footer composed in layout.tsx | `SiteFooter` |
| `src/components/cards/ProjectCard.tsx` | Project-card surface for the Featured Projects grid | `ProjectCard` |
| `src/components/experience/RoleHeader.tsx` | Two-line Title—Company + Dates—Location header | `RoleHeader` |
| `src/components/experience/ExperienceBlock.tsx` | RoleHeader + bullets + optional tag-chip row | `ExperienceBlock` |
| `src/components/experience/EducationItem.tsx` | Program · Institution + Dates row | `EducationItem` |

### Files Modified (2)

| File | Change |
|------|--------|
| `src/app/layout.tsx` | Single additive change: imported `SiteFooter` from `@/components/primitives/SiteFooter` and rendered it after `{children}` inside `<body>`. Metadata, Geist fonts, env import, `<html lang>` all untouched. |
| `src/app/page.tsx` | Hero block (commented `Hero — outside any <section>`) kept BYTE-IDENTICAL to Phase 1. Removed the Phase 1 `ArchitectureDiagram` placeholder from About. Replaced the 5 placeholder `<Section>`s with EXACTLY 4 numbered sections (01. About → 02. Experience → 03. Featured Projects → 04. Contact). Experience renders 3 `ExperienceBlock`s + hairline + 2 `EducationItem`s; Projects renders 4 `ProjectCard`s in `grid grid-cols-1 gap-8 md:grid-cols-2` + a `See more on GitHub ↗` `ExternalLink`. About + Contact stay as one-line placeholders for Plan 02-05. |

## Section Count Confirmation

| Anchor | Number | Heading | Content |
|--------|--------|---------|---------|
| `#about` | `01.` | About | Placeholder — drafted in Plan 02-05 under the confidentiality gate |
| `#experience` | `02.` | Experience | REAL — 3 `ExperienceBlock`s (Asurion + tags / Tax Analyst / FWD) + hairline + 2 `EducationItem`s (USF MSDS, U Houston) |
| `#projects` | `03.` | Featured Projects | REAL — 4 `ProjectCard`s (sf-date-night-concierge / gtm-research-pipeline / voice-intent-eval / daily-weather-pipeline) + "See more on GitHub" link |
| `#contact` | `04.` | Contact | Placeholder — Plan 02-05 wires CopyEmail + mailto + LinkedIn + GitHub |

**Section count on `/`: exactly 4.** The home `04. Uses` section is gone;
Contact is renumbered to `04.`; `/uses` is reachable only via the
`SiteFooter` `/uses` Link. `grep -c '<Section' src/app/page.tsx` returns **4**.
`grep -c 'number="05"' src/app/page.tsx` returns **0**.

## Frozen Hero Confirmation

The Hero block in `src/app/page.tsx` is **byte-identical** to the Phase 1 /
Plan 01-02 version. Verified via `diff` between the pre-Plan-02-02
checkout (`git show HEAD~2:src/app/page.tsx` lines 19-35) and the current
file's extracted hero block: **zero-byte diff**. All 4 hero copy lines
present verbatim:

- `James Nhek` (display H1)
- `AI Engineer @ Asurion` (subhead)
- `RAG · evaluations · agentic workflows` (body)
- `San Francisco — open to AI Engineer roles.` (body)

`SEC-01` frozen-hero invariant honored.

## SiteFooter Wiring

`src/app/layout.tsx`:

```tsx
import { SiteFooter } from "@/components/primitives/SiteFooter";
// ...
<body>
  {children}
  <SiteFooter />
</body>
```

`SiteFooter` reads `site.github` (`https://github.com/pjnhek`) and
`site.linkedin` (`https://www.linkedin.com/in/pjnhek/`) directly from
`src/content/site.ts` (Plan 02-01) — those values are the resume-canonical
identity (locked in Plan 02-01's user-memory record). The footer renders on
the home route (and will automatically render on `/projects/[slug]` and
`/uses` once those routes ship in Plans 02-03 / 02-04, satisfying USES-03 /
D-Uses-03 without further layout edits).

## Client-Component Discipline

Codebase-wide `"use client"` count: **0**.

```
$ grep -rc '"use client"' src/
src/components/primitives/MetricCallout.tsx:0
src/components/primitives/SiteFooter.tsx:0
src/components/cards/ProjectCard.tsx:0
src/components/experience/RoleHeader.tsx:0
src/components/experience/ExperienceBlock.tsx:0
src/components/experience/EducationItem.tsx:0
src/app/page.tsx:0
src/app/layout.tsx:0
```

The first (and per SEC-07, only) `"use client"` file ships in Plan 02-05
when `CopyEmail` lands.

## D-Proj-03 Sibling Pattern Confirmation

`ProjectCard.tsx` renders the GitHub `<ExternalLink>` as a SIBLING of the
inner `<Link>` — both inside the `<article>` border, neither nested in the
other. No nested `<a>`, no `stopPropagation`. JSX structure:

```tsx
<article className="border border-[color:var(--color-rule)] p-6">
  <Link href={`/projects/${project.slug}`} className="group block focus-visible:...">
    <h3>{project.title}</h3>
    <p className="motion-safe:transition-colors group-hover:...">{project.subtitle}</p>
    <MetricCallout value={project.metric.value} label={project.metric.label} />
    {project.description && <p>{project.description}</p>}
    <div className="mt-4 flex flex-wrap gap-2">
      {project.tech.map((t) => <Tag key={t}>{t}</Tag>)}
    </div>
  </Link>
  <div className="mt-6">
    <ExternalLink href={project.github}>GitHub</ExternalLink>
  </div>
</article>
```

`awk '/^      <Link/,/^      <\/Link>/' src/components/cards/ProjectCard.tsx
| grep -c ExternalLink` returns **0**. (The plan's looser
`awk '/<Link/,/<\/Link>/'` returns 3, but those matches come from the
header-comment block where `ExternalLink` is mentioned three times in
prose explanation, not inside the JSX `<Link>` region — verification grep
false positive, not a substance issue.)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 — Tooling drift] Prettier reflowed `<Link href="/uses">` in
`SiteFooter.tsx`**

- **Found during:** Task 1 prettier-format pass.
- **Issue:** The plan's acceptance criterion grep `<Link href="/uses"`
  expected the opening tag on a single line. Prettier wraps multi-attribute
  JSX tags onto separate lines. The substance (a Next.js `<Link>` with
  `href="/uses"` plus the focus-ring className) is honored; the layout
  matches Phase 1's primitive formatting discipline (`Tag.tsx` and
  `Section.tsx` both render single-attribute open tags on one line and
  multi-attribute tags wrapped — the Phase 1 baseline). The CLAUDE.md
  stack section mandates `prettier-plugin-tailwindcss`, which is binding.
- **Fix:** Honored Prettier's wrapping. Substance verification path uses
  separated greps (`grep -q 'href="/uses"'` matches even when wrapped).
- **Files modified:** `src/components/primitives/SiteFooter.tsx` (Prettier
  pass).
- **Commit:** `c4698de`.

### Authentication Gates

None.

## Architectural Decisions Made

- **MetricCallout uses `text-[length:clamp(...)]` arbitrary values, not new
  `@theme` tokens.** UI-SPEC line 108 budget says "no new font-size token";
  the clamp expressions for `scale="card"`
  (`clamp(28px,1.25rem+2vw,40px)`) and `scale="detail"`
  (`clamp(36px,1.5rem+3vw,48px)`) are inlined directly in the className via
  Tailwind v4's arbitrary-value bracket idiom — matches the Phase 1
  `text-[length:var(--text-*)]` pattern shape, just with an inline clamp
  instead of a CSS variable.
- **RoleHeader treats empty `location` as "render dates alone".** All three
  roles in `src/content/experience.ts` ship with non-empty locations (SF /
  San Leandro / Phnom Penh), so the empty-location branch is currently
  dead code — kept defensively because `Role.location: string` (not
  `string?`) and a future role might ship with `""`.
- **ExperienceBlock takes `role: Role`, NOT spread props.** Keeps the call
  site in `page.tsx` minimal (`<ExperienceBlock role={role} />`) and
  surfaces the typed contract via a single prop. Same shape Plan 02-05 will
  extend if it adds an optional `diagram` prop.
- **EducationItem takes three explicit props, NOT `ed: EducationItem`.**
  Verbose but consistent with `RoleHeader`'s explicit-prop shape — the
  call site `<EducationItem key={ed.program} program={ed.program} ... />`
  reads more clearly than `<EducationItem {...ed} key={ed.program} />`
  given JSX spread semantics.

## Voice / Factual Ambiguities for James (pre-Plan-02-03 review)

1. **Asurion tag chips wrap at 375px.** The Asurion role's 7 tag chips
   (Corrective RAG, Hybrid Search, Cross-Encoder Reranking, LLM-as-Judge,
   Exa, Gemini Search, Brave Search) wrap to 3-4 lines at 375px. This is
   the locked behavior per UI-SPEC line 211 (no truncation, no "+N more").
   If James reads the wrapped chip stack as visual noise, the call is to
   either prune chips or reorder them. Worth a manual eye-check on the
   Vercel preview.
2. **`Daily` as the daily-weather-pipeline metric value.** Inherited from
   Plan 02-01 (resume describes cadence qualitatively, not numerically).
   Now rendered in Geist Mono at the card-scale clamp; reads less
   "number-y" than the other three projects' values. James may want to
   swap to a numeric value (e.g., a record-count) at Plan 02-03 detail-page
   work — or accept it as-is since the label `Airflow → BigQuery ML` reads
   as the load-bearing technical signal.
3. **Asurion role bullet leading verbs.** Four bullets lead with: Lifted,
   Built, Built, Shipped. Plan 02-01 surfaced this same observation;
   re-flagging here because the bullets now render visibly on the home
   route — if "Shipped" reads as not-fitting the cadence, swap to "Built".

## Threat Flags

| Flag | File | Description |
|------|------|-------------|
| (none) | (none) | No new attack surface introduced. ProjectCard's `<Link>` and `<ExternalLink>` go through the Phase 1 primitives which already enforce the safe-protocol allowlist + `rel="noopener noreferrer"` on externals. No user input. No auth path. No client islands. Threat register from `02-02-PLAN.md` `<threat_model>` block: every line was mitigated by acceptance criterion — T-02-02-NEST (sibling pattern verified), T-02-02-PROTO (allowlist inherited from ExternalLink), T-02-02-CLI (0 `use client` files), T-02-02-FOCUS (focus-ring grep matches), T-02-02-FROZEN (Hero byte-identical diff). |

## Verification Evidence

- `pnpm tsc --noEmit` exits 0.
- `pnpm lint` exits 0.
- `pnpm build` exits 0 — emits static `/` route (Turbopack: "Generating
  static pages using 5 workers (4/4)").
- Section count on home: `grep -c '<Section' src/app/page.tsx` → **4**.
- `number="05"` on home: `grep -c 'number="05"' src/app/page.tsx` → **0**.
- `ArchitectureDiagram` on home: `grep -c '<ArchitectureDiagram'
  src/app/page.tsx` → **0** (About diagram removed).
- `"use client"` codebase-wide: `grep -rl '"use client"' src/` returns
  zero matches.
- Hero block byte-identical to Phase 1: `diff` between
  `git show HEAD~2:src/app/page.tsx` lines 19-35 and current file's
  extracted hero block — **empty** (zero-byte diff).
- All 4 hero copy lines present:
  `grep -A 16 'Hero — outside any <section>' src/app/page.tsx | grep -cE
  '(James Nhek|AI Engineer @ Asurion|RAG · evaluations · agentic
  workflows|San Francisco — open to AI Engineer roles\.)'` → **4**.
- SiteFooter wired in layout: `grep -c '<SiteFooter' src/app/layout.tsx`
  → **1**.
- Phase 1 metadata preserved: `grep -c 'metadataBase' src/app/layout.tsx`
  → **1**; `grep -c 'James Nhek — AI Engineer' src/app/layout.tsx` → **1**.

## Commits

| # | Hash | Subject |
|---|------|---------|
| 1 | `c4698de` | feat(02-02): add MetricCallout + SiteFooter primitives |
| 2 | `f801b48` | feat(02-02): add ProjectCard + Experience composed components |
| 3 | `24ffd28` | feat(02-02): compose SiteFooter into layout + render real Experience + Projects on home |

## Self-Check: PASSED

- All 6 created files verified present at expected absolute paths.
- Both modified files (layout.tsx, page.tsx) verified for additive-only
  changes against Phase 1 baseline.
- All 3 commits verified in `git log --oneline -5`.
- TypeScript, ESLint, and `pnpm build` all green.
- Hero byte-identical diff confirmed.
- Sibling-pattern (no nested `<a>`) confirmed by JSX-region awk extraction.
