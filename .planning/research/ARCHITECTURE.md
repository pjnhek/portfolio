# Architecture Patterns

**Domain:** Personal portfolio site (pjnhek.com) — Next.js 15+ App Router, Tailwind v4, TypeScript, Vercel
**Researched:** 2026-05-20
**Confidence:** HIGH (Context7 / official docs verified for all core recommendations)

---

## Executive Summary

For a **~4-project, 5-page, mostly-static** portfolio whose v2 may add a small RAG chat demo, the inevitable architecture is:

- **All routes Server Components by default**, statically generated at build time. Client Components only at leaf nodes that genuinely need interactivity (contact form, copy-to-clipboard, command palette).
- **Project content lives in a typed TypeScript module** (`content/projects.ts`) — not MDX. With four hand-curated projects whose detail pages need diagrams and structured prose, the MDX/Contentlayer/Content-Collections machinery is more abstraction than the problem deserves. You get full TS type-checking, autocomplete, and zero bundler tooling.
- **Tailwind v4 CSS-first** with `@theme` in `globals.css`. No `tailwind.config.js`. Theme is a small set of CSS variables (mono palette + spacing scale). No dark mode toggle in v1.
- **App Router file conventions for SEO** — `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.tsx`, `generateMetadata` per route. No SEO library needed.
- **Contact form via Server Actions + Resend SDK** — no third-party form provider, no separate API route.
- **No route groups in v1.** Single top-level layout. Route groups become valuable only when you have two visually distinct sections (e.g. `(marketing)` vs `(demo)`). That moment comes when the RAG demo ships in v2.
- **v2 RAG demo plugs in cleanly** as `app/(demo)/chat/page.tsx` + `app/api/chat/route.ts`, with Upstash rate-limiting middleware and Vercel AI SDK on the server. The static portfolio surface is untouched.

The architecture's job: make every line of code the kind of code a recruiter who clicks "View Source" expects from someone building production RAG systems — boring, typed, small, fast.

---

## Recommended Architecture

### High-Level Component Map

```
┌─────────────────────────────────────────────────────────────────┐
│                       BUILD TIME (next build)                    │
│                                                                  │
│  content/projects.ts   ──┐                                       │
│  content/experience.ts ──┼──► imported by Server Components ──┐ │
│  content/site.ts       ──┘                                    │ │
│                                                               ▼ │
│  app/page.tsx (RSC)        ─── renders Hero/About/Experience/  │
│  app/projects/[slug]/      ─── generates 4 static detail pages │
│  app/uses/page.tsx (RSC)   ─── renders /uses                   │
│  app/sitemap.ts            ─── derives from project slugs      │
│  app/opengraph-image.tsx   ─── static OG image                 │
│                                                                  │
│         Output: 100% static HTML + small JS islands             │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                  RUNTIME (Vercel edge / browser)                 │
│                                                                  │
│  Browser  ──► static HTML (instant)                              │
│         └──► hydrates: <ContactForm/>, <CopyEmail/>              │
│                                                                  │
│  ContactForm ──► Server Action ──► Resend SDK ──► James's inbox  │
│                                                                  │
│  [v2] /chat ──► <Chat/> (client) ──► /api/chat (route handler)   │
│                              └──► Upstash rate limit ──► LLM     │
└─────────────────────────────────────────────────────────────────┘
```

### Component Boundaries

