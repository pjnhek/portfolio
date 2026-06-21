---
phase: 02
plan: 01
subsystem: content-foundation
tags:
  - content
  - types
  - data-modules
  - confidentiality-source
  - anchor-scroll
dependency_graph:
  requires:
    - "Phase 1 primitives (Section, NumberedHeading, Tag, ExternalLink, ArchitectureDiagram)"
    - "src/lib/env.ts (NEXT_PUBLIC_SITE_URL — for site.baseUrl)"
    - ".planning/refs/RESUME-2026-05.md (canonical Asurion source-of-truth)"
  provides:
    - "src/types/content.ts (SiteConfig, Metric, Project, Role, EducationItem, UsesCategory, UsesItem)"
    - "src/content/site.ts (site: SiteConfig)"
    - "src/content/experience.ts (roles: Role[], education: EducationItem[])"
    - "src/content/projects.ts (projects: Project[] — 4 entries)"
    - "src/content/uses.ts (uses: UsesItem[] — 15-entry seed)"
    - "src/lib/content.ts (getAllProjects, getProject)"
    - "src/app/globals.css (scroll-padding-top + motion-gated scroll-behavior)"
  affects:
    - "Plan 02-02 (home composition imports site, roles, education, getAllProjects)"
    - "Plan 02-03 (/projects/[slug] dynamic route imports getAllProjects + getProject)"
    - "Plan 02-04 (/uses route imports uses + edits final categories)"
    - "Plan 02-05 (confidentiality gate verifies // Resume source: comments)"
tech_stack:
  added: []
  patterns:
    - "src/content/ typed-TS modules (NOT MDX) — first use of the convention"
    - "Pure type module (src/types/content.ts) — first such file in the repo"
    - "// Resume source: RESUME-2026-05.md line N — \"...\" inline-comment provenance"
    - "Asurion-only tag-chip discipline (D-Exp-03)"
    - "Project | undefined return type honoring noUncheckedIndexedAccess"
key_files:
  created:
    - "src/types/content.ts"
    - "src/content/site.ts"
    - "src/content/experience.ts"
    - "src/content/projects.ts"
    - "src/content/uses.ts"
    - "src/lib/content.ts"
  modified:
    - "src/app/globals.css"
decisions:
  - "Email locked to pjnhek@gmail.com (resume line 3, NOT nhekvirakyuth@gmail.com referenced in older PROJECT.md context — resume is canonical)."
  - "LinkedIn locked to https://www.linkedin.com/in/pjnhek/ (resume line 4, NOT linkedin.com/in/jamesnhek referenced in the 02-01-PLAN.md body — the plan body's jamesnhek was a typo, resume is canonical)."
  - "GitHub URLs use exact orchestrator-confirmed values: sf-date-night-concierge → deshmukh-neel/mlops_city_concierge (collaborator repo), gtm-research-pipeline → pjnhek/poc_scraper (repo name diverges from display slug), voice-intent-eval → pjnhek/voice-intent-eval, daily-weather-pipeline → pjnhek/msds697-weather-pipeline. Do NOT 'correct' these to pjnhek/<slug>."
  - "daily-weather-pipeline metric value set to 'Daily' (Airflow cadence) because the resume does not state a retraining-frequency number — the resume describes 'daily' ingestion explicitly. Plan placeholder said 'retraining-cadence metric from resume'; the actual cadence the resume backs is daily, not a numeric count."
  - "Asurion role gets 4 bullets (within the 3-5 range per D-Exp-02), each citing one of resume lines 12-15 verbatim."
  - "Asurion tag-chip row carries 7 entries citing resume lines 12-15 as a group (Corrective RAG, Hybrid Search, Cross-Encoder Reranking, LLM-as-Judge, Exa, Gemini Search, Brave Search) — all publicly disclosed by the resume itself."
metrics:
  duration_seconds: 720
  completed_date: "2026-05-21"
---

# Phase 02 Plan 01: Content Foundation Summary

