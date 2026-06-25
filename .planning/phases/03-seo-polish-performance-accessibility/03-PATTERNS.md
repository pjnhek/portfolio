# Phase 3: SEO, Polish, Performance & Accessibility — Pattern Map

**Mapped:** 2026-06-23
**Files analyzed:** 10 (7 new, 3 modified + 1 modified component)
**Analogs found:** 10 / 10

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `src/lib/seo.ts` | utility/factory | transform | `src/lib/content.ts` | role-match (same lib/ pattern) |
| `src/app/opengraph-image.tsx` | build-time asset | build-time static | `src/components/primitives/ArchitectureDiagram.tsx` | partial (both render images; OG uses ImageResponse not next/image) |
| `src/app/icon.tsx` | build-time asset | build-time static | `src/app/opengraph-image.tsx` (sibling) | exact (same ImageResponse pattern, smaller canvas) |
| `src/app/apple-icon.tsx` | build-time asset | build-time static | `src/app/icon.tsx` (sibling) | exact (identical pattern, different size export) |
| `src/app/not-found.tsx` | page (Server Component) | request-response | `src/app/uses/page.tsx` | role-match (same Server Component page pattern, same layout tokens) |
| `src/app/sitemap.ts` | build-time asset | transform | `src/lib/content.ts` | role-match (same import pattern, consumes getAllProjects) |
| `src/app/robots.ts` | build-time asset | transform | `src/app/sitemap.ts` (sibling) | exact (same MetadataRoute pattern) |
| `src/app/layout.tsx` (MODIFY) | layout | request-response | itself — current shape is the analog | self (refactor only — spread buildMetadata) |
| `src/app/uses/page.tsx` (MODIFY) | page (Server Component) | request-response | itself — current shape is the analog | self (refactor only — swap metadata export) |
| `src/app/projects/[slug]/page.tsx` (MODIFY) | page (Server Component) | request-response | itself — current shape is the analog | self (refactor only — swap generateMetadata body) |
| `src/components/primitives/ArchitectureDiagram.tsx` (MODIFY) | component | request-response | itself — current shape is the analog | self (one-line prop change: add `fetchPriority="high"`) |

---

## Pattern Assignments

### `src/lib/seo.ts` (utility/factory, transform)

**Analog:** `src/lib/content.ts` — same lib/ directory pattern: SERVER-ONLY comment block, named exports, imports from `@/content/*`, no default export.

**Imports pattern** (`src/lib/content.ts` lines 1–22):
```typescript
/**
 * SERVER-ONLY content accessors (CONT-06). DO NOT import from Client Components.
 * ...
 */
import { projects } from "@/content/projects";
import type { Project } from "@/types/content";
```

**Core factory pattern** (new — no exact analog; use RESEARCH.md Pattern 1 verbatim):
```typescript
// src/lib/seo.ts
// SERVER-ONLY — metadata exports are Server Component only in Next.js App Router.
// DO NOT import from Client Components (same constraint as lib/env.ts, lib/content.ts).
import type { Metadata } from "next";
import { site } from "@/content/site";

type BuildMetadataArgs = {
  title: string;       // page-specific title
  description: string; // meta description (< 160 chars)
  path?: string;       // route path for canonical URL, e.g. "/" or "/uses"
};

export function buildMetadata({
  title,
  description,
  path = "/",
}: BuildMetadataArgs): Metadata {
  const absoluteUrl = `${site.baseUrl}${path === "/" ? "" : path}`;

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
      type: "website",
      locale: "en_US",
      images: ["/opengraph-image"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
```

**Key constraint:** `metadataBase` is NOT returned by this factory — it lives only in `layout.tsx`. The factory is spread after `metadataBase` in layout.tsx so metadataBase cannot be overwritten. Factory imports `site` from `@/content/site` which is already SERVER-ONLY (imports `env`). No new imports needed.

---

### `src/app/opengraph-image.tsx` (build-time asset)

**Analog:** No exact analog. Closest structural analog for the JSX/export shape is `src/components/primitives/ArchitectureDiagram.tsx` (renders image content). For the `ImageResponse` pattern, RESEARCH.md Pattern 2 is the authoritative reference.