| Component / Module | Responsibility | Communicates With | Type |
|--------------------|---------------|-------------------|------|
| `app/layout.tsx` | Root HTML, fonts, metadata defaults, theme CSS vars | Children pages | Server |
| `app/page.tsx` | Home composition (Hero → About → Experience → Projects → Contact) | All section components, `content/*.ts` | Server |
| `app/projects/[slug]/page.tsx` | Single project detail page with deep narrative + diagrams | `content/projects.ts` | Server |
| `app/projects/[slug]/opengraph-image.tsx` | Per-project OG image | `content/projects.ts` | Server (edge) |
| `app/uses/page.tsx` | `/uses` static content | `content/uses.ts` | Server |
| `app/sitemap.ts` | Emit sitemap.xml derived from project slugs | `content/projects.ts` | Server (build) |
| `app/robots.ts` | Emit robots.txt | (none) | Server (build) |
| `components/sections/*` | Hero, About, Experience, Projects, Contact composed onto home | Receive props from page | Server (mostly) |
| `components/ui/*` | Atomic, presentational primitives (Section, NumberedHeading, Tag, Link) | Pure render | Server |
| `components/interactive/ContactForm.tsx` | Form with useActionState + zod validation | Server action `actions/contact.ts` | **Client** |
| `components/interactive/CopyEmail.tsx` | Click → navigator.clipboard.writeText | Browser API only | **Client** |
| `components/interactive/CommandPalette.tsx` *(optional)* | ⌘K nav | Browser KB events | **Client** |
| `actions/contact.ts` | Server Action: validate + Resend send | Resend SDK | Server-only |
| `lib/content.ts` | `getProject(slug)`, `getAllProjects()` helpers | `content/projects.ts` | Server-only |
| `lib/seo.ts` | `buildMetadata({ title, description, path })` factory | `next.Metadata` | Pure |
| `content/projects.ts` | Source of truth for the 4 featured projects (typed) | (none) | Data |
| `content/experience.ts` | Asurion + prior roles (typed) | (none) | Data |
| `content/site.ts` | Name, tagline, links, base URL — single source for SEO | Used by `lib/seo.ts`, sitemap, layout | Data |

**Boundary rule:** Client Components are *leaves*. They never import from `content/*` directly — content flows in as serializable props from the surrounding Server Component.

### Data Flow

**Direction is one-way, top-down, build-time.**

```
content/*.ts (typed source of truth)
        │
        ▼
lib/content.ts (typed accessors: getAllProjects, getProject)
        │
        ▼
app/**/page.tsx (Server Components consume at build time)
        │
        ▼
components/sections/* and components/ui/* (receive props)
        │
        ▼
[edge] components/interactive/* (only what the user clicks)
        │
        ▼
[edge] actions/contact.ts ──► Resend ──► email
```

No client-side data fetching. No `useEffect`. No state managers. The site has no "data" in the runtime sense — only static content shipped as HTML.

The single exception in v2: `/chat` becomes a runtime data flow (user input → API route → LLM → stream back). That flow is intentionally isolated from the static surface.

---

## Concrete File Layout (this project)

```
portfolio/
├── app/
│   ├── layout.tsx                    # Root layout: <html>, fonts, default <Metadata>
│   ├── page.tsx                      # Home: composes all sections
│   ├── globals.css                   # @import "tailwindcss"; @theme { ... }
│   ├── opengraph-image.tsx           # Static site-wide OG (next/og ImageResponse)
│   ├── icon.tsx                      # Favicon (programmatic)
│   ├── sitemap.ts                    # Derives URLs from projects
│   ├── robots.ts                     # Allow all
│   ├── not-found.tsx                 # 404 page (match site aesthetic)
│   │
│   ├── projects/
│   │   └── [slug]/
│   │       ├── page.tsx              # generateStaticParams from content/projects.ts
│   │       └── opengraph-image.tsx   # Per-project OG image
│   │
│   ├── uses/
│   │   └── page.tsx                  # /uses page
│   │
│   └── api/                          # (created in v2 only — no v1 API routes)
│       └── chat/
│           └── route.ts              # [v2] streaming POST handler
│
├── actions/
│   └── contact.ts                    # "use server"; sendContact(prevState, formData)
│
├── components/
│   ├── ui/                           # Presentational primitives (Server)
│   │   ├── Section.tsx               # Numbered section wrapper (matches huyml.co)
│   │   ├── NumberedHeading.tsx
│   │   ├── ExternalLink.tsx
│   │   ├── Tag.tsx
│   │   └── ArchitectureDiagram.tsx   # <Image> wrapper w/ caption + dark-safe styling
│   │
│   ├── sections/                     # Home-page sections (Server)
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Experience.tsx
│   │   ├── FeaturedProjects.tsx      # Lists 4 project cards
│   │   └── Contact.tsx               # Renders <ContactForm/> + <CopyEmail/>
│   │
│   └── interactive/                  # "use client" leaves
│       ├── ContactForm.tsx           # useActionState + zod
│       ├── CopyEmail.tsx
│       └── CommandPalette.tsx        # optional v1.1
│
├── content/                          # Typed source of truth (NOT MDX)
│   ├── site.ts                       # name, tagline, urls, socials, baseUrl
│   ├── experience.ts                 # Role[]
│   ├── projects.ts                   # Project[] — single file, ~4 entries
│   └── uses.ts                       # UsesItem[]
│
├── lib/
│   ├── content.ts                    # getAllProjects(), getProject(slug)
│   ├── seo.ts                        # buildMetadata({ title, description, path })
│   ├── env.ts                        # zod-validated process.env (RESEND_API_KEY etc.)
│   └── og.ts                         # [optional] shared OG image helpers
│
├── public/
│   ├── diagrams/                     # Sanitized Asurion architecture diagrams (SVG/PNG)
│   ├── projects/                     # Project screenshots/diagrams
│   └── fonts/                        # Self-hosted fonts (if not using next/font)
│
├── styles/                           # (optional — keep globals.css inside app/)
│
├── types/
│   └── content.ts                    # Project, Role, UsesItem, SiteConfig
│
├── .env.example                      # RESEND_API_KEY, CONTACT_TO_EMAIL, NEXT_PUBLIC_SITE_URL
├── next.config.ts
├── postcss.config.mjs                # { plugins: { "@tailwindcss/postcss": {} } }
├── tsconfig.json                     # paths: { "@/*": ["./*"] }
└── package.json
```

