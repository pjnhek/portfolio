---
phase: 03-seo-polish-performance-accessibility
plan: 01
subsystem: seo
tags: [next.js, metadata, og-image, seo, imageresponse, satori]

# Dependency graph
requires:
  - phase: 02-content-sections-with-confidentiality-gate
    provides: "layout.tsx with basic metadata, uses/page.tsx with title+description only, projects/[slug]/page.tsx with minimal generateMetadata"
provides:
  - "buildMetadata factory (src/lib/seo.ts) producing full Metadata objects with openGraph.images + twitter.card"
  - "Static 1200x630 OG image at /opengraph-image (zero runtime CPU, Geist-Regular font, D-OG-03 content)"
  - "All three route families wired through buildMetadata — no route sets openGraph manually"
affects:
  - 03-02 (icons, sitemap, robots, not-found — consume the same hex palette and OG design language)
  - 03-03 (performance/accessibility — build baseline established by this plan)
  - 04-deploy-domain (OG card verification on production after DNS wiring)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "buildMetadata factory pattern: all route metadata flows through src/lib/seo.ts — never set openGraph manually"
    - "Static OG image via next/og ImageResponse with font walk-upward resolver (worktree/monorepo safe)"
    - "Satori hex-literal constraint: no CSS custom properties in ImageResponse JSX (use hex, not var(--))"
    - "metadataBase stays in layout.tsx only; factory never includes it (prevents accidental override)"

key-files:
  created:
    - src/lib/seo.ts
    - src/app/opengraph-image.tsx
  modified:
    - src/app/layout.tsx
    - src/app/uses/page.tsx
    - src/app/projects/[slug]/page.tsx

key-decisions:
  - "D-Font-Resolver: font path uses walk-upward search from process.cwd() rather than direct join — works in git worktrees and pnpm workspaces where node_modules does not live at project root"
  - "D-metadataBase-layout-only: metadataBase lives exclusively in layout.tsx, spread BEFORE buildMetadata result, so the factory cannot overwrite it even in future refactors"
  - "D-openGraph-always-images: every buildMetadata call includes images:[/opengraph-image] because Next.js metadata merging is shallow — per-route openGraph completely replaces layout openGraph, so images must be explicit on each call"
  - "D-slice-155: description.slice(0, 155) not 160 in projects/[slug] to keep under 160 chars with margin after factory adds OG title/desc"

patterns-established:
  - "Pattern: every route imports buildMetadata from @/lib/seo and calls it — never constructs openGraph directly"
  - "Pattern: opengraph-image.tsx uses walk-upward findFontPath() helper instead of process.cwd() join for Geist-Regular.ttf"

requirements-completed:
  - SEO-01
  - SEO-02
  - SEO-03
  - SEO-04

# Metrics
duration: 7min
completed: 2026-06-25
---

# Phase 3 Plan 01: SEO Metadata Factory + Static OG Image Summary

**buildMetadata factory in lib/seo.ts wiring openGraph + twitter.card into all three route families, plus a static 1200x630 Geist-on-off-white OG card at /opengraph-image generated at build time with zero runtime Vercel CPU**

## Performance

- **Duration:** 7m 32s
- **Started:** 2026-06-25T06:35:09Z
- **Completed:** 2026-06-25T06:42:41Z
- **Tasks:** 3
- **Files created/modified:** 5

## Accomplishments

- Created `src/lib/seo.ts` with `buildMetadata` factory that always includes `openGraph.images: ["/opengraph-image"]` and `twitter.card: "summary_large_image"` — closes the Phase 2 deferral and satisfies SEO-01/02/03
- Created `src/app/opengraph-image.tsx` — static 1200x630 OG card with Geist-Regular font, left-aligned type stack (James Nhek / AI Engineer @ Asurion / RAG · evaluations · agentic workflows / pjnhek.com), satisfying SEO-04 and D-OG-01 through D-OG-04
- Wired all three route families (layout.tsx, uses/page.tsx, projects/[slug]/page.tsx) through `buildMetadata` — no route sets openGraph manually anymore

## Task Commits

Each task was committed atomically:

1. **Task 1: Create lib/seo.ts buildMetadata factory** - `11d716b` (feat)
2. **Task 2: Create app/opengraph-image.tsx — static 1200x630 OG card** - `9275729` (feat)
3. **Task 3: Wire buildMetadata into layout.tsx, uses/page.tsx, projects/[slug]/page.tsx** - `c0136b9` (feat)

## Files Created/Modified

