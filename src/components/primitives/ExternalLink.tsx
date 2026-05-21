// ExternalLink primitive (FOUND-08, UI-SPEC.md §4).
//
// Hard-codes `target="_blank" rel="noopener noreferrer"` — defends against
// reverse-tabnabbing (T-01-TABNAB in the threat model). Underline + offset is
// the visual treatment; the trailing `↗` (U+2197 NORTH EAST ARROW — NOT `→`)
// is `aria-hidden` so screen readers don't announce "northeast arrow".
// `focus-visible:` outline anticipates POL-07 (keyboard-only nav).
//
// Server Component (no client-island directive). No event handlers.
import type { ReactNode } from "react";

type ExternalLinkProps = {
  href: string;
  children: ReactNode;
  showGlyph?: boolean;
};

export function ExternalLink({
  href,
  children,
  showGlyph = true,
}: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline decoration-1 underline-offset-[3px] hover:decoration-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-ink)]"
    >
      {children}
      {showGlyph && (
        <span
          aria-hidden="true"
          className="ml-1 align-baseline font-mono text-[0.85em]"
        >
          ↗
        </span>
      )}
    </a>
  );
}
