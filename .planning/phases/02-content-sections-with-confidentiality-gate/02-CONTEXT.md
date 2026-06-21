# Phase 2: Content & Sections (with Confidentiality Gate) - Context

**Gathered:** 2026-05-21
**Status:** Ready for planning

<domain>
## Phase Boundary

A recruiter visiting the Vercel preview URL can read the entire portfolio narrative end-to-end — **Hero → About (pivot first sentence) → Experience (3 work roles + 2 education) → Featured Projects (4 cards in 1-col mobile / 2-col desktop) → Contact** — and reach James by email. Four `/projects/[slug]` detail pages exist as statically-generated tight Problem→Approach→Result writeups. `/uses` exists as AI-engineer-specific content reachable from a shared site footer. **Every Asurion-touching paragraph and diagram passes an explicit confidentiality review gate** (single checklist, hard merge gate) before this phase closes. Two sanitized SVG diagrams ship: one Asurion-context RAG pipeline and one Voice Intent Eval flow.

**In scope** (28 requirements): CONT-01..CONT-08, SEC-01..SEC-08, PROJ-01..PROJ-05, USES-01..USES-03, DIAG-01..DIAG-04.

**Out of scope for this phase** (deferred to Phase 3+):
- SEO metadata factory (`lib/seo.ts`), `sitemap.ts`, `robots.ts`, `opengraph-image.tsx`, favicon (`app/icon.tsx`, `app/apple-icon.tsx`), `app/not-found.tsx` — Phase 3
- Lighthouse / axe / 60-second cold-read verification — Phase 3
- Custom domain `pjnhek.com` DNS cutover, HTTPS verification, legacy redirect, Vercel usage alerts, UptimeRobot — Phase 4
- Resend-backed contact form Server Action — v2 (POST-01), not Phase 2; v1 contact is `mailto:` + copy-email + LinkedIn + GitHub
- Live RAG demo on home, dynamic per-project OG, ⌘K command palette, GitHub stars on cards — v2 (DEMO/POST series)

</domain>

<decisions>
## Implementation Decisions

### Asurion Content Sourcing (governs every Asurion-touching word + diagram label)

- **D-Asurion-01: Strict — verbatim or near-verbatim paraphrase from the public May-2026 resume.** No fact (number, count, scope, tech name, tenure detail) may appear on the site that isn't on that resume. Paraphrasing is allowed only for prose flow, not for adding facts. Resolves CONT-07.
- **D-Asurion-02: Canonical source-of-truth lives at `.planning/refs/RESUME-2026-05.md`.** James will deposit the public May-2026 resume at this path before Phase 2 execution starts. Every Asurion-touching sentence is diffed against this file at review time. **Action required (James):** copy the resume into `.planning/refs/RESUME-2026-05.md` (or `.pdf`) before `/gsd:plan-phase 2` runs.
- **D-Asurion-03: Every Asurion sentence on the site must contain a number sourced from RESUME-2026-05.md.** If no resume-sourced number backs a sentence, cut the sentence. No scene-setting/framing sentences without numbers. Resolves CONT-08.
- **D-Asurion-04 (revised): The Asurion architecture diagram (DIAG-01) uses generic role labels only.** Allowed labels: `Retriever`, `Reranker`, `Vector Store`, `LLM`, `Eval`, `Ingestion`. **No public-tech names** on the Asurion diagram (no `pgvector`, no `LangSmith`, no `Vertex`) — diagram is more easily screenshotted/shared out of context than copy, so it gets the stricter rule. Asurion *copy* (Experience bullets) may include public-tech names that the resume itself discloses (governed by D-Asurion-01). **No internal product names, codenames, queue names, team names, or screenshots anywhere.**

### Confidentiality Review Process (hard merge gate per ROADMAP.md SC#4)

- **D-Review-01: James self-reviews against a written checklist.** Sign-off is recorded in `.planning/phases/02-content-sections-with-confidentiality-gate/CONFIDENTIALITY-REVIEW.md`. Single-reviewer model — the checklist exists to counteract author-as-reviewer bias.
- **D-Review-02: Review runs once, at end of phase, against everything, before the phase verifier.** All Asurion-touching content (copy + 1 diagram) is drafted first, then a single review pass over every Asurion-touching paragraph + DIAG-01 before phase closes.
- **D-Review-03: Checklist (all three items must pass before phase verifier):**
  1. Every Asurion sentence cites a number from `.planning/refs/RESUME-2026-05.md`.
  2. No internal product names, codenames, queue names, or team names anywhere in copy or diagrams.
  3. No screenshots of any Asurion internal system.

  *(The subjective "would I be comfortable if my Asurion manager saw this on LinkedIn tomorrow" check was deliberately excluded — the rubric stays objective and diff-able.)*
