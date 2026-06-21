---
phase: 02-content-sections-with-confidentiality-gate
reviewed: 2026-06-20T00:00:00Z
depth: standard
files_reviewed: 22
files_reviewed_list:
  - public/diagrams/asurion-rag-pipeline.svg
  - public/diagrams/voice-intent-eval-flow.svg
  - src/app/globals.css
  - src/app/layout.tsx
  - src/app/page.tsx
  - src/app/projects/[slug]/page.tsx
  - src/app/uses/page.tsx
  - src/components/cards/ProjectCard.tsx
  - src/components/experience/EducationItem.tsx
  - src/components/experience/ExperienceBlock.tsx
  - src/components/experience/RoleHeader.tsx
  - src/components/interactive/CopyEmail.tsx
  - src/components/nav/BackLink.tsx
  - src/components/primitives/MetricCallout.tsx
  - src/components/primitives/SiteFooter.tsx
  - src/components/uses/UsesEntry.tsx
  - src/content/experience.ts
  - src/content/projects.ts
  - src/content/site.ts
  - src/content/uses.ts
  - src/lib/content.ts
  - src/types/content.ts
findings:
  critical: 0
  warning: 5
  info: 7
  total: 12
warnings_resolved: 5
resolution_commit: 44e15f4
status: warnings_resolved
---

> **Resolution (2026-06-20, commit `44e15f4`):** All 5 Warnings (WR-01…WR-05)
> were fixed during phase closeout — CopyEmail re-announce + timer cleanup,
> composite React keys, voice-SVG 16:9 viewBox, and cross-linked DRY notes on
> the duplicated 10.6% Asurion figure. tsc + lint + build pass; the sole
> `"use client"` invariant (SEC-07) is preserved. The 7 Info items remain as
> advisory (non-blocking) and are not addressed in this phase.

# Phase 2: Code Review Report

**Reviewed:** 2026-06-20
**Depth:** standard
**Files Reviewed:** 22
**Status:** issues_found

## Summary

Phase 2 ships the real content sections (About, Experience, Featured Projects, Contact),
the `/uses` route, the dynamic `/projects/[slug]` route, two sanitized SVG diagrams, and
the single `CopyEmail` client island. The code is high quality overall: Server Components
by default, the one-client-island invariant holds, design tokens are used consistently,
accessibility (aria-hidden glyphs, sr-only status, focus rings, touch targets) is treated
as a Day-1 concern, and the confidentiality discipline (resume-cited Asurion strings,
generic-label diagrams) is well executed and self-documenting.

No Critical defects were found. There are no injection, secret-leak, XSS, or auth issues —
the attack surface is essentially a static site with one clipboard call. The findings below
are correctness/robustness Warnings and quality Info items.

Key concerns worth fixing before ship:
- The `CopyEmail` polite-live-region only re-announces on state *change*; two consecutive
  failures (or success→idle→success) can produce a silent/ambiguous announcement (WR-01).
- React `key` props derived from free-text content (bullets, tags, tech) collide if two
  strings are ever identical (WR-02).
- `voice-intent-eval-flow.svg` is authored at a 2:1 viewBox but rendered in a `16/9`
  container, so it letterboxes with visible dead space (WR-03).
- The home About section hardcodes a resume metric ("10.6%") as a literal string in JSX
  while the same number lives in `experience.ts` — two sources of truth for one fact (WR-04).
- `setTimeout` timers in `CopyEmail` are never cleared on unmount (WR-05).

## Warnings

### WR-01: `CopyEmail` live-region can fail to re-announce repeated outcomes

**File:** `src/components/interactive/CopyEmail.tsx:42-46, 67-73`
**Issue:** The polite live region renders text keyed off `state`. The state machine is
`idle → success → idle` and `idle → error → idle`, so each outcome passes through `idle`
(empty announcement) before the next. That is correct for the *common* path. The problem
is the boundary: assistive tech announces a polite region when its text content *changes*.
If a user triggers two copies in rapid succession, the second `setState("success")` fires
while the region may still hold "Copied to clipboard" from the first run (the 2s `idle`
reset may not yet have flushed, or AT may coalesce). With identical text, no change is
detected and the second success is not re-announced — the user gets no confirmation their
second action worked. The visible label has the same issue (Copied → Copied reads as no-op).
**Fix:** Force a content change so repeated identical outcomes still announce. Simplest is
to derive the message and reset deterministically, or append an invisible nonce/counter:
```tsx
const [state, setState] = useState<"idle" | "success" | "error">("idle");
const [nonce, setNonce] = useState(0);

async function handleCopy() {
  try {
    await navigator.clipboard.writeText(email);
    setState("success");
    setNonce((n) => n + 1);
    setTimeout(() => setState("idle"), 2000);
  } catch {
    setState("error");
    setNonce((n) => n + 1);
    setTimeout(() => setState("idle"), 5000);
  }
}
// region content: include {nonce} via key on the <span> or a trailing
// &#8203;.repeat(nonce % 2) so AT detects a change each press.
```

