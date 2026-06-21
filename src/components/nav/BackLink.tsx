// BackLink primitive (UI-SPEC §Components/BackLink lines 564-591; PATTERNS §BackLink).
//
// Internal back-arrow link used at the top of every `/projects/[slug]` and
// `/uses` page. Composes Next.js `<Link>` — NOT `<ExternalLink>`. ExternalLink
// hardcodes `target="_blank" rel="noopener noreferrer"`; using it for internal
// navigation would open a new tab AND defeat Next.js client-side route
// prefetching/caching. Sibling primitive to ExternalLink, not a wrapper.
//
// Visual treatment mirrors RoleHeader's caption line and SiteFooter text:
// Geist Mono caption, `--color-ink-muted` at rest → `--color-ink` on hover.
// Focus-ring string is copy-verbatim from ExternalLink.tsx line 57.
//
// The `←` is U+2190 LEFTWARDS ARROW (NOT ASCII `<-`), wrapped in
// `aria-hidden="true"` so screen readers don't announce "leftwards arrow" —
// matches ExternalLink.tsx lines 60-67 (`↗` glyph treatment).
//
// Server Component (no client-island directive). No event handlers.
import Link from "next/link";
import type { ReactNode } from "react";

type BackLinkProps = {
  href: string;
  children: ReactNode;
};

export function BackLink({ href, children }: BackLinkProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center font-mono text-[length:var(--text-caption)] text-[color:var(--color-ink-muted)] hover:text-[color:var(--color-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-ink)]"
    >
      <span aria-hidden="true" className="mr-1">
        ←
      </span>
      {children}
    </Link>
  );
}