**One-liner:** Typed-TS content modules (types + site + experience + projects + uses) wired through a server-only lib/content accessor, with Asurion bullets carrying inline `// Resume source:` provenance and anchor-scroll CSS appended to globals.css.

## What Shipped

### Files Created (6)

| File | Purpose | Key Exports |
|------|---------|-------------|
| `src/types/content.ts` | Pure type module — no runtime exports | `SiteConfig`, `Metric`, `Project`, `Role`, `EducationItem`, `UsesCategory`, `UsesItem` (7 types) |
| `src/content/site.ts` | Single `SiteConfig` instance | `site` — name, tagline, location, email (pjnhek@gmail.com), github, linkedin (linkedin.com/in/pjnhek), baseUrl (from env) |
| `src/content/experience.ts` | 3 work roles + 2 education entries | `roles: Role[]`, `education: EducationItem[]` |
| `src/content/projects.ts` | 4 featured projects, ordered per ROADMAP SC#2 | `projects: Project[]` |
| `src/content/uses.ts` | 15-entry /uses seed across 5 locked categories | `uses: UsesItem[]` |
| `src/lib/content.ts` | Server-only accessors | `getAllProjects()`, `getProject(slug)` returning `Project \| undefined` |

### Files Modified (1)

| File | Change |
|------|--------|
| `src/app/globals.css` | Appended `html { scroll-padding-top: 4rem }` (always-on) and `@media (prefers-reduced-motion: no-preference) { html { scroll-behavior: smooth } }` (motion-gated). Outside any `@theme` block. |

## Asurion Bullet Citations (for Plan 02-05 confidentiality gate)

| # | Bullet (first 12 words) | Resume source |
|---|--------------------------|---------------|
| 1 | "Lifted retrieval accuracy 10.6% over the production baseline with hybrid search..." | RESUME-2026-05.md line 14 |
| 2 | "Built a RAG evaluation framework with 249 synthetic QA pairs and 11..." | RESUME-2026-05.md line 15 |
| 3 | "Built a knowledge-base health pipeline using Corrective RAG classification, reranker scoring..." | RESUME-2026-05.md line 13 |
| 4 | "Shipped a multi-tenant troubleshooting chatbot with LLM tool orchestration that cut..." | RESUME-2026-05.md line 12 |

**Tag-chip provenance:** Asurion tags (Corrective RAG, Hybrid Search, Cross-Encoder Reranking, LLM-as-Judge, Exa, Gemini Search, Brave Search) cited as a group against RESUME-2026-05.md lines 12-15 — all 7 names appear verbatim in the resume's Asurion section.

**Numbers used (cross-check, every Asurion bullet contains at least one):** 10.6% (retrieval accuracy uplift), 249 (synthetic QA pairs), 11 (query transformations), 4 (LLM-judge dimensions), 5 (enterprise tenants), zero-code (qualitative numeric — paired with "full-code" as the contrast).

**Confidentiality scan (informal pre-check for Plan 02-05 gate):**
- ✅ Every Asurion bullet contains a number sourced from the resume (D-Asurion-03).
- ✅ Zero internal Asurion product names / codenames / queue names / team names appear (only the company name "Asurion" itself).
- ✅ Zero `grep -i "asurion"` matches inside `src/content/projects.ts` (Pitfall 9 — Asurion content lives in exactly one place).
- ✅ Tag-chip row appears on the Asurion role only (D-Exp-03 — Tax Analyst + FWD have no tags).

## GitHub URL Resolution

| Slug | URL | Notes |
|------|-----|-------|
| `sf-date-night-concierge` | `https://github.com/deshmukh-neel/mlops_city_concierge` | Collaborator repo (NOT under pjnhek namespace). Do NOT auto-correct. |
| `gtm-research-pipeline` | `https://github.com/pjnhek/poc_scraper` | Repo name diverges from display slug. The slug `gtm-research-pipeline` is the on-site identifier; `poc_scraper` is the actual repo. |
| `voice-intent-eval` | `https://github.com/pjnhek/voice-intent-eval` | Slug matches repo name exactly. |
| `daily-weather-pipeline` | `https://github.com/pjnhek/msds697-weather-pipeline` | Repo name reflects course context (MSDS697); display slug is recruiter-facing. |

