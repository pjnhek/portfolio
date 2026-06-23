# Phase 3: SEO, Polish, Performance & Accessibility — Research

**Researched:** 2026-06-23
**Domain:** Next.js 16 App Router metadata, ImageResponse, sitemap/robots, next/image, accessibility tooling
**Confidence:** HIGH (primary sources: official Next.js 16.2.9 docs, live npm registry, actual codebase inspection)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**OG Card (SEO-04)**
- D-OG-01: Static, generated at build time. No runtime/`@vercel/og` per-request generation. Zero Vercel Active-CPU cost. Matches SEO-04 "static" wording.
- D-OG-02: One site-wide identity card — home, /uses, and every /projects/[slug] share the same OG image.
- D-OG-03: Content = `James Nhek` / `AI Engineer @ Asurion` / `RAG · evaluations · agentic workflows` / `pjnhek.com` footer mark.
- D-OG-04: Visual = left-aligned type stack on off-white, strict monochrome, Geist. Mirrors the hero.

**Favicon / App Icon (POL-02)**
- D-ICON-01: `JN` monogram in Geist, ink on off-white, code-rendered via `app/icon.tsx` + `app/apple-icon.tsx` (ImageResponse). Legible at 16px in a tab.

**404 Page (POL-01)**
- D-404-01: Minimal + one line of voice. Big `404`, "This page wandered off. Here's the way back." (working copy, James confirms), `← Back to home` link. On-brand with About voice.

**Verification Strategy (SEO-07/08/09, POL-05/06/07/08/09/10)**
- D-VERIFY-01: All manual checks run against the PREVIEW URL in Phase 3. Phase 4 re-runs against pjnhek.com.
- D-VERIFY-02: Claude does automatable checks (Lighthouse CLI, axe CLI, bundle-budget measurement, keyboard-nav walkthrough); James runs human-only blocking checkpoints.

### Claude's Discretion

`buildMetadata` factory signature/internals, sitemap/robots implementation, exact `next/image preload`/`fetchPriority` wiring, focus-ring CSS, bundle-budget measurement method, exact 404 copy (Claude-drafted, James-confirms), OG/icon type sizes/margins.

### Deferred Ideas (OUT OF SCOPE)

- Per-route / per-project OG cards (deferred to v2, POST-04)
- Non-technical cold reader for POL-10 (optional, not required to close phase)
- Production verification on pjnhek.com (Phase 4 scope)
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SEO-01 | `lib/seo.ts` exports `buildMetadata({ title, description, path })` factory used by every route | Standard Stack §Core; Architecture Pattern 1 |
| SEO-02 | Every route has explicit `generateMetadata` with title, description, OG image, Twitter card | Metadata merging + `openGraph` shape; Pattern 1 |
| SEO-03 | Home `<title>` contains "James Nhek" | Already true; factory must not override it |
| SEO-04 | `app/opengraph-image.tsx` renders static 1200×630 PNG | OG image section; static generation confirmed |
| SEO-05 | `app/sitemap.ts` derives URLs from `content/projects.ts` | Sitemap section; MetadataRoute.Sitemap API |
| SEO-06 | `app/robots.ts` allows all crawlers, references sitemap | Robots section; MetadataRoute.Robots API |
| SEO-07 | LinkedIn Post Inspector preview verified (preview URL) | Human-verify checkpoint; D-VERIFY-02 |
| SEO-08 | opengraph.xyz preview matches (preview URL) | Human-verify checkpoint; D-VERIFY-02 |
| SEO-09 | Real Slack/iMessage DM renders OG card (preview URL) | Human-verify checkpoint; D-VERIFY-02 |
| POL-01 | `app/not-found.tsx` styled 404 linking home | Not-Found section |
| POL-02 | `app/icon.tsx` (favicon) + `app/apple-icon.tsx` (touch icon) | Icons section |
| POL-03 | Hero/project images use `next/image` with `preload` + `fetchPriority="high"` | next/image section (critical: `priority` deprecated in Next 16) |
| POL-04 | Total home-route JS < 100 KB gzipped | Bundle budget section |
| POL-05 | Lighthouse mobile Performance ≥ 95 and Accessibility = 100 (preview URL) | Tooling section |
| POL-06 | axe DevTools zero issues on home, project detail, /uses | Tooling section |
| POL-07 | Every interactive element has visible `focus-visible:` outline | Focus ring pattern |
| POL-08 | Site fully keyboard-navigable (Tab, Shift+Tab, Enter, Esc, no mouse traps) | Human + axe verification |
| POL-09 | Renders correctly on real iPhone at 375px | Human-verify checkpoint |
| POL-10 | 60-second cold-read pass ("What does James do?" / "How do I contact him?") | Human-verify checkpoint |
</phase_requirements>

---

## Summary

This phase adds zero new content. It bolts metadata, performance, and accessibility onto a fully-rendered portfolio. The implementation is a set of well-specified Next.js 16 file-system conventions — the API shapes are stable, the gotchas are known, and the biggest risk is a single breaking change: **`priority` is deprecated in Next.js 16** in favor of `preload`. The requirements doc says `priority + fetchPriority="high"` but the correct Next 16 API is `preload={true}` + `fetchPriority="high"` (or just `fetchPriority="high"` alone, which the docs say is equivalent and preferred).

Font loading for `ImageResponse` has a straightforward path: Next.js 16 bundles `Geist-Regular.ttf` at `node_modules/next/dist/compiled/@vercel/og/Geist-Regular.ttf`. Read it with `fs.readFile` at build time — no network fetch, no separate `geist` npm package needed. For heavier weights (name/role lines), the standalone `geist` npm package (`geist@1.7.2`) ships all static-weight TTF files under `node_modules/geist/dist/fonts/geist-sans/`.

