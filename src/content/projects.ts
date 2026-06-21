// Featured projects (CONT-04, D-Proj-01..04, D-Metric-01..03).
//
// Exactly 4 entries in the order locked by ROADMAP.md Phase 2 SC#2:
//   1. sf-date-night-concierge
//   2. gtm-research-pipeline
//   3. voice-intent-eval
//   4. daily-weather-pipeline
//
// Each entry is a typed Project (see `@/types/content`). Personal projects only
// — NO Asurion content here (Pitfall 9 in 02-RESEARCH.md: bullets live in
// exactly one place; Asurion content lives in experience.ts).
//
// Metric strings (D-Metric-03) are LOCKED — verbatim from RESUME-2026-05.md.
// Do not round, do not paraphrase: "5,800+", "Cohen's κ", "100%", and the
// Daily Weather Pipeline retraining-cadence label.
//
// GitHub URLs confirmed by orchestrator at Plan 02-01 Task 0 gate.
// `sf-date-night-concierge` lives at a collaborator repo
// (deshmukh-neel/mlops_city_concierge); `gtm-research-pipeline` repo name
// diverges from display name (pjnhek/poc_scraper). These exact URLs are
// authoritative — do NOT "correct" them to https://github.com/pjnhek/<slug>.
//
// Diagrams are intentionally undefined here. Plan 02-05 adds
// `diagram` to the voice-intent-eval entry (D-Proj-02) once the SVG ships.
//
// Problem/Approach/Result paragraphs are first drafts at 100-180 words each
// (D-Proj-01: 300-500 words per detail page). Plan 02-03 refines voice
// alongside the dynamic-route work; the structure here is the contract,
// the exact prose may evolve.
import type { Project } from "@/types/content";

