// Site configuration (CONT-02).
//
// Single `SiteConfig` instance — name, tagline, location, email, GitHub,
// LinkedIn, derived baseUrl. Consumed by:
//   - `src/components/primitives/SiteFooter.tsx` (GitHub + LinkedIn footer links)
//   - `src/app/page.tsx` Contact section (mailto + LinkedIn + GitHub)
//   - `src/components/interactive/CopyEmail.tsx` (via prop from Contact section)
//
// SERVER-ONLY by design — `env` is imported from `@/lib/env`, which throws if
// loaded into a Client Component (see env.ts header for the bundle-leak
// mechanics). Client components must receive these values as props from a
// Server-Component parent (Pitfall 3 in 02-RESEARCH.md).
//
// Email + LinkedIn provenance: confirmed by orchestrator at Plan 02-01 Task 0
// gate against `.planning/refs/RESUME-2026-05.md` (lines 3 + 4 — the resume's
// own contact block is the canonical source of truth for recruiter-facing
// values, overriding any older Gmail referenced in PROJECT.md context).
import { env } from "@/lib/env";
import type { SiteConfig } from "@/types/content";

export const site: SiteConfig = {
  name: "James Nhek",
  tagline: "AI Engineer @ Asurion",
  location: "San Francisco, CA",
  // Resume source: RESUME-2026-05.md line 3 — "pjnhek@gmail.com"
  email: "pjnhek@gmail.com",
  // Resume source: RESUME-2026-05.md line 4 — "github.com/pjnhek"
  github: "https://github.com/pjnhek",
  // Resume source: RESUME-2026-05.md line 4 — "linkedin.com/in/pjnhek"
  linkedin: "https://www.linkedin.com/in/pjnhek/",
  baseUrl: env.NEXT_PUBLIC_SITE_URL,
};