- `src/lib/seo.ts` — new; SERVER-ONLY buildMetadata factory; exports BuildMetadataArgs type and buildMetadata function; sets alternates.canonical, openGraph (with images), twitter.card on every call; no metadataBase
- `src/app/opengraph-image.tsx` — new; static OG PNG 1200x630; exports size/alt/contentType; Geist-Regular font via walk-upward resolver; inline hex values (#fafafa / #0a0a0a / #737373); D-OG-03 content
- `src/app/layout.tsx` — modified; added buildMetadata import; metadata export now spreads buildMetadata after metadataBase
- `src/app/uses/page.tsx` — modified; added buildMetadata import; metadata export now calls buildMetadata({ path: "/uses" }); removed Phase-3 deferral comment block
- `src/app/projects/[slug]/page.tsx` — modified; added buildMetadata import; generateMetadata return value now calls buildMetadata({ path: "/projects/${slug}" }) with slice(0, 155)

## Decisions Made

- **Font walk-upward resolver:** The canonical plan used `join(process.cwd(), "node_modules/next/dist/compiled/@vercel/og/Geist-Regular.ttf")`. This fails in git worktrees where node_modules lives in the parent repo, not the worktree root. Applied a `findFontPath()` helper that walks upward from `process.cwd()` until it finds the Geist-Regular.ttf file. This is more robust across worktrees, pnpm workspaces, and monorepos. The behavior on the main repo is identical (first iteration finds it).
- **Hex-only in ImageResponse:** Confirmed that Satori (the renderer inside ImageResponse) does not resolve CSS custom properties — used `#fafafa`, `#0a0a0a`, `#737373` as literal hex strings, matching the resolved values from globals.css oklch declarations.
- **`slice(0, 155)` in project generateMetadata:** Used 155 chars (not 160) per PATTERNS.md margin note — factory adds OG title + description, keeping total under 160.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Font path resolution in git worktree**
- **Found during:** Task 2 (opengraph-image.tsx build verification)
- **Issue:** `join(process.cwd(), "node_modules/next/dist/compiled/@vercel/og/Geist-Regular.ttf")` threw ENOENT because git worktrees do not have their own node_modules — node_modules lives in the parent repo root, not the worktree root
- **Fix:** Replaced the direct `process.cwd()` join with a `findFontPath()` async helper that walks upward from `process.cwd()` until it finds the font file, falling back to the original path (which produces a helpful ENOENT on true failure). Also attempted `createRequire(import.meta.url)` first, but Turbopack treats `import.meta.url` as a numeric module ID, not a file URL — the walk-upward approach avoids this entirely.
- **Files modified:** `src/app/opengraph-image.tsx`
- **Verification:** `pnpm build` exits 0, `/opengraph-image` appears in build output as static route
- **Committed in:** `9275729` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 — bug, font path incompatible with git worktree environment)
**Impact on plan:** Fix is additive and non-breaking. The `findFontPath()` helper is strictly more robust than the original `process.cwd()` join — it works in all three environments (main repo, git worktree, pnpm workspace). No scope creep.

## Issues Encountered

- `createRequire(import.meta.url)` inside Turbopack's build workers: Turbopack compiled `import.meta.url` to a numeric module ID rather than a `file://` URL, causing `path.dirname(require.resolve(...))` to receive a number, triggering a Node.js `ERR_INVALID_ARG_TYPE`. Resolved by switching to the walk-upward approach which only uses `process.cwd()` and `node:fs/promises` access checks — no module resolution needed.

## User Setup Required

None — no external service configuration required. The OG image is generated at build time from static content.

## Next Phase Readiness

- `buildMetadata` factory is established and proven; Plan 03-02 (icons, sitemap, robots, not-found) can import it if needed, or follow the same hex-palette pattern for icons
- Build succeeds cleanly: all 10 static pages generated (home, /uses, 4 project slugs, /opengraph-image, /_not-found, favicon route)
- TypeScript strict mode passes
- SEC-07 invariant holds: exactly 1 `"use client"` directive in the codebase (CopyEmail.tsx)

## Self-Check: PASSED

- src/lib/seo.ts: FOUND
- src/app/opengraph-image.tsx: FOUND
- 03-01-SUMMARY.md: FOUND
- Commit 11d716b (Task 1): FOUND
- Commit 9275729 (Task 2): FOUND
- Commit c0136b9 (Task 3): FOUND

---
*Phase: 03-seo-polish-performance-accessibility*
*Completed: 2026-06-25*
