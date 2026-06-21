# Phase 2: Content & Sections (with Confidentiality Gate) - Research

**Researched:** 2026-05-21
**Domain:** Recruiter-facing portfolio content — typed-TS content modules, statically-generated dynamic routes, hand-drawn sanitized architecture diagrams, mono-palette accessible UI, the confidentiality-review-as-merge-gate workflow
**Confidence:** HIGH

## Summary

Phase 2 is overwhelmingly a **content + composition** phase, not a stack decision phase. CONTEXT.md and UI-SPEC.md have already locked the load-bearing technical choices: typed TS content modules over MDX, 9 new components (`MetricCallout`, `ProjectCard`, `RoleHeader`, `ExperienceBlock`, `EducationItem`, `BackLink`, `UsesEntry`, `SiteFooter`, `CopyEmail`), exactly one `"use client"` boundary (`CopyEmail`), Excalidraw-authored SVGs post-edited to use `--color-ink` / `--color-ink-muted` only, and a 3-item objective confidentiality checklist enforced via `CONFIDENTIALITY-REVIEW.md` as a hard merge gate. The planner's job is not to relitigate these — it's to slice them into shippable plans.

The two areas that genuinely need research (not just decision-honoring) are: (1) **the operational shape of the confidentiality gate** — when does it run, what does the artifact look like, what's the recovery path if it fails — and (2) **the Excalidraw → mono-palette SVG workflow** — Excalidraw exports inline CSS-fill/stroke per element, so "use the CSS variables" requires a deterministic post-export edit, not a config setting. Everything else is straightforward composition of Phase 1 primitives with locked content rules.

**Primary recommendation:** Slice Phase 2 into **5 plans** along content + render boundaries (not requirement boundaries) — (1) types + content modules + lib/content.ts, (2) home-route sections + SiteFooter + drop home `04. Uses`, (3) `/projects/[slug]` route + 4 detail pages, (4) `/uses` route + content/uses.ts, (5) Diagram authoring + CopyEmail + CONFIDENTIALITY-REVIEW.md gate. Gate the merge of plan 5 on a passing 3-item checklist signed in `CONFIDENTIALITY-REVIEW.md`, AND block the planner from starting if `.planning/refs/RESUME-2026-05.md` is absent.

## User Constraints (from CONTEXT.md)

### Locked Decisions

**Asurion Content Sourcing (governs every Asurion-touching word + diagram label)**
- **D-Asurion-01: Strict — verbatim or near-verbatim paraphrase from the public May-2026 resume.** No fact (number, count, scope, tech name, tenure detail) may appear on the site that isn't on that resume. Paraphrasing is allowed only for prose flow, not for adding facts. Resolves CONT-07.
- **D-Asurion-02: Canonical source-of-truth lives at `.planning/refs/RESUME-2026-05.md`.** James will deposit the public May-2026 resume at this path before Phase 2 execution starts. Every Asurion-touching sentence is diffed against this file at review time. **Action required (James):** copy the resume into `.planning/refs/RESUME-2026-05.md` (or `.pdf`) before `/gsd:plan-phase 2` runs.
- **D-Asurion-03: Every Asurion sentence on the site must contain a number sourced from RESUME-2026-05.md.** If no resume-sourced number backs a sentence, cut the sentence. No scene-setting/framing sentences without numbers. Resolves CONT-08.
- **D-Asurion-04 (revised): The Asurion architecture diagram (DIAG-01) uses generic role labels only.** Allowed labels: `Retriever`, `Reranker`, `Vector Store`, `LLM`, `Eval`, `Ingestion`. **No public-tech names** on the Asurion diagram. Asurion *copy* (Experience bullets) may include public-tech names that the resume itself discloses (governed by D-Asurion-01). **No internal product names, codenames, queue names, team names, or screenshots anywhere.**

**Confidentiality Review Process (hard merge gate)**
- **D-Review-01: James self-reviews against a written checklist.** Sign-off recorded in `.planning/phases/02-content-sections-with-confidentiality-gate/CONFIDENTIALITY-REVIEW.md`. Single-reviewer model — checklist counteracts author-as-reviewer bias.
- **D-Review-02: Review runs once, at end of phase, against everything, before the phase verifier.**
- **D-Review-03: 3-item objective checklist** — (1) every Asurion sentence cites a number from `.planning/refs/RESUME-2026-05.md`, (2) no internal product/codename/queue/team names anywhere in copy or diagrams, (3) no screenshots of any Asurion internal system. Subjective "LinkedIn tomorrow" check excluded — rubric stays diff-able.
- **D-Review-04: Any failed item blocks the phase verifier. Fix violation → re-run *full* three-item checklist → sign off.** No partial re-reviews, no reviewer overrides.

**About Section Voice + Length (SEC-02)**
- **D-About-01: ~120–180 words across 2–3 short paragraphs.**
- **D-About-02: Conversational voice — like talking to a friend.** First person, natural cadence, no resume-speak. Contractions OK; parenthetical asides OK.
- **D-About-03: Closes on current Asurion work** (RAG, evals, agentic workflows).
- **D-About-04: Claude drafts during Phase 2 execution; James edits to land final voice.**

**Experience Section Depth (SEC-03)**
- **D-Exp-01: All 3 work roles + 2 education entries, full depth.**
- **D-Exp-02: 3–5 bullets per work role.** Asurion bullets: every bullet has a number from RESUME-2026-05.md. Non-Asurion: number-led where resume has one, action-verb-led otherwise.
- **D-Exp-03: Tag chips on Asurion role only.** Tax Analyst @ A to Z and Data Analyst @ FWD render as prose bullets without tech chips.
- **D-Exp-04: Role header row format `Title — Company — Dates — Location`** for every work role. Dates render in Geist Mono.

**Project Detail Page Depth (PROJ-01..05)**
- **D-Proj-01: Each `/projects/[slug]` page ~300–500 words structured Problem → Approach → Result with tech chips.** Composed from Phase 1 primitives. Four slugs locked: `sf-date-night-concierge`, `gtm-research-pipeline`, `voice-intent-eval`, `daily-weather-pipeline`.
- **D-Proj-02: Voice Intent Eval gets DIAG-02.** Other 3 projects ship without diagrams in Phase 2.
- **D-Proj-03: Whole project card is a single `<Link>` to `/projects/[slug]`.** Detail page has `← Back to home` link at the top. GitHub `ExternalLink` sits **outside the `<Link>` but inside the card border** (sibling pattern — avoids invalid nested `<a>` and `stopPropagation` JS).
- **D-Proj-04: Detail page reuses `MetricCallout` from card at a larger scale.**

**Project Card Metric Callout (SEC-05)**
- **D-Metric-01: Big-number poster.** Geist Mono, `clamp(28px, 1.25rem + 2vw, 40px)` card / `clamp(36px, 1.5rem + 3vw, 48px)` detail, `--color-ink` value, `--color-ink-muted` Geist Mono caption.
- **D-Metric-02: Card stack (top → bottom):** Title → subtitle → `MetricCallout` → description → tech chips → GitHub `<ExternalLink>`.
- **D-Metric-03: Primary metric per project (verbatim from May-2026 resume — final string confirmed during execution).** Card value/label:
  - `sf-date-night-concierge` → `5,800+` / `place embeddings (pgvector + HNSW)`
  - `gtm-research-pipeline` → `Cohen's κ` / `LLM-as-judge eval, self-preference bias`
  - `voice-intent-eval` → `100%` / `intent accuracy / 80 scenarios`
  - `daily-weather-pipeline` → retraining-cadence metric from resume / `Airflow → BigQuery ML`

**Architecture Diagram Tool + Style (DIAG-01..04)**
- **D-Diag-01: Both diagrams authored in Excalidraw.** SVG export. Files land in `public/diagrams/` (`asurion-rag-pipeline.svg`, `voice-intent-eval-flow.svg`). Phase 1 `ArchitectureDiagram` primitive renders both unchanged.
- **D-Diag-02: Strict monochrome.** `--color-ink` primary, `--color-ink-muted` secondary. No accent colors. Manual post-export edit on the SVG to convert Excalidraw's default ink colors to CSS-variable strokes.
- **D-Diag-03: Asurion diagram (DIAG-01) depicts `Ingestion → Embed → Hybrid Retrieve → Rerank → LLM → Eval loop`.** 6–7 nodes max. Box labels: generic role names only.
- **D-Diag-04: Voice Intent Eval diagram (DIAG-02) depicts `TTS → ASR → two-stage Claude → dual-judge benchmarking + CI`.** 5–6 nodes. Public-tech names allowed.

**/uses Page Scope (USES-01..03)**
- **D-Uses-01: AI-specific core only.** Five categories: Models · MCP Servers · Eval Stack · Agent Framework · Dev Workflow. ~3–6 items per category.
- **D-Uses-02: Each entry is bold name + one-line "why I picked it" caption.** Page is 5 numbered `Section`s (`01. Models` … `05. Dev Workflow`).
- **D-Uses-03: New `<SiteFooter>` primitive ships in Phase 2** and composes into `app/layout.tsx` so home + `/projects/[slug]` + `/uses` share it. Single-line footer: `© 2026 James Nhek · /uses · github · linkedin` in Geist Mono ink-muted.
- **D-Uses-04: Claude proposes initial `/uses` content during Phase 2 execution; James edits to lock final list.**

### Claude's Discretion

- Concrete file paths for `content/site.ts`, `content/experience.ts`, `content/projects.ts`, `content/uses.ts`, `lib/content.ts`, `types/content.ts` (names locked; nesting under `src/` follows Phase 1 convention).
- Exact field shape of `Project`, `Role`, `UsesItem`, `SiteConfig` TS interfaces — must be strict-mode-safe under `noUncheckedIndexedAccess`.
- Whether `MetricCallout` is a primitive or inline composition. If ≥2 usages (card + detail per D-Proj-04), default to primitive.
- Card hover treatment — subtle ink-muted → ink transition on subtitle; no background fills. `focus-visible:` outline mandatory.
- `copy-email` button UX — `navigator.clipboard.writeText` + aria-live announcement; lives in `src/components/interactive/CopyEmail.tsx`.
- `mailto:` and `https://github.com/...` and `https://linkedin.com/in/...` URLs use existing `ExternalLink` primitive — safe-protocol allowlist already covers `mailto:` (Phase 1 D-08).
- Anchor-hash-update behavior for `#about #experience #projects #contact` — native browser behavior is sufficient; no JS scroll handler needed.
- Numbered section count update: home goes from 5 sections to **4** (drop home `04. Uses`; renumber Contact from `05.` to `04.`). UI-SPEC §"Section numbering scheme on `/`" already locked this.

### Deferred Ideas (OUT OF SCOPE)