**Required exports pattern** (RESEARCH.md Pattern 2):
```typescript
export const alt = "James Nhek — AI Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
```

**Font loading pattern** (RESEARCH.md Pattern 2 — use bundled Geist, zero new deps):
```typescript
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Bundled inside Next.js 16 — no separate geist package needed
const geistRegular = await readFile(
  join(
    process.cwd(),
    "node_modules/next/dist/compiled/@vercel/og/Geist-Regular.ttf"
  )
);
```

**Inline hex values to use** (from `src/app/globals.css` lines 23–28 — MUST be hex, not CSS vars, because Satori does not resolve CSS custom properties):

| Token | CSS declaration | Inline hex |
|-------|----------------|-----------|
| `--color-paper` | `oklch(0.985 0 0)` | `#fafafa` |
| `--color-ink` | `oklch(0.18 0 0)` | `#0a0a0a` |
| `--color-ink-muted` | `oklch(0.55 0 0)` | `#737373` |

**Core ImageResponse pattern** (layout matches D-OG-03/04 — left-aligned type stack, off-white bg):
```typescript
import { ImageResponse } from "next/og";

export default async function Image() {
  // ... font loading above ...
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#fafafa",      // --color-paper hex
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "Geist",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 400, color: "#0a0a0a", lineHeight: 1.1 }}>
          James Nhek
        </div>
        <div style={{ fontSize: 36, color: "#0a0a0a", marginTop: 20, lineHeight: 1.2 }}>
          AI Engineer @ Asurion
        </div>
        <div style={{ fontSize: 28, color: "#737373", marginTop: 16, lineHeight: 1.4 }}>
          RAG · evaluations · agentic workflows
        </div>
        <div
          style={{
            fontSize: 20,
            color: "#737373",
            position: "absolute",
            right: 80,
            bottom: 80,
          }}
        >
          pjnhek.com
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Geist", data: geistRegular, style: "normal", weight: 400 }],
    }
  );
}
```

**Critical:** All styles are inline `style={{}}` — no Tailwind classes, no CSS vars. This is opposite to every other TSX file in the project (which uses `className` and CSS vars). The JSX inside `ImageResponse` is rendered by Satori, not a browser.

---

### `src/app/icon.tsx` (build-time asset, 32×32)

**Analog:** `src/app/opengraph-image.tsx` (sibling — identical ImageResponse + font-loading shape, different `size` export and content).

**Required exports:**
```typescript
export const size = { width: 32, height: 32 };
export const contentType = "image/png";
```

**Core pattern** (same font loading as opengraph-image, smaller canvas):
```typescript
export default async function Icon() {
  // same geistRegular readFile as opengraph-image.tsx
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#fafafa",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Geist",
          fontSize: 14,
          fontWeight: 400,
          color: "#0a0a0a",
          letterSpacing: "-0.02em",
        }}
      >
        JN
      </div>
    ),
    { ...size, fonts: [{ name: "Geist", data: geistRegular, style: "normal", weight: 400 }] }
  );
}
```

**Action:** Also delete `src/app/favicon.ico` (scaffold artifact — browser prefers `icon.tsx`-generated PNG when available; keeping both creates redundancy per RESEARCH.md Pitfall 5).

---

### `src/app/apple-icon.tsx` (build-time asset, 180×180)

**Analog:** `src/app/icon.tsx` (exact sibling — only `size` and font-size differ).

**Required exports:**
```typescript
export const size = { width: 180, height: 180 };
export const contentType = "image/png";
```

**Core pattern:** Identical to `icon.tsx` except `fontSize: 72` (vs 14) to remain legible at 180px. Copy `icon.tsx` verbatim and change only `size` export and `fontSize`.

---

### `src/app/not-found.tsx` (Server Component page, request-response)

**Analog:** `src/app/uses/page.tsx` — same Server Component page pattern, same Tailwind v4 arbitrary-value idiom (`text-[length:var(--text-*)]`, `text-[color:var(--color-*)]`), same max-width container (`max-w-2xl px-6 md:px-12`). Same `<Link>` from `next/link`.