- **D-Review-04: Any failed item blocks the phase verifier.** Fix the violation, re-run the *full* three-item checklist (not just the failed item — fixing one bullet can introduce a new violation elsewhere), then sign off. No partial re-reviews, no reviewer overrides.

### About Section Voice + Length (SEC-02)

- **D-About-01: ~120–180 words across 2–3 short paragraphs.** Long enough to land the pivot + current work + transition, short enough that a phone-scrolling recruiter reads it all. Tilts the FEATURES.md '150–250 words' guidance toward the shorter end for the 60-second mobile test.
- **D-About-02: Conversational voice — like talking to a friend.** First person, natural cadence, no resume-speak. **Deliberately rejected** the "Recommended" warm-but-precise option — user is leaning into memorability/personality over a safer corporate tone. PITFALLS.md Pitfall 1 ("no 'passionate'/'leveraged'/'cutting-edge'") still applies.
- **D-About-03: Closes on current Asurion work** (RAG, evals, agentic workflows). Transitions naturally into the Experience section that follows. Pivot is the opening hook → present-tense Asurion work is the closer.
- **D-About-04: Claude drafts the About copy during Phase 2 execution** following the locked constraints (120–180 words, conversational, pivot first sentence, closes on Asurion). James edits the draft to land final voice.

### Experience Section Depth (SEC-03)

- **D-Exp-01: All 3 work roles + 2 education entries, full depth.** Asurion (AI Engineer, Oct 2025 – Present) · A to Z Tax Services (Tax Analyst) · FWD Life Insurance (Data Analyst) · USF MSDS (July 2025 – June 2026) · University of Houston (B.S. Math + Data Science, 2021). Education sits in a separate sub-block within the section. **Rejected** the "drop FWD/A to Z" option — those roles are the pivot scaffolding; cutting them weakens the differentiating narrative.
- **D-Exp-02: 3–5 bullets per work role across all three roles.** Asurion bullets: every bullet has a number sourced from RESUME-2026-05.md (D-Asurion-03 enforcement). Non-Asurion bullets: number-led where the resume has one, action-verb-led otherwise.
- **D-Exp-03: Tag chips on Asurion role only.** Tax Analyst @ A to Z and Data Analyst @ FWD render as prose bullets without tech chips. Asurion stays visually the headline credential while the older roles still narrate the pivot path.
- **D-Exp-04: Role header row: `Title — Company — Dates — Location` for every work role.** Dates render in Geist Mono to anchor the timeline visually. Matches SEC-03's explicit "company, dates, location" requirement.

### Project Detail Page Depth (PROJ-01..05)

- **D-Proj-01: Each `/projects/[slug]` page is ~300–500 words structured as Problem → Approach → Result with tech chips.** Composed from existing Phase 1 primitives — no new section primitive needed; `Section` + `NumberedHeading` + `Tag` + `ExternalLink` + `ArchitectureDiagram` cover it. The four slugs are locked by ROADMAP.md Phase 2 SC#2: `sf-date-night-concierge`, `gtm-research-pipeline`, `voice-intent-eval`, `daily-weather-pipeline`.
- **D-Proj-02: Voice Intent Eval gets the project-side architecture diagram (DIAG-02).** Satisfies PROJ-04. The other 3 project detail pages ship without diagrams in Phase 2. Total diagrams in Phase 2: 2 (1 Asurion / DIAG-01 + 1 Voice Intent Eval / DIAG-02).
- **D-Proj-03: Whole project card is a single `<Link>` to `/projects/[slug]`.** Detail page has a `← home` link at the top (Geist Mono, ink-muted). The external GitHub link inside the card uses `stopPropagation` (or sits outside the card-link region) so clicking GitHub doesn't navigate to the detail page.
- **D-Proj-04: Detail page reuses the same `MetricCallout` from the card at a larger scale.** Single primary metric per project; visual continuity card → detail.

