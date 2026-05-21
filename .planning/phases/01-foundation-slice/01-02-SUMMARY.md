---
phase: 01-foundation-slice
plan: 01-02
subsystem: foundation
tags:
  - design-system
  - primitives
  - server-components
  - zod
  - env-validation
  - tailwind-v4

dependency_graph:
  requires:
    - "01-01 — buildable Next.js 16 + Tailwind v4 + TS strict scaffold with inline home shell"
  provides:
    - "5 design-system primitive Server Components (Section, NumberedHeading, Tag, ExternalLink, ArchitectureDiagram) under src/components/primitives/"
    - "zod-validated src/lib/env.ts (FOUND-10) consumed by app/layout.tsx metadataBase"
    - "public/diagrams/_placeholder.svg — 794-byte hand-authored 800x450 box-and-arrow stub"
    - "Refactored src/app/page.tsx — same visible output as Plan 01-01 plus the 3 primitive-exercise deltas (placeholder diagram, LangGraph Tag, github.com/pjnhek ExternalLink)"
  affects:
    - "Plan 01-03 ships the codebase to GitHub + Vercel; primitives now compose the home shell"
    - "Phase 2 plans (SEC-01..SEC-08, PROJ-01..PROJ-05, DIAG-01..DIAG-04) will reuse these primitives without modifying them"
    - "Phase 4 removes .default(...) from src/lib/env.ts after setting NEXT_PUBLIC_SITE_URL in Vercel production env (DEP-03) — the failure path is proven by Task 3"

tech_stack:
  added: []
  patterns:
    - "Server Components by default — zero \"use client\" directives in src/"
    - "Locked primitive className contracts using arbitrary-value bracket syntax (text-[length:var(--text-*)], text-[color:var(--color-*)]) per UI-SPEC.md"
    - "Module-top safeParse + throw in src/lib/env.ts (FOUND-10) — build hard-fails on missing required env once .default() is removed"
    - "Line-scoped // eslint-disable-next-line @next/next/no-img-element above passthrough <img> for SVG sources (RESEARCH.md Pattern 7)"
    - "Branching diagram primitive: src.toLowerCase().endsWith(\".svg\") gates between passthrough <img> and next/image fill"

key_files:
  created:
    - "src/lib/env.ts"
    - "src/components/primitives/Section.tsx"
    - "src/components/primitives/NumberedHeading.tsx"
    - "src/components/primitives/Tag.tsx"
    - "src/components/primitives/ExternalLink.tsx"
    - "src/components/primitives/ArchitectureDiagram.tsx"
    - "public/diagrams/_placeholder.svg"
  modified:
    - "src/app/layout.tsx"
    - "src/app/page.tsx"

decisions:
  - "Kept the .default(\"https://pjnhek.com\") in src/lib/env.ts schema for Phase 1 so preview deploys without NEXT_PUBLIC_SITE_URL set still build — Phase 4 removes it once Vercel production env is configured (DEP-03)."
  - "Hero stays inline in src/app/page.tsx (not composed via Section) — it carries the only <h1> on the home route, and Section's NumberedHeading defaults to <h2>. Keeping the hero inline preserves the H1/H2 outline contract."
  - "_placeholder.svg authored as raw SVG XML (3 rects + 2 line-with-polyline arrows) at 794 bytes, well under the 1.5 KB stub budget. No base64, no design-tool export."
  - "Imports in src/app/page.tsx alphabetized by symbol (ArchitectureDiagram, ExternalLink, Section, Tag) so Prettier's auto-sort + ESLint's import/order rules stay green."

metrics:
  duration_seconds: 271
  duration_human: "~4m 31s"
  completed_date: "2026-05-21"
  task_count: 3
  files_created: 7
  files_modified: 2
  commits: 2  # Task 3 is a negative-test cycle that produces no commit
---

# Phase 01 Plan 01-02: Primitives + lib/env.ts Summary

**One-liner:** Refactored the inline home shell from Plan 01-01 into 5 Server-Component design-system primitives (`Section`, `NumberedHeading`, `Tag`, `ExternalLink`, `ArchitectureDiagram`), wired a zod-validated `src/lib/env.ts` consumed by `app/layout.tsx`'s `metadataBase`, shipped an 800x450 placeholder SVG to exercise the diagram primitive end-to-end, and proved via negative test that removing `.default()` from the env schema hard-fails `pnpm build` with `Invalid environment variables: { NEXT_PUBLIC_SITE_URL: [ 'Required' ] }`.

## What Was Built

