# Requirements: pjnhek.com — James Nhek Portfolio

**Defined:** 2026-05-20
**Core Value:** A recruiter lands on pjnhek.com, immediately understands "James is a serious AI Engineer doing real RAG/eval work at Asurion," sees 3–4 substantive projects with real depth, and has an obvious way to reach out — all within 60 seconds, on a phone.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Foundations & Design System

- [x] **FOUND-01**: Next.js 16 (App Router) + React 19.2 + TypeScript strict project scaffold runs locally with `pnpm dev`
- [x] **FOUND-02**: Tailwind v4 configured via CSS-first `@theme` in `globals.css` — no `tailwind.config.js`
- [x] **FOUND-03**: Geist Sans + Geist Mono loaded via `next/font/google` with zero layout shift
- [x] **FOUND-04**: `tsconfig.json` enforces `strict: true` and `noUncheckedIndexedAccess: true`
- [x] **FOUND-05**: Mono palette (single color mode) with accessible contrast (≥4.5:1 for body text) defined in design tokens
- [x] **FOUND-06**: Responsive typography scale using `clamp()` works at 375px, 768px, and 1280px viewports
- [x] **FOUND-07**: Numbered section anchor style (`01.` `02.` etc.) implemented as a reusable primitive
- [x] **FOUND-08**: UI primitives exist: `Section`, `NumberedHeading`, `Tag`, `ExternalLink`, `ArchitectureDiagram`
- [x] **FOUND-09**: `app/layout.tsx` declares `metadataBase: new URL('https://pjnhek.com')` and default metadata (title, description, OG, Twitter)
- [x] **FOUND-10**: `lib/env.ts` validates required env vars with zod at build time
- [x] **FOUND-11**: ESLint + Prettier with `prettier-plugin-tailwindcss` runs clean (`pnpm lint`, `pnpm format`)
- [x] **FOUND-12**: `next.config.ts` does NOT set `output: 'export'` (preserves `next/image` and dynamic OG)
- [x] **FOUND-13**: `package.json` pins `packageManager: pnpm@...` and `engines.node` to 22 LTS

### Content & Data

- [ ] **CONT-01**: `types/content.ts` defines `Project`, `Role`, `UsesItem`, and `SiteConfig` interfaces with full type safety
- [ ] **CONT-02**: `content/site.ts` holds James's name, tagline, location, email, GitHub URL, LinkedIn URL, and base URL
- [ ] **CONT-03**: `content/experience.ts` contains all roles: AI Engineer @ Asurion, Tax Analyst @ A to Z Tax Services, Data Analyst @ FWD Life Insurance, plus USF MSDS and University of Houston education entries
- [ ] **CONT-04**: `content/projects.ts` contains exactly 4 featured projects (SF Date Night Concierge, GTM Research Pipeline, Voice Intent Eval, Daily Weather Pipeline) with title, slug, subtitle, metric, tech stack, GitHub URL, and detailed description
- [ ] **CONT-05**: `content/uses.ts` contains AI-engineer-specific tools (models, MCP servers, eval stack, agent framework, hardware)
- [ ] **CONT-06**: `lib/content.ts` exposes `getAllProjects()` and `getProject(slug)` accessors
- [ ] **CONT-07**: Asurion content uses only public-resume facts (no internal tool names, no proprietary architecture, no confidential metrics beyond the resume) — passes confidentiality review
- [ ] **CONT-08**: Every Asurion bullet contains a number (e.g., "+10.6% accuracy", "249 synthetic QA pairs", "5 enterprise tenants") — no vague claims

### Page Sections (Home Route)

- [ ] **SEC-01**: Hero section displays James's name, role ("AI Engineer @ Asurion"), specialization ("RAG · evaluations · agentic workflows"), San Francisco location, and an "open to AI Engineer roles" line — no animation, no typing effect
- [ ] **SEC-02**: About section opens its first sentence with the tax-analyst → AI-engineer pivot — pivot is not buried
- [ ] **SEC-03**: Experience section displays each role inline with company, dates, location, and bulleted achievements — no PDF download button
- [ ] **SEC-04**: Featured Projects section displays 4 project cards in a responsive grid (1 column on mobile, 2 columns desktop)
- [ ] **SEC-05**: Each project card shows title, plain-English one-line subtitle, primary metric callout, tech-chip row, and a GitHub link
- [ ] **SEC-06**: Contact section displays a `mailto:` link, copy-email-to-clipboard button, LinkedIn link, and GitHub link
- [ ] **SEC-07**: All sections are Server Components — `"use client"` appears only in `components/interactive/CopyEmail.tsx`
- [ ] **SEC-08**: Section anchors (`#about`, `#experience`, `#projects`, `#contact`) work and update the URL hash on click

