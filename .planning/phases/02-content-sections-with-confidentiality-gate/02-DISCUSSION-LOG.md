# Phase 2: Content & Sections (with Confidentiality Gate) - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in `02-CONTEXT.md` — this log preserves the alternatives considered.

**Date:** 2026-05-21
**Phase:** 2-Content & Sections (with Confidentiality Gate)
**Areas discussed:** Asurion bullet sourcing rule, Confidentiality review process, About section voice + length, Experience section depth, Project detail page depth, Project card metric callout, Architecture diagram tool + style, /uses page scope

---

## Asurion bullet sourcing rule

### Q1: What's the rule for Asurion content on the site?

| Option | Description | Selected |
|--------|-------------|----------|
| Strict: verbatim from public resume (Recommended) | Every Asurion sentence and number must already appear in the public May-2026 resume — paraphrased lightly for prose flow, but no fact added that isn't on the resume. | ✓ |
| Paraphrase-OK, same facts/numbers | Rewrite freely for narrative voice, but only use numbers and facts already on the public resume. | |
| Any fact derivable from public materials | Resume + public LinkedIn + any public talk/post counts. | |
| You decide | Lock the strictest variant by default. | |

**User's choice:** Strict — verbatim from public resume.
**Notes:** Aligns with PROJECT.md confidentiality constraints and PITFALLS.md Pitfall 2. Tightest gate, lowest risk.

### Q2: Where does the canonical resume live for the gate to check against?

| Option | Description | Selected |
|--------|-------------|----------|
| Add resume to `.planning/refs/RESUME-2026-05.md` (Recommended) | Becomes a canonical ref in CONTEXT.md; reviewer diffs every Asurion sentence against it. | ✓ |
| Paste resume content inline into the discussion now | Capture inline in CONTEXT.md as the authoritative list. | |
| Link to public LinkedIn experience as the source | Risk: LinkedIn copy can drift, requires a live fetch to audit. | |

**User's choice:** Add resume to `.planning/refs/`.
**Notes:** Action item flagged in CONTEXT.md `<canonical_refs>`: James deposits `RESUME-2026-05.md` at `.planning/refs/` before `/gsd:plan-phase 2` runs.

### Q3: If the resume doesn't have a number for a sentence you want on the site, what's the policy?

| Option | Description | Selected |
|--------|-------------|----------|
| Cut the sentence (Recommended) | If no resume-sourced number backs it, the sentence doesn't ship. | ✓ |
| Allow one non-numeric framing sentence per role section | Scene-setting sentence allowed per role; every other bullet needs a number. | |
| Add a count-only fallback (years, tenants, roles) | Counts like '5 enterprise tenants', '249 synthetic QA pairs' broaden what counts as 'has a number'. | |

**User's choice:** Cut the sentence.
**Notes:** Keeps the 'concrete metrics' signal pure; reinforces PITFALLS.md weekend-project test.

### Q4: What about public tech names (pgvector, LangSmith, Vertex)?

| Option | Description | Selected |
|--------|-------------|----------|
| Allow public-tech names on Asurion diagram (initially Recommended) | Industry tools, not Asurion IP. | (initially ✓, revised later) |
| Generic boxes only — no tech names at all on Asurion diagram | Safest. | |
| Allow public-tech names only if the resume already discloses them | Tight; same logic as the bullet rule. | |

**User's choice (initial):** Allow public-tech names on Asurion diagram.
**User's revision (mid-discussion):** Strip public-tech names from the Asurion **diagram** only; Asurion **copy** keeps public-tech names that appear on the resume.
**Notes:** Revision driven by user's concern that diagrams are more easily screenshotted out of context — got a tighter rule than copy. D-Asurion-04 and D-Diag-03 updated accordingly.

---

## Confidentiality review process

### Q1: Who runs the Asurion confidentiality review, and when?

| Option | Description | Selected |
|--------|-------------|----------|
| James self-reviews, with a written checklist (Recommended) | Single-reviewer model. Diff every Asurion sentence + diagram label against RESUME-2026-05.md; sign off in CONFIDENTIALITY-REVIEW.md. | ✓ |
| Second human reviewer sign-off required | Peer, lawyer, or trusted contact reviews; explicit sign-off in CONFIDENTIALITY-REVIEW.md. | |
| Claude reviews as a final automated pass before merge | After self-review, Claude diffs every Asurion paragraph vs RESUME-2026-05.md and flags violations. | |

