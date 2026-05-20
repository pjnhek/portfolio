# Feature Research

**Domain:** AI Engineer personal portfolio site (recruiter-facing) — pjnhek.com
**Researched:** 2026-05-20
**Confidence:** HIGH (table stakes/anti-features), MEDIUM (differentiators/AI-specific patterns)

## Feature Landscape

### Table Stakes (Users Expect These)

Recruiters expect these on any modern engineering portfolio. Missing them = the site reads as unfinished or amateur, and many recruiters bounce inside 10 seconds.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Hero / above-the-fold identity statement | Recruiter must know "who, what, where" in <5s — name, role, current company (Asurion), specialization (RAG/evals), location | LOW | One sentence + role line. Avoid hero animation/typing effects that delay LCP. Static text first, polish second. |
| About section (career-pivot narrative) | Tax analyst → AI engineer is a real differentiator and humanizes the resume; recruiters skim for "story" | LOW | Prose, not bullets. ~150–250 words. Anchor link `#about`. |
| Experience section embedded inline | User explicitly does not want a PDF download; recruiters won't leave the page to read a PDF | LOW | Reverse-chronological. Asurion first with sanitized high-level wins. Each role: company, dates, 3–5 result-oriented bullets with metrics where possible. |
| Featured Projects section (4 curated) | Headline signal — "what can this person actually build." 3–6 projects is the convention. | MEDIUM | Each card needs: title, 1-line value prop, tech chips, GitHub link, optional Demo link, optional screenshot/diagram. SF Date Night, GTM Research, Voice Intent Eval, Daily Weather. |
| Contact section with email + LinkedIn + GitHub | A portfolio without an obvious contact path is broken | LOW | `mailto:` + LinkedIn + GitHub. No backend form needed (see Anti-Features). Include resume-style location/availability line. |
| /uses page | Convention in dev-portfolio space (popularized by Wes Bos `uses.tech`); signals "I have opinions about my tools" | LOW | Editor, terminal, shell, models, MCPs, hardware, fonts. One static page. |
| Mobile responsive (mobile-first) | Recruiters frequently open links from LinkedIn/email on phone first. PROJECT.md explicitly flags this. | MEDIUM | Tailwind responsive utilities; test at 375px (iPhone SE) up. Numbered-section design (huyml.co reference) collapses cleanly. |
| Fast LCP / clean Lighthouse | The site itself signals engineering quality. >2.5s LCP on a static portfolio reads as careless. | MEDIUM | Static generation, no client-side data fetching for above-the-fold content, system fonts or `next/font` with subsetting, no hero animation. Target 95+ Performance, 100 Accessibility. |
| Semantic HTML + SEO meta tags | Recruiters Google candidate names; site should rank for "James Nhek" / "pjnhek". Also lets recruiters paste link into Slack with a preview. | LOW | `<main>`, `<section>`, `<article>`, `<h1>` once, proper heading hierarchy. `<title>`, `description`, `og:*`, `twitter:card`. |
| Open Graph + Twitter card image | When the link is shared on LinkedIn/Slack/iMessage, it must render with a preview card. Naked URL previews look amateur. | LOW | 1200x630 PNG. Static file at `/app/opengraph-image.png` (Next.js convention) is simpler than dynamic `@vercel/og` for v1. Twitter card type: `summary_large_image`. |
| Favicon (multi-resolution) | Browsers, bookmarks, mobile home-screen all need it. A missing/default favicon is the #1 "did they finish this?" tell. | LOW | `/app/icon.png` + `/app/apple-icon.png` (Next.js auto-handles). 32x32, 180x180. |
| Custom domain with HTTPS | `pjnhek.com` already targeted; a `.vercel.app` URL is a downgrade signal | LOW | Vercel handles HTTPS automatically. Just configure DNS. |
| `robots.txt` + `sitemap.xml` | SEO basics; lets Google index quickly for "James Nhek" searches | LOW | Next.js `app/robots.ts` + `app/sitemap.ts`. |
| Functioning links (no 404s) | Self-explanatory; broken links = "they didn't test their own site" | LOW | Check all external links before launch. |