### Project Detail Pages

- [ ] **PROJ-01**: `/projects/[slug]` route renders a detail page for each of the 4 featured projects
- [ ] **PROJ-02**: `generateStaticParams` derives slugs from `content/projects.ts` — all 4 pages are statically generated at build time
- [ ] **PROJ-03**: Each detail page follows a Problem → Approach → Result narrative structure
- [ ] **PROJ-04**: At least 1 featured project's detail page includes a sanitized architecture diagram (SVG in `public/diagrams/`)
- [ ] **PROJ-05**: Each detail page exposes `generateMetadata` with the project title and subtitle in the page `<title>` and meta description

### /uses Page

- [ ] **USES-01**: `/uses` route exists and renders content from `content/uses.ts`
- [ ] **USES-02**: Content is AI-engineer-specific (not a generic dev /uses) — covers model defaults, MCP/agent tooling, eval stack
- [ ] **USES-03**: `/uses` page links back to home and is reachable from the footer

### Architecture Diagrams (Sanitized)

- [ ] **DIAG-01**: One Asurion-context architecture diagram is drawn fresh from scratch in Excalidraw or tldraw, using only generic component names ("Retriever," "Reranker," "Vector Store"); no internal product names, codenames, or screenshots
- [ ] **DIAG-02**: One featured-project architecture diagram (recommended: SF Date Night Concierge or Voice Intent Eval) exists as a sanitized SVG in `public/diagrams/`
- [ ] **DIAG-03**: All diagrams render crisply on retina at full width on mobile and desktop; alt text describes the component flow for screen readers
- [ ] **DIAG-04**: A confidentiality review gate passes on every Asurion-touching paragraph and diagram before deploy

### SEO & Social Sharing