**Layout notes:**

- **No `src/` directory.** With ~30 files total, `src/` adds a directory hop without payoff. Use it only if the project grows past ~80 files.
- **No route groups in v1.** Adding `app/(marketing)/` for one section just creates noise. Introduce `(marketing)` and `(demo)` *when* the RAG demo ships and the two surfaces want different layouts.
- **No `_components` private folders.** Top-level `components/` is simpler and the convention every recruiter recognizes. Private folders matter when colocating UI inside complex route trees — not here.
- **`content/` at the root**, not inside `app/`. It's data, not routing. Keeping it out of `app/` prevents accidental routing and signals "this is the CMS."
- **`actions/` at the root**, sibling to `app/`. Server Actions are app-wide concerns, not page-specific.

---

## Patterns to Follow

### Pattern 1: Typed Content Modules (the "no-CMS CMS")

**What:** Define content as TypeScript objects with a discriminating type. Pages import via `lib/content.ts`.

**When:** Any project with finite, hand-curated content (<~20 entries per type) that updates via git, not by non-engineers.

**Why over MDX/Content Collections:** For ~4 projects, MDX adds a compiler, a runtime renderer, frontmatter parsing, and a type-generation step — to do what `as const satisfies Project[]` does for free with editor autocomplete. Content Collections is the right choice when you have >20 entries or want non-developers editing markdown; you have neither.

**Example:**

```ts
// types/content.ts
export type Project = {
  slug: string;
  title: string;
  tagline: string;          // one-line for the card
  year: number;
  role: string;
  tags: string[];           // ["LangGraph", "pgvector", "MLOps"]
  links: { label: string; href: string }[];
  summary: string;          // 2-3 sentences, plain text
  // Detail page content: structured, not free-form
  problem: string;
  approach: string[];       // bullet points
  architecture?: {
    diagramSrc: string;     // /diagrams/sf-concierge.svg
    caption: string;
  };
  results: { metric: string; value: string }[];
  stack: string[];
};

// content/projects.ts
import type { Project } from "@/types/content";

export const projects = [
  {
    slug: "sf-date-night-concierge",
    title: "Agentic SF Date Night Concierge",
    // ...
  },
  // ...
] as const satisfies readonly Project[];
```

```ts
// lib/content.ts
import { projects } from "@/content/projects";

export function getAllProjects() {
  return projects;
}

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
```

```tsx
// app/projects/[slug]/page.tsx
import { notFound } from "next/navigation";
import { getAllProjects, getProject } from "@/lib/content";

export function generateStaticParams() {
  return getAllProjects().map(({ slug }) => ({ slug }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  return <ProjectDetail project={project} />;
}
```

**Escape hatch:** if a single project's prose grows past ~150 lines, *that one project* can import an MDX body. You don't need MDX for the system; you need it for the exception.

### Pattern 2: Server Components by Default, Client Components as Leaves

**What:** Pages, sections, and primitives have no `"use client"`. The only `"use client"` files are `ContactForm`, `CopyEmail`, and (optionally) `CommandPalette`.

