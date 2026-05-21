---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: executing
last_updated: "2026-05-21T00:11:00.000Z"
progress:
  total_phases: 4
  completed_phases: 0
  total_plans: 3
  completed_plans: 2
  percent: 0
---

# Project State: pjnhek.com — James Nhek Portfolio

**Last Updated:** 2026-05-21 (after Plan 01-02 execution)

## Project Reference

**Core Value:** A recruiter lands on pjnhek.com, immediately understands "James is a serious AI Engineer doing real RAG/eval work at Asurion," sees 3–4 substantive projects with real depth, and has an obvious way to reach out — all within 60 seconds, on a phone.

**Current Focus:** Phase 01 — foundation-slice

**Project Mode:** Vertical MVP (every phase ships a deployable, recruiter-viewable improvement)
**Granularity:** Coarse (4 phases)

## Current Position

Phase: 01 (foundation-slice) — EXECUTING
Plan: 3 of 3

- **Phase:** 1 — Foundation Slice
- **Plan:** 01-02 complete (primitives + `lib/env.ts`); next is 01-03 (GitHub repo + Vercel preview)
- **Status:** Executing Phase 01
- **Progress:** [██████░░░░] 67% (2 of 3 plans in Phase 1 complete)

```
[░░░░░░░░░░] 0/4 phases complete
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
| Confidentiality review pass on Asurion content | Yes (gated) | Not authored |

### Plan Execution Metrics

| Plan | Duration | Tasks | Files Created |
|------|----------|-------|---------------|
| 01-01 (scaffold + home shell) | 530 s (≈ 8m 50s) | 3 | 23 |
| 01-02 (primitives + lib/env.ts) | 271 s (≈ 4m 31s) | 3 | 7 |

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

### Open Todos

- [x] Run `/gsd:plan-phase 1` to decompose Phase 1 into plans
- [x] Plan 01-01 — scaffold + home shell complete (commits `ff1a96c`, `7b0f0e1`)
- [x] Plan 01-02 — primitives + `lib/env.ts` complete (commits `1c23f6e`, `3e27ca7`)
- [ ] Plan 01-03 — Vercel preview + GitHub repo (DEP-01, DEP-02)
- [ ] Confirm GitHub repo name with user (default: `pjnhek/portfolio`)
- [ ] Decide whether `james@pjnhek.com` email forwarding is in scope (affects Phase 4 DNS research)

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

`/gsd:execute-phase 1 --plan 01-03` — link GitHub repo `pjnhek/portfolio` (public + main branch protection) to Vercel, fire a smoke-test PR, confirm preview URL renders the typographically-correct shell.

### Files Created This Session

- `src/lib/env.ts` (zod-validated env parser, FOUND-10)
- `src/components/primitives/Section.tsx`
- `src/components/primitives/NumberedHeading.tsx`
- `src/components/primitives/Tag.tsx`
- `src/components/primitives/ExternalLink.tsx`
- `src/components/primitives/ArchitectureDiagram.tsx`
- `public/diagrams/_placeholder.svg` (794-byte 16:9 box-and-arrow stub)
- `.planning/phases/01-foundation-slice/01-02-SUMMARY.md`

### Files Modified This Session

- `src/app/layout.tsx` (env import; metadataBase now reads env.NEXT_PUBLIC_SITE_URL)
- `src/app/page.tsx` (5 inline sections → 5 Section primitives + 3 primitive exercises)

### Resumption Notes

If returning fresh, read in this order:

1. `.planning/PROJECT.md` — what we're building and why
2. `.planning/REQUIREMENTS.md` — the 64 v1 requirements
3. `.planning/ROADMAP.md` — phase structure + success criteria
4. `.planning/research/SUMMARY.md` — stack/architecture/pitfalls synthesis
5. This file — current position and locked decisions

---
*State initialized: 2026-05-20 after roadmap creation*
