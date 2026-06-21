# Roadmap: pjnhek.com — James Nhek Portfolio

**Created:** 2026-05-20
**Mode:** Vertical MVP (every phase ships a deployable slice that improves the recruiter-viewable site)
**Granularity:** Coarse (4 phases)
**Core Value:** A recruiter lands on pjnhek.com, immediately understands "James is a serious AI Engineer doing real RAG/eval work at Asurion," sees 3–4 substantive projects with real depth, and has an obvious way to reach out — all within 60 seconds, on a phone.

---

## Phases

- [x] **Phase 1: Foundation Slice** — Next.js 16 + Tailwind v4 + TS scaffold live on a Vercel preview URL with the design system shell rendering (completed 2026-05-21)
- [x] **Phase 2: Content & Sections** — Hero, About, Experience, 4 Featured Projects, project detail pages, /uses, sanitized Asurion diagrams (confidentiality gate) (completed 2026-06-20)
- [ ] **Phase 3: SEO, Polish, Performance & Accessibility** — Metadata + OG image factory, sitemap/robots, Lighthouse ≥95 / a11y 100, mobile QA on real iPhone, cold-read pass
- [ ] **Phase 4: Domain Cutover & Production Verification** — pjnhek.com DNS + HTTPS, legacy decommission, GitHub profile curation, Vercel usage alerts, LinkedIn OG verified on production

## Phase Details

### Phase 1: Foundation Slice
**Goal:** A live Vercel preview URL renders a typographically-correct shell of pjnhek.com — proving the Next.js 16 + Tailwind v4 + TypeScript strict + Geist + Vercel toolchain works end-to-end before any content is written.
**Mode:** mvp
**Depends on:** Nothing (first phase)
**Requirements:** FOUND-01, FOUND-02, FOUND-03, FOUND-04, FOUND-05, FOUND-06, FOUND-07, FOUND-08, FOUND-09, FOUND-10, FOUND-11, FOUND-12, FOUND-13, DEP-01, DEP-02
**Success Criteria** (what must be TRUE):
  1. A reviewer can `pnpm install && pnpm dev` the repo locally and see the styled shell render with Geist Sans + Geist Mono, monochrome mono palette, and `clamp()` responsive typography at 375px / 768px / 1280px without horizontal scroll.
  2. Every pull request to `main` produces a Vercel preview deployment URL whose browser tab title contains "James Nhek" (default metadata from `app/layout.tsx`) and whose `<html>` ships zero `tailwind.config.js`-based styles (CSS-first `@theme` only).
  3. `pnpm lint`, `pnpm format`, and `tsc --noEmit` all exit cleanly with `strict: true` and `noUncheckedIndexedAccess: true` enforced, and the design-system primitives (`Section`, `NumberedHeading`, `Tag`, `ExternalLink`, `ArchitectureDiagram`) compile and render in isolation.
  4. `next.config.ts` does not set `output: 'export'`, `package.json` pins `packageManager: pnpm@…` and `engines.node` to Node 22 LTS, and `lib/env.ts` fails the build with a zod error when a required env var is missing.
**Plans:** 3/3 plans executed
- [x] 01-01-PLAN.md — Scaffold Next.js 16 + Tailwind v4 + TS strict + Geist + ESLint/Prettier + inline home shell (FOUND-01/02/03/04/05/06/09/11/12/13)
- [x] 01-02-PLAN.md — 5 design-system primitives + zod-validated env.ts + placeholder SVG + refactor home shell to compose primitives (FOUND-07/08/10)
- [x] 01-03-PLAN.md — GitHub repo pjnhek/portfolio public + branch protection + Vercel preview-on-PR + smoke-test PR (DEP-01/02)

