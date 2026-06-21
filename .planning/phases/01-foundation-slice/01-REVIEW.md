---
phase: 01-foundation-slice
reviewed: 2026-05-20T00:00:00Z
depth: standard
files_reviewed: 9
files_reviewed_list:
  - src/app/layout.tsx
  - src/app/page.tsx
  - src/app/globals.css
  - src/lib/env.ts
  - src/components/primitives/Section.tsx
  - src/components/primitives/NumberedHeading.tsx
  - src/components/primitives/Tag.tsx
  - src/components/primitives/ExternalLink.tsx
  - src/components/primitives/ArchitectureDiagram.tsx
findings:
  critical: 0
  warning: 1
  info: 5
  total: 6
status: issues_found
---

# Phase 1: Code Review Report

**Reviewed:** 2026-05-20
**Depth:** standard
**Files Reviewed:** 9
**Status:** issues_found

## Summary

Phase 1 is an intentionally minimal foundation slice — a Next.js 16 + Tailwind v4 + TypeScript-strict scaffold, five Server-Component primitives whose API contracts are LOCKED in `01-UI-SPEC.md`, a zod-validated `src/lib/env.ts`, and a home shell that renders the verbatim "honest skeleton" copy from the Copywriting Contract.

The submitted code is **clean against the focus areas**:

- All five primitives are correctly Server Components (no `"use client"` directives, no event handlers, no client-only APIs).
- TypeScript strict + `noUncheckedIndexedAccess` is on; no `any`, no unsafe casts, no unchecked indexed access in the reviewed code.
- `src/lib/env.ts` runs `safeParse(process.env)` at module top and throws on failure — the FOUND-10 build-fail-on-missing contract is correctly armed; the `.default("https://pjnhek.com")` is intentional Phase 1 scaffolding per UI-SPEC and the summary docs (Phase 4 removes it).
- `ExternalLink` correctly hard-codes `target="_blank" rel="noopener noreferrer"` and an `aria-hidden` glyph; `ArchitectureDiagram` correctly requires `alt` at the type level; `NumberedHeading` correctly defaults to `<h2>` and the hero `<h1>` stays inline.
- No secrets, no `dangerouslySetInnerHTML`, no `eval`, no debug artifacts. Tailwind v4 `@theme` lives in `globals.css` (no `tailwind.config.*`); `next.config.ts` has no `output: 'export'`; `metadataBase` reads the validated env.

One **Warning** is raised against `ExternalLink` for missing protocol validation on `href` — the primitive is locked in UI-SPEC.md against props but its internal safety against `javascript:` / `data:` URIs is not covered by the contract and is worth tightening at the primitive boundary before Phase 2 wires real URLs through it. Modern React (18+) blocks `javascript:` URL navigation at render time, which lowers severity, but the defense-in-depth gap is real for a primitive that will be reused across the site.

