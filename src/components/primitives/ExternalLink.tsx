// ExternalLink primitive (FOUND-08, UI-SPEC.md §4).
//
// Hard-codes `target="_blank" rel="noopener noreferrer"` — defends against
// reverse-tabnabbing (T-01-TABNAB in the threat model). Underline + offset is
// the visual treatment; the trailing `↗` (U+2197 NORTH EAST ARROW — NOT `→`)
// is `aria-hidden` so screen readers don't announce "northeast arrow".
// `focus-visible:` outline anticipates POL-07 (keyboard-only nav).
//
// Defense-in-depth (WR-01): the `href` is validated at render against an
// allowlist of safe protocols (`http:`, `https:`, `mailto:`). React 18+ blocks
// `javascript:` URL navigation at render time, but the primitive is reused
// across the site and Phase 2 will wire real URLs through it, so we enforce
// the boundary here rather than trusting every caller. If the protocol is
// not allowlisted, the primitive degrades gracefully: it renders the children
// as plain text (no `<a>` wrapper) and warns in development. The UI-SPEC.md
// `href: string` prop shape is preserved — this is purely additive runtime
// hardening.
//
// Server Component (no client-island directive). No event handlers.
import type { ReactNode } from "react";

type ExternalLinkProps = {
  href: string;
  children: ReactNode;
  showGlyph?: boolean;
};

// Allowlist matches the documented use cases for this primitive: external
// HTTPS links (Projects, footer), legacy HTTP, and `mailto:` (Phase 2 Contact).
// `tel:`, `data:`, `javascript:`, `vbscript:`, and `file:` are intentionally
// excluded.
const SAFE_PROTOCOLS = ["https://", "http://", "mailto:"] as const;

function isSafeHref(href: string): boolean {
  return SAFE_PROTOCOLS.some((p) => href.startsWith(p));
}

export function ExternalLink({
  href,
  children,
  showGlyph = true,
}: ExternalLinkProps) {
  if (!isSafeHref(href)) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `ExternalLink: unsafe href protocol blocked. Got "${href.slice(0, 32)}"; expected one of ${SAFE_PROTOCOLS.join(", ")}. Rendering children as plain text.`,
      );
    }
    return <>{children}</>;
  }

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