**Why:** Server Components keep the JS bundle nearly empty. A portfolio that ships <30 KB of JS to first paint is itself a credential.

**Example — Contact section composition:**

```tsx
// components/sections/Contact.tsx (Server)
import { ContactForm } from "@/components/interactive/ContactForm";
import { CopyEmail } from "@/components/interactive/CopyEmail";
import { site } from "@/content/site";

export function Contact() {
  return (
    <section id="contact">
      <h2>06 — Contact</h2>
      <p>Reach out at <CopyEmail email={site.email} /></p>
      <ContactForm />   {/* Client island, isolated */}
    </section>
  );
}
```

The page stays a Server Component; only the two interactive widgets hydrate.

### Pattern 3: Server Action for Contact Form (no API route, no Formspree)

**What:** A single `actions/contact.ts` file with `"use server"`, validated by zod, sent via Resend.

**Why over Formspree/Getform:** No third-party dependency on your form working. No $10/mo bill creeping in. Server Actions are now the standard pattern in App Router and using them signals "I know modern Next.js."

**Why over a `/api/contact` route handler:** Less code, automatic CSRF protection (Next.js 15's unguessable endpoints + Origin checks), and `useActionState` gives you pending/error state for free.

**Example:**

```ts
// actions/contact.ts
"use server";

import { z } from "zod";
import { Resend } from "resend";
import { env } from "@/lib/env";

const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(5000),
  // honeypot: real users leave this empty
  website: z.string().max(0).optional(),
});

export type ContactState =
  | { status: "idle" }
  | { status: "error"; message: string; fieldErrors?: Record<string, string[]> }
  | { status: "success" };

export async function sendContact(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      status: "error",
      message: "Check your inputs.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }
  if (parsed.data.website) return { status: "success" }; // silently drop bots

  const resend = new Resend(env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: "pjnhek.com <hello@pjnhek.com>",
    to: env.CONTACT_TO_EMAIL,
    replyTo: parsed.data.email,
    subject: `Portfolio: ${parsed.data.name}`,
    text: `${parsed.data.message}\n\n— ${parsed.data.name} <${parsed.data.email}>`,
  });
  if (error) return { status: "error", message: "Couldn't send. Email me directly." };
  return { status: "success" };
}
```

```tsx
// components/interactive/ContactForm.tsx
"use client";
import { useActionState } from "react";
import { sendContact, type ContactState } from "@/actions/contact";

const initial: ContactState = { status: "idle" };

export function ContactForm() {
  const [state, formAction, pending] = useActionState(sendContact, initial);
  // ...render inputs, honeypot, status messages
}
```

### Pattern 4: SEO via App Router File Conventions

**What:** `generateMetadata` per route, `app/sitemap.ts` derived from content, `app/robots.ts`, `app/opengraph-image.tsx` (and per-route variants).

**Example — per-project metadata + OG image:**

```ts
// app/projects/[slug]/page.tsx
import { buildMetadata } from "@/lib/seo";
import { getProject } from "@/lib/content";

export async function generateMetadata({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return buildMetadata({
    title: project.title,
    description: project.tagline,
    path: `/projects/${slug}`,
  });
}
```

```tsx
// app/projects/[slug]/opengraph-image.tsx
import { ImageResponse } from "next/og";
import { getProject } from "@/lib/content";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG({ params }: { params: { slug: string } }) {
  const project = getProject(params.slug);
  return new ImageResponse(
    (
      <div style={{ /* tailwind-like inline styles, mono palette */ }}>
        <div>{project?.title}</div>
        <div>pjnhek.com</div>
      </div>
    ),
    size
  );
}
```

```ts
// app/sitemap.ts
import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { getAllProjects } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const now = new Date();
  const staticUrls = ["/", "/uses"].map((p) => ({ url: `${base}${p}`, lastModified: now }));
  const projectUrls = getAllProjects().map((p) => ({
    url: `${base}/projects/${p.slug}`,
    lastModified: now,
  }));
  return [...staticUrls, ...projectUrls];
}
```

### Pattern 5: Tailwind v4 CSS-First Theme

**What:** No `tailwind.config.js`. Theme lives in `app/globals.css` via `@theme`. CSS variables for the mono palette.

**Why:** Tailwind v4 made the JS config optional. For a one-mode mono palette, CSS is the right home — version-controlled, viewable in DevTools, no JS to load.

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --font-sans: ui-sans-serif, system-ui, -apple-system, "Inter", sans-serif;
  --font-mono: ui-monospace, "JetBrains Mono", monospace;

  /* Mono palette — single source of truth */
  --color-bg: oklch(0.99 0 0);          /* off-white */
  --color-fg: oklch(0.18 0 0);          /* near-black */
  --color-muted: oklch(0.55 0 0);       /* secondary text */
  --color-rule: oklch(0.92 0 0);        /* hairlines */
  --color-accent: oklch(0.18 0 0);      /* same as fg in v1 — monochrome */

  /* Typography scale (clamp = responsive without breakpoints) */
  --text-display: clamp(2.5rem, 6vw, 4.5rem);
  --text-h2: clamp(1.5rem, 3vw, 2rem);
}