- **SEO metadata factory** (`lib/seo.ts`), `sitemap.ts`, `robots.ts`, `opengraph-image.tsx`, favicon, `app/not-found.tsx` — Phase 3.
- **Lighthouse / axe / 60-second cold-read verification** — Phase 3.
- **Custom domain DNS cutover, HTTPS verification, legacy redirect, Vercel usage alerts, UptimeRobot** — Phase 4.
- **Resend-backed contact form Server Action** — v2 (POST-01). Phase 2 contact is `mailto:` + `CopyEmail` + LinkedIn + GitHub.
- **Live RAG demo, dynamic per-project OG, ⌘K command palette, GitHub stars on cards** — v2.
- **Per-project case-study expansion (POST-02).** Phase 2 ships tight 300–500-word detail pages.
- **GitHub stars / "last updated" on project cards (POST-05).** v2.
- **View Source easter egg (POST-03).** v2.
- **Subjective "LinkedIn tomorrow" confidentiality check.** Rejected from D-Review-03; rubric stays objective.
- **Second human reviewer for confidentiality.** Rejected in D-Review-01 in favor of self-review with a written checklist.
- **`james@pjnhek.com` email forwarding decision.** Phase 4 DNS work. **NOT a Phase 2 blocker** — Phase 2 contact uses James's Gmail (`nhekvirakyuth@gmail.com`).

### Sub-decisions resolved at plan-phase

- **Drop home `04. Uses` section.** UI-SPEC.md §"Section numbering scheme on `/`" already takes this default. Home goes from 5 numbered sections to 4 (`01. About` → `04. Contact`).
- **Target email for home Contact `mailto:`.** Default `nhekvirakyuth@gmail.com`; planner confirms.

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CONT-01 | `types/content.ts` defines `Project`, `Role`, `UsesItem`, `SiteConfig` with full type safety | §"Standard Stack" — typed TS with `strict` + `noUncheckedIndexedAccess`; §"Code Examples" type-shape pattern |
| CONT-02 | `content/site.ts` holds name, tagline, location, email, GitHub URL, LinkedIn URL, base URL | §"Code Examples" content-module pattern |
| CONT-03 | `content/experience.ts` contains 3 work roles + USF + UH education | §"Code Examples" Role type + module pattern |
| CONT-04 | `content/projects.ts` contains exactly 4 projects with title, slug, subtitle, metric, tech, GitHub, description | §"Code Examples" Project type + module pattern |
| CONT-05 | `content/uses.ts` contains AI-engineer-specific tools | §"Code Examples" UsesItem type + module pattern; §"/uses default content" |
| CONT-06 | `lib/content.ts` exposes `getAllProjects()` and `getProject(slug)` | §"Code Examples" accessor pattern |
| CONT-07 | Asurion content uses only public-resume facts — passes confidentiality review | §"Confidentiality Gate Workflow"; D-Asurion-01..04 |
| CONT-08 | Every Asurion bullet contains a number | §"Confidentiality Gate Workflow" 3-item checklist item 1; D-Asurion-03 |
| SEC-01 | Hero section displays name, role, specialization, location, "open to roles" — no animation | Frozen Phase 1 (already shipped in `src/app/page.tsx`); UI-SPEC §"Hero" |
| SEC-02 | About first sentence opens with tax-analyst → AI-engineer pivot | D-About-03; UI-SPEC §"About section" |
| SEC-03 | Experience section inline with company, dates, location, bullets — no PDF download | D-Exp-01..04; UI-SPEC §"Experience section" |
| SEC-04 | Featured Projects grid: 1-col mobile / 2-col desktop, 4 cards | UI-SPEC §"Featured Projects section"; CSS Grid `grid-cols-1 md:grid-cols-2` |
| SEC-05 | Each project card shows title, subtitle, primary metric callout, tech chips, GitHub link | D-Metric-01..03; UI-SPEC §"Featured Projects section" card stack |
| SEC-06 | Contact section: `mailto:` link, copy-email button, LinkedIn, GitHub | UI-SPEC §"Contact section"; §"CopyEmail state machine" |
| SEC-07 | All sections Server Components — `"use client"` only in `components/interactive/CopyEmail.tsx` | §"Architecture Patterns" Server-Component-by-default; CopyEmail is the only client island |
| SEC-08 | Section anchors update URL hash on click | §"Anchor Navigation"; native `<a href="#anchor">` + `scroll-padding-top: 4rem` + motion-gated smooth-scroll |
| PROJ-01 | `/projects/[slug]` route renders detail page for each of 4 projects | §"Project Detail Pages — generateStaticParams pattern" |
| PROJ-02 | `generateStaticParams` derives slugs from `content/projects.ts` — all 4 statically generated | §"Project Detail Pages — generateStaticParams pattern" |
| PROJ-03 | Each detail page follows Problem → Approach → Result | D-Proj-01; UI-SPEC §"Project detail pages" |
| PROJ-04 | At least 1 detail page includes sanitized architecture diagram (SVG in `public/diagrams/`) | D-Proj-02 picks Voice Intent Eval; §"Diagram Workflow" |
| PROJ-05 | Each detail page exposes `generateMetadata` with project title + subtitle | §"Project Detail Pages — generateMetadata pattern" |
| USES-01 | `/uses` route exists, renders content from `content/uses.ts` | §"Code Examples" /uses page composition |
| USES-02 | Content is AI-engineer-specific (not generic dev /uses) | §"/uses default content" |
| USES-03 | `/uses` links back to home and is reachable from footer | §"SiteFooter" |
| DIAG-01 | One Asurion architecture diagram drawn fresh in Excalidraw with only generic component names | §"Diagram Workflow"; D-Asurion-04 |
| DIAG-02 | One featured-project architecture diagram as sanitized SVG in `public/diagrams/` | §"Diagram Workflow"; D-Proj-02 → Voice Intent Eval |
| DIAG-03 | All diagrams render crisply on retina at full width on mobile and desktop; alt text describes flow | §"Diagram Workflow — accessibility"; Phase 1 `ArchitectureDiagram` primitive enforces required `alt` |
| DIAG-04 | A confidentiality review gate passes on every Asurion-touching paragraph and diagram before deploy | §"Confidentiality Gate Workflow" |

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Content authoring (resume bullets, About prose, /uses entries) | Build-time data (typed TS modules under `src/content/`) | — | Hand-curated, low-frequency, type-checked. MDX is over-abstraction for 4 projects + 5 /uses sections (PROJECT.md Out-of-Scope, ARCHITECTURE.md §Executive Summary). |
| Page composition (home, /projects/[slug], /uses) | API/Backend (Server Components, RSC) | — | Static at build time; zero client JS for content rendering. Honors SEC-07 (`"use client"` only in CopyEmail). |
| Project detail routing | API/Backend (Next.js App Router file-system: `app/projects/[slug]/page.tsx`) | Build-time data (`getProject(slug)` from `content/projects.ts`) | `generateStaticParams` pre-renders all 4 slugs at build. |
| Per-page metadata | API/Backend (`generateMetadata` per route) | Build-time data | `title` = `${project.title} — James Nhek`; `description` = `${project.subtitle}`. Phase 2 inlines the pattern; Phase 3 owns the factory. |
| Clipboard copy-email | Browser/Client (the only `"use client"` island) | — | Requires `navigator.clipboard.writeText`. Component lives in `src/components/interactive/CopyEmail.tsx` (SEC-07 hard rule). |
| Anchor-hash navigation (`#about`, etc.) | Browser/Client (native `<a href="#anchor">` + native CSS) | — | No JS scroll handler; pure CSS `scroll-padding-top` + motion-gated `scroll-behavior: smooth`. |
| Architecture diagrams (DIAG-01, DIAG-02) | CDN/Static (`public/diagrams/*.svg`) | API/Backend (rendered via `ArchitectureDiagram` Server Component primitive) | SVGs are static assets, referenced by passthrough `<img>` per Phase 1 D-08 (avoids `next/image` rasterization). |
| Confidentiality gate | Solo-developer workflow (`CONFIDENTIALITY-REVIEW.md` artifact + manual review pass) | — | Not a code-level concern. Operational artifact gates merge before the phase verifier (D-Review-02..04). |

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `next` | `16.2.6` (installed) `[VERIFIED: package.json]` | App Router, static generation via `generateStaticParams`, file-system routing, `generateMetadata` | Locked Phase 1. App Router is the only sensible choice for Next.js 16; the only routing pattern in Next.js docs for dynamic detail pages. `[CITED: nextjs.org/docs/app/api-reference/functions/generate-static-params]` |
| `react` / `react-dom` | `19.2.4` (installed) `[VERIFIED: package.json]` | UI runtime; Server Components default | Bundled with Next.js 16. RSC reduces client JS to zero for content surfaces. |
| `typescript` | `^5` (installed) `[VERIFIED: package.json]` | Type safety on `Project`, `Role`, `UsesItem`, `SiteConfig` interfaces | tsconfig already enforces `strict: true` + `noUncheckedIndexedAccess: true` `[VERIFIED: tsconfig.json]`. The `noUncheckedIndexedAccess` flag means `projects[0]` is `Project \| undefined` — code must narrow before use. |
| `tailwindcss` + `@tailwindcss/postcss` | `^4` (installed) `[VERIFIED: package.json]` | Utility-first styling; CSS-first `@theme` block in `globals.css` | Phase 1 frozen; Phase 2 only reads existing tokens via the arbitrary-value idiom `text-[length:var(--text-*)]`. No new tokens needed (UI-SPEC §"Tailwind v4 @theme token usage"). |
| `zod` | `^3.25.76` (installed) `[VERIFIED: package.json]` | Already on `lib/env.ts`. Not needed for Phase 2 content (typed TS handles it). | Available but unused in Phase 2 — flagged to avoid the temptation to validate `content/*.ts` at runtime (TypeScript already does at build). |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `lucide-react` | `^0.460.0` (installed) `[VERIFIED: package.json]` | Icons for `CopyEmail` button: `Clipboard` (idle) and `Check` (success) — **exactly two glyphs sitewide** | UI-SPEC §"Design System" locks the icon budget. Tree-shakes per-icon under Turbopack; bundle impact ~1.5KB total for 2 icons. |

### What NOT to Install in Phase 2

| Library | Why Not |
|---------|---------|
| `@next/mdx` / `gray-matter` / `next-mdx-remote-client` | PROJECT.md Out-of-Scope; ARCHITECTURE.md §Executive Summary. 4 typed TS entries are simpler than MDX runtime; MDX makes sense past ~6 projects with embedded components. STATE.md "Key Decisions Locked" — typed TS modules in `content/` (NOT MDX). |
| `motion` / `framer-motion` | PROJECT.md Out-of-Scope. CSS + `prefers-reduced-motion` + the View Transitions API cover everything Phase 2 needs (just a color transition on card subtitle hover + native smooth scroll). |
| `react-hot-toast` / `sonner` | UI-SPEC §"Design System": `CopyEmail` uses a single hand-rolled `<button>` with `role="status" aria-live="polite"` — does not justify pulling toast lib. |
| `clsx` / `tailwind-merge` / `class-variance-authority` | No conditional classNames in Phase 2 with enough variants to justify. Inline className strings stay readable; revisit if a 3rd component grows >2 variant axes. |
| `shadcn/ui` | UI-SPEC §"Design System": No Dialog / Tooltip / Tabs / Popover surface introduced in Phase 2. |
| `@vercel/analytics` / `@vercel/speed-insights` | Phase 2 ships content only; analytics defer per PROJECT.md. |
| `resend` | Phase 2 contact is `mailto:` + `CopyEmail`. POST-01 is v2. |

