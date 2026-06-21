// Experience content (CONT-03, D-Exp-01..04, D-Asurion-01..04).
//
// CONFIDENTIALITY DISCIPLINE (D-Asurion-01..04):
// Every Asurion-touching string in this file MUST trace to a numbered line in
// `.planning/refs/RESUME-2026-05.md` via an inline `// Resume source:` comment.
// The confidentiality gate (Plan 02-05, D-Review-03 item 1) verifies this
// mechanically — sentences without a citation are unshipable.
//
// HARD RULES:
//   - Every Asurion bullet contains a NUMBER sourced from the resume (D-Asurion-03).
//   - No internal Asurion product names, codenames, queue names, team names,
//     or screenshots ANYWHERE (D-Asurion-04). The only Asurion proper noun
//     that appears on the site is the company name "Asurion" itself.
//   - Asurion COPY (this file) may include public-tech names that the resume
//     itself discloses (D-Asurion-01). The Asurion DIAGRAM (DIAG-01) is
//     governed by stricter rules — generic role labels only — but that
//     constraint binds the SVG in public/diagrams, NOT this copy module.
//   - Tag-chip row appears on the Asurion role ONLY (D-Exp-03). Tax Analyst
//     and FWD render as prose bullets without tech chips.
//
// SERVER-ONLY (no client directive). Consumed at build time by
// `src/app/page.tsx` Experience section.
import type { Role, EducationItem } from "@/types/content";

export const roles: Role[] = [
  {
    title: "AI Engineer",
    company: "Asurion",
    dates: "Oct 2025 – Present",
    location: "San Francisco, CA",
    bullets: [
      // Resume source: RESUME-2026-05.md line 14 — "Lifted retrieval accuracy 10.6% over the production baseline with hybrid search (lexical + semantic), cross-encoder reranking, and contextual chunking."
      // DRY note (WR-04): the 10.6% figure also appears in the home About closer (src/app/page.tsx). If the resume number changes, update BOTH sites and re-run the confidentiality gate.
      "Lifted retrieval accuracy 10.6% over the production baseline with hybrid search (lexical + semantic), cross-encoder reranking, and contextual chunking.",
      // Resume source: RESUME-2026-05.md line 15 — "Built a RAG eval framework with 249 synthetic QA pairs and 11 query transformations. Benchmarked LLM judges on 4 dimensions (coverage, rank precision, relevancy, recall). First systematic eval process across tenants."
      "Built a RAG evaluation framework with 249 synthetic QA pairs and 11 query transformations, benchmarking LLM judges on 4 dimensions (coverage, rank precision, relevancy, recall) — the first systematic eval process across tenants.",
      // Resume source: RESUME-2026-05.md line 13 — "Built a knowledge base health pipeline using Corrective RAG classification, reranker scoring, and multi-source web validation (Exa, Gemini Search, Brave Search) to automate content audits across 5 enterprise tenants including AT&T, Verizon, and Amazon."
      "Built a knowledge-base health pipeline using Corrective RAG classification, reranker scoring, and multi-source web validation (Exa, Gemini Search, Brave Search) to automate content audits across 5 enterprise tenants including AT&T, Verizon, and Amazon.",
      // Resume source: RESUME-2026-05.md line 12 — "Built a multi-tenant troubleshooting chatbot with LLM tool orchestration. Cut tenant onboarding from full-code to zero-code config."
      "Built a multi-tenant troubleshooting chatbot with LLM tool orchestration that cut tenant onboarding from full-code to zero-code config.",
    ],
    // D-Exp-03: Asurion role only. Public-tech names disclosed by the resume
    // (lines 12-15) — Corrective RAG, hybrid search, multi-source web search
    // providers, LLM-judge framework — abstracted to chip-sized labels.
    // Resume source: RESUME-2026-05.md lines 12-15 — verbatim disclosure of
    // "Corrective RAG", "hybrid search", "Exa", "Gemini Search", "Brave Search",
    // "LLM-as-judge" framing.
    tags: [
      "Corrective RAG",
      "Hybrid Search",
      "Cross-Encoder Reranking",
      "LLM-as-Judge",
      "Exa",
      "Gemini Search",
      "Brave Search",
    ],
  },
  {
    title: "Tax Analyst",
    company: "A to Z Tax Services",
    dates: "May 2022 – February 2025",
    location: "San Leandro, CA",
    bullets: [
      "Managed accounts receivable, bookkeeping, and month-end close for 12+ business clients, building reconciliation workflows that reduced reporting errors and kept GAAP-compliant financial reporting on schedule.",
      "Owned quarterly payroll-tax filings for 73 clients (500+ employees), analyzing discrepancy patterns across accounts to prioritize resolution and ensure regulatory compliance.",
      "Built Python email automation to process payroll-tax notifications for 73 clients (500+ employees), cutting manual processing time by 40%.",
    ],
  },
  {
    title: "Data Analyst",
    company: "FWD Life Insurance",
    dates: "May 2021 – August 2021",
    location: "Phnom Penh, Cambodia",
    bullets: [
      "Programmed analytical scripts to optimize consumer ad placements using regional market data, increasing click-through rates by 29.83%.",
      "Researched ethical risks of using confidential consumer information and articulated frameworks to stakeholders to preserve consumer trust.",
      "Collaborated with the actuary team to calculate FWD Short Savings' premium and reimbursement rates, resulting in a 7.69% increase in product competitiveness.",
    ],
  },
];

export const education: EducationItem[] = [
  {
    program: "M.S. Data Science",
    institution: "University of San Francisco",
    dates: "July 2025 – June 2026",
  },
  {
    program: "B.S. Mathematics + Data Science",
    institution: "University of Houston",
    dates: "2021",
  },
];