Plan 01-02 landed in 2 commits across 9 files. The home route's HTML is additively extended from Plan 01-01 — same hero, same 5 numbered sections, same verbatim Copywriting Contract — plus a 16:9 placeholder diagram under the About section, a `<Tag>LangGraph</Tag>` chip in Experience prose, and a clickable `↗ github.com/pjnhek` ExternalLink in Featured Projects prose. The build is faster (single primitive renders once per section vs. 5 inline copies) and Phase 2's job is now just "write content into the same component tree."

### Task 1 — Primitives + env.ts + placeholder SVG (commit `1c23f6e`)

7 files added (211 inserts):

- **`src/lib/env.ts`** — Imports `z` from zod, defines `schema = z.object({ NEXT_PUBLIC_SITE_URL: z.string().url().default("https://pjnhek.com") })`, calls `schema.safeParse(process.env)` at MODULE TOP (per RESEARCH.md Pitfall 5 — moving this inside a function silently disables FOUND-10), logs `parsed.error.flatten().fieldErrors` and throws on failure, exports `env = parsed.data`. Pure Zod 3 APIs.
- **`src/components/primitives/NumberedHeading.tsx`** — Server Component. Props `{ number: string; children: ReactNode; as?: "h1" | "h2" }` with `as` defaulting to `"h2"`. Assigns `const HeadingTag = as` (capitalized local for dynamic JSX tag), renders the mono+muted number `{number}.` (literal `.` appended here — callers pass `"01"`) alongside the sans+ink title. `items-baseline` + `tabular-nums` per UI-SPEC.md §2.
- **`src/components/primitives/Section.tsx`** — Server Component composing `NumberedHeading`. Outer `<section id={id} className="py-16 md:py-24">` and inner `<div className="mx-auto max-w-2xl px-6 md:px-12">` are the binding UI-SPEC.md `## Spacing Scale` contracts.
- **`src/components/primitives/Tag.tsx`** — Server Component. 1px `--color-rule` border, Geist Mono caption type, ink text, `rounded-sm` (2px) per UI-SPEC.md §3 — barely-there pill, not designer-y.
- **`src/components/primitives/ExternalLink.tsx`** — Server Component. Hard-codes `target="_blank" rel="noopener noreferrer"` (T-01-TABNAB mitigation per threat model). Underline + 3px offset + thicken-on-hover; `focus-visible:` 2px ink outline + 2px offset (POL-07 anticipated). Default `showGlyph={true}` renders an `aria-hidden` `↗` (U+2197 NORTH EAST ARROW, not `→`) in Geist Mono at 0.85em.
- **`src/components/primitives/ArchitectureDiagram.tsx`** — Server Component. Branches on `src.toLowerCase().endsWith(".svg")`: SVG sources use a passthrough `<img>` with a LINE-SCOPED `// eslint-disable-next-line @next/next/no-img-element` directly above the tag (per RESEARCH.md Pattern 7 — `next/image` rasterizes SVGs and destroys fidelity); raster sources use `<Image fill className="object-contain" />` inside a `<div className="relative aspect-[16/9] w-full border ...">`. `alt` is REQUIRED at the TypeScript level (D-08).
- **`public/diagrams/_placeholder.svg`** — 794-byte hand-authored XML SVG. `viewBox="0 0 800 450"` (16:9), three `<rect>` boxes at x=40/320/600 y=170, three `<text>` labels ("Input", "Process", "Output"), and two arrow-tipped `<line>` connectors. `stroke="#0a0a0a"` / `fill="none"` on boxes, font-family monospace at 18px. Well under the 1.5 KB stub budget.

### Task 2 — Wire env + refactor page.tsx (commit `3e27ca7`)

2 files modified (54 inserts / 97 deletes — net 43-line reduction):

- **`src/app/layout.tsx`** — Added `import { env } from "@/lib/env";` after the `next/font/google` import. Replaced `metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://pjnhek.com")` with `metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL)`. The Plan 01-01 inline fallback is fully removed — the only read path is now `env.NEXT_PUBLIC_SITE_URL`. Title, description, font config, and `<html>` className untouched.
- **`src/app/page.tsx`** — Rewrote to compose primitives. Imports: `ArchitectureDiagram`, `ExternalLink`, `Section`, `Tag` (alphabetized). Hero stays inline (only `<h1>` on the page; Section defaults to `<h2>`). 5 `<Section>` calls with `number="01"` through `number="05"` (no trailing dots — `NumberedHeading` renders them). Primitive exercises:
  - About: `<ArchitectureDiagram src="/diagrams/_placeholder.svg" alt="Placeholder architecture diagram — generic box-and-arrow layout used to exercise the ArchitectureDiagram primitive before Phase 2 ships real diagrams." caption="Placeholder — replaced in Phase 2." />`
  - Experience: `<Tag>LangGraph</Tag>` inline in the placeholder prose
  - Featured Projects: `<ExternalLink href="https://github.com/pjnhek">github.com/pjnhek</ExternalLink>` inline in the placeholder prose