### Alternatives Considered

| Instead of | Could Use | Tradeoff | Verdict |
|------------|-----------|----------|---------|
| Typed TS modules (`content/*.ts`) | MDX (`@next/mdx` + `gray-matter`) | MDX wins if project bodies need embedded React components inline (`<Metric>`, `<Stack>`); typed TS wins on simplicity, type-checking, zero bundler overhead | **Keep typed TS.** D-Proj-01 specifies 300–500 words/page composed from primitives — no embedded React inline needed. Migration to MDX is reversible if v1.x grows POST-02 case studies. |
| Excalidraw → SVG | Mermaid / tldraw / draw.io / hand-coded SVG | Excalidraw: sketchy aesthetic, free, in-browser, embeds scene data in SVG for re-editing `[CITED: docs.excalidraw.com/docs/@excalidraw/excalidraw/api/utils/export]`. Mermaid: text-source diagrams (great for version control), but auto-generated look conflicts with "engineering artifact" tone. tldraw: similar to Excalidraw; less established. Hand-coded SVG: maximum control, slowest authoring. | **Keep Excalidraw** (D-Diag-01). Aesthetic match locked in CONTEXT.md. |
| `mailto:` + `CopyEmail` | Resend Server Action (POST-01) / Formspree | Resend signals "I can wire an API" but adds env vars, DNS, build complexity. Formspree feels lazy. `mailto:` is the v1 contract. | **Keep `mailto:` + `CopyEmail`** per CONTEXT.md `<deferred>`. POST-01 in v2. |
| Native browser anchor scroll | JS scroll handler | JS handler can manage focus to the heading (better for SR users) but adds a client island, defeating SEC-07. Native `<h2>` doesn't naturally receive focus on hash-change. | **Keep native** — UI-SPEC adds `tabIndex={-1}` to `<Section>` heading if checker pass shows SR focus issue. Discretion item; planner accepts this fallback. |

**Installation:** Nothing to install in Phase 2. All required packages are already in `package.json`. `[VERIFIED: package.json]`

**Version verification:** All dependencies were installed during Phase 1 and verified at the time. Versions in `package.json`: `next@16.2.6`, `react@19.2.4`, `tailwindcss@^4`, `typescript@^5`, `zod@^3.25.76`, `lucide-react@^0.460.0`. `[VERIFIED: package.json read 2026-05-21]`

## Package Legitimacy Audit

> Phase 2 installs **zero new packages**. The audit table is included for the planner's verification.

| Package | Registry | Age | Downloads | Source Repo | slopcheck | Disposition |
|---------|----------|-----|-----------|-------------|-----------|-------------|
| (none) | — | — | — | — | — | No new installs in Phase 2 |

**Packages removed due to slopcheck [SLOP] verdict:** none
**Packages flagged as suspicious [SUS]:** none

If during execution the planner or executor identifies a missing dependency, they MUST stop and run the full Package Legitimacy Gate before installing. No exceptions for "small" or "well-known" packages.

## Architecture Patterns

### System Architecture Diagram

```
                             BUILD TIME (next build)
                             ────────────────────────

      src/content/site.ts         ──┐
      src/content/experience.ts   ──┤
      src/content/projects.ts     ──┼─── imported by RSC pages ──┐
      src/content/uses.ts         ──┘                            │
                                                                 │
      src/lib/content.ts (getAllProjects, getProject)            │
                                                                 ▼
      app/page.tsx                  ──► Hero + 4 Sections + SiteFooter
      app/projects/[slug]/page.tsx  ──► generateStaticParams → 4 detail pages
      app/uses/page.tsx             ──► 5 numbered Sections

                                  │  Static HTML + minimal JS
                                  │  emitted by Next.js 16 / Turbopack
                                  ▼

                             RUNTIME (browser)
                             ─────────────────

      Browser loads static HTML
           │
           ├─► native anchor scroll (#about / #experience / etc.)
           │   guarded by prefers-reduced-motion
           │
           └─► hydrates ONE client island:
               components/interactive/CopyEmail.tsx
                   │
                   └─► navigator.clipboard.writeText(email)
                       + aria-live="polite" announces success/failure


                             OUT-OF-BAND (human, pre-merge)
                             ──────────────────────────────

      .planning/refs/RESUME-2026-05.md (JAMES DEPOSITS BEFORE EXECUTION)
                                  │
                                  ▼
      Drafted Asurion content (About closer + Experience bullets + DIAG-01)
                                  │
                                  ▼  3-item checklist
                                  │  (1) every Asurion sentence cites a resume number
                                  │  (2) no internal product/codename/queue/team names
                                  │  (3) no screenshots of Asurion systems
                                  ▼
      .planning/phases/02-…/CONFIDENTIALITY-REVIEW.md  (HARD MERGE GATE)
                                  │
                                  ▼
                       /gsd:verify-phase 2
```

### Recommended Project Structure (additions over Phase 1)

```
src/
├── app/
│   ├── page.tsx                        # Phase 2: real content, 4 sections (not 5)
│   ├── layout.tsx                      # Phase 2: composes <SiteFooter/>
│   ├── projects/
│   │   └── [slug]/
│   │       └── page.tsx                # NEW — generateStaticParams + generateMetadata
│   └── uses/
│       └── page.tsx                    # NEW — 5 numbered Sections
├── components/
│   ├── primitives/
│   │   ├── Section.tsx                 # frozen Phase 1 (possibly +tabIndex={-1} for SR focus)
│   │   ├── NumberedHeading.tsx         # frozen Phase 1
│   │   ├── Tag.tsx                     # frozen Phase 1
│   │   ├── ExternalLink.tsx            # frozen Phase 1
│   │   ├── ArchitectureDiagram.tsx     # frozen Phase 1
│   │   ├── MetricCallout.tsx           # NEW
│   │   └── SiteFooter.tsx              # NEW
│   ├── cards/
│   │   └── ProjectCard.tsx             # NEW
│   ├── experience/
│   │   ├── RoleHeader.tsx              # NEW
│   │   ├── ExperienceBlock.tsx         # NEW
│   │   └── EducationItem.tsx           # NEW
│   ├── uses/
│   │   └── UsesEntry.tsx               # NEW
│   ├── nav/
│   │   └── BackLink.tsx                # NEW
│   └── interactive/
│       └── CopyEmail.tsx               # NEW — the ONLY "use client" file added in Phase 2
├── content/                            # NEW directory
│   ├── site.ts                         # CONT-02
│   ├── experience.ts                   # CONT-03
│   ├── projects.ts                     # CONT-04
│   └── uses.ts                         # CONT-05
├── lib/
│   ├── env.ts                          # frozen Phase 1
│   └── content.ts                      # NEW — getAllProjects / getProject (CONT-06)
└── types/
    └── content.ts                      # NEW — Project, Role, UsesItem, SiteConfig (CONT-01)

public/
├── diagrams/
│   ├── _placeholder.svg                # frozen — kept until Phase 3 cleanup
│   ├── asurion-rag-pipeline.svg        # NEW (DIAG-01)
│   └── voice-intent-eval-flow.svg      # NEW (DIAG-02)
└── ...

.planning/
├── refs/
│   └── RESUME-2026-05.md               # JAMES DEPOSITS BEFORE EXECUTION (D-Asurion-02 blocker)
└── phases/02-…/CONFIDENTIALITY-REVIEW.md   # PRODUCED at end of execution (D-Review-01)
```

### Pattern 1: `generateStaticParams` + `generateMetadata` for `/projects/[slug]`

**What:** App Router file-system convention. `generateStaticParams` returns the array of slugs at build; `generateMetadata` returns per-page `Metadata` (title/description for `<head>`).

**When to use:** Every `/projects/[slug]` build — pre-renders all 4 detail pages at build, no SSR fallback, no `dynamic = 'force-dynamic'`.

**Example:**
```tsx
// src/app/projects/[slug]/page.tsx
// Source: https://nextjs.org/docs/app/api-reference/functions/generate-static-params [CITED]
//         https://nextjs.org/docs/app/api-reference/functions/generate-metadata    [CITED]
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllProjects, getProject } from "@/lib/content";

// Pre-renders all 4 detail pages at build time.
export async function generateStaticParams() {
  const projects = getAllProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

// Per-page metadata. Phase 3 will refactor into lib/seo.ts factory.
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.title} — James Nhek`,
    description: project.subtitle.slice(0, 160),
  };
}

export default async function ProjectDetailPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  // ...render BackLink → H1 → subtitle → tech chips → ExternalLinks → MetricCallout
  // → <Section number="01" title="Problem">…</Section>
  // → <Section number="02" title="Approach">…[DIAG-02 if slug==='voice-intent-eval']</Section>
  // → <Section number="03" title="Result">…</Section>
  return <main>{/* per UI-SPEC §"Project detail pages" */}</main>;
}
```

**Notes:**
- Next.js 16 `params` is a `Promise` (App Router async params contract). `[CITED: nextjs.org/docs/app/api-reference/functions/generate-static-params]`
- `getProject(slug)` returns `Project | undefined` because of `noUncheckedIndexedAccess` — `notFound()` narrows.
- The `generateMetadata` description is truncated to 160 chars to fit OG card / Twitter card best practices. Phase 3 owns the SEO factory.

### Pattern 2: Whole-card link with internal nav + external sibling link (avoids invalid nested `<a>`)

**What:** Whole project card is a single `<Link href="/projects/{slug}">`. GitHub `ExternalLink` is a sibling inside the card's `<article>` border but **outside** the `<Link>`. HTML forbids nested `<a>` tags `[CITED: nextjs.org/docs/messages/invalid-new-link-with-extra-anchor]`, so we cannot wrap the card in `<Link>` and put `<ExternalLink>` inside it.

**When to use:** Every `ProjectCard`.

**Example:**
```tsx
// src/components/cards/ProjectCard.tsx
import Link from "next/link";
import { ExternalLink } from "@/components/primitives/ExternalLink";
import { Tag } from "@/components/primitives/Tag";
import { MetricCallout } from "@/components/primitives/MetricCallout";
import type { Project } from "@/types/content";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="border border-[color:var(--color-rule)] p-6">
      <Link
        href={`/projects/${project.slug}`}
        className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-ink)]"
      >
        <h3 className="text-[length:var(--text-subhead)] font-medium leading-[var(--leading-snug)] text-[color:var(--color-ink)]">
          {project.title}
        </h3>
        <p className="mt-2 text-[length:var(--text-body)] leading-[var(--leading-body)] text-[color:var(--color-ink-muted)] motion-safe:transition-colors group-hover:text-[color:var(--color-ink)]">
          {project.subtitle}
        </p>
        <MetricCallout value={project.metric.value} label={project.metric.label} />
        {project.description && (
          <p className="text-[length:var(--text-body)] leading-[var(--leading-body)] text-[color:var(--color-ink)]">
            {project.description}
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tech.map((t) => <Tag key={t}>{t}</Tag>)}
        </div>
      </Link>
      {/* GitHub link is a SIBLING of the <Link>, both inside the <article> border. */}
      <div className="mt-6">
        <ExternalLink href={project.github}>GitHub</ExternalLink>
      </div>
    </article>
  );
}
```

### Pattern 3: `CopyEmail` client island with `aria-live` polite announcement

**What:** Single `"use client"` boundary in Phase 2. State machine: `idle` → `success` (2s) → `idle`; or `idle` → `error` (5s) → `idle`. UI-SPEC §Components/`CopyEmail` locks the exact implementation. `aria-live="polite"` announces non-urgent confirmation per WAI-ARIA `[CITED: WebSearch — aria-live patterns for clipboard confirmation]`.

**When to use:** Contact section (SEC-06). Nowhere else.

**Example:** See UI-SPEC §Components/`CopyEmail` for the canonical implementation (lines 651–719). The planner does not need to redesign — it should produce a task that mirrors the UI-SPEC code verbatim.

**Failure-mode contract:** If `navigator.clipboard.writeText` rejects (older Safari, iframe without `clipboard-write` permission, non-HTTPS context), label becomes `Copy failed — select email manually`, `aria-live` announces the failure, button reverts after 5s. No red color — palette is mono.

### Pattern 4: Native anchor scroll, motion-gated

**What:** SEC-08 anchors (`#about`, `#experience`, `#projects`, `#contact`) are `<a href="#anchor">` rendered by section headings via `Section`'s `id` prop. URL hash updates automatically. Add two CSS rules to `globals.css`:

```css
html { scroll-padding-top: 4rem; }
@media (prefers-reduced-motion: no-preference) {
  html { scroll-behavior: smooth; }
}
```

**Why:** `scroll-padding-top: 4rem` prevents the target heading from landing flush with the viewport edge `[CITED: WebSearch — scroll-padding-top + sticky headers]`. `scroll-behavior: smooth` gated by `prefers-reduced-motion: no-preference` means users with the OS-level reduced-motion preference get instant jumps instead of animated scroll `[CITED: smashingmagazine.com — Respecting Users' Motion Preferences]`. No JS scroll handler, no client island.

**Caveat:** Native `<h2>` does not naturally receive keyboard focus on hash-change. SR users may not hear the heading announce after clicking an in-page anchor. **Mitigation:** add `tabIndex={-1}` to the `<Section>`'s heading element if browser testing confirms SR focus does not move. This is a minor additive change to the Phase 1 `Section` primitive — does not break its contract (which is its render shape, not the absence of `tabIndex`). Audit during gsd-ui-checker.

### Pattern 5: Typed content modules under `src/content/` (no MDX)

**What:** All site copy lives in typed TS modules. Pages import directly. TypeScript checks the data shape at build.

**Example:** See §"Code Examples" below.

**Why not MDX:** ARCHITECTURE.md §Executive Summary; PROJECT.md Out-of-Scope; STATE.md Key Decisions Locked. 4 projects + 5 /uses categories don't justify MDX runtime.

### Pattern 6: Excalidraw → mono-palette SVG → `public/diagrams/`

See §"Diagram Workflow" below.

### Pattern 7: Confidentiality-as-merge-gate via `CONFIDENTIALITY-REVIEW.md`

See §"Confidentiality Gate Workflow" below.

### Anti-Patterns to Avoid

- **Hand-coding section numbers as strings** (`"02. Experience"` in JSX). Always use `<Section number="02" title="Experience" id="experience">` — the primitive owns the literal `.` after the number.
- **Inlining literal hex / px values.** Every Phase 2 className must reference `@theme` tokens via `text-[length:var(--text-body)]` / `text-[color:var(--color-ink)]`. Phase 1 D-06 pattern is the locked convention.
- **Importing `lib/env.ts` from a Client Component.** `env.ts` is server-only by design (it throws on parse failure at module top). UI-SPEC §"CopyEmail" reads no env vars — `email` is passed as a prop from a Server Component.
- **`stopPropagation` on the inner GitHub link.** D-Proj-03 explicitly preferred the sibling-outside-the-Link pattern. `stopPropagation` would require a client island for the card — defeats SEC-07.
- **Nested `<a>` tags.** HTML doesn't allow it; React surfaces a `validateDOMNesting` warning `[CITED: nextjs.org/docs/messages/invalid-new-link-with-extra-anchor]`. Sibling pattern resolves it cleanly.
- **Lazy-loading the LCP element.** Phase 2 ships no above-the-fold images (hero is text). If a Phase 3 hero portrait is added, it gets `priority` + `fetchPriority="high"` per PITFALLS.md Pitfall 4.
- **`next/image` on an SVG.** Phase 1 `ArchitectureDiagram` already routes `.svg` through passthrough `<img>` to preserve crispness (`next/image` rasterizes). Diagram authors do not need to think about this — primitive handles it.
- **Adding lucide-react icons beyond `Clipboard` and `Check`.** UI-SPEC §"Design System" locks the icon budget. Anything else (LinkedIn glyph, GitHub glyph, arrow) is already covered by `ExternalLink`'s `↗`.
- **Drafting Asurion content without `.planning/refs/RESUME-2026-05.md` present.** The gate (D-Review-03 item 1) cannot pass without it. `/gsd:plan-phase 2` should treat its absence as a blocker.
- **Subjective confidentiality check.** D-Review-03 deliberately excluded the "LinkedIn tomorrow" gut-feel check from the rubric. Stay objective at review time. Individual judgment can drop a bullet at write-time, not review-time.
- **Partial re-review after a fix.** D-Review-04: any failed item → fix → re-run **all three** items, not just the failed one. Fixing bullet X can introduce a violation in bullet Y.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Dynamic route generation | Custom route resolver | Next.js `generateStaticParams` + `[slug]` segment | Native to App Router; build-time pre-rendering of all 4 slugs; no runtime cost. `[CITED: nextjs.org]` |
| Per-page `<title>` / `<meta>` | Custom `<head>` injection | `generateMetadata` export per route | App Router file convention; type-safe `Metadata` import from `next`. `[CITED: nextjs.org]` |
| Smooth in-page scroll | Custom JS scroll handler | `scroll-padding-top` + `scroll-behavior: smooth` (motion-gated) | Native CSS; no client JS; preserves SEC-07. `[CITED: smashingmagazine.com]` |
| Clipboard copy | Custom `document.execCommand("copy")` polyfill | `navigator.clipboard.writeText` (UI-SPEC failure-mode contract handles older browsers) | Web Platform standard; `execCommand` deprecated. `[CITED: WebSearch — Clipboard API patterns]` |
| Toast / pill announcement | Toast lib | `<span role="status" aria-live="polite" className="sr-only">` | One announcement, no visual chrome. Pulls in zero KB. UI-SPEC locks this. |
| Diagram authoring | Hand-coded SVG paths | Excalidraw GUI → SVG export → manual post-edit | Excalidraw embeds editable scene data inside the SVG `[CITED: docs.excalidraw.com]`. James can re-open the file in Excalidraw to make changes. |
| Whole-card-clickable | Click handler on `<article>` + `useRouter().push` | `<Link>` wrapping the card content, GitHub `ExternalLink` as sibling outside | Native semantics, no client island, no nested `<a>`, no JS. `[CITED: nextjs.org]` |
| Conditional className composition | `cn()` / `clsx` / `tailwind-merge` | Inline ternaries or template strings | Phase 2 has near-zero conditional class logic. Revisit if 3rd component grows variants. |
| Section anchor focus management | `useEffect` + `ref.focus()` | `tabIndex={-1}` on the heading element (CSS-only) | UI-SPEC §"`tabindex` for in-page anchors" — additive single-line tweak to `Section`, no JS. |
| Truncating tech chip overflow | "+N more" computed at render | `flex-wrap` and let the card grow | UI-SPEC §"Tag overflow rule" — chips ARE the signal, truncation hides stack credibility. |

**Key insight:** Phase 2 has **no problem worth hand-rolling**. Every interactive surface (clipboard copy, hash navigation, whole-card link, smooth scroll, dynamic route generation, metadata) maps directly onto a Web Platform primitive or a Next.js file convention. The temptation to import a utility lib (clsx, sonner, framer-motion) should be resisted — Phase 1's discipline of "one well-tuned utility per problem" is what makes the final JS bundle <100KB (Phase 3 target POL-04).

## Confidentiality Gate Workflow (LOAD-BEARING — the unique-to-Phase-2 risk)

This is the only part of Phase 2 that has no analogue in stock Next.js portfolio patterns. Other engineers' portfolios solve confidentiality with vague "AI Engineer at [Big Co]" without naming concrete work — James is deliberately doing the harder, more credible thing (specific RAG/eval numbers from a public resume). The gate exists to keep that move safe.

### Artifact shape: `CONFIDENTIALITY-REVIEW.md`

**Location:** `.planning/phases/02-content-sections-with-confidentiality-gate/CONFIDENTIALITY-REVIEW.md`
**Produced by:** the executor of the final Phase 2 plan (Plan 02-05 in the recommended slicing — diagrams + CopyEmail + gate)
**Consumed by:** `/gsd:verify-phase 2`
**Hard gate:** the verifier blocks if any of the 3 items is unchecked.

Recommended content shape (planner can refine — this is a default, not locked):

