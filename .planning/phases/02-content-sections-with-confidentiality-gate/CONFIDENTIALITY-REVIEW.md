# Phase 2 Confidentiality Review

**Reviewed by:** James Nhek
**Reviewed on:** 2026-05-21
**Resume source-of-truth:** `.planning/refs/RESUME-2026-05.md`
**Resume sha256:** `07b95572c03ad0d605a7091f5ebc0d56df66152fdc30f690f9c742d6f3d4b933`

The hash above binds this review to the specific resume version on disk at sign-off time. If `.planning/refs/RESUME-2026-05.md` changes later, this gate must be re-run (D-Review-04).

## 3-Item Checklist (D-Review-03)

### Item 1: Every Asurion sentence cites a number from RESUME-2026-05.md

| # | Location | Resume-sourced number | Resume citation |
|---|----------|----------------------|-----------------|
| 1 | `src/app/page.tsx` line 72-76 (About closing paragraph) | `10.6%` retrieval-accuracy lift over production baseline | line 14 — "Lifted retrieval accuracy 10.6% over the production baseline with hybrid search (lexical + semantic), cross-encoder reranking, and contextual chunking." |
| 2 | `src/content/experience.ts` line 33 (Asurion bullet 1) | `10.6%` retrieval accuracy | line 14 (same as #1) |
| 3 | `src/content/experience.ts` line 35 (Asurion bullet 2) | `249` synthetic QA pairs, `11` query transformations, `4` dimensions | line 15 — "Built a RAG eval framework with 249 synthetic QA pairs and 11 query transformations. Benchmarked LLM judges on 4 dimensions (coverage, rank precision, relevancy, recall)." |
| 4 | `src/content/experience.ts` line 37 (Asurion bullet 3) | `5` enterprise tenants (AT&T, Verizon, Amazon) | line 13 — "automate content audits across 5 enterprise tenants including AT&T, Verizon, and Amazon." |
| 5 | `src/content/experience.ts` line 39 (Asurion bullet 4) | `zero-code` config (qualitative "0" — verbatim from resume) | line 12 — "Cut tenant onboarding from full-code to zero-code config." See Open Question #1 below. |
| 6 | `src/app/page.tsx` line 41 (hero tagline) + `src/content/site.ts` line 23 | None — identity statement, not a content sentence. The resume line 9 ("AI Engineer, Asurion, LLC") establishes role+company; this is a label, not a claim. | line 9 |
| 7 | `src/app/layout.tsx` line 31 (metadata description) | None — identity/positioning statement, not a content claim. | n/a (label) |

Status of Item 1: **[x] PASSES with one open question (see Open Question #1).** Every Asurion *content sentence* on the site cites a resume number. Identity labels ("AI Engineer @ Asurion") are exempt because they make no quantitative claim — they identify the role.

### Item 2: No internal Asurion product / codename / queue / team names anywhere

Files scanned:

- [x] `src/app/page.tsx` (About + Contact) — no internal Asurion proper nouns. About paragraph 3 references only "RAG systems", "evaluation frameworks", "enterprise troubleshooting assistant" (generic role descriptors) and the public-tech terms `hybrid search`, `cross-encoder reranking`, `contextual chunking` (all disclosed by resume line 14).
- [x] `src/content/experience.ts` (Asurion role + bullets + tags) — bullets disclose only what the resume discloses: `Corrective RAG`, `hybrid search`, `cross-encoder reranking`, `Exa`, `Gemini Search`, `Brave Search`, `LLM-as-Judge`, plus the named enterprise tenants `AT&T`, `Verizon`, `Amazon` (resume line 13 — public disclosure). No internal Asurion product names, codenames, queue names, or team names.
- [x] `src/content/projects.ts` — vacuously passes (personal projects only; no Asurion content).
- [x] `src/content/site.ts` — vacuously passes (only the company name "Asurion" appears in the tagline).
- [x] `src/content/uses.ts` — vacuously passes (tooling list; no Asurion content).
- [x] `public/diagrams/asurion-rag-pipeline.svg` — labels strictly from D-Asurion-04 whitelist `{Ingestion, Embed, Vector Store, Retriever, Reranker, LLM, Eval}`. No internal Asurion proper nouns. The literal word "Asurion" does NOT appear inside the SVG file. `<title>` and `<desc>` describe only the generic RAG pipeline.

Status of Item 2: **[x] PASSES.**

### Item 3: No screenshots of any Asurion internal system

- [x] `ls public/` — files are `diagrams/` (only the 2 SVGs and the `_placeholder.svg`), and the scaffold residuals (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`). No PNG/JPG/screenshot files. No Asurion system imagery.
- [x] `grep -rE "\.(png|jpg|jpeg|webp|avif)" src/content/ src/app/` — returns no Asurion-referenced image paths. The only image references in the codebase point to the two locally-authored SVGs in `public/diagrams/`.

Status of Item 3: **[x] PASSES.**

## DIAG-01 specific check (D-Asurion-04)

- [x] All box labels on `public/diagrams/asurion-rag-pipeline.svg` are from the whitelist `{Ingestion, Embed, Vector Store, Retriever, Reranker, LLM, Eval}`. Verified mechanically: `grep -oE ">[A-Z][A-Za-z][a-zA-Z ]*<" public/diagrams/asurion-rag-pipeline.svg | sort -u` returns exactly the 7 whitelisted labels (plus the `<title>` "RAG pipeline architecture" which is accessibility metadata, not a node label).
- [x] No public-tech names on DIAG-01: `grep -iE "(pgvector|langsmith|langchain|vertex|anthropic|openai|claude|gpt|gemini)" public/diagrams/asurion-rag-pipeline.svg` returns 0.

Status of DIAG-01 check: **[x] PASSES.**

## Open Questions for Reviewer

These were flagged by prior plans' executors and surfaced now for resolution against the resume.

### Open Question #1: Asurion bullet 4 — "Shipped" vs "Built" verb choice and number presence

- **Current copy** (`src/content/experience.ts` line 39): "Shipped a multi-tenant troubleshooting chatbot with LLM tool orchestration that cut tenant onboarding from full-code to zero-code config."
- **Resume line 12 verbatim:** "Built a multi-tenant troubleshooting chatbot with LLM tool orchestration. Cut tenant onboarding from full-code to zero-code config."
- **Drift:** The bullet substitutes "Shipped" for the resume's "Built". The resume's "Built" is the source-of-truth verb.
- **Number question:** The only "number" in this sentence is `zero-code` (qualitative). D-Asurion-03 requires "every Asurion sentence contains a number sourced from RESUME-2026-05.md". "zero-code" is verbatim from the resume but is a qualitative descriptor, not a digit.
- **Recommendation:** Change "Shipped" → "Built" (resume-canonical verb). Accept "zero-code" as the resume's own qualitative number disclosure — it appears verbatim on line 12 and is the project's actual quantitative claim.
- **Resolution (2026-06-20, phase closeout):** Applied — `src/content/experience.ts` line 39 now reads "Built …", matching the resume-canonical verb and the inline citation comment. "zero-code" accepted as the resume's verbatim qualitative disclosure.

### Open Question #2: "Corrective RAG" used as a tag-chip — paper-trail term

- **Current tag** (`src/content/experience.ts` line 48): `Corrective RAG`.
- **Resume disclosure:** Line 13 verbatim — "using Corrective RAG classification". Resume itself discloses the term.
- **Concern raised by prior summaries:** Reads as a paper-trail term (links to a public research paper). No confidentiality issue — the disclosure is explicit on the resume.
- **Recommendation:** Keep as-is. Resume verbatim disclosure removes confidentiality risk.

### Open Question #3: `daily-weather-pipeline` metric value "Daily" — unsourced cadence

- **Current value** (`src/content/projects.ts` line 113): metric.value = "Daily".
- **Resume disclosure:** Line 53 — "An Airflow DAG deployed on GCP Cloud Composer that ingests daily NWS weather data into MongoDB Atlas, merges into BigQuery, and retrains a BigQuery ML model to predict next-day max temperature." The word "daily" is resume-disclosed; specific retraining cadence is implied but not stated as a metric.
- **Personal project — not Asurion.** D-Asurion-03 does not apply.
- **Recommendation:** Keep. Resume uses "daily" verbatim.

### Open Question #4: Tax Analyst date format "May 2022 – February 2025" — long form

- **Current** (`src/content/experience.ts` line 60): `"May 2022 – February 2025"` (long form).
- **Compared to:** Asurion `"Oct 2025 – Present"` and FWD `"May 2021 – August 2021"` — formatting mixed.
- **Not a confidentiality concern.** Surfaced for visual consistency at Task 4.
- **Recommendation:** Defer to visual checkpoint.

### Open Question #5: Asurion 7-chip tag row wraps to 3-4 lines at 375px — visual

- **Visual concern only.** Surfaced at Task 4 visual sanity pass.
- **Not a confidentiality concern.**

### Open Question #6: `sf-date-night-concierge` "third of its rows" — unsourced estimate

- **Current** (`src/content/projects.ts` line 54): problem string mentions "a year-old database is wrong about a third of its rows".
- **Resume disclosure:** None — the resume does not contain this estimate.
- **Personal project — not Asurion.** D-Asurion-03 does not apply.
- **Recommendation:** Treat as Claude's first-person rhetorical framing on a personal project. Not a confidentiality issue. If James wants the framing tightened, that's a copy edit, not a confidentiality fail.

### Open Question #7: `gtm-research-pipeline` κ-comparison wording precision

- **Current** (`src/content/projects.ts` line 76): approach string describes Cohen's kappa methodology.
- **Resume disclosure:** Line 44 — "Designed an LLM-as-judge eval framework with cross-family judge calibration (Cohen's kappa) to detect same-family self-preference bias."
- **Personal project — not Asurion.**
- **Recommendation:** Verify wording precision against the resume during James's editorial pass. Not a confidentiality issue.

### Open Question #8: `voice-intent-eval` "eight categories" enumeration

- **Current** (`src/content/projects.ts` line 103): approach lists 8 specific category names.
- **Resume disclosure:** Line 48 — "Hit 100% intent accuracy across 80 scenarios in 8 categories." Specific category names are NOT enumerated on the resume.
- **Personal project — not Asurion.** Not a confidentiality issue.
- **Concern:** Verify the 8 category names enumerated in the approach paragraph match the actual project's category set.

### Open Question #9: `daily-weather-pipeline` task-idempotency claim

- **Current** (`src/content/projects.ts` line 130): "Each task is idempotent: a re-run of any stage produces the same downstream state".
- **Resume disclosure:** Not on the resume.
- **Personal project — not Asurion.** Not a confidentiality issue.
- **Recommendation:** James verifies the claim is technically accurate.

## Resolution Notes

Items 2, 3, and the DIAG-01 specific check pass cleanly with mechanical verification. Item 1 passes with one verb-choice nit (Open Question #1). Open Questions #2 through #9 are voice/factual ambiguities surfaced by prior plans — most are personal-project framing (not confidentiality concerns) and can be resolved during the Task 4 visual editorial pass.

## Sign-off

Signed: James Nhek