**Layout/container pattern** (`src/app/uses/page.tsx` lines 40–53):
```tsx
// uses/page.tsx container pattern — mirror this exact spacing + max-width
<main className="mx-auto max-w-2xl px-6 pt-8 pb-4 md:px-12 md:pt-12">
  {/* content */}
</main>
```

**Tailwind v4 token idiom** (`src/app/uses/page.tsx` lines 47–51, `src/app/projects/[slug]/page.tsx` lines 73–77):
```tsx
// Text size token — same idiom used across all pages
className="text-[length:var(--text-heading)] font-medium tracking-[-0.01em] text-[color:var(--color-ink)]"
className="text-[length:var(--text-body)] text-[color:var(--color-ink-muted)]"
```

**Focus-ring pattern** (`src/components/nav/BackLink.tsx` line 30 and `src/components/primitives/ExternalLink.tsx` line 57 — exact string to copy for the "Back to home" link):
```tsx
focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-ink)]
```

**BackLink import pattern** (`src/app/uses/page.tsx` line 21 and `src/app/projects/[slug]/page.tsx` line 35):
```tsx
import Link from "next/link";
// not-found.tsx uses plain <Link>, not <BackLink>, because BackLink renders
// "← {children}" and the 404 needs custom arrow placement / text
```

**Core pattern** (assembly from analogs above + D-404-01 copy):
```tsx
// src/app/not-found.tsx
import Link from "next/link";

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
  );
}
```

**No `"use client"`** — Server Component only (SEC-07 invariant: CopyEmail is the sole client island). No `usePathname` (RESEARCH.md Pitfall 7).

---

### `src/app/sitemap.ts` (build-time asset, transform)

**Analog:** `src/lib/content.ts` — same import pattern from `@/content/projects` via `@/lib/content`, same named-function export shape, same SERVER-ONLY context.

**getAllProjects import pattern** (`src/lib/content.ts` lines 21–26, consumed by `src/app/projects/[slug]/page.tsx` line 40):
```typescript
import { getAllProjects } from "@/lib/content";
// getAllProjects() returns readonly Project[] — each has .slug string
```

**site.baseUrl import pattern** (`src/content/site.ts` lines 21–31 — `site.baseUrl` is `env.NEXT_PUBLIC_SITE_URL`, defaults to `"https://pjnhek.com"`):
```typescript
import { site } from "@/content/site";
// site.baseUrl === env.NEXT_PUBLIC_SITE_URL (default "https://pjnhek.com")
```

