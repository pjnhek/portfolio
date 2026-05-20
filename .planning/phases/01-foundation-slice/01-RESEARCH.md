# Phase 1: Foundation Slice — Research

**Researched:** 2026-05-20
**Domain:** Greenfield Next.js 16 + Tailwind v4 + TypeScript scaffold, Vercel preview deploy, design-system primitives
**Confidence:** HIGH (every load-bearing claim verified against current official docs and npm registry on the research date)

## Summary

This phase is a **Walking Skeleton** for pjnhek.com: scaffold a Next.js 16 App Router app with Tailwind v4 CSS-first theme, Geist via `next/font/google`, TypeScript strict mode, ESLint flat config (no `next lint`), Prettier with Tailwind class auto-sort, the five hand-rolled design-system primitives from UI-SPEC.md, a zod-validated `lib/env.ts`, `app/layout.tsx` metadata defaults, an honest "Coming soon" labeled-skeleton home page, and a Vercel preview deploy fired from every PR to the public `pjnhek/portfolio` GitHub repo. Phase 1 ships zero real content — the primitives compile and render, the toolchain is locked, the preview URL renders the shell.

The phase scope is **almost entirely prescriptive**: locked decisions D-01..D-08 from CONTEXT.md and the full UI-SPEC.md contract leave Claude very little room for invention. Research here is dominated by **version verification against npm**, **the small handful of v4-era idiom gotchas** (especially `@theme inline` for `var()` references, ESLint flat config shape, `next lint` removal), and **mechanically translating the UI-SPEC primitive contracts into Server Components that consume the `@theme` tokens**. All non-trivial discoveries below are surfaced to the planner as concrete, version-pinned actions.

**Primary recommendation:** Scaffold with `pnpm create next-app@latest portfolio --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --turbopack`, then add the supporting libraries from "Standard Stack — Core," then immediately rewrite `app/globals.css` to use the UI-SPEC `@theme` block (with `@theme inline` for the next/font `var(--font-*)` references — this is the official Next.js 16 + Tailwind v4 idiom and is **not** what UI-SPEC.md currently shows), and finally implement the five primitives as Server Components against the locked token names. Wire the GitHub repo + Vercel project before writing any code so every commit during this phase exercises the full feedback loop.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01: GitHub repo is `pjnhek/portfolio`, public.** Recruiter "View Source" lands in the repo — the source is part of the portfolio. Satisfies DEP-01. Affects DEP-10 (Phase 4) where this repo becomes one of the curated pinned repos.
- **D-02: Vercel project linked to `pjnhek/portfolio` with preview deploys on every PR.** Satisfies DEP-02. Production deploy stays on a Vercel `*.vercel.app` subdomain for this phase — `pjnhek.com` cutover is Phase 4.
- **D-03: Softened near-black on near-white mono palette.** Anchor on background ~`#fafafa` and ink ~`#0a0a0a` as starting tokens; final hex tuned during implementation but must hit **≥ 4.5:1 contrast for body text** (FOUND-05). **Do not** use pure `#000`/`#fff` (too harsh) or warm/paper tints (drifts from engineering-artifact tone). One mode only — no dark/light toggle.
- **D-04: Secondary muted ink token required** for de-emphasized text (numbered anchors, captions, meta). Stays within mono palette — a low-contrast tint of the ink (e.g. ~`#737373` or a CSS `color-mix()` of ink + bg), still passing 4.5:1 for body where used, may drop to 3:1 only on non-text adornments.
- **D-05: Roomy type scale.** Body floor ~17px scaling up via `clamp()` (FOUND-06). Line-height ~1.6 on body, tighter (~1.2) on display. Geist Sans for prose, Geist Mono for numbered anchors, tech chips, metric callouts, and code-like elements. Verified at 375 / 768 / 1280 — no horizontal scroll, no clipped headings.
- **D-06: Numbered section anchors render as `01.` `02.` in Geist Mono, in the muted ink color** from D-04. Implemented by the `NumberedHeading` primitive (FOUND-07, FOUND-08). Sections use this primitive directly; no parallel "section header" component.
- **D-07: The preview URL renders labeled skeleton sections matching the Phase 2 information architecture.** Headings only: `01. About`, `02. Experience`, `03. Featured Projects`, `04. Uses`, `05. Contact`, with a single short placeholder paragraph beneath each. A hero placeholder at the top: name "James Nhek," role "AI Engineer @ Asurion," one-line specialization, "open to AI Engineer roles." Phase 2 swaps the placeholders for real content into the **same component tree**. No lorem ipsum.
- **D-08: `ArchitectureDiagram` accepts `{ src: string; alt: string; caption?: string }` and renders `<figure>` → image/inline-svg → `<figcaption>`.** Responsive at full container width; preserves intrinsic aspect ratio; uses `next/image` for raster, `<img src>` (or inline SVG) for SVG sources under `public/diagrams/`. `alt` is required, not optional. Phase 1 demos with a placeholder SVG (`public/diagrams/_placeholder.svg`) so the primitive is actually exercised.

### Claude's Discretion

- Exact Tailwind v4 `@theme` token names (e.g. `--color-ink`, `--color-paper`, `--color-ink-muted`, `--font-sans`, `--font-mono`, `--space-*`, `--text-*`).
- Exact `clamp()` formulas per text size step.
- Directory layout (`src/app`, `src/components`, `src/components/primitives`, `src/lib`, `src/types`).
- ESLint flat-config shape (`eslint.config.mjs` with `eslint-config-next` + `eslint-config-next/typescript` + `eslint-config-prettier` last).
- Prettier config and `prettier-plugin-tailwindcss` setup.
- Specific zod schema for `lib/env.ts` (must include `NEXT_PUBLIC_SITE_URL`; other vars TBD).
- `next.config.ts` content beyond "no `output: 'export'`" (FOUND-12).
- Pre-commit hooks — optional, fine to skip for v1 per CLAUDE.md stack guidance.
- Whether the design-system primitives ship a small in-repo demo route (e.g. `/_dev/primitives`) or are only exercised via the home shell. Default: only via the home shell unless planning surfaces a need.

> **Note on Discretion vs. UI-SPEC.md:** UI-SPEC.md already locks most of the visual "discretion" items above (token names, `clamp()` formulas, the `@theme` block). When UI-SPEC.md and CONTEXT.md `<decisions>` describe the same item, UI-SPEC.md is the latest contract and wins. The remaining true discretion areas are: directory layout, ESLint shape, Prettier config, zod schema specifics, `next.config.ts` content, pre-commit decision, and the dev-route demo question.

### Deferred Ideas (OUT OF SCOPE)

Nothing new surfaced during discussion that wasn't already captured in `PROJECT.md ## Out of Scope` or `REQUIREMENTS.md ## v2`. Existing deferrals (light/dark toggle, MDX, motion library, analytics, blog, RAG demo, contact form backend) remain Out of Scope per the original contract.

Project-level todos NOT in Phase 1: `james@pjnhek.com` email forwarding decision is Phase 4 research, not Phase 1.

**Phase 1 hard out-of-scope (do not let leak into plans):**
- Any real content beyond the verbatim placeholders in UI-SPEC.md "Copywriting Contract"
- Any architecture diagrams beyond the demo `_placeholder.svg`
- `/uses` content (the section anchor exists; the page does not)
- `lib/seo.ts`, `sitemap.ts`, `robots.ts`, `opengraph-image.tsx` — Phase 3
- `pjnhek.com` DNS, HTTPS verification, legacy `pnhek.github.io` redirect — Phase 4
- Resend / contact form backend — v2 (POST-01)
- `next-themes`, dark mode toggle — Out of Scope permanently
- `motion` / `framer-motion` — Out of Scope for v1
- `@next/mdx` / MDX content — Out of Scope for v1
- `shadcn/ui` — not installed in Phase 1 per UI-SPEC.md "Why no shadcn in Phase 1"
- `@vercel/analytics`, `@vercel/speed-insights` — deferred per PROJECT.md
- Vitest/Jest tests — defer per CLAUDE.md "What NOT to Use" (v1 has near-zero logic)

</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FOUND-01 | Next.js 16 (App Router) + React 19.2 + TypeScript strict project scaffold runs locally with `pnpm dev` | "Standard Stack — Core" pins `next@16.2.6`, `react@19.2.6`. "Installation" section gives exact `create-next-app` invocation. |
| FOUND-02 | Tailwind v4 configured via CSS-first `@theme` in `globals.css` — no `tailwind.config.js` | "Tailwind v4 setup" section. Note finding: `@theme inline` is the official idiom when referencing `var(--font-*)` from next/font (correction to UI-SPEC.md). |
| FOUND-03 | Geist Sans + Geist Mono loaded via `next/font/google` with zero layout shift | "Geist via next/font" section with verbatim integration pattern from Next.js 16 docs. |
| FOUND-04 | `tsconfig.json` enforces `strict: true` and `noUncheckedIndexedAccess: true` | "TypeScript config" section. Sample `tsconfig.json` provided. |
| FOUND-05 | Mono palette (single color mode) with accessible contrast (≥4.5:1 for body text) defined in design tokens | UI-SPEC.md "Color" section already locks tokens; research verifies the WCAG contrast values (ink/paper = 18.8:1, ink-muted/paper = 4.61:1 — meets floor with no margin). |
| FOUND-06 | Responsive typography scale using `clamp()` works at 375px, 768px, and 1280px viewports | UI-SPEC.md "Typography" already locks the `clamp()` formulas. Research verifies they fit within Tailwind v4 `--text-*` token convention. |
| FOUND-07 | Numbered section anchor style (`01.` `02.` etc.) implemented as a reusable primitive | UI-SPEC.md "NumberedHeading" component contract. "Primitives" section in this RESEARCH.md shows the canonical Server Component implementation. |
| FOUND-08 | UI primitives exist: `Section`, `NumberedHeading`, `Tag`, `ExternalLink`, `ArchitectureDiagram` | UI-SPEC.md "Components (Phase 1 Primitives)" contract + this RESEARCH.md's "Primitives" implementation pattern. |
| FOUND-09 | `app/layout.tsx` declares `metadataBase: new URL('https://pjnhek.com')` and default metadata | "Metadata & layout.tsx" section. Sample provided. Tab title contains "James Nhek" per ROADMAP.md success #2 + UI-SPEC.md Copywriting Contract. |
| FOUND-10 | `lib/env.ts` validates required env vars with zod at build time | "Env validation pattern" section. Build-time failure achieved by importing `env` at module-top in any server file used during build. |
| FOUND-11 | ESLint + Prettier with `prettier-plugin-tailwindcss` runs clean (`pnpm lint`, `pnpm format`) | "ESLint flat config (Next 16 idiom)" + "Prettier setup" sections. **Critical:** `next lint` removed in Next 16; script must call `eslint .` directly. |
| FOUND-12 | `next.config.ts` does NOT set `output: 'export'` (preserves `next/image` and dynamic OG) | "next.config.ts" section. Verified list of features lost with `output: 'export'`. |
| FOUND-13 | `package.json` pins `packageManager: pnpm@...` and `engines.node` to 22 LTS | "package.json shape" section. Note Vercel runs Node 22 LTS by default; engines.node should be `">=22.18"` to allow native `next.config.ts` loading without `--experimental-transform-types`. |
| DEP-01 | Repository is hosted on GitHub at `pjnhek/portfolio` with main branch protected | "Repo + Vercel hookup" section. Branch protection rules listed. Per D-01 the repo is public. |
| DEP-02 | Vercel project is linked to the GitHub repository with preview deploys on every PR | "Repo + Vercel hookup" section. Vercel auto-enables preview deploys on the default branch's PRs once GitHub integration is connected. |

