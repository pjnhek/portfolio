# Project State: pjnhek.com — James Nhek Portfolio

**Last Updated:** 2026-05-20

## Project Reference

**Core Value:** A recruiter lands on pjnhek.com, immediately understands "James is a serious AI Engineer doing real RAG/eval work at Asurion," sees 3–4 substantive projects with real depth, and has an obvious way to reach out — all within 60 seconds, on a phone.

**Current Focus:** Phase 1 — Foundation Slice (Next.js 16 + Tailwind v4 + TS scaffold + Vercel preview)

**Project Mode:** Vertical MVP (every phase ships a deployable, recruiter-viewable improvement)
**Granularity:** Coarse (4 phases)

## Current Position

- **Phase:** 1 — Foundation Slice
- **Plan:** Not yet planned (`/gsd:plan-phase 1` to begin)
- **Status:** Roadmap complete, awaiting plan decomposition
- **Progress:** Phase 0 of 4 complete

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

### Open Todos

- [ ] Run `/gsd:plan-phase 1` to decompose Phase 1 into plans
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

`/gsd:plan-phase 1` — decompose Phase 1 (Foundation Slice) into plans.

### Files Created This Session

- `.planning/ROADMAP.md`
- `.planning/STATE.md`
- `.planning/REQUIREMENTS.md` (traceability section updated with final phase assignments)

### Resumption Notes

If returning fresh, read in this order:
1. `.planning/PROJECT.md` — what we're building and why
2. `.planning/REQUIREMENTS.md` — the 64 v1 requirements
3. `.planning/ROADMAP.md` — phase structure + success criteria
4. `.planning/research/SUMMARY.md` — stack/architecture/pitfalls synthesis
5. This file — current position and locked decisions

---
*State initialized: 2026-05-20 after roadmap creation*