**Core pattern** (RESEARCH.md Pattern 4 — 6 URLs total: home + /uses + 4 project slugs):
```typescript
// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { getAllProjects } from "@/lib/content";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const projects = getAllProjects();
  const base = site.baseUrl;

  return [
    { url: base, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/uses`, changeFrequency: "monthly", priority: 0.8 },
    ...projects.map((p) => ({
      url: `${base}/projects/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
```

**Note:** Sitemap always emits `https://pjnhek.com` URLs even from preview (env `.default()` kicks in when `NEXT_PUBLIC_SITE_URL` is unset). This is expected and correct per RESEARCH.md Pitfall 4.

---

### `src/app/robots.ts` (build-time asset, transform)

**Analog:** `src/app/sitemap.ts` (sibling — same `MetadataRoute` import, same `site` import, simpler body).

**Core pattern** (RESEARCH.md Pattern 5):
```typescript
// src/app/robots.ts
import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${site.baseUrl}/sitemap.xml`,
  };
}
```

---

### `src/app/layout.tsx` (MODIFY — refactor existing metadata export)

**Current shape** (lines 27–32 — what is being replaced):
```typescript
export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: "James Nhek — AI Engineer",
  description:
    "AI Engineer at Asurion. RAG, evaluations, and agentic workflows. Based in San Francisco. Open to roles.",
};
```

**Target shape after refactor** (spread buildMetadata; `metadataBase` stays on layout — must not be inside factory per RESEARCH.md Pitfall 8):
```typescript
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  ...buildMetadata({
    title: "James Nhek — AI Engineer",
    description:
      "AI Engineer at Asurion. RAG, evaluations, and agentic workflows. Based in San Francisco. Open to roles.",
    path: "/",
  }),
};
```

**Spread order matters:** `metadataBase` is set first, then the factory spread. This guarantees the factory cannot override `metadataBase` even if a future refactor accidentally adds it to the factory return value. Alternatively, place `metadataBase` after the spread (`{ ...buildMetadata(…), metadataBase: … }`) — either works, first-position is more explicit about intent.

**No other changes** to `layout.tsx` — font loading, RootLayout function, `<html>/<body>` structure, and `SiteFooter` remain unchanged.

---

### `src/app/uses/page.tsx` (MODIFY — swap metadata export)

**Current shape** (lines 27–31 — what is being replaced):
```typescript
export const metadata: Metadata = {
  title: "Uses — James Nhek",
  description:
    "Models, MCP servers, eval stack, agent framework, and dev workflow I reach for in 2026.",
};
```

**Target shape after refactor:**
```typescript
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Uses — James Nhek",
  description:
    "Models, MCP servers, eval stack, agent framework, and dev workflow I reach for in 2026.",
  path: "/uses",
});
```

**Note:** The `import type { Metadata } from "next"` on line 20 stays — `buildMetadata` returns `Metadata` so the type annotation on `export const metadata: Metadata` remains accurate. The Phase-3 deferral comment block (lines 13–16) is removed (phase 3 is now executing).

**No other changes** to `uses/page.tsx` — page body, imports, `byCategory` helper, `UsesPage` function all remain unchanged.

---

### `src/app/projects/[slug]/page.tsx` (MODIFY — swap generateMetadata body)

**Current shape** (lines 43–55 — what is being replaced):
```typescript
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.title} — James Nhek`,
    description: project.subtitle.slice(0, 160),
  };
}
```

**Target shape after refactor:**
```typescript
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return buildMetadata({
    title: `${project.title} — James Nhek`,
    description: project.subtitle.slice(0, 155), // 155 not 160 — factory adds OG title/desc; keep under 160 with some margin
    path: `/projects/${slug}`,
  });
}
```

**No other changes** — `generateStaticParams`, page component, all imports except adding `buildMetadata`, remain unchanged.

---

### `src/components/primitives/ArchitectureDiagram.tsx` (MODIFY — POL-03 fetchPriority)

**Current shape** (line 52 — the one line being changed):
```tsx
<Image src={src} alt={alt} fill className="object-contain" />
```

**Target shape** (RESEARCH.md Pattern 7 — `priority` deprecated in Next.js 16; use `fetchPriority="high"` alone):
```tsx
<Image src={src} alt={alt} fill className="object-contain" fetchPriority="high" />
```

**Context:** The raster branch (`isSvg === false`) at line 51–53 is the only change. The SVG branch (line 43–49) uses `<img>` not `<Image>` and is unaffected. This branch is currently unused (all diagram assets are SVGs per projects.ts line 101), but the fix is correct for any future raster diagram and for TypeScript hygiene.

**Do NOT add `priority` prop** — it is deprecated in Next.js 16. Do NOT add `preload={true}` — docs say not to combine with `fetchPriority`. Just add `fetchPriority="high"` to the existing `<Image>` call.

---

## Shared Patterns

### Tailwind v4 Arbitrary-Value Idiom
**Source:** Every `.tsx` file in `src/components/` and `src/app/`
**Apply to:** `src/app/not-found.tsx` (the only new TSX page)
```tsx
// Size token
text-[length:var(--text-body)]
text-[length:var(--text-caption)]
text-[length:var(--text-display)]
// Color token
text-[color:var(--color-ink)]
text-[color:var(--color-ink-muted)]
// Line-height token
leading-[var(--leading-body)]
leading-[var(--leading-display)]
```

