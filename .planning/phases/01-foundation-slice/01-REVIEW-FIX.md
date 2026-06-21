---
phase: 01-foundation-slice
fixed_at: 2026-05-20T00:00:00Z
review_path: .planning/phases/01-foundation-slice/01-REVIEW.md
iteration: 1
findings_in_scope: 6
fixed: 5
skipped: 1
status: partial
---

# Phase 1: Code Review Fix Report

**Fixed at:** 2026-05-20
**Source review:** `.planning/phases/01-foundation-slice/01-REVIEW.md`
**Iteration:** 1
**Scope:** `--all` (user explicitly opted in; 1 Warning + 5 Info)

**Summary:**
- Findings in scope: 6 (1 Warning, 5 Info)
- Fixed: 5 (WR-01, IN-01, IN-02, IN-03, IN-05)
- Deferred (intentionally skipped, not a failure): 1 (IN-04)

**Final verification** (run from the reviewfix worktree against the merged tip):

| Check | Result |
|---|---|
| `pnpm lint` | exit 0 (no errors, no warnings) |
| `pnpm typecheck` | exit 0 |
| `pnpm build` | exit 0 — `Next.js 16.2.6 (Turbopack)` built `/` and `/_not-found` as static |

UI-SPEC invariants confirmed: no `"use client"` introduced, no new dependencies, all five primitive prop signatures unchanged. The `ExternalLink` allowlist is purely additive runtime hardening — `href: string` still accepts a string at the type level.

---

## Fixed Issues

### WR-01: `ExternalLink` does not validate `href` protocol

**Files modified:** `src/components/primitives/ExternalLink.tsx`
**Commit:** `3a08950`
**Applied fix:** Added an `http://` / `https://` / `mailto:` allowlist (the scope explicitly requested by the fixer's context — note `tel:` is intentionally NOT in the allowlist even though REVIEW.md mentioned it; the context narrowed the allowlist). The check runs at the top of the component body via a small `isSafeHref` helper backed by a `SAFE_PROTOCOLS` tuple. If the protocol falls outside the allowlist, the primitive degrades gracefully — children render as plain text (no `<a>` wrapper) and a `console.warn` fires in development. Picked this shape over the REVIEW.md "throw" alternative because a hard throw at server-render time would crash the whole route on a single bad URL, which is hostile for Phase 2 when more URLs land. The UI-SPEC.md §4 prop contract (`href: string`, `children`, `showGlyph?`) is unchanged.

Notes for Phase 2 reviewer: the call site `<ExternalLink href="https://github.com/pjnhek">` in `page.tsx` still routes through the allowlisted `https://` branch — Phase 1 visible output is unchanged.

### IN-01: `ArchitectureDiagram` SVG branch lacks intrinsic dimensions (CLS risk)

**Files modified:** `src/components/primitives/ArchitectureDiagram.tsx`
**Commit:** `987ded8`
**Applied fix:** Wrapped the SVG passthrough `<img>` in an `aspect-[16/9] w-full border border-[color:var(--color-rule)]` container — symmetric with the raster branch. Moved the border from the `<img>` to the wrapper and switched the `<img>` classes to `h-full w-full object-contain` so the image fills the reserved box. Both branches now reserve identical layout space before the asset resolves, removing the CLS risk in the About section's LCP region.

### IN-02: `.svg` extension check fails on query/hash paths

**Files modified:** `src/components/primitives/ArchitectureDiagram.tsx`
**Commit:** `7936324`
**Applied fix:** Strip the query string and hash before the suffix check. The one-liner is:

```ts
const pathname = src.split("?")[0]?.split("#")[0] ?? "";
const isSvg = pathname.toLowerCase().endsWith(".svg");
```

The `?.` and `?? ""` chain are required because `noUncheckedIndexedAccess: true` types `split(...)[0]` as `string | undefined`. Now `/diagrams/foo.svg?v=2` and `/diagrams/foo.svg#layer-1` correctly route to the SVG branch instead of getting rasterized through `next/image`. UI-SPEC.md prop shape (`src: string`) is unchanged.

### IN-03: Redundant `--turbopack` flag in package.json scripts

**Files modified:** `package.json`
**Commit:** `4f46af3`
**Applied fix:** Removed `--turbopack` from `dev` and `build`. Turbopack is the default in Next.js 16 (CLAUDE.md stack notes confirm this; the build output `Next.js 16.2.6 (Turbopack)` confirms it at runtime). No lockfile update needed — no dependency change.

### IN-05: `src/lib/env.ts` failure path can leak to clients

**Files modified:** `src/lib/env.ts`
**Commit:** `b4f4da2`
**Applied fix:** Converted the leading line-comment block to a JSDoc block that opens with `SERVER-ONLY env-var parser (FOUND-10). DO NOT import from Client Components.` and spells out the three failure steps if a `"use client"` file imports it (NEXT_PUBLIC_* inlining → whole module bundled into client → `throw` fires on page load in the browser). Points to the two acceptable workarounds (prop-drill from a Server Component wrapper, or split into `env.server.ts` + `env.public.ts`). The JSDoc form makes the warning visible on hover in editors — a documentation-only change with zero runtime effect.

---

## Deferred Issues

### IN-04: Prose `<p>` className duplicated across 5 sections in `page.tsx`

**File:** `src/app/page.tsx:38, 49, 55-56, 65, 72`
**Reason:** Deferred to Phase 2 by explicit instruction — the locked UI-SPEC.md §6 declares exactly 5 primitives (`Section`, `NumberedHeading`, `Tag`, `ExternalLink`, `ArchitectureDiagram`). Extracting a 6th `Prose` / `MutedParagraph` primitive in Phase 1 would violate the contract. REVIEW.md itself flagged this as a Phase-2 tripwire rather than a Phase 1 fix.

**Original issue:** The body-paragraph className `"text-[length:var(--text-body)] leading-[var(--leading-body)] text-[color:var(--color-ink-muted)]"` is repeated verbatim 5 times in `page.tsx`. The duplication is short-half-life (Phase 2 swaps placeholders for real content) but creates a tripwire: if Phase 2 keeps the muted color on real prose (it shouldn't — muted is the "Coming soon" placeholder treatment), the divergence will be hard to spot.

**Action for Phase 2:**
1. When real prose lands, REMOVE the `text-[color:var(--color-ink-muted)]` className from real-content paragraphs — muted is reserved for placeholders.
2. If the duplication is still painful after that, propose adding a `Prose` primitive in the Phase 2 UI-SPEC.md amendment and extract there. Do NOT extract one in Phase 1.

No commit was made for this finding.

---

_Fixed: 2026-05-20_
_Fixer: Claude (gsd-code-fixer)_
_Iteration: 1_