### Differentiators (Competitive Advantage)

Features that set a serious-engineer portfolio apart from a templated one. None are individually load-bearing — pick the ones that match aesthetic budget.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Sanitized architecture diagrams for projects | For an AI engineer, a clean Mermaid/Excalidraw diagram of a RAG pipeline is the single highest-signal artifact. Far more credible than screenshots of internal tools. | MEDIUM | Hand-drawn Excalidraw or Mermaid SVGs. Required for Asurion work (per PROJECT.md). Worth doing for at least 2 of 4 featured projects (SF Date Night, Voice Intent Eval). |
| "View Source" easter egg / hidden recruiter message | Recruiters who inspect source are the most engaged; an HTML comment greeting them ("Hey — if you're reading this, email james@pjnhek.com") is a memorable signal. Documented hiring pattern. | LOW | One HTML comment in `<head>` or near `<body>`. Cost is ~10 minutes. High memorability return. |
| Clean code in View Source | Even without an easter egg, a recruiter who knows what they're doing will inspect. Hydration noise, inline `<style>` blobs, and 12 `<div>` wrappers around a heading all signal bad work. | MEDIUM | Use semantic tags, avoid client components where SSR works, audit final HTML. This is a free win specific to custom-coded vs templated portfolios. |
| Copy-email-to-clipboard button | Faster than opening a mail client; small touch that signals "the person who built this thinks about UX." | LOW | `navigator.clipboard.writeText` + tooltip ("Copied!"). 30-line component. |
| Project metric callouts ("+10.6% accuracy", "100% intent accuracy / 80 scenarios") | Metric-led project framing is the difference between "I worked on RAG" and "I shipped RAG that moved a number." Resume already has these — surface them visually. | LOW | Big-number treatment in the project card (e.g., `text-3xl font-medium` next to muted caption). |
| Problem → Approach → Result project framing | Standard portfolio case-study framework; clearer narrative than "Here's a thing I built." Recruiters scan in this order anyway. | LOW | Per-project: 1 line problem, 2–3 lines approach (with tech), 1–2 lines result with metric. No long-form case-study pages needed for v1. |
| Tech-stack chip rows under each project | Lets a recruiter pattern-match against the JD ("LangGraph ✓, pgvector ✓, Cloud SQL ✓") in <2 seconds | LOW | Small monochrome chips/tags, no logos. Keep to 4–7 per project. |
| GitHub + Demo button pair on each project | Convention; lets the curious recruiter click through. Even "code only, no demo" is fine if labeled. | LOW | Two buttons or two icon-links. If no live demo, just GitHub. Do not fake a "demo" button that leads to a screenshot. |
| Custom 404 page | Cheap personality moment; recruiters who land on a broken/old link see a thoughtful page instead of generic Vercel 404 | LOW | `app/not-found.tsx`. Same typographic style as homepage, link back to /. |
| Keyboard navigation (anchor links + visible focus rings) | Accessibility table stakes; also a "this dev cares" signal | LOW | Tailwind `focus-visible:ring-*` utilities. Skip-to-content link. |
| Hand-curated `/uses` page beyond defaults | Most `/uses` pages list IDE + terminal. An AI engineer's `/uses` should also call out: model defaults (Claude Opus 4.7), MCP servers (Context7, Firecrawl, Exa), eval stack (LangSmith / Promptfoo / MLflow), agent framework (LangGraph), notebook environment | LOW | Differentiator vs generic-dev `/uses` pages. Reinforces AI-engineer identity. |
| Command palette (⌘K) for navigation | High-signal "I sweat the details" feature; popular on leerob.io, paco.me. Lets keyboard-driven engineers jump sections. | MEDIUM | Use `cmdk` (by Paco Coursey) or `kbar`. ~1 day of work. **Recommend deferring to v1.1** — recruiter audience won't use it; engineering peers will. Worth shipping if calendar allows but not blocking launch. |
| Live GitHub stars / "last updated" on project cards | Shows projects are active, not abandoned. Fetched at build time avoids rate limits and runtime cost. | MEDIUM | Build-time fetch via GitHub REST API (5,000 req/hr authenticated). Cache to JSON, render statically. **Risk:** small projects with 0–5 stars makes them look weak; only show if stars > N or omit the count. "Last updated" is safer — frames work as recent. |
| "Available for" / status line in hero or contact | Job-hunting signal without being thirsty. "Open to AI Engineer / ML Engineer roles · Available July 2026" sets recruiter context. | LOW | One line in hero or contact section. Easy to remove post-hire. |
| Location signaling | Recruiters filter by location (SF Bay / remote / hybrid). Missing this = wasted recruiter time / missed roles. | LOW | "San Francisco, CA" in hero or contact. PROJECT.md doesn't specify location; confirm with user. |
| Anchor-link section indices (numbered sections like huyml.co) | Aesthetic differentiator that matches design reference; serves as a TOC for scrollers | LOW | `01.`, `02.`, `03.` prefix on section headers. Pure CSS / typography. |
| MDX or structured project content | Lets project content live as data rather than JSX, simpler to maintain | MEDIUM | **Defer to v1.1.** With only 4 curated projects, hand-coded JSX is faster to ship. Refactor to MDX only if a 5th+ project gets added. |