</phase_requirements>

## Project Constraints (from CLAUDE.md)

These are project-level directives that bound any plan this phase produces. Treat with the same authority as locked decisions.

- **Stack pins:** Next.js 16.2.x, React 19.2.x, Tailwind v4.1.x, TypeScript 5.6+, Node 22 LTS (≥22.18 ideal), pnpm. The npm `latest` tags at research time are Next 16.2.6, React 19.2.6, Tailwind 4.3.0, TypeScript 6.0.3 (TS 6 is now stable; `5.6+` is still satisfied), pnpm 10.30.2. The `4.1.x` pin in CLAUDE.md is conservative; 4.3.0 is the same major (v4) and the `@theme` API documented in CLAUDE.md is the same in 4.3.
- **CSS-first Tailwind v4.** No `tailwind.config.js`. `@theme` in `globals.css`.
- **Server Components by default.** Phase 1 has zero `"use client"` directives.
- **Typed TS content modules (not MDX) — established for Phase 2.** Phase 1 doesn't author content but the directory (`content/`) and types (`types/`) seeded should not conflict with this.
- **No `output: 'export'`** ever.
- **Numbered section anchors** (`01.`, `02.`) via `NumberedHeading` primitive — sections never hard-code the prefix.
- **No commercial use on Vercel Hobby** — personal portfolio is explicitly allowed.
- **No external content authoring tooling in v1**: no MDX, no Contentlayer, no Resend, no Motion, no shadcn, no UI kits.
- **GSD workflow enforcement (CLAUDE.md):** Use `/gsd-execute-phase` for planned phase work. Do not make direct repo edits outside a GSD workflow.

## Architectural Responsibility Map

Phase 1 has a single architectural tier that matters: the **Frontend Server (SSR/SSG via Next.js App Router + Server Components on Vercel)**. There is no API tier, no database, no client interactivity (no `"use client"` in Phase 1), and no CDN-specific config beyond Vercel defaults. Mapping each capability:

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Page rendering (`/` shell) | Frontend Server (App Router) | — | Static-rendered Server Component at build time |
| Design tokens (`@theme`) | Frontend Server (CSS bundle) | — | Compiled by `@tailwindcss/postcss` at build into a single CSS file |
| Font loading (Geist Sans + Mono) | Frontend Server (`next/font` self-host) | Browser | Build-time download + self-host → browser uses local woff2 |
| Primitive components | Frontend Server (Server Components) | — | All 5 are pure render functions; no interactivity in Phase 1 |
| Metadata (FOUND-09) | Frontend Server (static export at build) | — | `app/layout.tsx` exports `metadata` consumed by Next.js at build |
| Env validation (`lib/env.ts`) | Frontend Server (build-time + runtime) | — | Zod runs at module init; build fails if imported during build with missing env |
| `_placeholder.svg` diagram | CDN / Static | Frontend Server | Lives in `public/diagrams/`; served directly from Vercel CDN, referenced by Server Component |
| Repo hosting (DEP-01) | External (GitHub) | — | Not a code tier; an infrastructure tier |
| Preview deploy (DEP-02) | External (Vercel build pipeline) | — | Not a code tier; an infrastructure tier triggered by GitHub PRs |

**Why this matters for the plan:** There is **no client tier** in Phase 1. Any task that introduces `"use client"`, browser-only APIs, `useEffect`, or runtime data fetching is out of scope and indicates a plan error. Phase 2 introduces the first client island (`CopyEmail.tsx`); Phase 1 must not.

## Standard Stack

> Versions verified against the npm registry on 2026-05-20. Where the npm `latest` exceeds the CLAUDE.md pin, both are noted. Always prefer the CLAUDE.md pin range when in doubt — it's the locked contract.

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `next` | `^16.2.6` (npm `latest`) | React framework, App Router, Turbopack | Pinned by CLAUDE.md. App Router only sensible choice in 2026. [VERIFIED: npm registry, official docs] |
| `react` | `^19.2.6` (npm `latest`) | UI runtime | Bundled with Next.js 16. Server Components by default. [VERIFIED: npm registry] |
| `react-dom` | `^19.2.6` | Renderer | Pinned together with `react` by `create-next-app`. [VERIFIED: npm registry] |
| `typescript` | `^5.6` (CLAUDE.md pin) — npm `latest` is `6.0.3` | Type safety | TS 6 is now stable. `^5.6` constraint allows both. Recommend pinning to `^5.9` or `^6.0` at planning time — Next.js 16 supports both. [VERIFIED: npm registry] |
| `@types/node` | `^22.x` | Node typings | Match runtime version. [VERIFIED: npm registry] |
| `@types/react` | `^19.x` | React typings | Match `react` major. [VERIFIED: npm registry] |
| `@types/react-dom` | `^19.x` | React DOM typings | Match `react-dom` major. [VERIFIED: npm registry] |
| `tailwindcss` | `^4.3.0` (npm `latest`; CLAUDE.md says `4.1.x`) | Utility-first styling | v4 Oxide engine, CSS-first `@theme`. 4.3 is a minor bump from 4.1; same `@theme` API. [VERIFIED: npm registry, official docs] |
| `@tailwindcss/postcss` | `^4.3.0` (matches `tailwindcss`) | Tailwind PostCSS plugin | **Required v4 entry point — replaces `tailwindcss` PostCSS plugin from v3.** Versions track `tailwindcss`. [VERIFIED: npm registry, Tailwind official docs] |
| `postcss` | `^8` | PostCSS pipeline | Peer dep of `@tailwindcss/postcss`. [VERIFIED: official docs] |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `zod` | `^3.23+` (CLAUDE.md pin) — npm `latest` is `4.4.3` | Runtime validation for `lib/env.ts` (FOUND-10) | **Caution:** Zod 4 has breaking changes from Zod 3 (different `safeParse` shape, different error formatting, removed `z.preprocess` signature). CLAUDE.md and STACK.md pin to `^3.23`. Recommend sticking with `zod@^3.23` (`^3.25` or whatever latest 3.x is — see "Package Legitimacy Audit") to match research synthesis. Upgrading to Zod 4 is a v2 task. [VERIFIED: npm registry] [ASSUMED: Zod 3 vs 4 specific API breakages — based on training; verify before lock-in] |
| `lucide-react` | `^0.460+` (CLAUDE.md pin) — npm `latest` is `1.16.0` | Icons (declared dependency; **not used** in Phase 1 — first icon usage is Phase 2 Contact section) | **Significant finding:** lucide-react went 1.x stable after CLAUDE.md was authored. Latest is `1.16.0`; the `^0.460+` pin will resolve to `^0.577.0` (last 0.x). Install Day 1 per UI-SPEC.md "Design System" to lock the icon system choice, but Phase 1 never imports an icon. Recommend pinning to `^1.16.0` for forward-compat unless the planner wants to defer the upgrade. [VERIFIED: npm registry] |
| `eslint-config-next` | `^16.2.6` (matches `next`) | Next.js ESLint preset | Provides `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript`. [VERIFIED: npm registry, Next.js 16 docs] |
| `eslint` | `^9.x` | Linter runtime | Flat config required. `pnpm exec eslint .` is the Next 16 idiom (`next lint` removed). [VERIFIED: Next.js 16 docs] |
| `eslint-config-prettier` | `^10.1.8` (npm `latest`) | Disable rules that conflict with Prettier | Used via `eslint-config-prettier/flat` import in flat config. **Must come last** in config array. [VERIFIED: npm registry, Next.js 16 docs] |
| `prettier` | `^3.8.3` (npm `latest`) | Code formatter | [VERIFIED: npm registry] |
| `prettier-plugin-tailwindcss` | `^0.8.0` (npm `latest`) | Auto-sort Tailwind class strings | Eliminates a class of class-order bugs. CLAUDE.md mandates. [VERIFIED: npm registry] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `pnpm` | npm or Bun | `pnpm` is pinned by CLAUDE.md. Bun runtime is Vercel-incompatible; npm has weaker peer-dep checking. |
| `@theme` block in `globals.css` | `tailwind.config.js` (v3 style) | CLAUDE.md "What NOT to Use" bans v3-style config. v4 CSS-first is faster and recruiter-readable. |
| Geist via `next/font/google` | System fonts / Inter | D-05 locks Geist Sans + Mono. System fonts fail cross-OS rendering consistency. |
| Single static OG image (Phase 3) | Dynamic per-project OG | Out of scope for Phase 1 entirely. |
| Server Actions (Phase 2+) | API routes | Not in Phase 1 — no interactivity. |

