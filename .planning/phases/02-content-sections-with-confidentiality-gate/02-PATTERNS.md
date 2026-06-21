# Phase 2: Content & Sections (with Confidentiality Gate) — Pattern Map

**Mapped:** 2026-05-21
**Files analyzed:** 24 new/modified files (9 components, 4 content modules, 1 lib, 1 types, 3 pages/routes, 1 layout, 1 globals.css, 2 SVGs, 1 review artifact, 1 resume ref check)
**Analogs found:** 19 / 24 (5 files have no analog — flagged below; they establish new conventions)

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `src/types/content.ts` | type-defs | static-shape | `src/lib/env.ts` (zod schema → TS type pattern); also no direct analog for pure `type` module | role-match (no `.ts`-only type module exists yet — Phase 2 establishes the convention) |
| `src/content/site.ts` | data-module | build-time-data | none in repo (new `src/content/` directory) | no analog — establish convention |
| `src/content/experience.ts` | data-module | build-time-data | none in repo | no analog — establish convention |
| `src/content/projects.ts` | data-module | build-time-data | none in repo | no analog — establish convention |
| `src/content/uses.ts` | data-module | build-time-data | none in repo | no analog — establish convention |
| `src/lib/content.ts` | accessor / service | request-response (RSC) | `src/lib/env.ts` (server-only module top-level state + exported reader) | role-match (different shape: no zod, just `find()` over typed array) |
| `src/components/primitives/MetricCallout.tsx` | primitive component | render | `src/components/primitives/Tag.tsx` (smallest static primitive) and `NumberedHeading.tsx` (composes mono+sans via two spans) | exact (role + data flow) |
| `src/components/primitives/SiteFooter.tsx` | primitive component | render (consumes content/site.ts) | `src/components/primitives/Section.tsx` (semantic wrapper + content column) | exact (same `<footer>`/`<section>` semantic-wrapper shape) |
| `src/components/cards/ProjectCard.tsx` | composed component | render | `src/app/page.tsx` Featured-Projects section (composes ExternalLink + Tag inline today) | role-match (no `components/cards/` exists yet) |
| `src/components/experience/RoleHeader.tsx` | composed component | render | `NumberedHeading.tsx` (two-span Sans+Mono baseline-aligned header) | exact |
| `src/components/experience/ExperienceBlock.tsx` | composed component | render | `Section.tsx` body (composes children + `<ul>`) — no exact analog, closest is `NumberedHeading + children` pattern | partial |
| `src/components/experience/EducationItem.tsx` | composed component | render | `RoleHeader` (same Sans-then-Mono row pattern) | exact (parallel to RoleHeader, same shape) |
| `src/components/uses/UsesEntry.tsx` | composed component | render | `Tag.tsx` (single-element inline-flex span) and inline `<li>` patterns | role-match |
| `src/components/nav/BackLink.tsx` | composed component | render | `ExternalLink.tsx` (link primitive with focus-visible: outline) but internal — uses Next.js `<Link>` instead | role-match (internal-link counterpart to external) |
| `src/components/interactive/CopyEmail.tsx` | client island | event-driven (clipboard) | none in repo (Phase 1 has zero client components) | no analog — first `"use client"` file in the codebase; establish convention |
| `src/app/page.tsx` | route page (RSC) | request-response (build-time) | itself (modified) — current Phase 1 shell | exact (refactor in place; reuse hero block verbatim) |
| `src/app/projects/[slug]/page.tsx` | dynamic route page (RSC) | build-time + generateStaticParams | `src/app/page.tsx` (Server Component composing Section + primitives) | role-match (App Router static dynamic-route pattern is new to repo) |
| `src/app/uses/page.tsx` | route page (RSC) | request-response (build-time) | `src/app/page.tsx` | exact |
| `src/app/layout.tsx` | layout (RSC) | wrap children | itself (modified — add `<SiteFooter />` after `{children}`) | exact (single-line additive change) |
| `src/app/globals.css` | global styles | build-time CSS | itself (modified — add `scroll-padding-top` + motion-gated `scroll-behavior`) | exact (additive append) |
| `public/diagrams/asurion-rag-pipeline.svg` | static asset | CDN | `public/diagrams/_placeholder.svg` (existing placeholder for diagram primitive) | role-match (same primitive consumer, different content) |
| `public/diagrams/voice-intent-eval-flow.svg` | static asset | CDN | `public/diagrams/_placeholder.svg` | role-match |
| `.planning/phases/02-…/CONFIDENTIALITY-REVIEW.md` | workflow artifact | human review | `.planning/phases/02-…/02-CONTEXT.md` (markdown checklist artifact in same phase dir) | role-match (operational doc, not code) |
| `.planning/refs/RESUME-2026-05.md` | external reference | input to confidentiality gate | none (James deposits before plan-phase runs) | no analog — externally sourced |

---

## Pattern Assignments

### `src/types/content.ts` (type-defs, static-shape)

**Analog:** None — Phase 1 has no pure `type` module. Closest reference for "module that exports types other modules consume" is `src/lib/env.ts`'s `export const env = parsed.data` (which exports a value whose type other modules infer).

**Convention to establish:** Pure type module — `export type` declarations only, no runtime exports. Lives under `src/types/` per UI-SPEC §"Recommended Project Structure." Imported via path alias `@/types/content` (matches `@/*` → `./src/*` from `tsconfig.json` line 23).

