// SiteFooter primitive (D-Uses-03, USES-03, UI-SPEC §Components/SiteFooter).
//
// Single-line footer (≥md) / stacked at 375px composed once into
// `src/app/layout.tsx` after `{children}`. Reads from `@/content/site`
// directly (build-time inline), which is safe because this file is a
// Server Component and `content/site.ts` is server-only.
//
// USES-03: the `/uses` internal link in this footer is the ONLY entry point
// to the /uses route from the rest of the site — the home page has no
// `04. Uses` section (UI-SPEC §"Section numbering scheme on /" — 4 numbered
// sections on /, not 5).
//
// Server Component (no client-island directive). No event handlers.
import Link from "next/link";
import { ExternalLink } from "@/components/primitives/ExternalLink";
import { site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="mx-auto max-w-2xl px-6 py-12 md:px-12 md:py-16">
      <div className="border-t border-[color:var(--color-rule)] pt-8 font-mono text-[length:var(--text-caption)] leading-[var(--leading-caption)] text-[color:var(--color-ink-muted)]">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <Link
              href="/uses"
              className="hover:text-[color:var(--color-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-ink)]"
            >
              /uses
            </Link>
            <span aria-hidden="true">·</span>
            <ExternalLink href={site.github}>GitHub</ExternalLink>
            <span aria-hidden="true">·</span>
            <ExternalLink href={site.linkedin}>LinkedIn</ExternalLink>
          </div>
          <div>© 2026 James Nhek</div>
        </div>
      </div>
    </footer>
  );
}