**User's choice:** James self-reviews with a written checklist.
**Notes:** Fastest, no coordination cost; matches the "ship ASAP" constraint. The written checklist counteracts author-as-reviewer bias.

### Q2: When does the review run?

| Option | Description | Selected |
|--------|-------------|----------|
| Once at end of phase, against everything (Recommended) | All content drafted first, then a single review pass. | ✓ |
| Per-plan: review runs each time an Asurion-touching plan finishes | Tighter feedback loop, more bookkeeping. | |
| Two-pass: draft review on first content, final review before phase verifier | Highest assurance, double the reviewer effort. | |

**User's choice:** Once at end of phase, against everything.
**Notes:** Reviewer gets full context; simpler to coordinate.

### Q3: What's the checklist?

| Option | Description | Selected |
|--------|-------------|----------|
| Every Asurion sentence cites a number from RESUME-2026-05.md | Direct CONT-08 + D-Asurion-03 enforcement. | ✓ |
| No internal product names, codenames, queue names, team names anywhere in copy or diagrams | PITFALLS.md Pitfall 2 lift. | ✓ |
| No screenshots of any Asurion internal system, ever | Hard rule — if a visual is needed, build fresh. | ✓ |
| 'LinkedIn tomorrow' check on each Asurion paragraph | Subjective gut-check. | |

**User's choice:** First three items. The 'LinkedIn tomorrow' subjective check was deliberately excluded.
**Notes:** Keeps the rubric objective and diff-able; subjective override still possible at write-time but not review-time.

### Q4: What happens if a review item fails?

| Option | Description | Selected |
|--------|-------------|----------|
| Fail blocks phase verifier; fix, re-run full checklist, then sign off (Recommended) | Hard gate. Re-run all 3 items, not just the failed one. | ✓ |
| Only re-check the failed item; phase can close on partial re-review | Faster but creates blind spots. | |
| Soft warning; phase can close with reviewer override | Not recommended for a hard merge gate. | |

**User's choice:** Hard gate — full checklist re-run on every failure.
**Notes:** Fixing one bullet can introduce a new internal-name leak elsewhere; full re-run catches knock-on changes.

---

## About section voice + length

### Q1: How long is the About section?

| Option | Description | Selected |
|--------|-------------|----------|
| ~120–180 words / 2–3 short paragraphs (Recommended) | Pivot + current work + transition, readable on phone in 60 seconds. | ✓ |
| ~80–120 words / 1 tight paragraph | Tightest possible. | |
| ~200–280 words / 3–4 paragraphs | Room for pivot + current work + 'why AI' + personal closing line. | |

**User's choice:** ~120–180 words.

### Q2: What voice / tone?

| Option | Description | Selected |
|--------|-------------|----------|
| Warm-but-precise: first-person, specific, no buzzwords (Recommended) | Lands human story without softening the rigor. | |
| Terse-factual: third-person resume voice | Reads like a bio blurb. | |
| Conversational: like talking to a friend | Most memorable, highest risk of reading unprofessional. | ✓ |

**User's choice:** Conversational — like talking to a friend.
**Notes:** Deliberately chose the more memorable / personality-forward option over the safer recommendation. Buzzword ban from PITFALLS.md Pitfall 1 still applies.

### Q3: What does the About section close on?

| Option | Description | Selected |
|--------|-------------|----------|
| Current Asurion work (RAG, evals, agentic) (Recommended) | Sets up the Experience section that follows. | ✓ |
| What I'm interested in / why AI | Signals depth of thinking; skips bridge into Experience. | |
| Personal closer (running, SF, hobby) | Humanizing but ends on something a recruiter doesn't care about. | |
| What I'm looking for next (job-hunt signal) | Aligns with recruiter-first; some find it forward. | |

**User's choice:** Current Asurion work — transition into Experience.

### Q4: Authoring approach?

| Option | Description | Selected |
|--------|-------------|----------|
| Claude drafts; you edit (Recommended) | Fast iteration vs blank-page start. | ✓ |
| You write yourself; Claude doesn't touch the prose | Highest voice authenticity; slowest. | |
| Claude drafts; you edit; final tone polish pass back to Claude | Three-step; risk of sanding down chosen voice. | |

