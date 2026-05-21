// Tag primitive (FOUND-08, UI-SPEC.md §3).
//
// Tech-stack chip: 1px rule border, Geist Mono caption type, ink text, paper
// background. Non-interactive — no hover state, no touch-target sizing.
//
// Server Component (no client-island directive). No event handlers.
import type { ReactNode } from "react";

type TagProps = {
  children: ReactNode;
};

export function Tag({ children }: TagProps) {
  return (
    <span className="inline-flex items-center rounded-sm border border-[color:var(--color-rule)] px-3 py-1 font-mono text-[length:var(--text-caption)] text-[color:var(--color-ink)]">
      {children}
    </span>
  );
}
