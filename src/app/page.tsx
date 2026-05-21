// Home shell — Phase 1 (Plan 01-02).
//
// Refactored from Plan 01-01's inline shell to compose the 5 design-system
// primitives. Visible output is additively extended from Plan 01-01: same
// hero, same 5 numbered sections, same verbatim Copywriting Contract — plus
// a placeholder diagram in About, a `LangGraph` chip in Experience, and a
// clickable `github.com/pjnhek` ExternalLink in Featured Projects.
//
// Server Component (no client-island directive). The hero stays inline
// because it carries the only `<h1>` on the page (Section defaults to `<h2>`).
import { ArchitectureDiagram } from "@/components/primitives/ArchitectureDiagram";
import { ExternalLink } from "@/components/primitives/ExternalLink";
import { Section } from "@/components/primitives/Section";
import { Tag } from "@/components/primitives/Tag";

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
        <p className="text-[length:var(--text-body)] leading-[var(--leading-body)] text-[color:var(--color-ink-muted)]">
          Coming soon — the tax-analyst → AI-engineer pivot.
        </p>
        <ArchitectureDiagram
          src="/diagrams/_placeholder.svg"
          alt="Placeholder architecture diagram — generic box-and-arrow layout used to exercise the ArchitectureDiagram primitive before Phase 2 ships real diagrams."
          caption="Placeholder — replaced in Phase 2."
        />
      </Section>

      <Section id="experience" number="02" title="Experience">
        <p className="text-[length:var(--text-body)] leading-[var(--leading-body)] text-[color:var(--color-ink-muted)]">
          Coming soon — Asurion and prior roles. <Tag>LangGraph</Tag>
        </p>
      </Section>

      <Section id="projects" number="03" title="Featured Projects">
        <p className="text-[length:var(--text-body)] leading-[var(--leading-body)] text-[color:var(--color-ink-muted)]">
          Coming soon — four projects on agents, RAG, evaluations, and data
          pipelines.{" "}
          <ExternalLink href="https://github.com/pjnhek">
            github.com/pjnhek
          </ExternalLink>
        </p>
      </Section>

      <Section id="uses" number="04" title="Uses">
        <p className="text-[length:var(--text-body)] leading-[var(--leading-body)] text-[color:var(--color-ink-muted)]">
          Coming soon — model defaults, MCP servers, eval stack, agent
          framework.
        </p>
      </Section>

      <Section id="contact" number="05" title="Contact">
        <p className="text-[length:var(--text-body)] leading-[var(--leading-body)] text-[color:var(--color-ink-muted)]">
          Coming soon — email, LinkedIn, GitHub.
        </p>
      </Section>
    </main>
  );
}