### Phase 2: Content & Sections (with Confidentiality Gate)
**Goal:** A recruiter visiting the Vercel preview URL can read the entire portfolio narrative — Hero, About (pivot story first sentence), Experience, 4 Featured Projects with sanitized Asurion diagrams, project detail pages, and /uses — and reach James by email, with every Asurion-touching paragraph and diagram cleared by an explicit confidentiality review.
**Mode:** mvp
**Depends on:** Phase 1
**Requirements:** CONT-01, CONT-02, CONT-03, CONT-04, CONT-05, CONT-06, CONT-07, CONT-08, SEC-01, SEC-02, SEC-03, SEC-04, SEC-05, SEC-06, SEC-07, SEC-08, PROJ-01, PROJ-02, PROJ-03, PROJ-04, PROJ-05, USES-01, USES-02, USES-03, DIAG-01, DIAG-02, DIAG-03, DIAG-04
**Success Criteria** (what must be TRUE):
  1. Visiting `/` on the Vercel preview shows Hero → About → Experience → Featured Projects (4 cards in 1-col mobile / 2-col desktop) → Contact in order; the About section's first sentence opens with the tax-analyst → AI-engineer pivot; every Asurion bullet contains a number; `"use client"` appears only in `components/interactive/CopyEmail.tsx`.
  2. Each of the 4 project slugs (`/projects/sf-date-night-concierge`, `/projects/gtm-research-pipeline`, `/projects/voice-intent-eval`, `/projects/daily-weather-pipeline`) is statically generated at build time via `generateStaticParams` and follows a Problem → Approach → Result narrative with title/subtitle reflected in `generateMetadata`.
  3. `/uses` renders AI-engineer-specific content (model defaults, MCP servers, eval stack, agent framework) sourced from `content/uses.ts`, links back to home, and is reachable from the footer.
  4. At least one Asurion-context architecture diagram and at least one featured-project diagram render crisply on retina at full mobile width as SVGs in `public/diagrams/`, with screen-reader alt text describing the component flow — and **every Asurion-touching paragraph and diagram has been signed off through an explicit confidentiality review gate** ("would I be comfortable if my Asurion manager saw this on LinkedIn tomorrow?") before this phase closes.
  5. Clicking the Contact section's `mailto:` link opens an email client to James's address, the copy-email button writes the address to the clipboard, and section anchors (`#about`, `#experience`, `#projects`, `#contact`) update the URL hash.
**Plans:** 5/5 plans complete
- [x] 02-01-PLAN.md — Types + 4 content modules + lib/content + globals.css anchor scroll (foundation data layer; blocking checkpoints: RESUME deposited + GitHub URLs confirmed)
- [x] 02-02-PLAN.md — MetricCallout + SiteFooter + ProjectCard + Experience sub-components; refactor home to render real Experience + Projects (drop home `04. Uses` → 4 numbered sections)
- [x] 02-03-PLAN.md — `/projects/[slug]` dynamic route (generateStaticParams + generateMetadata) + BackLink + refine project narratives
- [x] 02-04-PLAN.md — `/uses` route + UsesEntry + finalize uses.ts list (James edits seed per D-Uses-04)
- [x] 02-05-PLAN.md — DIAG-01 + DIAG-02 SVGs + CopyEmail client island + real About copy + real Contact section + CONFIDENTIALITY-REVIEW.md hard merge gate (phase closer)
**UI hint:** yes

### Phase 3: SEO, Polish, Performance & Accessibility
**Goal:** When the same preview URL is shared in a Slack DM, LinkedIn message, or iMessage, the link renders a typography-poster OG card; a Lighthouse mobile audit returns Performance ≥95 and Accessibility = 100; and a non-technical cold reader can answer "what does James do?" and "how do I contact him?" after 60 seconds.
**Mode:** mvp
**Depends on:** Phase 2
**Requirements:** SEO-01, SEO-02, SEO-03, SEO-04, SEO-05, SEO-06, SEO-07, SEO-08, SEO-09, POL-01, POL-02, POL-03, POL-04, POL-05, POL-06, POL-07, POL-08, POL-09, POL-10
**Success Criteria** (what must be TRUE):
  1. Every route (`/`, `/uses`, every `/projects/[slug]`) exports `generateMetadata` built through `lib/seo.ts`'s `buildMetadata({ title, description, path })` factory; the home title contains "James Nhek"; `app/sitemap.ts` derives URLs from `content/projects.ts`; `app/robots.ts` references the sitemap; `app/opengraph-image.tsx` returns a 1200×630 typography poster as `image/png`.
  2. Lighthouse mobile audit on the preview returns Performance ≥ 95 and Accessibility = 100; axe DevTools is zero-issue on home, one project detail, and /uses; every interactive element shows a visible `focus-visible:` outline; the site is fully keyboard-navigable (Tab / Shift+Tab / Enter / Esc) with no mouse traps; total home-route JS shipped is < 100 KB gzipped (Network tab verified).
  3. `app/not-found.tsx` renders a styled 404 linking home; `app/icon.tsx` + `app/apple-icon.tsx` render in browser tabs and on iOS home screen; hero / above-the-fold images use `next/image` with `priority` + `fetchPriority="high"`.
  4. The site renders correctly on a real iPhone at 375px (not just DevTools emulation), and a non-technical cold reader can answer both "What does James do?" and "How would I contact him?" within 60 seconds on the home page.
  5. LinkedIn Post Inspector, opengraph.xyz, and a real Slack DM of the **preview URL** all render the OG card with image + title + description — note that final production verification is re-run in Phase 4 against pjnhek.com (preview deployments behave differently from production).