The `opengraph-image.tsx` approach is statically generated at build time by default — no `export const dynamic = 'force-static'` needed as long as the function doesn't call any request-time API (cookies, headers, searchParams). Since D-OG-02 locks a single site-wide card with no dynamic params, it statically generates automatically. Metadata merging is shallow in Next.js: per-route `openGraph` completely overwrites the root layout's `openGraph`. The `buildMetadata` factory solves this by constructing the full `openGraph` object on every call rather than relying on inheritance.

**Primary recommendation:** Build `lib/seo.ts` first; it unblocks all SEO-01/02 work. Then ship `opengraph-image.tsx` (SEO-04), icons (POL-02), `sitemap.ts` (SEO-05), `robots.ts` (SEO-06), and `not-found.tsx` (POL-01) as a batch — they are independent files with no shared state. End with the fix to ArchitectureDiagram's `<Image>` (`preload` + `fetchPriority`), focus rings, and the verification wave.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Metadata factory (`lib/seo.ts`) | API/Server (build-time) | — | Metadata is resolved on the server; Server Component only per Next.js docs |
| OG image (`opengraph-image.tsx`) | Build-time static asset | — | D-OG-01 locks static; no runtime CPU |
| Favicons (`icon.tsx`, `apple-icon.tsx`) | Build-time static asset | — | Statically optimized by default; no dynamic params |
| Sitemap (`sitemap.ts`) | Build-time static asset | — | Derives from typed TS array; no request-time APIs |
| Robots (`robots.ts`) | Build-time static asset | — | No dynamic content |
| 404 page (`not-found.tsx`) | Server Component (rendered at request) | — | Standard App Router not-found; Server Component, no client directive |
| `next/image preload` | Browser / Client | CDN cache | Inserts `<link rel="preload">` in `<head>` for LCP images |
| Keyboard navigation, focus rings | Browser / Client | — | CSS + semantic HTML; no JS client code needed |
| Lighthouse / axe audits | Verification tool | — | Run against deployed preview URL |

---

## Standard Stack

### Core (all already installed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `next` | 16.2.6 | App Router metadata, ImageResponse, sitemap/robots/not-found conventions | All phase 3 features are built-in Next.js APIs — no new library needed |
| `next/og` | bundled in next | `ImageResponse` constructor for OG image and icon generation | Import path confirmed: `import { ImageResponse } from 'next/og'` |

No new npm packages are needed for this phase. Every deliverable uses Next.js built-in file conventions and the existing codebase's `content/projects.ts`, `content/site.ts`, and `lib/env.ts`.

### Supporting (external verification tools — not installed in project)

| Tool | Version | Purpose | When to Use |
|------|---------|---------|-------------|
| `lighthouse` | 13.4.0 | CLI mobile performance + accessibility audit | Run via `npx lighthouse <url> --preset=mobile` against preview URL |
| `@axe-core/cli` | 4.12.1 | Automated accessibility scan returning violations count | Run via `npx @axe-core/cli <url> --exit` against preview URL |

These tools are run via `npx` — no project install needed. [VERIFIED: npm registry]

### Package Legitimacy Audit

No new packages are being installed in the project. The two verification tools above (`lighthouse`, `@axe-core/cli`) are well-established packages from authoritative organizations (Google Chrome team, Deque Systems). They are run ephemeral via `npx`, not added to `package.json`.

| Package | Registry | Age | Downloads | Source Repo | slopcheck | Disposition |
|---------|----------|-----|-----------|-------------|-----------|-------------|
| `lighthouse` | npm | 10+ yrs | ~3M/wk | github.com/GoogleChrome/lighthouse | N/A (not installed) | Approved — run via npx only |
| `@axe-core/cli` | npm | 6+ yrs | ~500K/wk | github.com/dequelabs/axe-core | N/A (not installed) | Approved — run via npx only |

*slopcheck was unavailable at research time. Both packages verified via official docs and npm registry — Google and Deque Systems are authoritative organizations.* [VERIFIED: npm registry]

**Packages removed due to slopcheck [SLOP] verdict:** none
**Packages flagged as suspicious [SUS]:** none

---

## Architecture Patterns

### System Architecture Diagram

```
content/projects.ts ──────────────────────────────────┐
content/site.ts ──────────────────────────────────┐   │
lib/env.ts (NEXT_PUBLIC_SITE_URL) ────────────┐   │   │
                                               ▼   ▼   ▼
                                        lib/seo.ts
                                        buildMetadata({ title, description, path })
                                               │
                        ┌──────────────────────┼──────────────────────┐
                        ▼                      ▼                      ▼
              app/layout.tsx           app/uses/page.tsx    app/projects/[slug]/page.tsx
              (metadata export)        (metadata export)    (generateMetadata)
                        │
                        ▼
              app/opengraph-image.tsx ──── Geist-Regular.ttf (from next/dist/compiled/@vercel/og/)
              (ImageResponse, 1200×630)         │
                                                ▼
                                   next build → static PNG asset (build-time)

              app/icon.tsx ─────────────────────────────────────────── (ImageResponse, 32×32 + 48×48)
              app/apple-icon.tsx ────────────────────────────────────── (ImageResponse, 180×180)

content/projects.ts ──► app/sitemap.ts ──► /sitemap.xml (static, build-time)
lib/env.ts ──────────► app/robots.ts ───► /robots.txt (static, build-time)

app/not-found.tsx ─────────────────────────────────────────────────── (Server Component, on-request)

ArchitectureDiagram.tsx (existing) ──► next/image with preload + fetchPriority="high" ──► LCP hint
```

### Recommended Project Structure (additions only)

```
src/
├── lib/
│   └── seo.ts               # NEW — buildMetadata factory
├── app/
│   ├── opengraph-image.tsx  # NEW — static 1200×630 OG card
│   ├── icon.tsx             # NEW — favicon (32×32 + 48×48)
│   ├── apple-icon.tsx       # NEW — apple-touch-icon (180×180)
│   ├── sitemap.ts           # NEW — MetadataRoute.Sitemap
│   ├── robots.ts            # NEW — MetadataRoute.Robots
│   ├── not-found.tsx        # NEW — styled 404
│   ├── layout.tsx           # MODIFY — plug in buildMetadata
│   ├── page.tsx             # MODIFY — plug in buildMetadata (or export static metadata)
│   ├── uses/
│   │   └── page.tsx         # MODIFY — plug in buildMetadata
│   └── projects/
│       └── [slug]/
│           └── page.tsx     # MODIFY — buildMetadata in generateMetadata
└── components/
    └── primitives/
        └── ArchitectureDiagram.tsx  # MODIFY — preload + fetchPriority
```

