// Dynamic project detail route (PROJ-01..05; 02-RESEARCH.md §Pattern 1
// lines 322-362; 02-UI-SPEC.md §"/projects/[slug]" lines 745-772).
//
// Pre-renders all 4 project detail pages at build time via
// `generateStaticParams`. Per-page metadata via `generateMetadata` is
// intentionally minimal (`title` + `description` only) — Phase 3 / SEO-01..04
// owns the `lib/seo.ts` factory and the `openGraph`/`twitter` keys. Inlining
// those keys here would force Phase 3 to either undo or merge them
// (02-RESEARCH.md Pitfall 10 line 958). This is the first Next.js 16
// async-params dynamic route in the codebase — `params` is
// `Promise<{ slug: string }>` at the type level and `await params` at the
// implementation level (both signatures).
//
// Layout composition (UI-SPEC §"Per-route page composition: /projects/[slug]"):
//   BackLink → header (H1 at --text-heading, NOT --text-display per UI-SPEC
//   line 96 — display is reserved for the home hero) → subtitle → tech chips
//   → GitHub + optional Demo ExternalLinks → MetricCallout (scale="detail")
//   → 3 numbered Sections: 01 Problem, 02 Approach, 03 Result.
//
// The `project.diagram &&` guard around <ArchitectureDiagram> is dead code in
// Plan 02-03 (no project has `diagram` populated). Plan 02-05 populates
// `voice-intent-eval`'s `diagram` field and ships the SVG; this conditional
// then activates without a route-file edit.
//
// Server Component (no client-island directive). SiteFooter is composed at
// the layout level (src/app/layout.tsx, Plan 02-02) — do NOT render it here.
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArchitectureDiagram } from "@/components/primitives/ArchitectureDiagram";
import { ExternalLink } from "@/components/primitives/ExternalLink";
import { MetricCallout } from "@/components/primitives/MetricCallout";
import { Section } from "@/components/primitives/Section";
import { Tag } from "@/components/primitives/Tag";
import { BackLink } from "@/components/nav/BackLink";
import { getAllProjects, getProject } from "@/lib/content";

export async function generateStaticParams() {
  const projects = getAllProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.title} — James Nhek`,
    description: project.subtitle.slice(0, 160),
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <main>
      <div className="mx-auto max-w-2xl px-6 pt-8 pb-4 md:px-12 md:pt-12">
        <BackLink href="/">Back to home</BackLink>
      </div>

      <header className="mx-auto max-w-2xl px-6 pb-12 md:px-12 md:pb-16">
        <h1 className="text-[length:var(--text-heading)] font-medium tracking-[-0.01em] text-[color:var(--color-ink)]">
          {project.title}
        </h1>
        <p className="mt-3 text-[length:var(--text-body)] leading-[var(--leading-body)] text-[color:var(--color-ink-muted)]">
          {project.subtitle}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {project.tech.map((t, i) => (
            <Tag key={`${i}-${t}`}>{t}</Tag>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-4">
          <ExternalLink href={project.github}>GitHub</ExternalLink>
          {project.demo && (
            <ExternalLink href={project.demo}>Demo</ExternalLink>
          )}
        </div>
        <MetricCallout
          value={project.metric.value}
          label={project.metric.label}
          scale="detail"
        />
      </header>

      <Section number="01" title="Problem" id="problem">
        {project.problem.split("\n\n").map((para, i) => (
          <p
            key={i}
            className="mb-4 text-[length:var(--text-body)] leading-[var(--leading-body)] text-[color:var(--color-ink)]"
          >
            {para}
          </p>
        ))}
      </Section>

      <Section number="02" title="Approach" id="approach">
        {project.approach.split("\n\n").map((para, i) => (
          <p
            key={i}
            className="mb-4 text-[length:var(--text-body)] leading-[var(--leading-body)] text-[color:var(--color-ink)]"
          >
            {para}
          </p>
        ))}
        {project.diagram && (
          <ArchitectureDiagram
            src={project.diagram.src}
            alt={project.diagram.alt}
            caption={project.diagram.caption}
          />
        )}
      </Section>

      <Section number="03" title="Result" id="result">
        {project.result.split("\n\n").map((para, i) => (
          <p
            key={i}
            className="mb-4 text-[length:var(--text-body)] leading-[var(--leading-body)] text-[color:var(--color-ink)]"
          >
            {para}
          </p>
        ))}
      </Section>
    </main>
  );
}
