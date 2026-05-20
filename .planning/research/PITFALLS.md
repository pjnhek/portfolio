# Pitfalls Research

**Domain:** AI Engineer personal portfolio site (Next.js + Vercel, free tier, custom domain, recruiter-first audience)
**Researched:** 2026-05-20
**Confidence:** HIGH (cross-verified across Next.js docs, Vercel docs, Tailwind v4 docs, recruiter trend reports, RAG security research; LinkedIn OG quirks via vercel/next.js issue tracker)

Phases referenced below match the planned roadmap shape:

- **Phase 1 — Foundations & Design System** (Next.js scaffold, Tailwind v4 setup, type system, monochrome design tokens, font loading, base layout primitives)
- **Phase 2 — Content & Sections** (Hero, About, Experience, 4 Featured Projects, /uses, Contact — including Asurion sanitization workflow and diagrams)
- **Phase 3 — Polish, SEO, Performance** (metadata, OG image, Lighthouse pass, a11y pass, responsive QA)
- **Phase 4 — Deploy** (Vercel, pjnhek.com DNS, email DNS, post-deploy verification)
- **Phase 5+ (v2)** — Blog, dark mode, RAG demo, analytics

---

## Critical Pitfalls

### Pitfall 1: Vague "passionate about AI" copy that sounds like every other resume

**What goes wrong:**
The hero and about sections read like a LinkedIn summary written by a chatbot — "passionate about leveraging cutting-edge AI to deliver impactful solutions." Recruiters skim, see nothing concrete, bounce in under 20 seconds. James loses the differentiation that his actual resume already has (tax analyst → AI engineer pivot, named RAG metrics, specific architectures).

**Why it happens:**
Writing copy is hard. Engineers default to safe corporate phrasing because it feels professional, but in 2026 every candidate uses the same vocabulary (RAG, LLM, agentic). Recruiters explicitly call out "passionate," "leveraged," "cutting-edge" as low-signal buzzwords. The bar in 2026 is concrete artifacts and metrics, not adjectives.

**How to avoid:**
- Lead with a one-sentence identity claim that is falsifiable: "AI Engineer at Asurion building multi-tenant RAG with hybrid search + reranking and a custom eval framework." No adjectives.
- Every Asurion bullet must contain at least one number from the May 2026 resume (e.g., +10.6% accuracy).
- Replace "passionate about" / "leveraged" / "cutting-edge" with action verbs that imply choice ("chose pgvector + HNSW because…", "swapped LLMs at runtime via MLflow Model Registry").
- The pivot story (tax analyst → AI engineer) goes in the About section verbatim — it is the differentiator no other candidate has.
- Run final copy through the "weekend project test": does each project description distinguish itself from a tutorial follow-along? If not, add scale, complexity, or a decision.

**Warning signs:**
- Copy survives find/replace from "AI Engineer" to "Software Engineer" without losing meaning.
- A peer reading the page can't name a single specific technical decision James made.
- No numbers above the fold.

**Phase to address:** Phase 2 (content drafting). Verify in Phase 3 with a 60-second cold-read by a non-technical reviewer.

---

### Pitfall 2: Asurion confidentiality leak — internal tool names, screenshots, or proprietary architecture details

**What goes wrong:**
James writes about Asurion the way he'd talk in an internal design review. Internal product/tool names slip into copy. A "sanitized" diagram still has a recognizable internal service name in a box. A screenshot of an internal admin tool is used because it "looks cool." Result: potential breach of employment agreement; at minimum, a recruiter or legal contact at Asurion sees it on LinkedIn and James loses both reputational and legal standing — exactly when he is interviewing.

**Why it happens:**
Engineers don't distinguish well between "publicly safe metric I cited in a public talk" and "metric Asurion would not want disclosed." Sanitization is treated as a copy-edit pass instead of a separate, intentional workflow. Diagrams get copied from internal docs and lightly redrawn.

**How to avoid:**
- Maintain an explicit allow-list of facts that may appear on the site for Asurion work. Anything not on the list is off-limits. Start with the resume's already-public phrasing; do not add detail beyond it.
- Diagrams must be drawn from scratch in a neutral tool (Excalidraw/tldraw/Figma), never traced from internal docs. Use only generic component names: "Retriever," "Reranker," "LLM," "Vector Store." No internal product names, codenames, queue names, dataset names, or team-specific terminology.
- No screenshots of any internal system, ever. If a visual is needed, build a fresh mock from generic UI primitives.
- Default to high-level metrics already on the resume (e.g., +10.6% accuracy). Do not add unpublished metrics.
- Run a "would I be comfortable if my Asurion manager saw this on LinkedIn tomorrow?" check on every Asurion-touching paragraph before merge.
- Have one Phase 2 review gate where the Asurion section is reviewed in isolation specifically for confidentiality, not for style.

**Warning signs:**
- Any proper noun in the Asurion section that isn't "Asurion."
- Diagram nodes labeled with non-generic names.
- A teammate at Asurion could identify the specific service or product from the page.
- Metrics or dates that don't appear on the public resume.

**Phase to address:** Phase 2 (content & sanitization workflow). Confidentiality review is a hard gate before Phase 3.

---

### Pitfall 3: Broken or missing OG image — LinkedIn shares look amateur

**What goes wrong:**
Recruiter posts `pjnhek.com` in a Slack DM or LinkedIn message — preview shows no image, a tiny default favicon, or a broken-image icon. Worse: the OG image is correctly set but only renders on Twitter/iMessage, not LinkedIn (a documented platform-specific quirk). The link looks unprofessional in exactly the channels recruiters actually use.

**Why it happens:**
- App Router metadata API is easy to misconfigure: `metadata` and `generateMetadata` cannot both be exported from the same route segment; `opengraph-image.png` file convention requires exact filename and location; LinkedIn has stricter requirements (absolute URLs, correct content-type, no redirects).
- Many devs ship without testing previews on every social platform.
- `metadataBase` is not set, so all `og:image` URLs resolve relative and break.