### Project Card Metric Callout (SEC-05)

- **D-Metric-01: Big-number poster.** Geist Mono, ~text-3xl on mobile / text-4xl on desktop, `--color-ink`; label sits beneath in `--color-ink-muted` Geist Mono caption. New primitive `MetricCallout` introduced this phase (or composed inline if it's used only on the card + detail page — implementation can decide).
- **D-Metric-02: Card layout (top → bottom):** Title → plain-English subtitle → `MetricCallout` → description → tech chips → GitHub `<ExternalLink>`. Whole card is the `<Link>` (D-Proj-03).
- **D-Metric-03: Primary metric per project (verbatim from May-2026 resume — final string confirmed during execution against `.planning/refs/RESUME-2026-05.md`):**
  - **SF Date Night Concierge** → `5,800+` / `place embeddings (pgvector + HNSW)`
  - **GTM Research Pipeline** → `Cohen's κ` / `LLM-as-judge eval, self-preference bias`
  - **Voice Intent Eval** → `100%` / `intent accuracy / 80 scenarios`
  - **Daily Weather Pipeline** → retraining-cadence metric from resume / `Airflow → BigQuery ML`

  *(Format is locked; exact strings get final-confirmed once the resume file is at `.planning/refs/`.)*

### Architecture Diagram Tool + Style (DIAG-01..04)

- **D-Diag-01: Both diagrams authored in Excalidraw.** Free, in-browser, exports SVG. Sketchy/hand-drawn aesthetic — pairs with the engineering-artifact tone the brief asks for. Files land in `public/diagrams/` as SVGs (e.g., `public/diagrams/asurion-rag-pipeline.svg`, `public/diagrams/voice-intent-eval-flow.svg`). The Phase 1 `ArchitectureDiagram` primitive renders both unchanged (D-08 from Phase 1).
- **D-Diag-02: Strict monochrome.** `--color-ink` for primary strokes/labels, `--color-ink-muted` for secondary labels and de-emphasized strokes. No accent colors. The Excalidraw SVG export is manually edited (or styled via inline `<svg>` content with CSS-variable strokes) to honor these two CSS variables only — diagrams must respond to the site's mono palette, not Excalidraw's defaults.
- **D-Diag-03 (revised per D-Asurion-04 tightening): Asurion diagram (DIAG-01) depicts the canonical RAG pipeline:** `Ingestion → Embed → Hybrid Retrieve → Rerank → LLM → Eval loop`. 6–7 nodes max. **Box labels: generic role names only** (`Retriever`, `Reranker`, `Vector Store`, `LLM`, `Eval`, `Ingestion`) — no public-tech names, no internal product names. No screenshots.
- **D-Diag-04: Voice Intent Eval diagram (DIAG-02) depicts the end-to-end flow:** `TTS → ASR → two-stage Claude → dual-judge benchmarking + CI`. 5–6 nodes. Mirrors the resume's project description. Public-tech names allowed here (this is *not* the Asurion diagram, so D-Asurion-04's stricter rule does not apply).

### /uses Page Scope (USES-01..03)

- **D-Uses-01: AI-specific core only.** Five categories: **Models · MCP Servers · Eval Stack · Agent Framework · Dev Workflow**. ~3–6 items per category. No editor / terminal / shell / hardware / fonts. Honors USES-02's "not a generic dev /uses" framing strictly.
- **D-Uses-02: Each `/uses` item is bold name + one-line "why I picked it" caption.** ~5–10 lines per category. The `/uses` page itself is structured as 5 numbered `Section`s (like the home page) — `01. Models`, `02. MCP Servers`, etc. — reusing Phase 1 primitives.
- **D-Uses-03: A new `<SiteFooter>` primitive ships in Phase 2 and composes into `app/layout.tsx`** so home + every `/projects/[slug]` + `/uses` share it. Single-line footer: `© 2026 James Nhek · /uses · github · linkedin` in Geist Mono ink-muted. Satisfies USES-03 and gives consistent navigation across the site.
- **D-Uses-04: Claude proposes initial `/uses` content during Phase 2 execution** based on `RESUME-2026-05.md` (LangGraph, MLflow, pgvector, etc.) + stack signals from project `CLAUDE.md` (Claude Opus 4.7, Context7 / Firecrawl / Exa MCP servers). James edits to lock final list.