html { color: var(--color-fg); background: var(--color-bg); }
::selection { background: var(--color-fg); color: var(--color-bg); }
```

**Typography plugin?** Skip it. With four prose sections and full design control, `@tailwindcss/typography` injects more opinionated CSS than you'll want to override. Hand-style headings, paragraphs, and lists in `globals.css`.

### Pattern 6: Static Generation by Default

**What:** Every route is statically generated. No `dynamic = "force-dynamic"`, no `revalidate`.

**When this breaks:** Only if you add personalization (auth, geo, A/B) — neither is on this roadmap. The v2 `/chat` route is dynamic *as a Route Handler*, not as a Server Component page; the surrounding page can still be statically generated.

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: MDX + Contentlayer Setup for 4 Projects
**What:** Adding `contentlayer`/`next-contentlayer` to compile MDX into typed objects.
**Why bad:** Contentlayer is effectively unmaintained (Stackbit acquired by Netlify; App Router compat issues). You'd be installing a deprecated tool to solve a problem you don't have.
**Instead:** Typed TS modules in `content/`. If a single project needs rich embedded React, import MDX *for that file only* via `@next/mdx`.

### Anti-Pattern 2: `"use client"` on a Page
**What:** Putting `"use client"` at the top of `app/page.tsx` because the contact form needs `onClick`.
**Why bad:** Forces every descendant to ship JS. Defeats RSC.
**Instead:** Keep the page Server. Push `"use client"` into the smallest leaf possible.

### Anti-Pattern 3: Route Groups Before You Need Them
**What:** Wrapping the v1 site in `app/(marketing)/` "for future organization."
**Why bad:** Premature structure costs zero today but adds cognitive overhead on every file path. YAGNI.
**Instead:** Add `(marketing)` and `(demo)` when v2 ships and the two truly need different layouts.

### Anti-Pattern 4: Resume PDF as a Route
**What:** Adding `/resume` or shipping a PDF in `public/`.
**Why bad:** The whole point of this site is "experience is embedded" (per PROJECT.md). A PDF link undermines that signal.
**Instead:** A rich `<Experience>` section on the home page. Recruiters who want a PDF can print-to-PDF the page.

### Anti-Pattern 5: Client-Side Theme Toggle as Hidden Tech Debt
**What:** Installing `next-themes` + `ThemeProvider` "just in case" v2 wants dark mode.
**Why bad:** Adds a client component at the root, defeats prerender hydration cleanness, brings flash-of-wrong-theme bug surface.
**Instead:** Single mode in v1 (per PROJECT.md). Add `next-themes` only when dark mode is an *active* requirement.

### Anti-Pattern 6: Embedding LLM API Calls Directly in Pages (v2)
**What:** Importing `openai` SDK into a Server Component and `await`ing it inside the JSX.
**Why bad:** Cost runs on every render, cache invalidation is fraught, no rate limiting.
**Instead:** All LLM calls go through `app/api/chat/route.ts` with rate limiting *before* the LLM call.

---

## Suggested Build Order

The dependency graph dictates the order. Each step is shippable on its own.

```
1. Foundations
   └── Next.js 15 init + TS strict + Tailwind v4 + paths
        │
2. Design System (small)
   ├── content/site.ts (name, tagline, urls, baseUrl)
   ├── app/globals.css (@theme, CSS vars, typography)
   ├── components/ui/Section.tsx, NumberedHeading.tsx, ExternalLink.tsx, Tag.tsx
   └── app/layout.tsx (fonts, default metadata)
        │
