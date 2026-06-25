import type { MetadataRoute } from "next";
import { getAllProjects } from "@/lib/content";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const projects = getAllProjects();
  const base = site.baseUrl;

  return [
    { url: base, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/uses`, changeFrequency: "monthly", priority: 0.8 },
    ...projects.map((p) => ({
      url: `${base}/projects/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