### WR-02: React `key` props derived from free-text content collide on duplicate strings

**File:** `src/components/experience/ExperienceBlock.tsx:44 (key={b})`, `:65 (key={t})`; `src/components/cards/ProjectCard.tsx:55 (key={t})`; `src/app/projects/[slug]/page.tsx:81 (key={t})`
**Issue:** Bullets, tags, and tech chips use the string value itself as the React `key`.
If any two strings within one list are identical (e.g., a duplicated tech chip, or two
bullets that happen to start the same after an edit), React emits a "duplicate key" warning
and may reuse/mis-reconcile DOM nodes. The current content has no duplicates, so this is
latent, not active — but it is a foot-gun the next content edit can trip, and it is exactly
the class of bug that ships silently because the data is static.
**Fix:** Key on a stable composite of index + value, which is collision-free for static
arrays and still order-stable:
```tsx
{role.bullets.map((b, i) => (
  <li key={`${i}-${b}`} ...>
))}
{project.tech.map((t, i) => <Tag key={`${i}-${t}`}>{t}</Tag>)}
```
(Index-only keys are acceptable here because these arrays are static and never reordered;
the composite keeps a human-readable key while guaranteeing uniqueness.)

### WR-03: `voice-intent-eval-flow.svg` viewBox (2:1) does not match the 16/9 render container

**File:** `public/diagrams/voice-intent-eval-flow.svg:1` (`viewBox="0 0 900 450"`); consumed by `src/components/primitives/ArchitectureDiagram.tsx:42` (`aspect-[16/9]`)
**Issue:** `ArchitectureDiagram` wraps every SVG in an `aspect-[16/9]` box with
`object-contain`. `voice-intent-eval-flow.svg` is authored at 900×450 = **2:1**, not 16:9
(≈1.78:1). With `object-contain` the SVG will be letterboxed: scaled to fit width, leaving
empty bands top and bottom inside the bordered box. The Asurion diagram (800×450 ≈ 1.78:1)
is effectively 16:9 and renders flush, so the two diagrams will look inconsistent — one
fills its frame, one floats inside dead space. For a site whose whole thesis is "looks
hand-built and intentional," visible letterboxing on one of two diagrams reads as a defect.
**Fix:** Re-author the voice diagram viewBox to 16:9 (e.g., `viewBox="0 0 800 450"` and
re-lay-out, or `0 0 900 506`), OR change `ArchitectureDiagram` to not impose a fixed aspect
on SVGs (let the intrinsic ratio drive height). Given the container is shared, the safest
fix is matching the SVG to 16:9. Confirm visually at mobile and desktop widths.

### WR-04: Home About metric duplicates the resume number already in `experience.ts`