### AI-Engineer-Specific Touches (Differentiators in this niche)

Patterns that signal AI/ML competence specifically — what separates an AI engineer's portfolio from a generic full-stack dev's.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Eval-first project framing | Every project description that mentions an LLM should also mention how it was evaluated. "100% intent accuracy across 80 scenarios" (Voice Intent Eval) and "Cohen's kappa for self-preference bias" (GTM) already do this — keep that pattern. Recruiters in 2026 explicitly downgrade portfolios that claim "it works well" without eval methodology. | LOW | Audit each project card to surface the eval/metric, not the model. |
| Concrete stack callouts over jargon | "LangGraph + pgvector on Cloud SQL + MLflow Model Registry" is more credible than "agentic AI system." Specificity is the entire point. | LOW | The resume already does this well. Mirror that on the site; don't water it down. |
| Sanitized RAG architecture diagram for Asurion | Asurion work is the most credentialing item on the site but is confidentiality-bound. A fresh-drawn diagram showing "ingestion → embed → hybrid retrieve → rerank → eval loop" with no internal names is the safe, high-signal way to show depth. | MEDIUM | Excalidraw or Mermaid. No internal tool names. Generic boxes labeled with public-tech names (Vertex, pgvector, LangSmith). |
| Live RAG/agent demo on the homepage | High-signal "I can ship", but adds API cost, rate-limiting work, prompt-injection surface, and complexity. | HIGH | **Defer to v2** per PROJECT.md. When added: rate-limit per IP (e.g., 5 queries/day via Upstash Redis), strict input length cap, system prompt that prevents off-task behavior, set hard monthly budget on the LLM provider, log + monitor. Voice Intent Eval is the lowest-risk candidate to demo (smaller scope, eval already in place). |
| "Read the writeup" link per project (lightweight case study) | Even a 300-word per-project page (`/projects/sf-date-night`) is enough to differentiate from generic-dev portfolios. Lets a serious recruiter go deeper without bloating the home page. | MEDIUM | Per-project page with Problem/Approach/Result + diagram. **Recommend for v1.x** — start with cards-only on home; add per-project pages for top 1–2 projects post-launch. |
| Plain-English "what is this" line per project | The bridge between "Agentic SF Date Night Concierge" and a non-LangChain-fluent recruiter. One sentence: "An LLM agent that recommends date-night plans from a database of 5,800+ SF spots." | LOW | Tag this as the project subtitle, sitting between title and tech-jargon description. Critical for recruiters who aren't ML specialists. |

### Anti-Features (Commonly Requested, Often Problematic)