### Focus-Ring Pattern
**Source:** `src/components/primitives/ExternalLink.tsx` line 57 and `src/components/nav/BackLink.tsx` line 30 (verbatim identical string)
**Apply to:** Every interactive element in `not-found.tsx` (the `← Back to home` link), and audit-verify on all existing interactive elements (CopyEmail button, ProjectCard links, SiteFooter links)
```
focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-ink)]
```

### Server-Only Module Convention
**Source:** `src/lib/env.ts` lines 1–5 and `src/lib/content.ts` lines 1–6 and `src/content/site.ts` lines 1–13
**Apply to:** `src/lib/seo.ts`
```typescript
// SERVER-ONLY — [reason]. DO NOT import from Client Components.
```

### Max-Width Container Pattern
**Source:** `src/app/uses/page.tsx` line 43 and `src/app/projects/[slug]/page.tsx` line 68
**Apply to:** `src/app/not-found.tsx`
```tsx
<main className="mx-auto max-w-2xl px-6 [py/pt/pb]-* md:px-12 [md:pt/pb]-*">
```

### ImageResponse Hex Palette (shared by opengraph-image, icon, apple-icon)
**Source:** `src/app/globals.css` lines 23–28 (resolved from oklch to hex)
**Apply to:** `src/app/opengraph-image.tsx`, `src/app/icon.tsx`, `src/app/apple-icon.tsx`
```
background: "#fafafa"   // --color-paper  oklch(0.985 0 0)
color: "#0a0a0a"        // --color-ink    oklch(0.18 0 0)
color: "#737373"        // --color-ink-muted  oklch(0.55 0 0)
```
Critical: use hex literals, not `var(--color-*)` — Satori does not resolve CSS custom properties.

### `buildMetadata` Import Pattern (shared by all three modified routes)
**Source:** `src/lib/seo.ts` (new file — the factory itself)
**Apply to:** `src/app/layout.tsx`, `src/app/uses/page.tsx`, `src/app/projects/[slug]/page.tsx`
```typescript
import { buildMetadata } from "@/lib/seo";
```

### Content Accessors Import Pattern
**Source:** `src/app/projects/[slug]/page.tsx` line 36 and `src/lib/content.ts` lines 21–26
**Apply to:** `src/app/sitemap.ts` (consumes `getAllProjects` — same import as the [slug] page)
```typescript
import { getAllProjects } from "@/lib/content";
import { site } from "@/content/site";
```

---

## No Analog Found

All files have analogs. The three `ImageResponse` files (`opengraph-image.tsx`, `icon.tsx`, `apple-icon.tsx`) have no React-component analog in the codebase but their `ImageResponse` pattern is fully specified in RESEARCH.md Pattern 2/3 and should be followed verbatim.

---

## Critical Cross-Cutting Notes for Planner

1. **`"use client"` invariant (SEC-07):** All 10 files are Server-only or build-time. Zero client directives introduced. The sole existing client island (`CopyEmail.tsx`) is untouched.

2. **Metadata shallow-merge trap:** The `buildMetadata` factory always includes `openGraph.images: ["/opengraph-image"]`. Planner must ensure no route sets `openGraph` manually — all must route through the factory.

3. **`favicon.ico` deletion:** Part of the `icon.tsx` plan. Without deletion, two icons coexist (RESEARCH.md Pitfall 5).

4. **`priority` vs `fetchPriority` in Next.js 16:** `ArchitectureDiagram.tsx` change is one prop addition (`fetchPriority="high"`). Do not use `priority` (deprecated) or `preload` (do not combine with fetchPriority per docs).

5. **Verification split:** The plan must split tasks into Claude-automatable (Lighthouse CLI, axe CLI, curl checks, build output) vs James-confirms (LinkedIn Inspector, opengraph.xyz, real Slack/iMessage DM, real iPhone, 60-sec cold-read). Phase closes when James confirms all 5 human-verify checkpoints.

---

## Metadata

**Analog search scope:** `src/app/`, `src/lib/`, `src/content/`, `src/components/`
**Files scanned:** 25 (all `.ts`/`.tsx` in `src/`, plus `globals.css`)
**Pattern extraction date:** 2026-06-23