**Header comment pattern** — match the verbose-banner style used in every Phase 1 primitive (`src/components/primitives/Section.tsx` lines 1–8, `src/components/primitives/ExternalLink.tsx` lines 1–19, `src/lib/env.ts` lines 1–26):

```ts
// content/* types (CONT-01).
//
// Pure type module — no runtime exports. Consumed by:
//   - `src/content/site.ts` / `experience.ts` / `projects.ts` / `uses.ts` (build-time data)
//   - `src/lib/content.ts` (server-side accessors)
//   - Every Server Component that renders content
//
// Designed to be strict-mode-safe under `noUncheckedIndexedAccess` (tsconfig.json
// line 8): `getProject(slug)` returns `Project | undefined`, callers must narrow
// via `notFound()`.
```

**Field-shape source:** RESEARCH.md §"Type definitions" lines 614–673 — use verbatim shape:

```ts
export type SiteConfig = { name: string; tagline: string; location: string; email: string; github: string; linkedin: string; baseUrl: string; };
export type Metric = { value: string; label: string; };
export type Project = { slug: string; title: string; subtitle: string; metric: Metric; tech: string[]; github: string; demo?: string; description?: string; problem: string; approach: string; result: string; diagram?: { src: string; alt: string; caption: string }; };
export type Role = { title: string; company: string; dates: string; location: string; bullets: string[]; tags?: string[]; };
export type EducationItem = { program: string; institution: string; dates: string; };
export type UsesCategory = "Models" | "MCP Servers" | "Eval Stack" | "Agent Framework" | "Dev Workflow";
export type UsesItem = { category: UsesCategory; name: string; rationale: string; };
```

---

### `src/content/*.ts` (data-module × 4: site, experience, projects, uses)

**Analog:** None — Phase 1 has no `src/content/` directory. This is the convention CONT-01..05 establishes.

