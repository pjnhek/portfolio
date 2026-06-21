---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: ready_to_plan
last_updated: 2026-06-20T22:58:08.071Z
progress:
  total_phases: 4
  completed_phases: 2
  total_plans: 8
  completed_plans: 8
  percent: 50
stopped_at: Phase 02 complete (5/5) — ready to discuss Phase 3
---

# Project State: pjnhek.com — James Nhek Portfolio

**Last Updated:** 2026-05-21 (after Plan 02-04 execution — `/uses` static route ships at `src/app/uses/page.tsx` composing 5 numbered Sections (Models / MCP Servers / Eval Stack / Agent Framework / Dev Workflow) from `src/content/uses.ts`, fronted by the Plan 02-03 BackLink and the new `UsesEntry` `<li>` primitive (bold name + aria-hidden em-dash + rationale). Task 2 decision resolved as Option C variant: ship Plan 02-01 seed AS-IS plus one Agent Framework entry — `MCP (Model Context Protocol)` — to hit the D-Uses-01 3-entry floor. Final uses.ts: 16 entries across 5 categories (Models 4 / MCP 3 / Eval 3 / Agent 3 / Dev 3), all satisfying the 3-6 floor. Per-page metadata is title + description only — Phase 3's SEO factory still owns `openGraph` / `twitter`. Build emits `○ /uses` as static. Codebase `"use client"` count still 0.)

## Project Reference

**Core Value:** A recruiter lands on pjnhek.com, immediately understands "James is a serious AI Engineer doing real RAG/eval work at Asurion," sees 3–4 substantive projects with real depth, and has an obvious way to reach out — all within 60 seconds, on a phone.

**Current Focus:** Phase 3 — seo, polish, performance & accessibility

**Project Mode:** Vertical MVP (every phase ships a deployable, recruiter-viewable improvement)
**Granularity:** Coarse (4 phases)

## Current Position

Phase: 02 (content-sections-with-confidentiality-gate) — COMPLETE (verified 2026-06-20, 5/5 plans, 5/5 success criteria)
Next: Phase 03 (SEO, Polish, Performance & Accessibility) — ready to discuss/plan

- **Phase:** 3
- **Plan:** Not started
- **Status:** Ready to plan
- **Progress:** [█████░░░░░] 50% (2/4 phases complete)
- **Resume file:** .planning/phases/02-content-sections-with-confidentiality-gate/02-05-SUMMARY.md

```
[█████░░░░░] 2/4 phases complete
```

## Performance Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Lighthouse Performance (mobile) | ≥ 95 | Not measured |
| Lighthouse Accessibility | 100 | Not measured |
| axe DevTools issues | 0 | Not measured |
| Home-route JS shipped (gzipped) | < 100 KB | Not measured |
| LCP (mobile) | < 2.5s | Not measured |
| OG card renders on LinkedIn (production) | Yes | Not deployed |
| All four URL variants resolve | Yes | Not deployed |
| Legacy pnhek.github.io decommissioned | Yes | Active |
| Confidentiality review pass on Asurion content | Yes (gated) | Drafted with resume citations; reviewer sign-off pending Plan 02-05 |

### Plan Execution Metrics

| Plan | Duration | Tasks | Files Created |
|------|----------|-------|---------------|
| 01-01 (scaffold + home shell) | 530 s (≈ 8m 50s) | 3 | 23 |
| 01-02 (primitives + lib/env.ts) | 271 s (≈ 4m 31s) | 3 | 7 |
| 01-03 (GitHub repo + Vercel preview) | ~50 min wall-clock (mostly human-checkpoint dwell) | 4 | 1 |
| 02-01 (content foundation: types + 4 content modules + lib/content + globals.css anchor scroll) | ~12 min wall-clock | 3 (Task 0 was the pre-execution human-verify gate, resolved by orchestrator) | 6 created + 1 modified |
| 02-02 (home composition: 6 new Server Components + layout SiteFooter + page.tsx refactor — real Experience + Projects, home Uses removed) | ~10 min wall-clock | 3 | 6 created + 2 modified |
| 02-03 (/projects/[slug] dynamic route: generateStaticParams + generateMetadata + BackLink primitive + refined narratives) | ~6 min wall-clock | 3 | 2 created + 1 modified |
| 02-04 (/uses static route + UsesEntry primitive + finalized uses.ts list — Task 2 decision resolved as Option C variant: ship seed + one MCP entry) | ~5 min wall-clock | 3 (Task 1 prior session, Tasks 2+3 this session) | 2 created + 1 modified |

## Accumulated Context

### Key Decisions Locked

- **Stack:** Next.js 16 (App Router) + React 19.2 + Tailwind v4 (CSS-first `@theme`) + TypeScript strict + pnpm + Node 22 LTS
- **Hosting:** Vercel Hobby on `pjnhek.com` (apex A `76.76.21.21`, `www` CNAME)
- **Fonts:** Geist Sans + Geist Mono via `next/font/google` (no external request)
- **Content source of truth:** Typed TS modules in `content/` (NOT MDX)
- **Client islands:** Only `components/interactive/CopyEmail.tsx` in v1
- **Contact:** `mailto:` + copy-email in v1; Resend Server Action deferred to v2 (POST-01)
- **OG image:** Static `app/opengraph-image.tsx` in v1; dynamic per-project deferred to v2 (POST-04)
- **No `output: 'export'`** — explicit (preserves `next/image`, dynamic OG, ISR)
- **Numbered section anchors** (`01.` `02.`) shipped in Phase 1 design system
- **Asurion content:** allow-list of facts from public May-2026 resume; no internal product names; diagrams drawn fresh in Excalidraw/tldraw with generic node names; **confidentiality review is a hard merge gate in Phase 2**
- **Tailwind v4 content scanner exclusion (Plan 01-01):** `@source not "../../.planning";` in `src/app/globals.css` so PostCSS does not choke on literal class specimens in planning markdown (RESEARCH.md line 1013).
- **Project-doc Prettier ignore (Plan 01-01):** `CLAUDE.md` and `AGENTS.md` listed in `.prettierignore`. Prettier must never reflow the user-authored project brief or the scaffold's Next-16 agent-rules hint.
- **Scaffold workaround (Plan 01-01):** `pnpm create next-app` refuses non-empty target directories even with `--yes`. Scaffolded into `mktemp -d` and moved files into the repo root; preserved `.planning/`, the real `CLAUDE.md`, and `AGENTS.md`.
- **Primitive className contracts locked (Plan 01-02):** 5 Server-Component primitives under `src/components/primitives/` with the UI-SPEC.md `## Components (Phase 1 Primitives)` className strings verbatim. The arbitrary-value bracket idiom `text-[length:var(--text-*)]` / `text-[color:var(--color-*)]` is the locked convention (RESEARCH.md Pattern 7).
- **lib/env.ts contract proven (Plan 01-02):** `src/lib/env.ts` parses `process.env` at module-top with zod, throws on failure. Task 3 verified the failure mode: removing `.default("https://pjnhek.com")` and unsetting `NEXT_PUBLIC_SITE_URL` makes `pnpm build` fail with `❌ Invalid environment variables: { NEXT_PUBLIC_SITE_URL: [ 'Required' ] }`. Phase 4 / DEP-03 removes the default once production env is wired.
- **Hero stays inline (Plan 01-02):** `src/app/page.tsx` keeps the hero outside any `<Section>` because the hero carries the only `<h1>` on the home route, and Section's `NumberedHeading` defaults to `<h2>`. The H1/H2 outline contract is preserved.
- **Repo + Vercel pipeline locked (Plan 01-03):** Public GitHub repo `pjnhek/portfolio`. GitHub Rulesets on `main`: PR required (approvals=0), block force pushes, `Vercel` status check required. Vercel project linked with Production Branch = main, Preview Branches = All branches, Node 24.x (Vercel auto-selected newest LTS — exceeds FOUND-13 floor of ≥22.18). Production: https://portfolio-kappa-bay-ew5cos0ri7.vercel.app/
- **Vercel Deployment Protection = None (Plan 01-03, user Option A):** Vercel's 2026 default Standard Protection gated previews behind SSO; disabled it so recruiters can be sent preview URLs. Matches threat model T-01-VERCEL-USAGE which already accepted "non-guessable hashes" as the sole barrier.
- **No `NEXT_PUBLIC_SITE_URL` in Vercel production yet (Plan 01-03):** Phase 4 / DEP-03 owns this. Plan 01-02's `.default("https://pjnhek.com")` in `src/lib/env.ts` keeps Phase 1 builds green.
- **Asurion provenance discipline locked (Plan 02-01):** Every Asurion-touching string in `src/content/experience.ts` carries an inline `// Resume source: RESUME-2026-05.md line N — "<verbatim>"` comment. 4 Asurion bullets cite resume lines 12-15 (chatbot, hybrid search +10.6%, eval framework 249/11/4, KB freshness across 5 tenants). Asurion-only tag-chip row carries 7 entries; Tax Analyst + FWD have no tags (D-Exp-03).
- **Recruiter-facing contact canonicalized to resume values (Plan 02-01):** `email = pjnhek@gmail.com`, `github = github.com/pjnhek`, `linkedin = linkedin.com/in/pjnhek/`. All three sourced from RESUME-2026-05.md lines 3-4. The older `nhekvirakyuth@gmail.com` referenced in PROJECT.md context is superseded by the resume's canonical address.
- **GitHub URLs intentionally diverge from slugs (Plan 02-01):** `sf-date-night-concierge` → `deshmukh-neel/mlops_city_concierge` (collaborator repo); `gtm-research-pipeline` → `pjnhek/poc_scraper` (repo-name diverges from display slug). Do NOT auto-correct to `pjnhek/<slug>`.
- **`daily-weather-pipeline` metric set to "Daily / Airflow → BigQuery ML" (Plan 02-01):** Resume describes the retraining cadence qualitatively, not numerically. "Daily" matches the resume verb. James can swap to a numeric value during Plan 02-03 detail-page work if desired.
- **Content modules ship as typed TS — confirmed in code (Plan 02-01):** 4 modules under `src/content/` (`site.ts`, `experience.ts`, `projects.ts`, `uses.ts`) + `src/types/content.ts` + `src/lib/content.ts`. `getProject(slug)` returns `Project | undefined` per `noUncheckedIndexedAccess`. No MDX, no zod runtime validation on content.
- **Home section count locked to 4 (Plan 02-02):** `01. About → 02. Experience → 03. Featured Projects → 04. Contact`. The home `04. Uses` section is REMOVED; `/uses` is reachable only from `SiteFooter` (USES-03, D-Uses-03). Contact is now `04.` (renumbered from Phase 1's `05.`). About diagram placeholder REMOVED from page.tsx — DIAG-01 moves into the Asurion ExperienceBlock in Plan 02-05.
- **Hero block frozen byte-for-byte (Plan 02-02):** `src/app/page.tsx` lines 19-35 (the `Hero — outside any <section>` block) are byte-identical to the Phase 1 / Plan 01-02 baseline. Verified via `diff` between `git show HEAD~2:src/app/page.tsx` and the current file's extracted hero block — zero-byte diff. SEC-01 invariant honored.
- **ProjectCard ships sibling pattern, not stopPropagation (Plan 02-02):** The whole-card `<Link href="/projects/{slug}">` wraps title/subtitle/MetricCallout/description/tech chips; the `<ExternalLink href={project.github}>` lives as a SIBLING inside the `<article>` border. No nested `<a>`, no client-side `stopPropagation`. Cleaner DOM contract; the `<article>` 1px `--color-rule` border encloses both interactive surfaces.
- **SiteFooter wired sitewide via layout.tsx (Plan 02-02):** `src/app/layout.tsx` imports `SiteFooter` from `@/components/primitives/SiteFooter` and renders it after `{children}`. Phase 1 `metadata` block, Geist fonts, env import, `<html lang>` all untouched (Phase 3 owns SEO). Plans 02-03 / 02-04 inherit the footer without further layout edits.
- **`use client` count still 0 (Plan 02-02):** All 6 new components (MetricCallout, SiteFooter, ProjectCard, RoleHeader, ExperienceBlock, EducationItem) are Server Components. The first (and per SEC-07, only) `"use client"` file ships in Plan 02-05 when CopyEmail lands.
- **First Next.js 16 async-params dynamic route in the codebase (Plan 02-03):** `src/app/projects/[slug]/page.tsx` ships with both `generateMetadata` and the default `ProjectDetailPage` export using `params: Promise<{ slug: string }>` at the type level + `await params` at runtime. `pnpm build` pre-renders all 4 slugs (sf-date-night-concierge, gtm-research-pipeline, voice-intent-eval, daily-weather-pipeline) as SSG. Phase 2 has no other dynamic routes; Plan 02-04's `/uses` is static.
- **`generateMetadata` is intentionally minimal — title + description only (Plan 02-03):** Per-route metadata returns `{ title: \`${project.title} — James Nhek\`, description: project.subtitle.slice(0, 160) }`. **Zero `openGraph` or `twitter` keys** — Phase 3 / SEO-01..04 owns the `lib/seo.ts` factory. Acceptance grep on the file: 0 openGraph, 0 twitter keys. RESEARCH.md Pitfall 10 prevented.
- **BackLink composes Next.js `<Link>` directly, NOT `<ExternalLink>` (Plan 02-03):** ExternalLink hardcodes `target="_blank" rel="noopener noreferrer"` which would defeat client-side route caching on internal nav. BackLink is a sibling primitive to ExternalLink, not a wrapper. The visual treatment (Geist Mono caption, ink-muted → ink on hover, focus-visible outline) is copy-faithful with the focus-ring string verbatim from ExternalLink.tsx line 57. BackLink href is `/` (home), NOT `/#projects` (UI-SPEC lock).
- **`voice-intent-eval`'s `diagram` field still undefined going into Plan 02-05 (Plan 02-03):** The dynamic route guards `{project.diagram && <ArchitectureDiagram .../>}` inside Section 02 (Approach). Dead code today. Plan 02-05 populates the field + ships the SVG; the diagram renders automatically — no route-file edit needed.
- **Project narratives carry `\n\n` paragraph breaks (Plan 02-03):** Refined all 4 projects' `problem`/`approach`/`result` strings — added paragraph splits and expanded the result fields past the prior thin first drafts (now 74-86 words each, up from 39-61). Per-project totals ~250 words across the three fields. Detail-page renderer splits on `\n\n` at render and wraps each chunk in its own `<p>`. Schema unchanged (`problem: string` still required).
- **/uses seed list finalized post-James-edit (Plan 02-04):** D-Uses-04 decision resolved as Option C variant — ship the Plan 02-01 seed AS-IS plus one Agent Framework entry. Net add: `MCP (Model Context Protocol)` — "the wire protocol behind every MCP server above — knowing the spec means I can build my own when one doesn't exist." Final per-category counts: Models 4 / MCP Servers 3 / Eval Stack 3 / Agent Framework 3 / Dev Workflow 3 — 16 total entries, all categories satisfy D-Uses-01 3-6 floor. The 5 category names stay locked.
- **/uses route is statically pre-rendered (Plan 02-04):** `src/app/uses/page.tsx` is a Server Component with `export const metadata: Metadata` (title + description only — zero `openGraph` / zero `twitter` keys, Phase 3 / lib/seo.ts owns those). `pnpm build` emits `○ /uses` alongside `○ /` as static content. Local `byCategory` arrow helper above the component filters the typed `uses` array by `UsesCategory`; TS catches drift if a sixth category were ever added.
- **`UsesEntry` is the smallest new Phase 2 component (Plan 02-04):** `src/components/uses/UsesEntry.tsx` — single `<li>` with two `<span>`s (bold name + aria-hidden U+2014 em-dash) and a trailing rationale text node. No icons, no nesting. Mirrors the ExternalLink `↗` and RoleHeader em-dash treatment. Server Component (no client island). 22 lines.
- **`use client` count still 0 going into Plan 02-05 (Plan 02-04):** /uses ships pure Server Components. The first (and per SEC-07, only) `"use client"` file lands in Plan 02-05 when CopyEmail ships.

### Open Todos

- [x] Run `/gsd:plan-phase 1` to decompose Phase 1 into plans
- [x] Plan 01-01 — scaffold + home shell complete (commits `ff1a96c`, `7b0f0e1`)
- [x] Plan 01-02 — primitives + `lib/env.ts` complete (commits `1c23f6e`, `3e27ca7`)
- [x] Plan 01-03 — Vercel preview + GitHub repo complete (commits `f723615`, `ccf3636`, merge `1a8b8de`)
- [x] Confirm GitHub repo name with user — resolved: `pjnhek/portfolio` public
- [x] Plan 02-01 — content foundation complete (commits `c9ec30e`, `65dd6d1`, `02f4b36`, summary `91f364a`)
- [x] Plan 02-02 — home composition complete (commits `c4698de`, `f801b48`, `24ffd28`)
- [x] Plan 02-03 — /projects/[slug] dynamic route + BackLink + refined narratives complete (commits `625776a`, `188180f`, `eb83dc0`, summary `68a3915`)
- [x] Plan 02-04 — /uses static route + UsesEntry primitive + finalized uses.ts list complete (commits `836d435` Task 1 prior, `624b270` Task 2, `32972f7` Task 3)
- [ ] Run `/gsd:verify-phase 1` to confirm Phase 1 success criteria on live infrastructure (Lighthouse, axe, real-iPhone check are deferred to Phase 3; Phase 1 verification is the end-to-end pipeline + shell rendering)
- [ ] Decide whether `james@pjnhek.com` email forwarding is in scope (affects Phase 4 DNS research)
- [ ] James reviews 4 voice/factual ambiguities surfaced in 02-01-SUMMARY.md (Asurion bullet #4 verb choice, "Corrective RAG" as a tag, daily-weather metric value, Tax Analyst date format) — non-blocking but should be resolved before Plan 02-05 confidentiality gate
- [ ] James reviews 5 voice/factual ambiguities surfaced in 02-03-SUMMARY.md (conversational register across all 4 detail pages; sf-date-night-concierge "third of its rows" estimate; gtm-research-pipeline κ-comparison wording precision; voice-intent-eval "eight categories" enumeration; daily-weather-pipeline idempotency claim) — non-blocking but should be resolved before Plan 02-05 confidentiality gate

### Active Blockers

- None at roadmap stage

### Risks to Monitor

- **Scope creep** (PITFALL #9): v2 features (blog, dark mode, RAG demo, analytics) must stay out of v1 — treat `PROJECT.md ## Out of Scope` as a hard contract
- **Asurion confidentiality** (PITFALL #2): hard gate before Phase 3 starts
- **LinkedIn OG on production** (PITFALL #3): Phase 3 verifies on preview; Phase 4 re-verifies on production (preview behavior differs)
- **Vercel Hobby caps** (PITFALL #5): bandwidth + image-transformation alerts enabled in Phase 4
- **Legacy `pnhek.github.io`** (PITFALL #7): must be taken down or 301-redirected in Phase 4 before launch

## Session Continuity

### Next Action

`/gsd:execute-phase 2 --plan 02-05` — phase closer. Ships DIAG-01 (Asurion RAG pipeline diagram, generic labels only) + DIAG-02 (Voice Intent Eval diagram), the first `"use client"` file `src/components/interactive/CopyEmail.tsx`, real About copy (tax-analyst → AI-engineer pivot opener per D-About-04), real Contact section content, and the CONFIDENTIALITY-REVIEW.md hard merge gate. This is the last plan before Phase 2 verification.

### Files Created This Session

- `src/app/uses/page.tsx` (Task 3 — static /uses route composing 5 numbered Sections)
- `.planning/phases/02-content-sections-with-confidentiality-gate/02-04-SUMMARY.md`

### Earlier Files Created (Plan 02-04 Task 1 prior session, Plan 02-03 session)

- `src/components/uses/UsesEntry.tsx` (Plan 02-04 Task 1 — committed `836d435` prior to this session resuming)
- `src/components/nav/BackLink.tsx` (Plan 02-03)
- `src/app/projects/[slug]/page.tsx` (Plan 02-03)
- `.planning/phases/02-content-sections-with-confidentiality-gate/02-03-SUMMARY.md`

### Earlier Files Created (Plan 02-02 session, kept for resume continuity)

- `src/components/primitives/MetricCallout.tsx`
- `src/components/primitives/SiteFooter.tsx`
- `src/components/cards/ProjectCard.tsx`
- `src/components/experience/RoleHeader.tsx`
- `src/components/experience/ExperienceBlock.tsx`
- `src/components/experience/EducationItem.tsx`
- `.planning/phases/02-content-sections-with-confidentiality-gate/02-02-SUMMARY.md`

### Files Modified This Session

- `src/content/uses.ts` (Task 2 — added one Agent Framework entry, `MCP (Model Context Protocol)`, to hit D-Uses-01 3-entry floor; header comment updated to note post-James-edit decision. All other Plan 02-01 seed entries shipped verbatim.)
- `.planning/ROADMAP.md` (Phase 2 progress table row → 4/5; 02-04-PLAN.md checkbox)
- `.planning/STATE.md` (this update)

### Earlier Files Modified (Plan 02-03 session, kept for resume continuity)

- `src/content/projects.ts` (added `\n\n` paragraph breaks across all 4 projects' problem/approach/result fields; expanded all 4 result strings past the prior thin first drafts — now 74-86 words each. Schema, slug list, metric values, tech arrays, GitHub URLs all untouched.)

### Earlier Files Modified (Plan 02-02 session, kept for resume continuity)

- `src/app/layout.tsx` (one import + `<SiteFooter />` after `{children}` — Phase 1 metadata untouched)
- `src/app/page.tsx` (Hero byte-identical to Phase 1; removed About diagram placeholder; replaced 5 placeholder `<Section>`s with EXACTLY 4 numbered sections rendering real Experience + Projects content)

### Infrastructure Provisioned This Session

- (No new infrastructure in Plan 02-01 — all changes are typed TS modules + a CSS append. Phase 1 Vercel pipeline carries forward unchanged.)

### Resumption Notes

If returning fresh, read in this order:

1. `.planning/PROJECT.md` — what we're building and why
2. `.planning/REQUIREMENTS.md` — the 64 v1 requirements
3. `.planning/ROADMAP.md` — phase structure + success criteria
4. `.planning/research/SUMMARY.md` — stack/architecture/pitfalls synthesis
5. This file — current position and locked decisions
6. `.planning/phases/02-content-sections-with-confidentiality-gate/02-01-SUMMARY.md` — Plan 02-01 outcomes + voice/factual ambiguities flagged for James
7. `.planning/phases/02-content-sections-with-confidentiality-gate/02-02-SUMMARY.md` — Plan 02-02 outcomes: 6 Server Components + home composition; voice/factual ambiguities (Asurion tag-chip wrap at 375px, `Daily` weather metric) reflagged for visual review
8. `.planning/phases/02-content-sections-with-confidentiality-gate/02-03-SUMMARY.md` — Plan 02-03 outcomes: /projects/[slug] dynamic route + BackLink + refined narratives; 5 voice/factual ambiguities flagged for James pre-02-05 review
9. `.planning/phases/02-content-sections-with-confidentiality-gate/02-04-SUMMARY.md` — Plan 02-04 outcomes: /uses static route + UsesEntry primitive + finalized uses.ts (post-James-edit decision: seed + one MCP entry)

---
*State initialized: 2026-05-20 after roadmap creation*
