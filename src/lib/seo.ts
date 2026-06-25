// SERVER-ONLY — metadata exports are Server Component only in Next.js App Router.
// DO NOT import from Client Components (same constraint as lib/env.ts, lib/content.ts).
//
// Pitfall 8 (03-RESEARCH.md): the URL base for resolving relative metadata
// URLs belongs only in `src/app/layout.tsx`, NOT in this factory. The caller
// spreads the factory's return value after setting the base URL, so the
// factory cannot accidentally overwrite it.
//
// Pitfall 3 (03-RESEARCH.md): Next.js metadata merging is shallow. A per-route
// `openGraph` object completely replaces the root layout's `openGraph` — it does
// NOT merge field-by-field. So every call to `buildMetadata` must include the
// full `openGraph.images` array, or the OG card disappears on per-route pages.
import type { Metadata } from "next";
import { site } from "@/content/site";

export type BuildMetadataArgs = {
  title: string; // page-specific title (include "— James Nhek" suffix in caller)
  description: string; // meta description (< 160 chars)
  path?: string; // route path for canonical URL, e.g. "/" or "/uses"
};

export function buildMetadata({
  title,
  description,
  path = "/",
}: BuildMetadataArgs): Metadata {
  const absoluteUrl = `${site.baseUrl}${path === "/" ? "" : path}`;

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl,
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl,
      siteName: site.name,
      type: "website",
      locale: "en_US",
      images: ["/opengraph-image"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
