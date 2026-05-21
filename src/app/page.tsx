// Home shell — Phase 1 (Plan 01-01).
//
// Renders the hero + 5 numbered section placeholders INLINE. This file is
// intentionally text-only; Plan 02 will extract the repeated patterns into the
// `Section` / `NumberedHeading` / `Tag` / `ExternalLink` / `ArchitectureDiagram`
// primitives without changing the visible output. Every string below is
// verbatim from `UI-SPEC.md` `## Copywriting Contract` — do NOT paraphrase.
//
// Server Component (no client-island directive). No icons, no nav, no footer
// in Phase 1.

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

      {/* 01. About */}
      <section id="about" className="py-16 md:py-24">
        <div className="mx-auto max-w-2xl px-6 md:px-12">
          <h2 className="mb-8 flex items-baseline gap-2 md:mb-12">
            <span className="font-mono text-[length:var(--text-caption)] text-[color:var(--color-ink-muted)] tabular-nums">
              01.
            </span>
            <span className="text-[length:var(--text-heading)] leading-[var(--leading-heading)] font-medium tracking-[-0.01em] text-[color:var(--color-ink)]">
              About
            </span>
          </h2>
          <p className="text-[length:var(--text-body)] leading-[var(--leading-body)] text-[color:var(--color-ink-muted)]">
            Coming soon — the tax-analyst → AI-engineer pivot.
          </p>
        </div>
      </section>

      {/* 02. Experience */}
      <section id="experience" className="py-16 md:py-24">
        <div className="mx-auto max-w-2xl px-6 md:px-12">
          <h2 className="mb-8 flex items-baseline gap-2 md:mb-12">
            <span className="font-mono text-[length:var(--text-caption)] text-[color:var(--color-ink-muted)] tabular-nums">
              02.
            </span>
            <span className="text-[length:var(--text-heading)] leading-[var(--leading-heading)] font-medium tracking-[-0.01em] text-[color:var(--color-ink)]">
              Experience
            </span>
          </h2>
          <p className="text-[length:var(--text-body)] leading-[var(--leading-body)] text-[color:var(--color-ink-muted)]">
            Coming soon — Asurion and prior roles.
          </p>
        </div>
      </section>

      {/* 03. Featured Projects */}
      <section id="projects" className="py-16 md:py-24">
        <div className="mx-auto max-w-2xl px-6 md:px-12">
          <h2 className="mb-8 flex items-baseline gap-2 md:mb-12">
            <span className="font-mono text-[length:var(--text-caption)] text-[color:var(--color-ink-muted)] tabular-nums">
              03.
            </span>
            <span className="text-[length:var(--text-heading)] leading-[var(--leading-heading)] font-medium tracking-[-0.01em] text-[color:var(--color-ink)]">
              Featured Projects
            </span>
          </h2>
          <p className="text-[length:var(--text-body)] leading-[var(--leading-body)] text-[color:var(--color-ink-muted)]">
            Coming soon — four projects on agents, RAG, evaluations, and data
            pipelines.
          </p>
        </div>
      </section>

      {/* 04. Uses */}
      <section id="uses" className="py-16 md:py-24">
        <div className="mx-auto max-w-2xl px-6 md:px-12">
          <h2 className="mb-8 flex items-baseline gap-2 md:mb-12">
            <span className="font-mono text-[length:var(--text-caption)] text-[color:var(--color-ink-muted)] tabular-nums">
              04.
            </span>
            <span className="text-[length:var(--text-heading)] leading-[var(--leading-heading)] font-medium tracking-[-0.01em] text-[color:var(--color-ink)]">
              Uses
            </span>
          </h2>
          <p className="text-[length:var(--text-body)] leading-[var(--leading-body)] text-[color:var(--color-ink-muted)]">
            Coming soon — model defaults, MCP servers, eval stack, agent
            framework.
          </p>
        </div>
      </section>

      {/* 05. Contact */}
      <section id="contact" className="py-16 md:py-24">
        <div className="mx-auto max-w-2xl px-6 md:px-12">
          <h2 className="mb-8 flex items-baseline gap-2 md:mb-12">
            <span className="font-mono text-[length:var(--text-caption)] text-[color:var(--color-ink-muted)] tabular-nums">
              05.
            </span>
            <span className="text-[length:var(--text-heading)] leading-[var(--leading-heading)] font-medium tracking-[-0.01em] text-[color:var(--color-ink)]">
              Contact
            </span>
          </h2>
          <p className="text-[length:var(--text-body)] leading-[var(--leading-body)] text-[color:var(--color-ink-muted)]">
            Coming soon — email, LinkedIn, GitHub.
          </p>
        </div>
      </section>
    </main>
  );
}
