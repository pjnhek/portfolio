---
phase: 02
plan: 04
subsystem: uses-route
tags:
  - uses-page
  - ai-engineer-stack
  - static-route
  - uses-entry-primitive
dependency_graph:
  requires:
    - "Plan 02-01 (UsesItem + UsesCategory types; uses.ts seed list)"
    - "Plan 02-02 (SiteFooter wired sitewide via layout.tsx — provides
       the /uses footer link, sourced for USES-03 part 1)"
    - "Plan 02-03 (BackLink primitive at src/components/nav/BackLink.tsx —
       sourced for USES-03 part 2)"
    - "Phase 1 primitives (Section + NumberedHeading — composed 5x)"
  provides:
    - "src/app/uses/page.tsx — static /uses route, statically pre-rendered
       at build (USES-01, USES-02, USES-03)"
    - "src/components/uses/UsesEntry.tsx — minimal <li> primitive (bold
       name + aria-hidden em-dash + rationale)"
    - "Final src/content/uses.ts list (post-James-edit per D-Uses-04):
       16 entries across 5 categories, all satisfying D-Uses-01 3-6 floor"
  affects:
    - "Plan 02-05 — confidentiality review pass should glance /uses to
       confirm no Asurion internals leaked through tooling rationales.
       /uses is intentionally Asurion-free per scope."
    - "Phase 3 (SEO-01..04) — lib/seo.ts factory will refactor the
       title + description pattern inlined here AND add openGraph/twitter
       keys (intentionally absent in Phase 2 per RESEARCH.md Pitfall 10)"
tech_stack:
  added: []
  patterns:
    - "Static App-Router route with `export const metadata: Metadata` —
       no `generateMetadata`, no async params. Mirrors src/app/layout.tsx
       lines 27-32 baseline shape."
    - "Closed string-literal union (UsesCategory) as the byCategory filter
       key — a typo or sixth category becomes a TS compile error at the
       page's five `byCategory(...)` call sites (T-02-04-CAT mitigation)."
    - "Local arrow helper `const byCategory = (cat) => uses.filter(...)`
       defined above the component — keeps the JSX free of inline filter
       lambdas while still being purely build-time evaluated."
key_files:
  created:
    - "src/app/uses/page.tsx"
    - "src/components/uses/UsesEntry.tsx (Task 1, committed earlier:
       836d435)"
  modified:
    - "src/content/uses.ts (added one Agent Framework entry — MCP /
       Model Context Protocol — to hit D-Uses-01 3-entry floor; header
       comment updated to note post-James-edit decision)"
decisions:
  - "Task 2 decision resolved as Option C (seed-as-is structurally,
     single item-level addition): ship the Plan 02-01 seed AS-IS PLUS
     one Agent Framework entry to satisfy the D-Uses-01 3-entry floor
     for that category (previously 2 entries). The 5 category names
     stay locked. Net add: `MCP (Model Context Protocol)` — `the wire
     protocol behind every MCP server above — knowing the spec means
     I can build my own when one doesn't exist.`"
  - "UsesEntry is a Server Component — single <li> with two <span>s
     (bold name + aria-hidden em-dash) and a trailing text node for
     the rationale. Em-dash is U+2014, aria-hidden so SRs don't say
     `em-dash` once per entry. Matches the ExternalLink ↗ / RoleHeader
     / EducationItem precedent."
  - "Per-page metadata is `title` + `description` only. Zero openGraph
     and zero twitter keys — Phase 3 / lib/seo.ts owns those (RESEARCH.md
     Pitfall 10). Acceptance grep `openGraph:|twitter:` returns 0 on
     src/app/uses/page.tsx."
  - "H1 uses `--text-heading`, NOT `--text-display`. UI-SPEC line 96
     reserves --text-display for the home hero's `<h1>James Nhek</h1>`
     only — /uses H1 sits one tier down, same scale as /projects/[slug]
     H1 (locked Plan 02-03)."
  - "SiteFooter is NOT rendered from src/app/uses/page.tsx — it is
     composed at the layout level (src/app/layout.tsx, Plan 02-02).
     Adding a second instance here would double-render the footer."
  - "BackLink href is `/` (home), label `Back to home` — matches the
     /projects/[slug] convention locked in Plan 02-03. No `#models` or
     `#uses` anchor; recruiter expects `back` to mean home."
  - "5 numbered Sections are emitted unconditionally; if any category
     ever empties, that Section renders an empty <ul>. This is an
     intentional invariant: D-Uses-01 locks 5 categories with 3-6
     entries each, so empty categories would be a content authoring
     bug, not a render-path concern."