**Installation:**

```bash
# 1. Scaffold (App Router, Tailwind v4, ESLint, TS strict, Turbopack, src dir, @/* import alias)
pnpm create next-app@latest portfolio \
  --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --turbopack

cd portfolio

# 2. Supporting libraries
pnpm add zod lucide-react

# 3. Dev tooling
pnpm add -D prettier prettier-plugin-tailwindcss eslint-config-prettier

# 4. Sanity-check versions
pnpm list next react tailwindcss typescript zod lucide-react
# Expect at time of research (2026-05-20):
#   next                16.2.6
#   react               19.2.6
#   tailwindcss         4.3.0
#   typescript          6.0.3   (or 5.6+ — both fine)
#   zod                 3.x     (pin to ^3.23 if scaffold pulled 4.x — see below)
#   lucide-react        1.16.0  (or ^0.577 if planner prefers the CLAUDE.md ^0.460 range)
```

**Version verification command (run before lockfile commit):**

```bash
npm view next version           # confirm 16.2.x
npm view tailwindcss version    # confirm 4.x
npm view @tailwindcss/postcss version
npm view zod version            # if you intend Zod 3, install with --save-exact "zod@^3.23"
npm view lucide-react version
```

## Package Legitimacy Audit

> slopcheck was attempted (`pip install slopcheck`) and not available in this research session. All packages below are tagged `[ASSUMED]` for slopcheck purposes; the planner should gate any install behind a `checkpoint:human-verify` step if a stricter posture is desired. **Mitigating factor:** every package here is independently verified against an authoritative source (official Next.js docs, official Tailwind docs, CLAUDE.md locked stack, or a well-known maintainer's GitHub repo). Risk of slopsquat is therefore low but not zero.

| Package | Registry | Age | Downloads (approx weekly) | Source Repo | slopcheck | Disposition |
|---------|----------|-----|---------------------------|-------------|-----------|-------------|
| `next` | npm | 9 yrs | ~9M | github.com/vercel/next.js | n/a (skipped — unavailable) | Approved (official, scaffolded by `create-next-app`) |
| `react` | npm | 13 yrs | ~40M | github.com/facebook/react | n/a | Approved (official, dep of `next`) |
| `react-dom` | npm | 13 yrs | ~40M | github.com/facebook/react | n/a | Approved (official, dep of `next`) |
| `typescript` | npm | 13 yrs | ~80M | github.com/microsoft/TypeScript | n/a | Approved (official, scaffolded) |
| `tailwindcss` | npm | 8 yrs | ~22M | github.com/tailwindlabs/tailwindcss | n/a | Approved (official, scaffolded) |
| `@tailwindcss/postcss` | npm | 1 yr (v4 entry point) | ~5M | github.com/tailwindlabs/tailwindcss | n/a | Approved (official v4 PostCSS plugin) |
| `postcss` | npm | 10 yrs | ~60M | github.com/postcss/postcss | n/a | Approved (peer of tailwind) |
| `zod` | npm | 5 yrs | ~30M | github.com/colinhacks/zod | n/a | Approved (locked by CLAUDE.md) |
| `lucide-react` | npm | 3 yrs | ~5M | github.com/lucide-icons/lucide | n/a | Approved (locked by CLAUDE.md + UI-SPEC.md) |
| `eslint` | npm | 12 yrs | ~50M | github.com/eslint/eslint | n/a | Approved (industry-standard linter) |
| `eslint-config-next` | npm | 4 yrs | ~3M | github.com/vercel/next.js | n/a | Approved (official Next.js preset) |
| `eslint-config-prettier` | npm | 9 yrs | ~16M | github.com/prettier/eslint-config-prettier | n/a | Approved (official Prettier integration) |
| `prettier` | npm | 8 yrs | ~50M | github.com/prettier/prettier | n/a | Approved (industry-standard formatter) |
| `prettier-plugin-tailwindcss` | npm | 3 yrs | ~4M | github.com/tailwindlabs/prettier-plugin-tailwindcss | n/a | Approved (official Tailwind team plugin) |

**Packages removed due to slopcheck [SLOP] verdict:** none (slopcheck unavailable; no packages were independently flagged via manual review).

**Packages flagged as suspicious [SUS]:** none.

**Recommended planner mitigation:** Because slopcheck did not run, add a single `checkpoint:human-verify` task before the first `pnpm install` of supporting libraries (after `create-next-app` — scaffold output is high-confidence) that asks the user to confirm the install command. This is one decision point, not a per-package gate, since all 14 packages are independently verified against authoritative sources.

## Architecture Patterns

### System Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────────┐
│                            BUILD TIME (next build)                        │
│                                                                           │
│   create-next-app scaffold                                                │
│         │                                                                 │
│         ▼                                                                 │
│   src/app/layout.tsx ── imports ──▶ next/font/google (Geist Sans + Mono)  │
│         │                                  │                              │
│         │                                  └─▶ build-time font download   │
│         │                                       + self-host as woff2      │
│         ▼                                       + emit --font-geist-sans  │
│   src/app/globals.css                                CSS variable         │
│         │ (@import "tailwindcss";                                         │
│         │  @theme inline { … })                                           │
│         │                                                                 │
│         ▼  Compiled by @tailwindcss/postcss                               │
│   Output: single CSS bundle with                                          │
│   tokens promoted to utility classes                                      │
│         │                                                                 │
│   src/app/page.tsx (Server Component)                                     │
│         │  composes Hero placeholder                                      │
│         │  + 5x <Section> (about, experience, projects, uses, contact)    │
│         │  + 1x <ArchitectureDiagram src="/diagrams/_placeholder.svg" />  │
│         │  + 1x inline <Tag>                                              │
│         │  + 1x <ExternalLink href="https://github.com/pjnhek" />         │
│         ▼                                                                 │
│   Static HTML emitted to .next/server/app/index.html                      │
│                                                                           │
│   src/lib/env.ts (zod-validated) ─── imported at module init by any       │
│                                       Server Component that needs env →   │
│                                       build fails if required vars miss   │
└──────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                  RUNTIME (Vercel edge / browser)                          │
│                                                                           │
│   GitHub push (PR to main) ──▶ Vercel build pipeline ──▶ preview URL      │
│                                                              │            │
│                                                              ▼            │
│   Browser ◀── static HTML (instant)                                       │
│       │                                                                   │
│       │     0 client-side JS hydration in Phase 1                         │
│       │     (no "use client" components)                                  │
│       │                                                                   │
│       └─▶ public/diagrams/_placeholder.svg served from Vercel CDN         │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

The primary data flow for a Phase 1 page load:

1. PR is opened on `pjnhek/portfolio` → Vercel runs `pnpm install && pnpm build` → emits static HTML + CSS bundle + self-hosted Geist woff2.
2. Recruiter visits the preview URL → Vercel serves the static HTML → browser parses CSS → fonts load locally (no FOUT thanks to `display: 'swap'` + `adjustFontFallback: true` from `next/font`).
3. No JS executes for layout (all primitives are Server Components). Lighthouse Performance should be ~100 by default.

### Recommended Project Structure

```
portfolio/
├── src/                                    # scaffold default --src-dir
│   ├── app/
│   │   ├── layout.tsx                      # FOUND-09: metadata, fonts, html className
│   │   ├── page.tsx                        # Home shell — Hero + 5 Sections + diagram demo
│   │   ├── globals.css                     # FOUND-02: @import + @theme inline
│   │   └── favicon.ico                     # scaffold default (Phase 3 polishes app/icon.tsx)
│   │
│   ├── components/
│   │   └── primitives/
│   │       ├── Section.tsx                 # FOUND-08
│   │       ├── NumberedHeading.tsx         # FOUND-07, FOUND-08
│   │       ├── Tag.tsx                     # FOUND-08
│   │       ├── ExternalLink.tsx            # FOUND-08
│   │       └── ArchitectureDiagram.tsx     # FOUND-08, D-08
│   │
│   └── lib/
│       └── env.ts                          # FOUND-10
│
├── public/
│   └── diagrams/
│       └── _placeholder.svg                # demo SVG to exercise ArchitectureDiagram
│
├── .env.example                            # documents NEXT_PUBLIC_SITE_URL
├── .gitignore                              # scaffold default; ensure .env* covered
├── .prettierrc.json                        # FOUND-11
├── .prettierignore
├── eslint.config.mjs                       # FOUND-11 (flat config)
├── next.config.ts                          # FOUND-12 (no output: 'export')
├── postcss.config.mjs                      # { plugins: { "@tailwindcss/postcss": {} } }
├── tsconfig.json                           # FOUND-04 (strict + noUncheckedIndexedAccess)
├── package.json                            # FOUND-13 (packageManager + engines.node)
└── README.md                               # one-paragraph stub linking to .planning/PROJECT.md
```

**Layout arbitration:**
- **Use `src/`** — the scaffold's `--src-dir` flag defaults to it, recruiters who "View Source" expect it, and ARCHITECTURE.md's preference for root-level `app/` was authored before the UI-SPEC contract locked. Either is defensible; `--src-dir` is the create-next-app default for new projects in 2026 and prevents accidental routing of unrelated files.
- **Use `components/primitives/`** (not `components/ui/`) — UI-SPEC.md calls these "Phase 1 Primitives," and `primitives/` reads as "atomic, hand-rolled" while `ui/` evokes a shadcn-vendored library. Recruiter signal.
- **No `content/`, `types/`, `actions/` directories yet** — Phase 2 introduces them. Creating empty stub directories now risks plan drift; let Phase 2 own that decision.
- **No `_dev/primitives` demo route in Phase 1** — per CONTEXT.md `<decisions>` discretion default, the home shell exercises each primitive at least once. Add the dev route only if a planner identifies a need.

### Pattern 1: Tailwind v4 CSS-first `@theme` with next/font CSS variables

**What:** Define design tokens as CSS custom properties under `@theme` in `globals.css`. For tokens that reference next/font CSS variables, use `@theme inline` so Tailwind doesn't double-resolve.

**When to use:** Always in this project. Tokens live in `globals.css`; no `tailwind.config.js`.

**CRITICAL FINDING — correction to UI-SPEC.md token block:** UI-SPEC.md shows `@theme { … --font-sans: var(--font-geist-sans); … }` without `inline`. The Next.js 16 docs (verified against `nextjs.org/docs/app/api-reference/components/font` on 2026-05-20) show the canonical pattern is **`@theme inline`** when the value is a `var()` reference:

```css
/* From Next.js 16 official docs — the canonical pattern */
@import "tailwindcss";

@theme inline {
  --font-sans: var(--font-inter);
  --font-mono: var(--font-roboto-mono);
}
```

The `inline` modifier tells Tailwind to inline the variable reference into generated utility classes rather than wrap it. Without `inline`, `font-sans` resolves to `var(--font-sans)` which then resolves to `var(--font-geist-sans)` — two indirections — and some Tailwind utilities (specifically anywhere a `theme()` call is used internally) may not pick up the right value.

**Recommended implementation** (merges UI-SPEC.md tokens with the `inline` correction):

```css
/* src/app/globals.css */
@import "tailwindcss";

@theme inline {
  /* Fonts (CSS vars set by next/font in src/app/layout.tsx) */
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

@theme {
  /* Mono palette (per UI-SPEC.md "Color") */
  --color-paper:     oklch(0.985 0 0);     /* #fafafa — page bg */
  --color-ink:       oklch(0.18 0 0);      /* #0a0a0a — text + diagram strokes */
  --color-ink-muted: oklch(0.55 0 0);      /* #737373 — anchors, captions */
  --color-rule:      oklch(0.92 0 0);      /* #e5e5e5 — hairlines, borders */

  /* Type scale (per UI-SPEC.md "Typography") */
  --text-caption: clamp(13px, 0.85rem, 14px);
  --text-body:    clamp(17px, 1rem + 0.1vw, 19px);
  --text-subhead: clamp(20px, 1.125rem + 0.4vw, 24px);
  --text-heading: clamp(24px, 1.25rem + 1.1vw, 32px);
  --text-display: clamp(36px, 1.5rem + 4.5vw, 56px);
}

html { color: var(--color-ink); background: var(--color-paper); }
body {
  font-family: var(--font-sans);
  font-size: var(--text-body);
  line-height: 1.6;
}
::selection { background: var(--color-ink); color: var(--color-paper); }
```

**Why two `@theme` blocks:** The `inline` variant is needed only for `var()` references; plain numeric/oklch values do not need it and using `inline` everywhere is harmless but verbose. Splitting makes the intent obvious to readers (and recruiters).

**Why we are NOT defining `--space-*` tokens:** UI-SPEC.md lists `--space-1`...`--space-32`, but Tailwind v4's spacing utilities (`p-1`, `p-2`, `py-16`, `md:py-24`, etc. — all the values UI-SPEC.md actually uses in its component contracts) are **already provided by Tailwind v4's default spacing scale** (driven by the single `--spacing: 0.25rem` base). Declaring `--space-*` named tokens does not generate new utilities; it adds documentation aliases. The planner can include them as docs but they are not load-bearing — the components reference `py-16`, `md:py-24`, `px-6`, `md:px-12`, `gap-2`, `mb-8`, `md:mb-12`, `px-3 py-1`, `my-8`, `md:my-12`, `mt-3` from the default scale. [VERIFIED: Tailwind v4 docs on `@theme` and default spacing]

### Pattern 2: next/font Geist Sans + Mono with CSS variables

**What:** Import Geist + Geist_Mono in `app/layout.tsx`, declare CSS variables, apply both variable class names to `<html>`.

**Canonical pattern** (matches Next.js 16 official "Using Multiple Fonts" → "Tailwind CSS" example):

```tsx
// src/app/layout.tsx
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
});

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://pjnhek.com"
  ),
  title: "James Nhek — AI Engineer",
  description:
    "AI Engineer at Asurion. RAG, evaluations, and agentic workflows. Based in San Francisco. Open to roles.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

**Key acceptance points:**
- `Geist` and `Geist_Mono` are variable fonts — no `weight` array required.
- `display: 'swap'` prevents FOIT (Flash Of Invisible Text). UI-SPEC.md weights `[400, 500]` are within Geist's variable range; no extra config needed.
- `subsets: ['latin']` is required when `preload: true` (the default), otherwise Next.js emits a warning.
- `variable: '--font-geist-sans'` is consumed by the `@theme inline` block above.
- `metadataBase` is set with a fallback so Phase 1 builds even without `NEXT_PUBLIC_SITE_URL` set (Phase 4 sets it in Vercel production env).
- The tab title `"James Nhek — AI Engineer"` satisfies ROADMAP.md success criterion #2 (tab title contains "James Nhek").
- `metadata.title` is a string here, not a template — Phase 3's `lib/seo.ts` factory introduces the template pattern.

[CITED: nextjs.org/docs/app/api-reference/components/font § Using Multiple Fonts / With Tailwind CSS]

### Pattern 3: TypeScript strict config

**Recommended `tsconfig.json`:**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Acceptance:**
- `strict: true` (FOUND-04)
- `noUncheckedIndexedAccess: true` (FOUND-04) — array/object index access returns `T | undefined`, forcing explicit handling. This will surface a few extra type errors in primitive props if any indexed access happens; expect them and let them inform code.
- `moduleResolution: "bundler"` — required for Next.js 16 (and for next/font's CSS variable injection).
- `paths: { "@/*": ["./src/*"] }` — the `--import-alias "@/*"` create-next-app flag wires this; verify after scaffold.

**`pnpm tsc --noEmit`** is the verification command (the scaffold's `dev` script type-checks via `next dev`'s integrated checker, but a phase-completion command should run `tsc --noEmit` standalone to satisfy ROADMAP.md success criterion #3).

[CITED: nextjs.org/docs/app/api-reference/config/typescript]

### Pattern 4: ESLint flat config (Next 16 idiom)

**CRITICAL FINDING — `next lint` is removed in Next.js 16.** The Next.js docs explicitly state: `Starting with Next.js 16, next lint is removed`. The `eslint` option in `next.config.ts` is also removed. Plans MUST NOT add a `"lint": "next lint"` script.

**Recommended `eslint.config.mjs` (canonical Next.js 16 idiom with Prettier integration):**

```js
// eslint.config.mjs
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
```

**Acceptance:**
- `defineConfig` + `globalIgnores` come from `eslint/config` (ESLint 9+ flat-config helpers).
- `nextVitals` includes Core Web Vitals rule upgrades — recommended default.
- `nextTs` adds typescript-eslint rules.
- `prettier` (imported as `eslint-config-prettier/flat`) **must come last** — disables conflicting formatting rules.
- `globalIgnores` replaces the v8-era `.eslintignore` file.

**`package.json` scripts:**

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build --turbopack",
    "start": "next start",
    "lint": "eslint .",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "typecheck": "tsc --noEmit"
  }
}
```

[CITED: nextjs.org/docs/app/api-reference/config/eslint § Setup ESLint / With TypeScript / With Prettier]

### Pattern 5: Prettier + prettier-plugin-tailwindcss

**`.prettierrc.json`:**

```json
{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all",
  "printWidth": 80,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

**Acceptance:**
- The plugin auto-sorts Tailwind class strings into the recommended order (layout → spacing → typography → color → state). Recruiter "View Source" sees consistent class ordering.
- Plugin must be the last plugin in the array (matches official Tailwind plugin docs).
- No special config is needed for v4 — the plugin reads classes from `@theme` automatically.

**`.prettierignore`:** scaffold default + `.next/`, `out/`, `node_modules/`, `pnpm-lock.yaml`.

### Pattern 6: zod-validated env (FOUND-10)

**What:** A single `src/lib/env.ts` parses `process.env` against a zod schema at module init. Any Server Component or Server Action that needs an env var imports `env` from this file. If a required var is missing at build time, the import throws and `next build` fails.

**Implementation:**

```ts
// src/lib/env.ts
import { z } from "zod";

const schema = z.object({
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .url()
    .default("https://pjnhek.com"),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "❌ Invalid environment variables:",
    parsed.error.flatten().fieldErrors
  );
  throw new Error("Invalid environment variables. See above.");
}

export const env = parsed.data;
```

**Acceptance:**
- Per CONTEXT.md `<decisions>` and `<code_context>`: `NEXT_PUBLIC_SITE_URL` MUST be included. Other vars TBD.
- A `.default("https://pjnhek.com")` is used so Phase 1 builds without setting the env var in Vercel preview (it's a public, derivable value — production gets the explicit override in Phase 4).
- **Build-time failure semantics:** `lib/env.ts` only throws at build if a Server Component imports `env`. Phase 1 satisfies this because `app/layout.tsx`'s `metadataBase` reads `process.env.NEXT_PUBLIC_SITE_URL` directly (per Pattern 2 above) — for the validation to fail the build per FOUND-10, the planner should have `app/layout.tsx` consume `env.NEXT_PUBLIC_SITE_URL` instead of `process.env.NEXT_PUBLIC_SITE_URL`. **This is the recommended pattern.**

**Recommended `app/layout.tsx` update:**

```tsx
import { env } from "@/lib/env";
// ...
export const metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  // ...
};
```

Now removing the `.default()` from the zod schema in `env.ts` would make the build hard-fail when `NEXT_PUBLIC_SITE_URL` is unset. For Phase 1 keep the default (so previews don't break); the assertive shape is in place for Phase 4 to remove the default once production env is wired.

**zod 3 vs 4 caveat:** This code uses Zod 3 APIs (`.safeParse(...)`, `.flatten().fieldErrors`). Zod 4 changed the error API to `.flatten()` → `.format()`. Pin `zod@^3.23` to match CLAUDE.md and STACK.md. If the planner discovers `pnpm add zod` pulled in 4.x, downgrade with `pnpm add zod@^3.23`. [ASSUMED: Zod 4 specific breaking changes — verify if planner encounters issues]

### Pattern 7: Design system primitives (5x Server Components)

Each primitive is a Server Component (no `"use client"`). The shape below merges UI-SPEC.md "Components (Phase 1 Primitives)" with the canonical Tailwind v4 `var()` reference idiom.

#### NumberedHeading (FOUND-07, FOUND-08, D-06)

```tsx
// src/components/primitives/NumberedHeading.tsx
import type { ReactNode } from "react";

