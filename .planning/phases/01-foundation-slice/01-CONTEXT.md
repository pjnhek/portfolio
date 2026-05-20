# Phase 1: Foundation Slice - Context

**Gathered:** 2026-05-20
**Status:** Ready for planning

<domain>
## Phase Boundary

A live Vercel preview URL renders a typographically-correct shell of pjnhek.com — proving the **Next.js 16 + Tailwind v4 + TypeScript strict + Geist + Vercel** toolchain works end-to-end **before any real content is written**. The 5 design-system primitives (`Section`, `NumberedHeading`, `Tag`, `ExternalLink`, `ArchitectureDiagram`) exist and render. `pnpm install && pnpm dev` works locally; every PR to `main` produces a preview deploy whose tab title contains "James Nhek." No real content (Hero copy, About story, project cards, diagrams, /uses, contact) — that's Phase 2.

**In scope** (15 requirements): FOUND-01 .. FOUND-13, DEP-01, DEP-02.

**Out of scope for this phase** (deferred to Phase 2+):
- Real Hero / About / Experience / Projects / Contact content
- Any architecture diagrams (just the primitive that will render them)
- `/uses` content
- SEO metadata factory (`lib/seo.ts`), `sitemap.ts`, `robots.ts`, OG image route — Phase 3
- Custom domain `pjnhek.com` DNS cutover, HTTPS verification, legacy redirect — Phase 4

</domain>

<decisions>
## Implementation Decisions

### Repo & Hosting
- **D-01: GitHub repo is `pjnhek/portfolio`, public.** Recruiter "View Source" lands in the repo — the source is part of the portfolio. Satisfies DEP-01. Affects DEP-10 (Phase 4) where this repo becomes one of the curated pinned repos.
- **D-02: Vercel project linked to `pjnhek/portfolio` with preview deploys on every PR.** Satisfies DEP-02. Production deploy stays on a Vercel `*.vercel.app` subdomain for this phase — `pjnhek.com` cutover is Phase 4.

### Visual System — Palette
- **D-03: Softened near-black on near-white mono palette.** Anchor on background ~`#fafafa` and ink ~`#0a0a0a` as starting tokens; final hex tuned during implementation but must hit **≥ 4.5:1 contrast for body text** (FOUND-05). **Do not** use pure `#000`/`#fff` (too harsh) or warm/paper tints (drifts from engineering-artifact tone). One mode only — no dark/light toggle.
- **D-04: Secondary muted ink token required** for de-emphasized text (numbered anchors, captions, meta). Stays within mono palette — a low-contrast tint of the ink (e.g. ~`#737373` or a CSS `color-mix()` of ink + bg), still passing 4.5:1 for body where used, may drop to 3:1 only on non-text adornments.

### Visual System — Typography
- **D-05: Roomy type scale.** Body floor ~17px scaling up via `clamp()` (FOUND-06). Line-height ~1.6 on body, tighter (~1.2) on display. Geist Sans for prose, Geist Mono for numbered anchors, tech chips, metric callouts, and code-like elements. Verified at 375 / 768 / 1280 — no horizontal scroll, no clipped headings.
- **D-06: Numbered section anchors render as `01.` `02.` in Geist Mono, in the muted ink color** from D-04. Implemented by the `NumberedHeading` primitive (FOUND-07, FOUND-08). Sections use this primitive directly; no parallel "section header" component.

### Phase 1 Shell Content
- **D-07: The preview URL renders labeled skeleton sections matching the Phase 2 information architecture.** Headings only: `01. About`, `02. Experience`, `03. Featured Projects`, `04. Uses`, `05. Contact`, with a single short placeholder paragraph beneath each ("Coming soon — pivot story." / "Coming soon — Asurion + prior roles." / etc.). A hero placeholder at the top: name "James Nhek," role "AI Engineer @ Asurion," one-line specialization, "open to AI Engineer roles." This shell is intentionally honest about being a shell; Phase 2 swaps the placeholders for real content into the **same component tree**. No lorem ipsum.

### Design System — ArchitectureDiagram Primitive
- **D-08: `ArchitectureDiagram` accepts `{ src: string; alt: string; caption?: string }` and renders `<figure>` → image/inline-svg → `<figcaption>`.** Renders responsively at full container width; preserves intrinsic aspect ratio; uses `next/image` for raster sources and a passthrough `<img src>` (or inline SVG support) for SVG sources placed under `public/diagrams/`. `alt` is required, not optional — Phase 2 confidentiality + accessibility (DIAG-03, POL-06) depend on it. In Phase 1 the primitive is demoed with a placeholder SVG (e.g. a stub box-and-arrow diagram in `public/diagrams/_placeholder.svg`) so the primitive is actually exercised, not just declared.

### Claude's Discretion
The following implementation details are left to planning / execution — they did not require user input and follow industry-standard practice or are dictated by locked requirements:

