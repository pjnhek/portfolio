# Walking Skeleton — pjnhek.com

**Phase:** 1
**Generated:** 2026-05-20

## Capability Proven End-to-End

A recruiter (or anyone with the preview URL) visits a live Vercel preview deploy of pjnhek.com and sees a typographically-correct, monochrome, Geist-rendered shell of the home route — proving that the Next.js 16 + React 19.2 + Tailwind v4 (CSS-first `@theme`) + TypeScript strict + Geist + zod-validated env + Vercel-preview-on-PR toolchain works end-to-end before any real portfolio content is written.

> Note on the "real read/write" gate from the Walking Skeleton template: this project has **no database** (content lives in typed TS modules from Phase 2 forward). The substitute end-to-end interaction that exercises the full stack is: a **zod-validated env var (`NEXT_PUBLIC_SITE_URL`) consumed by `app/layout.tsx`'s `metadataBase` at build time** — removing the zod `.default()` and unsetting the env var must fail `pnpm build` with a zod error. This is verified explicitly in Plan 02. Combined with a real Vercel preview URL (Plan 03), the slice exercises: source → build → static render → CDN → browser, with build-time input validation in the middle.

## Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Framework | Next.js 16.2.x (App Router) + React 19.2.x + Turbopack | CLAUDE.md locked stack; Server Components default minimizes client JS; FOUND-01 requirement |
| Styling | Tailwind CSS v4.3.x (CSS-first `@theme` in `src/app/globals.css`, no `tailwind.config.js`) | FOUND-02 + CLAUDE.md "What NOT to Use"; design tokens are recruiter-readable in CSS |
| Fonts | Geist Sans + Geist Mono via `next/font/google`, `display: 'swap'`, CSS vars `--font-geist-sans` / `--font-geist-mono`, surfaced as `--font-sans` / `--font-mono` inside `@theme inline` | D-05, FOUND-03; self-hosted, zero FOUT, zero external request |
| Language | TypeScript 5.6+ (whatever `create-next-app` pulls), `strict: true`, `noUncheckedIndexedAccess: true` | FOUND-04; recruiters read `tsconfig.json` |
| Package manager | pnpm (pinned via `packageManager: pnpm@<exact>` in `package.json`) on Node 22 LTS (`engines.node >=22.18`) | FOUND-13 + CLAUDE.md; enables native `next.config.ts` loading without flags; matches Vercel default |
| Env validation | `src/lib/env.ts` exports a `z.object` parsed at module init; `NEXT_PUBLIC_SITE_URL` is the seeded variable; consumed by `app/layout.tsx` `metadataBase` | FOUND-10; build-time failure is the stack's "real read/write" proof |
| Linting | ESLint 9 flat config (`eslint.config.mjs`) using `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript` + `eslint-config-prettier/flat` (last); script is `eslint .` (NOT `next lint` — removed in Next 16) | FOUND-11 + Next.js 16 docs |
| Formatting | Prettier 3 with `prettier-plugin-tailwindcss` (auto-sorts Tailwind class strings) | FOUND-11 + CLAUDE.md |
| Repo hosting | GitHub: `pjnhek/portfolio`, public, main branch protected (Require PR + Vercel status check) | D-01, DEP-01; "View Source" is part of the portfolio |
| Deployment target | Vercel Hobby, GitHub integration, preview deploys on every PR; production deploy stays on `*.vercel.app` until Phase 4 cuts `pjnhek.com` | D-02, DEP-02 |
| Directory layout | `--src-dir` scaffold default; `src/app/`, `src/components/primitives/`, `src/lib/`, `public/diagrams/`. No `content/`, `types/`, `actions/` yet — Phase 2 owns those | RESEARCH.md "Layout arbitration" |
| Content source of truth | Typed TS modules in `content/` (NOT MDX) — Phase 2 introduces; Phase 1 ships zero real content (D-07 labeled-skeleton with verbatim placeholders) | STATE.md Key Decisions Locked |
| Client-side interactivity | None in Phase 1. Zero `"use client"` directives. First island (`CopyEmail.tsx`) lands in Phase 2 | RESEARCH.md "Architectural Responsibility Map" |
| Icon library | `lucide-react` installed Day 1 (per UI-SPEC), **not imported** in Phase 1 (first icon usage is Phase 2 Contact) | UI-SPEC.md Design System table |
| Image handling | `next/image` for raster; passthrough `<img>` for SVG (with intentional `@next/next/no-img-element` disable) — `ArchitectureDiagram` branches on extension | D-08 + RESEARCH.md Pattern 7 |

## Stack Touched in Phase 1