- [ ] **SEO-01**: `lib/seo.ts` exports a `buildMetadata({ title, description, path })` factory used by every route
- [ ] **SEO-02**: Every route has explicit `generateMetadata` with title, description, OG image, and Twitter card metadata
- [ ] **SEO-03**: Page `<title>` for the home route contains "James Nhek" (so "james nhek" ranks for the user's name)
- [ ] **SEO-04**: `app/opengraph-image.tsx` renders a static 1200×630 typography-poster (name + role + domain), `Content-Type: image/png`
- [ ] **SEO-05**: `app/sitemap.ts` derives URLs from `content/projects.ts` and includes home, /uses, and every `/projects/[slug]`
- [ ] **SEO-06**: `app/robots.ts` allows all crawlers and references the sitemap URL
- [ ] **SEO-07**: LinkedIn Post Inspector previews the production URL correctly (image renders, title and description show) — verified, not assumed
- [ ] **SEO-08**: opengraph.xyz preview matches expectations for production URL
- [ ] **SEO-09**: A real Slack/iMessage DM of the production URL renders the OG card correctly

### Polish, Performance, Accessibility

- [ ] **POL-01**: `app/not-found.tsx` exists with a styled 404 page that links back to home
- [ ] **POL-02**: `app/icon.tsx` (favicon) and `app/apple-icon.tsx` (touch icon) exist and render in browser tabs
- [ ] **POL-03**: All hero / project images use `next/image` with `priority` + `fetchPriority="high"` for above-the-fold assets
- [ ] **POL-04**: Total home-route JavaScript shipped is < 100 KB gzipped (Network tab verified)
- [ ] **POL-05**: Lighthouse mobile audit returns Performance ≥ 95 and Accessibility = 100 on production
- [ ] **POL-06**: axe DevTools scan returns zero issues on home, project detail, and /uses pages
- [ ] **POL-07**: Every interactive element has a visible `focus-visible:` outline that meets contrast guidelines
- [ ] **POL-08**: Site is fully usable with keyboard only (Tab, Shift+Tab, Enter, Esc — no mouse traps)
- [ ] **POL-09**: Site renders correctly on a real iPhone at 375px viewport — not just DevTools emulation
- [ ] **POL-10**: A non-technical reviewer (cold read) can answer "What does James do?" and "How would I contact him?" after 60 seconds on the home page

### Deploy & Domain

- [ ] **DEP-01**: Repository is hosted on GitHub at `pjnhek/portfolio` (or chosen repo name) with main branch protected
- [ ] **DEP-02**: Vercel project is linked to the GitHub repository with preview deploys on every PR
- [ ] **DEP-03**: `NEXT_PUBLIC_SITE_URL=https://pjnhek.com` is set in Vercel production environment
- [ ] **DEP-04**: DNS apex record `A @ 76.76.21.21` is configured at the registrar
- [ ] **DEP-05**: DNS `CNAME www → cname.vercel-dns.com` is configured at the registrar
- [ ] **DEP-06**: HTTPS works on all four URL variants (`http://pjnhek.com`, `https://pjnhek.com`, `http://www.pjnhek.com`, `https://www.pjnhek.com`); www redirects to apex
- [ ] **DEP-07**: Legacy `pnhek.github.io` is either taken down or returns a 301 redirect to `pjnhek.com`
- [ ] **DEP-08**: Vercel usage email alerts are enabled at 50% / 80% / 100% of bandwidth and image-transformation caps
- [ ] **DEP-09**: A simple uptime monitor (e.g., UptimeRobot free tier) pings the production URL on a schedule
- [ ] **DEP-10**: GitHub profile (`github.com/pjnhek`) is curated: 6 pinned repos matching featured 4 + 2 supporting; `githubtest`, `poc_scraper`, `job-scraper`, course repos archived or unpinned; `pjnhek/pjnhek` profile README links to `pjnhek.com`
- [ ] **DEP-11**: Every external link on the production site (project GitHub URLs, LinkedIn URL, demo URLs) opens correctly when manually clicked from production — no broken links
- [ ] **DEP-12**: Browser DevTools console is clean on the home page, /uses page, and one project detail page on production

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Post-Launch Polish (v1.x)

- **POST-01**: Resend-backed contact form via Server Action (replaces v1 `mailto:` flow); zod validation; honeypot; spam guard
- **POST-02**: Per-project detail page expanded into a full case-study writeup for the top 1–2 projects (richer Problem/Approach/Result + extra diagram)
- **POST-03**: View Source easter egg HTML comment with a personal recruitment-friendly message
- **POST-04**: Dynamic per-project OG images via `app/projects/[slug]/opengraph-image.tsx` — only added if per-project shares are measurable
- **POST-05**: Build-time GitHub stars + last-updated displayed on project cards — only if star counts are meaningful
- **POST-06**: Vercel Analytics enabled silently (no on-site dashboard)
- **POST-07**: Command palette ⌘K via `cmdk` for quick navigation

### Live AI Demo (v2)

- **DEMO-01**: `/chat` route with a streaming RAG chat over James's site content (resume bullets + project READMEs) using Vercel AI SDK
- **DEMO-02**: `middleware.ts` enforces Upstash Ratelimit (sliding window: 10 req/10s per IP) on `/api/chat`
- **DEMO-03**: Daily spend cap and kill-switch env var protect against runaway cost
- **DEMO-04**: Restrictive system prompt + closed corpus (no internet access) prevents prompt injection from changing scope
- **DEMO-05**: Output filter strips any prompt-injected outputs that attempt to break character

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Blog with no posts | Adds maintenance overhead and signals abandonment when empty; revisit when 3+ posts are written |
| Light/dark mode toggle | One well-designed mode beats two mediocre ones for v1; FOUC risk; defer until aesthetic is locked |
| Visitor analytics in v1 | Not a launch blocker; Vercel Analytics can be added silently in v1.x without user-visible changes |
| Auto-pulled GitHub project list | Would surface junk repos; manual curation tells better stories |
| Resume PDF download | User explicitly wants experience embedded on-site so recruiters don't leave the page |
| Live RAG demo on home page | Cost + rate-limiting + prompt-injection hardening not justified for v1; tracked as v2 |
| Talks / certifications / awards | No current content; can be added if and when relevant |
| CMS / admin panel | Content updates infrequently — editing source + redeploying is fine |
| Confidential Asurion screenshots, internal tool names, employer logos | Hard constraint — confidentiality and brand-use policies preclude these |
| Hero typing animation / particle background / scroll-triggered hero animation | Hurts LCP, signals "template," pure perceived-cleverness with no recruiter signal |
| Skill bar charts ("Python 80%") | Anti-pattern — unfalsifiable, looks like a 2015 portfolio |
| MDX-based content tooling in v1 | 4 typed TS entries are simpler; MDX makes sense only past ~6 projects with embedded components |
| `motion` / `framer-motion` library in v1 | CSS + View Transitions cover everything a typography-led portfolio needs |
| UI kits (MUI, Chakra, Mantine, Ant) | Wrecks Lighthouse, signals "template," obscures own engineering |
| `output: 'export'` static site generation | Silently disables `next/image`, dynamic OG, ISR — never use on Vercel deploys |
| Self-hosted analytics infrastructure | Out of scope for a single-page recruiter portfolio on free tier |

## Traceability

Final phase assignments locked at roadmap creation (2026-05-20).

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1 | Complete |
| FOUND-02 | Phase 1 | Complete |
| FOUND-03 | Phase 1 | Complete |
| FOUND-04 | Phase 1 | Complete |
| FOUND-05 | Phase 1 | Complete |
| FOUND-06 | Phase 1 | Complete |
| FOUND-07 | Phase 1 | Complete |
| FOUND-08 | Phase 1 | Complete |
| FOUND-09 | Phase 1 | Complete |
| FOUND-10 | Phase 1 | Complete |
| FOUND-11 | Phase 1 | Complete |
| FOUND-12 | Phase 1 | Complete |
| FOUND-13 | Phase 1 | Complete |
| DEP-01 | Phase 1 | Pending |
| DEP-02 | Phase 1 | Pending |
| CONT-01 | Phase 2 | Pending |
| CONT-02 | Phase 2 | Pending |
| CONT-03 | Phase 2 | Pending |
| CONT-04 | Phase 2 | Pending |
| CONT-05 | Phase 2 | Pending |
| CONT-06 | Phase 2 | Pending |
| CONT-07 | Phase 2 | Pending |
| CONT-08 | Phase 2 | Pending |
| SEC-01 | Phase 2 | Pending |
| SEC-02 | Phase 2 | Pending |
| SEC-03 | Phase 2 | Pending |
| SEC-04 | Phase 2 | Pending |
| SEC-05 | Phase 2 | Pending |
| SEC-06 | Phase 2 | Pending |
| SEC-07 | Phase 2 | Pending |
| SEC-08 | Phase 2 | Pending |
| PROJ-01 | Phase 2 | Pending |
| PROJ-02 | Phase 2 | Pending |
| PROJ-03 | Phase 2 | Pending |
| PROJ-04 | Phase 2 | Pending |
| PROJ-05 | Phase 2 | Pending |
| USES-01 | Phase 2 | Pending |
| USES-02 | Phase 2 | Pending |
| USES-03 | Phase 2 | Pending |
| DIAG-01 | Phase 2 | Pending |
| DIAG-02 | Phase 2 | Pending |
| DIAG-03 | Phase 2 | Pending |
| DIAG-04 | Phase 2 | Pending |
| SEO-01 | Phase 3 | Pending |
| SEO-02 | Phase 3 | Pending |
| SEO-03 | Phase 3 | Pending |
| SEO-04 | Phase 3 | Pending |
| SEO-05 | Phase 3 | Pending |
| SEO-06 | Phase 3 | Pending |
| SEO-07 | Phase 3 | Pending |
| SEO-08 | Phase 3 | Pending |
| SEO-09 | Phase 3 | Pending |
| POL-01 | Phase 3 | Pending |
| POL-02 | Phase 3 | Pending |
| POL-03 | Phase 3 | Pending |
| POL-04 | Phase 3 | Pending |
| POL-05 | Phase 3 | Pending |
| POL-06 | Phase 3 | Pending |
| POL-07 | Phase 3 | Pending |
| POL-08 | Phase 3 | Pending |
| POL-09 | Phase 3 | Pending |
| POL-10 | Phase 3 | Pending |
| DEP-03 | Phase 4 | Pending |
| DEP-04 | Phase 4 | Pending |
| DEP-05 | Phase 4 | Pending |
| DEP-06 | Phase 4 | Pending |
| DEP-07 | Phase 4 | Pending |
| DEP-08 | Phase 4 | Pending |
| DEP-09 | Phase 4 | Pending |
| DEP-10 | Phase 4 | Pending |
| DEP-11 | Phase 4 | Pending |
| DEP-12 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 64 total
- Mapped to phases: 64 ✓
- Unmapped: 0 ✓
- Duplicate mappings: 0 ✓

---
*Requirements defined: 2026-05-20*
*Last updated: 2026-05-20 — roadmap phase assignments locked*
