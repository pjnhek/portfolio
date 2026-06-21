// ProjectCard composed component (D-Proj-03, D-Metric-02, SEC-04, SEC-05;
// UI-SPEC §Components/ProjectCard lines 413-462).
//
// Card surface used in the home `03. Featured Projects` grid. Composes:
//   - Next.js <Link>      — whole-card navigation to /projects/{slug}
//   - ExternalLink        — SIBLING (not nested!) GitHub link
//   - MetricCallout       — big-number poster
//   - Tag                 — tech-chip row
//
// CRITICAL nested-anchor avoidance (D-Proj-03 + 02-RESEARCH.md Pattern 2):
// the GitHub <ExternalLink> sits as a SIBLING of <Link> inside the <article>
// boundary — NEVER nested inside the <Link>. Two distinct interactive
// surfaces, no nested <a>, no `stopPropagation`. The 1px --color-rule border
// on <article> encloses both.
//
// Hover on the subtitle line uses motion-safe:transition-colors so users
// with prefers-reduced-motion get an instant color swap. No scale transform,
// no shadow, no background fill — engineering tone, not designer's playground.
//
// Server Component (no client-island directive). No event handlers.
import Link from "next/link";
import { ExternalLink } from "@/components/primitives/ExternalLink";
import { MetricCallout } from "@/components/primitives/MetricCallout";
import { Tag } from "@/components/primitives/Tag";
import type { Project } from "@/types/content";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="border border-[color:var(--color-rule)] p-6">
      <Link
        href={`/projects/${project.slug}`}
        className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-ink)]"
      >
        <h3 className="text-[length:var(--text-subhead)] leading-[var(--leading-snug)] font-medium text-[color:var(--color-ink)]">
          {project.title}
        </h3>
        <p className="mt-2 text-[length:var(--text-body)] leading-[var(--leading-body)] text-[color:var(--color-ink-muted)] group-hover:text-[color:var(--color-ink)] motion-safe:transition-colors">
          {project.subtitle}
        </p>
        <MetricCallout
          value={project.metric.value}
          label={project.metric.label}
        />
        {project.description && (
          <p className="text-[length:var(--text-body)] leading-[var(--leading-body)] text-[color:var(--color-ink)]">
            {project.description}
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tech.map((t, i) => (
            <Tag key={`${i}-${t}`}>{t}</Tag>
          ))}
        </div>
      </Link>
      <div className="mt-6">
        <ExternalLink href={project.github}>GitHub</ExternalLink>
      </div>
    </article>
  );
}
