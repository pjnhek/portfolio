# Phase 1: Foundation Slice - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in `01-CONTEXT.md` — this log preserves the alternatives considered.

**Date:** 2026-05-20
**Phase:** 1-Foundation Slice
**Areas discussed:** Repo name + visibility, Mono palette character, Type scale + numbered anchor style, Phase 1 shell content + ArchitectureDiagram primitive shape

---

## Repo name + visibility

| Option | Description | Selected |
|--------|-------------|----------|
| pjnhek/portfolio, public | Default name, public so recruiters can read the source. Matches the 'site is part of the portfolio' framing — 'View Source' lands them in the repo. | ✓ |
| pjnhek/pjnhek.com, public | Repo named after the domain. Public. A little more distinctive; tells recruiters exactly what they're looking at. | |
| pjnhek/portfolio, private | Default name, kept private. Cleaner if you want to keep the source private and just show the deployed site. | |

**User's choice:** pjnhek/portfolio, public
**Notes:** Closes the open todo in `STATE.md` ("Confirm GitHub repo name with user (default: `pjnhek/portfolio`)"). Public repo reinforces the "site is part of the portfolio" framing and affects Phase 4 DEP-10 (pinned repos).

---

## Mono palette character

| Option | Description | Selected |
|--------|-------------|----------|
| Softened (near-black on near-white) | Background near-white (e.g. #fafafa or #f7f7f7), text near-black (e.g. #0a0a0a or #111). Calm, paper-like, easy on eyes. Closest to huyml.co. Recommended. | ✓ |
| Pure black on pure white | #000 on #fff. Maximum contrast, dramatic. Feels more 'brutalist.' Slightly harsher on long reads; can feel stark in dark rooms. | |
| Warm-gray-tinted (paper-y) | Slight warm cast, e.g. background #f8f6f2 or off-white with a hint of cream; ink #1a1612-ish. More 'editorial,' less tech. May feel less engineering-artifact. | |

**User's choice:** Softened (near-black on near-white)
**Notes:** Anchors on bg ~`#fafafa`, ink ~`#0a0a0a` as starting tokens; exact hex tuned during implementation but must hit ≥4.5:1 (FOUND-05). Aligns with huyml.co tone reference.

---

## Type scale + numbered anchor style

| Option | Description | Selected |
|--------|-------------|----------|
| Roomy scale + `01.` anchors | Body ~17px floor scaling up via clamp(); generous line-height (~1.6); section labels rendered as 01. About in Geist Mono, slightly muted. Closest to huyml.co — calm, readable, classic engineer-portfolio feel. | ✓ |
| Roomy scale + `01 /` anchors | Same roomy type, but anchors rendered as 01 / About with a slash. Slightly more 'engineering CLI' flavor. Distinctive without being precious. | |
| Tight scale + `01.` anchors | Body ~14–15px floor; tighter leading (~1.45); denser feel. More 'data-dashboard / docs-site' vibe. Looks polished on desktop, can feel cramped on mobile if not careful. | |
| Roomy scale + `[01]` anchors | Roomy type, bracketed anchors like [01] About. Most distinctive of the four; feels a bit 'changelog / RFC.' Risk: edges toward designer-playground rather than engineering-artifact. | |

**User's choice:** Roomy scale + `01.` anchors
**Notes:** Mono palette + roomy type + classic `01.` numbering converge on a "calm engineering artifact" tone consistent with huyml.co and the audience-first arbiter ("trust + remember in 60 seconds on a phone").

---

## Phase 1 shell content + ArchitectureDiagram primitive shape

| Option | Description | Selected |
|--------|-------------|----------|
| Labeled skeleton sections + ArchitectureDiagram = typed figure(src,alt,caption) | Phase 1 renders sections with the future headings (01. About / 02. Experience / 03. Featured Projects / 04. /uses / 05. Contact) and a one-line placeholder beneath each. ArchitectureDiagram is a typed wrapper: accepts {src, alt, caption} and renders <figure><img|inline-svg/><figcaption>. In Phase 1 it just demos with a placeholder SVG. Phase 2 swaps in real content + real diagrams. | ✓ |
| Lorem-ipsum shell + ArchitectureDiagram = same figure(src,alt,caption) | Same primitive shape, but section bodies are lorem ipsum rather than future-section labels. Cleaner-looking shell but loses the 'Phase 2 just swaps content' wiring. | |
| Single-page shell with only Hero placeholder + bare ArchitectureDiagram(src) | Minimum: a hero placeholder ('James Nhek — AI Engineer') and nothing else; ArchitectureDiagram is a bare <img src> wrapper, no caption logic yet. Fastest to ship Phase 1; pushes more design-system work into Phase 2. | |

**User's choice:** Labeled skeleton sections + ArchitectureDiagram = typed figure(src,alt,caption)
**Notes:** Section anchor slugs (`#about`, `#experience`, `#projects`, `#contact`) seeded in Phase 1 so Phase 2's SEC-08 inherits the wiring. Required `alt` (not optional) on the diagram primitive enforces Phase 2 confidentiality + accessibility (DIAG-03, POL-06) at the type-system level.

---

## Claude's Discretion

The user did not explicitly defer any area to Claude — all four selected areas got an explicit pick. Items left to planning / execution discretion are enumerated in `01-CONTEXT.md` under `<decisions>` → "Claude's Discretion" (token names, clamp() formulas, directory layout, ESLint flat-config shape, Prettier config, zod schema specifics, next.config.ts content, pre-commit hooks, primitives demo route).

## Deferred Ideas

No new deferrals surfaced during this discussion. The user did not propose any out-of-scope additions — discussion stayed within the locked Phase 1 boundary. Pre-existing deferrals (light/dark mode, MDX, motion library, analytics, blog, RAG demo, contact form backend) remain Out of Scope per `PROJECT.md ## Out of Scope` and `REQUIREMENTS.md ## v2 Requirements`.