- [x] **Project scaffold** — `pnpm create next-app@latest` with `--typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --turbopack`; ESLint flat config; Prettier with Tailwind plugin; TypeScript strict + `noUncheckedIndexedAccess`; `package.json` pins `packageManager` and `engines.node`
- [x] **Routing** — One real route: `/` (the home shell). No `/uses`, no `/projects/[slug]` yet (Phase 2)
- [x] **Database** — N/A by design. Substitute: **zod-validated env var consumed at build time** (`src/lib/env.ts` → `app/layout.tsx` `metadataBase`). Negative test: unsetting `NEXT_PUBLIC_SITE_URL` with the `.default()` removed fails `pnpm build` with a zod error
- [x] **UI** — Five Server-Component primitives (`Section`, `NumberedHeading`, `Tag`, `ExternalLink`, `ArchitectureDiagram`) composed into the home shell; each primitive exercised at least once on the home route; `_placeholder.svg` committed to `public/diagrams/`
- [x] **Deployment** — Vercel project linked to `pjnhek/portfolio`; preview deploy fires on every PR; preview URL returns 200 and `<title>` contains "James Nhek"; main branch protected; a smoke-test PR validates the preview pipeline end-to-end

## Out of Scope (Deferred to Later Slices)

Locked by `PROJECT.md ## Out of Scope`, `REQUIREMENTS.md ## v2`, and `CONTEXT.md <deferred>`. Phase 1 plans MUST NOT touch:

- Real Hero / About / Experience / Featured Projects / Contact / Uses content — **Phase 2** (verbatim "Coming soon — …" placeholders from UI-SPEC.md Copywriting Contract are the entire Phase 1 copy)
- `content/`, `types/`, `actions/` directories — **Phase 2**
- Real architecture diagrams (only `_placeholder.svg` ships) — **Phase 2** (DIAG-01..04, gated by confidentiality review)
- `/uses` route (only the `#uses` anchor exists on `/`) — **Phase 2**
- `mailto:` link, copy-email button, `CopyEmail.tsx` client island — **Phase 2** (SEC-06, SEC-07)
- `lib/seo.ts` factory, `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.tsx`, `app/icon.tsx`, `app/apple-icon.tsx`, `app/not-found.tsx` — **Phase 3**
- `pjnhek.com` DNS, HTTPS verification on all four URL variants, legacy `pnhek.github.io` redirect, `NEXT_PUBLIC_SITE_URL=https://pjnhek.com` in Vercel production — **Phase 4**
- Resend / contact form Server Action — **v2 (POST-01)**
- Dark/light mode toggle, `next-themes` — **permanent out-of-scope**
- `motion` / `framer-motion` — **v1 out-of-scope**
- `@next/mdx`, MDX content — **v1 out-of-scope**
- `shadcn/ui`, MUI/Chakra/Mantine/Ant — **permanent out-of-scope for v1**
- `@vercel/analytics`, `@vercel/speed-insights` — **deferred** (silent enable possible in v1.x)
- Vitest/Jest/Playwright tests — **deferred** (CLAUDE.md "What NOT to Use"; toolchain is the validation harness in Phase 1)
- Husky / lint-staged pre-commit hooks — **deferred** (Vercel preview is the enforcement boundary in Phase 1)
- Tab title or any string that does NOT contain "James Nhek" on `/` — **forbidden** (ROADMAP success #2)
- `tailwind.config.js`, `next lint` script, `output: 'export'` in `next.config.ts`, `framer-motion` package, `react-icons` umbrella — **forbidden by CLAUDE.md**

## Subsequent Slice Plan

Each later phase adds one vertical slice on top of this skeleton without altering its architectural decisions:

- **Phase 2: Content & Sections (Confidentiality Gate)** — Swap "Coming soon — …" placeholders for real Hero / About / Experience / 4 Featured Projects (1-col mobile / 2-col desktop) / Contact content into the **same component tree** built here; introduce `content/`, `types/`, `lib/content.ts`; ship `CopyEmail.tsx` (first and only Phase-2 client island); render `/projects/[slug]` for each of the 4 slugs via `generateStaticParams`; ship `/uses`; ship at least one sanitized Asurion architecture diagram + one project diagram through the `ArchitectureDiagram` primitive defined here. Gated by an explicit confidentiality review on every Asurion-touching paragraph and diagram.

- **Phase 3: SEO, Polish, Performance & Accessibility** — Build `lib/seo.ts` `buildMetadata({title,description,path})` factory on top of the `app/layout.tsx` defaults seeded here; ship `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.tsx`, `app/icon.tsx`, `app/apple-icon.tsx`, `app/not-found.tsx`; hit Lighthouse mobile Performance ≥95 and Accessibility = 100; zero axe issues on `/`, `/uses`, one `/projects/[slug]`; total home-route JS shipped < 100 KB gzipped; cold-read pass.

- **Phase 4: Domain Cutover & Production Verification** — Add `NEXT_PUBLIC_SITE_URL=https://pjnhek.com` to Vercel production env (and remove the `.default()` from the zod schema in `src/lib/env.ts` seeded here); configure DNS at the registrar (apex `A 76.76.21.21`, `CNAME www → cname.vercel-dns.com`); verify HTTPS on all four URL variants; decommission or 301 `pnhek.github.io`; curate `github.com/pjnhek` pinned repos; arm Vercel usage alerts; re-verify the OG card from Phase 3 against the production URL.
