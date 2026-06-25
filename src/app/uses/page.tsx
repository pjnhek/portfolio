// /uses route (USES-01, USES-02, USES-03, D-Uses-01..04, UI-SPEC §"Per-route page composition: /uses" lines 773-793).
//
// Static AI-engineer-specific tools page — 5 numbered Sections, one per locked
// UsesCategory (D-Uses-01). Reachable from `SiteFooter` (USES-03, shipped Plan
// 02-02) and links back to home via `BackLink` (USES-03, shipped Plan 02-03).
// SiteFooter is composed at the layout level (`src/app/layout.tsx`), so this
// route inherits it without rendering `<SiteFooter />` here.
//
// Server Component (no `"use client"`). Statically pre-rendered at build time
// — no dynamic params, no data fetching. `pnpm build` emits a single static
// `.html` + `.rsc` for /uses.
//
// Metadata is now wired through `buildMetadata` (Phase 3 / SEO-01..04),
// which sets title, description, social-card image, and twitter card.
//
// The H1 renders at `--text-heading`, NOT `--text-display` — `--text-display`
// is reserved for the home `<h1>` "James Nhek" sitewide.
import type { Metadata } from "next";
import { BackLink } from "@/components/nav/BackLink";
import { Section } from "@/components/primitives/Section";
import { UsesEntry } from "@/components/uses/UsesEntry";
import { uses } from "@/content/uses";
import type { UsesCategory } from "@/types/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Uses — James Nhek",
  description:
    "Models, MCP servers, eval stack, agent framework, and dev workflow I reach for in 2026.",
  path: "/uses",
});

// Filter the typed `uses` array by category. UsesCategory is a closed string-
// literal union (`src/types/content.ts`), so a typo here is a TS compile error.
// Adding a 6th category would force this helper's call sites to update — TS
// catches the drift (T-02-04-CAT mitigation).
const byCategory = (cat: UsesCategory) =>
  uses.filter((u) => u.category === cat);

export default function UsesPage() {
  return (
    <main>
      <div className="mx-auto max-w-2xl px-6 pt-8 pb-4 md:px-12 md:pt-12">
        <BackLink href="/">Back to home</BackLink>
      </div>
      <header className="mx-auto max-w-2xl px-6 pb-12 md:px-12 md:pb-16">
        <h1 className="text-[length:var(--text-heading)] font-medium tracking-[-0.01em] text-[color:var(--color-ink)]">
          Uses
        </h1>
        <p className="mt-3 text-[length:var(--text-body)] text-[color:var(--color-ink-muted)]">
          What I reach for in 2026.
        </p>
      </header>
      <Section number="01" title="Models" id="models">
        <ul className="space-y-3">
          {byCategory("Models").map((u) => (
            <UsesEntry key={u.name} name={u.name} rationale={u.rationale} />
          ))}
        </ul>
      </Section>
      <Section number="02" title="MCP Servers" id="mcp-servers">
        <ul className="space-y-3">
          {byCategory("MCP Servers").map((u) => (
            <UsesEntry key={u.name} name={u.name} rationale={u.rationale} />
          ))}
        </ul>
      </Section>
      <Section number="03" title="Eval Stack" id="eval-stack">
        <ul className="space-y-3">
          {byCategory("Eval Stack").map((u) => (
            <UsesEntry key={u.name} name={u.name} rationale={u.rationale} />
          ))}
        </ul>
      </Section>
      <Section number="04" title="Agent Framework" id="agent-framework">
        <ul className="space-y-3">
          {byCategory("Agent Framework").map((u) => (
            <UsesEntry key={u.name} name={u.name} rationale={u.rationale} />
          ))}
        </ul>
      </Section>
      <Section number="05" title="Dev Workflow" id="dev-workflow">
        <ul className="space-y-3">
          {byCategory("Dev Workflow").map((u) => (
            <UsesEntry key={u.name} name={u.name} rationale={u.rationale} />
          ))}
        </ul>
      </Section>
    </main>
  );
}
