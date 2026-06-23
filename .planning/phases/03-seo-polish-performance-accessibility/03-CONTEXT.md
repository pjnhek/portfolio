# Phase 3: SEO, Polish, Performance & Accessibility - Context

**Gathered:** 2026-06-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Make pjnhek.com **shareable, fast, accessible, and instantly legible** — without adding any new content or pages. Specifically:
- **SEO/share:** a `lib/seo.ts` `buildMetadata({ title, description, path })` factory used by every route; explicit `generateMetadata`/metadata (title + description + OG + Twitter) on `/`, `/uses`, `/projects/[slug]`; `app/opengraph-image.tsx` (1200×630 PNG); `app/sitemap.ts` (derived from `content/projects.ts`); `app/robots.ts`.
- **Polish:** `app/not-found.tsx` (styled 404), `app/icon.tsx` + `app/apple-icon.tsx`, `next/image` `priority`/`fetchPriority` on above-the-fold assets.
- **Performance:** home-route JS < 100 KB gzipped; Lighthouse mobile Performance ≥ 95.
- **Accessibility:** Lighthouse a11y = 100; axe zero-issue on home / a project detail / /uses; visible `focus-visible:` outlines; full keyboard nav (no mouse traps).
- **Legibility:** 60-second cold-read passes ("what does James do?" / "how do I contact him?").

**Out of scope (other phases):** new content/sections, additional pages, live demos (v2); the **production domain cutover, DNS/HTTPS, legacy decommission, and final production verification on pjnhek.com** all belong to Phase 4.

</domain>

<decisions>
## Implementation Decisions