Features that look like good ideas but actively hurt this portfolio. Document so they don't re-enter scope.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Blog section with 0–2 posts | "Blogs signal thought leadership"; common advice | An empty/sparse blog signals abandonment more loudly than no blog at all. Already explicitly out of scope per PROJECT.md. | Skip blog for v1; add only when there are 3+ real posts. Consider linking to existing writing (LinkedIn, Medium) from /uses instead. |
| Dark/light mode toggle | "Modern sites have one" | Flash-of-wrong-theme on load is amateur; theming doubles every CSS decision; one well-tuned mode beats two mediocre ones. Out of scope per PROJECT.md. | One mode, well-designed. Pick monochrome dark or monochrome light to match design reference (huyml.co). Toggle adds to v2 only if neutral mode genuinely fails. |
| Large hero animation / typing effect / particle bg | "Looks impressive" | Delays LCP, increases CLS, looks dated in 2026, makes recruiter wait to read who you are. Negative signal for engineering audiences who recognize the perf cost. | Static typographic hero. If any motion, use a subtle `prefers-reduced-motion`-respecting fade-in. |
| Contact form with backend (requires hosting) | "Looks professional" / "captures leads" | Adds backend complexity, spam handling, possible cost; for an audience of <50 recruiter contacts, ROI is negative. | `mailto:` link + copy-email button + LinkedIn link. Optionally Formspree if user wants a form-shaped UX without a backend. |
| Auto-pulled GitHub repo list | "Show I'm active" | Surfaces junk repos (`githubtest`, `poc_scraper`, course repos). Explicitly out of scope per PROJECT.md. | Curate 4 featured projects manually. Link to `github.com/pjnhek` for the curious. |
| Resume PDF download button | "Recruiters want a PDF" | Adds friction (download → open → read), creates a stale-version maintenance burden, contradicts "experience embedded on-site" decision in PROJECT.md. | Embed experience section directly. If a recruiter insists on PDF, they can `Cmd+P → Save as PDF` from the site. |
| Long case-study pages with fluff | "Show depth" | A 2,000-word case study with no metrics signals you're padding. Recruiters skim. | Tight per-project page (300–500 words) with diagram + metrics. Defer all per-project pages to v1.x. |
| Visitor analytics dashboard | "Vanity metrics flex" (leerob.io has one) | Useless without traffic; out of scope per PROJECT.md; can't beat leerob's by an order of magnitude so it just invites comparison. | Add Vercel Analytics silently in v2 if you actually want the data; do not surface it on-site. |
| Talks / Certifications section | "Comprehensive" | Empty section if no real content; out of scope per PROJECT.md. | Omit. Add when content exists. |
| CMS / admin panel for content edits | "Easier updates" | Overkill for 4 projects + 2 prose sections that change ~quarterly. Out of scope per PROJECT.md. | Edit source + redeploy. Vercel preview deploys make this safe. |
| Confidential Asurion screenshots / internal-tool names | "Shows real work" | Legal/IP risk; can read as poor judgment to anyone hiring. Explicitly out of scope per PROJECT.md. | High-level metrics only (e.g., "+10.6% accuracy"), fresh-drawn diagrams using public-tech names, no internal terminology. |
| Skills bar chart (e.g., "Python ████████░░ 80%") | "Show breadth" | Subjective, unverifiable, and reads as a 2015 portfolio cliché. Reduces credibility. | Let the project tech-stack chips do the talking. Skills inferred from shipped work > self-assessed bars. |
| Generic "I love coffee and music" personal-trivia section | "Humanize me" | Doesn't help a recruiter assess fit; the career-pivot story in About already humanizes. | Keep the pivot story in About. Personal touches belong on `/uses`. |

## Feature Dependencies

