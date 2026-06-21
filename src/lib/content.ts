/**
 * SERVER-ONLY content accessors (CONT-06). DO NOT import from Client Components.
 *
 * Phase 2's confidentiality discipline (D-Asurion-01..04) keeps Asurion content
 * in build-time TypeScript modules — never runtime-fetched. Consumed by:
 *   - `src/app/projects/[slug]/page.tsx` (generateStaticParams + page body)
 *   - `src/app/page.tsx` Featured-Projects section (getAllProjects())
 *
 * `getProject(slug)` returns `Project | undefined` (NOT `Project`) because of
 * `noUncheckedIndexedAccess` (tsconfig.json line 8) — `Array.prototype.find`
 * always returns `T | undefined`. Callers MUST narrow via `notFound()` before
 * render. Do not "improve" this signature to `Project` with a non-null
 * assertion; that breaks the strict-mode contract the rest of the codebase
 * relies on.
 *
 * No zod runtime validation here (unlike `lib/env.ts`). Content is typed-TS at
 * build; TypeScript checks the shape. Runtime validation would duplicate
 * compile-time guarantees with zero added safety — 02-RESEARCH.md line 156
 * explicitly flags zod as "available but unused in Phase 2."
 */
import { projects } from "@/content/projects";
import type { Project } from "@/types/content";

export function getAllProjects(): readonly Project[] {
  return projects;
}

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
