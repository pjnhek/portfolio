// /uses content seed (CONT-05, D-Uses-01..04, USES-01..03).
//
// POST-JAMES-EDIT (Plan 02-04, D-Uses-04 hand-off resolved):
//   Decision: ship the Plan 02-01 seed AS-IS, PLUS add a single Agent Framework
//   entry — "MCP (Model Context Protocol)" — to hit the D-Uses-01 3-entry
//   floor for that category. Total: 16 entries (Models 4, MCP Servers 3,
//   Eval Stack 3, Agent Framework 3, Dev Workflow 3). All 5 categories now
//   satisfy the 3-6 floor.
//
// The 5 categories (Models, MCP Servers, Eval Stack, Agent Framework, Dev
// Workflow) are locked by D-Uses-01 — they are NOT a generic dev /uses page
// (no editor / shell / hardware / fonts).
//
// Each entry: bold name + one-line "why I picked it" rationale (D-Uses-02).
// /uses page filters this array by category and renders one numbered Section
// per category.
//
// SERVER-ONLY (no client directive). Consumed at build time by
// `src/app/uses/page.tsx`.
import type { UsesItem } from "@/types/content";

export const uses: UsesItem[] = [
  // ---- 01. Models ----
  {
    category: "Models",
    name: "Claude Opus 4.7",
    rationale:
      "default for hard reasoning, agent loops, and anything that needs careful tool use.",
  },
  {
    category: "Models",
    name: "Claude Sonnet 4.5",
    rationale:
      "the everyday model — fast enough for chat-quality tasks, smart enough to not regret it.",
  },
  {
    category: "Models",
    name: "Gemini 2.5 Flash",
    rationale:
      "second-source LLM via MLflow Model Registry aliases; lets me hot-swap providers without redeploying.",
  },
  {
    category: "Models",
    name: "text-embedding-3-small",
    rationale:
      "default embedding model — cheap, strong on English, paired with pgvector + HNSW.",
  },

  // ---- 02. MCP Servers ----
  {
    category: "MCP Servers",
    name: "Context7",
    rationale:
      "library docs at the source of truth — kills the temptation to hallucinate API shapes from training data.",
  },
  {
    category: "MCP Servers",
    name: "Exa",
    rationale:
      "neural web search when I need recent, citation-traceable sources during agent runs.",
  },
  {
    category: "MCP Servers",
    name: "Firecrawl",
    rationale:
      "structured scraping for research pipelines — handles the headless-browser plumbing I don't want to own.",
  },

  // ---- 03. Eval Stack ----
  {
    category: "Eval Stack",
    name: "LLM-as-judge with cross-family calibration",
    rationale:
      "Cohen's kappa across judge families to detect self-preference bias before it ships.",
  },
  {
    category: "Eval Stack",
    name: "Synthetic QA generation",
    rationale:
      "query transformations to stress-test retrieval — paraphrase, multi-hop, negation, distractor.",
  },
  {
    category: "Eval Stack",
    name: "MLflow",
    rationale:
      "runs, params, artifacts in one place — and the Model Registry doubles as a deploy primitive.",
  },

  // ---- 04. Agent Framework ----
  {
    category: "Agent Framework",
    name: "LangGraph",
    rationale:
      "explicit graph topology beats prompt-stuffed chains for anything with tool calls and retries.",
  },
  {
    category: "Agent Framework",
    name: "Pydantic + structured outputs",
    rationale:
      "schema-first tool I/O — validates at the boundary so downstream code can trust the shape.",
  },
  {
    category: "Agent Framework",
    name: "MCP (Model Context Protocol)",
    rationale:
      "the wire protocol behind every MCP server above — knowing the spec means I can build my own when one doesn't exist.",
  },

  // ---- 05. Dev Workflow ----
  {
    category: "Dev Workflow",
    name: "Claude Code",
    rationale:
      "primary IDE-adjacent coding loop — agentic edits, planning artifacts, real diffs on disk.",
  },
  {
    category: "Dev Workflow",
    name: "uv + pyproject.toml",
    rationale:
      "fast resolver, lockfile-by-default, no more `requirements.txt` drift.",
  },
  {
    category: "Dev Workflow",
    name: "pnpm",
    rationale:
      "strict resolution catches missing peer deps; faster installs on Vercel's cache.",
  },
];