**How to avoid:**
- Use the Next.js App Router file convention: place `opengraph-image.png` (1200×630, <8MB, ideally <300KB) and `twitter-image.png` at `app/`. Or generate dynamically with `ImageResponse` from `next/og` (typed-safe route handler).
- Set `metadataBase: new URL('https://pjnhek.com')` in root layout `metadata`. Without it, OG image URLs are relative and LinkedIn rejects them.
- Provide explicit `openGraph.images` with `width: 1200, height: 630, alt: '...'` even when using file conventions, to satisfy strictest scrapers.
- After deploy, verify on three tools: LinkedIn Post Inspector, opengraph.xyz / OG Check, and a real Slack DM. The LinkedIn vs Twitter discrepancy is a known issue (vercel/next.js#60180); the workaround is making sure the OG image is served via HTTPS, has no redirects, content-type is `image/png` or `image/jpeg`, and is reachable without auth.
- The OG image itself is part of the portfolio — design it like a typography poster, not a stock badge. James's name + role + the domain.

**Warning signs:**
- "Inspect" on LinkedIn Post Inspector returns no image or "could not download image."
- The OG image returns 404, 307, or text/html content-type when fetched directly.
- Browser DevTools shows og:image as a relative URL.

**Phase to address:** Phase 3 (SEO & metadata). Verify in Phase 4 post-deploy on production URL (sharer previews differ between preview deployments and prod).

---

### Pitfall 4: Hero LCP regression from lazy-loaded or oversized hero imagery / fonts

**What goes wrong:**
Lighthouse score drops below 90. LCP > 2.5s on mobile. The biggest above-the-fold element — likely a hero portrait or background — is lazy-loaded, served as unoptimized PNG, or delayed by a web font that blocks text rendering. A site whose entire purpose is to signal "this engineer understands quality" fails the most basic quality metric.

**Why it happens:**
- Default Next.js Image config does not preload anything; devs forget `priority` on the LCP image.
- Web fonts are loaded via `<link>` without `font-display: swap` (or via Tailwind defaults without `next/font`).
- Heavy hero animation (Framer Motion / large client component) pushes JS into the critical path.
- Lab Lighthouse looks fine; real CrUX field data is worse (different network, different device).

**How to avoid:**
- Use `next/font` (Google or local) — automatically self-hosts, eliminates render-blocking, applies `font-display: swap`.
- For the hero image, use `next/image` with `priority`, `fetchPriority="high"`, explicit `width`/`height`, and AVIF/WebP via Vercel's Image Optimization API. Never `loading="lazy"` above the fold.
- If the design is typography-led (per huyml.co reference), the LCP element is likely text — make sure the hero heading is rendered with a system-font fallback that is visually identical enough to avoid CLS when the web font loads.
- Reserve space for any image (explicit dimensions) to prevent CLS during layout.
- Audit with Lighthouse + WebPageTest at "mobile slow 4G" before launch. Don't trust desktop Lighthouse.
- Keep total JS on the landing route under 100KB gzipped. The home route should be largely a server component; client components only where interaction is required.

**Warning signs:**
- Lighthouse mobile LCP > 2.5s.
- "Largest Contentful Paint image was lazily loaded" warning in Lighthouse.
- CLS > 0.1 — usually a font swap or missing image dimensions.
- Network panel shows >500KB of JS for the home route.

**Phase to address:** Phase 1 (font loading + Image conventions baked into design system). Verify in Phase 3 (Lighthouse pass).

---

### Pitfall 5: Free-tier blowout — Vercel Hobby bandwidth / image transformation cap hit mid-job-search

**What goes wrong:**
Site goes viral on Hacker News or a LinkedIn post, or a single image gets requested in many variants, or someone hotlinks an OG image into a Discord. Hobby plan caps at 100GB bandwidth, 5K image transformations, 100K image cache writes per month. Vercel disables the project ("paused until next cycle") or returns 402 on new image variants. Recruiters who click during the outage see a dead site — the absolute worst time to be down.

**Why it happens:**
- Devs assume "free tier" means "free forever, no limits."
- Many distinct image sizes (mobile + tablet + desktop + 2x) multiply transformations.
- Open Graph image regenerates per request if not cached.
- Hobby plan also has a "non-commercial use only" clause — a portfolio for job hunting is fine, but freelance-promotion content would technically violate ToS.

**How to avoid:**
- Pre-optimize images at build time: ship AVIF + WebP source files at 2-3 sizes; let `next/image` serve cached variants instead of generating on the fly.
- Limit the number of `sizes` breakpoints in `next/image` to what's actually used in the design (mobile + desktop is enough for a portfolio).
- Cache OG image generation: if using dynamic `ImageResponse`, set `revalidate` to a long value (or use a static `opengraph-image.png` for the home route).
- Configure `images.minimumCacheTTL` to a large value in `next.config.js` so transformations are reused.
- Set up Vercel usage alerts (email at 50%, 80%, 100% of bandwidth) — even though analytics is out of scope, basic usage email alerts are free and worth turning on.
- Have a backup plan: if usage spikes, swap to all-static images (`unoptimized: true`) within minutes to stop transformation costs.
- Do NOT enable Vercel Analytics' paid tier accidentally during setup; verify only free Hobby features are turned on.

**Warning signs:**
- Vercel dashboard shows >25% of any quota with weeks left in the cycle.
- Image transformations growing per visitor instead of staying flat (means caching is broken).
- 402 responses in deployment logs.

**Phase to address:** Phase 4 (deploy & cost guardrails). Image strategy decisions made earlier in Phase 1.

---

### Pitfall 6: Tailwind v4 + Next.js 15 misconfiguration breaks build silently

**What goes wrong:**
Devs follow a 2024 tutorial, install Tailwind v3-style (`tailwind.config.js` + `@tailwind base/components/utilities`), then upgrade to v4. Build either fails outright or — worse — succeeds but ships empty styles because the import syntax changed. Or a v3-era plugin (older typography, forms, daisyUI) is incompatible with the new CSS-first config and silently no-ops.

**Why it happens:**
- Tailwind v4 changed import syntax (`@import "tailwindcss"` instead of three `@tailwind` directives) and moved config to CSS via `@theme`.
- Many plugin authors are still catching up; some plugins work fine, others require updated versions or removal.
- Browser support floor moved up (Safari 16.4+, Chrome 111+, Firefox 128+) due to `@property` and `color-mix()` reliance — older browser visitors see broken layouts.
- Next.js 15 has built-in v4 support but only if you use the `@tailwindcss/postcss` plugin correctly.

**How to avoid:**
- Use the official Tailwind v4 upgrade tool when scaffolding, or follow the Tailwind v4 + Next.js 15 setup from current Tailwind docs (not Medium articles dated before mid-2025).
- Configure once at project start in Phase 1 using v4 idioms — `@import "tailwindcss"` in `app/globals.css`, theme tokens in CSS via `@theme`, no `tailwind.config.js` unless explicitly needed.
- Avoid v3-era plugins; for a minimal monochrome typography-led portfolio, no plugin is needed beyond `@tailwindcss/typography` (which has a v4-compatible release).
- Define design tokens (colors, font sizes, spacing scale) in `@theme` in CSS so they are both Tailwind utilities and CSS variables — usable from any context.
- Verify in DevTools that generated CSS is shipping (not zero-byte) and that custom properties resolve.
- Don't support browsers older than Safari 16.4 in the design — for a recruiter audience this is fine, but include a one-line fallback note in `/uses` if relevant.

**Warning signs:**
- Tailwind utilities render as plain text without styling.
- Build log shows "unknown at-rule @tailwind" or "@theme cannot be used in this context."
- Plugins listed in `package.json` but their classes don't appear in compiled CSS.

**Phase to address:** Phase 1 (initial scaffold). Lock the version and config before writing any component code.

---

### Pitfall 7: Static export to GitHub Pages instead of Vercel — loses next/image, ISR, OG generation, App Router benefits

**What goes wrong:**
James (or a tutorial he follows) deploys to `pnhek.github.io` (the existing legacy repo) because "it's free and simple." This forces `output: 'export'`, which means `next/image` doesn't optimize, dynamic `ImageResponse` OG generation breaks, App Router metadata behaves differently, and the URL is `pnhek.github.io/portfolio` instead of `pjnhek.com`. The site looks worse, performs worse, and the legacy repo's stale content may still be linked from Google.

**Why it happens:**
- The legacy `pnhek.github.io` repo exists in James's account already, creating gravitational pull toward GitHub Pages.
- Tutorials conflate "Next.js" with "static site" — devs don't realize Vercel's free Hobby tier is functionally a superset of GitHub Pages for a portfolio.
- "Free tier" anxiety: feeling that Vercel might charge later, even though Hobby is free indefinitely for personal use.

**How to avoid:**
- Decision is already documented (Vercel Hobby on `pjnhek.com`) — defend it explicitly in Phase 4.
- Take down or 301-redirect the legacy `pnhek.github.io` site as part of Phase 4 launch, so it doesn't compete in search results or split traffic.
- Do not set `output: 'export'` in `next.config.js`. Use the default SSR/SSG hybrid output, which Vercel handles natively.
- If GitHub Pages is later considered (e.g., as a fallback), explicitly accept the loss of `next/image`, `ImageResponse`, server components on dynamic routes, and ISR — those are exactly what makes the site fast.

**Warning signs:**
- `next.config.js` has `output: 'export'` or `output: 'standalone'`.
- A push to the legacy `pnhek.github.io` repo deploys content.
- Image URLs in production look like `/portfolio/_next/static/images/...` instead of being served via `/_next/image?url=...&w=...&q=...`.

**Phase to address:** Phase 4 (deploy). Decision lock at Phase 1 so it doesn't get reopened.

---

### Pitfall 8: Apex domain misconfigured — pjnhek.com works but www.pjnhek.com doesn't (or vice versa), or no SSL

**What goes wrong:**
Recruiter types `pjnhek.com` in the address bar, gets a connection error because only `www.pjnhek.com` is configured. Or the apex resolves but with a self-signed/expired SSL cert because Vercel's automatic provisioning didn't complete. Or `pjnhek.com` redirects to `pnhek.github.io` because the legacy site still has DNS pointed at it. Result: dead site at the moment of evaluation.

**Why it happens:**
- DNS RFC1034 forbids CNAME at apex; devs naively add a CNAME for `pjnhek.com` pointing to `cname.vercel-dns.com` and it silently fails (or the registrar refuses).
- Vercel issues an A record for the apex but devs forget to remove conflicting A records from the registrar.
- Email DNS (MX, SPF, DKIM) and Vercel A records get mixed up — adding Vercel records destroys email routing.
- SSL provisioning needs CAA record permissions (or absence of restrictive CAA records).

**How to avoid:**
- For the apex `pjnhek.com`: use Vercel's provided A record (76.76.21.21 or current Vercel IP), not a CNAME. If the registrar supports ALIAS/ANAME (Cloudflare, DNSimple), that also works and is preferable.
- For `www.pjnhek.com`: CNAME to `cname.vercel-dns.com`. Configure both apex and www in Vercel project Domains; let Vercel decide canonical redirect direction (recommend www → apex or apex → www, pick one).
- If using a registrar that doesn't support ALIAS (e.g., Namecheap), switch to Vercel nameservers for the entire zone OR move to a registrar that does (Cloudflare is free and supports CNAME flattening).
- If email is desired on `pjnhek.com` (e.g., james@pjnhek.com forwarding), add MX/SPF/DKIM records BEFORE switching nameservers. Common forwarding options: ImprovMX (free), Cloudflare Email Routing (free), Fastmail (paid). Verify email works before final cutover.
- Verify SSL: no CAA record blocking Let's Encrypt; if CAA exists, allow `letsencrypt.org` and `digicert.com`.
- Post-deploy checklist: hit `https://pjnhek.com`, `https://www.pjnhek.com`, `http://pjnhek.com`, `http://www.pjnhek.com` — all must resolve, redirect appropriately, and present a valid cert.

**Warning signs:**
- `dig pjnhek.com` returns nothing or returns the wrong IP.
- Browser shows "Your connection is not private" or "ERR_CERT_AUTHORITY_INVALID."
- `nslookup mx pjnhek.com` returns nothing when email is supposed to work.
- Vercel Domains panel shows "Invalid Configuration."

**Phase to address:** Phase 4 (deploy). Set up email DNS records FIRST if email is in scope, then point web at Vercel.

---

### Pitfall 9: Scope creep — blog, dark mode, CMS, analytics, animations sneak back into v1

**What goes wrong:**
PROJECT.md explicitly puts blog, light/dark toggle, analytics, CMS, RAG demo in v2. Halfway through Phase 2, James thinks "a dark mode toggle is just one library." Then "an MDX blog scaffold without posts." Then "Vercel Analytics is one env var." v1 timeline doubles. Site doesn't launch. James is still job hunting without a public portfolio.

**Why it happens:**
- Building is more fun than shipping. Engineers gravitate to greenfield tasks (set up a CMS) over closing tasks (write the Asurion section).
- Each individual addition feels small and is small. The aggregate is not small.
- Perfectionism masquerades as "doing it right the first time."
- Studies show recruiters spend 2–5 minutes on a portfolio — every hour spent on a feature they won't notice is wasted leverage.

**How to avoid:**
- Treat the Out-of-Scope list in PROJECT.md as a hard contract. Adding to v1 requires explicit user decision and a moved deadline.
- Define "v1 done" objectively at start of Phase 1: 4 sections live, 4 featured projects, contact info, custom domain, Lighthouse > 90 on mobile. Anything past that is v2.
- Ship Phase 2 in a single mode (the chosen monochrome aesthetic) — do not parallel-track a dark variant.
- Phase 3 is short and explicit (SEO, Lighthouse, a11y). Resist letting it become "make it perfect."
- Set a v1 ship date at start of Phase 1 and commit to it publicly (LinkedIn post, recruiter outreach).
- When tempted by a v2 feature, write it down in PROJECT.md's v2 list and move on.

**Warning signs:**
- Phase 2 takes more than ~2x the estimated time.
- A new library was added that isn't in the locked stack.
- A v2 file appears in the repo (`blog/`, `theme-toggle.tsx`).
- The site has not been deployed to production by end of Phase 4 target date.

**Phase to address:** All phases. Make the scope contract visible in roadmap header.

---

### Pitfall 10: Mobile experience degraded — recruiters on phones see a broken page

**What goes wrong:**
A recruiter clicks `pjnhek.com` from a LinkedIn message on their iPhone. The hero text overflows. Spacing is wrong because the design was prototyped at 1440px. Tap targets are too small. The contact email isn't a clickable `mailto:` link on tap. Result: the worst first impression at the most likely entry point.

**Why it happens:**
- Engineers design and develop on a 27-inch monitor, then check mobile at the end.
- Tailwind's mobile-first defaults are powerful but require thinking mobile-first when writing classes (don't reach for `md:` before defining the base).
- Hover-only interactions break on touch (a CSS hover-state nav doesn't open on tap).
- iOS Safari has quirks: 100vh includes the address bar, font-size below 16px triggers auto-zoom on inputs, smooth scroll behaves differently.

**How to avoid:**
- Develop mobile-first in DevTools at 375px (iPhone SE). Only after mobile works, scale up to 768px and 1280px.
- Test on a real iPhone before launch — DevTools emulation lies about font rendering and touch behavior.
- All interactive elements minimum 44×44px tap target.
- No hover-only affordances — every interaction must also work on tap.
- Use `dvh` (dynamic viewport height) instead of `vh` for full-height hero on mobile to avoid address-bar jump.
- For the contact section: `mailto:` link is fine (LinkedIn URL too), no need for a form on v1.

**Warning signs:**
- Horizontal scrollbar at any breakpoint.
- Text overlaps or wraps awkwardly at 320–375px width.
- Tap targets fail Lighthouse a11y audit.
- Page jumps when iOS Safari address bar collapses.

**Phase to address:** Phase 1 (mobile-first defaults in design system). Verify in Phase 3 (responsive QA on real device).

---

### Pitfall 11: Accessibility failures — keyboard navigation broken, contrast too low, no focus states

**What goes wrong:**
Monochrome design with very thin gray-on-white text. Focus rings removed for aesthetics. Recruiter tabbing through (or a screen reader) can't navigate. ATS-quality recruiting tools at large companies increasingly run automated a11y scans on candidate-shared sites; failure is a quiet negative signal. Beyond optics: real users with low vision or motor impairments are excluded.

**Why it happens:**
- "Minimal monochrome" aesthetic tempts removal of focus rings and very low-contrast gray text.
- `:focus { outline: none }` from a CSS reset never gets a replacement.
- Tailwind v4's default focus styles are minimal; devs forget to add `focus-visible:` variants.
- Designs reference huyml.co visually without measuring its contrast (huyml.co itself may or may not pass; don't assume).

**How to avoid:**
- All body text minimum 4.5:1 contrast against background; large headings minimum 3:1. Measure with browser DevTools contrast checker, not eyeball.
- Visible focus state on every interactive element. Use `focus-visible:ring-2 ring-offset-2` (Tailwind) or equivalent. Make it part of the design language, not an afterthought.
- Semantic HTML: real `<nav>`, `<main>`, `<section>`, `<a>`, `<button>`. No `<div onClick>`.
- Logical tab order matches reading order. Test by pressing Tab from the address bar through the whole page.
- Alt text on every meaningful image (project screenshots, OG image), `alt=""` on purely decorative.
- Run axe DevTools or Lighthouse a11y audit; resolve all errors and warnings before launch.

**Warning signs:**
- Lighthouse a11y score < 95.
- Tabbing through the page produces no visible focus indicators.
- Body text is `text-gray-400` or lighter on white.
- Any interactive element is a `<div>`.

**Phase to address:** Phase 1 (design tokens include accessible contrast pairs + focus styles). Verify in Phase 3.

---

### Pitfall 12: Broken or messy GitHub profile linked from portfolio

**What goes wrong:**
Portfolio links to `github.com/pjnhek`. Recruiter clicks. Top of the page shows pinned repos like `githubtest`, `poc_scraper`, half-finished course homework, or a stale `pnhek.github.io` repo from 2022. The carefully curated portfolio impression collapses in 10 seconds because the GitHub profile contradicts it.

**Why it happens:**
- GitHub profile evolves organically; older repos accumulate.
- Pinned repos default to recently active, not best.
- Repo names are often debugging junk (`githubtest`).
- Profile README either doesn't exist or is generic.

**How to avoid:**
- Curate exactly 6 pinned repos on the GitHub profile that match the 4 featured projects + 2 strong supporting ones (per PROJECT.md: keep `voice-intent-eval`, `contextual-chunker`, `msds697-weather-pipeline`, `nba_home_court_advantage`, `pjnhek` profile README; hide or rename `githubtest`, `poc_scraper`, etc.).
- Add a meaningful profile README at `pjnhek/pjnhek` that mirrors the portfolio hero one-liner and links back to `pjnhek.com`.
- Archive or make private the repos that shouldn't be visible (don't delete — preserve history privately).
- Each featured project's repo needs a real README with: what it is, why it exists, screenshot or diagram, run instructions, link back to the portfolio case study.
- Take down or 301 the legacy `pnhek.github.io` site so it doesn't appear in search results competing with `pjnhek.com`.

**Warning signs:**
- Top of `github.com/pjnhek` shows any repo not from the curated list.
- A featured project repo's README is one paragraph or empty.
- `pnhek.github.io` still resolves to the legacy site.

**Phase to address:** Phase 2 (alongside featured project content). Treat GitHub profile as part of the portfolio surface.

---

### Pitfall 13: RAG / live AI demo on the home page (v2) leaks API keys, runs up costs, or hallucinates damagingly

**What goes wrong (v2 scope, document now to avoid being surprised later):**
James adds a live RAG chatbot demo to the site. OpenAI/Anthropic API key is exposed (in client bundle, in a public env var, or in a route handler without rate limiting). Someone scripts a loop, racks up $500 in API costs overnight. Or worse: the demo hallucinates that James "led a team of 50 engineers at Asurion" or makes up a metric, and a recruiter screenshots it. Or the demo is vulnerable to indirect prompt injection — uploaded docs / clever queries trick it into leaking the system prompt or saying offensive things attributable to James.

**Why it happens:**
- API key accidentally committed (`NEXT_PUBLIC_OPENAI_KEY` is the classic mistake — `NEXT_PUBLIC_` prefix ships to client).
- Route handler has no auth, no rate limit, no daily spend cap.
- Demo uses generic system prompt without guardrails about identity ("you are James's portfolio assistant; only answer about projects listed on the site").
- Indirect prompt injection via user input or retrieved content is not considered.

**How to avoid:**
- API keys server-side only (no `NEXT_PUBLIC_` prefix). Use Vercel environment variables; never commit `.env`. Add `.env*` to `.gitignore` and rotate any key ever briefly exposed.
- Hard daily spend cap at the provider level (OpenAI / Anthropic both support spending limits — set them at $5/day for v2 demo).
- Edge route handler with rate limiting (Upstash Redis rate limit on Vercel free tier, or simple in-memory limiter for first version): max 5 requests/minute per IP, max 50 requests/day total.
- System prompt is restrictive and explicit: "You are an assistant on James Nhek's portfolio site. Only answer questions about the projects, experience, and skills listed on the site. Do not make claims beyond the public content. Do not roleplay. If asked about anything off-topic, redirect."
- All retrieved content for RAG comes from a tightly curated, author-controlled corpus (the site's own content + project READMEs). No user-uploaded documents in v2.
- Output filter: post-process LLM responses to check for hallucinated metrics or names not in the source corpus; if mismatch, return a canned fallback.
- Demo includes a visible "this is an AI demo and may make mistakes" disclaimer, but don't lean on the disclaimer as a substitute for guardrails.
- Add a "kill switch" env var that disables the demo route in 30 seconds if something goes wrong.
- Consider gating the demo behind a "request access" form or a per-user token instead of fully open.

**Warning signs:**
- Any `NEXT_PUBLIC_*_KEY` or `NEXT_PUBLIC_*_SECRET` in `next.config.js` or `.env`.
- Demo route has no rate-limit middleware.
- Provider dashboard shows steeper spend than expected.
- LLM responses contain metrics or claims not present in the corpus.

**Phase to address:** Phase 5+ (v2). Document constraints now so v2 starts with correct posture, not retrofit.

---

## Moderate Pitfalls

### Pitfall 14: Title tag missing "James Nhek" or canonical role

**What goes wrong:** Browser tab shows "Home | Portfolio" or just "Next.js App." Google indexes the title but not the name. Recruiters bookmarking the site can't find it by name.

**How to avoid:** Root layout `metadata.title` template: `'%s | James Nhek - AI Engineer'`. Home route title: just `'James Nhek - AI Engineer'`. Include the literal name + role; don't be clever.

**Phase to address:** Phase 3.

---

### Pitfall 15: No contact method that recruiters actually use

**What goes wrong:** Contact section is "Twitter DM me" or a custom form that requires JavaScript. Recruiters use email and LinkedIn.

**How to avoid:** Provide `mailto:` link with James's real email, LinkedIn URL, and (optionally) a Calendly. No custom forms in v1.

**Phase to address:** Phase 2.

---

### Pitfall 16: Asurion logo or other employer logos used without permission

**What goes wrong:** Pulling a company's official logo into the experience section without permission is a trademark/branding risk and looks slightly off because the logo style clashes with the monochrome design anyway.

**How to avoid:** Use the company name in text only, styled in the site's typography system. No logos. If a visual marker is wanted, render the company name in a slightly bolder weight or with a leading rule.

**Phase to address:** Phase 2.

---

### Pitfall 17: Demo links to deployed projects that are broken

**What goes wrong:** Featured project says "live demo →" and links to a Render/Railway/Heroku URL that has been spun down for cost. Recruiter clicks, sees a "service unavailable" page. Credibility hit.

**How to avoid:** Either keep demos truly live (free-tier compatible) and monitor them, or replace "live demo" with "case study + repo + recorded video walkthrough." For v1, prefer the latter — recorded artifacts don't break.

**Phase to address:** Phase 2 (project case study content), monitored in Phase 4+.

---

### Pitfall 18: Animations or scroll-jacking hurt perceived performance

**What goes wrong:** A "clever" scroll animation (Framer Motion, GSAP) on the hero adds 100KB+ of JS, causes jank on mid-range Android, and adds nothing the recruiter values.

**How to avoid:** Use CSS transitions and `prefers-reduced-motion` for any motion. No animation library in v1. The huyml.co reference is largely typography-driven, not animation-driven — copy that posture.

**Phase to address:** Phase 1 (decline the library); Phase 2 (resist tactical additions).

---

### Pitfall 19: `/uses` page becomes a brag list rather than informative

**What goes wrong:** `/uses` reads like a gear-flex with affiliate links and brand names, instead of a small useful page about how James actually works.

**How to avoid:** Plain list: editor, terminal, key CLI tools, hardware. One line per item. No affiliate links. Keep it short.

**Phase to address:** Phase 2.

---

### Pitfall 20: Pivot story buried instead of foregrounded

**What goes wrong:** The tax analyst → AI engineer pivot is mentioned in passing in the About section. This is one of James's strongest differentiators (per PROJECT.md), and burying it means competing on the same axis as every other AI engineer.

**How to avoid:** Open the About section with the pivot in one sentence. Make it concrete: dates, what changed, why. This is the kind of detail recruiters remember and reference internally.

**Phase to address:** Phase 2.

---

## Minor Pitfalls

### Pitfall 21: Favicon missing or default Next.js icon

**What goes wrong:** Bookmarks show generic icon; browser tab looks unfinished.

**How to avoid:** Use Next.js App Router `icon.png` + `apple-icon.png` file conventions in `app/`. Simple monogram of "JN" or "PN" in monochrome.

**Phase to address:** Phase 3.

---

### Pitfall 22: No robots.txt or sitemap.xml

**What goes wrong:** Google indexes preview deployments or doesn't find canonical URLs.

**How to avoid:** Use App Router `robots.ts` and `sitemap.ts` file conventions. Block preview deployment domains.

**Phase to address:** Phase 3.

---

### Pitfall 23: Console errors / 404s on production

**What goes wrong:** DevTools console shows React hydration warnings, missing image 404s, or font 404s. Recruiters who open DevTools (they sometimes do, especially at hiring eng-led companies) see noise.

**How to avoid:** Zero-console-error policy on production build. Check DevTools network + console after deploy.

**Phase to address:** Phase 4.

---

### Pitfall 24: TypeScript strict mode off or `any` everywhere

**What goes wrong:** "View Source" reveals weak typing. For an engineer claiming type-driven discipline, this is a small but visible negative signal.

**How to avoid:** `tsconfig.json` with `strict: true`, no `any` in committed code, use `unknown` + narrowing instead.

**Phase to address:** Phase 1.

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Inlining all content as JSX strings instead of a content file/MDX | Faster to write | Painful to edit later; tempts copy-paste duplication | Acceptable in v1 if 4 projects are stable; revisit if blog ships in v2 |
| Skipping the design system in Phase 1, styling ad-hoc | "Just want to ship sections" | By Phase 3, design drifts; spacing/typography are inconsistent across sections | Never — Phase 1 design system is cheap and pays for itself by Phase 2 |
| Hardcoding all images as static imports (no `next/image`) | Skips Vercel optimization config | Larger payloads, worse LCP, no AVIF | Only acceptable for tiny inline SVG icons |
| Disabling TypeScript strict to ship faster | Bypasses errors | Hidden bugs, weaker code-review signal in public source | Never on this project — type discipline is part of the message |
| Putting v2 features behind feature flags in v1 code | Lets you "almost ship" v2 | Dead code in bundle; the flag toggle becomes another scope-creep vector | Avoid; cut v2 cleanly and add later |
| Single huge `page.tsx` instead of section components | Faster initial scaffold | Harder to test, refactor, or reuse sections | Acceptable in Phase 1 scaffold; refactor into section components by end of Phase 2 |
| Skipping mobile QA until the end | Faster desktop iteration | Late discovery of mobile-only bugs (overflow, fixed height, tap targets) | Never — mobile-first is required by audience |

---

## Integration Gotchas

Common mistakes when connecting to external services.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Vercel + custom domain | Adding CNAME at apex; conflicting A records left over from registrar default | A record (or ALIAS/ANAME) at apex pointing to Vercel IP; remove other A records; CNAME only on www subdomain |
| Vercel + email DNS | Switching to Vercel nameservers before exporting existing MX/SPF/DKIM records, killing email | Inventory all current DNS records first; re-add MX/SPF/DKIM in Vercel DNS (or stay on existing nameservers with only A/CNAME pointing at Vercel) |
| LinkedIn OG previews | Relative URLs in `og:image`; redirects in image path; no `metadataBase` | Absolute HTTPS URL; no redirects; `metadataBase` set in root layout; verify with LinkedIn Post Inspector |
| Vercel Image Optimization | Too many `sizes` breakpoints multiply transformation count toward Hobby cap | Limit to 2-3 breakpoints; pre-encode source images at appropriate resolutions |
| `next/font` Google fonts | Loading 6 weights × 2 styles "to be safe" | Load only the 1-2 weights actually used in the design; self-hosted via `next/font` |
| Anthropic / OpenAI API (v2 demo) | `NEXT_PUBLIC_` prefix on API key; no daily spend cap; no rate limit on route | Server-side only; provider dashboard spend cap; rate limit middleware on route handler |
| GitHub profile linkage | Pinned repos not curated; profile README missing or stale | 6 curated pins matching the portfolio's featured projects + README mirroring the site's hero |
| Email forwarding (if used) | Setting up forwarding after switching nameservers, causing downtime | Set up forwarding BEFORE DNS cutover; verify deliverability with a test send before announcing |

---

## Performance Traps

Patterns that work at small scale but fail as usage grows. For a portfolio, "scale" means a viral moment or a sustained trickle from job-search outreach.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Lazy-loaded hero image | LCP > 2.5s on Lighthouse; "LCP image was lazily loaded" warning | `priority` + `fetchPriority="high"` on hero `next/image` | Immediately at first load — visible in any Lighthouse run |
| Unbounded `sizes` in `next/image` | Image transformation count climbing toward 5K/month | Limit responsive breakpoints; pre-encode source variants | At ~1000 unique visitors/month on free tier |
| Dynamic OG image regenerated per request | High Function Invocation count + Image Optimization count | Static `opengraph-image.png` for home; `revalidate` on dynamic OG | At ~10K shares/month |
| Web font with many weights | Initial JS payload + slow font swap | `next/font` with 1-2 weights only | Always — measurable in WebPageTest from day one |
| Animation library (Framer Motion / GSAP) on home route | Bundle > 100KB; jank on mid-range Android | Use CSS transitions; defer libraries to v2 if needed at all | At any time on mid-range devices |
| `output: 'export'` static deploy then trying to use `next/image` defaults | Images served unoptimized; AVIF/WebP not generated | Stay on Vercel SSR/SSG hybrid (default) | Immediately — images ship as PNG |
| No image cache TTL | Cache misses on every deploy | `images.minimumCacheTTL` set high in `next.config.js` | After each deploy if not configured |

---

## Security Mistakes

Beyond OWASP basics — issues specific to this project.

| Mistake | Risk | Prevention |
|---------|------|------------|
| Asurion proprietary info in repo (even in branches or git history) | Employment / NDA exposure; appears in GitHub search even after deletion | Sanitize before commit, not after; never push internal screenshots, even to private repos; treat git as forever |
| API key with `NEXT_PUBLIC_` prefix (v2 demo) | Key shipped in client bundle, immediately scrapable | Server-only env vars; rotate any key ever exposed; use platform spend caps |
| Email address exposed as plain text scrape target | Spam | Acceptable for a job-search portfolio — the cost of spam is lower than the cost of friction; do not obfuscate to the point a recruiter can't copy-paste |
| No HTTPS / mixed content | Browser warnings | Vercel auto-provisions HTTPS; verify CAA records permit Let's Encrypt |
| Form submission without rate limit (v2 contact form or RAG demo) | Spam / abuse / cost runup | Rate limit per IP; CAPTCHA only if abuse is observed |
| Public env vars in `vercel.json` or in repo | Leaked secrets | Use Vercel dashboard for env vars; `.env*` in `.gitignore` |
| Indirect prompt injection in v2 RAG demo | Demo says something embarrassing or leaks system prompt | Restricted system prompt; closed corpus; output filter; kill switch |
| Hotlinkable OG image abused to inflate image transforms | Free-tier image quota exhausted | Static OG image (file convention) — not dynamically regenerated |

---

## UX Pitfalls

Common user experience mistakes in this domain.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Long About section before any work shown | Recruiter bounces before seeing projects | Hero (identity + role) → quick experience marker → featured projects → About → Contact. Pivot story is in About; projects come first. |
| Generic "let's connect" CTA | Recruiter doesn't know what action to take | Specific CTAs: "Email me about a role," "Schedule a 20-min intro," linked to `mailto:` / Calendly |
| Project cards with no skim affordance | Recruiter has to read each project to evaluate fit | Each project has a one-line summary, a "stack" line (LangGraph, pgvector, MLflow, etc.), and a measurable outcome — readable in 5 seconds |
| External links open in same tab | Recruiter leaves the site and may not return | `target="_blank" rel="noopener noreferrer"` on external links (GitHub, LinkedIn, project demos) |
| Code blocks in project case studies that overflow on mobile | Unreadable on phone, where most clicks come from | Either omit code blocks or set them to scroll horizontally with monospace shrinking on small screens |
| Diagrams that require zoom on mobile | Recruiter can't parse system architecture on phone | Diagrams designed at mobile-readable size first; optionally a tap-to-expand on larger versions |
| "Currently building X" with no detail | Reads like a placeholder | Either ship the X or don't mention it; vague WIP signals weaken everything around it |

---

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **Metadata:** Title looks right in browser tab — verify `metadataBase` is set; verify OG image renders on LinkedIn Post Inspector, opengraph.xyz, and a real Slack DM (not just locally).
- [ ] **Custom domain:** `pjnhek.com` resolves — verify both `https://pjnhek.com` and `https://www.pjnhek.com` work; verify HTTP redirects to HTTPS; verify SSL cert is from a real CA (Let's Encrypt); verify legacy `pnhek.github.io` does not compete in Google results.
- [ ] **Email DNS (if email is in scope):** MX records resolve — send a test email to `james@pjnhek.com` from an external address and confirm delivery.
- [ ] **Mobile:** Looks good in DevTools — verify on a real iPhone Safari; verify on a real mid-range Android Chrome; verify no horizontal scroll at 320px width.
- [ ] **Performance:** Lighthouse 90+ on desktop — verify mobile Lighthouse is also 90+; verify CrUX field data (Vercel's "Speed Insights" or PageSpeed Insights real-user data) once traffic exists.
- [ ] **Accessibility:** Looks accessible — verify Tab traversal works with visible focus; verify Lighthouse a11y 95+; verify with VoiceOver or NVDA on at least the hero and projects sections.
- [ ] **Confidentiality:** Asurion section reads as high-level — verify every proper noun, metric, and diagram element against the public-allow-list; sleep on it and re-read the next day.
- [ ] **GitHub profile:** Looks curated — verify 6 pinned repos match featured projects; verify each pinned repo has a real README; verify `pnhek.github.io` legacy is taken down or 301'd.
- [ ] **Project demos:** Listed as "live" actually live — click every external link from production; if any free-tier demo isn't reliably up, replace "live demo" with "case study + repo."
- [ ] **Console:** Clean — open DevTools on production, navigate every section, verify zero errors and zero unexpected warnings.
- [ ] **TypeScript:** Strict on — verify `tsc --noEmit` passes; verify no `any` in committed code.
- [ ] **Scope:** v1 is v1 — verify no v2 feature flags, no empty blog scaffold, no half-implemented dark mode toggle.

---

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Confidentiality leak (Asurion detail published) | HIGH | (1) Take section offline immediately (deploy hotfix that removes it). (2) Purge git history if leaked in repo (`git filter-repo`); force push; rotate any keys. (3) Notify Asurion manager proactively before they discover it — being upfront limits damage. (4) Re-sanitize and review with a second pair of eyes before re-publishing. |
| OG image broken on LinkedIn after launch | LOW | (1) Switch to static `opengraph-image.png` file convention. (2) Set absolute `metadataBase`. (3) Use LinkedIn Post Inspector to force re-scrape. (4) Repost any LinkedIn link that previewed broken. |
| Free-tier quota exhausted mid-month | MEDIUM | (1) Set `images.unoptimized: true` and redeploy to stop transformation charges. (2) Pre-encode and inline a few key images. (3) Consider Cloudflare in front as a free CDN for static assets. (4) If outage already happened, accept the gap; post-incident, raise cache TTL and reduce `sizes` breakpoints. |
| Site down because DNS misconfigured | MEDIUM | (1) Revert nameservers or DNS records to the last working state at the registrar. (2) Use a checker like `dnschecker.org` to confirm propagation. (3) Set up monitoring (UptimeRobot free) so future outages are detected within minutes. |
| Lighthouse mobile score < 80 discovered after launch | LOW–MEDIUM | (1) Audit LCP element; add `priority` if image. (2) Move large JS to dynamic imports. (3) Eliminate any client component on home route that doesn't need interactivity. (4) Re-audit after each change. |
| Live RAG demo runs up cost (v2) | MEDIUM | (1) Disable the demo route immediately via env var kill switch. (2) Rotate API key. (3) Add rate limit before re-enabling. (4) Set provider-level daily spend cap permanently. |
| GitHub profile reveals junk repos at the moment of recruiter outreach | LOW | (1) Archive offending repos. (2) Re-pin the curated 6. (3) Update profile README. (4) Confirm by viewing profile while logged out. |
| Scope crept into v2; v1 is 6 weeks late | HIGH (already paid the cost) | (1) Cut v2 features ruthlessly NOW — delete branches or stash them. (2) Define a 1-week ship deadline for what currently exists. (3) Launch with whatever is in main; iterate post-launch. The cost of an additional week unshipped exceeds the cost of any single missing feature. |

---

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| #1 Vague "passionate about AI" copy | Phase 2 (content) | Cold-read by non-technical reviewer in Phase 3 |
| #2 Asurion confidentiality leak | Phase 2 (sanitization workflow) | Dedicated confidentiality review gate before Phase 3 |
| #3 OG image broken / missing on LinkedIn | Phase 3 (metadata + OG) | LinkedIn Post Inspector + opengraph.xyz on production in Phase 4 |
| #4 LCP regression (hero image, fonts) | Phase 1 (font + image conventions in design system) | Mobile Lighthouse in Phase 3 |
| #5 Free-tier blowout | Phase 1 (image strategy) + Phase 4 (alerts) | Vercel usage dashboard check post-launch |
| #6 Tailwind v4 + Next.js 15 misconfig | Phase 1 (scaffold) | Build + visual check immediately after scaffold |
| #7 Static export to GitHub Pages | Phase 1 (lock deploy decision) + Phase 4 (execute) | `next.config.js` review; check production URL pattern |
| #8 Apex domain / SSL / email DNS misconfig | Phase 4 (DNS + email) | Resolve all 4 URL variants + SSL cert check + email test send |
| #9 Scope creep | All phases | v1-done checklist; weekly scope audit against PROJECT.md Out of Scope |
| #10 Mobile experience degraded | Phase 1 (mobile-first design system) | Real-device mobile test in Phase 3 |
| #11 Accessibility failures | Phase 1 (focus styles + contrast tokens) | Lighthouse a11y + keyboard nav in Phase 3 |
| #12 GitHub profile messy | Phase 2 (alongside project content) | Logged-out profile view in Phase 4 |
| #13 v2 RAG demo security | Phase 5+ (v2 only) | Pre-launch checklist for v2; key audit |
| #14 Title tag missing name | Phase 3 | Browser tab + Google `site:pjnhek.com` query |
| #15 Bad contact methods | Phase 2 | mailto: + LinkedIn link verified clickable |
| #16 Employer logos used | Phase 2 | Asset audit in confidentiality review |
| #17 Broken demo links | Phase 2 + Phase 4 | Click every external link from production |
| #18 Animation overuse | Phase 1 (decline library) | Bundle size audit in Phase 3 |
| #19 `/uses` page brag list | Phase 2 | Self-review for tone |
| #20 Pivot story buried | Phase 2 | About section opens with pivot — verify in cold-read |
| #21 Favicon missing | Phase 3 | App Router icon.png file convention present |
| #22 No robots/sitemap | Phase 3 | Visit `/robots.txt` and `/sitemap.xml` on production |
| #23 Console errors on prod | Phase 4 | DevTools console clean on every section |
| #24 TypeScript not strict | Phase 1 | `tsconfig.json` review |

---

## Sources

- [Next.js: Metadata and OG Images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images) — App Router metadata API, file conventions (HIGH confidence)
- [Next.js: generateMetadata API reference](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) — constraints on metadata exports (HIGH)
- [vercel/next.js Discussion #60180 — og:image fails on LinkedIn/Threads but works on Twitter](https://github.com/vercel/next.js/discussions/60180) — documented LinkedIn-specific OG image quirk (MEDIUM)
- [Tailwind CSS Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide) — v3 → v4 import syntax, `@theme` config, browser support floor (HIGH)
- [Tailwind v4 + Next.js 15 build issues — Medium](https://medium.com/@hardikkumarpro0005/fixing-next-js-15-and-tailwind-css-v4-build-issues-complete-solutions-guide-438b0665eabe) — concrete migration pitfalls (MEDIUM)
- [Vercel Hobby plan limits](https://vercel.com/docs/plans/hobby) — 100GB bandwidth, 5K image transformations, non-commercial clause (HIGH)
- [Vercel Image Optimization limits and pricing](https://vercel.com/docs/image-optimization/limits-and-pricing) — 402 behavior on overage, cache TTL guidance (HIGH)
- [Vercel: Custom domain configuration](https://vercel.com/docs/domains/working-with-domains/add-a-domain) — A record vs CNAME at apex, ALIAS/ANAME support (HIGH)
- [Vercel KB: A records and CAA with Vercel](https://vercel.com/kb/guide/a-record-and-caa-with-vercel) — Let's Encrypt CAA permission, apex requirements (HIGH)
- [Next.js Static Exports guide](https://nextjs.org/docs/app/guides/static-exports) — what is lost with `output: 'export'` (image optimization, ISR, ImageResponse) (HIGH)
- [vercel/next.js Issue #82177 — generated images do not work with GitHub Pages static export](https://github.com/vercel/next.js/issues/82177) — concrete GitHub Pages incompatibility (MEDIUM)
- [web.dev — Optimizing Web Vitals using Lighthouse](https://web.dev/articles/optimize-vitals-lighthouse) — LCP / CLS / INP fixes (HIGH)
- [Core Web Vitals in 2026 — DEV Community](https://dev.to/benriemer/core-web-vitals-in-2026-the-practical-fixes-for-inp-lcp-and-cls-that-actually-work-4ef0) — lazy-loaded hero is the most common LCP regression (MEDIUM)
- [Fixing Dark Mode Flickering in React/Next.js — Not A Number](https://notanumber.in/blog/fixing-react-dark-mode-flickering) — FOUC mechanism explained (relevant for v2 dark mode) (MEDIUM)
- [Interaction Design Foundation — Showcasing NDA-protected work](https://ixdf.org/literature/article/keep-it-confidential-how-to-showcase-your-nda-protected-design-work) — NDA classes and what is safe to share (MEDIUM)
- [OWASP — LLM Prompt Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html) — output validation, system prompt hardening (HIGH)
- [Promptfoo — Red-teaming RAG applications](https://www.promptfoo.dev/docs/red-team/rag/) — indirect injection via retrieved content (MEDIUM)
- [AI Engineer Resume Keywords (2026) — ResumeAdapter](https://www.resumeadapter.com/blog/ai-engineer-resume-keywords) — recruiter signal on jargon vs. concrete artifacts (MEDIUM)
- [Resume Trends 2026 — ResumeAdapter](https://www.resumeadapter.com/blog/resume-trends-2026) — quantified outcomes expectation in 2026 (MEDIUM)
- [Recruiter time on portfolios — Hiration](https://www.hiration.com/blog/build-portfolio-for-job-search/) — 2-5 minute portfolio review window (LOW–MEDIUM)
- Project context: `/Users/pnhek/usf msds/github/portfolio/.planning/PROJECT.md` (constraints, audience, confidentiality requirements)

---
*Pitfalls research for: AI Engineer personal portfolio (Next.js + Vercel + pjnhek.com)*
*Researched: 2026-05-20*
