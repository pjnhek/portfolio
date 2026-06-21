// content/* types (CONT-01).
//
// Pure type module — no runtime exports. Consumed by:
//   - `src/content/site.ts`        (SiteConfig — CONT-02)
//   - `src/content/experience.ts`  (Role, EducationItem — CONT-03)
//   - `src/content/projects.ts`    (Project, Metric — CONT-04)
//   - `src/content/uses.ts`        (UsesItem, UsesCategory — CONT-05)
//   - `src/lib/content.ts`         (server-side accessors — CONT-06)
//   - Every Server Component that renders portfolio content
//
// Designed to be strict-mode-safe under `noUncheckedIndexedAccess` (tsconfig.json
// line 8): `getProject(slug)` returns `Project | undefined`, callers must narrow
// via `notFound()` before rendering. Array.prototype.find always returns
// `T | undefined` under this flag — the lib/content accessor signatures honor it.
//
// Field shapes are locked verbatim per 02-RESEARCH.md §"Type definitions"
// (lines 614-673) and 02-UI-SPEC.md §Components (typed props per primitive).

export type SiteConfig = {
  name: string;
  tagline: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  baseUrl: string;
};

export type Metric = {
  value: string;
  label: string;
};

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  metric: Metric;
  tech: string[];
  github: string;
  demo?: string;
  description?: string;
  problem: string;
  approach: string;
  result: string;
  diagram?: { src: string; alt: string; caption: string };
};

export type Role = {
  title: string;
  company: string;
  dates: string;
  location: string;
  bullets: string[];
  // D-Exp-03: tags appear on the Asurion role only. Tax Analyst + FWD render as
  // prose bullets without tech chips.
  tags?: string[];
};

export type EducationItem = {
  program: string;
  institution: string;
  dates: string;
};

// D-Uses-01 / D-Uses-04: 5 locked categories. /uses page renders one numbered
// Section per category. Adding a sixth category requires a UI-SPEC amendment.
export type UsesCategory =
  | "Models"
  | "MCP Servers"
  | "Eval Stack"
  | "Agent Framework"
  | "Dev Workflow";

export type UsesItem = {
  category: UsesCategory;
  name: string;
  rationale: string;
};
