# pjnhek.com — James Nhek Portfolio

## What This Is

A custom-coded personal portfolio site at **pjnhek.com** for James Nhek, AI Engineer at Asurion. It is built for recruiters and hiring managers evaluating James for AI Engineer roles — a single place to see his current work, prior experience, featured projects, and how to get in touch. The site itself is part of the portfolio: a recruiter should be able to tell it was hand-built without having to look.

## Core Value

A recruiter lands on pjnhek.com, immediately understands "James is a serious AI Engineer doing real RAG/eval work at Asurion," sees 3–4 substantive projects with real depth, and has an obvious way to reach out — all within 60 seconds, on a phone.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

(None yet — ship to validate)

### Active

<!-- Current scope. Building toward these. -->

- [ ] Hero / landing section that names who James is and what he does (AI Engineer, RAG/evals)
- [ ] About section telling the tax analyst → AI engineer pivot story
- [ ] Experience section embedded on-site (Asurion + prior roles) — no resume PDF download required
- [ ] Featured projects section with 4 hand-curated projects (SF Date Night Concierge, GTM Research Pipeline, Voice Intent Eval, Daily Weather Pipeline)
- [ ] Sanitized architecture diagrams for Asurion work (drawn fresh, no proprietary info)
- [ ] Contact section with email and a way to reach out beyond LinkedIn
- [ ] /uses page describing James's stack and setup
- [ ] Custom domain pjnhek.com configured and live
- [ ] Mobile-responsive (recruiters often click on phone first)
- [ ] Fast load + clean Lighthouse scores (the site itself signals engineering quality)
- [ ] Deployed on free tier (Vercel hobby or equivalent)

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- Blog / writing section — Deferred to v2; no posts to launch with, and shipping fast matters more than scaffolding empty pages
- Light/dark mode toggle — One well-designed mode is better than two mediocre ones for v1; can revisit if monochrome feels limiting
- Visitor analytics (Plausible/Vercel/etc.) — Not a v1 priority; add later if there's a reason to instrument
- Auto-pulled GitHub project list — User explicitly wants curated featured projects; auto-pull would surface junk repos (`githubtest`, `poc_scraper`, course repos, etc.)
- Resume PDF download — User wants experience embedded on-site instead, so recruiters don't have to leave the page
- Live RAG demo on the homepage — Powerful but deferred to v2; ship core portfolio first
- Talks / certifications section — Not currently relevant; can add when there is content for it
- CMS / admin panel — Content updates infrequently enough that editing source + redeploying is fine
- Confidential Asurion details — Strict: high-level metrics only (e.g. +10.6% accuracy), sanitized diagrams drawn fresh, no internal screenshots or proprietary terminology

## Context

**About James:**
- AI Engineer at Asurion (Oct 2025 – present): multi-tenant RAG chatbot, KB freshness detection, hybrid search + reranking, RAG eval framework
- USF M.S. in Data Science & AI (July 2025 – June 2026)
- B.S. Math + Data Science, University of Houston (2021)
- Prior career as Tax Analyst (2022–2025) — pivot narrative is a real differentiator
- GitHub: github.com/pjnhek, LinkedIn: linkedin.com/in/pjnhek

**Featured projects (from May 2026 resume, in priority order):**
1. **Agentic SF Date Night Concierge** — LangGraph tool-calling agent over 5,800+ SF place embeddings (pgvector + HNSW on Cloud SQL); MLflow Model Registry hot-swaps LLMs; closed-loop MLOps with ingestion agent
2. **GTM Research Pipeline** — Async Python account-research pipeline with citation-traced outreach drafts; LLM-as-judge eval with Cohen's kappa for self-preference bias detection
3. **Voice Intent Eval** — TTS → ASR → two-stage Claude flow; 100% intent accuracy across 80 scenarios; dual-judge benchmarking with CI
4. **Daily Weather Pipeline** — Airflow on GCP Cloud Composer → MongoDB Atlas → BigQuery → BigQuery ML retraining

**Design reference:** [huyml.co](https://huyml.co/?ref=godly), but more minimal. Numbered sections, monochrome base, generous whitespace, clean sans-serif typography.

**Existing GitHub state:**
- Some repos to keep visible: `voice-intent-eval`, `contextual-chunker`, `msds697-weather-pipeline`, `nba_home_court_advantage`, `pjnhek` (profile README)
- Repos to keep out of featured projects: `githubtest`, `job-scraper`, `poc_scraper`, `pnhek.github.io` (legacy), course/class repos
- The featured-on-site list is intentionally smaller and more curated than what's visible on GitHub

## Constraints

- **Timeline**: Ship ASAP — actively job hunting, so a v1 needs to be live in days/weeks, not months
- **Budget**: Free or near-free hosting only (Vercel free tier or equivalent) — no monthly bills
- **Tech stack**: Next.js + Tailwind + TypeScript, deployed on Vercel — modern, recruiters-recognize-it, free hosting, easy to add interactive demos later
- **Confidentiality**: Asurion content is high-level only with sanitized diagrams; no proprietary architecture, internal tool names, or screenshots from work systems
- **Domain**: Custom domain pjnhek.com (already targeted) — needs DNS configured
- **Aesthetic**: "huyml.co but more minimal" — typography-led, monochrome, lots of whitespace; the site itself should feel like an engineering artifact, not a designer's playground
- **Audience first**: All design decisions arbitrate in favor of "what makes a recruiter trust and remember James in 60 seconds" — not novelty, not personal preference

## Key Decisions

<!-- Decisions that constrain future work. Add throughout project lifecycle. -->

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Custom-coded over template | The site itself is part of the portfolio — recruiters check View Source; "I built this" is a stronger signal than "I configured a template" | — Pending |
| Next.js + Tailwind + TypeScript stack | Industry-standard for modern web, Vercel-native (free hosting), TypeScript signals engineering quality, easy path to add interactive demos in v2 | — Pending |
| Vercel free-tier hosting on pjnhek.com | Zero ongoing cost, fastest path to production, professional custom domain | — Pending |
| Experience embedded on-site, no resume PDF download | Reduces friction — recruiters get everything without leaving the page; the site IS the resume | — Pending |
| Manually-curated featured projects (4 max) | Auto-pull from GitHub would surface junk repos; curation lets each project tell its story properly | — Pending |
| Asurion content: high-level + sanitized fresh-drawn diagrams | Balances showing depth against legal/confidentiality risk; metrics + new diagrams are safe to share | — Pending |
| Live RAG demo deferred to v2 | High signal but adds API cost + complexity; ship core portfolio first | — Pending |
| Blog / light-dark / analytics deferred to v2 | Out-of-scope for v1 to maximize shipping speed; revisit once site is live and being used | — Pending |
| Mobile-first / mobile-responsive required | Recruiters frequently click links on phone first; failing mobile = lost opportunity | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-20 after initialization*
