// ExperienceBlock composed component (D-Exp-02, D-Exp-03; UI-SPEC
// §Components/ExperienceBlock lines 496-533).
//
// Renders one work role: RoleHeader + bullet list + OPTIONAL tag-chip row.
// The tag-chip row only appears when `role.tags && role.tags.length > 0`
// (D-Exp-03) — in src/content/experience.ts only the Asurion role carries
// `tags`; Tax Analyst + FWD render as prose bullets without chips.
//
// Bullet markers use en-dash U+2013 (`–`) — NOT em-dash. The marker lives in
// an <span aria-hidden="true"> absolutely positioned at left: 0 so screen
// readers don't announce "en-dash" for each item. Native <ul> bullet styling
// is suppressed by Tailwind v4's preflight (`list-style: none`).
//
// Plan 02-05 wired DIAG-01 (Asurion RAG pipeline) inline as a Choice-A
// conditional render gated on `role.company === "Asurion"` — chosen over
// the `Role.diagram?` field approach because DIAG-01 is the only diagram
// in Experience for Phase 2 and adding a content-level field for a single
// case adds complexity without benefit (per 02-05-PLAN.md Task 2 §Choice).
// The caption + alt strings are verbatim from UI-SPEC §Asurion diagram
// placement — they themselves carry confidentiality discipline (signaling
// to readers that labels are deliberately abstracted).
//
// Server Component (no client-island directive). No event handlers.
import { ArchitectureDiagram } from "@/components/primitives/ArchitectureDiagram";
import { RoleHeader } from "@/components/experience/RoleHeader";
import { Tag } from "@/components/primitives/Tag";
import type { Role } from "@/types/content";

type ExperienceBlockProps = {
  role: Role;
};

export function ExperienceBlock({ role }: ExperienceBlockProps) {
  return (
    <article className="space-y-4">
      <RoleHeader
        title={role.title}
        company={role.company}
        dates={role.dates}
        location={role.location}
      />
      <ul className="space-y-3">
        {role.bullets.map((b, i) => (
          <li
            key={`${i}-${b}`}
            className="relative pl-4 text-[length:var(--text-body)] leading-[var(--leading-body)] text-[color:var(--color-ink)]"
          >
            <span aria-hidden="true" className="absolute left-0">
              –
            </span>
            {b}
          </li>
        ))}
      </ul>
      {role.company === "Asurion" && (
        <ArchitectureDiagram
          src="/diagrams/asurion-rag-pipeline.svg"
          alt="Box-and-arrow architecture diagram showing a retrieval-augmented generation pipeline: documents flow into Ingestion, then Embed, then a Vector Store. User queries pass through Retriever and Reranker before being sent to an LLM. An Eval loop feeds back into the pipeline."
          caption="Generic RAG pipeline shape. Generic role labels only — no internal product names."
        />
      )}
      {role.tags && role.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {role.tags.map((t, i) => (
            <Tag key={`${i}-${t}`}>{t}</Tag>
          ))}
        </div>
      )}
    </article>
  );
}