```markdown
# Phase 2 Confidentiality Review

**Reviewed by:** James Nhek
**Reviewed on:** YYYY-MM-DD
**Resume source-of-truth:** `.planning/refs/RESUME-2026-05.md` (sha256: <hash>)

## 3-Item Checklist (D-Review-03)

### Item 1: Every Asurion sentence cites a number from RESUME-2026-05.md
- [ ] About section closing sentence (file: `src/app/page.tsx` line X — number: "X" — resume location: line Y)
- [ ] Asurion bullet 1 (file: `src/content/experience.ts` — number: "X" — resume location: line Y)
- [ ] Asurion bullet 2 …
- [ ] Asurion bullet 3 …
- [ ] (additional bullets …)

### Item 2: No internal Asurion product / codename / queue / team names anywhere
Files scanned:
- [ ] `src/app/page.tsx`
- [ ] `src/content/experience.ts`
- [ ] `src/content/projects.ts` (vacuously — no project is Asurion-related)
- [ ] `src/content/site.ts`
- [ ] `src/content/uses.ts`
- [ ] `public/diagrams/asurion-rag-pipeline.svg`
- [ ] `public/diagrams/voice-intent-eval-flow.svg` (vacuously — personal project)

### Item 3: No screenshots of any Asurion internal system
- [ ] `public/` directory contents reviewed; no screenshots present
- [ ] `src/content/*.ts` reviewed for image paths; no Asurion screenshots referenced

## DIAG-01 specific check (D-Asurion-04)
- [ ] All box labels on `public/diagrams/asurion-rag-pipeline.svg` are from the whitelist: { Retriever, Reranker, Vector Store, LLM, Eval, Ingestion, Embed }
- [ ] No public-tech names on DIAG-01 (no `pgvector`, `LangSmith`, `Vertex`, `Anthropic`, etc.)

## Sign-off
By committing this file, I confirm all three items above pass. If any fix is made after this commit, this entire checklist is re-run (D-Review-04 — no partial re-reviews).

Signed: James Nhek
```

### Workflow integration

1. **Pre-condition (must be true before `/gsd:plan-phase 2` runs):** `.planning/refs/RESUME-2026-05.md` exists. The planner SHOULD check for this file's presence and refuse to proceed if absent (a `checkpoint:human-deposit-resume` task at the head of the first plan is the recommended mechanism).
2. **During execution (Plans 02-01 through 02-04):** Asurion-touching content is drafted in `src/content/experience.ts` and the About-closing sentence. Each drafted bullet should include an inline comment `// Resume source: line N` so review is fast.
3. **Plan 02-05 final step:** After diagrams are authored and CopyEmail ships, run the 3-item checklist by populating `CONFIDENTIALITY-REVIEW.md`. Commit. Push.
4. **Gate:** `/gsd:verify-phase 2` reads `CONFIDENTIALITY-REVIEW.md`. If any item is unchecked, verifier fails with a clear pointer to what to fix.
5. **Recovery path:** Failed item → fix → re-stage **the entire 3-item checklist** in a new commit → re-run verifier.

### Recovery scenarios (planner should account for these)

- **Resume not yet deposited at plan time** → planner emits a `checkpoint:human-verify` at the top of Plan 02-01 instructing James to deposit `RESUME-2026-05.md` before continuing.
- **Resume deposited but a planned bullet has no backing number** → executor cuts the bullet, signals via task summary, planner does not have to revise.
- **DIAG-01 ships with a non-whitelist label** → SVG is edited (Excalidraw scene data lives inside the SVG, re-editable), checklist re-run.
- **Recent realization: a sentence I thought was safe references something the resume didn't disclose** → cut the sentence, re-run the full 3-item checklist (D-Review-04). Do NOT relitigate the rubric.

### What this gate is NOT designed to catch

- **NDA violations on non-Asurion clients.** James has no other employer in scope; the rubric is Asurion-specific.
- **Generic privacy issues** (e.g., leaking personal phone numbers). The contact section's email is intentionally public.
- **Style or grammar issues.** D-Review-02 explicitly says review is for confidentiality, not for style. Style review is implicit in the "James edits the Claude draft" step.

## Diagram Workflow (DIAG-01, DIAG-02)

### Authoring path (Excalidraw → SVG → `public/diagrams/`)

Excalidraw's SVG export embeds the editable scene data inside the file `[CITED: docs.excalidraw.com/docs/@excalidraw/excalidraw/api/utils/export]`. This means James can:

1. Open Excalidraw (https://excalidraw.com, free, no account needed)
2. Draw the diagram with sketchy/hand-drawn style (default)
3. Restrict colors at draw-time to **two strokes**: black (`#000000`) and gray (`#666666`)-ish — these are the values that will be substituted for `--color-ink` and `--color-ink-muted` in post-edit
4. Export as SVG → save to `public/diagrams/asurion-rag-pipeline.svg` (or `voice-intent-eval-flow.svg`)
5. **Post-edit step (manual):** open the SVG in a text editor, find/replace inline stroke/fill colors with CSS-variable references

### Mono-palette post-edit pattern

Excalidraw exports inline `stroke="..."` / `fill="..."` attributes on individual SVG elements — there is **no global stylesheet** in the SVG output. Two options:

**Option A (recommended):** Replace inline color attributes with `currentColor` and apply color via the parent's CSS context.
```bash
# In the SVG, replace black strokes:
#   stroke="#000000"   →   stroke="currentColor"
#   fill="#000000"     →   fill="currentColor"
# Leave gray strokes alone (they'll inherit ink-muted via a second pass).
```
Then in the rendered `<img>` in `ArchitectureDiagram`, the surrounding CSS context sets `color: var(--color-ink)`. **Caveat:** `<img src="...svg">` does not propagate CSS color into the SVG content (it's a referenced resource, not inline). This option works only if the SVG is inlined as `<svg>` JSX, NOT as `<img src>`.

**Option B (works with passthrough `<img>` from the Phase 1 `ArchitectureDiagram`):** Hard-code the resolved color values (today: `#0a0a0a` for ink, `#737373` for ink-muted) directly into the SVG. Re-edit when palette changes (no plans for that in Phase 2). Simpler; honors the Phase 1 primitive contract unchanged.

**Recommendation: Option B for Phase 2.** Phase 1's `ArchitectureDiagram` uses passthrough `<img>` for SVGs (Plan 01-02 RESEARCH.md Pattern 7 — `next/image` rasterizes SVGs, destroying fidelity). Inlining the SVG to support `currentColor` would require either (a) a new primitive branch or (b) modifying `ArchitectureDiagram` — both break the Phase 1 freeze. Hard-coded resolved values in the SVG file are operationally simpler and preserve the primitive contract.

**Trade-off to surface in planning:** if a Phase 3+ user adds a dark mode, the diagram colors won't auto-flip. That's a deferred concern (PROJECT.md Out-of-Scope: dark mode). The planner should document this in `STATE.md` for the future-James who adds dark mode.

### Diagram content (binding)

| Diagram | File | Allowed labels |
|---------|------|----------------|
| DIAG-01 (Asurion) | `public/diagrams/asurion-rag-pipeline.svg` | `Ingestion`, `Embed`, `Vector Store`, `Retriever`, `Reranker`, `LLM`, `Eval` (6–7 nodes max) |
| DIAG-02 (Voice Intent Eval) | `public/diagrams/voice-intent-eval-flow.svg` | `TTS`, `ASR`, `Two-stage Claude classifier`, `Dual-judge benchmark`, `CI` (5–6 nodes; public-tech names allowed) |

### Diagram accessibility (DIAG-03)

- `ArchitectureDiagram` enforces required `alt` at the TS level (Phase 1 frozen).
- `alt` text describes the **flow** of the diagram, not just node names. UI-SPEC §"Asurion diagram placement" provides the canonical DIAG-01 `alt` string. DIAG-02 alt is drafted during execution.
- `caption` is shown visually below the diagram. DIAG-01 caption is locked: *"Generic RAG pipeline shape. Generic role labels only — no internal product names."*
- Diagrams ship at the SVG's native viewBox; they scale crisply at retina.
- The 16:9 `aspect-[16/9]` wrapper in `ArchitectureDiagram` reserves layout space → no CLS on diagram fetch.

## Code Examples

Verified patterns from official sources and existing Phase 1 code.

### Type definitions (`src/types/content.ts`)

```ts
// src/types/content.ts (NEW — CONT-01)
// Source: derived from CONTEXT.md <code_context> + UI-SPEC.md prop signatures

export type SiteConfig = {
  name: string;          // "James Nhek"
  tagline: string;       // "AI Engineer @ Asurion"
  location: string;      // "San Francisco, CA"
  email: string;         // "nhekvirakyuth@gmail.com" (final value at plan-phase)
  github: string;        // "https://github.com/pjnhek"
  linkedin: string;      // "https://www.linkedin.com/in/jamesnhek" (verify at execution)
  baseUrl: string;       // env.NEXT_PUBLIC_SITE_URL — re-exported here so content modules
                         // don't need to import lib/env (which is server-only)
};

export type Metric = {
  value: string;         // "5,800+", "100%", "Cohen's κ"
  label: string;         // "place embeddings (pgvector + HNSW)"
};

export type Project = {
  slug: string;          // "sf-date-night-concierge"
  title: string;         // "SF Date Night Concierge"
  subtitle: string;      // "Plain-English one-liner"
  metric: Metric;
  tech: string[];        // chip labels
  github: string;        // GitHub URL
  demo?: string;         // optional live demo URL
  description?: string;  // 1–2 line card description (optional per D-Metric-02)
  // Body sections rendered on the detail page:
  problem: string;       // Problem narrative (prose paragraphs joined with \n\n)
  approach: string;      // Approach narrative
  result: string;        // Result narrative
  // Optional diagram (only voice-intent-eval has one in Phase 2):
  diagram?: { src: string; alt: string; caption: string };
};

export type Role = {
  title: string;         // "AI Engineer"
  company: string;       // "Asurion"
  dates: string;         // "Oct 2025 – Present"
  location: string;      // "San Francisco, CA"
  bullets: string[];     // 3–5 bullets per D-Exp-02
  tags?: string[];       // optional — Asurion only per D-Exp-03
};

export type EducationItem = {
  program: string;       // "M.S. Data Science"
  institution: string;   // "University of San Francisco"
  dates: string;         // "July 2025 – June 2026"
};

export type UsesCategory = "Models" | "MCP Servers" | "Eval Stack" | "Agent Framework" | "Dev Workflow";

export type UsesItem = {
  category: UsesCategory;
  name: string;          // bold first word — "Claude Opus 4.7"
  rationale: string;     // one-line "why I picked it"
};
```

### Content module (`src/content/projects.ts`) — shape

```ts
// src/content/projects.ts (NEW — CONT-04)
// Source: derived from CONTEXT.md D-Metric-03; final metric strings verified
// against .planning/refs/RESUME-2026-05.md during execution.

import type { Project } from "@/types/content";

export const projects: Project[] = [
  {
    slug: "sf-date-night-concierge",
    title: "SF Date Night Concierge",
    subtitle: "A vector-search agent that plans a date in San Francisco.",
    metric: {
      value: "5,800+",
      label: "place embeddings (pgvector + HNSW)",
    },
    tech: ["pgvector", "HNSW", "LangGraph", "Postgres"],
    github: "https://github.com/pjnhek/sf-date-night-concierge",   // verify at execution
    problem: "…",
    approach: "…",
    result: "…",
  },
  // …3 more projects: gtm-research-pipeline, voice-intent-eval, daily-weather-pipeline
];
```

### Content accessor (`src/lib/content.ts`)

```ts
// src/lib/content.ts (NEW — CONT-06)
// Server-only — used by Server Components and generateStaticParams.

import { projects } from "@/content/projects";
import type { Project } from "@/types/content";

export function getAllProjects(): readonly Project[] {
  return projects;
}

export function getProject(slug: string): Project | undefined {
  // noUncheckedIndexedAccess returns Project | undefined from `.find`
  return projects.find((p) => p.slug === slug);
}
```

### `app/layout.tsx` modification (compose `<SiteFooter>`)

```tsx
// src/app/layout.tsx (modified — D-Uses-03)
// Only change: import SiteFooter, render after {children}.
// No changes to metadata, fonts, or env handling.

import { SiteFooter } from "@/components/primitives/SiteFooter";
// ... existing imports ...

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body>
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
```

### `globals.css` additions (UI-SPEC §"Tailwind v4 @theme token usage")

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

(Tailwind v4 ships `sr-only` in its base layer, so no explicit declaration is needed — UI-SPEC's "defense-in-depth" `.sr-only` block is optional. Recommend skipping it for v1; revisit only if `<span className="sr-only">` content visually leaks.)

### `/uses` default content seed (Claude proposes, James edits per D-Uses-04)

```ts
// src/content/uses.ts (seed values — finalized at execution)
import type { UsesItem } from "@/types/content";

export const uses: UsesItem[] = [
  // 01. Models
  { category: "Models", name: "Claude Opus 4.7", rationale: "the default for hard reasoning; Sonnet for everything else." },
  { category: "Models", name: "Claude Sonnet 4.x", rationale: "fast iteration loop on agentic graphs." },
  { category: "Models", name: "GPT-5 (when Claude refuses)", rationale: "second opinion on tricky retrieval queries." },

  // 02. MCP Servers
  { category: "MCP Servers", name: "Context7", rationale: "library docs without leaving the editor." },
  { category: "MCP Servers", name: "Exa", rationale: "semantic search when keyword search misses." },
  { category: "MCP Servers", name: "Firecrawl", rationale: "structured scrape from any URL." },

  // 03. Eval Stack
  { category: "Eval Stack", name: "MLflow", rationale: "model registry + experiment tracking." },
  { category: "Eval Stack", name: "Cohen's κ", rationale: "for LLM-as-judge inter-rater agreement." },
  { category: "Eval Stack", name: "Pairwise A/B with bootstrapped CI", rationale: "when point estimates lie." },

  // 04. Agent Framework
  { category: "Agent Framework", name: "LangGraph", rationale: "checkpointed graphs over function-call loops." },
  { category: "Agent Framework", name: "Pydantic / Zod schemas", rationale: "structured outputs are non-negotiable." },

  // 05. Dev Workflow
  { category: "Dev Workflow", name: "Claude Code", rationale: "primary IDE for everything past 'hello world'." },
  { category: "Dev Workflow", name: "GSD workflow", rationale: "discuss → plan → research → execute → verify." },
  { category: "Dev Workflow", name: "pnpm + Vercel", rationale: "fast install, free preview deploys." },
];
```

**Note on /uses defaults:** the above seed is grounded in the project's own CLAUDE.md (Claude Opus 4.7 default, Context7/Firecrawl/Exa MCP availability) and CONTEXT.md (LangGraph, MLflow, pgvector mentions). It is NOT verified against `.planning/refs/RESUME-2026-05.md` since `/uses` is forward-looking, not historical — James edits to finalize.

## /uses default content rationale

Web search confirms the 2026 AI-engineer stack consensus: Claude Sonnet/Opus as default reasoning models, LangGraph as the orchestration framework, MLflow for eval/registry tracking, MCP as the now-standard tool protocol `[CITED: techbytes.app/posts/langgraph-mcp-multi-agent-workflow-guide-2026, n1n.ai MCP Tools 2026 guide]`. The seed list above tracks current state-of-the-art and matches what James actually uses in the GSD workflow this site is being built with — recruiters reading `/uses` will see consistency between what he says he uses and what the site itself was built with.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| MDX content + Contentlayer/Content-Collections for portfolio projects | Typed TS modules (`content/projects.ts`) | Locked Phase 1 / PROJECT.md Out-of-Scope | Faster builds, full TS autocomplete, no bundler tooling, zero runtime cost. Reversible if v1.x grows past ~6 projects with embedded React components. |
| `document.execCommand("copy")` polyfill for clipboard | `navigator.clipboard.writeText` (Async Clipboard API) | Cross-browser since ~2020 | Modern; promise-based; one-time permission prompt removed in HTTPS contexts. UI-SPEC handles rejection in the failure-mode contract. |
| Pages Router + `getStaticProps` for project detail | App Router + `generateStaticParams` + `generateMetadata` | Next.js 13+ (locked in Next.js 16) | Cleaner per-route metadata; async params; RSC default. `[CITED: nextjs.org/docs/app]` |
| `<a href="#anchor">` + JS smooth-scroll handler | `<a href="#anchor">` + CSS `scroll-behavior: smooth` + `scroll-padding-top` | CSS spec stabilized ~2022 | Zero JS, respects `prefers-reduced-motion` naturally. `[CITED: smashingmagazine.com]` |
| `framer-motion` for any animation | CSS transitions + View Transitions API (Phase 2 needs only color-on-hover) | Native browser support landed ~2024 | Smaller bundle, no JS to ship. |

**Deprecated/outdated:**
- `next lint` was removed in Next.js 16 — Phase 1 already runs `eslint .` directly. `[CITED: CLAUDE.md, package.json scripts]`
- `framer-motion` legacy package name (now `motion`) — neither is installed; Phase 2 needs no JS animation.

## Anchor Navigation (SEC-08) Details

### Mechanism

The home route already includes `<Section id="about" …>`, `<Section id="experience" …>`, etc. via Phase 1's `Section` primitive. The anchors `#about`, `#experience`, `#projects`, `#contact` are wired implicitly — clicking `<a href="#about">` from anywhere on the page (or navigating to `/#about` from another route) updates `location.hash` and triggers the browser's native scroll.

### CSS additions (one-time, in `globals.css`)

```css
html { scroll-padding-top: 4rem; }
@media (prefers-reduced-motion: no-preference) {
  html { scroll-behavior: smooth; }
}
```

- `scroll-padding-top: 4rem` — gives 64px breathing room above the target heading.
- `scroll-behavior: smooth` — animated scroll for users without reduced-motion preference.
- The `@media (prefers-reduced-motion: no-preference)` wrapper ensures users with reduced-motion get instant jumps (the default `scroll-behavior: auto`).

### Where anchor links appear in Phase 2

Phase 2 does NOT add a top navigation bar with anchor links — UI-SPEC §"Per-route page composition" shows no `<nav>` on home. The anchors are reachable via:
1. **Direct URL** (e.g., a recruiter pastes `pjnhek.com/#projects` into Slack).
2. **SiteFooter** — currently only `/uses`, GitHub, LinkedIn (per UI-SPEC). The footer does NOT include `#about`/`#experience`/`#projects`/`#contact` links — this is by design (the home is one continuous scroll; in-page anchors live as `id` attributes only).
3. **External links from other pages** (e.g., a `/projects/[slug]` detail page could link `← Back to home` and an in-page anchor at the same time — UI-SPEC's BackLink targets `/` (not `/#projects`), but a planner could revisit if recruiters bounce on detail-page-to-home transitions).

**Planner sub-decision:** confirm whether the BackLink from `/projects/[slug]` should target `/` or `/#projects`. UI-SPEC locks `/` — recommendation is to keep it, with the rationale that landing at the top of home re-establishes the recruiter's mental model. If user later wants `/#projects`, that's a one-line change.

### Screen-reader caveat

Native browsers do not move keyboard focus to the heading on hash-change for `<h2>` elements without `tabindex`. UI-SPEC's mitigation: add `tabIndex={-1}` to `Section`'s heading on observed SR focus failure. The planner should treat this as a **single defensive task** in the home-route plan: "if browser test confirms SR focus does not move on `#about` click, patch `Section.tsx` to render `<h2 tabIndex={-1}>` via `NumberedHeading`." Adding `tabIndex={-1}` to a non-interactive heading is benign — it removes the heading from tab order (it's not in tab order today anyway) but allows programmatic focus.

## Runtime State Inventory

Phase 2 has minimal runtime state to worry about, but the planner should verify these:

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | None — no database, no Mem0, no Redis, no ChromaDB | None |
| Live service config | Vercel project settings (Phase 1 already provisioned: Production Branch = main, Preview = All, Deployment Protection = None) | None — Phase 2 doesn't change deploy config |
| OS-registered state | None — no cron jobs, no scheduled tasks | None |
| Secrets/env vars | `NEXT_PUBLIC_SITE_URL` (in code with `.default("https://pjnhek.com")`); Vercel production env still unset (Phase 4 / DEP-03 owns) | None for Phase 2; Phase 4 removes the default |
| Build artifacts / installed packages | `node_modules`, `.next` cache — both gitignored, both rebuilt on `pnpm install && pnpm build` | None |
| Static assets | `public/diagrams/_placeholder.svg` (Phase 1 placeholder, still referenced by `src/app/page.tsx`'s About diagram) | Phase 2 removes the About placeholder per UI-SPEC §"Asurion diagram placement" (About becomes pure prose; DIAG-01 lives in Experience under the Asurion role). The placeholder file can stay in `public/diagrams/` for now — clean up in Phase 3. |

**The canonical question — answered:** After every file in the repo is updated, what runtime systems still have the old "Coming soon" placeholders cached, stored, or registered?
- **Vercel preview cache** — invalidated on every git push. Each PR builds fresh. Not an issue.
- **CDN cache (Vercel's edge)** — production not yet deployed (Phase 4). Not an issue.
- **Browser cache (recruiter's iPhone)** — `Cache-Control` headers set by Vercel default to short TTL on Hobby. Hard-refresh resolves. Acceptable for v1.

## Common Pitfalls

### Pitfall 1: Asurion confidentiality leak — internal tool names, screenshots, or proprietary architecture details
**What goes wrong:** A "sanitized" sentence still names an internal queue. A redrawn diagram still labels a box with a recognizable internal service name. Result: potential breach of employment agreement, reputational risk at exactly the wrong time.

**Why it happens:** Sanitization treated as a copy-edit pass instead of a separate, intentional workflow. Diagrams traced from internal docs and lightly redrawn.

**How to avoid:**
- D-Asurion-01: only public-resume facts.
- D-Asurion-04: generic role labels on diagrams; **no public-tech names on DIAG-01** (stricter than copy).
- D-Review-01..04: 3-item checklist as hard merge gate, fail-the-whole-checklist-on-any-fix recovery.
- Draw diagrams fresh in Excalidraw, never trace.

**Warning signs:** Any proper noun in the Asurion section that isn't "Asurion." Diagram node labeled with anything outside the {Ingestion, Embed, Vector Store, Retriever, Reranker, LLM, Eval} whitelist. A teammate at Asurion could identify a specific service from the page.

**Phase to address:** Phase 2 — gate is hard merge gate before phase verifier.

### Pitfall 2: Vague "passionate about AI" copy
**What goes wrong:** About section reads like a LinkedIn summary written by a chatbot. Recruiters bounce.

**How to avoid:**
- D-About-02 (conversational), D-Asurion-03 (every Asurion sentence has a number), and PITFALLS.md Pitfall 1's forbidden-words list.
- "Weekend project test" applied to every project description.

**Warning signs:** Copy survives find/replace from "AI Engineer" to "Software Engineer" without losing meaning. No numbers above the fold (or in the About closing sentence).

**Phase to address:** Phase 2 (drafting); cold-read verification in Phase 3.

### Pitfall 3: `lib/env.ts` imported into a Client Component
**What goes wrong:** `lib/env.ts` throws at module top if `process.env` doesn't parse. Importing it from a `"use client"` file means the throw runs in the browser, breaking page load.

**How to avoid:** UI-SPEC §"CopyEmail": `email` is passed as a prop from a Server Component (the Contact section in `app/page.tsx`). `CopyEmail` reads no env vars directly.

**Warning signs:** A `"use client"` file has `import { env } from "@/lib/env"`. Build appears to succeed but the page errors on load.

**Phase to address:** Phase 2 — only one client island; easy to verify.

### Pitfall 4: Nested `<a>` tags from naive whole-card-clickable pattern
**What goes wrong:** `<Link><article>…<ExternalLink href="…github" /></article></Link>` produces nested `<a>`. Browsers tolerate it; React warns in dev (`validateDOMNesting`). Worse: the user's click on "GitHub" may navigate to the project detail page instead of GitHub (parent-anchor wins). `[CITED: nextjs.org/docs/messages/invalid-new-link-with-extra-anchor]`

**How to avoid:** D-Proj-03 + UI-SPEC §"Whole-card link": GitHub `ExternalLink` is a **sibling** of `<Link>`, both inside the card's `<article>` border.

**Warning signs:** `validateDOMNesting` warning in browser console. Clicking the GitHub link sometimes navigates to the detail page instead of GitHub.

**Phase to address:** Phase 2 — caught by following UI-SPEC §"Whole-card link" verbatim.

### Pitfall 5: SVG diagram blurry / shifted layout
**What goes wrong:** Diagram appears pixelated on retina, or the layout shifts when the SVG loads (CLS regression).

**How to avoid:**
- Phase 1 `ArchitectureDiagram` already wraps the passthrough `<img>` in `aspect-[16/9]` border container → reserves layout space → no CLS (Plan 01-02 RESEARCH.md IN-01 + IN-02).
- SVGs are vector → crisp at any DPI.
- Do NOT use `next/image` on SVGs (it rasterizes); the primitive routes `.svg` to passthrough `<img>` automatically.

**Warning signs:** Lighthouse CLS > 0.1 on home or `/projects/voice-intent-eval`. Diagram appears blurry on iPhone 13+ retina.

**Phase to address:** Phase 1 primitive already handles this; Phase 2 just ships SVGs to `public/diagrams/`.

### Pitfall 6: Resume file not deposited before planning starts
**What goes wrong:** Plans get written referencing Asurion content. Executor cannot verify D-Asurion-03 ("every sentence cites a number from the resume") because there's no resume to cite. Confidentiality gate cannot pass. Phase blocks at verification.

**How to avoid:** First task of Plan 02-01 is `checkpoint:human-verify "Confirm .planning/refs/RESUME-2026-05.md is committed and contains the May-2026 public resume."` Block all subsequent tasks on this checkpoint.

**Warning signs:** `ls .planning/refs/` returns empty when `/gsd:plan-phase 2` runs.

**Phase to address:** Plan 02-01 first task; flag at plan-phase level.

### Pitfall 7: Drafting on top of the wrong target email
**What goes wrong:** Contact section's `mailto:` link points to a future `james@pjnhek.com` forwarder that doesn't exist yet. Recruiter clicks → bounce.

**How to avoid:** Confirm at plan-phase: default `nhekvirakyuth@gmail.com` (Gmail, definitively live). Phase 4 may upgrade to `james@pjnhek.com` once forwarding is wired.

**Warning signs:** Sending a test email to the mailto target bounces.

**Phase to address:** Plan 02-02 (home Contact section task) confirms with user.

### Pitfall 8: lucide-react icon set expansion
**What goes wrong:** Phase 2 ships with 4+ lucide icons (LinkedIn glyph, GitHub glyph, etc.) instead of the locked 2 (`Clipboard`, `Check`). Bundle bloats; tone regresses.

**How to avoid:** UI-SPEC §"Design System" — icons restricted to exactly two glyphs sitewide. The `ExternalLink` primitive already covers external-link signaling with the `↗` text glyph (no icon needed).

**Warning signs:** PR diff shows `import { LinkedIn, Github, ArrowUpRight } from "lucide-react"`.

**Phase to address:** gsd-ui-checker post-execution; planner can warn explicitly in plan task descriptions.

### Pitfall 9: Adding the same Asurion bullet to two pages
**What goes wrong:** A great Asurion bullet appears in About AND in the Experience section AND in a project card description. Bullet count of numbers technically passes the gate but the page feels redundant.

**How to avoid:** Bullets live in exactly one place. `content/experience.ts` is the canonical home for Asurion bullets. About may *reference* the work narratively (without re-quoting a bullet). Projects are personal, not Asurion-related — they should never carry Asurion bullets.

**Warning signs:** Two sentences containing the same Asurion number on the same page.

**Phase to address:** Plan 02-02 (home composition) — executor verifies during draft.

### Pitfall 10: Phase 2 silently sets SEO that Phase 3 expects to own
**What goes wrong:** Executor adds rich `generateMetadata` (OG image, twitter card, etc.) to `/projects/[slug]` because "it's there in the type." Phase 3's `lib/seo.ts` factory then has to either accept the duplication or undo the work.

**How to avoid:** Phase 2 `generateMetadata` is intentionally minimal — `title` + `description` only. Phase 3 refactors into the factory and adds OG/Twitter. Plan tasks should explicitly say "do not add `openGraph` or `twitter` keys yet — Phase 3 / SEO-01..04 own those."

**Warning signs:** Phase 2 PR includes `openGraph: { … }` or `twitter: { … }` in any `generateMetadata`.

**Phase to address:** Plan 02-03 (project detail pages); planner is explicit in task description.

## Mobile-First Verification (research support for Phase 3, surfaced here so planner knows what Phase 2 does NOT need to do)

Phase 2 scope explicitly defers Lighthouse / axe / 60-second cold-read to Phase 3 (POL-05, POL-06, POL-09, POL-10). However, the planner should be aware of tooling options so executors can do *informal* responsive checks during Phase 2 development without scope-creeping into Phase 3 verification:

| Tool | Cost | Verdict for Phase 2 |
|------|------|---------------------|
| Chrome DevTools device emulation | Free | Use during dev. Catches obvious layout issues at 375px but not Safari-specific bugs. |
| Vercel preview URL on real iPhone | Free | Use during dev for visual sanity. **Cannot be the only check** — preview hostnames may have subtle Cache-Control/font behavior different from production. |
| Safari Web Inspector (real iPhone tethered to Mac) | Free with macOS | Best for catching iOS Safari–specific bugs (flex sizing quirks `[CITED: thinksys.com/qa-testing/cross-browser-testing-with-playwright]`). |
| BrowserStack | ~$13.5K/year | Way out of budget for a personal portfolio. Skip. |
| Responsively App | Free | Use during dev for multi-viewport simultaneous view. |

**Recommendation for Phase 2:** Use Chrome DevTools `iPhone 14 Pro / iPhone SE` presets during dev. Verify on a real iPhone before declaring a plan complete. Defer formal Lighthouse / axe sweeps to Phase 3.

## Validation Architecture

> Skipped — `nyquist_validation` is `false` in `.planning/config.json`. Phase 2 validation is the confidentiality gate (out-of-band, human review) + the existing Phase 1 build pipeline (`pnpm lint`, `tsc --noEmit`, Vercel preview build) + the manual checks listed in §"Common Pitfalls" warning signs.

## Security Domain

> The `security_enforcement` toggle is not explicitly set in `.planning/config.json` — defaults to enabled. Phase 2 ASVS exposure is minimal because there is no auth, no session, no input from untrusted users (beyond clipboard-write which is a browser-owned API).

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|------------------|
| V2 Authentication | no | No auth surface in Phase 2 |
| V3 Session Management | no | No sessions |
| V4 Access Control | no | All content is public |
| V5 Input Validation | partial | No user form input in Phase 2 (Resend form is v2 / POST-01). `CopyEmail` receives `email` only as a build-time prop from Server Component. No user-controllable input. |
| V6 Cryptography | no | No crypto in Phase 2 |

### Known Threat Patterns for this stack

| Pattern | STRIDE | Standard Mitigation | Status in Phase 2 |
|---------|--------|---------------------|-------------------|
| Reverse-tabnabbing on external links | Tampering | `target="_blank" rel="noopener noreferrer"` | Phase 1 `ExternalLink` primitive hard-codes this `[VERIFIED: src/components/primitives/ExternalLink.tsx line 56-57]` |
| `javascript:` URL injection via user-controllable href | Elevation of Privilege | Safe-protocol allowlist | Phase 1 `ExternalLink` enforces this `[VERIFIED: src/components/primitives/ExternalLink.tsx line 32]` |
| Confidential data leak (Asurion content) | Information Disclosure | Confidentiality gate + content allow-list (D-Asurion-01..04 + D-Review-01..04) | Implemented as merge gate this phase |
| Clipboard hijack | Tampering | None needed — Clipboard API writes only what the page provides; no read | N/A in v1 |
| `dangerouslySetInnerHTML` injection | Tampering | Don't use it | Phase 2 never uses `dangerouslySetInnerHTML` — all content rendered as plain text |

**No new security surface introduced in Phase 2.** The phase ships static content + one clipboard-write client island. The confidentiality gate is the dominant security-adjacent concern, and it's a workflow control, not a code control.

## Open Questions (RESOLVED)

1. **Is `.planning/refs/RESUME-2026-05.md` committed yet?**
   - **RESOLVED:** Plan 02-01 Task 0 emits a `checkpoint:human-verify` for `.planning/refs/RESUME-2026-05.md` before any Asurion-content authoring begins.
   - What we know: STATE.md and CONTEXT.md both flag this as a prerequisite that James must satisfy before plan-phase runs.
   - What's unclear: `ls .planning/refs/` returns no such directory as of this research pass.
   - Recommendation: planner emits a `checkpoint:human-verify` task at the head of Plan 02-01 — "Deposit `.planning/refs/RESUME-2026-05.md` (or `.pdf`) containing the public May-2026 resume."

2. **Final email target for the home Contact `mailto:` link?**
   - **RESOLVED:** Plan 02-01 Task 0 EMAIL line confirms `nhekvirakyuth@gmail.com` as default; James can override at the checkpoint.
   - What we know: Default = `nhekvirakyuth@gmail.com` per user-private memory. Future = `james@pjnhek.com` (Phase 4 DNS work).
   - What's unclear: Whether James wants the contact link to point to the Gmail (live today) or a forwarder (not yet provisioned).
   - Recommendation: planner confirms during Plan 02-02 task description; default to Gmail unless James says otherwise.

3. **Should `/projects/[slug]` BackLink target `/` or `/#projects`?**
   - **RESOLVED:** Keep `/` per UI-SPEC default; 02-03 BackLink href is `/`.
   - What we know: UI-SPEC locks `/`. Rationale: re-establish recruiter's mental model from the top.
   - What's unclear: Whether re-scrolling from `/` top → `#projects` is annoying to a recruiter who just came from a project page.
   - Recommendation: keep `/` per UI-SPEC. One-line change if user later prefers `/#projects`.

4. **Does adding `tabIndex={-1}` to `Section`'s heading break Phase 1's freeze?**
   - **RESOLVED:** Defensive conditional task — added to Plan 02-02 follow-up only if Wave 3 a11y check fails. Out of scope for initial planning.
   - What we know: UI-SPEC §"`tabindex` for in-page anchors" says it's an additive change, not a contract break.
   - What's unclear: Whether the gsd-ui-checker pass at end of Phase 2 will actually find an SR focus issue.
   - Recommendation: planner emits a conditional task — "If gsd-ui-checker reports SR focus does not move on anchor click, patch `NumberedHeading` to render `<HeadingTag tabIndex={-1}>`. Otherwise leave unchanged." Defensive but cheap.

5. **What is the GitHub URL for each of the 4 featured projects?**
   - **RESOLVED:** Plan 02-01 Task 0 enumerates the 4 project repo URL slots; James confirms at the checkpoint.
   - What we know: `https://github.com/pjnhek` is the user. Each project presumably has a repo there (DEP-10 expects 6 pinned repos for Phase 4).
   - What's unclear: Exact slugs for `sf-date-night-concierge`, `gtm-research-pipeline`, `voice-intent-eval`, `daily-weather-pipeline`. Some may not yet exist as public repos.
   - Recommendation: planner emits a `checkpoint:human-verify` at the top of Plan 02-01 — "Provide GitHub URLs for the 4 featured project repos, OR indicate that the repos are not yet public and the URL should point to the user profile."

6. **Are there any DIAG-02 (Voice Intent Eval) labels that need user confirmation?**
   - **RESOLVED:** Plan 02-05 Task 1 drafts; James reviews at the visual-sanity checkpoint (Task 4).
   - What we know: UI-SPEC says public-tech names allowed; D-Diag-04 specifies `TTS → ASR → two-stage Claude → dual-judge benchmarking + CI` flow.
   - What's unclear: Specific TTS/ASR product names, judge model names. Voice Intent Eval is a personal project so leakage isn't a risk, but accuracy is.
   - Recommendation: Claude drafts during Plan 02-05 diagram task; James reviews labels alongside the SVG before commit.

## Environment Availability

> Phase 2 has no new external dependencies (no Resend, no analytics, no new packages). Required tools are inherited from Phase 1.

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Build, dev | ✓ `[VERIFIED: package.json engines.node ">=22.18"]` | `>=22.18` | — |
| pnpm | Install, build, dev | ✓ `[VERIFIED: package.json packageManager "pnpm@10.30.2"]` | `10.30.2` | — |
| Next.js 16 | App Router, RSC, generateStaticParams | ✓ Installed | `16.2.6` | — |
| Tailwind v4 + PostCSS plugin | Styling | ✓ Installed | `^4` | — |
| TypeScript 5 strict | Type safety | ✓ Installed | `^5` | — |
| zod | env validation (already on lib/env.ts) | ✓ Installed | `^3.25.76` | — |
| lucide-react | CopyEmail icons | ✓ Installed | `^0.460.0` | — |
| Excalidraw (web) | Diagram authoring | Browser-based, no install | — | tldraw if Excalidraw unavailable (same SVG export contract) |
| `.planning/refs/RESUME-2026-05.md` | D-Asurion-01..04 confidentiality gate | **✗ NOT FOUND** | — | **None — hard blocker; planner emits checkpoint task to user.** |

**Missing dependencies with no fallback:**
- `.planning/refs/RESUME-2026-05.md` — must be deposited by James before Plan 02-01 can proceed past its first checkpoint.

**Missing dependencies with fallback:**
- None — every other dependency is installed and verified.

## Project Constraints (from CLAUDE.md)

These are the directives in `./CLAUDE.md` that the planner must honor; the planner should verify compliance per plan.

- **Stack pinned:** Next.js 16, React 19.2, TypeScript 5+ strict, Tailwind v4 (`@theme` in `globals.css`), pnpm, Node 22 LTS, Geist Sans + Geist Mono, Vercel Hobby. No deviations.
- **Tooling pinned:** lucide-react for icons (only `Clipboard` + `Check` in Phase 2), `clsx`/`tailwind-merge`/`cva` only if 3rd component grows variants (not in Phase 2), `next/font` for fonts.
- **MDX deferred:** "MDX only for project case studies" *if* depth warrants — Phase 2 explicitly does NOT install MDX (PROJECT.md Out-of-Scope, STATE.md Key Decisions Locked).
- **What NOT to use:** Material UI / Chakra / Mantine / Ant Design; Tailwind v3; Pages Router; `next lint`; `framer-motion` legacy; `react-icons` umbrella; Bun runtime on Vercel; Cypress; Vitest/Jest for v1; plain `<img>` for hero/project images; system fonts; commercial SaaS on Hobby; CSS-in-JS; `@vercel/og` at high traffic; `output: 'export'` in next.config.
- **Lighthouse + a11y targets** (LCP, CLS, INP, TBT, FCP, color contrast, semantic HTML, `prefers-reduced-motion`, `aria-label` on icon buttons): Phase 2 honors `prefers-reduced-motion` (anchor scroll), uses semantic HTML throughout (UI-SPEC §"Heading outline"), and applies `aria-hidden` to decorative glyphs. Formal Lighthouse / axe verification is Phase 3.
- **Confidentiality:** "high-level only with sanitized diagrams; no proprietary architecture, internal tool names, or screenshots from work systems" — locked in D-Asurion-04 and D-Review-03.
- **Audience first:** "what makes a recruiter trust and remember James in 60 seconds." Every Phase 2 plan task should be answerable against this — if a task doesn't move recruiter trust forward, push it to Phase 3 or v2.

## Assumptions Log

> All claims tagged `[ASSUMED]` in this research are listed here so the planner and discuss-phase can confirm before locking into plans.

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| (none) | All claims are either `[VERIFIED]` (from package.json, tsconfig.json, existing primitive code, CONTEXT.md, UI-SPEC.md) or `[CITED]` (from authoritative web sources). | — | — |

**If this table is empty:** All claims in this research were verified or cited — no user confirmation needed beyond the Open Questions section.

## Sources

### Primary (HIGH confidence)
- `CLAUDE.md` (project root) — Technology Stack, Recommended Stack, What NOT to Use, Vercel Hobby gotchas, Domain Setup
- `.planning/PROJECT.md` — Core Value, Audience, Constraints, Out of Scope
- `.planning/REQUIREMENTS.md` — CONT/SEC/PROJ/USES/DIAG requirement IDs and rows
- `.planning/ROADMAP.md` §"Phase 2: Content & Sections (with Confidentiality Gate)" — 5 numbered success criteria
- `.planning/STATE.md` — Key Decisions Locked, Open Todos, Risks
- `.planning/phases/02-content-sections-with-confidentiality-gate/02-CONTEXT.md` — D-* decisions verbatim
- `.planning/phases/02-content-sections-with-confidentiality-gate/02-UI-SPEC.md` — Visual + interaction contract for all 9 new components
- `.planning/research/PITFALLS.md` §Pitfalls 1, 2, 4 — confidentiality and copy pitfalls
- `.planning/research/ARCHITECTURE.md` §Executive Summary, §High-Level Component Map — typed TS over MDX rationale
- `src/components/primitives/*.tsx` (5 files) — Phase 1 primitives verbatim
- `src/app/page.tsx`, `src/app/layout.tsx`, `src/app/globals.css`, `src/lib/env.ts` — Phase 1 shipped code
- `package.json`, `tsconfig.json`, `next.config.ts`, `.planning/config.json` — Phase 1 toolchain config
- [Next.js generateStaticParams docs](https://nextjs.org/docs/app/api-reference/functions/generate-static-params) — dynamic route pre-rendering at build
- [Next.js generateMetadata docs](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) — per-page metadata pattern
- [Next.js Link nested-anchor error](https://nextjs.org/docs/messages/invalid-new-link-with-extra-anchor) — sibling pattern justification

### Secondary (MEDIUM confidence)
- [Smashing Magazine — Respecting Users' Motion Preferences](https://www.smashingmagazine.com/2021/10/respecting-users-motion-preferences/) — `prefers-reduced-motion` gating for `scroll-behavior: smooth`
- [Excalidraw docs — Export Utilities](https://docs.excalidraw.com/docs/@excalidraw/excalidraw/api/utils/export) — `exportToSvg()` and embedded scene data
- [LogRocket — Implementing copy-to-clipboard in React](https://blog.logrocket.com/implementing-copy-clipboard-react-clipboard-api/) — `navigator.clipboard.writeText` + state pattern
- [DEV — ARIA Accessibility](https://dev.to/learncomputer/stop-breaking-the-web-a-devs-guide-to-aria-accessibility-2dan) — `aria-live="polite"` for non-urgent confirmation
- [techbytes.app — LangGraph + MCP 2026 guide](https://techbytes.app/posts/langgraph-mcp-multi-agent-workflow-guide-2026/) — `/uses` stack defaults (LangGraph + MCP + MLflow as 2026 standard)
- [n1n.ai — MCP Tools 2026](https://explore.n1n.ai/blog/mcp-tools-2026-model-context-protocol-guide-2026-05-12) — MCP as industry standard for tool-calling
- [Interaction Design Foundation — Handle NDAs in Case Studies](https://www.interaction-design.org/literature/article/how-to-handle-non-disclosure-agreements-ndas-when-you-write-your-ux-case-study) — confidentiality patterns for portfolio work

### Tertiary (LOW confidence — used for orientation only, not for binding claims)
- [thinksys.com — Cross-Browser Testing with Playwright 2026](https://thinksys.com/qa-testing/cross-browser-testing-with-playwright/) — Safari-specific quirks
- [BrowserStack iOS testing](https://www.browserstack.com/test-on-iphone) — out-of-budget alternative noted in Mobile Verification section

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — every package verified against installed `package.json`; no new installs.
- Architecture: HIGH — patterns derived from official Next.js 16 docs + verified existing Phase 1 primitive code.
- Pitfalls: HIGH — confidentiality and copy pitfalls inherited from `.planning/research/PITFALLS.md` (already verified at roadmap time); Phase-2-specific pitfalls derived from CONTEXT.md decisions + UI-SPEC.md contracts + research.
- Confidentiality gate workflow: MEDIUM — the operational shape (3-item checklist, fail-the-whole-checklist-on-fix recovery, `CONFIDENTIALITY-REVIEW.md` artifact) is consensus-best-practice for solo-developer NDA-adjacent portfolios (per Interaction Design Foundation + LinkedIn Advice sources). The exact mechanism is novel-to-this-project; the planner should expect to iterate on the artifact shape during execution.
- /uses default seed: MEDIUM — grounded in CLAUDE.md's own tooling and 2026 ecosystem signals (LangGraph + MCP + MLflow consensus). James edits to lock final list per D-Uses-04.

**Research date:** 2026-05-21
**Valid until:** 2026-06-21 (Next.js 16 minor releases land monthly; Tailwind v4.1 stable; lucide-react minor releases land bi-weekly. Re-verify package versions if execution slips past June 2026.)