**File:** `src/app/page.tsx:71-77` ("lifting retrieval accuracy 10.6% ...") vs `src/content/experience.ts:33` (same 10.6% bullet)
**Issue:** The "10.6% over the production baseline with hybrid search, cross-encoder
reranking, and contextual chunking" fact is hardcoded as prose in `page.tsx` AND lives as
a typed bullet in `experience.ts:33`. This violates single-source-of-truth: a future resume
update (say the number moves to 11.2%) must be applied in two places, and the inline JSX
copy carries no `// Resume source:` citation at the point of render — only the content
module does. The confidentiality gate's premise is that every Asurion number traces to a
cited source; an uncited duplicate in `page.tsx` is the exact drift the gate is meant to
prevent. (There is a citation comment on line 70, but it documents the bullet, not a shared
constant — the string is still physically duplicated.)
**Fix:** Either (a) keep the About prose intentionally vague ("recently lifted retrieval
accuracy by double digits") so it carries no precise number to drift, or (b) source the
About paragraph from a typed field in `site.ts`/`experience.ts` so the number exists once.
Option (a) is lower-effort and still recruiter-credible; option (b) is the DRY-correct fix
if the precise figure must appear in both places.

### WR-05: `setTimeout` handles in `CopyEmail` are not cleared on unmount

**File:** `src/components/interactive/CopyEmail.tsx:42, 45`
**Issue:** `handleCopy` schedules a `setTimeout(... , 2000/5000)` to reset state but never
stores or clears the timer. If the component unmounts before the timer fires (route change,
or a parent re-mount), the deferred `setState` runs on an unmounted component. In React 19
this no longer throws the classic "setState on unmounted" warning, but it is still a stray
timer doing wasted work, and back-to-back clicks stack overlapping timers so an earlier
timer can reset state out from under a later success (compounds WR-01). On a single
long-lived Contact section the practical impact is low, hence Warning not Critical.
**Fix:** Track the timer and clear it before scheduling a new one and on unmount:
```tsx
import { useRef, useEffect } from "react";
const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
// in handleCopy, before scheduling:
if (timer.current) clearTimeout(timer.current);
timer.current = setTimeout(() => setState("idle"), 2000);
```

## Info

### IN-01: SVG `<desc>` text is near-duplicate of the consumer `alt` — drift risk

**File:** `public/diagrams/asurion-rag-pipeline.svg:3` and `src/components/experience/ExperienceBlock.tsx:58`; `public/diagrams/voice-intent-eval-flow.svg:3` and `src/content/projects.ts:102`
**Issue:** Each diagram's accessible description exists twice: once in the SVG `<desc>` and
once in the `alt` passed by the consumer. Because the SVG is referenced via `<img src>`
(per `ArchitectureDiagram`), the internal `<title>`/`<desc>` are NOT exposed to AT — only
`alt` is — so the `<desc>` is dead weight that can silently drift from the real (alt) text.
It is harmless today but is a maintenance trap: an editor fixing the description in the SVG
would change nothing user-facing.
**Fix:** Keep `alt` as the single source for the accessible description and either drop the
SVG `<desc>` or add an SVG comment noting it is informational-only (not the a11y path when
embedded via `<img>`).

### IN-02: Paragraph splitting uses array index as React key

**File:** `src/app/projects/[slug]/page.tsx:100, 110, 128` (`key={i}` on split paragraphs)
**Issue:** `project.problem.split("\n\n").map((para, i) => ...key={i}...)` keys on index.
For static, never-reordered content this is acceptable (and React's own docs permit it
for stable lists), so this is Info not Warning. Noting it for consistency with WR-02:
index keys are fine here precisely because the arrays are static — same reasoning should be
applied to the bullet/tag keys rather than keying on content.
**Fix:** No change required; optionally `key={`${i}-${para.slice(0,16)}`}` for readability.

### IN-03: `SiteConfig.tagline` / `location` / `baseUrl` appear unused by reviewed consumers

**File:** `src/content/site.ts:23-31`, `src/types/content.ts:19-27`
**Issue:** `site.tagline`, `site.location`, and `site.baseUrl` are defined and exported but
none of the Phase-2 consumers (`page.tsx`, `SiteFooter.tsx`, `CopyEmail.tsx`) read them —
the hero hardcodes "AI Engineer @ Asurion" and "San Francisco — open to AI Engineer roles."
as literals (`page.tsx:41, 47`), and `baseUrl` is read from `env` in `layout.tsx`, not from
`site`. `baseUrl` is plausibly reserved for Phase 3 SEO, but `tagline`/`location` are
currently duplicated string constants that can drift from the hero copy.
**Fix:** Either consume `site.tagline`/`site.location` in the hero to remove the duplicate
literals, or drop them from `SiteConfig` until a consumer needs them. Confirm `baseUrl` is
intentionally Phase-3 scope before removing.

### IN-04: `getAllProjects()` is called inline inside the JSX map

**File:** `src/app/page.tsx:102`
**Issue:** `{getAllProjects().map((p) => ...)}` calls the accessor during render. It returns
a static module array (no I/O), so this is correct and cheap — flagged only for readability
parity with the detail route, which assigns to a local first.
**Fix:** Optional: hoist to `const projects = getAllProjects();` above `return` for symmetry
with `projects/[slug]/page.tsx`.

### IN-05: Empty-string render path in `RoleHeader` is documented but unreachable

**File:** `src/components/experience/RoleHeader.tsx:43-49`
**Issue:** The `location ? (...) : (dates)` branch handles an empty `location`, and the file
header (lines 13-17) explains the fallback. But `Role.location` is typed `string`
(non-optional, `types/content.ts:52`) and all three roles populate it, so the `else` branch
is currently dead. Not a bug — defensive and well-documented — but it is dead code per the
strict reading of the review scope.
**Fix:** No action needed; acceptable defensive rendering. If you want zero dead branches,
make `location?: string` optional in the type to justify the guard, or drop the guard.

### IN-06: `MetricCallout` annotates its return as `ReactNode` while siblings infer it

**File:** `src/components/primitives/MetricCallout.tsx:24`
**Issue:** `MetricCallout` declares `: ReactNode` explicitly; every other reviewed component
(`ProjectCard`, `Section`, `Tag`, `BackLink`, etc.) lets TS infer the JSX return type. The
explicit annotation is harmless but inconsistent with the established house style.
**Fix:** Drop the explicit `: ReactNode` for consistency, or add it to the others. Cosmetic.

### IN-07: `voice-intent-eval` is the only project with a `diagram`; the detail-page guard is intentional dead-until-now code

**File:** `src/app/projects/[slug]/page.tsx:117-123`, `src/content/projects.ts:100-105`
**Issue:** The `project.diagram && <ArchitectureDiagram .../>` guard activates for exactly
one of four projects. This is by design (documented in the route header, lines 19-23) and
is correct conditional rendering, not a defect. Recorded for completeness so a future
reviewer does not flag the three diagram-less projects as a data gap.
**Fix:** None. Working as intended.

---

_Reviewed: 2026-06-20_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