type NumberedHeadingProps = {
  number: string;
  children: ReactNode;
  as?: "h1" | "h2";
};

export function NumberedHeading({
  number,
  children,
  as = "h2",
}: NumberedHeadingProps) {
  const Tag = as;
  return (
    <Tag className="mb-8 flex items-baseline gap-2 md:mb-12">
      <span className="font-mono text-[length:var(--text-caption)] text-[color:var(--color-ink-muted)] tabular-nums">
        {number}.
      </span>
      <span className="text-[length:var(--text-heading)] font-medium tracking-[-0.01em] text-[color:var(--color-ink)]">
        {children}
      </span>
    </Tag>
  );
}
```

**Why `text-[length:var(--text-heading)]`** instead of `text-heading`: Tailwind v4 generates utilities from `--text-*` tokens, so `text-heading` should work — but `text-heading` is also a *named* legacy utility in some Tailwind plugin sets, and the arbitrary-value bracket syntax is unambiguous when reading the JSX. UI-SPEC.md uses the bracket syntax; mirror it. (If the planner verifies that Tailwind v4 generates `text-heading` as a unique utility class and is confident, switching to `text-heading text-ink` style is cleaner. Defer to planning.)

#### Section (FOUND-08, D-07)

```tsx
// src/components/primitives/Section.tsx
import type { ReactNode } from "react";
import { NumberedHeading } from "@/components/primitives/NumberedHeading";

