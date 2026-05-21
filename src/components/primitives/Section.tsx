// Section primitive (FOUND-08, UI-SPEC.md §1).
//
// Semantic `<section>` wrapper that enforces vertical rhythm
// (`py-16 md:py-24`) and the centered content column (`mx-auto max-w-2xl px-6
// md:px-12`). Composes `NumberedHeading` — sections never hard-code the
// `"01."` prefix.
//
// Server Component (no client-island directive). No event handlers.
import type { ReactNode } from "react";
import { NumberedHeading } from "@/components/primitives/NumberedHeading";

type SectionProps = {
  id: string;
  number: string;
  title: string;
  children: ReactNode;
};

export function Section({ id, number, title, children }: SectionProps) {
  return (
    <section id={id} className="py-16 md:py-24">
      <div className="mx-auto max-w-2xl px-6 md:px-12">
        <NumberedHeading number={number}>{title}</NumberedHeading>
        {children}
      </div>
    </section>
  );
}