- Exact Tailwind v4 `@theme` token names (e.g. `--color-ink`, `--color-paper`, `--color-ink-muted`, `--font-sans`, `--font-mono`, `--space-*`, `--text-*`).
- Exact `clamp()` formulas per text size step.
- Directory layout (`src/app`, `src/components`, `src/components/primitives`, `src/lib`, `src/types`).
- ESLint flat-config shape (`eslint.config.mjs` with `eslint-config-next` + `eslint-config-next/typescript` + `eslint-config-prettier` last).
- Prettier config and `prettier-plugin-tailwindcss` setup.
- Specific zod schema for `lib/env.ts` (must include `NEXT_PUBLIC_SITE_URL`; other vars TBD).
- `next.config.ts` content beyond "no `output: 'export'`" (FOUND-12).
- Pre-commit hooks — optional, fine to skip for v1 per CLAUDE.md stack guidance.
- Whether the design-system primitives ship a small in-repo demo route (e.g. `/_dev/primitives`) or are only exercised via the home shell. Default: only via the home shell unless planning surfaces a need.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project context
- `.planning/PROJECT.md` — what we're building, audience (recruiters, 60-second mobile read), core value, locked Key Decisions, Out-of-Scope hard contract.
- `.planning/REQUIREMENTS.md` §"Foundations & Design System" (FOUND-01..13) and §"Deploy & Domain" rows for DEP-01, DEP-02 — full requirement text and acceptance.
- `.planning/ROADMAP.md` §"Phase 1: Foundation Slice" — 4 numbered success criteria that the plan must satisfy.
- `.planning/STATE.md` §"Key Decisions Locked" — stack + hosting + content-source-of-truth decisions inherited into this phase.
- `CLAUDE.md` §"Technology Stack" / §"Recommended Stack" / §"What NOT to Use" — exact package versions, install commands, anti-patterns, version compatibility, Vercel Hobby gotchas. Treat as the authoritative installation reference.

### Research synthesis
- `.planning/research/SUMMARY.md` — executive summary + Day-1 packages list + packages to deliberately NOT install.
- `.planning/research/STACK.md` — full stack recommendation matrix and version pins.
- `.planning/research/ARCHITECTURE.md` — file layout and Server-Component-by-default architecture.
- `.planning/research/PITFALLS.md` — hazards to design against (LinkedIn OG, Vercel caps, `output: 'export'` trap, scope creep).
- `.planning/research/FEATURES.md` — must-have / should-have / defer breakdown.

### Phase scope contract
- This file (`.planning/phases/01-foundation-slice/01-CONTEXT.md`) — implementation decisions locked above (D-01..D-08).

No external ADRs or third-party specs beyond the above — this is a greenfield phase whose contract is fully captured in `.planning/`.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **None.** Greenfield repository. Only `CLAUDE.md` and `.planning/` exist. No prior code, configs, or design tokens to reuse or migrate from.

### Established Patterns
- **Stack patterns are locked at the project level**, not yet expressed in code:
  - **Server Components by default** — `"use client"` reserved for true islands. In Phase 1 the shell is fully server-rendered; no `"use client"` should appear.
  - **CSS-first Tailwind v4** — design tokens live in `globals.css` under `@theme`; no `tailwind.config.js`.
  - **Typed TS content modules** (not MDX) — established for Phase 2; Phase 1 doesn't author content but the directory (`content/`) and types (`types/`) seeded by FOUND-08 / future CONT-01 should not conflict with this.
  - **Numbered sections** — `01.` `02.` style enforced via `NumberedHeading` primitive; sections never hard-code the number-prefix string.

### Integration Points
- Phase 1 establishes **the shell into which Phase 2 plugs real content**. Specifically:
  - Section skeletons in `app/page.tsx` should be ordered + slugged (`#about`, `#experience`, `#projects`, `#contact`) so Phase 2 (SEC-08) inherits the anchor wiring without re-architecting.
  - `app/layout.tsx` `metadataBase`, default `title`, and default `description` set in this phase (FOUND-09) become the inheritance point for Phase 3's `lib/seo.ts` factory.
  - `lib/env.ts` zod schema seeded here (FOUND-10) is the place Phase 4 adds `NEXT_PUBLIC_SITE_URL=https://pjnhek.com`.
  - `ArchitectureDiagram` primitive shape (D-08) is the contract Phase 2's DIAG-01 / DIAG-02 must conform to.

</code_context>

<specifics>
## Specific Ideas

- **Visual reference:** [huyml.co](https://huyml.co/?ref=godly) (per `PROJECT.md ## Constraints`). "Like huyml but more minimal" — typography-led, monochrome, generous whitespace, numbered sections. Use as a tone check, **not** a pixel-for-pixel copy.
- **Tone constraint:** "engineering artifact, not designer's playground" (`PROJECT.md ## Constraints`). Resolves ambiguity in any visual-treatment tie-break — favor the more restrained option.
- **Audience-first arbiter:** "what makes a recruiter trust and remember James in 60 seconds" (`PROJECT.md ## Constraints`). Whenever a Phase 1 decision feels close, pick the option that maximizes scan-and-trust on a phone at 375px viewport.
- **Phase 1 is fully greenfield** — no migration, no legacy code, no backward compatibility. First commit creates the scaffold.

</specifics>

<deferred>
## Deferred Ideas

Nothing new surfaced during discussion that wasn't already captured in `PROJECT.md ## Out of Scope` or `REQUIREMENTS.md ## v2`. Existing deferrals (light/dark toggle, MDX, motion library, analytics, blog, RAG demo, contact form backend) remain Out of Scope per the original contract — no in-discussion attempts to expand v1 scope occurred.

Open project-level todos from `STATE.md` that are **not** in Phase 1 but worth keeping visible:
- "Decide whether `james@pjnhek.com` email forwarding is in scope" — addressed in Phase 4 (already flagged as `Needs research:` on Phase 4 in ROADMAP.md). No action this phase.

</deferred>

---

*Phase: 1-Foundation Slice*
*Context gathered: 2026-05-20*
