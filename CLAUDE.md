<!-- GSD:project-start source:PROJECT.md -->
## Project

**pjnhek.com — James Nhek Portfolio**

A custom-coded personal portfolio site at **pjnhek.com** for James Nhek, AI Engineer at Asurion. It is built for recruiters and hiring managers evaluating James for AI Engineer roles — a single place to see his current work, prior experience, featured projects, and how to get in touch. The site itself is part of the portfolio: a recruiter should be able to tell it was hand-built without having to look.

**Core Value:** A recruiter lands on pjnhek.com, immediately understands "James is a serious AI Engineer doing real RAG/eval work at Asurion," sees 3–4 substantive projects with real depth, and has an obvious way to reach out — all within 60 seconds, on a phone.

### Constraints

- **Timeline**: Ship ASAP — actively job hunting, so a v1 needs to be live in days/weeks, not months
- **Budget**: Free or near-free hosting only (Vercel free tier or equivalent) — no monthly bills
- **Tech stack**: Next.js + Tailwind + TypeScript, deployed on Vercel — modern, recruiters-recognize-it, free hosting, easy to add interactive demos later
- **Confidentiality**: Asurion content is high-level only with sanitized diagrams; no proprietary architecture, internal tool names, or screenshots from work systems
- **Domain**: Custom domain pjnhek.com (already targeted) — needs DNS configured
- **Aesthetic**: "huyml.co but more minimal" — typography-led, monochrome, lots of whitespace; the site itself should feel like an engineering artifact, not a designer's playground
- **Audience first**: All design decisions arbitrate in favor of "what makes a recruiter trust and remember James in 60 seconds" — not novelty, not personal preference
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