**User's choice:** Claude drafts; James edits.

---

## Experience section depth

### Q1: Which roles show up, at what depth?

| Option | Description | Selected |
|--------|-------------|----------|
| All 3 work roles + 2 education entries, full depth (Recommended) | Asurion + A to Z Tax + FWD + USF MSDS + UH. Education in a sub-block. | ✓ |
| All 3 work roles, full bullets; education collapsed to a single line | Same work-history depth; saves vertical space. | |
| Just Asurion + Tax Analyst (the pivot pair), no FWD | Tightest narrative; loses the data-analyst bridge. | |

**User's choice:** All 3 work roles + 2 education entries.
**Notes:** FWD and A to Z are the scaffolding for the pivot story.

### Q2: How many bullets per role?

| Option | Description | Selected |
|--------|-------------|----------|
| 3–5 bullets per role, all roles (Recommended) | Matches FEATURES.md guidance. | ✓ |
| 5–7 bullets for Asurion, 2–3 for tax/data analyst | Asymmetric weighting toward current AI work. | |
| 2–4 bullets per role across the board, terse and uniform | Risk of under-selling Asurion. | |

**User's choice:** 3–5 bullets per role across all roles.

### Q3: Tech chips on non-Asurion roles?

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, tech chips on all 3 work roles (Recommended) | Visual consistency — section reads as one ledger. | |
| Tech chips on Asurion only; tax/data roles get prose only | Asurion stays visually the main exhibit. | ✓ |
| Tech chips only on roles with 3+ distinct technologies | Pragmatic; case-by-case. | |

**User's choice:** Tech chips on Asurion only.

### Q4: Role header row shape?

| Option | Description | Selected |
|--------|-------------|----------|
| Title — Company — Dates — Location (Recommended) | Matches SEC-03 spec; recruiter-conventional. | ✓ |
| Title · Company, Dates only — no location per role | Less info-dense. | |
| Title · Company · Dates, location only on Asurion | Compromise. | |

**User's choice:** Title — Company — Dates — Location for every role; dates in Geist Mono.

---

## Project detail page depth

### Q1: How deep does each /projects/[slug] page go?

| Option | Description | Selected |
|--------|-------------|----------|
| Tight: ~300–500 words Problem→Approach→Result with tech chips (Recommended) | Achievable for all 4 in one phase. | ✓ |
| Mini: 1–2 paragraphs + tech chips + link out to GitHub | Lowest authoring cost; risk of 'why is this its own page?' | |
| Full case study: ~800–1500 words + multiple sections + 1–2 diagrams per page | Highest signal; most likely to slip the phase. | |

**User's choice:** Tight 300–500 words P→A→R with tech chips.

### Q2: Which project gets the architecture diagram (PROJ-04)?

| Option | Description | Selected |
|--------|-------------|----------|
| Voice Intent Eval gets a diagram (Recommended) | Simplest to diagram crisply. | ✓ |
| SF Date Night Concierge gets the diagram | Higher signal; more diagram authoring effort. | |
| Both Voice Intent Eval AND SF Date Night | Strongest visual portfolio; biggest cost. | |
| All 4 projects get a diagram | Maximal; risk to ship-ASAP constraint. | |

**User's choice:** Voice Intent Eval gets the diagram. Total Phase 2 diagrams: 2 (Asurion + VIE).

### Q3: Navigation pattern card → detail page → back?

| Option | Description | Selected |
|--------|-------------|----------|
| Whole card is a link; detail page has '← Back to home' (Recommended) | Lowest cognitive load. | ✓ |
| Title is the link; tech chips + metric non-clickable | Smaller hit target; recruiters might miss it. | |
| Card has explicit 'Read more →' button alongside GitHub | Two CTAs; visual noise risk. | |

**User's choice:** Whole card is the link; `← home` at top of detail page.

### Q4: Metric callout treatment on detail page vs card?

| Option | Description | Selected |
|--------|-------------|----------|
| Same big-number treatment as the card, larger size (Recommended) | Visual continuity. | ✓ |
| No metric callout on detail page — metric inline in Result | Cleaner; loses the punch. | |
| Multiple metric callouts on detail page | Richer; risk of looking padded. | |