**Convention to establish:**
- `src/content/` is the canonical home for build-time content (`PROJECT.md` Out-of-Scope locks MDX out for v1).
- Each module imports its types from `@/types/content` and exports a single named constant typed `as const` only where type narrowing benefits (don't use `as const` on `Role[]` — it breaks `bullets: string[]` mutation expectations downstream; just declare `const roles: Role[] = [...]`).
- Inline comments mark resume-source provenance for confidentiality gate (D-Asurion-03):

```ts
// src/content/experience.ts (CONT-03)
import type { Role, EducationItem } from "@/types/content";

export const roles: Role[] = [
  {
    title: "AI Engineer",
    company: "Asurion",
    dates: "Oct 2025 – Present",
    location: "San Francisco, CA",
    bullets: [
      // Resume source: RESUME-2026-05.md line N — "{verbatim or near-verbatim paraphrase}"
      "Shipped X resulting in Y% improvement across Z scenarios.",
      // …
    ],
    tags: ["LangGraph", "MLflow", "pgvector"], // D-Exp-03: Asurion only
  },
  // …Tax Analyst, FWD (no `tags` field — D-Exp-03)
];

export const education: EducationItem[] = [
  { program: "M.S. Data Science", institution: "University of San Francisco", dates: "July 2025 – June 2026" },
  // …
];
```

**Note on `// Resume source:` inline-comment convention:** RESEARCH.md §"Confidentiality Gate Workflow" line 544 explicitly calls for this — it makes the 3-item checklist diff-able. Every Asurion-touching bullet/sentence must carry one.

---

### `src/lib/content.ts` (accessor, request-response)

**Analog:** `src/lib/env.ts` (lines 1–43)

**Imports pattern** (mirror `env.ts` line 27 — explicit external imports first, then type-only imports last):

```ts
import { projects } from "@/content/projects";
import type { Project } from "@/types/content";
```

**Header comment pattern** (match `env.ts` lines 1–26 verbose-banner style):

```ts
/**
 * SERVER-ONLY content accessors (CONT-06). DO NOT import from Client Components.
 *
 * Phase 2's confidentiality discipline (D-Asurion-01..04) keeps Asurion content
 * in build-time TypeScript modules — never runtime-fetched. Consumed by:
 *   - `src/app/projects/[slug]/page.tsx` (generateStaticParams + page body)
 *   - `src/app/page.tsx` Featured-Projects section
 *
 * `getProject(slug)` returns `Project | undefined` (not `Project`) because of
 * `noUncheckedIndexedAccess` — Array.prototype.find always returns `T | undefined`.
 * Callers must narrow via `notFound()` before render.
 */
```

**Core pattern** — RESEARCH.md §"Content accessor" lines 705–719 (verbatim):

```ts
export function getAllProjects(): readonly Project[] {
  return projects;
}

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
```

**Why not zod-validated like `env.ts`?** Content is typed-TS at build; TypeScript checks the shape. Runtime validation duplicates compile-time guarantees with zero added safety. RESEARCH.md line 156 explicitly flags this — zod is "available but unused in Phase 2."

---

### `src/components/primitives/MetricCallout.tsx` (primitive, render)

**Analog:** `src/components/primitives/Tag.tsx` (`src/components/primitives/Tag.tsx` lines 1–20) for header-comment shape + Server-Component-by-default discipline; `NumberedHeading.tsx` (lines 24–32) for "two stacked spans, mono + sans, ink + ink-muted" composition idiom.

**Header comment pattern** (match Tag.tsx lines 1–6):

```ts
// MetricCallout primitive (D-Metric-01..03, UI-SPEC §Components/MetricCallout).
//
// Big-number poster: value (Geist Mono, tabular-nums, --color-ink) + label
// (Geist Mono caption, --color-ink-muted). Used on every ProjectCard (`scale="card"`)
// and every /projects/[slug] detail page (`scale="detail"`).
//
// Server Component (no client-island directive). No event handlers.
```

**Props pattern** — match the Phase 1 convention of declaring `type {Name}Props = {...}` inline above the component (Section.tsx lines 12–17, Tag.tsx lines 9–11):

```ts
type MetricCalloutProps = {
  value: string;
  label: string;
  scale?: "card" | "detail";
};
```

**Render pattern** — copy the arbitrary-value Tailwind idiom from `NumberedHeading.tsx` (lines 25–31) where two stacked spans render with `text-[length:var(--text-*)]` + `text-[color:var(--color-*)]`. UI-SPEC §Components/MetricCallout lines 392–401 has the exact JSX; reproduce verbatim. Note: the `clamp(…)` for the value font-size is inlined in the className via arbitrary value — `text-[length:clamp(28px,1.25rem+2vw,40px)]` — NOT added to `globals.css` as a new token (UI-SPEC line 108 budget says no new font-size tokens).

---

### `src/components/primitives/SiteFooter.tsx` (primitive, render)

**Analog:** `src/components/primitives/Section.tsx` (lines 1–28)

**Imports pattern** (match Section.tsx lines 9–10 — primitives import each other via the same `@/components/primitives/…` path alias):

```ts
import Link from "next/link";
import { ExternalLink } from "@/components/primitives/ExternalLink";
import { site } from "@/content/site";
```

**Header comment pattern** (match Section.tsx lines 1–8):

```ts
// SiteFooter primitive (D-Uses-03, USES-03, UI-SPEC §Components/SiteFooter).
//
// Single-line footer (≥md) / 2-line stack (375px) composed once into
// `app/layout.tsx`. Reads from `@/content/site` directly (build-time inline),
// which is safe because this file is a Server Component and `content/site.ts`
// is server-only.
//
// Server Component (no client-island directive). No event handlers.
```

**Core pattern** — wraps the `mx-auto max-w-2xl px-6 md:px-12` content column from Section.tsx line 22 exactly, swap `<section>`→`<footer>`, swap `py-16 md:py-24`→`py-12 md:py-16` per UI-SPEC §Spacing-Scale row "SiteFooter block padding". UI-SPEC §Components/SiteFooter lines 624–639 is the canonical JSX.

**External-vs-internal link convention** (from `ExternalLink.tsx` lines 22–32 — only `https://`, `http://`, `mailto:` are external; internal `/uses` uses Next.js `<Link>` with no `↗` glyph):

```tsx
<Link href="/uses" className="hover:text-[color:var(--color-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-ink)]">
  /uses
</Link>
<ExternalLink href={site.github}>GitHub</ExternalLink>
```

---

### `src/components/cards/ProjectCard.tsx` (composed component, render)

**Analog:** Current `src/app/page.tsx` Featured-Projects section (lines 54–62) is the inline-composed analog. The card replaces that inline `<p>` with a proper composition.

**Imports pattern** (match `src/app/page.tsx` lines 11–14 — primitives via `@/components/primitives/`):

```tsx
import Link from "next/link";
import { ExternalLink } from "@/components/primitives/ExternalLink";
import { Tag } from "@/components/primitives/Tag";
import { MetricCallout } from "@/components/primitives/MetricCallout";
import type { Project } from "@/types/content";
```

**Core pattern** — UI-SPEC §Components/ProjectCard lines 426–451 (verbatim). Key load-bearing details to copy:

1. **`<Link>` wraps the navigable content, `ExternalLink` is a SIBLING** (D-Proj-03 + RESEARCH.md Pattern 2 lines 369–414). Both inside the `<article>` border. Never nest `<a>` tags.
2. **Border-without-fill pattern** — `border border-[color:var(--color-rule)]` matches the Tag.tsx line 15 border treatment exactly; no `bg-`, no `shadow-`, no `rounded-` beyond what Tag uses.
3. **Focus-visible outline** — copy verbatim from ExternalLink.tsx line 57:
   ```
   focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-ink)]
   ```
4. **Hover transition** — UI-SPEC line 458 specifies `motion-safe:transition-colors duration-150` on the subtitle line only. NOT on the border. NOT on a scale transform.

---

### `src/components/experience/RoleHeader.tsx` (composed component, render)

**Analog:** `src/components/primitives/NumberedHeading.tsx` (lines 24–32) — same two-span Sans-then-Mono pattern.

**Pattern excerpt to copy** (NumberedHeading.tsx lines 25–31):

```tsx
<HeadingTag className="mb-8 flex items-baseline gap-2 md:mb-12">
  <span className="font-mono text-[length:var(--text-caption)] text-[color:var(--color-ink-muted)] tabular-nums">
    {number}.
  </span>
  <span className="text-[length:var(--text-heading)] font-medium tracking-[-0.01em] text-[color:var(--color-ink)]">
    {children}
  </span>
</HeadingTag>
```

**RoleHeader divergence from analog** — UI-SPEC §Components/RoleHeader lines 479–487 requires the two lines to be **stacked** (not `flex items-baseline`), with line 1 = `<h3>` body+500 Sans (title + em-dash + company) and line 2 = `<p>` Mono caption (dates + em-dash + location). The mono-tabular-nums + ink-muted color treatment on line 2 is identical to NumberedHeading.tsx line 26.

**Em-dash convention** (UI-SPEC lines 484, 494):
- Character: U+2014 (`—`), single space each side.
- Wrap in `<span aria-hidden="true">` so screen-readers don't say "em-dash" twice.

---

### `src/components/experience/ExperienceBlock.tsx` (composed component, render)

**Analog:** None exactly — composes `<RoleHeader>` + `<ul>` + optional `<Tag>` row. The closest existing composition is `src/app/page.tsx` lines 48–52 (Experience section body — inline placeholder today).

**Pattern to follow:**
- **Server Component** (no `"use client"`) — match Phase 1 discipline. Header comment includes "Server Component (no client-island directive). No event handlers." per Section.tsx line 8.
- **Bullet rendering** — UI-SPEC §Components/ExperienceBlock lines 512–518 specifies a `<li>` with `pl-4 relative` + an `aria-hidden` `<span className="absolute left-0">–</span>` (en-dash U+2013). NOT a native list bullet — Tailwind v4 preflight resets `list-style: none`.
- **Conditional tag row** — `role.tags && role.tags.length > 0 &&` guard matches the discriminated-union narrowing approach the codebase already uses (e.g., `ArchitectureDiagram.tsx` line 55 `{caption && (…)}`).

```tsx
{role.tags && role.tags.length > 0 && (
  <div className="flex flex-wrap gap-2 pt-2">
    {role.tags.map((t) => <Tag key={t}>{t}</Tag>)}
  </div>
)}
```

---

### `src/components/experience/EducationItem.tsx` (composed component, render)

**Analog:** `RoleHeader.tsx` (parallel role: short metadata row with Sans body + Mono caption).

**Pattern excerpt** — UI-SPEC §Components/EducationItem lines 548–557 (verbatim). Layout flips between 375px stacked and ≥md horizontal-flush using `flex-col gap-1 md:flex-row md:items-baseline md:justify-between`. Sans `font-medium` on program, regular Sans for institution, Mono `tabular-nums` `--color-ink-muted` for dates — identical token usage to NumberedHeading.tsx and RoleHeader.tsx.

---

### `src/components/uses/UsesEntry.tsx` (composed component, render)

**Analog:** `src/components/primitives/Tag.tsx` (lines 13–19) for the minimal-single-element render shape.

**Pattern excerpt** — UI-SPEC §Components/UsesEntry lines 605–609:

```tsx
<li className="text-[length:var(--text-body)] leading-[var(--leading-body)] text-[color:var(--color-ink)]">
  <span className="font-medium">{name}</span> <span aria-hidden="true">—</span> {rationale}
</li>
```

**Conventions inherited from Phase 1:**
- `font-medium` (weight 500) is the only "bold" weight in the system — matches NumberedHeading.tsx line 29 (`font-medium`).
- `aria-hidden="true"` on the decorative em-dash glyph — matches ExternalLink.tsx line 62 (`aria-hidden` on `↗`).

---

### `src/components/nav/BackLink.tsx` (composed component, render)

**Analog:** `src/components/primitives/ExternalLink.tsx` (lines 38–70) — same link-with-focus-visible-outline shape, but **internal** (uses Next.js `<Link>`, NOT `<a target="_blank">`).

**Imports pattern** (match Section.tsx convention of typed imports up top):

```tsx
import Link from "next/link";
import type { ReactNode } from "react";
```

**Focus-ring pattern** (copy verbatim from ExternalLink.tsx line 57):

```
focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-ink)]
```

**Decorative glyph pattern** (match ExternalLink.tsx lines 60–67 — wrap glyph in `aria-hidden` span):

```tsx
<span aria-hidden="true" className="mr-1">←</span>
```

(U+2190 LEFTWARDS ARROW per UI-SPEC line 583.)

**Why no `ExternalLink` reuse?** ExternalLink hardcodes `target="_blank" rel="noopener noreferrer"` (line 55–56). BackLink is internal navigation — would break Next.js client-side route caching. Sibling primitive, not a wrapper.

---

### `src/components/interactive/CopyEmail.tsx` (client island, event-driven)

**Analog:** None — Phase 1 has zero `"use client"` files. CopyEmail establishes the convention.

**Conventions to establish (cited from RESEARCH.md / UI-SPEC):**

1. **`"use client"` directive on line 1** — UI-SPEC line 672. Phase 2 has **exactly one** such file (SEC-07 hard rule).
2. **Imports order** — directive, then `lucide-react` icons (the only two: `Clipboard`, `Check`), then React hooks, then types:
   ```tsx
   "use client";
   import { Clipboard, Check } from "lucide-react";
   import { useState } from "react";
   ```
3. **NEVER import `@/lib/env`** — RESEARCH.md Pitfall 3 lines 892–899. `email` arrives as a prop from a Server Component (the Contact section in `app/page.tsx`).
4. **State machine** — UI-SPEC §Components/CopyEmail lines 664–668 (idle → success 2s → idle; idle → error 5s → idle). Implementation lines 676–708.
5. **aria-live region** — `role="status" aria-live="polite"` `sr-only` span — polite, NOT assertive (UI-SPEC line 715).
6. **Border-color hover** — copy from Tag.tsx line 15 (`border border-[color:var(--color-rule)]`) + transition to `hover:border-[color:var(--color-ink)]` per UI-SPEC line 698.
7. **`min-h-[44px]`** — touch-target rule from UI-SPEC §Spacing-Scale Exceptions (line 65).
8. **Icon size 16px + `aria-hidden`** — UI-SPEC line 700; matches the screen-reader convention used on `↗` and `—` glyphs elsewhere.

**Failure-mode rendering** (UI-SPEC line 346): "Copy failed — select email manually" label, **no red color** (palette is mono). All states use `--color-ink` text on `--color-paper` background.

---

### `src/app/page.tsx` (route page, request-response)

**Analog:** Itself — refactor in place. Hero block (lines 19–35) stays **verbatim** (UI-SPEC §Hero "Phase 2 does NOT change hero copy"). The 5 `<Section>` calls (lines 37–75) are replaced with 4 (UI-SPEC §"Section numbering scheme on `/`" — drop home `04. Uses`, renumber Contact to `04.`).

**Imports update** — from current line 11–14:
```tsx
import { ArchitectureDiagram } from "@/components/primitives/ArchitectureDiagram";
import { ExternalLink } from "@/components/primitives/ExternalLink";
import { Section } from "@/components/primitives/Section";
import { Tag } from "@/components/primitives/Tag";
```
add:
```tsx
import { ProjectCard } from "@/components/cards/ProjectCard";
import { ExperienceBlock } from "@/components/experience/ExperienceBlock";
import { EducationItem } from "@/components/experience/EducationItem";
import { CopyEmail } from "@/components/interactive/CopyEmail";
import { site } from "@/content/site";
import { roles, education } from "@/content/experience";
import { getAllProjects } from "@/lib/content";
```

**Hero block — DO NOT MODIFY** (`src/app/page.tsx` lines 19–35):
```tsx
<header className="px-6 pt-24 pb-12 md:px-12 md:pt-32 md:pb-16">
  <div className="mx-auto max-w-2xl">
    <h1 className="text-[length:var(--text-display)] leading-[var(--leading-display)] font-medium tracking-[-0.02em] text-[color:var(--color-ink)]">
      James Nhek
    </h1>
    ...
  </div>
</header>
```

**Section composition pattern** (copy structure from existing `src/app/page.tsx` lines 37–46 — `<Section id number title>` then children):
```tsx
<Section id="experience" number="02" title="Experience">
  <div className="space-y-12 md:space-y-16">
    {roles.map((role) => <ExperienceBlock key={role.company} role={role} />)}
  </div>
  <hr className="my-12 border-t border-[color:var(--color-rule)] md:my-16" />
  <div className="space-y-6">
    {education.map((ed) => <EducationItem key={ed.program} {...ed} />)}
  </div>
</Section>
```

**Featured Projects grid** (UI-SPEC line 215, `grid-cols-1 md:grid-cols-2 gap-8`):
```tsx
<Section id="projects" number="03" title="Featured Projects">
  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
    {getAllProjects().map((p) => <ProjectCard key={p.slug} project={p} />)}
  </div>
  <p className="mt-12">
    <ExternalLink href={site.github}>See more on GitHub</ExternalLink>
  </p>
</Section>
```

**About diagram is REMOVED** — the placeholder `<ArchitectureDiagram src="/diagrams/_placeholder.svg" .../>` at current lines 41–45 is deleted. DIAG-01 moves into the Asurion `ExperienceBlock` per UI-SPEC §"Asurion diagram placement" (line 310). Implementation choice: pass an optional `diagram` prop to `ExperienceBlock`, or render the `<ArchitectureDiagram>` inline between bullets and tag-chip row inside `ExperienceBlock` only when `role.company === "Asurion"`.

---

### `src/app/projects/[slug]/page.tsx` (dynamic route page)

**Analog:** `src/app/page.tsx` (Server Component composing primitives) + `src/app/layout.tsx` (only other route file — shows `Metadata` export pattern).

**Imports pattern** — RESEARCH.md §"Pattern 1" lines 327–329 verbatim:
```tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllProjects, getProject } from "@/lib/content";
```

(The `import type { Metadata } from "next"` mirrors `src/app/layout.tsx` line 1 exactly.)

**`generateStaticParams` + `generateMetadata` pattern** — RESEARCH.md §"Pattern 1" lines 332–348 verbatim. Both `params` are `Promise<{ slug: string }>` (Next.js 16 async params).

**Metadata pattern** (mirrors layout.tsx lines 26–31 — `title` + `description` only, NO `openGraph`, NO `twitter` — RESEARCH.md Pitfall 10 line 958):
```tsx
return {
  title: `${project.title} — James Nhek`,
  description: project.subtitle.slice(0, 160),
};
```

**Page body composition** — UI-SPEC §"`/projects/[slug]`" lines 747–771:
- `BackLink href="/"` at top of `mx-auto max-w-2xl px-6 md:px-12` column
- `<h1>` at `--text-heading` (NOT display — UI-SPEC line 96)
- Subtitle, tech-chip row, External GitHub/Demo links, MetricCallout (`scale="detail"`)
- Three `<Section number="01|02|03" title="Problem|Approach|Result">` blocks
- Conditional `<ArchitectureDiagram>` inside Approach if `project.diagram` is defined (only `voice-intent-eval` per D-Proj-02)

---

### `src/app/uses/page.tsx` (route page)

**Analog:** `src/app/page.tsx` (same RSC + Section composition pattern).

**Imports pattern:**
```tsx
import { BackLink } from "@/components/nav/BackLink";
import { Section } from "@/components/primitives/Section";
import { UsesEntry } from "@/components/uses/UsesEntry";
import { uses } from "@/content/uses";
import type { UsesCategory } from "@/types/content";
```

**Composition pattern** — UI-SPEC §"`/uses`" lines 776–793. Five numbered Sections, each filtering `uses` by `category`. Recommend a local helper:
```tsx
const byCategory = (cat: UsesCategory) => uses.filter((u) => u.category === cat);
```
Then:
```tsx
<Section id="models" number="01" title="Models">
  <ul className="space-y-3">
    {byCategory("Models").map((u) => <UsesEntry key={u.name} name={u.name} rationale={u.rationale} />)}
  </ul>
</Section>
```

**Per-route metadata** (mirrors `app/layout.tsx` lines 26–31 — title + description only):
```tsx
export const metadata: Metadata = {
  title: "Uses — James Nhek",
  description: "Models, MCP servers, eval stack, agent framework, and dev workflow I reach for in 2026.",
};
```

---

### `src/app/layout.tsx` (layout — modify)

**Analog:** Itself (`src/app/layout.tsx` lines 33–46).

**Single additive change** — RESEARCH.md §"`app/layout.tsx` modification" lines 723–741. Add one import + one JSX line:
```tsx
import { SiteFooter } from "@/components/primitives/SiteFooter";
// ...
<body>
  {children}
  <SiteFooter />
</body>
```

**DO NOT TOUCH:**
- `metadata` block (lines 26–31) — Phase 3 owns SEO.
- `Geist`/`Geist_Mono` font configuration (lines 9–19).
- `env.NEXT_PUBLIC_SITE_URL` import (line 3).

---

### `src/app/globals.css` (modify — append-only)

**Analog:** Itself (`src/app/globals.css` lines 1–61).

**Additive append** — RESEARCH.md §"`globals.css` additions" lines 747–757. Add **outside** any `@theme` block (UI-SPEC line 885 explicit):

```css
/* Phase 2: anchor scroll behavior. Smooth scroll respects prefers-reduced-motion. */
html {
  scroll-padding-top: 4rem;
}

@media (prefers-reduced-motion: no-preference) {
  html {
    scroll-behavior: smooth;
  }
}
```

Place after the existing `html { color: ...; background: ...; }` block (current line 46–49). The `html` selector gets two declaration blocks; CSS cascade handles it cleanly.

**DO NOT add `.sr-only`** — Tailwind v4 ships it in base layer (RESEARCH.md line 759).

**DO NOT add new `@theme` tokens** — UI-SPEC line 882 explicit: "No new tokens. Phase 2 reuses every existing token."

---

### `public/diagrams/asurion-rag-pipeline.svg` + `voice-intent-eval-flow.svg`

**Analog:** `public/diagrams/_placeholder.svg` (exists from Phase 1 — same primitive consumer).

**Workflow** (RESEARCH.md §"Diagram Workflow" lines 564–598):
1. Author in Excalidraw (https://excalidraw.com).
2. Export SVG → save to `public/diagrams/{name}.svg`.
3. Post-edit SVG in text editor: hard-code resolved palette values (`#0a0a0a` for ink, `#737373` for ink-muted — RESEARCH.md Option B line 587) because `ArchitectureDiagram.tsx` line 43–48 uses passthrough `<img src>` which doesn't propagate CSS `currentColor`.

**Diagram labels** (binding):
- **DIAG-01 (Asurion):** ONLY from whitelist `{Ingestion, Embed, Vector Store, Retriever, Reranker, LLM, Eval}` per D-Asurion-04 / UI-SPEC line 319. No public-tech names.
- **DIAG-02 (Voice Intent Eval):** Public-tech names allowed — `TTS, ASR, Two-stage Claude classifier, Dual-judge benchmark, CI`.

**Caption + alt are MANDATORY** — `ArchitectureDiagram.tsx` line 18 makes `alt` required at the TypeScript level. Caption is optional but UI-SPEC lines 316 and 357 lock DIAG-01 caption verbatim.

---

### `.planning/phases/02-…/CONFIDENTIALITY-REVIEW.md` (workflow artifact)

**Analog:** None as code — operationally analogous to `.planning/phases/02-…/02-CONTEXT.md` (same phase directory, markdown checklist format).

**Template** — RESEARCH.md §"Artifact shape" lines 501–539 (verbatim). Produced at end of final plan (Plan 02-05 in recommended slicing) before `/gsd:verify-phase 2` runs.

**Hard merge gate** — verifier reads this file and blocks if any of the 3 checklist items is unchecked (D-Review-04 / RESEARCH.md line 547).

---

## Shared Patterns

### Server-Component-by-default discipline

**Source:** Every Phase 1 file. The header comment "Server Component (no client-island directive). No event handlers." appears verbatim in:
- `src/components/primitives/Section.tsx` line 8
- `src/components/primitives/NumberedHeading.tsx` line 7
- `src/components/primitives/Tag.tsx` line 6
- `src/components/primitives/ExternalLink.tsx` line 19
- `src/components/primitives/ArchitectureDiagram.tsx` line 14

**Apply to:** Every new component **except** `src/components/interactive/CopyEmail.tsx` (the one and only `"use client"` file in Phase 2, SEC-07 hard rule). Reproduce this exact comment in every new component header.

---

### Tailwind v4 arbitrary-value token idiom

**Source:** Every Phase 1 component className. `src/components/primitives/NumberedHeading.tsx` lines 26 and 29 are the canonical examples:

```tsx
className="font-mono text-[length:var(--text-caption)] text-[color:var(--color-ink-muted)] tabular-nums"
className="text-[length:var(--text-heading)] font-medium tracking-[-0.01em] text-[color:var(--color-ink)]"
```

**Apply to:** Every new component className. Format: `text-[length:var(--text-*)]` for sizes, `text-[color:var(--color-*)]` for text colors, `border-[color:var(--color-*)]` for borders, `leading-[var(--leading-*)]` for line heights. **Never** inline literal hex or px values.

---

### Header comment / banner-style file header

**Source:** Every Phase 1 file. Two flavors:

1. **Components** — short `//` block (4–8 lines) — Section.tsx lines 1–8, Tag.tsx lines 1–6.
2. **Server-only `lib/`** — JSDoc `/** ... */` block (10–25 lines) — env.ts lines 1–26.

**Apply to:** Every new file. Components get `// ...` block referencing the requirement ID (CONT-* / SEC-* / PROJ-* / USES-* / DIAG-*) and the UI-SPEC section. `lib/content.ts` gets JSDoc with "SERVER-ONLY" call-out matching `env.ts` line 1.

---

### Focus-visible ring

**Source:** `src/components/primitives/ExternalLink.tsx` line 57.

```
focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-ink)]
```

**Apply to:** Every interactive element added in Phase 2:
- `ProjectCard.tsx` (on the inner `<Link>`)
- `BackLink.tsx`
- `SiteFooter.tsx` (on the `<Link href="/uses">`)
- `CopyEmail.tsx` (on the `<button>`)
- `ExperienceBlock.tsx` (NO — bullets are not interactive)

Reproduce verbatim. Do not abbreviate, do not reorder.

---

### `aria-hidden` on decorative glyphs

**Source:** `src/components/primitives/ExternalLink.tsx` lines 60–67 — the `↗` glyph is wrapped:
```tsx
<span aria-hidden="true" className="ml-1 align-baseline font-mono text-[0.85em]">↗</span>
```

**Apply to:** Every decorative typographic glyph in Phase 2:
- `—` (em-dash U+2014) — RoleHeader, EducationItem, UsesEntry
- `–` (en-dash U+2013) — ExperienceBlock bullet markers
- `←` (left arrow U+2190) — BackLink
- `·` (middle dot U+00B7) — SiteFooter, EducationItem
- `↗` (NE arrow U+2197) — already handled by ExternalLink

---

### Conditional render with `{value && (...)}`

**Source:** `src/components/primitives/ArchitectureDiagram.tsx` lines 55–59:
```tsx
{caption && (
  <figcaption className="mt-3 ...">{caption}</figcaption>
)}
```

**Apply to:** Every optional render in Phase 2 components — `project.description`, `project.demo`, `project.diagram`, `role.tags`, `role.tags.length > 0`. Match this exact JSX shape (no ternary with `null`; explicit boolean guard).

---

### Async `params` typing for Next.js 16 dynamic routes

**Source:** RESEARCH.md §"Pattern 1" lines 338–340 + 350–352 (cited from nextjs.org/docs/app/api-reference/functions/generate-static-params).

**Apply to:** `src/app/projects/[slug]/page.tsx` only.

```tsx
{ params }: { params: Promise<{ slug: string }> }
// inside:
const { slug } = await params;
```

This is new-to-the-repo (Phase 1 has no dynamic routes) — establish the pattern carefully.

---

### Path alias `@/*` → `./src/*`

**Source:** `tsconfig.json` line 22–24:
```json
"paths": { "@/*": ["./src/*"] }
```

**Apply to:** Every new import. Always use `@/components/...`, `@/content/...`, `@/lib/...`, `@/types/...`. Never use relative paths (`../../`).

---

### React 19.2 — no `'use memo'` / manual `useMemo` / `useCallback`

**Source:** `CLAUDE.md` §"Core Technologies" — "React Compiler stable so manual `useMemo`/`useCallback` are unnecessary." None of the Phase 1 files use these hooks.

**Apply to:** `CopyEmail.tsx` — the lone client component. Use plain `useState`; do not wrap `handleCopy` in `useCallback` (React Compiler handles memoization). RESEARCH.md confirms the pattern at §"Pattern 3" line 423.

---

## No Analog Found

Files where Phase 1 has no direct match. Each establishes a new convention; planner should reference RESEARCH.md / UI-SPEC.md verbatim.

| File | Role | Data Flow | Reason | Convention to Establish |
|------|------|-----------|--------|--------------------------|
| `src/types/content.ts` | type-defs | static-shape | Phase 1 has no pure type module (only `env.ts` which exports a value) | Pure `export type` module under `src/types/` (mirrors UI-SPEC §"Recommended Project Structure" line 300–301). One file = related types grouped. |
| `src/content/*.ts` (× 4) | data-modules | build-time-data | Phase 1 has no `content/` directory — PROJECT.md locked typed-TS over MDX, but didn't create the directory | `src/content/` is the canonical home. One file per content domain (site, experience, projects, uses). Each imports types from `@/types/content`. Asurion-touching content carries `// Resume source: …` inline comments. |
| `src/components/interactive/CopyEmail.tsx` | client island | event-driven | Phase 1 has zero `"use client"` files | First (and per SEC-07, only) client component. Lives under `src/components/interactive/`. Receives data as props from Server Component parents — never imports `@/lib/env` (Pitfall 3). Uses only the two whitelisted lucide-react icons (`Clipboard`, `Check`). |
| `src/app/projects/[slug]/page.tsx` | dynamic route | build-time + generateStaticParams | Phase 1 has no `app/projects/` directory; no dynamic routes | App Router dynamic-segment convention. `params` is `Promise` (Next.js 16). Pre-renders all 4 slugs at build via `generateStaticParams`. Per-page `Metadata` via `generateMetadata` — title + description only (Phase 3 owns OG/Twitter factory). |
| `.planning/refs/RESUME-2026-05.md` | external reference | input | James deposits this externally before plan-phase runs | Not a code file — operational prerequisite. Planner emits a `checkpoint:human-verify` at the head of Plan 02-01 (RESEARCH.md Pitfall 6 line 922). |

---

## Plan-Slice Hints for the Planner

RESEARCH.md §"Summary" line 13 recommends a **5-plan slicing along content + render boundaries**:

| Plan | Files | Pattern groupings from above |
|------|-------|------------------------------|
| **02-01: Types + content modules + lib/content** | `types/content.ts`, `content/site.ts`, `content/experience.ts`, `content/projects.ts`, `content/uses.ts`, `lib/content.ts`, `checkpoint:human-verify(.planning/refs/RESUME-2026-05.md)`, `checkpoint:human-verify(4 GitHub URLs)` | All "convention to establish" sections; lib/content analogous to env.ts |
| **02-02: Home-route sections + SiteFooter + drop home Uses** | `app/page.tsx` (refactor), `app/layout.tsx` (compose SiteFooter), `app/globals.css` (anchor scroll), `components/primitives/SiteFooter.tsx`, `components/primitives/MetricCallout.tsx`, `components/cards/ProjectCard.tsx`, `components/experience/RoleHeader.tsx`, `components/experience/ExperienceBlock.tsx`, `components/experience/EducationItem.tsx` | Section/NumberedHeading/Tag/ExternalLink patterns; whole-card-link sibling pattern; arbitrary-value token idiom |
| **02-03: `/projects/[slug]` dynamic route + 4 detail pages** | `app/projects/[slug]/page.tsx`, `components/nav/BackLink.tsx`, content additions to `content/projects.ts` (problem/approach/result fields) | generateStaticParams + generateMetadata (no analog — RESEARCH Pattern 1); MetricCallout `scale="detail"`; BackLink mirrors ExternalLink focus-ring pattern |
| **02-04: `/uses` route + content/uses.ts finalization** | `app/uses/page.tsx`, `components/uses/UsesEntry.tsx`, content edits to `content/uses.ts` | Section composition; UsesEntry mirrors Tag minimal-render shape |
| **02-05: Diagram authoring + CopyEmail + confidentiality gate** | `public/diagrams/asurion-rag-pipeline.svg`, `public/diagrams/voice-intent-eval-flow.svg`, `components/interactive/CopyEmail.tsx`, `.planning/phases/02-…/CONFIDENTIALITY-REVIEW.md` | Excalidraw → mono-palette SVG workflow; first `"use client"` file; 3-item checklist gate (D-Review-03) |

---

## Metadata

**Analog search scope:**
- `/Users/pnhek/usf msds/github/portfolio/src/components/primitives/` (5 files — all read in full)
- `/Users/pnhek/usf msds/github/portfolio/src/app/` (3 files — `page.tsx`, `layout.tsx`, `globals.css`, all read in full)
- `/Users/pnhek/usf msds/github/portfolio/src/lib/env.ts` (read in full)
- `/Users/pnhek/usf msds/github/portfolio/tsconfig.json`, `package.json` (path alias + dep versions confirmed)
- `/Users/pnhek/usf msds/github/portfolio/public/diagrams/` (only `_placeholder.svg` exists)

**Files scanned:** 11 source files in `src/` + 2 config files + 1 public asset directory = 14 read calls (each file read once, no re-reads).

**Pattern extraction date:** 2026-05-21

**Key insight for the planner:** Phase 2 has **no novel pattern problem.** Every new component has a direct Phase 1 analog (Section / NumberedHeading / Tag / ExternalLink / ArchitectureDiagram cover ~80% of the new render surface). The three genuinely-new conventions are: (1) `src/content/` directory + typed-TS modules, (2) the lone `"use client"` boundary in CopyEmail, and (3) `generateStaticParams` + async `params` for the dynamic `/projects/[slug]` route. RESEARCH.md and UI-SPEC.md both supply verbatim implementations for all three.