3. Content Schema
   ├── types/content.ts (Project, Role, UsesItem, SiteConfig)
   ├── content/experience.ts (start with real data — Asurion + prior)
   ├── content/projects.ts (4 entries: SF Concierge, GTM, Voice Eval, Weather)
   ├── content/uses.ts
   └── lib/content.ts (accessors)
        │
4. Static Pages (Home)
   ├── components/sections/Hero.tsx
   ├── components/sections/About.tsx (pivot narrative)
   ├── components/sections/Experience.tsx
   ├── components/sections/FeaturedProjects.tsx
   └── app/page.tsx (composition)
        │
5. Project Detail Routes
   ├── app/projects/[slug]/page.tsx
   └── generateStaticParams + notFound handling
        │
6. /uses Page
   └── app/uses/page.tsx
        │
7. Contact (form + email)
   ├── lib/env.ts (zod-validated process.env)
   ├── actions/contact.ts (server action + Resend)
   ├── components/interactive/ContactForm.tsx (use client)
   ├── components/interactive/CopyEmail.tsx (use client)
   └── components/sections/Contact.tsx (composes both)
        │
8. SEO + OG
   ├── lib/seo.ts (buildMetadata)
   ├── app/opengraph-image.tsx (site-wide)
   ├── app/projects/[slug]/opengraph-image.tsx (per-project)
   ├── app/sitemap.ts
   ├── app/robots.ts
   └── generateMetadata in each page
        │
