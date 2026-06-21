// ArchitectureDiagram primitive (FOUND-08, D-08, UI-SPEC.md §5).
//
// Renders `<figure>` → image → optional `<figcaption>`. Branches on extension:
// `.svg` uses a passthrough `<img>` (browsers do not execute scripts in SVGs
// referenced via `<img src>`, and `next/image` rasterizes SVGs — destroying
// the very fidelity we want). Raster sources use `next/image` with `fill` +
// `aspect-[16/9]`. RESEARCH.md Pattern 7 / Pitfall: the ESLint disable is
// line-scoped (NOT file-level) — the file otherwise still benefits from the
// `no-img-element` rule.
//
// `alt` is REQUIRED at the TypeScript level — Phase 2 confidentiality +
// accessibility (DIAG-03, POL-06) depend on it.
//
// Server Component (no client-island directive). No event handlers.
import Image from "next/image";

type ArchitectureDiagramProps = {
  src: string;
  alt: string;
  caption?: string;
};

export function ArchitectureDiagram({
  src,
  alt,
  caption,
}: ArchitectureDiagramProps) {
  // IN-02: strip query-string and hash before checking the extension so
  // cache-busted paths (`/diagrams/foo.svg?v=2`) and fragment refs
  // (`/diagrams/foo.svg#layer-1`) still route to the SVG branch instead of
  // falling through to `next/image` and getting rasterized.
  const pathname = src.split("?")[0]?.split("#")[0] ?? "";
  const isSvg = pathname.toLowerCase().endsWith(".svg");
  return (
    <figure className="my-8 md:my-12">
      {isSvg ? (
        // IN-01: wrap the passthrough <img> in the same aspect-[16/9]
        // container as the raster branch so the layout reserves space before
        // the SVG fetches/parses. Without this, the home-route About section
        // (LCP region) can shift when the placeholder SVG resolves — CLS risk.
        // Border moves to the wrapper to match the raster branch visually.
        <div className="aspect-[16/9] w-full border border-[color:var(--color-rule)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-contain"
          />
        </div>
      ) : (
        <div className="relative aspect-[16/9] w-full border border-[color:var(--color-rule)]">
          <Image src={src} alt={alt} fill className="object-contain" />
        </div>
      )}
      {caption && (
        <figcaption className="mt-3 font-mono text-[length:var(--text-caption)] text-[color:var(--color-ink-muted)]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