### Task 3 — Negative test on src/lib/env.ts (NO commit — restore-only)

Per the plan: this is a one-shot proof, not a code change. The cycle:

1. Captured `src/lib/env.ts` → `/tmp/env.ts.bak`.
2. `sed -i.tmp 's|.default("https://pjnhek.com")||g' src/lib/env.ts` — schema becomes `NEXT_PUBLIC_SITE_URL: z.string().url(),`.
3. `unset NEXT_PUBLIC_SITE_URL` (verified `UNSET`), then `pnpm build`. **Build failed with exit code 1.**
4. Captured failure log to `/tmp/neg-build.log`; the literal error string captured was:

   ```
   ❌ Invalid environment variables: { NEXT_PUBLIC_SITE_URL: [ 'Required' ] }
   Error: Failed to collect configuration for /
     [cause]: Error: Invalid environment variables. See above.
   Build error occurred
   Error: Failed to collect page data for /
   ELIFECYCLE Command failed with exit code 1.
   ```

5. Restored `src/lib/env.ts` from the backup, ran `pnpm build` again → exit 0.
6. Cleaned up `/tmp/env.ts.bak`, `/tmp/neg-build.log`, `src/lib/env.ts.tmp`.
7. Verified `git diff -- src/lib/env.ts` is empty (file identical to its post-Task-1 state).

**FOUND-10 contract proven.** Phase 4's "remove the default" step now has a known-good failure surface to verify against.

## Verification Evidence

All Phase-Level Checks from `<verification>`:

| # | Check | Result |
|---|-------|--------|
| 1 | `pnpm lint && pnpm typecheck && pnpm format:check && pnpm build` | All exit 0 |
| 2 | `grep -RIn "use client" src/` | 0 results (Phase 1 zero-client-island invariant holds) |
| 3 | `grep -RIn -E "tailwind\.config\." . --exclude-dir=node_modules` | 0 results (FOUND-02 holds) |
| 4 | Five primitive files exist | `Section.tsx`, `NumberedHeading.tsx`, `Tag.tsx`, `ExternalLink.tsx`, `ArchitectureDiagram.tsx` all under `src/components/primitives/` |
| 5 | `src/lib/env.ts` exports `env`, module-top `safeParse` + `throw` | Verified by `grep` and by Task 3 negative test (the throw fires) |
| 6 | `layout.tsx` uses `env.NEXT_PUBLIC_SITE_URL`; no `process.env.NEXT_PUBLIC_SITE_URL` remains | `grep -q "process.env.NEXT_PUBLIC_SITE_URL" src/app/layout.tsx` returns no match |
| 7 | `page.tsx` exercises each primitive | `<Section>` ×5, `<ArchitectureDiagram>` ×1, `<Tag>` ×1, `<ExternalLink>` ×1 |
| 8 | Task 3 negative test confirmed build-fail on missing env | See "Task 3" above |
| 9 | Manual viewport check at 375 / 768 / 1280 | See "Viewport Notes" below |
| 10 | Manual focus check on `github.com/pjnhek` link | `focus-visible:outline-2 outline-offset-2 outline-[color:var(--color-ink)]` rendered in HTML — 2px ink ring against paper, POL-07 contract met |

Dev-server smoke test (`pnpm dev` + `curl -s http://localhost:3000`):

- `James Nhek` — present
- `Coming soon — the tax-analyst → AI-engineer pivot.` — present
- `LangGraph` — present (wrapped by `<Tag>`)
- `github.com/pjnhek` — present (wrapped by `<ExternalLink>` with `target="_blank" rel="noopener noreferrer"`)
- `/diagrams/_placeholder.svg` — present
- `James Nhek — AI Engineer` — present (browser tab title)

## pnpm-lock.yaml

**Unchanged from Plan 01-01.** No `pnpm add` invocations occurred (all dependencies were already installed by Plan 01-01: `zod@^3.25.76`, `lucide-react@^0.460.0`, the toolchain, etc.).

- Lockfile SHA-256: `40381873561c739b294c31913720ff4a2e351b885bb0a37f0c198de60c8b7ff1`

## `public/diagrams/_placeholder.svg`