```
[Custom domain + Vercel deploy]
    └──required by──> [OG image, sitemap, canonical URL, analytics-later]

[Featured Projects section]
    ├──requires──> [Sanitized architecture diagrams]   (for Asurion-adjacent depth)
    ├──requires──> [Project metric callouts]            (resume metrics surfaced)
    ├──requires──> [Problem→Approach→Result framing]    (per-project copy)
    └──enhances───> [GitHub stars / last-updated]       (build-time fetch)

[Hero] ──supports──> ["Available for X roles" status]
[Hero] ──supports──> [Location signaling]

[Contact section]
    ├──requires──> [mailto: link]
    └──enhances──> [Copy-email-to-clipboard button]

[Mobile responsive] ──blocking for──> [Launch]   (recruiters open on phone first)
[Fast LCP / clean Lighthouse] ──blocking for──> [Launch]   (the site is part of the portfolio)
[Favicon + OG image] ──blocking for──> [Launch]   (link previews + browser tab)

[Live LLM demo]
    └──depends on──> [Rate limiting] + [Budget caps] + [Prompt-injection hardening]
    └──blocks──────> v2 only (per PROJECT.md)

[Per-project writeup pages] ──depends on──> [Featured Projects shipped]
[Command palette ⌘K]     ──depends on──> [Section anchors stable]
```

### Dependency Notes

- **Featured Projects requires diagrams + metric callouts:** the projects are the core artifact; without diagrams and metrics, they read as a list of LangChain experiments. Diagrams + metrics are what convert "interesting" into "this person ships."
- **Live demo depends on rate-limiting/budget/security:** an unprotected demo on a public portfolio is a known attack surface (prompt injection, cost exhaustion). Worth shipping only when these controls are in place — hence v2.
- **OG image + favicon block launch:** these are the cheapest possible features and the most visible negative signal when missing. A LinkedIn share preview with no image and a missing-favicon browser tab tells recruiters the site is incomplete.
- **Per-project writeup pages depend on Featured Projects shipping first:** don't block v1 on long-form case studies; ship card-only first, write up the top 2 projects post-launch.
- **Command palette is decoupled from launch:** ⌘K is a "delight" feature for engineering peers, not a recruiter-conversion feature. Recommend post-launch.

## MVP Definition

### Launch With (v1)

Minimum viable product — what's needed for a recruiter to land, evaluate, and reach out within 60 seconds on phone.

- [ ] **Hero** with name, current role (AI Engineer @ Asurion), specialization (RAG / evals), location, "open to roles" line
- [ ] **About** section (career pivot narrative, ~200 words)
- [ ] **Experience** embedded inline (Asurion + USF MSDS + prior tax-analyst roles, reverse-chronological)
- [ ] **Featured Projects** (4 cards: SF Date Night, GTM Research, Voice Intent Eval, Daily Weather) with metrics, tech chips, GitHub link
- [ ] **Sanitized architecture diagram** for at least Asurion-context project + 1 featured project (Mermaid or Excalidraw)
- [ ] **Contact** section: `mailto:` + LinkedIn + GitHub + copy-email button
- [ ] **/uses** page (editor, terminal, models, MCPs, agent framework, hardware)
- [ ] **Custom 404** page
- [ ] **Favicon** (multi-resolution)
- [ ] **OG image** + Twitter card (static 1200x630 PNG)
- [ ] **`robots.txt` + `sitemap.xml`**
- [ ] **Semantic HTML + heading hierarchy + focus rings**
- [ ] **Mobile responsive** at 375px+
- [ ] **Lighthouse 95+ Performance, 100 Accessibility**
- [ ] **Custom domain `pjnhek.com`** with HTTPS

### Add After Validation (v1.x)

Features to add post-launch, triggered by usage signal (recruiter feedback, traffic, or a job-search milestone).

- [ ] **Per-project writeup pages** for top 1–2 projects (Problem → Approach → Result, ~300–500 words each, embedded diagram) — trigger: a recruiter asks "can you walk me through SF Date Night?"
- [ ] **Build-time GitHub stars + last-updated** on project cards — trigger: any project hits >10 stars (so showing the count helps rather than hurts)
- [ ] **"View Source" easter egg** (recruiter greeting in HTML comment) — trigger: post-launch polish, cheap to add anytime
- [ ] **Command palette (⌘K)** with `cmdk` library — trigger: post-launch, when engineering-peer audience grows (HN/LinkedIn share)
- [ ] **Vercel Analytics** (silent, no on-site dashboard) — trigger: any real referral traffic worth measuring
- [ ] **Numbered section anchors** (`01.` `02.` `03.`) matching huyml.co aesthetic — trigger: can ship at v1 if calendar allows, otherwise polish post-launch