### Claude's Discretion

Decisions deliberately *not* asked of the user because they follow Phase 1 + industry-standard patterns or are dictated by locked requirements:

- Concrete file paths for `content/site.ts`, `content/experience.ts`, `content/projects.ts`, `content/uses.ts`, `lib/content.ts`, `types/content.ts` (resolved by CONT-01..06 — names locked; nesting under `src/` follows Phase 1 convention).
- Exact field shape of the `Project`, `Role`, `UsesItem`, `SiteConfig` TypeScript interfaces — must be strict-mode-safe and satisfy `noUncheckedIndexedAccess`, but the field set is implementation's call beyond what CONT-04 lists (title, slug, subtitle, metric, tech stack, GitHub URL, detailed description).
- Whether `MetricCallout` is a standalone primitive under `src/components/primitives/` or an inline composition. If used in ≥2 places (card + detail page per D-Proj-04), default to primitive.
- Card hover treatment — subtle ink-muted → ink transition on title; no background fills. `focus-visible:` outline mandatory per Phase 1 D-04 pattern.
- `copy-email` button UX — `navigator.clipboard.writeText` + a "Copied!" pill or aria-live announcement; lives in `src/components/interactive/CopyEmail.tsx` (the only `"use client"` file per SEC-07).
- `mailto:` and `https://github.com/...` and `https://linkedin.com/in/...` URLs use the existing `ExternalLink` primitive — its safe-protocol allowlist already covers `mailto:` per Phase 1 D-08 (verified in code).
- Anchor-hash-update behavior for `#about #experience #projects #contact` clicks (SEC-08) — native browser behavior is sufficient; no JS scroll handler needed.
- Numbered section count update: home goes from 5 sections (`01. About` ... `05. Contact`) to keep the same 5; `/uses` is a separate route with its own `01. Models` ... `05. Dev Workflow` numbering.

### Folded Todos

(None — `gsd-sdk query todo.match-phase 2` returned zero matches.)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project context
- `.planning/PROJECT.md` — what we're building, 60-second-mobile audience, locked Key Decisions, Out-of-Scope hard contract.
- `.planning/REQUIREMENTS.md` §"Content & Data" (CONT-01..08), §"Page Sections (Home Route)" (SEC-01..08), §"Project Detail Pages" (PROJ-01..05), §"/uses Page" (USES-01..03), §"Architecture Diagrams (Sanitized)" (DIAG-01..04) — the 28 requirement rows in scope for Phase 2.
- `.planning/ROADMAP.md` §"Phase 2: Content & Sections (with Confidentiality Gate)" — 5 numbered success criteria the plan must satisfy.
- `.planning/STATE.md` §"Key Decisions Locked" — stack + hosting + content-source-of-truth decisions inherited from Phase 1.
- `CLAUDE.md` §"Technology Stack" / §"Recommended Stack" — package versions, anti-patterns, Vercel Hobby gotchas. Treat as authoritative installation reference (no MDX, no motion lib, no UI kits in v1).

### Confidentiality contract (Phase 2 hard merge gate)
- **`.planning/refs/RESUME-2026-05.md` — TO BE ADDED BY JAMES BEFORE PHASE 2 EXECUTION.** Canonical source-of-truth for every Asurion-touching sentence and number. Every Asurion bullet on the site must trace to this file (D-Asurion-01, D-Asurion-03). Gate-blocking — `/gsd:plan-phase 2` should warn if this file is missing.
- `.planning/phases/02-content-sections-with-confidentiality-gate/CONFIDENTIALITY-REVIEW.md` — PRODUCED DURING PHASE 2. Sign-off log for the 3-item checklist (D-Review-03). Hard gate before phase verifier (D-Review-04).
- `.planning/research/PITFALLS.md` §"Pitfall 2: Asurion confidentiality leak" — origin story for the gate; reinforces "no internal product names ever" / "diagrams drawn fresh."
- `.planning/research/PITFALLS.md` §"Pitfall 1: Vague 'passionate about AI' copy" — origin story for D-Asurion-03 ("every Asurion sentence cites a number").