9. Architecture Diagrams
   └── public/diagrams/* + components/ui/ArchitectureDiagram.tsx
        │
10. Polish
    ├── app/not-found.tsx
    ├── app/icon.tsx (favicon)
    ├── Lighthouse pass (LCP, CLS, JS bundle)
    └── Mobile QA (iPhone SE → Pro Max range)
        │
11. Deploy
    ├── Vercel project + env vars (RESEND_API_KEY, CONTACT_TO_EMAIL, NEXT_PUBLIC_SITE_URL)
    ├── DNS for pjnhek.com → Vercel
    └── Test contact form end-to-end on prod
```

**Critical dependency:** Steps 2 and 3 must complete before Step 4. The design system and content schema are the *only* truly upstream concerns; everything else is leaf work that parallelizes.

**Parallelizable:** Once Step 3 is done, Steps 4, 6, and 9 can run in parallel.

---

## v2 RAG Demo: Extension Points

The v1 architecture is designed so v2 plugs in without rework. Here's how:

### File additions for v2

```
app/
├── (demo)/                          # NEW: route group for demo surface
│   └── chat/
│       ├── page.tsx                 # Server: renders <Chat/> client island
│       └── layout.tsx               # optional: distinct chrome
├── api/
│   └── chat/
│       └── route.ts                 # POST handler, streams via AI SDK
│
components/interactive/
├── Chat.tsx                         # "use client" — useChat from AI SDK
├── ChatMessage.tsx
└── ChatInput.tsx
│
lib/
├── rag/
│   ├── retriever.ts                 # query embeddings (Upstash Vector or pg)
│   ├── corpus.ts                    # ingest resume + project READMEs at build
│   └── prompts.ts                   # system prompt(s)
├── ratelimit.ts                     # Upstash Ratelimit instance
└── env.ts                           # ADD: ANTHROPIC_API_KEY, UPSTASH_*

middleware.ts                        # NEW: rate-limit /api/chat by IP
```

### Where v1 already accommodates v2

| v1 decision | v2 benefit |
|-------------|-----------|
| `content/projects.ts` is typed | Trivial to map projects into the RAG corpus at build |
| `lib/env.ts` exists with zod | Just add new vars; pattern is in place |
| No route groups yet | Adding `(marketing)` + `(demo)` is a one-folder refactor — no URL changes |
| Server Components default | `/chat` page stays static; only `<Chat/>` hydrates |
| No client-side data fetching anywhere else | `/chat` is the *only* runtime data flow → easy to reason about |

### Gating (rate-limit / cost ceiling)

Two-layer defense:

1. **`middleware.ts`** matches `/api/chat` and runs Upstash Ratelimit per IP (sliding window: 10 req / 10s, 50 req / day).
2. **Route handler** enforces a hard daily token budget — read from Upstash counter, reject when over.

```ts
// middleware.ts (sketch)
import { NextResponse, type NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const limiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true,
});

export async function middleware(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "anon";
  const { success } = await limiter.limit(`chat:${ip}`);
  if (!success) return new NextResponse("Rate limited", { status: 429 });
  return NextResponse.next();
}

export const config = { matcher: "/api/chat" };
```

This keeps the demo from becoming a $200 OpenAI bill the first time HN finds it.

---

## Scalability Considerations

| Concern | At launch (you + recruiters) | If HN front-page (10K visits/day) | If goes viral (1M/month) |
|---------|------------------------------|----------------------------------|---------------------------|
| Static page serving | Vercel edge, free | Still free (static) | Static = unlimited; Vercel free tier bandwidth cap (~100GB) is the only concern |
| Contact form | Resend free (3K/mo) | Still fine; add honeypot + simple Upstash IP throttle | Move Resend → paid ($20/mo), add Cloudflare Turnstile |
| `/chat` v2 LLM cost | $0–5/mo | Add daily-budget kill-switch | Move chat behind a "demo" gate (passcode), or front-load static FAQ |
| Build time | <30s | Same — only 4 projects | Same |

The site is correctly architected to fail-static: if any dynamic piece breaks (Resend down, LLM rate-limited, Upstash quota), the rest of the portfolio is unaffected.

---

## Confidence Notes

| Claim | Confidence | Evidence |
|-------|-----------|----------|
| Tailwind v4 uses CSS-first `@theme`, no `tailwind.config.js` required | HIGH | Tailwind official docs + multiple 2026 setup guides |
| Contentlayer effectively abandoned, Content Collections is the modern equivalent | HIGH | Multiple 2024-2026 migration write-ups; Contentlayer repo stagnant |
| Server Actions + `useActionState` is the canonical Next.js 15 form pattern | HIGH | Official Next.js 15 docs, Next.js 15 release post |
| `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.tsx` are the conventional SEO files | HIGH | Official Next.js docs |
| Typed TS module beats MDX for ~4 hand-curated projects | MEDIUM (opinion) | Reasoned from the constraint (4 entries, structured fields, dev-edited) — both patterns are viable; this is the lower-friction choice |
| Upstash Ratelimit is the standard for AI route protection | HIGH | Vercel KB, AI SDK docs, multiple 2026 tutorials |
| Route groups should be deferred to v2 | MEDIUM (opinion) | Standard "introduce structure when there's a second instance" principle |

---

## Sources

- [Next.js Project Structure (official)](https://nextjs.org/docs/app/getting-started/project-structure)
- [Next.js Server and Client Components (official)](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Next.js Route Groups (official)](https://nextjs.org/docs/app/api-reference/file-conventions/route-groups)
- [Next.js Metadata and OG Images (official)](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
- [Next.js generateMetadata API (official)](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Next.js opengraph-image file convention (official)](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image)
- [Next.js Forms guide (official)](https://nextjs.org/docs/app/guides/forms)
- [Next.js 15 release notes (official)](https://nextjs.org/blog/next-15)
- [Tailwind CSS v4 Theme variables (official)](https://tailwindcss.com/docs/theme)
- [Vercel AI SDK RAG guide (official)](https://sdk.vercel.ai/docs/guides/rag-chatbot)
- [Vercel: Securing AI apps with rate limiting](https://vercel.com/kb/guide/securing-ai-app-rate-limiting)
- [Contentlayer abandoned — alternatives](https://www.wisp.blog/blog/contentlayer-has-been-abandoned-what-are-the-alternatives)
- [Migrating from Contentlayer to Content Collections (Dub)](https://dub.co/blog/content-collections)
- [Building a Theme System with Next.js 15 and Tailwind v4](https://dev.to/mukitaro/building-a-theme-system-with-nextjs-15-and-tailwind-css-v4-without-dark-prefix-43n6)
- [Next.js 15 App Router Project Structure That Scales](https://dev.to/krunal_groovy/the-nextjs-15-app-router-project-structure-that-scales-with-examples-47ha)
- [How to Rate Limit AI API Routes in Next.js](https://dev.to/whoffagents/how-to-rate-limit-your-ai-api-routes-in-nextjs-2d3)