### OG Card (SEO-04)
- **D-OG-01: Static, generated at build time.** No runtime/`@vercel/og` per-request generation — author one fixed 1200×630 PNG (or a build-time `ImageResponse` that emits a fixed asset). Zero runtime Function/Active-CPU cost (CLAUDE.md Vercel-Hobby caution), cache-forever, can't break in prod. Matches SEO-04's "static" wording.
- **D-OG-02: One site-wide identity card** for every shared link (home, /uses, and every /projects/[slug] all share it). No per-route or per-project cards in v1 — simplest, always-correct, consistent identity in every DM. (Per-project cards explicitly deferred — see Deferred Ideas.)
- **D-OG-03: Content = name + role + domain**, mirroring the hero copy: `James Nhek` / `AI Engineer @ Asurion` / `RAG · evaluations · agentic workflows`, with a small `pjnhek.com` footer mark.
- **D-OG-04: Visual = left-aligned type stack on off-white**, strict monochrome, Geist (display weight for the name, lighter ink for role/domain), generous margin. Deliberately mirrors the actual hero so the card reads as "the same hand-built site" the instant it appears in a feed. Rejected centered-poster (less site-continuity) and inverted ink-background (wouldn't match the light page a click later).

### Favicon / App Icon (POL-02)
- **D-ICON-01: 'JN' monogram in Geist, ink on off-white**, code-rendered via `app/icon.tsx` + `app/apple-icon.tsx` (`ImageResponse`) so it shares the site's exact type + palette. Legible at 16px in a tab, clean on an iOS home screen. Rejected single-'J' (less identifying) and inverted ink-background (diverges from the light site).

### 404 Page (POL-01)
- **D-404-01: Minimal + one line of voice.** Big `404`, a single conversational human line (working copy: "This page wandered off. Here's the way back."), and a clear `← Back to home` link. On-brand with the About voice (D-About-02 from Phase 2) without being cute or wasting a recruiter's time. Rejected purely-utilitarian (misses the craft signal) and playful/clever (risks try-hard on a phone). Final copy is Claude-drafted, James-confirms.

### Verification Strategy (SEO-07/08/09, POL-05/06/07/08/09/10)
- **D-VERIFY-01: Run manual + production-style checks on the PREVIEW URL now; Phase 4 re-runs the same checks against pjnhek.com as the final prod gate.** In Phase 3, verify OG rendering via LinkedIn Post Inspector / opengraph.xyz / a real Slack/iMessage DM, plus Lighthouse-mobile and a real-iPhone @375px pass — all against the Vercel **preview** URL. This catches render/OG/SSL/redirect-class bugs early. Aligns with ROADMAP SC#5's own note that production verification re-runs in Phase 4 (preview ≠ prod).
- **D-VERIFY-02: Human-only checks become blocking human-verify checkpoints that James runs.** Claude does everything automatable (Lighthouse via CLI/Network-tab bundle check, axe, keyboard-nav walkthrough, build output) and hands James a concrete checklist — exact URLs to paste, what to look for — for the human-only items (real iPhone @375px = POL-09; LinkedIn Inspector login = SEO-07; the 60-second non-technical cold-read = POL-10). Phase closes when James confirms the checkpoints. POL-10's cold-read may be James's own read for v1 (a non-technical reader is higher-signal but a real-world dependency — not required to close the phase).

### Claude's Discretion
- The `buildMetadata` factory signature/internals, sitemap/robots implementation, the exact `next/image` `priority`/`fetchPriority` wiring, the focus-ring CSS, and the bundle-budget measurement method are all implementation details for research + planning to decide.
- Exact 404 copy and exact OG/icon type sizes/margins are Claude-drafted within the locked direction (James confirms 404 copy).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase scope & requirements
- `.planning/ROADMAP.md` §"Phase 3: SEO, Polish, Performance & Accessibility" — goal + 5 success criteria (note SC#5: prod verification re-runs in Phase 4).
- `.planning/REQUIREMENTS.md` — SEO-01…09 and POL-01…10 full descriptions (checklist form).

### Design system & carried-forward decisions
- `.planning/phases/02-content-sections-with-confidentiality-gate/02-CONTEXT.md` — Phase 2 locked decisions: monochrome aesthetic, Geist, conversational-but-precise About voice (D-About-02), confidentiality discipline (D-Asurion-*). The OG card / icon / 404 must honor the same palette + voice.
- `.planning/PROJECT.md` — core value, aesthetic ("huyml.co but more minimal"), constraints (free Vercel hosting, monochrome).

### Existing code the phase refactors/extends
- `src/app/layout.tsx` — current root `export const metadata` (`metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL)`, title `"James Nhek — AI Engineer"`). SEO-01/02 refactor this through `lib/seo.ts`.
- `src/app/uses/page.tsx` — inline `metadata` (title + description only; comment explicitly defers `openGraph`/`twitter` to "Phase 3 / SEO-01..04").
- `src/app/projects/[slug]/page.tsx` — `generateMetadata` (title + description only; same Phase-3 deferral comment).
- `src/content/site.ts` — `site.name/tagline/baseUrl` (`baseUrl: env.NEXT_PUBLIC_SITE_URL`) — the source for OG/metadata copy.
- `src/lib/env.ts` — `NEXT_PUBLIC_SITE_URL` (zod-validated) — base URL for sitemap/robots/OG `metadataBase`.
- `src/components/primitives/ArchitectureDiagram.tsx` — the ONLY current `next/image` user; reference for POL-03 patterns.

### Resume source-of-truth (for any OG/metadata copy that states a claim)
- `.planning/refs/RESUME-2026-05.md` — only relevant if OG/metadata copy ever asserts an Asurion fact; the chosen card content (name/role/domain) is identity, not a quantitative claim, so the confidentiality gate is not re-triggered. Noted for completeness.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/content/site.ts` (`site.name`, `site.tagline`, `site.baseUrl`): single source for OG card text, metadata defaults, and sitemap base URL — no new content module needed.
- `src/lib/env.ts` `NEXT_PUBLIC_SITE_URL`: already the `metadataBase`; reuse for sitemap/robots absolute URLs and OG `metadataBase`.
- `src/content/projects.ts`: the slug list that `app/sitemap.ts` must derive from (SEO-05) — same source `generateStaticParams` already uses.
- Geist Sans + Geist Mono via `next/font` (layout.tsx): the typeface for the OG card and JN icon `ImageResponse` (load the font file into `ImageResponse`).

### Established Patterns
- Per-route metadata exists but is **title + description only** — Phase 2 intentionally left `openGraph`/`twitter` empty and documented Phase 3 ownership in comments. SEO-01/02's job is to centralize all of it through `buildMetadata`.
- Strict monochrome via CSS-first `@theme` tokens (`--color-ink` #0a0a0a, `--color-ink-muted` #737373, off-white bg) — the OG card, JN icon, and 404 must use these exact values (the OG/icon are `ImageResponse`, so the resolved hex values are inlined, not the CSS vars — mirror the Phase 2 SVG palette approach).
- Sole-`"use client"` invariant (SEC-07): CopyEmail is the only client island. Phase 3 additions (metadata, OG, icons, 404, sitemap, robots) are all Server-side / build-time — **do not introduce a second client island.**

### Integration Points
- `lib/seo.ts` `buildMetadata` plugs into `generateMetadata`/`metadata` exports on every route (layout + /uses + /projects/[slug]).
- `app/opengraph-image.tsx`, `app/icon.tsx`, `app/apple-icon.tsx`, `app/not-found.tsx`, `app/sitemap.ts`, `app/robots.ts` are all new App-Router special files at the `src/app/` root.

</code_context>

<specifics>
## Specific Ideas

- OG card layout reference (user-selected mock):
  ```
  James Nhek
  AI Engineer @ Asurion
  RAG · evaluations · agentic workflows
                                   pjnhek.com
  ```
  Left-aligned, off-white background, monochrome, mirrors the hero.
- 404 working copy (James confirms final): "This page wandered off. Here's the way back." + `← Back to home`.
- Icon: `JN` monogram, Geist, ink on off-white, code-rendered.

</specifics>

<deferred>
## Deferred Ideas

- **Per-route / per-project OG cards** — templated cards showing each project's title + headline metric. Considered and deferred for v1 (one site-wide identity card chosen). Revisit if individual project deep-links start getting shared and a tailored card would add value.
- **Non-technical cold reader for POL-10** — having an actual friend/family member do the 60-second read (vs James's own read) is higher-signal but adds a real-world dependency; optional, not required to close Phase 3.
- **Production verification on pjnhek.com** — final LinkedIn Inspector / opengraph.xyz / Lighthouse / real-device checks against the real domain are **Phase 4** scope (domain cutover), re-running the same checks Phase 3 does on preview.

### Reviewed Todos (not folded)
None — no pending todos matched this phase.

</deferred>

---

*Phase: 3-SEO, Polish, Performance & Accessibility*
*Context gathered: 2026-06-23*