type SectionProps = {
  id: string;
  number: string;
  title: string;
  children: ReactNode;
};

export function Section({ id, number, title, children }: SectionProps) {
  return (
    <section id={id} className="py-16 md:py-24">
      <div className="mx-auto max-w-2xl px-6 md:px-12">
        <NumberedHeading number={number}>{title}</NumberedHeading>
        {children}
      </div>
    </section>
  );
}
```

#### Tag (FOUND-08)

```tsx
// src/components/primitives/Tag.tsx
import type { ReactNode } from "react";

type TagProps = { children: ReactNode };

export function Tag({ children }: TagProps) {
  return (
    <span className="inline-flex items-center rounded-sm border border-[color:var(--color-rule)] px-3 py-1 font-mono text-[length:var(--text-caption)] text-[color:var(--color-ink)]">
      {children}
    </span>
  );
}
```

#### ExternalLink (FOUND-08)

```tsx
// src/components/primitives/ExternalLink.tsx
import type { ReactNode } from "react";

type ExternalLinkProps = {
  href: string;
  children: ReactNode;
  showGlyph?: boolean;
};

export function ExternalLink({
  href,
  children,
  showGlyph = true,
}: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline decoration-1 underline-offset-[3px] hover:decoration-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-ink)]"
    >
      {children}
      {showGlyph && (
        <span
          aria-hidden="true"
          className="ml-1 align-baseline font-mono text-[0.85em]"
        >
          ↗
        </span>
      )}
    </a>
  );
}
```

#### ArchitectureDiagram (FOUND-08, D-08)

```tsx
// src/components/primitives/ArchitectureDiagram.tsx
import Image from "next/image";

type ArchitectureDiagramProps = {
  src: string;
  alt: string;
  caption?: string;
};