export const projects: Project[] = [
  {
    slug: "sf-date-night-concierge",
    title: "SF Date Night Concierge",
    subtitle:
      "A LangGraph agent that plans multi-stop SF date nights against a 5,800+ place embeddings store.",
    metric: {
      value: "5,800+",
      label: "place embeddings (pgvector + HNSW)",
    },
    tech: [
      "LangGraph",
      "pgvector",
      "Cloud SQL",
      "MLflow",
      "Cloud Run",
      "text-embedding-3-small",
    ],
    github: "https://github.com/deshmukh-neel/mlops_city_concierge",
    description:
      "Tool-calling agent over an embeddings store of SF places, with a closed-loop ingestion pipeline that turns user activity into new training data.",
    problem:
      "Most date-night recommenders return a flat list — three restaurants, no context. Real planning is multi-stop, time-aware, and geographically constrained: dinner at 7, drinks within walking distance, dessert before the bar closes. Static lookups can't reason about any of that.\n\nThe harder problem is keeping the place catalog fresh without manual curation. SF venues open and close fast enough that a year-old database is wrong about a third of its rows, and a recommender wrong about a third of its rows isn't a recommender.",
    approach:
      "The system pairs a LangGraph tool-calling agent with a pgvector + HNSW store of 5,800+ SF place embeddings (text-embedding-3-small) on Cloud SQL. The agent plans, acts, and self-corrects against temporal and geographic checks, then emits multi-stop itineraries with walking times and Resy/OpenTable deep links.\n\nDeployed on Cloud Run with Alembic migrations and IAM auth. MLflow Model Registry hot-swaps LLMs (Opus 4.7, Gemini 2.5 Flash) via production aliases — model swaps go through registry promotion, not a code deploy. CI/CD runs unit + integration tests against the live DB on every PR.",
    result:
      "The MLOps loop closes via a separate ingestion agent that reads usage logs, finds coverage gaps, generates deduped seed queries, and queues them for ingest — turning user activity into a data flywheel tracked in MLflow.\n\nThe agent ships end-to-end planning behavior instead of a static rec list, and the ingestion loop keeps the catalog fresh without me touching it. The takeaway worth keeping: a vector store is only as useful as the pipeline that keeps it from rotting.",
  },
  {
    slug: "gtm-research-pipeline",
    title: "GTM Research Pipeline",
    subtitle:
      "Async account-research pipeline with citation-traced drafts and an LLM-as-judge eval framework.",
    metric: {
      value: "Cohen's κ",
      label: "LLM-as-judge eval, self-preference bias",
    },
    tech: ["Python", "asyncio", "LLM-as-judge", "Cohen's kappa", "Google Sheets"],
    github: "https://github.com/pjnhek/poc_scraper",
    description:
      "Async account-research pipeline that scores ICP fit and writes citation-traced outreach drafts, paired with a cross-family judge calibration for self-preference bias.",
    problem:
      "Outbound research at GTM scale is two problems jammed together: enriching company data without manual digging, and writing first-draft outreach a human can edit instead of rewriting. Generic LLM drafts read like spam; bespoke per-account research is slow.\n\nThe harder problem is evaluating LLM-generated drafts honestly. Every LLM judge has a known same-family bias — a Claude judge scoring Claude outputs is structurally compromised, and that bias is invisible if you only run one judge.",
    approach:
      "An async Python pipeline (asyncio) enriches company domains, scores ICP fit against an editable rubric, and writes citation-traced outreach drafts into Google Sheets. Citation traceability is non-negotiable: every claim about an account points back to a source URL, so a reviewer can verify any line in seconds.\n\nThe eval layer uses LLM-as-judge with cross-family calibration. Judges from different model families score the same outputs and Cohen's kappa across them measures inter-rater agreement. When κ between same-family judges drifts above the cross-family κ, that's the structural signal for self-preference bias — caught before drafts ship, not after.",
    result:
      "The pipeline produces drafts a human can edit rather than rewrite, with citations that hold up under audit. The eval framework converts a vibes-based bias suspicion into a number on a dashboard: same-family judges trip the κ metric, and that's the cue to rotate them out.\n\nThe methodological move worth keeping: never trust a single LLM judge's score — make the disagreement between judges the actual eval signal, and you stop optimizing for one model's blind spots.",
  },
  {
    slug: "voice-intent-eval",
    title: "Voice Intent Eval",
    subtitle:
      "End-to-end voice eval pipeline with 100% intent accuracy across 80 customer-service scenarios.",
    metric: {
      value: "100%",
      label: "intent accuracy / 80 scenarios",
    },
    tech: [
      "gTTS",
      "faster-whisper",
      "Claude",
      "asyncio",
      "pytest",
      "GitHub Actions",
    ],
    github: "https://github.com/pjnhek/voice-intent-eval",
    description:
      "Simulates customer-service calls through TTS → ASR → two-stage Claude classifier, with a dual-judge benchmark that runs in CI on every PR.",
    diagram: {
      src: "/diagrams/voice-intent-eval-flow.svg",
      alt: "Flow diagram of the voice intent evaluation pipeline: synthesized speech from TTS feeds into ASR transcription, then into a two-stage Claude classifier that rephrases and then classifies intent. Outputs flow to a dual-judge benchmark, then to a CI gate. CI failures loop back into the classifier stage.",
      caption:
        "TTS → ASR → two-stage Claude classifier → dual-judge benchmark → CI, with the CI gate feeding regressions back into the classifier.",
    },
    problem:
      "Voice agents fail in places text agents don't. ASR errors compound through downstream prompts, intent boundaries blur under accent and noise, and end-to-end accuracy stays opaque if you only test the LLM in isolation.\n\nThe harder problem is making the eval reproducible. Random TTS variation makes runs non-deterministic, and a single LLM judge has the same self-preference issue every LLM judge has — so a judge that scores its own family is a measurement instrument that lies to you.",
    approach:
      "The pipeline simulates customer-service calls through TTS (gTTS), ASR (faster-whisper), and a two-stage Claude flow for intent detection and response generation. Eighty scenarios across eight categories cover the realistic intent surface — billing, scheduling, escalation, complaint resolution, account changes, technical support, status checks, and out-of-scope rejection.\n\nBenchmarking pairs a rule-based judge with a Claude semantic judge: dual signal, so semantic drift in one surfaces against the other. Regex slot extraction validates structured outputs, and a 1,300+ line mocked test suite covers every pipeline stage. The whole eval runs in CI on every PR.",
    result:
      "100% intent accuracy across the 80 scenarios — not because the LLM is magic, but because the pipeline catches ASR errors and structured-output drift before they reach the intent classifier. Two-stage classification (rephrase, then classify) turns out to absorb a lot of the noise that single-stage prompts choke on.\n\nThe CI gate is the real win: a regression in any stage — TTS, ASR, slot extraction, intent — surfaces on the PR, not in production. Voice systems fail at the seams; this one tests the seams.",
  },
  {
    slug: "daily-weather-pipeline",
    title: "Daily Weather Pipeline",
    subtitle:
      "Airflow DAG on GCP Cloud Composer that retrains a BigQuery ML model on daily NWS data.",
    metric: {
      value: "Daily",
      label: "Airflow → BigQuery ML",
    },
    tech: [
      "Airflow",
      "Cloud Composer",
      "MongoDB Atlas",
      "BigQuery",
      "BigQuery ML",
      "NWS API",
    ],
    github: "https://github.com/pjnhek/msds697-weather-pipeline",
    description:
      "End-to-end data pipeline: NWS ingest → MongoDB Atlas → BigQuery merge → BigQuery ML next-day-temperature model, retrained daily.",
    problem:
      "Forecasting next-day max temperature is the canonical entry-level ML pipeline, but the pedagogically interesting part isn't the model — it's the orchestration. A model that retrains on stale data drifts, and a pipeline that fails silently is worse than no pipeline.\n\nThe exercise: make the entire path from external API to model artifact reproducible, observable, and scheduled — the data-engineering shape of the problem, not the modeling shape. The model can be a linear regression; the pipeline has to be production-flavored.",
    approach:
      "An Airflow DAG deployed on GCP Cloud Composer ingests daily NWS weather data into MongoDB Atlas, merges it into BigQuery, and retrains a BigQuery ML model that predicts next-day max temperature. Cloud Composer owns scheduling and retries; BigQuery ML keeps the model artifact next to the data so there's no extract step to break.\n\nThe DAG topology — ingest, transform, train, validate — is intentionally boring so a teammate could pick it up in an hour. Each task is idempotent: a re-run of any stage produces the same downstream state, which matters the first time something fails at 2am.",
    result:
      "The pipeline runs daily without manual intervention. The model retrains on fresh NWS data instead of drifting against a stale snapshot, and every stage emits Airflow logs so a failure surfaces in the UI rather than in a silent dashboard.\n\nThe operational takeaway: the boring DAG topology and the idempotent-task discipline are what make the pipeline survive a real failure. The model is the cheap part; the orchestration is what a data engineer ships.",
  },
];
