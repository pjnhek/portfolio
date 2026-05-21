# pjnhek.com — James Nhek Portfolio

Custom portfolio for **James Nhek**, AI Engineer at Asurion. Built as part of
the portfolio itself — recruiters who click "View Source" should see real
engineering, not a template.

Stack: Next.js 16 App Router · React 19.2 · Tailwind v4 (CSS-first `@theme`) ·
TypeScript strict · Geist via `next/font/google` · pnpm on Node 22 LTS ·
deployed on Vercel Hobby.

## Run locally

```bash
pnpm install
pnpm dev            # http://localhost:3000
pnpm lint           # eslint .
pnpm typecheck      # tsc --noEmit
pnpm format:check   # prettier --check .
pnpm build          # next build --turbopack
```

Requires **Node >= 22.18** and **pnpm 10.x** (pinned via `packageManager` and
`engines.node` in `package.json`, enforced by `.npmrc`).

## Status

Phase 1 — Foundation Slice (shell only; real content lands in Phase 2). See
[`.planning/ROADMAP.md`](./.planning/ROADMAP.md) for the full plan. Each PR
gets a Vercel preview URL — that is the load-bearing signal until the custom
domain is cut over in Phase 4.

## Where things live

- `src/app/` — App Router routes (`layout.tsx`, `page.tsx`, `globals.css`)
- `src/components/primitives/` — 5 hand-rolled Server Component UI primitives
  (`Section`, `NumberedHeading`, `Tag`, `ExternalLink`, `ArchitectureDiagram`)
- `src/lib/env.ts` — zod-validated env parser; build hard-fails on missing
  required env (FOUND-10)
- `public/diagrams/` — placeholder SVG today; real sanitized diagrams in
  Phase 2
- `.planning/` — project brief, requirements, roadmap, per-phase research +
  plans + summaries (the planning history is part of the portfolio)

## Project brief

Full audience + constraints + out-of-scope hard contract: see
[`.planning/PROJECT.md`](./.planning/PROJECT.md).