**User's choice:** Same primitive, larger size — visual continuity card → detail.

---

## Project card metric callout

### Q1: Visual treatment of the metric on the card?

| Option | Description | Selected |
|--------|-------------|----------|
| Big-number poster: Geist Mono, text-3xl/4xl, ink; label in ink-muted caption (Recommended) | Visual anchor of each card. | ✓ |
| Inline mention: '·10.6% accuracy uplift' as bold inline line | Loses visual punch. | |
| Labeled key-value pair: 'Accuracy: +10.6%' two-column | Feels resume-coded; kills visual delta. | |

**User's choice:** Big-number poster, Geist Mono, text-3xl mobile / text-4xl desktop.

### Q2: Where does the metric sit in the card layout?

| Option | Description | Selected |
|--------|-------------|----------|
| Above the description, below title+subtitle (Recommended) | Title → subtitle → metric → description → chips → GitHub. | ✓ |
| Right-aligned 2-column card on desktop, stacked mobile | Harder to maintain visual rhythm. | |
| Bottom of card, just above tech chips | Quieter; defeats 'metric is headline'. | |

**User's choice:** Above the description.

### Q3: Primary metric per project?

| Option | Description | Selected |
|--------|-------------|----------|
| From resume verbatim (Recommended) — SF Date Night = '5,800+ places', GTM = 'Cohen's kappa', VIE = '100% / 80 scenarios', Weather = retraining cadence | Resume is authoritative source per D-Asurion-01 logic extended to projects. | ✓ |
| Pick metrics during execution — Claude proposes, you confirm | Defers a decision the user has data for. | |
| Use scope-of-system metrics ('LangGraph + 5,800 docs' etc.) | Loses single-number readability. | |

**User's choice:** Resume verbatim. Exact strings confirmed in execution against `.planning/refs/RESUME-2026-05.md`.

---

## Architecture diagram tool + style

### Q1: Which tool authors the two SVG diagrams?

| Option | Description | Selected |
|--------|-------------|----------|
| Excalidraw — sketchy hand-drawn aesthetic (Recommended) | Free, in-browser, SVG export; engineering-blog vibe. | ✓ |
| tldraw — cleaner, more precise vector style | Crisper but less 'engineering artifact'. | |
| Hand-rolled raw SVG | Maximum control; significantly higher labor. | |

**User's choice:** Excalidraw.

### Q2: Color palette for diagrams?

| Option | Description | Selected |
|--------|-------------|----------|
| Strict monochrome: ink + ink-muted only (Recommended) | Matches site palette. | ✓ |
| Monochrome + one accent color for critical paths | Improves legibility; introduces foreign color. | |
| Full Excalidraw default palette | Clashes hardest with monochrome aesthetic. | |

**User's choice:** Strict monochrome — `--color-ink` + `--color-ink-muted` only.

### Q3: Asurion diagram (DIAG-01) — what does it depict?

| Option | Description | Selected |
|--------|-------------|----------|
| Canonical RAG pipeline: ingestion → embed → hybrid retrieve → rerank → LLM → eval loop (Recommended) | PITFALLS.md / FEATURES.md recommend this shape. | ✓ |
| Multi-tenancy view | Showcases multi-tenant aspect; harder to label without internal names. | |
| Eval-framework focused | Aligns with eval bullet; narrower surface. | |

**User's choice:** Canonical RAG pipeline.

**Follow-up (user-initiated revision):** "Maybe remove the public-tech name stuff, feels like IP."

| Option | Description | Selected |
|--------|-------------|----------|
| Strip from DIAG-01 only; copy keeps public-tech names from the resume (Recommended) | Diagram = generic roles only; copy bound by D-Asurion-01. | ✓ |
| Strip from both diagram AND copy | Most conservative; loses tech specificity in bullets. | |

**User's choice:** Strip from DIAG-01 only.
**Notes:** D-Asurion-04 and D-Diag-03 updated mid-discussion. Diagram labels are now strictly generic role names; copy retains resume-disclosed tech names.

### Q4: Voice Intent Eval diagram (DIAG-02) — what does it depict?