## Contact (locked)

- **Email:** `pjnhek@gmail.com` (RESUME-2026-05.md line 3 — the recruiter-facing canonical address per the public resume).
- **GitHub:** `https://github.com/pjnhek` (resume line 4).
- **LinkedIn:** `https://www.linkedin.com/in/pjnhek/` (resume line 4).

## /uses Seed Status

`src/content/uses.ts` ships **15 entries across 5 locked categories** as a Claude-proposed seed. Per D-Uses-04, Plan 02-04 hands this off to James for final editing. Initial seed leans on signals from CLAUDE.md (Claude Opus 4.7 / Sonnet 4.5, Context7 / Exa / Firecrawl MCP servers) and the resume's Asurion stack (LangGraph, MLflow, hybrid search + LLM-as-judge eval patterns).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 — Resolved blocking ambiguity] `daily-weather-pipeline` metric value**
- **Found during:** Task 2.
- **Issue:** The plan template said the value should be a "retraining-cadence metric from resume," but the resume describes daily ingestion + retraining in qualitative terms ("Built an Airflow DAG... that ingests daily NWS weather data... and retrains a BigQuery ML model") — no numeric cadence count is given.
- **Fix:** Used `value: "Daily"` (matches the resume's cadence verbiage exactly) with `label: "Airflow → BigQuery ML"` per the locked label in UI-SPEC.md line 237.
- **Files modified:** `src/content/projects.ts`.
- **Commit:** `65dd6d1`.

**2. [Rule 2 — Spec defect documentation] LinkedIn URL in plan body**
- **Found during:** Task 2 (preempted by orchestrator's resume-signal block).
- **Issue:** The plan body's Task 1 instructions referenced `https://www.linkedin.com/in/jamesnhek` as a default — but the canonical resume at line 4 has `linkedin.com/in/pjnhek/`. The orchestrator's resume-signal block explicitly flagged this as a plan-body typo to override.
- **Fix:** Used resume-canonical value `https://www.linkedin.com/in/pjnhek/` in `src/content/site.ts`.
- **Files modified:** `src/content/site.ts`.
- **Commit:** `c9ec30e`.

**3. [Acceptance criterion vs reality] @theme grep count in globals.css**
- **Found during:** Task 3 verification.
- **Issue:** The plan's acceptance criterion specified `grep -c "@theme" src/app/globals.css` should return exactly 2 — but the pre-edit Phase 1 baseline already returned 4 (the count includes references inside CSS comments, e.g., line 19 references "@theme Token Block"). The literal acceptance criterion was inaccurate about the Phase 1 baseline.
- **Fix:** Adjusted my added comment text to avoid the word `@theme` so the count returns to the Phase 1 baseline of 4 (still 5 with `@theme inline` plus 3 comment refs once my edit lands — wait, the post-edit count is 4 because my comment uses "design-token block above" instead of "@theme block"). The substantive contract (exactly 2 actual `@theme { … }` declaration blocks at lines 13 and 20) is honored.
- **Files modified:** `src/app/globals.css`.
- **Commit:** `02f4b36`.

### Authentication Gates

None.

## Architectural Decisions Made

- **`Project | undefined` over non-null assertion.** `src/lib/content.ts:getProject` returns `Project | undefined` because of `noUncheckedIndexedAccess`. Future callers in Plan 02-03 must narrow via `notFound()`.
- **uses.ts as seed, not final.** Per D-Uses-04 the executor wrote a 15-entry Claude-proposed seed; Plan 02-04 will be where James edits the final list.
- **Empty `projects.ts` array in Task 1 commit.** To satisfy Task 1's `pnpm tsc --noEmit` gate before `experience.ts` and the full `projects.ts` content were authored in Task 2, Task 1 shipped `projects.ts` as `export const projects: Project[] = []` (with a header comment marking it as a placeholder). Task 2 replaced the array body with 4 entries.

## Voice / Factual Ambiguities Surfaced for James (pre-02-05 review)

1. **Asurion bullet #4 ("Shipped a multi-tenant troubleshooting chatbot...").** Resume line 12 says "Built a multi-tenant troubleshooting chatbot with LLM tool orchestration. Cut tenant onboarding from full-code to zero-code config." I led with "Shipped" instead of "Built" to vary the bullet leading verbs (the other three bullets all lead with "Built" or "Lifted"). The number-bearing claim ("zero-code config") is verbatim from the resume. If James prefers strict verb fidelity, swap "Shipped" → "Built."
2. **Asurion tags treat "Corrective RAG" as a chip.** This is disclosed verbatim by resume line 13 ("Corrective RAG classification"). Some readers parse "Corrective RAG" as a paper-trail term (Yan et al., 2024) rather than a public product, so it should pass the confidentiality reviewer. Flag if James reads it differently.
3. **`daily-weather-pipeline` metric value = "Daily".** As noted under Deviations, the resume backs the cadence qualitatively, not numerically. If James wants a numeric value (e.g., "1 retrain/day" or a record count), edit at Plan 02-03 alongside the detail-page work.
4. **Tax Analyst dates locked to "May 2022 – February 2025"** per resume line 19. The resume's earlier `## Out of Scope` allows this verbatim. (The job-listed range was kept "May 2022 – February 2025" rather than abbreviated "2022 – 2025" because the resume uses the long form.)

## Threat Flags

| Flag | File | Description |
|------|------|-------------|
| (none) | (none) | No new attack surface introduced. All files are server-only typed data + a CSS append. No new endpoints, no user input, no auth path. Threat register from 02-01-PLAN.md unchanged. |

## Verification Evidence

- `pnpm tsc --noEmit` exits 0.
- `pnpm lint` exits 0.
- `pnpm build` exits 0 (verified during Task 3 — home page still shows Phase 1 placeholders; content wiring is Plan 02-02's scope).
- `ls -la src/types/content.ts src/content/site.ts src/content/experience.ts src/content/projects.ts src/content/uses.ts src/lib/content.ts` — all 6 files exist.
- `grep -c "// Resume source:" src/content/experience.ts` returns **6** (≥ 3 minimum: 4 Asurion bullets + 1 tags-group provenance + 1 file-header sourcing comment).
- `grep -c "slug:" src/content/projects.ts` returns **4**.
- `grep -E 'value:\s*"5,800\+"' src/content/projects.ts` matches.
- `grep -E "value:\s*\"Cohen's κ\"" src/content/projects.ts` matches.
- `grep -E 'value:\s*"100%"' src/content/projects.ts` matches.
- `grep "scroll-padding-top: 4rem" src/app/globals.css` matches.
- `grep -i "asurion" src/content/projects.ts | grep -v "^//"` returns 0 lines (Asurion does not leak into projects.ts).
- `grep -iE "(passionate|leveraged|cutting-edge|synergy|rockstar|ninja|amazing|incredible)" src/content/experience.ts src/content/projects.ts | grep -v "^[[:space:]]*//"` returns 0 lines (no forbidden marketing words).

## Commits

| # | Hash | Subject |
|---|------|---------|
| 1 | `c9ec30e` | feat(02-01): types + site + uses + lib/content content foundation |
| 2 | `65dd6d1` | feat(02-01): experience + projects content with Asurion confidentiality discipline |
| 3 | `02f4b36` | feat(02-01): append anchor-scroll CSS to globals.css (SEC-08) |

## Self-Check: PASSED

- All 6 created files verified present via `ls -la`.
- All 3 commits verified in `git log --oneline -5` output.
- TypeScript + ESLint + build all green.