**Plans:** TBD
**UI hint:** yes

### Phase 4: Domain Cutover & Production Verification
**Goal:** `https://pjnhek.com` resolves to the live portfolio on all URL variants, the legacy `pnhek.github.io` no longer competes in search results, the GitHub profile is curated to match the site, Vercel usage alerts are armed, and the OG card renders correctly against the production URL — making the site recruiter-ready.
**Mode:** mvp
**Depends on:** Phase 3
**Requirements:** DEP-03, DEP-04, DEP-05, DEP-06, DEP-07, DEP-08, DEP-09, DEP-10, DEP-11, DEP-12
**Needs research:** Email DNS specifics (ImprovMX vs Cloudflare Email Routing vs Fastmail) if/when `james@pjnhek.com` forwarding is added; registrar-specific ALIAS/ANAME support and CAA records. Flag to surface during `/gsd:plan-phase 4`.
**Success Criteria** (what must be TRUE):
  1. All four URL variants (`http://pjnhek.com`, `https://pjnhek.com`, `http://www.pjnhek.com`, `https://www.pjnhek.com`) resolve successfully with a valid Let's Encrypt cert; `www` redirects to apex; DNS is `A @ 76.76.21.21` at the registrar with `CNAME www → cname.vercel-dns.com`; `NEXT_PUBLIC_SITE_URL=https://pjnhek.com` is set in Vercel production.
  2. Legacy `pnhek.github.io` either no longer resolves or returns a 301 redirect to `pjnhek.com`; `github.com/pjnhek` shows exactly 6 curated pinned repos matching the 4 featured projects + 2 supporting; `githubtest`, `poc_scraper`, `job-scraper`, and course repos are archived or unpinned; the `pjnhek/pjnhek` profile README links to `pjnhek.com`.
  3. LinkedIn Post Inspector renders the OG card correctly against the **production URL** `https://pjnhek.com` (not preview) with image + title + description; opengraph.xyz preview matches; a real Slack/iMessage DM of the production URL renders the card — re-verified on production per Phase 3 deferment.
  4. Every external link on production (project GitHub URLs, LinkedIn, demo links) opens correctly when manually clicked from `https://pjnhek.com`; DevTools console is clean on the home page, /uses, and at least one project detail page on production with zero errors or unexpected warnings.
  5. Vercel usage email alerts are enabled at 50% / 80% / 100% of bandwidth and image-transformation caps; an UptimeRobot (or equivalent free-tier) monitor pings `https://pjnhek.com` on a schedule; the site has been shared with at least one recruiter contact as the launch validation signal.
**Plans:** TBD

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation Slice | 3/3 | Complete    | 2026-05-21 |
| 2. Content & Sections | 5/5 | Complete    | 2026-06-20 |
| 3. SEO, Polish, Performance & Accessibility | 0/0 | Not started | - |
| 4. Domain Cutover & Production Verification | 0/0 | Not started | - |

## Coverage

- **v1 requirements:** 64 total
- **Mapped:** 64
- **Unmapped:** 0 ✓

| Category | Count | Phase |
|----------|-------|-------|
| FOUND | 13 | Phase 1 |
| DEP-01, DEP-02 | 2 | Phase 1 (foundation needs Vercel preview + repo) |
| CONT | 8 | Phase 2 |
| SEC | 8 | Phase 2 |
| PROJ | 5 | Phase 2 |
| USES | 3 | Phase 2 |
| DIAG | 4 | Phase 2 (gated by confidentiality review) |
| SEO | 9 | Phase 3 |
| POL | 10 | Phase 3 |
| DEP-03..12 | 10 | Phase 4 |

## v2 / Out-of-Roadmap

The following 12 requirements are explicitly v2 and not on this roadmap:
- **POST-01..07**: Resend contact form, per-project case studies, View Source easter egg, dynamic per-project OG, GitHub stars on cards, silent Vercel Analytics, ⌘K command palette
- **DEMO-01..05**: `/chat` RAG demo, Upstash Ratelimit, daily spend cap + kill-switch, restrictive system prompt, output filter

These are tracked in `REQUIREMENTS.md ## v2 Requirements` and not blockers for v1 launch.

---
*Roadmap created: 2026-05-20*