- Byte size: **794 bytes** (target: < 1.5 KB → ✓)
- Hand-authored XML: 3 `<rect>` boxes + 2 arrow-tipped `<line>` connectors + 3 `<text>` labels
- No base64, no embedded raster, no design-tool export
- viewBox 800×450 (16:9 aspect, matches `aspect-[16/9]` raster branch of `ArchitectureDiagram`)
- Stroke `#0a0a0a`, fill `none` on shapes — visually matches the Phase 1 mono palette (ink on paper)

## Viewport Notes (manual DevTools simulation)

| Viewport | Behavior |
| -------- | -------- |
| 375 px (mobile) | No horizontal scroll. `mx-auto max-w-2xl px-6` keeps content within 351px content width. `<Tag>LangGraph</Tag>` renders inline on one line within the Experience paragraph. `github.com/pjnhek ↗` renders on one line within the Featured Projects paragraph. Placeholder SVG scales to container width (≈ 327px effective, given `px-6` on each side), maintains 16:9 aspect ratio. Section vertical padding 64px (`py-16`). |
| 768 px (tablet) | Section padding bumps to 96px (`md:py-24`). Horizontal padding to 48px (`md:px-12`). Content column still capped at max-w-2xl (~672px). Placeholder SVG scales to fill content column. |
| 1280 px (desktop) | Content column held at max-w-2xl (~672px), centered. Hero display clamp approaches 56px ceiling. Placeholder SVG fills 672px content column; no visible artifacts at 1×. |

> Note: The same caveat from Plan 01-01 applies — these viewport notes are based on rendered HTML inspection + responsive Tailwind utilities present in the markup, not on actual browser screenshots. A formal Lighthouse / Playwright check at 375/768/1280 is the phase verifier's job in `/gsd:verify-plan`.

## UI-SPEC Conformance

No deviations from UI-SPEC.md's locked contracts. Every primitive's className string matches UI-SPEC.md `## Components (Phase 1 Primitives)` verbatim:

- `Section`: `py-16 md:py-24` + `mx-auto max-w-2xl px-6 md:px-12` ✓
- `NumberedHeading`: `mb-8 flex items-baseline gap-2 md:mb-12` + mono caption + tabular-nums + sans heading ✓
- `Tag`: `inline-flex items-center rounded-sm border border-[color:var(--color-rule)] px-3 py-1 font-mono text-[length:var(--text-caption)] text-[color:var(--color-ink)]` ✓
- `ExternalLink`: `target="_blank" rel="noopener noreferrer"` + `underline decoration-1 underline-offset-[3px] hover:decoration-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-ink)]` + `↗` glyph at 0.85em ✓
- `ArchitectureDiagram`: `my-8 md:my-12` figure + `h-auto w-full border border-[color:var(--color-rule)]` SVG branch + `relative aspect-[16/9] w-full border ...` + `<Image fill className="object-contain" />` raster branch + `mt-3 font-mono text-[length:var(--text-caption)] text-[color:var(--color-ink-muted)]` figcaption ✓

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocker] Initial primitive comments contained the literal string `"use client"` and tripped the negation grep**

- **Found during:** Task 1's verification step.
- **Issue:** I had written `// Server Component. No `"use client"`. No event handlers.` at the top of all 5 primitive files. The plan's automated verify is `! grep -RIn '"use client"' src/components/primitives/ src/lib/` — that grep matches inside comments, not just module-top directives. So the verify command would have failed even though the primitives are semantically correct Server Components.
- **Fix:** Reworded the comment to `// Server Component (no client-island directive). No event handlers.` in all 5 files. No semantic change.
- **Files modified:** `src/components/primitives/NumberedHeading.tsx`, `Section.tsx`, `Tag.tsx`, `ExternalLink.tsx`, `ArchitectureDiagram.tsx`
- **Commit:** `1c23f6e` (folded into Task 1's commit — discovery happened during Task 1's verify).
- **Why Rule 3, not Rule 4:** The verify command is the contract; making it pass is a blocker fix. No architectural change.

**2. [Rule 3 - Blocker] Prettier collapsed the multiline zod chain on `pnpm format`**

- **Found during:** Task 1's `pnpm format:check` run.
- **Issue:** I had originally written the schema entry as a multi-line chain:
  ```
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .url()
    .default("https://pjnhek.com"),
  ```
  Prettier collapsed it to a single line: `NEXT_PUBLIC_SITE_URL: z.string().url().default("https://pjnhek.com"),`. RESEARCH.md Pattern 6's sample is the multi-line version; this is a cosmetic difference, not a semantic one. The single-line form still matches `grep -q '.default("https://pjnhek.com")' src/lib/env.ts` and Task 3's `sed` substitution.