Five **Info** items document smaller issues: CLS risk on `<img>` in `ArchitectureDiagram` (no intrinsic dimensions), fragile `.svg` detection by string suffix, redundant `--turbopack` flag (Turbopack is the default in Next 16 — does not break anything, just noise), prose-className duplication in `page.tsx` (intentionally tolerated for Phase 1's honest-skeleton scope), and a forward-looking note about importing `env` from Client Components in later phases.

Items explicitly **out of scope** per the review brief and not flagged: no tests, no error boundaries, no dynamic OG image, no Resend Server Action, no per-project pages, no analytics, no nav/footer, no `mailto:` — all deferred to later phases per PROJECT.md and UI-SPEC.md.

---

## Warnings

### WR-01: `ExternalLink` does not validate `href` protocol

**File:** `src/components/primitives/ExternalLink.tsx:18-40`
**Issue:** The `href` prop is typed as `string` and passed directly to the `<a>` tag. A caller (now or in Phase 2, when this primitive will be wired to real URLs in Projects/Contact) could pass a `javascript:`, `data:`, or `vbscript:` URI and bypass the threat-model assumption that `ExternalLink` carries an HTTPS link. The `target="_blank" rel="noopener noreferrer"` mitigates reverse-tabnabbing but does **not** prevent script-URL execution.

Mitigating context (why this is a Warning, not Critical):
- React 18+ blocks `javascript:` URL navigation at render time with a warning/error, and Next.js further restricts client-side router navigation to known protocols.
- Phase 1 only uses `ExternalLink` once with a hardcoded literal `https://github.com/pjnhek`.
- The threat model accepts that primitive callers are first-party.

But this primitive is the only locked place where URL-bearing strings cross from caller code into a real DOM `<a href>`, and adding a one-line guard here is cheap insurance before Phase 2 wires real URLs through it (Projects cards, Contact, footer). The UI-SPEC.md props contract (`href: string`) is preserved; the runtime check is purely defensive and additive.

**Fix:** Add a protocol guard at the top of the component body. Two acceptable shapes:

```tsx
export function ExternalLink({ href, children, showGlyph = true }: ExternalLinkProps) {
  // Defense-in-depth: ExternalLink is a wrapper for HTTPS URLs only.
  // React already blocks javascript: at render, but we add an explicit
  // allowlist so the primitive's contract is visible at the call site.
  const isSafeHref =
    href.startsWith("https://") ||
    href.startsWith("http://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:");
  if (!isSafeHref) {
    throw new Error(
      `ExternalLink: unsafe href protocol. Got "${href.slice(0, 32)}"; expected http(s)://, mailto:, or tel:.`,
    );
  }

  return (
    <a
      href={href}
      // ...rest unchanged
```

Alternative (less strict, throw → log + render `#`): replace `href` with `"#"` and `console.warn` in development. Either shape preserves the locked UI-SPEC contract. Pair with a UI-SPEC.md note that `ExternalLink` only accepts http(s)/mailto/tel URLs.

---

## Info

### IN-01: `ArchitectureDiagram` passthrough `<img>` lacks intrinsic dimensions → CLS risk

**File:** `src/components/primitives/ArchitectureDiagram.tsx:32-37`
**Issue:** The SVG branch renders a bare `<img src={src} alt={alt} className="h-auto w-full ...">` with no `width` / `height` attributes. While modern browsers can infer aspect ratio from an SVG's intrinsic `viewBox`, omitting explicit `width`/`height` (or a `style={{ aspectRatio: ... }}`) means the layout cannot reserve space before the SVG fetches and parses → potential Cumulative Layout Shift on the home route, where the placeholder SVG sits inside the LCP region of the About section. The raster branch (line 39-41) correctly wraps in `aspect-[16/9]`; the SVG branch should match.

Note that the UI-SPEC.md §5 render sketch also omits dimensions, so tightening this requires either (a) accepting that the SVG branch breaks the spec sketch verbatim (the spec sketch says "simplified") or (b) adding to the locked contract. Recommendation (a): keep the spec sketch as-is and harden the actual primitive.

**Fix:** Either wrap the `<img>` in the same `aspect-[16/9]` container as the raster branch, or pass `width={1600} height={900}` (matching the 16:9 ratio of the placeholder's 800×450 viewBox at 2x):

```tsx
{isSvg ? (
  <div className="aspect-[16/9] w-full border border-[color:var(--color-rule)]">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src={src}
      alt={alt}
      className="h-full w-full object-contain"
    />
  </div>
) : (
  // ...raster branch unchanged
)}
```

This makes the two branches visually identical in their reserved-space behavior and removes the CLS risk before Phase 2 ships real SVG diagrams.

### IN-02: `.svg` extension check is fragile to query-strings and uppercase variations

**File:** `src/components/primitives/ArchitectureDiagram.tsx:28`
**Issue:** `src.toLowerCase().endsWith(".svg")` correctly handles uppercase but breaks on common URL shapes:
- Cache-busted paths: `/diagrams/asurion.svg?v=2` → falls through to the `next/image` raster branch and rasterizes the SVG, destroying fidelity (the very thing the branch exists to prevent).
- Hashed paths: `/diagrams/asurion.svg#layer-1` → same problem.
- Content-type-correct but extension-less: `/api/diagrams/asurion` returning `image/svg+xml` → also raster branch.

Phase 1 uses only `/diagrams/_placeholder.svg` (no query, no hash), so this isn't exploited today, but DIAG-01/02/03 in Phase 2 will add multiple real SVG diagrams and the cache-busting case is realistic.

**Fix:** Parse the path component before checking the extension:

```tsx
const pathname = src.split("?")[0]?.split("#")[0] ?? "";
const isSvg = pathname.toLowerCase().endsWith(".svg");
```

Or accept an explicit `kind?: "svg" | "raster"` prop and let the caller declare intent. The first form is a one-line fix that preserves the locked prop shape; the second extends the contract and should not land without a UI-SPEC.md amendment.

### IN-03: `--turbopack` flag is redundant in Next.js 16

**File:** `package.json:11-12`
**Issue:** `"dev": "next dev --turbopack"` and `"build": "next build --turbopack"` both pass `--turbopack` explicitly. Turbopack is the default in Next.js 16 for both dev and build per the upgrade notes (and per CLAUDE.md's stack notes). The flag is no-op at best and clutters the scripts at worst. Not a bug, but it makes the `package.json` read as if the project is still on the opt-in Turbopack flow from Next.js 14/15.

**Fix:**

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  ...
}
```

Hold off if the scaffold's stated convention is "be explicit about non-default bundlers" — the scaffold emits this form, so removing it is a minor stylistic choice rather than a correctness fix.

### IN-04: Prose `<p>` className is duplicated across all 5 sections in `page.tsx`

**File:** `src/app/page.tsx:38, 49, 55-56, 65, 72`
**Issue:** The body-paragraph className `"text-[length:var(--text-body)] leading-[var(--leading-body)] text-[color:var(--color-ink-muted)]"` is repeated verbatim 5 times. Phase 1 is intentionally minimal and Phase 2 swaps placeholders for real content, so this duplication has a known short half-life — but if Phase 2 lands the wrong shape (e.g. real content keeps the muted color, which it shouldn't because muted is the "Coming soon" placeholder treatment), the repetition makes the divergence harder to spot.

**Fix (optional, Phase-1-scope-safe):** This is intentional per the Plan 02 contract (`page.tsx` is the inline composition exercise; primitive extraction is locked at 5 components). Do NOT extract a `<MutedParagraph>` primitive in Phase 1 — that would violate the locked UI-SPEC.md §6 (5 primitives, exact list). Phase 2 should remove the muted-color className when it swaps placeholders for real prose; flagging here as a tripwire for the Phase 2 reviewer.

### IN-05: `src/lib/env.ts` is import-safe from Server Components today, but the failure path leaks to clients if imported there

**File:** `src/lib/env.ts:11-27`
**Issue:** Today only `src/app/layout.tsx` (a Server Component) imports `env`, so the `console.error` + `throw` path stays server-side and the FOUND-10 contract is met. In Phase 2+, if any Client Component (`"use client"` file) imports `env`, Next.js will:
- Inline `process.env.NEXT_PUBLIC_SITE_URL` at build time (correct — that's the `NEXT_PUBLIC_` contract).
- Ship the entire `env.ts` module — including the `throw new Error(...)` block — into the client bundle.
- Run `safeParse(process.env)` in the browser, where `process.env` is `{}` (or a tiny stub), causing the throw to fire in the browser on page load.

This isn't a Phase 1 issue (zero `"use client"` directives), but it is a footgun the next phase's plan should mention. A `// Do not import from Client Components` JSDoc comment, or splitting into `env.server.ts` + `env.public.ts`, would make the boundary self-documenting.

**Fix (deferred):** Add a top-of-file note now; revisit in Phase 2 when the first Client Component lands:

```ts
// IMPORTANT: This module reads server-side process.env. Do NOT import from
// Client Components — Next.js will bundle the throw path into the client and
// fire on page load. If a Client Component needs the site URL, expose it via
// a prop or read it from `next/headers` in a Server Component wrapper.
```

---

_Reviewed: 2026-05-20_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