metrics:
  duration_seconds: 280
  completed_date: "2026-05-21"
---

# Phase 02 Plan 04: /uses Route + UsesEntry Summary

**One-liner:** Static `/uses` route at `src/app/uses/page.tsx` composes the
Phase 1 `Section` primitive 5 times — one per locked `UsesCategory` — to
render James's AI-engineer-specific tools page, fronted by the Plan 02-03
`BackLink` and a new minimal `UsesEntry` `<li>` primitive (bold name +
aria-hidden em-dash + rationale), with the Plan 02-01 seed list finalized
post-James-edit at 16 entries (one MCP/Model-Context-Protocol entry added
to Agent Framework to hit the D-Uses-01 3-entry floor for that category).
Locks USES-01 / USES-02 / USES-03.

## What Shipped

- **`src/components/uses/UsesEntry.tsx`** (Task 1, committed `836d435` —
  Wave 4 prior task, already on `main` before this session resumed). 22
  lines, no JSX nesting beyond the two `<span>`s. Server Component.
  Acceptance greps from PLAN.md all pass.
- **`src/content/uses.ts`** (Task 2). Single edit: added the
  `MCP (Model Context Protocol)` entry inside the existing Agent Framework
  category block. Header comment updated to reflect the post-James-edit
  status (D-Uses-04 resolved). Per-category counts: Models 4 / MCP Servers
  3 / Eval Stack 3 / Agent Framework 3 / Dev Workflow 3 — all 5 categories
  now satisfy the 3-6 floor.
- **`src/app/uses/page.tsx`** (Task 3). 91 lines. Composes BackLink + H1
  "Uses" + subtitle + 5 numbered Sections via `<Section number="0N" .../>`.
  Each Section wraps a `<ul className="space-y-3">` of `UsesEntry` items
  filtered by category via a local `byCategory` arrow helper. Static
  metadata (title + description only). `pnpm build` confirms it is emitted
  as `○ /uses` (static pre-render).

## Tasks Executed

| Task | Status | Files | Commit | Notes |
|------|--------|-------|--------|-------|
| 1: UsesEntry primitive | DONE (prior session) | src/components/uses/UsesEntry.tsx | 836d435 | Carried into this session as completed work |
| 2: Finalize uses.ts (decision checkpoint resolved) | DONE | src/content/uses.ts | 624b270 | Option C variant — single MCP entry added; all other seed entries shipped verbatim |
| 3: Build /uses route | DONE | src/app/uses/page.tsx | 32972f7 | Static route; build emits `○ /uses` |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Reworded a comment that would have tripped the
acceptance grep for `openGraph:|twitter:`**
- **Found during:** Task 3 self-verification.
- **Issue:** The page's header comment originally contained the literal
  string ``acceptance grep: `openGraph:|twitter:` returns 0`` (intended as
  prose documentation). The PLAN.md acceptance criterion uses the regex
  `grep -E "openGraph:|twitter:" src/app/uses/page.tsx` and expects 0
  hits — but the comment line itself would have produced a (false-positive)
  hit, failing the criterion.
- **Fix:** Rewrote the comment to describe the same intent without
  including the literal `openGraph:|twitter:` substring. Verification now
  shows 0 hits, as required.
- **Files modified:** `src/app/uses/page.tsx` (comment only, no behavior
  change).
- **Commit:** Folded into the Task 3 commit (`32972f7`) before the
  commit landed — the rewrite happened pre-commit during verification.

### Authentication Gates

None.

### Architectural Changes

None.

## Decisions Made

(See frontmatter `decisions:` block for the canonical list.)

The Task 2 decision checkpoint was resolved upstream by the orchestrator
before this executor wave began. The resolution: ship the Plan 02-01 seed
AS-IS, PLUS add a single Agent Framework entry — `MCP (Model Context
Protocol)` — to hit the D-Uses-01 3-entry floor for that category. No
other seed edits were requested. This is functionally Option C from the
PLAN.md decision block (5 category names stay locked, item-level edit
only).

## Verification