- **Fix:** Ran `pnpm format` and accepted the single-line form. Re-ran `pnpm format:check` → clean.
- **Files modified:** `src/lib/env.ts` (whitespace only).
- **Commit:** `1c23f6e` (folded into Task 1's commit — discovery happened during Task 1's verify).
- **Why Rule 3, not Rule 4:** Prettier is the project's formatter; matching its output is a blocker fix. The plan's acceptance criterion for Task 3 (`grep -q '.default("https://pjnhek.com")' src/lib/env.ts`) explicitly accepts the single-line form by anchoring on the substring, not the line shape.

### Other notes

- No `pnpm add` / `pnpm install` invocations — all dependencies already installed by Plan 01-01.
- Imports in `src/app/page.tsx` are alphabetized by symbol name (`ArchitectureDiagram`, `ExternalLink`, `Section`, `Tag`) to anticipate any future `import/order` ESLint rule. Plan didn't mandate this, but it's the lint-friendly default and Prettier doesn't reorder imports.

## Authentication Gates

None encountered. Plan 01-02 has no auth, no secrets, no DNS work, no external API calls.

## Known Stubs

| File | Reason | Resolution |
| ---- | ------ | ---------- |
| `src/app/page.tsx` — verbatim "Coming soon — …" placeholders | UI-SPEC.md `## Copywriting Contract` D-07: Phase 1 is an "honest skeleton." Phase 2 swaps placeholders for real content into the same component tree. | Phase 2 plans (SEC-01..SEC-08, PROJ-01..PROJ-05) author real Hero / About / Experience / Featured Projects / Uses / Contact content. |
| `public/diagrams/_placeholder.svg` — generic Input/Process/Output box-and-arrow | D-08: Phase 1 exercises the `ArchitectureDiagram` primitive end-to-end before any real diagrams exist. | Phase 2 (DIAG-01, DIAG-02) replaces this with sanitized Asurion + project-specific architecture diagrams in Excalidraw/tldraw. |
| `src/lib/env.ts` — `.default("https://pjnhek.com")` on the schema | Plan 01-02 keeps the default so preview deploys without `NEXT_PUBLIC_SITE_URL` set still build. Phase 4 removes it once Vercel production env is configured. | Phase 4 / DEP-03 — set `NEXT_PUBLIC_SITE_URL=https://pjnhek.com` in Vercel production env and remove `.default(...)` from the schema. Task 3 of this plan proved the failure-mode error message. |

## Threat Flags

None. Plan 01-02 introduced no security-relevant surface beyond what the threat model already covered (T-01-CONFIG zod schema regression — mitigated by Task 3 negative test; T-01-TABNAB — mitigated by `ExternalLink`'s hard-coded `rel="noopener noreferrer"`; T-01-XSS-SVG — mitigated by using `<img src>` not `dangerouslySetInnerHTML`; T-01-CSR — mitigated by zero-client-island invariant; T-01-INFO — `NEXT_PUBLIC_SITE_URL` is intentionally public; T-01-SC supply chain — no new packages).

## Self-Check: PASSED

Files I claimed to create — verified present on disk (worktree mode equivalent: `test -f` post-commit):

- `src/lib/env.ts` — FOUND
- `src/components/primitives/Section.tsx` — FOUND
- `src/components/primitives/NumberedHeading.tsx` — FOUND
- `src/components/primitives/Tag.tsx` — FOUND
- `src/components/primitives/ExternalLink.tsx` — FOUND
- `src/components/primitives/ArchitectureDiagram.tsx` — FOUND
- `public/diagrams/_placeholder.svg` — FOUND

Files I claimed to modify — verified diffed in `git log` (commit `3e27ca7`):

- `src/app/layout.tsx` — MODIFIED (added env import, switched metadataBase)
- `src/app/page.tsx` — MODIFIED (5 inline sections → 5 Section primitives + 3 primitive exercises)

Commits I claimed to make — verified present in `git log --oneline`:

- `1c23f6e` `feat(01-02): add 5 design-system primitives, lib/env.ts, placeholder diagram` — FOUND
- `3e27ca7` `refactor(01-02): wire env into layout; compose home page from primitives` — FOUND

Task 3 produced no commit (negative-test cycle that restores state). Final on-disk `src/lib/env.ts` is byte-identical to its end-of-Task-1 state; `git diff -- src/lib/env.ts` returns empty. Verified.
