// Home shell — Phase 2 closer (Plan 02-05).
//
// Composes the frozen Phase 1 hero (lines below — byte-identical to Plan
// 01-02 / SEC-01) with REAL Experience + Featured Projects content sourced
// from `src/content/experience.ts` and `src/content/projects.ts`, plus the
// REAL About copy (Plan 02-05 Task 3) and REAL Contact section (mailto +
// CopyEmail + LinkedIn + GitHub).
//
// Section count on / is exactly 4 (UI-SPEC §"Section numbering scheme on /"
// is locked): 01. About → 02. Experience → 03. Featured Projects → 04.
// Contact. The home `04. Uses` section is REMOVED — /uses is reachable only
// via the SiteFooter `/uses` link (USES-03, D-Uses-03). DIAG-01 lives
// inside the Asurion ExperienceBlock (Plan 02-05 Task 2), NOT in About.
//
// CopyEmail is the only client island on the route — the rest of the page
// is a Server Component tree. `email` is passed as a prop from
// `site.email` (server-side); CopyEmail never imports the env module.
//
// Server Component (no client-island directive). The hero stays inline
// because it carries the only <h1> on the page (Section defaults to <h2>).
import { ProjectCard } from "@/components/cards/ProjectCard";
import { EducationItem } from "@/components/experience/EducationItem";
import { ExperienceBlock } from "@/components/experience/ExperienceBlock";
import { CopyEmail } from "@/components/interactive/CopyEmail";
import { ExternalLink } from "@/components/primitives/ExternalLink";
import { Section } from "@/components/primitives/Section";
import { roles, education } from "@/content/experience";
import { site } from "@/content/site";
import { getAllProjects } from "@/lib/content";

export default function Home() {
  return (
    <main>
      {/* Hero — outside any <section>. The only <h1> on the page. */}
      <header className="px-6 pt-24 pb-12 md:px-12 md:pt-32 md:pb-16">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-[length:var(--text-display)] leading-[var(--leading-display)] font-medium tracking-[-0.02em] text-[color:var(--color-ink)]">
            James Nhek
          </h1>
          <p className="mt-6 text-[length:var(--text-subhead)] leading-[var(--leading-snug)] font-medium text-[color:var(--color-ink)]">
            AI Engineer @ Asurion
          </p>
          <p className="mt-3 text-[length:var(--text-body)] leading-[var(--leading-body)] text-[color:var(--color-ink)]">
            RAG · evaluations · agentic workflows
          </p>
          <p className="mt-1 text-[length:var(--text-body)] leading-[var(--leading-body)] text-[color:var(--color-ink)]">
            San Francisco — open to AI Engineer roles.
          </p>
        </div>
      </header>

      <Section id="about" number="01" title="About">
        <div className="space-y-6 text-[length:var(--text-body)] leading-[var(--leading-body)] text-[color:var(--color-ink)]">
          <p>
            I started out as a tax analyst and ended up an AI engineer — which
            is a stranger sentence than it looks on paper. The throughline is
            that both jobs are really about pattern-matching at scale: finding
            the discrepancy across 73 clients&rsquo; payroll filings turns out
            to use the same brain muscle as finding the failure mode in a
            retrieval pipeline.
          </p>
          <p>
            In between I did data work at FWD Life Insurance in Phnom Penh,
            automated the tax workflow in Python (40% of the manual time gone,
            which mostly meant I had time to read papers), and went back to
            grad school at USF for an M.S. in Data Science. Somewhere in there
            the LLM wave landed and the question stopped being whether to
            pivot and became how fast.
          </p>
          {/* Resume source: RESUME-2026-05.md line 14 — "Lifted retrieval accuracy 10.6% over the production baseline with hybrid search (lexical + semantic), cross-encoder reranking, and contextual chunking."
              DRY note (WR-04): the 10.6% figure also appears, cited to the same resume line, in src/content/experience.ts (Asurion bullet 1). If the resume number changes, update BOTH sites and re-run the confidentiality gate (the resume sha256 binding in CONFIDENTIALITY-REVIEW.md will flag the drift). */}
          <p>
            Now I&rsquo;m at Asurion building RAG systems and evaluation
            frameworks for an enterprise troubleshooting assistant — most
            recently lifting retrieval accuracy 10.6% over the production
            baseline with hybrid search, cross-encoder reranking, and
            contextual chunking.
          </p>
        </div>
      </Section>

      <Section id="experience" number="02" title="Experience">
        <div className="space-y-12 md:space-y-16">
          {roles.map((role) => (
            <ExperienceBlock key={role.company} role={role} />
          ))}
        </div>
        <hr className="my-12 border-t border-[color:var(--color-rule)] md:my-16" />
        <div className="space-y-6">
          {education.map((ed) => (
            <EducationItem
              key={ed.program}
              program={ed.program}
              institution={ed.institution}
              dates={ed.dates}
            />
          ))}
        </div>
      </Section>

      <Section id="projects" number="03" title="Featured Projects">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {getAllProjects().map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
        <p className="mt-12">
          <ExternalLink href={site.github}>See more on GitHub</ExternalLink>
        </p>
      </Section>

      <Section id="contact" number="04" title="Contact">
        <div className="space-y-4 text-[length:var(--text-body)] leading-[var(--leading-body)] text-[color:var(--color-ink)]">
          <p className="text-[color:var(--color-ink-muted)]">
            Email is the fastest way to reach me.
          </p>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
            <ExternalLink href={`mailto:${site.email}`}>
              {site.email}
            </ExternalLink>
            <CopyEmail email={site.email} />
          </div>
          <div className="flex flex-col gap-3 md:flex-row md:gap-4">
            <ExternalLink href={site.linkedin}>LinkedIn</ExternalLink>
            <ExternalLink href={site.github}>GitHub</ExternalLink>
          </div>
        </div>
      </Section>
    </main>
  );
}
