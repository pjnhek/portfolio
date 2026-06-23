# Phase 3: SEO, Polish, Performance & Accessibility - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-23
**Phase:** 3-SEO, Polish, Performance & Accessibility
**Areas discussed:** OG card design, Favicon / app icon, 404 page personality, Verification scope (now vs Phase 4)

---

## OG Card — Generation (Q1/3)

| Option | Description | Selected |
|--------|-------------|----------|
| Static, built at build-time | Fixed 1200×630, zero runtime cost, can't break in prod; matches SEO-04 "static" | ✓ |
| next/og ImageResponse (dynamic JSX) | Templated in code, per-route capable, slight runtime Function cost | |
| Hand-designed PNG (Figma/Canva) | Max visual control, but divorced from code | |

**User's choice:** Static, built at build-time.
**Notes:** Aligns with the Vercel Hobby Active-CPU caution in CLAUDE.md.

## OG Card — Content / Scope (Q2/3)

| Option | Description | Selected |
|--------|-------------|----------|
| One site-wide card: name + role + domain | Single identity poster for every link; simplest, always correct | ✓ |
| Per-route cards | Home/project/uses variants; more tailored, 5+ cards to maintain | |
| Identity card + per-project cards only | Middle ground; project deep-links get tailored cards | |

**User's choice:** One site-wide identity card.
**Notes:** Mirrors hero copy (James Nhek / AI Engineer @ Asurion / RAG · evaluations · agentic workflows).

## OG Card — Visual Treatment (Q3/3)

| Option | Description | Selected |
|--------|-------------|----------|
| Left-aligned type stack on off-white | Mirrors the hero; "same hand-built site" continuity; monochrome | ✓ |
| Centered, poster-style | Symmetrical/bold but diverges from the left-aligned hero | |
| Inverted (ink background, off-white type) | High-contrast in feeds but wouldn't match the light page on click | |

**User's choice:** Left-aligned type stack on off-white.
**Notes:** Small `pjnhek.com` footer mark; Geist display weight for the name.

---

## Favicon / App Icon (POL-02)

| Option | Description | Selected |
|--------|-------------|----------|
| 'JN' monogram, Geist, ink on off-white | Code-rendered; legible at 16px; shares site type+palette | ✓ |
| Single 'J', large | Crisper at 16px, less identifying | |
| Inverted 'JN' (off-white on ink) | Stands out among app icons but diverges from light site | |

**User's choice:** 'JN' monogram, Geist, ink on off-white (code-rendered via icon.tsx + apple-icon.tsx).

---

## 404 Page Personality (POL-01)

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal + one line of voice | Big 404 + one conversational line + ← Back to home | ✓ |
| Purely utilitarian | "404 — Page not found." + link; zero personality | |
| Playful / clever | Engineer in-joke / fake stack trace; risks try-hard | |

**User's choice:** Minimal + one line of voice.
**Notes:** Working copy "This page wandered off. Here's the way back." — final copy Claude-drafted, James confirms. Honors Phase 2 About voice (D-About-02).

---

## Verification Scope — Where checks run (Q1/2)

| Option | Description | Selected |
|--------|-------------|----------|
| Run on PREVIEW now, re-verify on prod in Phase 4 | Catch render/OG bugs early on preview; Phase 4 re-runs against pjnhek.com | ✓ |
| Defer ALL manual/prod checks to Phase 4 | Phase 3 ships code + automatable checks only | |
| Do everything on preview, Phase 4 trusts it | Fastest but preview≠prod risks a prod-only bug | |

**User's choice:** Run on preview now, re-verify on prod in Phase 4.
**Notes:** Matches ROADMAP SC#5's own note.

## Verification Scope — Human-only checks (Q2/2)

| Option | Description | Selected |
|--------|-------------|----------|
| Human-verify checkpoints, James runs them | Claude automates the rest; blocking checkpoints for device/social/cold-read | ✓ |
| Automate max, flag rest as deferred UAT | Phase can close on automated pass; human items tracked as outstanding | |
| Find a non-technical cold reader for POL-10 | Highest-signal for POL-10 but adds a real-world dependency | |

**User's choice:** Human-verify checkpoints, James runs them.
**Notes:** Claude runs Lighthouse CLI / axe / keyboard nav / bundle budget; James runs real-iPhone, LinkedIn Inspector, cold-read. POL-10 may be James's own read for v1.

---

## Claude's Discretion

- `buildMetadata` factory signature/internals; sitemap/robots implementation; `next/image` `priority`/`fetchPriority` wiring; focus-ring CSS; bundle-budget measurement method.
- Exact 404 copy and OG/icon type sizes/margins (within the locked direction; James confirms 404 copy).

## Deferred Ideas

- Per-route / per-project OG cards (revisit if project deep-links get shared).
- Non-technical cold reader for POL-10 (optional, not required to close phase).
- Production verification on pjnhek.com — Phase 4 scope.
