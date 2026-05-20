# Project Research Summary

**Project:** pjnhek.com — James Nhek AI Engineer Portfolio
**Domain:** Custom-coded developer portfolio (Next.js 16 + Tailwind v4 + TypeScript on Vercel Hobby), recruiter audience, free-tier, custom domain `pjnhek.com`
**Researched:** 2026-05-20
**Confidence:** HIGH

## Executive Summary

This is a recruiter-facing AI engineer portfolio whose primary job is to convert a 60-second mobile visit into a credible read of "James is a serious AI engineer doing real RAG/eval work." The site is itself part of the portfolio — recruiters who click View Source must see code consistent with the claims. Across all four research streams the answer converges on the same architecture: a **mostly-static, App Router Next.js 16 site** with **Server Components by default**, **Tailwind v4 CSS-first** mono theme, **typed TS content modules** (not MDX) as the source of truth for 4 projects, **next/font + next/image** as the load-bearing performance primitives, and **App Router file conventions for SEO** (sitemap.ts, robots.ts, opengraph-image.tsx, generateMetadata). Total runtime JS should be <100 KB gzipped; Lighthouse 95+ on mobile is the default outcome of these choices, not a stretch goal.

The recommended approach is **ship a tight v1 fast**, then iterate. v1 = home page (Hero / About / Experience / 4 Featured Projects / Contact) + /uses + per-project detail pages + sanitized Asurion diagram + clean OG + custom domain. v1 explicitly does **not** include: a contact form backend (use `mailto:` + copy-email — Resend is a v1.x add), dark mode, blog, analytics, MDX tooling, motion libraries, command palette, or a live RAG demo. Per PITFALLS.md scope-creep guidance, treating the PROJECT.md Out-of-Scope list as a hard contract is the single highest-leverage decision James can make.

The four highest-risk hazards (must be designed-against in v1, not retrofitted): (1) **Asurion confidentiality leakage** — diagrams hand-drawn from scratch, allow-list of facts, dedicated review gate; (2) **LinkedIn OG image rendering** — set `metadataBase`, use static `app/opengraph-image.tsx` file convention, verify on LinkedIn Post Inspector against production URL (not preview); (3) **Vercel Hobby bandwidth / image-transformation cap** — pre-encode images, cap `next/image` `sizes` breakpoints, raise `images.minimumCacheTTL`, enable usage alerts; (4) **Legacy `pnhek.github.io` competing in Google results** — take down or 301-redirect before launching, and explicitly do **not** set `output: 'export'` in `next.config.ts` (which would silently disable next/image optimization and dynamic OG).

## Key Findings

### Recommended Stack

The inevitable May-2026 stack is fully prescriptive. All four researchers agree; conflicts are minor and arbitrated below.

**Day-1 packages to install (and nothing else):**
- `next@16.2.x`, `react@19.2.x`, `react-dom@19.2.x` — scaffolded by `pnpm create next-app@latest`
- `typescript@^5.6`, `@types/node`, `@types/react`, `@types/react-dom`
- `tailwindcss@^4.1`, `@tailwindcss/postcss@^4.1`, `postcss@^8`
- `clsx`, `tailwind-merge` — `cn()` helper, mandatory
- `lucide-react@^0.460` — icons, tree-shaking-clean
- `zod@^3.23` — env validation + contact form (later)
- Dev: `prettier`, `prettier-plugin-tailwindcss`, `eslint-config-prettier`

**Day-1 packages to deliberately NOT install (per arbitrated synthesis):**
- `motion` / `framer-motion` — CSS + View Transitions cover everything a typography-led portfolio needs.
- `@next/mdx`, `next-mdx-remote`, `contentlayer`, `next-contentlayer`, `gray-matter` — 4 typed TS entries in `content/projects.ts` beats any MDX setup.
- `next-themes` — single mode in v1, dark mode is Out of Scope.
- `@vercel/analytics`, `@vercel/speed-insights` — explicitly deferred per PROJECT.md.
- `resend`, `sonner` — defer until contact form ships (v1.x); v1 uses `mailto:` + copy-email button only.
- `cmdk`, `kbar` — command palette is recruiter-irrelevant; v1.1 polish.
- `class-variance-authority` — install only when a component grows >2 variant axes; YAGNI for v1.
- `shadcn/ui` Radix primitives — install per-component if/when a Dialog/Tooltip is actually needed; don't pre-install.
- Any UI kit (MUI, Chakra, Mantine, Ant) — non-starter; wrecks Lighthouse and signals "template."
- `@vercel/og` dynamic per-route OG images — start with a single static `app/opengraph-image.tsx`; add dynamic per-project OG only if shares-by-project actually happen.