---

## Pattern 1: `lib/seo.ts` — `buildMetadata` Factory

**What:** A single function that returns a complete `Metadata` object including `openGraph` and `twitter` keys. Called by every route's `metadata` export or `generateMetadata` function.

**Why needed:** Next.js metadata merging is **shallow**: per-route `openGraph` completely overwrites the root layout's `openGraph` — it does not inherit nested fields. So every route that sets any `openGraph` key must also set the OG image URL or it will be absent. Centralizing in a factory guarantees the image URL is never accidentally dropped.

**Key design insight:** Since D-OG-02 locks a single site-wide OG image (not per-route), the factory always points `openGraph.images` at the root `opengraph-image.tsx` URL. The per-route OG image inheritance works automatically when a route does NOT set any `openGraph` key (the root layout's is inherited), but since all routes WILL set `openGraph.title`/`openGraph.description` via this factory, we must always include the images array.

**Canonical implementation:**

```typescript
// src/lib/seo.ts
// [CITED: https://nextjs.org/docs/app/api-reference/functions/generate-metadata]
import type { Metadata } from 'next'
import { site } from '@/content/site'

type BuildMetadataArgs = {
  title: string          // page-specific title (factory appends " — James Nhek")
  description: string    // meta description (< 160 chars)
  path?: string          // route path for canonical URL, e.g. "/" or "/uses"
}

export function buildMetadata({
  title,
  description,
  path = '/',
}: BuildMetadataArgs): Metadata {
  const absoluteUrl = `${site.baseUrl}${path === '/' ? '' : path}`

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl,
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl,
      siteName: site.name,
      type: 'website',
      locale: 'en_US',
      // Relative path resolved against metadataBase (set in layout.tsx)
      // File-based opengraph-image.tsx takes higher priority than this
      // — include for explicit control in case the file-based one is
      // not resolved by all crawlers.
      images: ['/opengraph-image'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}
```

**Per-route usage — static route:**

```typescript
// src/app/uses/page.tsx
import { buildMetadata } from '@/lib/seo'
export const metadata = buildMetadata({
  title: 'Uses — James Nhek',
  description: 'Models, MCP servers, eval stack...',
  path: '/uses',
})
```

**Per-route usage — dynamic route:**

```typescript
// src/app/projects/[slug]/page.tsx
import { buildMetadata } from '@/lib/seo'
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) return {}
  return buildMetadata({
    title: `${project.title} — James Nhek`,
    description: project.subtitle.slice(0, 155),
    path: `/projects/${slug}`,
  })
}
```

**Root layout update:** Replace the current `export const metadata` in `layout.tsx` with a call to `buildMetadata` (home route):

```typescript
// src/app/layout.tsx — home route metadata
import { buildMetadata } from '@/lib/seo'
export const metadata: Metadata = {
  ...buildMetadata({
    title: 'James Nhek — AI Engineer',
    description: 'AI Engineer at Asurion. RAG, evaluations, and agentic workflows.',
    path: '/',
  }),
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  // metadataBase must stay on the root layout — spread buildMetadata last
  // so it doesn't override metadataBase. Or pass metadataBase separately.
}
```

**Important:** `metadataBase` MUST remain on the root layout. The factory does not include it (it's a layout-level concern). Spread the factory result and add `metadataBase` after.

[CITED: https://nextjs.org/docs/app/api-reference/functions/generate-metadata]

---

## Pattern 2: `app/opengraph-image.tsx` — Static 1200×630 OG Card

**Static generation confirmation:** A root `app/opengraph-image.tsx` with no dynamic params and no request-time APIs (cookies, headers, searchParams) is **statically optimized at build time by default**. [CITED: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image] No `export const dynamic = 'force-static'` needed. The function runs once at `next build` and the PNG is cached forever. Zero runtime Active-CPU.

**Import path:** `import { ImageResponse } from 'next/og'` — confirmed current in Next.js 16. `@vercel/og` is the old import from v13.0; it moved to `next/og` in v14.0.0. [CITED: https://nextjs.org/docs/app/api-reference/functions/image-response]

**Required exports:**

```typescript
export const alt = 'James Nhek — AI Engineer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
```

**Font loading — Geist-Regular.ttf:**

Next.js 16 bundles Geist-Regular.ttf inside its own compiled @vercel/og distribution. Path verified by inspecting `node_modules/.pnpm/next@16.2.6.../node_modules/next/dist/compiled/@vercel/og/Geist-Regular.ttf`. [VERIFIED: npm registry + local filesystem]

```typescript
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

// Built-in Geist-Regular (weight 400) — bundled inside Next.js 16
const geistRegular = await readFile(
  join(process.cwd(), 'node_modules/next/dist/compiled/@vercel/og/Geist-Regular.ttf')
)
```

For heavier display weights (name line in the OG card), `geist` npm package v1.7.2 ships all static-weight TTF files. Since `geist` is not yet in `package.json`, it must be added as a dependency to use the bold weight. Alternatively, cap the name line at weight 400 and differentiate via font size instead of weight — simpler, zero new dep, consistent with the site's typography-first aesthetic.

**Recommended approach (zero new deps):** Use Geist-Regular (weight 400) from Next.js's own bundle for ALL text in the OG card. Differentiate hierarchy via font size only: name at ~72px, role at ~36px, specialization at ~28px, domain at ~20px.

**CSS constraint:** ImageResponse uses Satori for rendering. Only **flexbox and a subset of CSS** is supported — no CSS Grid, no CSS variables, no Tailwind classes. All styles must be inline `style={{...}}` with literal hex values (not CSS var references). This is why the design instruction says "resolved hex values are inlined, not CSS vars." [CITED: https://nextjs.org/docs/app/api-reference/functions/image-response]

**Hex values to inline (from globals.css @theme — verified by reading the file):**

| Token | oklch value | Hex equivalent |
|-------|------------|----------------|
| `--color-paper` | oklch(0.985 0 0) | `#fafafa` (off-white) |
| `--color-ink` | oklch(0.18 0 0) | `#0a0a0a` (near-black) |
| `--color-ink-muted` | oklch(0.55 0 0) | `#737373` (mid-grey) |

**Canonical implementation sketch:**

```typescript
// src/app/opengraph-image.tsx
import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const alt = 'James Nhek — AI Engineer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const geistRegular = await readFile(
    join(process.cwd(), 'node_modules/next/dist/compiled/@vercel/og/Geist-Regular.ttf')
  )

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#fafafa',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: 'Geist',
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 400, color: '#0a0a0a', lineHeight: 1.1 }}>
          James Nhek
        </div>
        <div style={{ fontSize: 36, color: '#0a0a0a', marginTop: 20, lineHeight: 1.2 }}>
          AI Engineer @ Asurion
        </div>
        <div style={{ fontSize: 28, color: '#737373', marginTop: 16, lineHeight: 1.4 }}>
          RAG · evaluations · agentic workflows
        </div>
        <div style={{ fontSize: 20, color: '#737373', position: 'absolute', right: 80, bottom: 80 }}>
          pjnhek.com
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'Geist', data: geistRegular, style: 'normal', weight: 400 }],
    }
  )
}
```

[CITED: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image]
[CITED: https://nextjs.org/docs/app/api-reference/functions/image-response]

---

## Pattern 3: `app/icon.tsx` + `app/apple-icon.tsx` — Icons

**Static generation:** Same as OG image — statically optimized at build time unless request-time APIs are called. [CITED: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons]

**Required exports and dimensions:**

```typescript
// app/icon.tsx — favicon (shown in browser tab)
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

// app/apple-icon.tsx — iOS home screen icon
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'
```

**Note:** You cannot generate a `favicon.ico` via code-based convention — only `icon.tsx` works for code-generated favicons. The file-based approach would require placing `favicon.ico` in `app/`. Using `icon.tsx` generates a PNG favicon, which modern browsers handle well.

**Existing `favicon.ico`:** There IS already a `favicon.ico` in `src/app/` (from the Next.js scaffold). The code-rendered `app/icon.tsx` does NOT replace `favicon.ico` automatically — they coexist. To avoid dual icons, either delete `favicon.ico` or let both exist (browsers prefer `icon.tsx`-generated PNG when available at `sizes="32x32"`).

**Font loading:** Same pattern as OG image — use Geist-Regular from `next/dist/compiled/@vercel/og/Geist-Regular.ttf`.

**JN monogram implementation:**

```typescript
// app/icon.tsx
import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default async function Icon() {
  const geistRegular = await readFile(
    join(process.cwd(), 'node_modules/next/dist/compiled/@vercel/og/Geist-Regular.ttf')
  )
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#fafafa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Geist',
          fontSize: 14,
          fontWeight: 400,
          color: '#0a0a0a',
          letterSpacing: '-0.02em',
        }}
      >
        JN
      </div>
    ),
    { ...size, fonts: [{ name: 'Geist', data: geistRegular, style: 'normal', weight: 400 }] }
  )
}
```

`apple-icon.tsx` is identical but with `size = { width: 180, height: 180 }` and a larger font size (~72px). [CITED: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons]

---

## Pattern 4: `app/sitemap.ts`

```typescript
// src/app/sitemap.ts
// [CITED: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap]
import type { MetadataRoute } from 'next'
import { getAllProjects } from '@/lib/content'
import { site } from '@/content/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const projects = getAllProjects()
  const base = site.baseUrl

  return [
    {
      url: base,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${base}/uses`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...projects.map((p) => ({
      url: `${base}/projects/${p.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
```

Result: 6 URLs total (home + /uses + 4 project slugs). Statically generated. [CITED: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap]

---

## Pattern 5: `app/robots.ts`

```typescript
// src/app/robots.ts
// [CITED: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots]
import type { MetadataRoute } from 'next'
import { site } from '@/content/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${site.baseUrl}/sitemap.xml`,
  }
}
```

[CITED: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots]

---

## Pattern 6: `app/not-found.tsx`

`not-found.tsx` in the root `app/` directory handles both explicit `notFound()` calls AND all globally unmatched URLs. It is a Server Component by default and can fetch data. It does NOT need any special exports. It IS wrapped by the root layout (so it inherits Geist fonts, `SiteFooter`, and monochrome CSS). [CITED: https://nextjs.org/docs/app/api-reference/file-conventions/not-found]

```typescript
// src/app/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24 md:px-12">
      <p className="font-mono text-[length:var(--text-caption)] text-[color:var(--color-ink-muted)] tracking-widest uppercase mb-6">
        404
      </p>
      <h1 className="text-[length:var(--text-display)] font-medium tracking-[-0.02em] text-[color:var(--color-ink)] leading-[var(--leading-display)]">
        404
      </h1>
      <p className="mt-6 text-[length:var(--text-body)] text-[color:var(--color-ink-muted)] leading-[var(--leading-body)]">
        This page wandered off. Here&rsquo;s the way back.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block text-[length:var(--text-body)] text-[color:var(--color-ink)] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-ink)]"
      >
        ← Back to home
      </Link>
    </main>
  )
}
```

**Important:** Do not use `export const metadata` on `not-found.tsx` with a custom title unless it uses `title.absolute` — otherwise it would compose with the root layout template. For a 404 page "404 — James Nhek" with `title.absolute` is cleanest.

---

## Pattern 7: `next/image preload` — BREAKING CHANGE IN NEXT.JS 16

**Critical gotcha: `priority` is deprecated in Next.js 16.** [CITED: https://nextjs.org/docs/app/api-reference/components/image]

The Next.js 16 docs state:
> "Starting with Next.js 16, the `priority` property has been deprecated in favor of the `preload` property in order to make the behavior clear."

The docs also state:
> "When `fetchPriority` property is used [you should not use `preload`]" and "In most cases, you should use `loading='eager'` or `fetchPriority='high'` instead of `preload`."

**Correct Next.js 16 pattern for above-the-fold images:**

```typescript
// Recommended — fetchPriority alone
<Image src="..." alt="..." fetchPriority="high" />

// Or preload alone (generates <link rel="preload"> in <head>)
<Image src="..." alt="..." preload={true} />

// Do NOT combine preload + fetchPriority (docs warn against it)
// Do NOT use priority (deprecated in Next 16)
```

**Current codebase state:** The requirements doc (POL-03) says `priority + fetchPriority="high"` — this matches the pre-Next-16 pattern. Phase 3 must use `fetchPriority="high"` (the semantically correct signal for the browser's resource fetcher) without `priority` (deprecated) or `preload` (adds a `<link rel="preload">` tag, but docs say not to combine with fetchPriority).

**Where to apply:** `ArchitectureDiagram.tsx` currently uses `<Image src={src} alt={alt} fill className="object-contain" />` for raster images. The raster branch is the one that needs the LCP hint. All architecture diagram images are SVGs in this codebase (the `isSvg` branch uses `<img>` not `<Image>`), so in practice the raster branch of `ArchitectureDiagram.tsx` is currently unused. However, the fix belongs there for correctness and for any future raster images.

[CITED: https://nextjs.org/docs/app/api-reference/components/image]

---

## Pattern 8: Focus Rings — `focus-visible:` with Monochrome Palette

Already established in Phase 1 and used in `ExternalLink.tsx` and `BackLink.tsx`. The pattern:

```css
focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-ink)]
```

Phase 3 must verify this pattern exists on ALL interactive elements:
- `<Link>` elements (project cards, BackLink, SiteFooter links, not-found home link)
- `CopyEmail` button (the one client island)
- `ExternalLink` components (already has it per Phase 1)

`prefers-reduced-motion` for smooth scroll is already handled in `globals.css`. For icons/buttons with no text label, ensure `aria-label` is present. [ASSUMED — no new documentation needed, but verification required]

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| OG image generation | Custom canvas/sharp renderer | `ImageResponse` from `next/og` | Satori handles text layout, line wrapping, font loading; canvas API is 300+ lines for typography fidelity |
| Sitemap XML construction | Template string or XML builder | `MetadataRoute.Sitemap` from `next` | Type-safe, auto-generated, cached at build time, no malformed XML risk |
| Robots.txt string construction | Template string | `MetadataRoute.Robots` from `next` | Same: type-safe, statically generated |
| Accessibility auditing | Manual DOM inspection | `@axe-core/cli` + Lighthouse | axe catches 20-50% of a11y violations automatically; Lighthouse reports score and diagnostics |
| Bundle size measurement | Manual file size inspection | `next build` output + Network tab | `next build` reports "First Load JS" per route in the terminal; Network tab gives gzipped bytes for confirmation |
| Focus ring CSS | Custom JS focus manager | CSS `focus-visible:` + Tailwind | Native CSS pseudo-class, browser handles focus ring display, no JS needed |

---

## Common Pitfalls

### Pitfall 1: Using `priority` instead of `preload`/`fetchPriority` on next/image

**What goes wrong:** `priority` is silently deprecated in Next.js 16. It still works (TypeScript doesn't error yet) but the docs flag it and future versions will remove it. More importantly, the project's CLAUDE.md itself noted this: "priority renamed-to-preload-in-v16 — check current docs."

**Why it happens:** Training data and older docs still show `priority`. Requirements doc still says `priority + fetchPriority="high"`.

**How to avoid:** Use `fetchPriority="high"` for the LCP signal. Do not combine with `preload={true}` (docs say not to). Do not use the old `priority` prop.

**Warning signs:** TypeScript may not warn; check for `priority` prop in any `<Image>` usage during code review.

[CITED: https://nextjs.org/docs/app/api-reference/components/image]

### Pitfall 2: ImageResponse Using CSS Variables

**What goes wrong:** `<div style={{ color: 'var(--color-ink)' }}>` renders as literal "var(--color-ink)" string or transparent — CSS variables are not evaluated in Satori's subset renderer.

**Why it happens:** Satori is a pure JS renderer that implements a subset of CSS — it does not have access to the browser's CSS cascade or custom property resolution.

**How to avoid:** Always inline resolved hex values in ImageResponse JSX: `color: '#0a0a0a'` not `color: 'var(--color-ink)'`. Reference the hex values table above.

**Warning signs:** OG image renders with no text color (defaults to transparent) or the literal string "var(--color-ink)" appears in a screenshot.

[CITED: https://nextjs.org/docs/app/api-reference/functions/image-response]

### Pitfall 3: Metadata Shallow Merge Drops OG Image

**What goes wrong:** A per-route `generateMetadata` sets `openGraph: { title: '...', description: '...' }` but omits `images`. The root layout's `openGraph.images` is NOT inherited — the entire `openGraph` object is replaced. The OG image disappears from that route.

**Why it happens:** Next.js metadata merging is shallow — nested objects like `openGraph` are replaced, not merged. [CITED: https://nextjs.org/docs/app/api-reference/functions/generate-metadata §Merging]

**How to avoid:** The `buildMetadata` factory always includes `openGraph.images: ['/opengraph-image']`. Every route that calls `buildMetadata` gets the OG image. Never set `openGraph` manually except through the factory.

**Warning signs:** LinkedIn Post Inspector shows title/description but no image for a specific route.

### Pitfall 4: `site.baseUrl` May Be Preview URL, Not Production URL

**What goes wrong:** `app/sitemap.ts` uses `site.baseUrl` (which reads `env.NEXT_PUBLIC_SITE_URL`). In Vercel preview deploys, `NEXT_PUBLIC_SITE_URL` is NOT set in the environment — the `lib/env.ts` `.default("https://pjnhek.com")` kicks in. So the sitemap always emits `https://pjnhek.com` URLs even from a preview deploy. This is actually correct behavior for SEO (we want the canonical URLs to be the production domain), but it means the sitemap cannot be used to test crawlability from the preview URL.

**Why it happens:** `NEXT_PUBLIC_SITE_URL` is only set in Vercel production (Phase 4, DEP-03). Preview deploys hit the `.default()` path.

**How to avoid:** This is acceptable behavior. Document it as a known limitation. In Phase 4, when `NEXT_PUBLIC_SITE_URL` is set to `https://pjnhek.com` in Vercel production, the sitemap will be correct.

**Warning signs:** N/A for Phase 3 — this is expected. Flag for Phase 4 verification.

### Pitfall 5: `favicon.ico` and `icon.tsx` Coexist by Default

**What goes wrong:** The scaffold created `src/app/favicon.ico`. Adding `app/icon.tsx` creates a second icon — both exist. Most browsers prefer the highest-specificity favicon, so the PNG from `icon.tsx` will display in modern browsers. But having both creates redundancy.

**Why it happens:** `create-next-app` always generates `favicon.ico`. The code-based `icon.tsx` is additive.

**How to avoid:** Delete `src/app/favicon.ico` when adding `src/app/icon.tsx`. Verify in browser tab after deletion.

**Warning signs:** Network tab shows two icon requests; `<head>` contains both `<link rel="shortcut icon">` and `<link rel="icon" type="image/png">`.

### Pitfall 6: OG Image on Preview URL vs Production URL

**What goes wrong:** LinkedIn Post Inspector, opengraph.xyz, and iMessage URL scrapers all need to fetch the OG image from a publicly accessible URL. Vercel preview URLs are public (Deployment Protection is OFF per STATE.md), so this should work. But if the LinkedIn scraper caches a previous crawl, the card may show stale data.

**Why it happens:** Social crawlers cache aggressively. LinkedIn Post Inspector has a "Refresh" button for this.

**How to avoid:** Use LinkedIn Post Inspector's Refresh button. Use opengraph.xyz as a second check. Always test with a fresh URL that has never been shared before.

**Warning signs:** LinkedIn shows old title/image; opengraph.xyz shows correct data. Solution: force a re-scrape via LinkedIn's Inspector.

### Pitfall 7: `not-found.tsx` — Using a Client Component Hook

**What goes wrong:** Some developers try to use `usePathname()` inside `not-found.tsx` to display the broken URL. This requires `"use client"`, which violates SEC-07 (sole-"use client" invariant — CopyEmail only).

**Why it happens:** Displaying the attempted URL seems intuitive. Next.js docs explicitly flag this: "If you need to use Client Component hooks like `usePathname` to display content based on the path, you must fetch data on the client-side instead."

**How to avoid:** D-404-01 defines a simple fixed-copy 404 with no dynamic URL display. Do not use `usePathname`. Keep `not-found.tsx` a pure Server Component.

### Pitfall 8: `buildMetadata` Returns `metadataBase`

**What goes wrong:** If `buildMetadata` returns a `metadataBase` field, it overwrites the one in `layout.tsx`. Since `layout.tsx` spreads the factory result, and `metadataBase` must be a `URL` object (from env), having it inside the factory creates a module-import dependency.

**Why it happens:** Temptation to centralize all metadata in one factory.

**How to avoid:** Keep `metadataBase` on the root layout only. The factory does not include it. Spread order in `layout.tsx`: `{ metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL), ...buildMetadata({...}) }` — metadataBase first so factory spread cannot override it. (Or set metadataBase after: `{ ...buildMetadata({...}), metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL) }`.)

---

## Code Examples

### Measuring Bundle Budget (POL-04)

**Method 1 — `next build` terminal output (quickest):**

```bash
pnpm build
```

The build output prints a table like:
```
Route (app)         Size  First Load JS
┌ ○ /               2.4 kB    101 kB
├ ○ /uses           1.1 kB     98 kB
└ ● /projects/[slug] 3.1 kB   102 kB
```

"First Load JS" is the key number — it is NOT gzipped. Actual gzipped size is roughly 30-40% smaller. A 101 kB "First Load JS" typically gzips to ~70-75 kB. [ASSUMED — based on standard gzip compression ratios for JS; planner should specify method for POL-04 verification]

**Method 2 — Network tab (precise gzipped bytes):**

1. `pnpm build && pnpm start`
2. Chrome DevTools → Network → Disable cache → Reload
3. Filter by JS → sum "Size" column (which shows transferred = gzipped bytes)
4. This gives the exact gzipped bytes meeting POL-04's "< 100 KB gzipped (Network tab verified)" requirement

Given the site uses RSC-by-default and has only ONE client island (CopyEmail), the realistic bundle is well under 100 KB. Lucide-react tree-shakes per import; the risk area is if any library is accidentally pulled client-side.

### Running Lighthouse CLI (POL-05)

```bash
npx lighthouse <PREVIEW_URL> \
  --preset=mobile \
  --only-categories=performance,accessibility \
  --output=html \
  --output-path=./lighthouse-report.html \
  --chrome-flags="--headless"
```

Produces an HTML report. Key metrics to check: Performance score ≥ 95, Accessibility = 100. [ASSUMED — CLI flags verified against Lighthouse docs and npm page; exact flag syntax may vary by version]

### Running axe CLI (POL-06)

```bash
npx @axe-core/cli <PREVIEW_URL> --exit
# Repeat for project detail URL and /uses URL
```

`--exit` causes non-zero exit code when violations are found, suitable for automation. Zero output under "Violations" = POL-06 passed. [VERIFIED: npm registry + @axe-core/cli npm page]

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `import { ImageResponse } from '@vercel/og'` | `import { ImageResponse } from 'next/og'` | Next.js v14.0.0 | Old import still works but is legacy; use `next/og` |
| `<Image priority>` for LCP images | `<Image fetchPriority="high">` or `<Image preload>` | Next.js v16.0.0 | `priority` deprecated; must update ArchitectureDiagram.tsx |
| `export const metadata` with full OG in layout | `buildMetadata` factory in `lib/seo.ts`, called per-route | Best practice; no version change | Prevents OG image loss on routes that set any openGraph key |
| `title.template` in root layout for suffix | Per-route `buildMetadata` with `— James Nhek` in title | N/A | Both work; factory approach is more explicit and predictable |
| Inline `tailwind.config.js` typography | CSS-first `@theme` tokens in `globals.css` | Tailwind v4 | `text-[length:var(--text-body)]` idiom; confirmed working in codebase |

**Deprecated/outdated:**
- `priority` prop on `<Image>`: deprecated in Next.js 16; replace with `fetchPriority="high"` or `preload`
- `@vercel/og`: still works, but `next/og` is the canonical import as of Next.js 14
- `viewport` and `themeColor` in `metadata` object: deprecated since Next.js 14 (use `generateViewport` instead — not needed for this phase)

---

## Verification Architecture: Automatable vs Human-Verify

The planner must split tasks into automatable (Claude runs) vs human-only (James runs, phase closes when confirmed).

### Automatable (Claude runs during task execution)

| Check | Command | Passes When |
|-------|---------|-------------|
| `<head>` OG tags present | `curl -s <PREVIEW_URL> \| grep 'og:image\|og:title\|twitter:card'` | All three meta tags appear |
| sitemap.xml structure | `curl -s <PREVIEW_URL>/sitemap.xml` | Returns valid XML with 6 `<url>` entries |
| robots.txt | `curl -s <PREVIEW_URL>/robots.txt` | Returns `Allow: /` + `Sitemap:` line |
| 404 page | `curl -o /dev/null -s -w "%{http_code}" <PREVIEW_URL>/this-does-not-exist` | Returns 404 HTTP status |
| icon exists | `curl -s -o /dev/null -w "%{http_code}" <PREVIEW_URL>/icon` | Returns 200 |
| `pnpm build` succeeds with 0 TS errors | `pnpm build && pnpm typecheck` | Exit code 0 |
| First Load JS per build output | `pnpm build 2>&1 \| grep "First Load JS"` | Home route < ~140 kB (then verify gzip in Network tab) |
| axe zero violations | `npx @axe-core/cli <PREVIEW_URL> --exit && npx @axe-core/cli <PREVIEW_URL>/uses --exit && npx @axe-core/cli <PREVIEW_URL>/projects/voice-intent-eval --exit` | All exit 0 |
| Lighthouse scores | `npx lighthouse <PREVIEW_URL> --preset=mobile --output=json ...` | Performance ≥ 95, Accessibility = 100 |
| Keyboard nav walkthrough | Claude manually tabs through the rendered page via dev tools or cursor | No mouse traps; all interactive elements reachable |

### Human-Verify Checkpoints (James runs, phase closes when confirmed)

| Requirement | Check | What James Does |
|-------------|-------|-----------------|
| SEO-07 | LinkedIn Post Inspector | Paste PREVIEW_URL at linkedin.com/post-inspector — verify image renders, title shows |
| SEO-08 | opengraph.xyz | Paste PREVIEW_URL at opengraph.xyz — verify card matches OG design |
| SEO-09 | Real Slack/iMessage DM | Send a real DM to yourself with the PREVIEW_URL — confirm card renders inline |
| POL-09 | Real iPhone at 375px | Visit PREVIEW_URL on a real iPhone (not DevTools) — verify no horizontal scroll, text readable, contact links work |
| POL-10 | 60-second cold-read | Read the home page for 60 seconds — can you answer "What does James do?" and "How would I contact him?" |

These five checkpoints are `autonomous: false` human-verify tasks in the plan. Phase closes when James confirms all five in one message.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `next/dist/compiled/@vercel/og/Geist-Regular.ttf` path is stable across minor Next.js versions | OG image Pattern | OG build fails; mitigation: use `geist` npm package as fallback |
| A2 | gzip compression ratio for JS is ~30-40% (so "First Load JS" of ~140 kB → ~95 kB gzipped) | Bundle budget | POL-04 measurement would be wrong; always verify with Network tab, not just `next build` output |
| A3 | `fetchPriority="high"` alone (without `preload`) is sufficient for the LCP hint in Next.js 16 | POL-03 | LCP doesn't get the preload hint; worst case: set both `preload={true}` and `fetchPriority="high"` (docs caution against it but it may still work) |
| A4 | axe CLI `--exit` flag causes non-zero exit code on violations | Verification | Verification script doesn't catch violations; run with `--exit` and verify exit code behavior |
| A5 | LinkedIn Post Inspector accepts Vercel preview URLs (no auth barrier since Deployment Protection is OFF) | SEO-07 | Requires Production URL; but STATE.md confirms Protection is disabled |

---

## Open Questions

1. **OG image font weight for the name line**
   - What we know: Geist-Regular (weight 400) is bundled in Next.js. Bolder weights require the `geist` npm package (adds ~10 KB to deps).
   - What's unclear: Whether D-OG-04 ("display weight for the name") requires an actual bold font or whether larger font size at regular weight achieves the same visual hierarchy.
   - Recommendation: Implement with Geist-Regular only (zero new dep, size hierarchy), show James the OG preview. If he wants a bolder name, add `geist` as a dev dependency and load `Geist-SemiBold.ttf` or `Geist-Bold.ttf` from `node_modules/geist/dist/fonts/geist-sans/`.

2. **`site.baseUrl` in `lib/seo.ts` is a server-only import**
   - What we know: `site.ts` imports from `lib/env.ts` which is SERVER-ONLY (has `throw new Error` on validation failure). The `buildMetadata` factory imports `site` — it must only be called from Server Components (metadata exports are always Server-only, so this is fine).
   - What's unclear: Whether the planner should add an explicit comment warning against importing `lib/seo.ts` from client islands.
   - Recommendation: Add a one-line comment to `lib/seo.ts`: `// SERVER-ONLY — metadata exports are Server Component only in Next.js App Router`.

3. **`delete favicon.ico` decision**
   - What we know: scaffold created `src/app/favicon.ico`. Adding `icon.tsx` creates a second icon file.
   - What's unclear: Whether to delete `favicon.ico` or keep both.
   - Recommendation: Delete `favicon.ico` when adding `icon.tsx`. The PNG generated by `icon.tsx` is better quality than a pre-baked ico.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js ≥ 22.18 | All build-time file operations (`readFile`, `join`) | ✓ | 24.x (Vercel auto) | — |
| pnpm | Package management | ✓ | 10.30.2 | — |
| Vercel preview URL | All verification checks | ✓ | Live (see STATE.md) | Use `pnpm start` locally |
| Chrome / Chromium | Lighthouse CLI + axe CLI (require a browser) | ✓ (system) | System Chrome | Use `--chrome-flags="--headless"` |
| `geist` npm package | Bold font weights in OG image (optional) | ✗ | Not installed | Geist-Regular from `next/dist/compiled/@vercel/og/` — see Open Question 1 |

**Missing dependencies with no fallback:** None.
**Missing dependencies with fallback:** `geist` npm package (bold weights) — use Geist-Regular bundled in Next.js.

---

## Project Constraints (from CLAUDE.md)

These CLAUDE.md directives are load-bearing for Phase 3:

1. **`"use client"` appears only in `CopyEmail.tsx`** — All Phase 3 additions (metadata factory, OG image, icons, sitemap, robots, not-found) must be Server-side / build-time. Violating this breaks SEC-07.
2. **No `motion` / `framer-motion` library** — 404 page and metadata changes are static; no animation library needed or allowed.
3. **Tailwind v4 arbitrary-value idiom** — All new TSX components (not-found.tsx) must use `text-[length:var(--text-body)]` / `text-[color:var(--color-ink)]` patterns, not inline hex values in className.
4. **ImageResponse JSX uses inline style, not Tailwind** — Satori does not understand Tailwind classes; all OG/icon JSX uses `style={{}}` with literal hex values.
5. **`next lint` was removed in Next.js 16** — Use `eslint .` (the `lint` script already does this per `package.json`).
6. **No `output: 'export'`** — Already correct; `next.config.ts` doesn't set it. Do not add it.
7. **Asurion content: identity-only on OG card** — D-OG-03 defines the card content as name/role/domain (not a quantitative claim). No Asurion numbers on the OG card.
8. **Vercel Hobby: static assets only** — OG image and icons MUST be static/build-time (D-OG-01). Confirmed: default behavior of `opengraph-image.tsx` without request-time APIs is static.

---

## Sources

### Primary (HIGH confidence)
- [Next.js 16.2.9 opengraph-image docs](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image) — alt/size/contentType exports, static generation default, font loading pattern
- [Next.js 16.2.9 ImageResponse docs](https://nextjs.org/docs/app/api-reference/functions/image-response) — import path `next/og`, fonts array API, Satori CSS subset
- [Next.js 16.2.9 app-icons docs](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons) — icon.tsx + apple-icon.tsx required exports, dimensions, static generation
- [Next.js 16.2.9 sitemap docs](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) — MetadataRoute.Sitemap type, static generation default
- [Next.js 16.2.9 robots docs](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots) — MetadataRoute.Robots type
- [Next.js 16.2.9 generateMetadata docs](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) — Metadata type, openGraph/twitter shape, metadataBase behavior, shallow merge behavior
- [Next.js 16.2.9 Image component docs](https://nextjs.org/docs/app/api-reference/components/image) — `priority` deprecated in v16, `preload` and `fetchPriority` as replacements
- [Next.js 16.2.9 not-found docs](https://nextjs.org/docs/app/api-reference/file-conventions/not-found) — Server Component, root-level catches all unmatched URLs, no special exports needed
- Local filesystem inspection: `node_modules/.pnpm/next@16.2.6.../node_modules/next/dist/compiled/@vercel/og/Geist-Regular.ttf` — confirmed existence of bundled Geist font
- Local filesystem inspection: `src/app/globals.css` — confirmed exact oklch/hex values for `--color-ink`, `--color-paper`, `--color-ink-muted`
- Local filesystem inspection: `package.json` — confirmed Next.js 16.2.6, React 19.2.4, no `geist` package in dependencies
- npm registry: `lighthouse@13.4.0`, `@axe-core/cli@4.12.1` — confirmed package existence and versions

### Secondary (MEDIUM confidence)
- [npm: @axe-core/cli](https://www.npmjs.com/package/@axe-core/cli) — `--exit` flag for non-zero exit on violations
- [npm: lighthouse](https://www.npmjs.com/package/lighthouse) — `--preset=mobile`, `--only-categories`, `--output` flags

### Tertiary (LOW confidence)
- Geist package TTF inventory: inspected via `npm pack geist --dry-run` locally — `geist@1.7.2` contains `dist/fonts/geist-sans/Geist-Regular.ttf`, `Geist-SemiBold.ttf`, `Geist-Bold.ttf`, etc.

---

## Metadata

**Confidence breakdown:**
- Standard Stack: HIGH — all deliverables use Next.js built-in APIs, confirmed against official docs v16.2.9
- Architecture: HIGH — all patterns derived from official Next.js docs + actual codebase inspection
- Pitfalls: HIGH — `priority` deprecation confirmed from official docs; CSS var gotcha confirmed from Satori docs; metadata merge behavior confirmed from generateMetadata docs
- Verification tooling: MEDIUM — Lighthouse CLI and axe-core CLI are established tools, but exact flag behavior should be verified on first run

**Research date:** 2026-06-23
**Valid until:** 2026-09-23 (Next.js 16 API is stable; re-verify if upgrading to Next.js 17)