## Executive Summary
- **Next.js 16 (App Router) + React 19.2 + TypeScript 5.x**, scaffolded by `create-next-app` with Turbopack stable.
- **Tailwind CSS v4.1** with CSS-first `@theme` config (PostCSS plugin), not v3.
- **pnpm** as package manager (Vercel-native cache, fast, disk-efficient, no compatibility risk).
- **Geist Sans + Geist Mono** via `next/font/google` — matches the "engineer-grade minimal" brief better than Inter for a portfolio that needs to feel non-template.
- **Lucide React** for icons (Feather-style, 5M weekly downloads, tree-shakes cleanly).
- **MDX only for project case studies** (`/projects/[slug]`); homepage and About stay plain TSX. Use `@next/mdx` or `next-mdx-remote` for typed frontmatter.
- **Resend + Server Actions + Zod** for the contact form. Free tier covers 3,000 emails/month, 100/day — more than enough.
- **CSS + the View Transitions API + a sprinkle of Motion** (`motion/react`, formerly framer-motion). Do not pull in the full Motion bundle for fade-ins — use CSS.
- **Vercel Hobby** for hosting on `pjnhek.com`. A-record at the apex (`76.76.21.21`), CNAME `www`. Watch the **non-commercial-use** clause — a personal portfolio is fine; productized SaaS isn't.
## Recommended Stack
### Core Technologies
| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **Next.js** | `16.2.x` | React framework, SSG/SSR, routing, image opt | App Router is now the only sensible choice; Turbopack default in dev+build (10–20x faster than webpack); React Compiler stable so manual `useMemo`/`useCallback` are unnecessary; `next/image` and `next/font` are the load-bearing perf primitives a portfolio needs. |
| **React** | `19.2.x` | UI runtime | Bundled with Next.js 16. Server Components by default reduce JS shipped to the client — exactly what a typography-led portfolio wants. |
| **TypeScript** | `5.6+` | Type safety | Industry expectation. Use `next.config.ts` (or `next.config.mts` if `package.json` has `"type": "commonjs"`) for typed config. Strict mode on. |
| **Tailwind CSS** | `4.1.x` | Utility-first styling | Oxide engine (Rust) is 2–5x faster than v3; CSS-first `@theme` config means design tokens live in `globals.css`, not a JS file; smaller runtime bundle. Browser targets (Safari 16.4+, Chrome 111+, Firefox 128+) are a non-issue for a recruiter-facing site in 2026. |
| **@tailwindcss/postcss** | `4.1.x` | Tailwind's PostCSS plugin | Required v4 entry point — replaces `tailwindcss` PostCSS plugin from v3. |
| **Node.js** | `22 LTS` (>= 22.18 ideal) | Runtime | `22.18+` enables native TypeScript loading for `next.config.ts` without `--experimental-transform-types`. Vercel runs 22 LTS by default. |
### Supporting Libraries
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **lucide-react** | `^0.460+` | Icon system | Default. ~1,500 icons, Feather aesthetic, smallest per-icon bundle delta as you scale past ~30 icons, tree-shakes per import. Aligns with shadcn/ui's default. |
| **clsx** + **tailwind-merge** | latest | Conditional + dedup-safe classes | Together via a `cn()` helper. Mandatory the moment you have a variant or any conditional className. |
| **class-variance-authority** (cva) | `^0.7+` | Typed component variants | Only when a component grows >2 variant axes (e.g., Button with `variant` × `size`). Skip for simple components. |
| **motion** | `^11.x` (package name `motion`, import `motion/react`) | Animation | Optional. Use only for scroll-reveal on project cards or layout animations. For section fades and hover states, use Tailwind transitions / CSS keyframes. **Do not** install both `motion` and `framer-motion` — they're the same library, the old name is legacy. |
| **@next/mdx** + `gray-matter` | latest | MDX content for project case studies | Only if you want to write project deep-dives in Markdown + embed `<Diagram>`/`<Metric>` React components. For 4 curated projects this is the sweet spot — typed frontmatter, content lives in `content/projects/*.mdx`. |
| **next-mdx-remote-client** | `^2.x` | Alternative MDX loader | Use if you want MDX outside the file-based router (e.g., loading from a `content/` dir programmatically). Slightly more flexible than `@next/mdx`. Pick one, not both. |
| **resend** | `^4.x` | Transactional email SDK | Contact form backend via Server Action. 3,000 emails/month free, 100/day, requires verified custom domain (`pjnhek.com`) for inbox deliverability. |
| **zod** | `^3.23+` | Runtime validation | Validate contact form payload server-side before calling Resend. Pairs naturally with Server Actions. Non-negotiable. |
| **sonner** | `^1.5+` | Toast notifications | Pair with the contact form success/error state. Minimal, headless-styled, ~3KB. Lighter than `react-hot-toast`. |
| **next/font** | built-in | Self-hosted Google Fonts | Use `Geist` and `Geist_Mono` from `next/font/google`. Zero layout shift, no external request, automatic subsetting. |
| **next-themes** | (omit for v1) | Theme toggle | Project explicitly defers dark mode. Do not install. |
| **@vercel/analytics**, **@vercel/speed-insights** | (omit for v1) | Analytics & RUM | PROJECT.md defers analytics. Add later if needed; both are free on Hobby. |
### Development Tools
| Tool | Purpose | Notes |
|------|---------|-------|
| **pnpm** | Package manager | 12s install for a Next.js project vs 46s with npm; 70% less disk than npm; Vercel-cached; 65M weekly downloads vs Bun's <1M; no Node.js compatibility surprises. Bun installs faster but the small win isn't worth runtime risk on a recruiter-facing site. Pin via `packageManager` field in `package.json` and a `.npmrc`. |
| **ESLint (flat config)** | Linting | `eslint.config.mjs` using `defineConfig`. **Important:** `next lint` was removed in Next.js 16 — run `eslint .` directly (add as `lint` script). Use `eslint-config-next` + `eslint-config-next/typescript` + `eslint-config-prettier` (last). |
| **Prettier** | Formatting | `prettier` + `prettier-plugin-tailwindcss` (auto-sorts Tailwind class strings — eliminates a class of class-order bugs). Run `eslint-config-prettier` last so it disables conflicting rules. |
| **Husky** + **lint-staged** | Pre-commit hooks | Optional. For a solo project on a small site, fine to skip. CI catches it on Vercel preview. |
| **Turbopack** | Bundler | Default in Next.js 16. No configuration needed. If you previously had `experimental.turbopack` in config, move to top-level `turbopack` key. |
| **TypeScript strict mode** | — | Set `"strict": true`, `"noUncheckedIndexedAccess": true` in `tsconfig.json`. Recruiters do read `tsconfig.json`. |
## Installation
# Scaffold (recommended — sets Tailwind v4, ESLint, App Router, TS, Turbopack, src/ dir)
# Supporting libraries
# Optional — only if you commit to MDX project pages
# OR
# Optional — only if you actually need motion beyond CSS
# Dev tooling
# Expect:
#   next            16.2.x
#   react           19.2.x
#   tailwindcss     4.1.x
#   typescript      5.6.x+
## Alternatives Considered
| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| **Tailwind v4** | Tailwind v3.4 | Only if you must support Safari < 16.4 or Chrome < 111 (you don't — recruiter audience is on modern browsers). |
| **App Router** | Pages Router | Only for legacy projects already deep in `getStaticProps`. Greenfield in 2026 has no reason. |
| **pnpm** | Bun | If install speed is the dominant pain (it isn't for a small site) AND you've validated every dep works on Bun. |
| **pnpm** | npm | Fine fallback, but you'll regret it the first time you forget a peer dep — pnpm's strict resolution catches it. |
| **Geist Sans + Geist Mono** | Inter | If you want maximum readability for dense data tables (not this project) or maximum safety. Geist is the more distinctive choice for an engineer's portfolio. |
| **Geist** | IBM Plex Sans / Mono | If you want a more academic / "research lab" voice. Plex Mono is also great as a secondary mono for code/numbers, but for a portfolio that wants to feel current, Geist wins. |
| **Lucide** | Heroicons | If you want fewer choices forced on you (292 curated icons in 2 weights) and the most "Tailwind-native" look. Smaller bundle at <50 icons but loses to Lucide as count scales. |
| **Lucide** | Phosphor | If you need 7,700+ icons in 6 weights (overkill for 4-project portfolio; bundle overhead not worth it). |
| **Resend** | Formspree / Web3Forms | If you want zero backend code — just `<form action="https://formspree.io/...">`. Trade-off: less control, branded emails, and recruiters can't see Server Action code. Resend signals "I can wire up an API." |
| **Resend** | Plain `mailto:` link | Works but feels lazy for an engineer's portfolio. Use as fallback only. |
| **Server Actions** | Next.js Route Handler (`app/api/contact/route.ts`) | Only if you need to call the endpoint from non-Next clients. For a form-only use case, Server Actions are cleaner — no manual `fetch`, automatic CSRF, types end-to-end. |
| **Motion (`motion/react`)** | Pure CSS + View Transitions API | Default to CSS for fades, hovers, simple slides. Reach for Motion only when you need layout animations (`layoutId`), gesture-driven interactions, or interruptible springs. A minimal portfolio likely needs zero JS animation. |
| **MDX** | Plain TSX + a `projects.ts` data file | If your project descriptions stay short (<300 words each), a typed TS array is simpler and ships less JS than the MDX runtime. Switch to MDX the moment you want embedded React components inside content. |
| **shadcn/ui** | None | Optional. If you reach for a Dialog, Tooltip, or Tabs primitive, `pnpm dlx shadcn@latest add` is the move. Components are vendored into your repo (recruiters see real code), not a black-box dependency. **Don't** install a full UI kit (MUI, Chakra, Mantine, Ant). |
## What NOT to Use
| Avoid | Why | Use Instead |
|-------|-----|-------------|
| **Material UI / Chakra / Mantine / Ant Design** | 100–300KB of JS just to render a button; opinionated styling fights Tailwind; recruiters can tell you used a kit. | Tailwind + shadcn/ui primitives (vendored, no runtime UI lib). |
| **Tailwind v3** in a new project | Already legacy. v4 is faster, smaller, CSS-first. v3 means writing a `tailwind.config.js` no one wants to maintain. | Tailwind v4.1 with `@theme` in `globals.css`. |
| **Pages Router** | Two routers in 2026 is confusing; Pages misses out on Server Components, streaming, parallel routes, and most new Next.js features. | App Router (`app/` directory). |
| **`next lint`** | Removed in Next.js 16. Will silently no-op or break depending on version. | Run ESLint directly: `"lint": "eslint ."` |
| **`framer-motion` (legacy package name)** | Project renamed to `motion`. Still works but ages your `package.json`. | `pnpm add motion` and `import { motion } from "motion/react"`. |
| **react-icons (umbrella package)** | Each icon imports from a sub-package, but tree-shaking is brittle and bundles balloon fast — measurably worse than Lucide on Next.js 16 + Turbopack benchmarks. | `lucide-react` (per-icon ESM imports). |
| **Bun runtime on Vercel** | Vercel deploys on Node.js. Bun-runtime-specific APIs (`Bun.file`, etc.) won't run in production. Bun as a package manager is fine; Bun as a runtime is not for this use case. | Node.js 22 LTS on Vercel; pnpm for installs. |
| **Cypress** | Heavy install, slow CI on Hobby (CI-minutes-bound), overkill for a static portfolio. | **Playwright** (lighter, faster) if any e2e at all. For v1, skip e2e entirely and rely on TypeScript + ESLint + Vercel previews. |
| **Vitest/Jest for component tests on v1** | The site has near-zero logic. Tests would slow shipping for negligible value. | Defer. Add Vitest later when you wire up a live RAG demo (v2). |
| **Plain `<img>` tags for hero/project images** | No automatic AVIF/WebP, no responsive `srcset`, layout shifts kill LCP. Lighthouse will penalize you. | `next/image` with `priority` (the renamed-to-`preload`-in-v16 prop — check current docs) on the LCP image only. |
| **System fonts (`font-family: system-ui`)** | Inconsistent cross-OS rendering; Inter on Windows ClearType vs SF Pro on macOS is a visibly different site. | `next/font/google` with `Geist` (self-hosted, no FOUT). |
| **Custom commercial SaaS on Vercel Hobby** | Vercel Hobby explicitly prohibits commercial use. A personal portfolio is fine. The moment this site sells anything, pivot to Pro ($20/mo) or self-host. | Stay non-commercial on Hobby; this is a personal portfolio. |
| **CSS-in-JS (styled-components, emotion)** | Runtime cost, RSC compatibility friction (styled-components needs a workaround), conflicts with Tailwind. | Tailwind v4 + CSS Modules for the rare scoped style. |
| **`@vercel/og` (image generation) on Hobby for high-traffic OG images** | Each generation = a Function invocation. Hobby is generous (1M/month) but cache headers matter — set `Cache-Control: public, max-age=31536000, immutable` on generated OG images. | Use it, but cache aggressively. Or pre-generate at build time. |
## Stack Patterns by Variant
- Skip Motion entirely. CSS handles every animation a typography-led portfolio needs.
- Skip MDX. Define projects as a typed `Project[]` in `src/content/projects.ts`.
- Skip shadcn/ui. Hand-roll the 5–6 primitives you need (Card, Button, Section, etc.).
- Total runtime JS: ~80–110KB gzipped. Lighthouse Performance: 100 on desktop, 95+ on mobile achievable.
- Add `ai` (Vercel AI SDK) + `@ai-sdk/anthropic` or `@ai-sdk/openai`.
- Add Edge Runtime route handler for the demo endpoint — streams from the edge, lower TTFT.
- Watch the Vercel Hobby **Active CPU** limit (4 hours/month). A demo that gets press could blow through it; rate-limit aggressively via `@vercel/kv` or in-memory leaky bucket.
- Move the LLM API key to Vercel Project Environment Variables (do not commit `.env`).
- Pick `@next/mdx` (simpler, file-system routed) over `next-mdx-remote-client` (more flexible, more boilerplate). Don't mix.
- Define typed frontmatter via `gray-matter` + a Zod schema.
- Create custom MDX components: `<Metric value="+10.6%" label="Accuracy" />`, `<Diagram src="..." />`, `<Stack items={["LangGraph","pgvector","Cloud SQL"]} />` — these are exactly the "engineering artifact" signals the brief calls for.
- Set `next/image` `sizes="(max-width: 768px) 100vw, 50vw"` on project thumbnails — saves 40–60% mobile payload.
- Test on actual throttled 4G in Chrome DevTools, not just desktop Lighthouse.
## Version Compatibility
| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| `next@16` | `react@19.2`, `react-dom@19.2` | Pinned together by `create-next-app`. Don't downgrade React. |
| `tailwindcss@4` | `@tailwindcss/postcss@4`, `postcss@8` | v4 PostCSS plugin lives in `@tailwindcss/postcss`, **not** in `tailwindcss` itself like v3. |
| `motion@^11` | `react@19` | The legacy `framer-motion` package also supports React 19 (v11+) but is deprecated naming. |
| `lucide-react@0.460+` | `react@19` | Tree-shakes correctly under Turbopack. |
| `@next/mdx` | `next@16` | Make sure to set `pageExtensions: ['ts','tsx','md','mdx']` in `next.config.ts`. |
| `next.config.ts` | Node `>=22.18` | Below 22.18, set `NODE_OPTIONS=--experimental-transform-types` or use `next.config.mjs`. |
| Vercel build | Node 22.x | Set explicitly in Vercel project settings to avoid surprise upgrades. |
## Vercel Hobby Free-Tier Gotchas
| Limit | Value (May 2026) | Risk for this Portfolio | Mitigation |
|-------|------------------|-------------------------|------------|
| **Bandwidth** | 100 GB/month "Fast Data Transfer" | Low — a static-ish portfolio at ~1 MB/visit can serve 100K visits/month before this matters. | Set long `Cache-Control` headers on images. Use `next/image` (it AVIF/WebP). |
| **Function invocations** | 1M/month | Low — Server Actions count, but a contact form is firing maybe 10/month. | None needed. |
| **Active CPU** | 4 hours/month | Low for v1; **high for v2 RAG demo**. | Rate-limit demo. Cache aggressively. |
| **Build minutes** | 45 min/deploy, 1 concurrent build | None — a portfolio builds in <90s. | None. |
| **Edge Requests** | 1M/month | Low. | None. |
| **Commercial use clause** | Prohibited on Hobby | Medium — a personal portfolio is allowed; the moment you take payments or do client work through it, you must upgrade to Pro. | Read [Vercel Hobby ToS](https://vercel.com/docs/plans/hobby). Personal portfolio is explicitly fine. |
| **DDoS / runaway costs** | No hard spend cap on Hobby (Vercel will pause vs charge) | Service can be paused mid-month if abused. | Worth knowing. For a portfolio this is acceptable; Pro adds spend management if needed. |
## Domain Setup (pjnhek.com)
# In Vercel: Project → Settings → Domains → Add "pjnhek.com" and "www.pjnhek.com"
# At your DNS registrar, add:
# Vercel auto-provisions SSL via Let's Encrypt once DNS propagates.
# Run `vercel domains inspect pjnhek.com` to confirm exact values for your project.
## Lighthouse Targets & What to Install Up Front
| Concern | Action | When |
|---------|--------|------|
| LCP (hero image / heading) | `next/image` with `priority` on hero; `next/font` with `display: 'swap'` | Day 1 |
| CLS (layout shift) | Always pass width/height (or fill + container) to `next/image`; reserve hero space | Day 1 |
| INP (interaction) | Keep components Server by default; mark `'use client'` only where needed; avoid heavy animation libs | Day 1 |
| TBT (blocking time) | Skip Motion unless needed; no UI kits | Day 1 |
| FCP | Statically render every page (`export const dynamic = 'force-static'` where applicable) | Day 1 |
| Accessibility | Semantic HTML, `aria-label` on icon buttons, `prefers-reduced-motion` respect, color contrast (monochrome ≠ excuse) | Day 1 |
| SEO | `metadata` exports per route, `sitemap.ts`, `robots.ts`, OG images via `@vercel/og` | Day 1 |
| Analytics | `@vercel/analytics`, `@vercel/speed-insights` | **Defer** (per PROJECT.md) |
## Sources
- [Next.js v16 upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-16) — verified Next.js 16, React 19.2, Turbopack stable, `next lint` removed (HIGH)
- [Next.js installation](https://nextjs.org/docs/app/getting-started/installation) — verified `create-next-app` defaults and flags (HIGH)
- [Next.js next.config.ts docs](https://nextjs.org/docs/pages/api-reference/config/typescript) — verified Node 22.18+ for native TS config (HIGH)
- [Tailwind CSS upgrade guide](https://tailwindcss.com/docs/upgrade-guide) — verified v4.1 status, PostCSS plugin split, browser targets (HIGH)
- [Tailwind CSS Next.js install](https://tailwindcss.com/docs/guides/nextjs) — verified `@tailwindcss/postcss` package and setup (HIGH)
- [Vercel Hobby plan](https://vercel.com/docs/plans/hobby) — verified limits and non-commercial clause (HIGH)
- [Vercel limits](https://vercel.com/docs/limits) — verified bandwidth (100 GB), build minutes (45/deploy), function invocations (1M) (HIGH)
- [Vercel custom domain setup](https://vercel.com/docs/domains/set-up-custom-domain) — verified A record `76.76.21.21` for apex, RFC1034 reasoning (HIGH)
- [Resend pricing](https://resend.com/pricing) — verified 3,000/mo, 100/day, 1 verified domain on free tier (HIGH)
- [Resend Next.js guide](https://resend.com/nextjs) — verified Server Action integration pattern (HIGH)
- [Motion (motion.dev)](https://motion.dev/) — verified package rename from `framer-motion` to `motion`, import path `motion/react` (HIGH)
- [shadcn/ui Tailwind v4 docs](https://ui.shadcn.com/docs/tailwind-v4) — verified shadcn v4 + React 19 compatibility (HIGH)
- [Lucide vs Heroicons vs Phosphor bundle benchmark — PkgPulse](https://www.pkgpulse.com/guides/lucide-vs-heroicons-vs-phosphor-react-icon-libraries-2026) — verified bundle sizes and weekly downloads (MEDIUM, cross-checked with npm)
- [Geist vs Inter comparison — pravinkumar.co](https://www.pravinkumar.co/blog/inter-geist-plus-jakarta-sans-webflow-b2b-2026) — typography analysis (MEDIUM, opinionated but well-reasoned)
- [pnpm vs bun vs npm 2026 — pkgpulse](https://www.pkgpulse.com/guides/pnpm-vs-bun-vs-npm-2026) — verified install benchmarks for Next.js (MEDIUM)
- [Next.js MDX guide](https://nextjs.org/docs/pages/guides/mdx) — verified `@next/mdx` usage with App Router (HIGH)
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