**Core technologies:**
- **Next.js 16 App Router + React 19.2:** Server Components by default keep JS shipped <100KB; React Compiler stable removes manual `useMemo`/`useCallback`; `next/image` + `next/font` are the load-bearing perf primitives.
- **TypeScript 5.6+ strict mode:** `strict: true`, `noUncheckedIndexedAccess: true`. `tsconfig.json` is itself a recruiter-visible artifact. `next.config.ts` requires Node 22.18+ for native TS loading; otherwise use `next.config.mjs`.
- **Tailwind v4.1 CSS-first via `@theme` in `globals.css`:** No `tailwind.config.js`. Mono palette + spacing scale as CSS variables. PostCSS plugin lives in `@tailwindcss/postcss`, not `tailwindcss` (v3-era gotcha).
- **Node 22 LTS + pnpm:** Pin `packageManager` field in `package.json`. Bun runtime is incompatible with Vercel deploys.
- **Geist Sans + Geist Mono via `next/font/google`:** Self-hosted, zero layout shift, more distinctive than Inter. Load only 1–2 weights.
- **Vercel Hobby on `pjnhek.com`:** Apex A-record `76.76.21.21`, CNAME `www` → `cname.vercel-dns.com`, apex as canonical, www → apex redirect.

### Expected Features