| Option | Description | Selected |
|--------|-------------|----------|
| End-to-end flow: TTS → ASR → two-stage Claude → dual-judge benchmarking + CI (Recommended) | Mirrors resume description. | ✓ |
| Just the dual-judge eval loop | Narrower; focuses on eval methodology. | |
| CI-perspective: PR → Actions → eval → pass/fail | Reads as CI diagram rather than AI diagram. | |

**User's choice:** End-to-end flow.

---

## /uses page scope

### Q1: What categories does /uses cover?

| Option | Description | Selected |
|--------|-------------|----------|
| AI-specific core only: models / MCP servers / eval stack / agent framework / dev workflow (Recommended) | Strictly honors USES-02. | ✓ |
| AI core + classic dev essentials (editor / terminal / shell / hardware) | Broader; risk of looking generic. | |
| Full Wes-Bos sweep + AI section bolted on | Defeats USES-02 framing. | |

**User's choice:** AI-specific core only — 5 categories.

### Q2: Format of each /uses item?

| Option | Description | Selected |
|--------|-------------|----------|
| Bold name + one-line 'why I picked it' (Recommended) | Specific, opinionated. | ✓ |
| Name only, comma-separated list | Reads as 'I named some tools'. | |
| Name + paragraph (~50 words each) | Turns /uses into a blog; clashes with restraint. | |

**User's choice:** Bold name + one-line 'why'.

### Q3: Footer — does Phase 2 build it?

| Option | Description | Selected |
|--------|-------------|----------|
| Phase 2 adds a minimal footer to home + /uses + /projects/[slug] (Recommended) | Solves USES-03 + consistent nav. | ✓ |
| Phase 2 adds footer with minimal links (just /uses) | Visual asymmetry with Contact. | |
| Don't build a footer; put 'See my /uses' inside Contact | USES-03 strict-reading violation. | |

**User's choice:** Add `<SiteFooter>` primitive; composes into `app/layout.tsx`.

### Q4: /uses initial content — who drafts?

| Option | Description | Selected |
|--------|-------------|----------|
| Claude proposes; you edit (Recommended) | Fast iteration based on resume + CLAUDE.md signals. | ✓ |
| You provide list inline now in CONTEXT.md | Balloons discuss-phase output. | |
| You write /uses fully yourself during execution | Highest voice authenticity; slowest. | |

**User's choice:** Claude proposes; James edits.

---

## Claude's Discretion

Items where Claude has implementation latitude (per D-Asurion-01 / Phase 1 D-08 contracts):
- Field shape of `Project`, `Role`, `UsesItem`, `SiteConfig` TypeScript interfaces (must be strict + `noUncheckedIndexedAccess`-safe).
- Whether `MetricCallout` is a standalone primitive or inline composition (default: primitive if used ≥2 places).
- Card hover/focus styling (must include `focus-visible:` outline per Phase 1 D-04 pattern).
- `CopyEmail` UX (`navigator.clipboard.writeText` + "Copied!" feedback; lives in the single allowed `"use client"` file).
- Anchor-hash-update behavior for `#about #experience #projects #contact` (native browser sufficient).
- Whether to drop the home-page `04. Uses` section in favor of footer-only navigation (default: drop; planner can revisit).
- Exact email used in the home Contact `mailto:` (defer to plan-phase — `nhekvirakyuth@gmail.com` vs future `james@pjnhek.com`).

## Deferred Ideas

- **Per-project case studies (POST-02)** — v2.
- **GitHub stars / "last updated" on cards (POST-05)** — v2; risk of low-star repos looking weak.
- **View Source easter egg (POST-03)** — v2.
- **Dynamic per-project OG images (POST-04)** — v2; Phase 3 owns OG factory.
- **Resend Server Action contact form (POST-01)** — v2.
- **`/chat` RAG demo (DEMO-01..05)** — v2.
- **Subjective "LinkedIn tomorrow" confidentiality check** — deliberately excluded from the objective checklist; remains available at write-time as personal judgment.
- **Second human reviewer for confidentiality** — considered, rejected in favor of self-review + checklist.
- **`james@pjnhek.com` email forwarding decision** — Phase 4 (DNS) ownership; not a Phase 2 blocker.
- **Drop or keep home-page `04. Uses` section** — flagged for planner; default-drop.
- **Exact mailto target email** — plan-phase resolves.