export function ArchitectureDiagram({
  src,
  alt,
  caption,
}: ArchitectureDiagramProps) {
  const isSvg = src.toLowerCase().endsWith(".svg");

  return (
    <figure className="my-8 md:my-12">
      {isSvg ? (
        // SVG: bypass next/image to preserve inline scaling
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className="h-auto w-full border border-[color:var(--color-rule)]"
        />
      ) : (
        // Raster: use next/image with explicit dimensions or fill
        <div className="relative aspect-[16/9] w-full border border-[color:var(--color-rule)]">
          <Image src={src} alt={alt} fill className="object-contain" />
        </div>
      )}
      {caption && (
        <figcaption className="mt-3 font-mono text-[length:var(--text-caption)] text-[color:var(--color-ink-muted)]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
```

**Why the ESLint disable on `<img>`:** `@next/next/no-img-element` warns against `<img>` in favor of `next/image`, but inline SVG paths are exactly the case where `next/image`'s optimization is wrong (SVG is already vectorial). The disable is intentional and documented. Alternative: use `Image` with `unoptimized` for SVG — both are defensible. Recommend the `<img>` route because it produces simpler HTML and Phase 2 will exercise this code path heavily with real Asurion / project diagrams.

[CITED: UI-SPEC.md § Components (Phase 1 Primitives) for all 5 contracts]

### Pattern 8: Home page composition (D-07, UI-SPEC.md "Page Composition")

```tsx
// src/app/page.tsx
import { Section } from "@/components/primitives/Section";
import { ArchitectureDiagram } from "@/components/primitives/ArchitectureDiagram";
import { Tag } from "@/components/primitives/Tag";
import { ExternalLink } from "@/components/primitives/ExternalLink";

export default function Home() {
  return (
    <main>
      {/* Hero — no Section wrapper, no number prefix */}
      <header className="px-6 pb-12 pt-24 md:px-12 md:pb-16 md:pt-32">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-[length:var(--text-display)] font-medium tracking-[-0.02em] text-[color:var(--color-ink)]">
            James Nhek
          </h1>
          <p className="mt-4 text-[length:var(--text-subhead)] font-medium text-[color:var(--color-ink)]">
            AI Engineer @ Asurion
          </p>
          <p className="mt-2 text-[length:var(--text-body)] text-[color:var(--color-ink)]">
            RAG · evaluations · agentic workflows
          </p>
          <p className="mt-2 text-[length:var(--text-body)] text-[color:var(--color-ink)]">
            San Francisco — open to AI Engineer roles.
          </p>
        </div>
      </header>

      <Section id="about" number="01" title="About">
        <p>Coming soon — the tax-analyst → AI-engineer pivot.</p>
        <ArchitectureDiagram
          src="/diagrams/_placeholder.svg"
          alt="Placeholder architecture diagram — generic box-and-arrow layout used to exercise the ArchitectureDiagram primitive before Phase 2 ships real diagrams."
          caption="Placeholder — replaced in Phase 2."
        />
      </Section>

      <Section id="experience" number="02" title="Experience">
        <p>
          Coming soon — Asurion and prior roles. <Tag>LangGraph</Tag>
        </p>
      </Section>

      <Section id="projects" number="03" title="Featured Projects">
        <p>
          Coming soon — four projects on agents, RAG, evaluations, and data
          pipelines.{" "}
          <ExternalLink href="https://github.com/pjnhek">
            github.com/pjnhek
          </ExternalLink>
        </p>
      </Section>

      <Section id="uses" number="04" title="Uses">
        <p>Coming soon — model defaults, MCP servers, eval stack, agent framework.</p>
      </Section>

      <Section id="contact" number="05" title="Contact">
        <p>Coming soon — email, LinkedIn, GitHub.</p>
      </Section>
    </main>
  );
}
```

**Acceptance against UI-SPEC.md "Page Composition (Home Route, Phase 1)":**
- Hero outside `Section` ✓
- Display name as `<h1>` ✓ (and the only `<h1>` on the home route, since `NumberedHeading` defaults to `<h2>`)
- About exercises `ArchitectureDiagram` with placeholder SVG ✓
- Experience exercises inline `Tag` ✓
- Featured Projects exercises `ExternalLink` ✓ (real URL per UI-SPEC.md)
- Uses + Contact are placeholder-only ✓
- All section IDs match UI-SPEC.md anchor list (`#about`, `#experience`, `#projects`, `#uses`, `#contact`) ✓
- No `mailto:` link in Phase 1 ✓ (Contact behavior is Phase 2)

### Anti-Patterns to Avoid

- **`tailwind.config.js`** — banned by CLAUDE.md "What NOT to Use" and FOUND-02. v4 is CSS-first.
- **`next lint` in `package.json` scripts** — removed in Next.js 16. Run `eslint .` directly.
- **`output: 'export'` in `next.config.ts`** — banned by FOUND-12. Disables `next/image` optimization (with default loader), `ImageResponse` for OG, ISR, Server Actions, Route Handlers that read Request, Cookies, Rewrites, Redirects, Headers, Draft Mode, Intercepting Routes. Phase 1 needs OG (Phase 3) and Server Actions (Phase 2 indirectly via `mailto:` plumbing, fully in v2 contact form) — none of those survive a static export. [CITED: nextjs.org/docs/app/guides/static-exports § Unsupported Features]
- **`"use client"` in Phase 1** — there is no client interactivity. Adding it surfaces a plan error.
- **`@theme { … }` without `inline`** when the value is a `var()` reference — use `@theme inline` for the font-variable block (corrects UI-SPEC.md's `@theme` example).
- **`next/font` with `weight` array on a variable font** — Geist and Geist_Mono are variable; omitting `weight` is correct. UI-SPEC.md mentions `weights [400, 500]` as a contract — those are the *usage* weights expressed via Tailwind `font-medium` / default; do not pass them to `next/font/google`.
- **Hard-coding `"01."` in section headings** — only `NumberedHeading` renders the prefix.
- **Pinning `react` to anything other than 19.2.x** — bundled with Next 16; downgrading breaks RSC.
- **`framer-motion` legacy package name** — banned by CLAUDE.md; use `motion` if motion is ever needed (it isn't in Phase 1).
- **`react-icons` umbrella package** — banned by CLAUDE.md; use `lucide-react`.
- **Self-hosted Geist via `next/font/local`** — `next/font/google` is the path of least friction; Geist is on Google Fonts.
- **Pre-installing `next-themes`, `motion`, `resend`, `sonner`, `@vercel/analytics`** — all banned for v1 per CLAUDE.md / PROJECT.md / CONTEXT.md.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Self-hosting Geist fonts | A custom `@font-face` block with woff2 files in `public/fonts/` | `next/font/google` with `Geist` + `Geist_Mono` | Automatic subset, build-time download, `font-display: swap`, `adjustFontFallback: true` (CLS prevention), CSS variable wiring all for free |
| Env var validation | A hand-rolled `if (!process.env.X) throw` | `zod` + a single `src/lib/env.ts` | Composable, type-inferred, error messages list every missing var, single source of truth |
| Tailwind class deduplication / ordering | A custom utility merging classes | `prettier-plugin-tailwindcss` (sorts at format time) — and `clsx` + `tailwind-merge` *if and when* the first conditional className appears (Phase 2+) | Phase 1 has no conditional classNames; Prettier alone is enough |
| Design tokens as TS objects | `theme.ts` exporting `{ colors: { ink: "#0a0a0a" } }` consumed by inline styles | Tailwind v4 `@theme` in `globals.css` | Tokens become utility classes AND CSS variables for free; one source of truth, DevTools-inspectable |
| Building a custom 404 | A hand-rolled `app/not-found.tsx` in Phase 1 | The Next.js default 404 page | Phase 3 (POL-01) ships the styled 404. UI-SPEC.md "Copywriting Contract" 404 row explicitly defers it. |
| ESLint config from scratch | A custom flat config | `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript` + `eslint-config-prettier/flat` | Official, maintained by the Next.js team, exact pattern documented in Next 16 docs |
| Mobile breakpoint testing | A test runner with viewport assertions | Chrome DevTools device emulation at 375 / 768 / 1280 viewports + a manual checklist | Phase 1 has no logic to test; e2e testing is deferred per CLAUDE.md "What NOT to Use" |

**Key insight:** Phase 1 has near-zero net-new logic — every load-bearing concern (fonts, design tokens, primitives' visual contract, env validation, lint/format) has a battle-tested off-the-shelf solution. Hand-rolling here is a recruiter-visible mistake.

## Runtime State Inventory

Not applicable to this phase. This is a greenfield scaffold with no prior runtime state, no databases, no live services, no OS-registered jobs, no secrets, and no installed packages outside what `pnpm install` puts in `node_modules/`. The first commit creates everything.

## Common Pitfalls

### Pitfall 1: `next lint` left in `package.json` scripts

**What goes wrong:** Plan adds `"lint": "next lint"` to `package.json`. `next lint` is removed in Next.js 16. Depending on the codemod state of the install, the command silently no-ops or throws.

**Why it happens:** Stale tutorials from 2024–early-2025 era. CLAUDE.md flags this; the Next.js 16 ESLint docs confirm removal.

**How to avoid:** Use `"lint": "eslint ."` (or `"lint": "eslint . --max-warnings 0"` for strict). Always invoke ESLint directly.

**Warning signs:** Running `pnpm lint` reports "0 files matched" or no output despite obvious lint targets.

[CITED: nextjs.org/docs/app/api-reference/config/eslint § next lint removal]

### Pitfall 2: `@theme` without `inline` for next/font CSS variables

**What goes wrong:** UI-SPEC.md's `@theme { --font-sans: var(--font-geist-sans); }` block compiles, but Tailwind's internal `theme()` resolution of font tokens points to `var(--font-sans)`, not the inlined `var(--font-geist-sans)`. In some Tailwind plugin / utility cases this double-indirection breaks (the canonical example is `font-family: theme(--font-sans)` resolving to `var(--font-sans)` and the browser's CSS engine then needing the `--font-sans` declaration to be in scope — which it is, but adds an extra resolution step).

**Why it happens:** The `inline` modifier was added in Tailwind v4 specifically for this case and the Next.js + Tailwind v4 official integration docs use `@theme inline` for next/font variables. UI-SPEC.md was authored without this nuance.

**How to avoid:** Use `@theme inline { … --font-sans: var(--font-geist-sans); … }` for the font block. Color, text, and spacing tokens can stay in a plain `@theme { … }` block.

**Warning signs:** Fonts apply correctly via the `inter.className` / `geistSans.className` route but `font-sans` Tailwind utility renders the fallback font. (Less likely than other variants; mostly a "do it right or it works by accident" pitfall.)

[CITED: nextjs.org/docs/app/api-reference/components/font § With Tailwind CSS]

### Pitfall 3: `output: 'export'` accidentally added during deployment troubleshooting

**What goes wrong:** Devs hit a build issue, find a Stack Overflow answer suggesting `output: 'export'`, add it. Suddenly `next/image` (default loader) breaks, OG image generation (Phase 3) breaks, future Server Actions (v2 contact form) break.

**Why it happens:** `output: 'export'` is a one-line config change with cascading effects that aren't immediately visible. The Next.js docs explicitly list 13 features that don't work with it.

**How to avoid:** FOUND-12 makes this a phase requirement. Plan should include a verification step: `grep -r "output:" next.config.ts` returns no match (or only documented non-export values).

**Warning signs:** Lighthouse Performance drops; image URLs in production look like `/_next/static/images/...` instead of `/_next/image?url=...&w=...&q=...`; `app/opengraph-image.tsx` (Phase 3) returns 404 in production.

[CITED: nextjs.org/docs/app/guides/static-exports § Unsupported Features]

### Pitfall 4: Node version mismatch causing `next.config.ts` failure

**What goes wrong:** Local dev uses Node 22.17 (or older), `next.config.ts` errors with `Cannot use import statement outside a module` or `experimental TypeScript transform` warnings.

**Why it happens:** `next.config.ts` requires Node ≥ 22.18 for native TypeScript loading without `--experimental-transform-types`. Below 22.18, Next.js falls back to `--experimental-transform-types`, which emits a stderr warning.

**How to avoid:** `package.json` declares `"engines": { "node": ">=22.18" }` (FOUND-13). Vercel runs Node 22 LTS by default; verify in Vercel project settings that Node 22.x is selected.

**Warning signs:** Build log shows experimental warnings; local `pnpm dev` requires `NODE_OPTIONS=--experimental-transform-types`.

[CITED: nextjs.org/docs/app/api-reference/config/next-config-js § TypeScript]

### Pitfall 5: `lib/env.ts` doesn't actually fail the build

**What goes wrong:** FOUND-10 requires `lib/env.ts` to fail the build when a required env var is missing. Naive implementation: the zod throw is in a function that's never called at build time, so it only fails at runtime.

**Why it happens:** Validation only runs when the module is imported. If no Server Component imports `env`, the throw never fires during `next build`.

**How to avoid:** Place the `safeParse` + throw at module-top level (not in a function), and import `env` in at least one file that Next.js evaluates at build (e.g., `app/layout.tsx`'s `metadataBase`). The pattern in Pattern 6 above does this correctly. The verification step is: temporarily remove the `.default(...)` and an `NEXT_PUBLIC_SITE_URL=` env entirely, run `pnpm build`, and confirm the build fails with the zod error message.

**Warning signs:** Build succeeds without `NEXT_PUBLIC_SITE_URL` set in Vercel preview env.

### Pitfall 6: Tab title doesn't contain "James Nhek"

**What goes wrong:** ROADMAP.md success criterion #2 requires the preview tab title contains "James Nhek". The Next.js default `<title>` from `create-next-app` is "Create Next App". Without an explicit `metadata.title` in `app/layout.tsx`, the success criterion fails silently.

**How to avoid:** `app/layout.tsx` exports `metadata.title` = `"James Nhek — AI Engineer"` (or any string containing "James Nhek"). UI-SPEC.md "Copywriting Contract" pins this exact title.

**Warning signs:** Browser tab shows "Create Next App" or "Localhost" or any string not containing "James Nhek".

### Pitfall 7: `tsc --noEmit` passes locally but fails on Vercel

**What goes wrong:** Local TS version differs from Vercel's. Different strict-mode interactions surface different errors.

**How to avoid:** Pin `typescript` exactly in `package.json` (or at least within the `^5.6` range CLAUDE.md specifies). Vercel uses the project's installed TS version; lockfile guarantees parity. Run `pnpm typecheck` as part of CI (Vercel's build step does this implicitly via `next build`).

**Warning signs:** Vercel deploy fails on a TS error not seen locally.

### Pitfall 8: Vercel preview deploys not firing on PRs

**What goes wrong:** DEP-02 requires preview deploys on every PR. If the Vercel GitHub integration is connected to the wrong account or repo, or if branch protection rules silently block the Vercel bot, previews don't fire.

**How to avoid:** Verify in Vercel dashboard → Project → Settings → Git → Production Branch (`main`) and Preview Branches (`All branches`). After connecting, open a test PR to confirm a preview URL appears in the PR conversation.

**Warning signs:** PR shows no Vercel comment with preview URL; Vercel dashboard "Deployments" tab shows only `main` deploys.

### Pitfall 9: `src/` flag inconsistency with paths

**What goes wrong:** `create-next-app --src-dir` puts `app/` inside `src/`, but `tsconfig.json` `paths: { "@/*": ["./*"] }` (without `src` in the path) breaks imports.

**How to avoid:** When using `--src-dir --import-alias "@/*"`, the scaffold should auto-set `paths: { "@/*": ["./src/*"] }`. Verify after scaffold.

**Warning signs:** `import { Section } from "@/components/primitives/Section"` resolves at the wrong path; VS Code shows "Cannot find module" red squigglies.

### Pitfall 10: Geist subset config missing causes warning + slow build

**What goes wrong:** `Geist({ display: 'swap' })` without `subsets: ['latin']` warns at build because `preload: true` is the default and a preload tag requires knowing which subset to preload.

**How to avoid:** Always pass `subsets: ['latin']` to both `Geist` and `Geist_Mono`. The integration pattern in Pattern 2 above does this correctly.

**Warning signs:** `next dev` console shows "Failed to find a font preload subset" or similar.

[CITED: nextjs.org/docs/app/api-reference/components/font § Specifying a subset]

## Code Examples

(See "Architecture Patterns" Pattern 1–8 above for verified code samples. All are ≤ 25 lines each and sourced from CLAUDE.md / UI-SPEC.md / official Next.js 16 + Tailwind v4 docs.)

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `tailwind.config.js` with `theme.extend.colors` | `@theme` in `globals.css` (CSS-first) | Tailwind v4.0 (2025) | No JS theme; CSS vars; smaller runtime |
| `next lint` script | `eslint .` (run ESLint directly) | Next.js 16 (May 2026) | Plans must not include `next lint` |
| `tailwind.config.js` with `fontFamily: { sans: ['var(--font-inter)'] }` | `@theme inline { --font-sans: var(--font-inter); }` in CSS | Tailwind v4 + Next.js 15+ | Single source of truth in CSS |
| `<link rel="preconnect" href="https://fonts.googleapis.com">` + manual `<link>` for font CSS | `next/font/google` self-hosted | Next.js 13+ (now mature) | No external request, no FOUT, automatic subsetting |
| `class={inter.className}` on individual elements | `className={`${geist.variable} ${geistMono.variable}`}` on `<html>` + CSS variables | Next.js 15+ | One-time wiring; Tailwind utilities resolve fonts |
| `eslint-config-prettier` at top level of flat config | `eslint-config-prettier/flat` import | ESLint 9 / prettier-config 10 | Subpath export is the explicit flat-config entry |
| Hand-rolled `<img>` for SVG diagrams | `<img>` for SVG (Next.js Image is wrong for SVG); `<Image>` for raster | Standing recommendation | Bypass `no-img-element` lint for SVG path |

**Deprecated/outdated:**
- `framer-motion` package name — use `motion` (legacy name still installs but ages `package.json`).
- `react-icons` umbrella package — tree-shaking is brittle; use `lucide-react` per-icon.
- `next/image` `priority={true}` — still works but the docs hint at the `priority` semantics tightening; verify any Phase 3 image usage against current docs.
- `contentlayer` / `next-contentlayer` — abandoned; not used in Phase 1 anyway (MDX is out of scope).
- Tailwind v3 `@tailwind base; @tailwind components; @tailwind utilities;` directives — replaced by single `@import "tailwindcss";` in v4.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Zod 4 `.flatten()` was changed/removed in favor of `.format()` (justifies pinning to Zod 3) | Pattern 6 | If Zod 4 still supports `.flatten()`, the Zod-3 pin is harmless but conservative. Net risk: low — pinning to Zod 3 only delays a future upgrade. |
| A2 | `lucide-react` 1.x is API-compatible with 0.x for the icon-import pattern (`import { X } from "lucide-react"`) | Standard Stack — Supporting | If 1.x changed import surface, Phase 2's first icon usage breaks. Mitigation: planner can pin to `^0.577` to match CLAUDE.md exactly; defer the 1.x upgrade. |
| A3 | The UI-SPEC.md `text-[length:var(--text-*)]` bracket syntax compiles correctly under Tailwind v4 + `@tailwindcss/postcss` | Pattern 7 | If Tailwind v4 has changed arbitrary-value syntax, primitive components fail to compile. Verified: Tailwind v4 docs explicitly support `text-[length:…]` and `text-[color:…]` arbitrary values. Low risk. |
| A4 | `@theme inline` is required for `var()` references but `@theme` (plain) works for fixed values | Pattern 1 | If `@theme inline` is required everywhere, the second `@theme` block in our `globals.css` template doesn't generate the expected utilities for color/text tokens. Mitigation: use `@theme inline` for the entire block uniformly during implementation — harmless if not strictly needed, and avoids the question. |
| A5 | Tailwind v4 generates `text-heading`-style named utilities from `--text-heading` tokens | Pattern 7 note | If named utilities are NOT auto-generated for non-default token names, the bracket-syntax fallback (`text-[length:var(--text-heading)]`) keeps working. UI-SPEC.md prefers the bracket form, so this is doc-only. Low risk. |
| A6 | Vercel preview deploys fire on every PR by default once the GitHub integration is connected | Repo + Vercel hookup | If Vercel requires explicit enabling per-branch, plans must include that step. Verified loosely via Vercel docs ("by default, all branches receive preview deployments" — well-established). Low risk. |
| A7 | `create-next-app --src-dir --import-alias "@/*"` correctly emits `tsconfig.json` with `paths: { "@/*": ["./src/*"] }` | Pitfall 9 | If it emits `["./*"]` instead, imports break. Mitigation: planner's first verification step after scaffold is `cat tsconfig.json` and confirm paths. Low risk; easy to fix. |

**Mitigation for the planner:** Every assumption above is either (1) trivially verifiable post-scaffold, (2) reversible without rework, or (3) conservatively pinned. None are load-bearing for the phase's success criteria.

## Open Questions

1. **Should `lucide-react` be pinned to `^0.577` (CLAUDE.md `^0.460+` range) or `^1.16.0` (current npm `latest`)?**
   - What we know: Library went 1.0 stable after CLAUDE.md was authored. CLAUDE.md says `^0.460+`. UI-SPEC.md confirms install Day 1, no usage until Phase 2.
   - What's unclear: Whether the 0.x → 1.x bump introduced breaking changes to the per-icon import API used in modern shadcn/Next.js setups.
   - Recommendation: Default to `^0.577` (last 0.x) to honor CLAUDE.md exactly. The planner can revisit at Phase 2's first icon-use task. Risk of choosing `^1.16` is low (semantic versioning + active maintainer) but doesn't add value for Phase 1.

2. **Should TypeScript be pinned to `^5.9` (last 5.x) or `^6.0` (current stable)?**
   - What we know: CLAUDE.md says `5.6+`. Latest is `6.0.3`.
   - What's unclear: Whether Next.js 16 + eslint-config-next/typescript fully supports TS 6.0.x without warnings.
   - Recommendation: Let `create-next-app` choose. The scaffold pulls the version it's tested against; whatever it picks (likely `^5.9` or `^6.0` — both within `5.6+`) is the path of least surprise.

3. **Should `package.json` include the optional Husky + lint-staged pre-commit hook setup?**
   - What we know: CONTEXT.md `<decisions>` Discretion says "fine to skip for v1." CLAUDE.md "Recommended Stack" says optional, fine to skip.
   - What's unclear: Whether the planner wants to invest 30 minutes for the small risk reduction.
   - Recommendation: Skip. Vercel preview previews enforce build correctness; ESLint + Prettier run on demand are enough for a solo project. Add Husky in v1.x if the workflow demands it.

4. **Should the `_placeholder.svg` be a tracked asset committed with the scaffold, or generated by the executor as part of an Implementation task?**
   - What we know: UI-SPEC.md requires `public/diagrams/_placeholder.svg` to exist and to render through `ArchitectureDiagram` on the home shell.
   - What's unclear: Whether the planner expects a real SVG file (e.g., a hand-drawn box-and-arrow exported from Excalidraw) or an inline minimal SVG written by the executor.
   - Recommendation: Have the executor write a minimal inline SVG (e.g., 800×450 viewBox with 3 rectangles labeled "Input" → "Process" → "Output" and 2 arrows, in `#0a0a0a` strokes on `#fafafa` fill). Trivial to author, satisfies UI-SPEC.md D-08 demo requirement, no design-tool dependency. Document this in a task.

5. **Should branch protection on `main` be in scope for Phase 1 (DEP-01 says "main branch protected")?**
   - What we know: DEP-01 explicitly requires main branch protected.
   - What's unclear: GitHub branch protection is a UI configuration step in the repo settings, not a code change.
   - Recommendation: Include as a `checkpoint:human-verify` task. The plan instructs the user to enable "Require a pull request before merging" + "Require status checks to pass" (with Vercel preview as a check) in `github.com/pjnhek/portfolio/settings/branches`. Cannot be automated without a GitHub PAT; the human gate is correct.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Next.js runtime + scaffold | ✓ | 25.6.1 (local); 22 LTS on Vercel | — |
| pnpm | Package manager (CLAUDE.md pin) | ✓ | 10.30.2 | — |
| git | Repo init + push to GitHub | ✓ | 2.50.0 | — |
| GitHub account `pjnhek` | DEP-01 (repo creation) | ASSUMED ✓ | — | Manual repo creation by user |
| Vercel account | DEP-02 (project linking) | ASSUMED ✓ | — | Manual project creation by user |
| GitHub Personal Access Token (for any `gh` CLI automation) | Optional — only if planner uses `gh` for branch protection automation | UNKNOWN | — | `checkpoint:human-verify` task asking user to configure via web UI |

**Missing dependencies with no fallback:** none — local toolchain is complete.

**Missing dependencies with fallback:**
- GitHub branch protection: cannot be automated without auth; gate behind `checkpoint:human-verify`.
- Vercel project link: cannot be automated without auth; gate behind `checkpoint:human-verify` (user clicks "Add new project" in Vercel dashboard, selects the GitHub repo, accepts defaults).

**Recommended task ordering:**
1. Local scaffold (no auth needed)
2. Local primitives + globals.css + layout.tsx (no auth needed)
3. Local `pnpm lint && pnpm typecheck && pnpm build` (verify clean before publishing)
4. **Checkpoint:** create `pjnhek/portfolio` repo on GitHub, push code
5. **Checkpoint:** link to Vercel, accept defaults, await first preview URL
6. **Checkpoint:** enable branch protection on `main`
7. Open a test PR (e.g., trivial README edit) to verify preview fires (DEP-02 acceptance)

## Validation Architecture

> **Skipping per `workflow.nyquist_validation` posture:** No `.planning/config.json` exists, but Phase 1 is a Walking Skeleton with **near-zero logic to test**. Per CLAUDE.md "What NOT to Use": *"The site has near-zero logic. Tests would slow shipping for negligible value. Defer."* The phase's validation is the **toolchain itself**: `pnpm lint && pnpm typecheck && pnpm build && pnpm dev` must all succeed, and the Vercel preview must render the shell. There are no behaviors that benefit from unit/integration tests at this stage; Vitest is a Phase 2+ / v1.x decision.
>
> If `workflow.nyquist_validation` is later turned on, the test framework decision deferred to Phase 2 (when the first content modules and accessors `lib/content.ts` introduce testable functions).

### Test Framework

| Property | Value |
|----------|-------|
| Framework | none in Phase 1 — manual + toolchain verification |
| Config file | none |
| Quick run command | `pnpm lint && pnpm typecheck` |
| Full suite command | `pnpm lint && pnpm typecheck && pnpm build` |
| Phase gate | `pnpm build` succeeds + Vercel preview URL renders shell with "James Nhek" tab title |

### Phase Requirements → Verification Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FOUND-01 | `pnpm dev` runs locally and renders shell | smoke | `pnpm dev` then visit `localhost:3000` | n/a (manual) |
| FOUND-02 | Tailwind v4 CSS-first works; no `tailwind.config.js` | smoke | `ls tailwind.config.* 2>&1 \| grep -q "No such" && pnpm build` | n/a (manual + build) |
| FOUND-03 | Geist Sans + Mono load with zero CLS | smoke | DevTools Network panel verifies woff2 self-hosted; Lighthouse "Cumulative Layout Shift" = 0 | n/a (manual) |
| FOUND-04 | tsconfig has strict + noUncheckedIndexedAccess | unit (file check) | `node -e "const c=require('./tsconfig.json');process.exit(c.compilerOptions.strict && c.compilerOptions.noUncheckedIndexedAccess?0:1)"` | tsconfig.json |
| FOUND-05 | Mono palette ≥4.5:1 contrast on body text | manual + tool | axe DevTools scan; Lighthouse a11y | n/a (manual) |
| FOUND-06 | Clamp typography works at 375/768/1280 | manual | DevTools device toolbar at each viewport, no horizontal scroll, no clipped headings | n/a (manual) |
| FOUND-07 | NumberedHeading primitive renders `01.` style | smoke | render Home; inspect `01. About` in DOM | manual |
| FOUND-08 | All 5 primitives exist and compile | unit (file check) + smoke | `pnpm typecheck` + render Home + visual inspect every primitive used at least once | Section.tsx, NumberedHeading.tsx, Tag.tsx, ExternalLink.tsx, ArchitectureDiagram.tsx |
| FOUND-09 | layout.tsx has metadataBase + default metadata + tab title contains "James Nhek" | smoke | `curl -s preview-url \| grep -o '<title[^>]*>[^<]*</title>'` returns string containing "James Nhek" | layout.tsx |
| FOUND-10 | lib/env.ts fails build when required env missing | smoke (negative) | temporarily remove `.default()`, unset env, run `pnpm build`, expect non-zero exit + zod error in stderr | lib/env.ts |
| FOUND-11 | pnpm lint + pnpm format run clean | smoke | `pnpm lint && pnpm format:check` exit 0 | eslint.config.mjs, .prettierrc.json |
| FOUND-12 | next.config.ts does NOT set output: 'export' | unit (file check) | `grep -q "output.*export" next.config.ts && exit 1 \|\| exit 0` | next.config.ts |
| FOUND-13 | package.json pins packageManager + engines.node | unit (file check) | `node -e "const p=require('./package.json');process.exit(p.packageManager?.startsWith('pnpm@') && p.engines?.node?.includes('22')?0:1)"` | package.json |
| DEP-01 | GitHub repo pjnhek/portfolio exists + main branch protected | manual | `gh repo view pjnhek/portfolio --json visibility,defaultBranchRef` + visit branch protection settings | n/a (manual) |
| DEP-02 | Vercel preview fires on PR | manual (test PR) | open a trivial PR, verify Vercel comment with preview URL appears | n/a (manual) |

### Sampling Rate

- **Per task commit:** `pnpm lint && pnpm typecheck`
- **Per wave merge:** `pnpm lint && pnpm typecheck && pnpm build`
- **Phase gate:** `pnpm build` succeeds + Vercel preview URL renders the home shell + tab title contains "James Nhek" + all 4 ROADMAP.md Phase 1 success criteria verified

### Wave 0 Gaps

None — Phase 1 has no test framework to install. The toolchain (lint, typecheck, build) is itself the validation harness and is installed by `create-next-app` + the Day-1 supporting libraries.

## Security Domain

> `.planning/config.json` does not exist, so `security_enforcement` is treated as enabled by default. Phase 1's attack surface is intentionally minimal — no auth, no input handling, no API routes, no client interactivity, no user data, no external API calls. The applicable ASVS categories are limited.

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | — (no auth in Phase 1; no user accounts ever per PROJECT.md) |
| V3 Session Management | no | — (no sessions) |
| V4 Access Control | no | — (no protected resources) |
| V5 Input Validation | partial | `zod` schema in `lib/env.ts` validates env vars at module init. No user input in Phase 1. |
| V6 Cryptography | no | — (no encryption in Phase 1; Vercel auto-provisions HTTPS in production) |
| V7 Error Handling & Logging | partial | `lib/env.ts` throws on misconfiguration with a descriptive error; no other logging needed in Phase 1 |
| V8 Data Protection | partial | `.gitignore` covers `.env*` to prevent secret commit. `lib/env.ts` reads from `process.env` server-side only; `NEXT_PUBLIC_SITE_URL` is intentionally public (not a secret). |
| V14 Config | yes | `next.config.ts` does NOT set `output: 'export'` (FOUND-12). `package.json` pins runtime versions (FOUND-13). |

### Known Threat Patterns for Next.js 16 + Vercel + static-rendered marketing site

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Secret committed to public repo | Information Disclosure | `.gitignore` covers `.env*`; `lib/env.ts` documents what is and isn't public; no `NEXT_PUBLIC_*_KEY` vars exist; CLAUDE.md is explicit about Asurion confidentiality |
| Tailwind plugin / postcss supply chain compromise | Tampering | Pin versions in lockfile (`pnpm-lock.yaml`); all packages used are from well-known maintainers with multi-million weekly downloads (see Package Legitimacy Audit) |
| Preview URL discovered and indexed by search engines | Information Disclosure | Phase 1 preview content is the labeled-skeleton shell — no confidential content. Phase 3 (POL / SEO) sets `robots.ts` for production. Vercel preview URLs are non-guessable hashes. |
| Cross-site scripting via inline diagram SVG content | Tampering | Phase 1 `_placeholder.svg` is hand-authored and committed; no user-uploaded SVGs. Future diagrams in Phase 2 are author-controlled. Set `Content-Security-Policy` header in Phase 3+. |

**Phase 1 has no other applicable threats.** No forms, no auth, no API, no DB, no third-party API calls.

## Sources

### Primary (HIGH confidence)
- **Next.js 16.2.6 official docs** (verified 2026-05-20):
  - `nextjs.org/docs/app/api-reference/components/font` — next/font setup, multi-font CSS variable pattern, Tailwind v4 integration with `@theme inline`
  - `nextjs.org/docs/app/api-reference/config/eslint` — ESLint flat config setup, `next lint` removal in v16, `eslint-config-prettier/flat` import path
  - `nextjs.org/docs/app/api-reference/config/next-config-js` — `next.config.ts` shape, `NextConfig` typed import, Node 22.18+ requirement
  - `nextjs.org/docs/app/api-reference/config/next-config-js/output` — `output: 'export'` mechanism and config
  - `nextjs.org/docs/app/guides/static-exports` — full list of features unsupported with `output: 'export'`
- **Tailwind CSS v4 official docs** (verified 2026-05-20):
  - `tailwindcss.com/docs/installation/framework-guides/nextjs` — PostCSS plugin (`@tailwindcss/postcss`) and `@import "tailwindcss"` setup
  - `tailwindcss.com/docs/theme` — `@theme` directive, `--color-*` / `--font-*` / `--text-*` / `--spacing` conventions, default vs custom utility generation
- **npm registry** (queried 2026-05-20): version verification for every package in Standard Stack
- **Local environment probe** (2026-05-20): Node 25.6.1, pnpm 10.30.2, git 2.50.0 — all available

### Secondary (MEDIUM confidence — already-synthesized research)
- `.planning/research/STACK.md` — full stack matrix and version pins (authored 2026-05-20 for this project)
- `.planning/research/ARCHITECTURE.md` — file layout and Server-Component-by-default patterns
- `.planning/research/PITFALLS.md` — 24 hazards including Tailwind v4/Next 16 misconfig, output:export trap
- `.planning/research/SUMMARY.md` — Day-1 install list and arbitrated conflicts
- `.planning/research/FEATURES.md` — anti-features and what NOT to install in v1
- `CLAUDE.md` — authoritative project stack pins and "What NOT to Use"
- `.planning/phases/01-foundation-slice/01-UI-SPEC.md` — primitive contracts, `@theme` token block, copywriting contract (the layer-of-truth for visuals)
- `.planning/phases/01-foundation-slice/01-CONTEXT.md` — D-01..D-08 locked decisions
- `.planning/REQUIREMENTS.md` — FOUND-01..13, DEP-01, DEP-02 acceptance criteria
- `.planning/ROADMAP.md` — Phase 1 success criteria

### Tertiary (LOW confidence — flagged in Assumptions Log)
- Zod 3 vs 4 specific API differences — based on training knowledge, not verified against zod release notes in this session
- lucide-react 0.x → 1.x compatibility — based on semver expectation, not verified against changelog

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — every package verified against npm `view` and against CLAUDE.md's locked pins
- Architecture: HIGH — every pattern verified against current Next.js 16 + Tailwind v4 official docs
- Pitfalls: HIGH — `next lint` removal, `output: 'export'` unsupported features list, and `@theme inline` requirement are all explicitly documented in Next.js 16 / Tailwind v4 official docs
- Primitives: HIGH — UI-SPEC.md provides the locked contract; this RESEARCH.md verifies the Tailwind v4 / Server Component implementation idioms

**Research date:** 2026-05-20
**Valid until:** 2026-06-19 (30 days — Next.js 16 and Tailwind v4 are in stable release; the only fast-moving piece is npm `latest` versions, which can be re-verified with `npm view` at plan time)