**Must have — v1 launch blockers (table stakes):**
- **Hero** with name, role (AI Engineer @ Asurion), specialization (RAG / evals), location, "open to roles" line, no animation
- **About section** opening with the tax-analyst → AI-engineer pivot in the first sentence (pivot-buried is PITFALL #20)
- **Experience** embedded inline (Asurion + USF MSDS + prior roles) — no PDF download (per PROJECT.md decision)
- **Featured Projects** (exactly 4 cards: SF Date Night Concierge, GTM Research Pipeline, Voice Intent Eval, Daily Weather Pipeline)
- Each project card: title, plain-English one-liner subtitle, metric callout (e.g., "+10.6% accuracy", "100% intent accuracy / 80 scenarios"), tech-chip row, GitHub link
- **At least one sanitized architecture diagram** for the Asurion-context narrative + 1 featured project (Excalidraw / Mermaid SVG, drawn fresh, generic component names only)
- **Contact** section: `mailto:` + LinkedIn + GitHub + copy-email-to-clipboard button (no backend form in v1)
- **/uses page** with AI-engineer-specific content (model defaults, MCP servers, eval stack, agent framework) — differentiator vs generic dev `/uses` pages
- **Custom 404** (`app/not-found.tsx`)
- **Favicon** (`app/icon.png` + `app/apple-icon.png`)
- **Static OG image** (`app/opengraph-image.tsx`, 1200×630) + Twitter card metadata
- **`robots.ts` + `sitemap.ts`** via App Router file conventions
- **Mobile responsive** verified at 375px on real iPhone (not just DevTools emulation)
- **Lighthouse ≥95 Performance / 100 Accessibility** on mobile
- **Custom domain `pjnhek.com`** with HTTPS, www → apex redirect, legacy `pnhek.github.io` taken down or 301'd
- **Numbered section anchors** (`01.` `02.`) — cheap, ship in Phase 1 design system
- **Curated GitHub profile** (6 pinned repos matching featured projects, real profile README, junk repos archived) — Phase 2 work alongside content

**Should have — v1.x (post-launch polish, triggered by feedback):**
- Per-project detail pages (`/projects/[slug]`) with Problem → Approach → Result + diagram — start with top 1–2 projects after launch
- View Source easter egg HTML comment ("If you're reading this — `james@pjnhek.com`")
- Resend-backed contact form via Server Action (replaces the v1 `mailto:`-only contact)
- Dynamic per-project OG images via `app/projects/[slug]/opengraph-image.tsx` (only if per-project shares are measurable)
- Build-time GitHub stars + last-updated on project cards (only if stars > some threshold; otherwise omit)
- Vercel Analytics silently (no on-site dashboard)

**Defer to v2+ (explicit Out of Scope in PROJECT.md):**
- Live RAG / agent demo (cost + rate-limiting + prompt-injection hardening required first)
- Blog (add only when 3+ real posts exist)
- Light/dark mode toggle
- MDX-based content (only if project count grows past 6)
- Command palette ⌘K
- Talks / Certifications / Awards sections

**Hard anti-features (DO NOT add, documented to prevent re-entry):**
- Auto-pulled GitHub repo list, resume PDF download, skill bar charts ("Python 80%"), hero typing animation / particle background, Asurion screenshots or internal tool names, employer logos, generic "I love coffee" personal-trivia, CMS / admin panel.

### Architecture Approach

The site is **build-time static** with **two client islands**: `<ContactForm/>` (deferred to v1.x) and `<CopyEmail/>`. Everything else is Server Components. Content lives as typed TypeScript modules in `content/` (one source of truth, full editor autocomplete, zero MDX runtime). Server Actions handle the contact form when it ships. SEO uses App Router file conventions exclusively — no SEO library needed.

**Concrete file/folder layout (final, arbitrated):**

```
portfolio/
├── app/
│   ├── layout.tsx                      # Root: fonts, metadataBase, default metadata
│   ├── page.tsx                        # Home: Hero / About / Experience / Projects / Contact
│   ├── globals.css                     # @import "tailwindcss"; @theme { mono palette }
│   ├── opengraph-image.tsx             # Static site-wide OG (typography poster)
│   ├── icon.tsx                        # Favicon + apple-icon.tsx
│   ├── sitemap.ts                      # Derives URLs from content/projects.ts
│   ├── robots.ts
│   ├── not-found.tsx
│   ├── projects/[slug]/
│   │   ├── page.tsx                    # generateStaticParams from content/projects.ts
│   │   └── opengraph-image.tsx         # [v1.x] per-project OG
│   └── uses/page.tsx
│
├── actions/                            # [v1.x — when contact form ships]
│   └── contact.ts                      # "use server"; zod + Resend
│
├── components/
│   ├── ui/                             # Section, NumberedHeading, Tag, ExternalLink, ArchitectureDiagram (Server)
│   ├── sections/                       # Hero, About, Experience, FeaturedProjects, Contact (Server)
│   └── interactive/                    # CopyEmail.tsx (v1), ContactForm.tsx (v1.x)
│
├── content/                            # TYPED TS SOURCE OF TRUTH (NOT MDX)
│   ├── site.ts                         # name, tagline, urls, socials, baseUrl
│   ├── experience.ts                   # Role[]
│   ├── projects.ts                     # Project[] — 4 entries
│   └── uses.ts
│
├── lib/
│   ├── content.ts                      # getAllProjects(), getProject(slug)
│   ├── seo.ts                          # buildMetadata({ title, description, path })
│   └── env.ts                          # zod-validated process.env
│
├── public/
│   ├── diagrams/                       # Sanitized architecture diagrams (SVG)
│   └── projects/                       # Project screenshots
│
├── types/content.ts                    # Project, Role, UsesItem, SiteConfig
│
├── .env.example                        # NEXT_PUBLIC_SITE_URL (v1.x: RESEND_API_KEY, CONTACT_TO_EMAIL)
├── next.config.ts                      # NO `output: 'export'`. Minimal config.
├── postcss.config.mjs                  # { plugins: { "@tailwindcss/postcss": {} } }
├── tsconfig.json                       # strict, noUncheckedIndexedAccess, paths "@/*"
└── package.json                        # packageManager: pnpm@...
```

**Layout arbitration:**
- **No `src/` directory.** ~30 files total — `src/` adds a hop without payoff.
- **No route groups in v1.** Add `(marketing)` / `(demo)` only when v2 RAG demo ships.
- **`content/` and `actions/` at the root**, not inside `app/` — they are data and app-wide concerns, not routing.
- **No `_components` private folders.** Top-level `components/` is conventional.

**Major components and responsibilities:**
1. **`content/*.ts` + `lib/content.ts`** — Typed source of truth for all site content; consumed at build time by Server Components only.
2. **`components/sections/*`** — Server Components composed into `app/page.tsx`; receive props from content accessors.
3. **`components/interactive/*`** — `"use client"` leaves only (`CopyEmail` in v1; `ContactForm` in v1.x). Client components never import from `content/*` directly — content flows in as serializable props.
4. **`app/{sitemap,robots,opengraph-image}.tsx`** — Build-time SEO emission, derived from `content/`.
5. **`actions/contact.ts` (v1.x)** — Server Action with zod validation + Resend SDK; replaces v1 `mailto:`.
6. **`app/(demo)/chat/*` + `app/api/chat/route.ts` (v2)** — Plugs in as isolated route group; rest of static surface untouched. Middleware enforces Upstash rate-limiting on `/api/chat`.

### Critical Pitfalls

The four hazards that must be addressed in v1 (not retrofitted):

1. **Asurion confidentiality leakage (PITFALL #2)** — Maintain an explicit allow-list of Asurion facts (start from the public May-2026 resume; do not add detail beyond it). Diagrams drawn from scratch in Excalidraw/tldraw with generic node names ("Retriever," "Reranker," "Vector Store") — no internal product / codename / queue / dataset names. No screenshots of internal systems, ever. **Dedicated confidentiality review gate before Phase 3.** Apply the "would I be comfortable if my Asurion manager saw this on LinkedIn tomorrow?" check on every Asurion-touching paragraph.

2. **LinkedIn OG image renders broken on shares (PITFALL #3)** — Set `metadataBase: new URL('https://pjnhek.com')` in root layout (without it, `og:image` URLs resolve relative and LinkedIn rejects). Use `app/opengraph-image.tsx` file convention (static, 1200×630, no redirects, content-type `image/png`). Provide explicit `openGraph.images` with width/height/alt. Verify on **production URL** with LinkedIn Post Inspector + opengraph.xyz + a real Slack DM (preview deployments behave differently). Design the OG image like a typography poster — James's name + role + domain.

3. **Vercel Hobby bandwidth / image-transformation cap blowout (PITFALL #5)** — Pre-encode hero + project images at 2–3 sizes (AVIF + WebP source). Cap `next/image` `sizes` breakpoints to mobile + desktop only. Raise `images.minimumCacheTTL` in `next.config.ts`. Enable Vercel usage email alerts at 50% / 80% / 100% of bandwidth. Keep `app/opengraph-image.tsx` static for the home route. Have a "swap to `unoptimized: true`" recovery plan ready.

4. **Legacy `pnhek.github.io` + accidental static export (PITFALLS #7 and #12)** — Take down or 301-redirect the legacy `pnhek.github.io` before pjnhek.com launches. **Do not set `output: 'export'`** in `next.config.ts` — it silently kills `next/image` optimization, `ImageResponse`, ISR, and dynamic OG. Curate the GitHub profile (6 pinned repos matching featured 4 + 2 supporting; archive `githubtest`, `poc_scraper`, course/job-scraper repos; meaningful `pjnhek/pjnhek` profile README linking to pjnhek.com). The GitHub profile is part of the portfolio surface.

Additional high-priority hazards addressed in design system or content phases:
- **Hero LCP regression** (#4) — `next/image` with `priority` + `fetchPriority="high"` on hero; `next/font` with `display: 'swap'`; total home-route JS <100KB gzipped.
- **Vague "passionate about AI" copy** (#1) — Falsifiable identity claim, every Asurion bullet has a number, find/replace "AI Engineer" → "Software Engineer" must change meaning.
- **Tailwind v4 + Next.js 16 misconfiguration** (#6) — Lock the v4 idioms at scaffold; no v3-era tutorials.
- **Apex domain / SSL / email DNS** (#8) — A-record at apex; set up email forwarding *before* nameserver cutover if `james@pjnhek.com` is in scope.
- **Mobile experience** (#10) and **accessibility** (#11) — Mobile-first at 375px on real iPhone; `focus-visible:ring-*` baked into design tokens; contrast ≥4.5:1 verified.
- **Scope creep** (#9) — PROJECT.md Out-of-Scope as a hard contract; ship date set at start of Phase 1.

## Implications for Roadmap

Research dictates a **5-phase v1 with a 1-phase v2** structure. Phase 1 (Foundations) and Phase 2 (Content Schema + Sections) are the only truly upstream phases; everything after parallelizes.

### Phase 1: Foundations & Design System
**Rationale:** Lock the stack and design tokens before any content.
**Delivers:** `pnpm create next-app` scaffold with Next 16 + Tailwind v4 + TS strict; `app/globals.css` with `@theme` mono palette + clamp() typography; `next/font` (Geist Sans + Mono); `components/ui/{Section,NumberedHeading,Tag,ExternalLink,ArchitectureDiagram}.tsx` primitives; `app/layout.tsx` with `metadataBase` + default metadata; `tsconfig.json` strict; `lib/env.ts` zod scaffold; deploy decision locked (Vercel Hobby, no `output: 'export'`).

### Phase 2: Content Schema, Sections & Sanitization
**Rationale:** Content phase, gated by confidentiality review.
**Delivers:** `types/content.ts`; populated `content/{site,experience,projects,uses}.ts`; `lib/content.ts` accessors; `app/page.tsx` composing Hero / About / Experience / FeaturedProjects / Contact; `app/projects/[slug]/page.tsx`; `app/uses/page.tsx`; sanitized Asurion + 1 featured-project diagram; `components/interactive/CopyEmail.tsx`; curated GitHub profile; legacy `pnhek.github.io` decommission plan.
**Gate:** Confidentiality review of Asurion section is a **hard merge gate**.

### Phase 3: SEO, Polish, Performance & Accessibility
**Delivers:** `lib/seo.ts`; `generateMetadata` on every route; `app/opengraph-image.tsx`; `app/sitemap.ts` + `app/robots.ts`; `app/icon.tsx` + `apple-icon`; `app/not-found.tsx`; mobile QA on real iPhone; Lighthouse ≥95 / 100 on mobile; axe DevTools clean; cold-read copy review.

### Phase 4: Deploy & Domain Cutover
**Delivers:** Vercel project linked; env vars set; DNS configured (`A @ 76.76.21.21`, `CNAME www → cname.vercel-dns.com`); HTTPS verified on all four URL variants; legacy `pnhek.github.io` taken down or 301-redirected; Vercel usage alerts enabled; LinkedIn Post Inspector verified against **production**; all external links manually clicked from production; UptimeRobot set up.

### Phase 5: Post-Launch Polish (v1.x)
**Delivers (signal-triggered, in priority order):** per-project detail pages → Resend contact form via Server Action → View Source easter egg → dynamic per-project OG → GitHub stars/last-updated → Vercel Analytics silently → ⌘K command palette.

### Phase 6 (v2): RAG Demo
**Delivers:** `/chat` page + `app/api/chat/route.ts` streaming via Vercel AI SDK; `middleware.ts` with Upstash Ratelimit (10 req/10s, 50/day); closed corpus (site content + project READMEs); provider daily spend cap; kill-switch env var.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 4 (Deploy & Domain Cutover):** Email forwarding choice (ImprovMX vs Cloudflare Email Routing vs Fastmail), registrar-specific ALIAS/ANAME support, CAA records.
- **Phase 6 (v2 RAG demo):** Upstash Ratelimit + Vercel AI SDK + prompt-injection hardening + corpus design.

Phases with standard patterns (skip research-phase): Phases 1, 2, 3, 5.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Verified against official Next.js 16, Tailwind v4, Vercel, Resend docs. |
| Features | HIGH (table stakes), MEDIUM (differentiators) | Table stakes universal; differentiator priorities are opinionated arbitrations. |
| Architecture | HIGH | Canonical Next.js 16 patterns per official docs. |
| Pitfalls | HIGH | Cross-verified across official docs, GitHub issues, OWASP. |

**Overall confidence:** HIGH.

### Conflicts Resolved

| Conflict | Resolution | Rationale |
|----------|------------|-----------|
| STACK lists `motion` as optional; ARCHITECTURE + PITFALLS recommend skipping | **Skip in v1.** | CSS + View Transitions cover the typography-led aesthetic. |
| STACK frames MDX as a sweet spot; ARCHITECTURE recommends typed TS modules | **Typed TS modules in `content/`.** | 4 hand-curated projects don't justify MDX runtime. |
| FEATURES classifies contact form backend as anti-feature; STACK + ARCHITECTURE describe Resend Server Action | **`mailto:` + copy-email in v1; Resend form in v1.x.** | Resend domain DNS adds Phase 4 risk. |
| STACK suggests dynamic per-project OG via `@vercel/og`; PITFALLS warns about transformation count | **Static site-wide OG in v1; dynamic per-project deferred to v1.x.** | Hobby image-transformation cap is a real risk. |
| FEATURES lists numbered section anchors as "P1 if cheap else P2"; ARCHITECTURE treats as part of design system | **Ship in Phase 1.** | Aesthetic match to huyml.co reference, near-zero cost. |
| STACK suggests `shadcn/ui`; ARCHITECTURE says no UI kit | **No pre-install.** Vendor primitives case-by-case. | shadcn vendors into repo; later == same cost as now. |

## Sources

**Primary (HIGH confidence):** Next.js 16 docs (upgrade guide, project structure, RSC, metadata, forms, static-exports), Tailwind v4 docs (upgrade, @theme, Next.js install), Vercel docs (Hobby plan, limits, image optimization limits, custom domain), Resend docs (pricing, Next.js guide), Vercel AI SDK RAG guide, OWASP LLM Prompt Injection Cheat Sheet, web.dev Web Vitals.

**Secondary (MEDIUM confidence):** vercel/next.js issue #60180 (LinkedIn OG quirk), Contentlayer-abandoned analysis, PkgPulse benchmarks, Promptfoo RAG red-teaming, Lee Robinson + Brittany Chiang reference portfolios.

---
*Research completed: 2026-05-20*
*Ready for roadmap: yes*