### Future Consideration (v2+)

Features to defer until v1 is live and validated.

- [ ] **Live RAG / agent demo** (likely Voice Intent Eval or scaled-down SF Date Night) — defer for cost, rate-limiting, and prompt-injection hardening; only worth doing if user is willing to maintain it
- [ ] **Blog section** — only add when 3+ real posts exist
- [ ] **Dark/light mode toggle** — only if monochrome single-mode feels limiting after months of use
- [ ] **Talks/Certifications/Awards** — only when content exists
- [ ] **MDX-based project content** — only if project count grows past ~6 and hand-coded JSX becomes a pain
- [ ] **i18n** — not needed for a US-targeted job-search portfolio

## Feature Prioritization Matrix

| Feature | Recruiter Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Hero with role + location + availability | HIGH | LOW | P1 |
| About (career pivot story) | HIGH | LOW | P1 |
| Experience embedded inline | HIGH | LOW | P1 |
| Featured Projects (4 cards) | HIGH | MEDIUM | P1 |
| Sanitized architecture diagrams (2+) | HIGH | MEDIUM | P1 |
| Contact with mailto + LinkedIn + GitHub | HIGH | LOW | P1 |
| Project metric callouts | HIGH | LOW | P1 |
| Tech-stack chip rows | HIGH | LOW | P1 |
| Plain-English subtitle per project | HIGH | LOW | P1 |
| Mobile responsive | HIGH | MEDIUM | P1 |
| Fast LCP / Lighthouse 95+ | HIGH | MEDIUM | P1 |
| Favicon + OG image + Twitter card | HIGH | LOW | P1 |
| Semantic HTML + SEO meta + sitemap | MEDIUM | LOW | P1 |
| Custom 404 | LOW | LOW | P1 (cheap) |
| /uses page (AI-specific contents) | MEDIUM | LOW | P1 |
| Copy-email-to-clipboard | MEDIUM | LOW | P1 |
| Custom domain `pjnhek.com` | HIGH | LOW | P1 |
| View Source easter egg | LOW (memorable) | LOW | P2 |
| GitHub stars / last-updated | MEDIUM | MEDIUM | P2 |
| Per-project writeup pages | MEDIUM | MEDIUM | P2 |
| Numbered section anchors | LOW (aesthetic) | LOW | P1 if cheap else P2 |
| Command palette ⌘K | LOW (recruiters won't use) | MEDIUM | P3 |
| Live LLM demo | HIGH (if it works) | HIGH | P3 / v2 |
| Blog | LOW (with no posts) | MEDIUM | P3 / v2 |
| Dark/light toggle | LOW | MEDIUM | P3 / v2 |
| Analytics dashboard | LOW | MEDIUM | P3 / v2 |

**Priority key:**
- P1: Must have for launch (v1)
- P2: Should have, add when possible (v1.x)
- P3: Defer until v2

## Competitor Feature Analysis

Quick read on each reference site for THIS user (AI engineer, recruiter audience). What to borrow, what to avoid.

| Site | What it does well | What's wrong for this user | Borrow |
|------|-------------------|----------------------------|--------|
| **huyml.co** | Numbered sections, generous whitespace, monochrome, magazine-like rhythm, careful typography. PROJECT.md design reference. | Designer-focused (heavy imagery, scroll choreography); too "art-directed" for an engineering audience that wants metrics fast. | Numbered sections (`01.` `02.`), monochrome palette, whitespace discipline, typographic hierarchy. Lose the imagery-heavy art-direction. |
| **leerob.io** | Cmd+K palette, analytics dashboard, MDX blog, View Source is clean, dynamic OG images per post, fast. | Has years of blog content + audience; analytics dashboard works because his numbers are big. None of that applies pre-launch. | Cmd+K (post-launch), clean View Source, dynamic OG (only if it serves something). Do **not** copy his "/dashboard" — it'd be empty. |
| **brittanychiang.com** | Tight project section with role/dates/wins per role, semantic HTML, accessibility-first, keyboard nav. | Front-end-engineer framing (loves color palette, animations); over-stylized for AI/ML hiring context. | Role/dates/wins-per-role structure for Experience section. Keyboard nav and a11y discipline. |
| **paco.me** | Custom cmdk library origin, minimal hero, judicious use of motion. | Heavy on motion/transitions; some recruiters will read it as "designer-first." Built around being a design-engineer at Vercel — different audience. | Restraint on motion. cmdk library itself for v1.x palette. |
| **rauchg.com** | Extreme minimalism — essentially a Twitter-like feed of thoughts. Fastest to load. Authority signal. | Works because he's the CEO of Vercel; minimalism on an unknown candidate's site reads as "incomplete," not "confident." | Minimalism discipline, but with more structure (sections, projects, experience) because the user is candidate-side, not authority-side. |
| **anjana.dev** | AI/data-engineer aesthetic; explicit about niche; clean project framing with metrics; "what I'm doing now" line. | (Specific cosmetic choices may not match huyml.co reference; treat as content reference, not visual reference.) | Niche-explicit hero, "currently doing X" line, metric-led project framing — closest spiritual match to this site. |

## Sources

- [Lee Robinson portfolio (leerob.io) GitHub forks](https://github.com/leerob/leerob.io)
- [Brittany Chiang v4 portfolio](https://github.com/bchiang7/v4)
- [Several Ways to Hide Easter Eggs on your Website — Bryan Braun](https://www.bryanbraun.com/2018/04/01/several-ways-to-hide-easter-eggs-on-your-website/)
- [Troy Hunt — Deconstruct websites, get hired: hiding recruitment messages in source code](https://www.troyhunt.com/deconstruct-websites-get-hired-hiding/)
- [cmdk by Paco Coursey — command palette library](https://github.com/pacocoursey/cmdk)
- [kbar — extensible cmd+k React interface](https://github.com/timc1/kbar)
- [Next.js Open Graph Image conventions](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image)
- [Twitter Cards Developer Checklist 2026 — MetaHead](https://metahead.io/blog/twitter-cards-checklist)
- [GitHub API Rate Limits in 2026 — DEV Community](https://dev.to/agenthustler/github-api-rate-limits-in-2026-when-web-scraping-is-the-better-choice-hdo)
- [Creating contact forms on static HTML websites — Steven Cotterill](https://stevencotterill.com/articles/creating-contact-forms-on-static-html-websites/)
- [Simple Backends: Four ways to implement Contact Us on static sites — Bobby Brennan](https://medium.com/datafire-io/simple-backends-four-ways-to-implement-a-contact-us-form-on-a-static-website-10fc430984a4)
- [LLM Embedding Security — Galileo](https://galileo.ai/blog/llm-embedding-security-risks-defenses)
- [How to Implement LLM Rate Limiting — OneUptime](https://oneuptime.com/blog/post/2026-01-30-llm-rate-limiting/view)
- [ML Engineer Portfolio Projects That Will Get You Hired — Medium](https://medium.com/@santosh.rout.cr7/ml-engineer-portfolio-projects-that-will-get-you-hired-in-2025-d1f2e20d6c79)
- [Your case-study framework is broken — Bootcamp/Medium](https://medium.com/design-bootcamp/your-ux-portfolio-case-study-is-broken-heres-the-new-framework-65342de82989)
- [How to Build an AI Portfolio that Gets You Hired — ProjectPro](https://www.projectpro.io/article/artificial-intelligence-portfolio/1140)
- [10 AI Engineering Principles in 2026 — Turing College](https://www.turingcollege.com/playbooks/ai-engineering-guidebook)

---
*Feature research for: AI Engineer personal portfolio (pjnhek.com)*
*Researched: 2026-05-20*