| Check | Status | Notes |
|-------|--------|-------|
| `pnpm tsc --noEmit` | PASS | Exit 0 |
| `pnpm lint` (eslint .) | PASS | Exit 0, no warnings |
| `pnpm build` | PASS | Compiles in ~1.5s; static-pages step OK |
| /uses appears as static in build output | PASS | `○ /uses` listed alongside other `○` routes |
| Section count = 5 | PASS | `grep -c "<Section number=" src/app/uses/page.tsx` = 5 |
| All 5 category strings present (Models / MCP Servers / Eval Stack / Agent Framework / Dev Workflow) | PASS | Every category appears once in page.tsx and ≥3 times in uses.ts |
| H1 uses `--text-heading` (NOT `--text-display`) | PASS | Grep on `<h1 className="text-\[length:var\(--text-heading\)\]` matches once |
| Per-page metadata is title + description only | PASS | `openGraph:` and `twitter:` greps return 0 |
| No `"use client"` directive | PASS | Server Component preserved |
| `<BackLink href="/">` present once | PASS | grep = 1 |
| `byCategory` helper used at every Section | PASS | 1 definition + 5 call sites = 6 occurrences |
| uses.ts category count between 15 and 30 | PASS | 16 entries |
| Per-category 3-6 floor (D-Uses-01) | PASS | Models 4 / MCP Servers 3 / Eval Stack 3 / Agent Framework 3 / Dev Workflow 3 |
| No forbidden marketing words in uses.ts rationales | PASS | grep on (passionate\|leveraged\|cutting-edge\|synergy\|rockstar\|ninja\|amazing\|incredible) = 0 (non-comment lines) |

**Live smoke (deferred — sequential mode, no preview yet):** the executor
did not bring up `pnpm dev` because the build verification is sufficient
for the static route, and the SiteFooter `/uses` link wiring was already
shipped by Plan 02-02 (USES-03 part 1). The USES-03 part 2 path (BackLink
→ home) is the same primitive Plan 02-03 verified on `/projects/[slug]`.
Phase 2's final verification (Plan 02-05 / phase verifier) will exercise
the full footer→/uses→BackLink→home round trip on the Vercel preview.

## Threat Surface Notes

No new threat-surface — `/uses` is a pure static read of `src/content/uses.ts`
into a sequence of Server-rendered `<li>` text nodes. No user input, no
fetch, no auth, no client island. The three threats in PLAN.md's threat
register all check out:
- **T-02-04-DRIFT** (marketing voice): mitigated — forbidden-word grep on
  uses.ts returns 0.
- **T-02-04-SEO** (Phase 3 metadata scope creep): mitigated — page.tsx
  contains no `openGraph` or `twitter` keys (verified twice).
- **T-02-04-CAT** (category drift): mitigated by TS — UsesCategory is a
  closed string-literal union; adding a sixth category forces a TS error
  at the five `byCategory(...)` call sites.

## Known Stubs

None. Every Section renders real entries from `src/content/uses.ts`. The
"What I reach for in 2026." subtitle is final copy (not a placeholder).

## Nuance for Plan 02-05

- **SiteFooter wording stays `/uses`** (NOT `/uses-and-stack` or
  similar). Wave 2 already ships this; no edit needed. Confirmed against
  `src/components/primitives/SiteFooter.tsx` via Plan 02-02 summary.
- **Confidentiality review (Plan 02-05) should still pass /uses through
  the same review pass** even though /uses is Asurion-free. Any rationale
  that mentions tooling overlap with Asurion's stack (e.g., the MLflow
  rationale references "Model Registry doubles as a deploy primitive" —
  a generic capability claim, no internal-product reference) should be
  spot-checked for inadvertent leakage. Current text is clean by review.
- **No new dependencies introduced.** No `lucide-react`, no `motion`, no
  client islands. Plan 02-05's CopyEmail remains the only `"use client"`
  file in the codebase.

## Self-Check: PASSED

- src/app/uses/page.tsx → FOUND
- src/components/uses/UsesEntry.tsx → FOUND (Task 1, committed 836d435 prior)
- src/content/uses.ts (modified) → FOUND
- Task 2 commit 624b270 → FOUND in `git log`
- Task 3 commit 32972f7 → FOUND in `git log`
- `pnpm tsc --noEmit && pnpm lint && pnpm build` → all exit 0
- Build output lists `○ /uses` as a static pre-render

---
*Plan executed: 2026-05-21 — sequential mode, single-repo, main branch.*