### Phase 1 inheritance (already-locked decisions, don't re-decide)
- `.planning/phases/01-foundation-slice/01-CONTEXT.md` — Phase 1 decisions D-01..D-08. Critical for Phase 2:
  - **D-05/D-06**: Geist Mono for numbered anchors / metric callouts / tech chips / mono-coded values.
  - **D-07**: Section IA + anchors (`#about #experience #projects #contact`) — Phase 2 must plug into these slugs unchanged.
  - **D-08**: `ArchitectureDiagram` primitive contract — `{ src, alt, caption? }`, SVG branch via passthrough `<img>`, raster via `next/image`, required `alt`. Phase 2 diagrams flow through this primitive unchanged.
- `src/components/primitives/` (all 5 files) — actual code of the primitives Phase 2 composes:
  - `Section.tsx` — `<section id="" />` wrapper with vertical rhythm + content column.
  - `NumberedHeading.tsx` — `01.` Geist Mono prefix + Geist Sans title pattern.
  - `Tag.tsx` — tech chip with 1px rule border.
  - `ExternalLink.tsx` — safe-protocol allowlist + `↗` glyph + `focus-visible:` outline.
  - `ArchitectureDiagram.tsx` — SVG/raster branch, required alt, `aspect-[16/9]` reservation.
- `src/app/page.tsx` — current Phase 1 home shell. Phase 2 swaps the "Coming soon" placeholders for real content into the **same component tree**.
- `src/app/layout.tsx` — `metadataBase` + default `<title>` / `description` already set; Phase 2 does NOT touch SEO (that's Phase 3).
- `src/app/globals.css` — `@theme` tokens (`--color-ink`, `--color-ink-muted`, `--color-paper`, `--color-rule`, `--text-*`, `--leading-*`, font tokens). All Phase 2 styling must use these tokens via the `text-[length:var(--*)]` / `text-[color:var(--*)]` arbitrary-value idiom (Phase 1 D-06 pattern).
- `src/lib/env.ts` — zod-validated env. Phase 2 does NOT add new env vars (no Resend, no analytics in v1).

### Research synthesis (still load-bearing)
- `.planning/research/FEATURES.md` — table-stakes vs differentiators vs anti-features. Critical for project-card and About-section authoring.
- `.planning/research/PITFALLS.md` — Pitfalls 1 and 2 (vague copy + Asurion leak) are the two pitfalls Phase 2 directly addresses.
- `.planning/research/ARCHITECTURE.md` — Server-Component-by-default file layout; `"use client"` only in `components/interactive/CopyEmail.tsx`.

### Reference resources (read on-demand, not eagerly)
- [huyml.co](https://huyml.co/?ref=godly) — visual reference for numbered-section monochrome layout. Tone check, not pixel-for-pixel.
- Excalidraw (https://excalidraw.com) — tool for authoring DIAG-01 / DIAG-02 SVGs.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets (from Phase 1 — verified by reading the actual files)
- **`Section` (`src/components/primitives/Section.tsx`)** — `<section id="…" className="py-16 md:py-24">` with a `mx-auto max-w-2xl px-6 md:px-12` content column. Phase 2 wraps every home-route section (About, Experience, Projects, Contact) and every `/uses` section in this primitive. **Do not** introduce a parallel "section" component.
- **`NumberedHeading` (`src/components/primitives/NumberedHeading.tsx`)** — emits `01.` Mono prefix + Sans title. Defaults to `<h2>`. Phase 2's hero stays inline with its own `<h1>` (the only `<h1>` on the home route — Phase 1 D-07 / Hero placement locked).
- **`Tag` (`src/components/primitives/Tag.tsx`)** — 1px-rule chip with `--color-rule` border + Geist Mono caption text. Used by Asurion bullet stacks and every project card's tech-chip row (D-Exp-03, D-Metric-02).
- **`ExternalLink` (`src/components/primitives/ExternalLink.tsx`)** — already enforces `target="_blank" rel="noopener noreferrer"` + safe-protocol allowlist (`https://`, `http://`, `mailto:`). Used by every project GitHub link, the Contact section's mailto + LinkedIn + GitHub links, and the `<SiteFooter>` (D-Uses-03). **No changes needed** — Phase 1 already shipped the `mailto:` allowlist.
- **`ArchitectureDiagram` (`src/components/primitives/ArchitectureDiagram.tsx`)** — `{ src, alt, caption? }`. SVG branch uses passthrough `<img>` inside `aspect-[16/9]` border container. Phase 2 wires DIAG-01 (Asurion) into the About section's diagram slot and DIAG-02 (Voice Intent Eval) into its detail page.
- **`src/lib/env.ts` zod schema** — `NEXT_PUBLIC_SITE_URL` lives here with a `.default("https://pjnhek.com")`. Phase 2 reads via `env.NEXT_PUBLIC_SITE_URL`; does not add new vars.
- **`@theme` tokens in `src/app/globals.css`** — `--color-ink`, `--color-ink-muted`, `--color-paper`, `--color-rule`, full `--text-*` clamp scale, `--leading-*` scale, font tokens. Every Phase 2 className must read these via the arbitrary-value idiom (`text-[length:var(--text-body)]`, `text-[color:var(--color-ink)]`). The `@source not "../../.planning";` exclusion in globals.css means Tailwind won't choke on class specimens in CONTEXT.md (RESEARCH.md line 1013).

### Established Patterns (from Phase 1 — must propagate into Phase 2)
- **Server Components by default.** `"use client"` directive appears in exactly **one** file in Phase 2: `src/components/interactive/CopyEmail.tsx` (SEC-07). Everywhere else, no `"use client"`.
- **Tailwind v4 arbitrary-value idiom for design tokens:** `text-[length:var(--text-body)]`, `text-[color:var(--color-ink)]`, `leading-[var(--leading-body)]`. Never inline literal hex or px values — always reference the `@theme` token.
- **Typed TS content modules** under `src/content/` (NOT MDX). Phase 1 declared this convention; Phase 2 *creates* this directory and its files (CONT-01..06).
- **Numbered sections via primitive, not hardcoded strings.** `<Section number="02" title="Experience" id="experience">` — never `"02. Experience"` in JSX.
- **Required `alt` on diagrams.** TypeScript enforces it on `ArchitectureDiagram`; the confidentiality+accessibility contract (DIAG-03, POL-06) depends on it.
- **`focus-visible:` outline on every interactive element.** Phase 1 D-08 / Phase 1 ExternalLink set the precedent — Phase 2's project-card `<Link>` and CopyEmail button must match.

### Integration Points (where Phase 2 plugs into Phase 1)
- **`src/app/page.tsx`** — replace "Coming soon" placeholders with real content. Five sections stay (`01. About`, `02. Experience`, `03. Featured Projects`, `04. Uses`, `05. Contact`). **Wait —** USES-03 requires `/uses` to be a separate route reachable from the footer, so the home `04. Uses` section needs to either (a) become a teaser+link, or (b) be removed in favor of footer-only navigation to `/uses`. **Planner decision needed** — flagged below in `<deferred>` as a sub-question for plan-phase, not a gray-area we hash out here. Default-recommend (b): drop the `04. Uses` home-page section; renumber Contact from `05.` to `04.`; let the footer be the canonical `/uses` entry point. *(The hero is unaffected — `<h1>` stays at the top.)*
- **`src/app/layout.tsx`** — Phase 2 composes the new `<SiteFooter>` primitive into `<body>` after `{children}`. Does NOT touch the existing `<Metadata>` (Phase 3 owns SEO).
- **`src/content/` (new directory)** — `content/site.ts`, `content/experience.ts`, `content/projects.ts`, `content/uses.ts` per CONT-01..05. `src/lib/content.ts` exposes `getAllProjects()` / `getProject(slug)` per CONT-06.
- **`src/types/content.ts` (new)** — `Project`, `Role`, `UsesItem`, `SiteConfig` interfaces per CONT-01.
- **`src/app/projects/[slug]/page.tsx` (new)** — `generateStaticParams` derives from `content/projects.ts` (PROJ-02). `generateMetadata` per PROJ-05.
- **`src/app/uses/page.tsx` (new)** — composes 5 numbered Sections from `content/uses.ts` (USES-01).
- **`public/diagrams/` (existing — currently contains only `_placeholder.svg`)** — adds `asurion-rag-pipeline.svg` (DIAG-01) and `voice-intent-eval-flow.svg` (DIAG-02). The placeholder used in `01-CONTEXT.md` D-08 stays for now until a Phase 3 cleanup or until the About diagram displaces it.
- **`src/components/interactive/CopyEmail.tsx` (new)** — the **only** `"use client"` file added in Phase 2 (SEC-07 enforces this). Used inside the Contact section.

</code_context>

<specifics>
## Specific Ideas

- **Voice reference for About section** — user picked "conversational, like talking to a friend" over the safer "warm-but-precise" option. When Claude drafts in execution, lean *into* the friend-tone: contractions OK, parenthetical asides OK, no buzzwords. The "weekend project test" from PITFALLS.md Pitfall 1 still applies — every sentence must carry signal.
- **Diagram strictness asymmetry** — Asurion diagram (DIAG-01) is governed by stricter rules than Asurion *copy*: generic role labels only on the diagram, but copy can name public-tech the resume already discloses. User's rationale: diagrams get screenshotted and shared out of context more readily than prose. Honor this difference at review time.
- **Resume file path is the canonical-ref linchpin.** Phase 2's confidentiality gate (D-Review-03 item #1) literally cannot pass without `.planning/refs/RESUME-2026-05.md`. `/gsd:plan-phase 2` should treat the absence of this file as a planning blocker and prompt James to deposit it.
- **MetricCallout new primitive likely.** Used on every project card + every project detail page (8+ usages across the site). Default to a new primitive at `src/components/primitives/MetricCallout.tsx` unless implementation finds a reason to inline.
- **`<SiteFooter>` is a new primitive** (D-Uses-03). Single-line, Geist Mono, ink-muted, composes `ExternalLink` for github/linkedin and a `<Link>` for `/uses`. Lives in `src/components/primitives/SiteFooter.tsx`. Composed once into `app/layout.tsx`.
- **Drop home-page `04. Uses` section in favor of footer link.** Strong default; planner can revisit if there's a strong recruiter reason to keep a teaser on home.

</specifics>

<deferred>
## Deferred Ideas

### Outside Phase 2 scope (belongs in other phases or v2)

- **Per-project case-study expansion (POST-02 in REQUIREMENTS.md ## v2).** Phase 2 ships tight 300–500-word detail pages; richer case studies for top 1–2 projects are deferred to v1.x.
- **GitHub stars / "last updated" on project cards (POST-05).** v2 — risk that low-star repos look weak.
- **View Source easter egg (POST-03).** v2 — cheap memorability moment; not blocking launch.
- **Dynamic per-project OG images (POST-04).** v2 + Phase 3 ownership of OG image factory (SEO-04).
- **Resend Server Action contact form (POST-01).** v2. Phase 2 contact is `mailto:` + `CopyEmail` + LinkedIn + GitHub.
- **`/chat` RAG demo (DEMO-01..05).** v2 entirely.
- **Subjective "LinkedIn tomorrow" confidentiality check.** Considered for the review checklist; rejected in D-Review-03 to keep the rubric objective. If a paragraph passes the 3-item rubric but James still gets a gut-no, individual judgment can override at write-time (not review-time) — i.e., don't ship the bullet, no checklist needed.
- **Second human reviewer for confidentiality.** Considered; rejected in D-Review-01 in favor of self-review with a written checklist to keep the phase shippable. Can be re-introduced later if scope expands or stakes rise.
- **`james@pjnhek.com` email forwarding decision (already flagged in STATE.md as open todo).** Touches Phase 4 DNS work. **NOT a Phase 2 blocker** — Phase 2 contact uses James's existing Gmail (`nhekvirakyuth@gmail.com` per user-private memory) or whatever email the user wants on the Contact section. The `mailto:` link's target email is a sub-decision for plan-phase / execution, not discuss-phase.

### Sub-decisions surfaced during discussion, but better resolved during /gsd:plan-phase 2

- **Whether to keep `04. Uses` as a home-page teaser-section or drop it entirely** (see `<code_context> ## Integration Points`). Default-recommendation: drop it; let the footer be the canonical /uses entry point. Planner can revisit if a teaser improves recruiter scan-time.
- **Exact target email for the home Contact section's `mailto:`** — `nhekvirakyuth@gmail.com` vs a future `james@pjnhek.com` forwarder. Plan-phase resolves.

### Reviewed Todos (not folded)

(None — `gsd-sdk query todo.match-phase 2` returned zero matches; no todo triage needed.)

</deferred>

---

*Phase: 2-Content & Sections (with Confidentiality Gate)*
*Context gathered: 2026-05-21*
