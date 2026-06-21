/**
 * SERVER-ONLY env-var parser (FOUND-10). DO NOT import from Client Components.
 *
 * This module reads `process.env` at module top level and throws on parse
 * failure. That's the intended behavior on the server (build fails loudly when
 * a required var is missing — see RESEARCH.md `## Common Pitfalls` 5), but if
 * a `"use client"` file imports it, Next.js will:
 *
 *   1. Inline `process.env.NEXT_PUBLIC_*` at build time (correct — that's the
 *      `NEXT_PUBLIC_` contract).
 *   2. Bundle the entire module — including the `throw new Error(...)` block —
 *      into the client.
 *   3. Run `safeParse(process.env)` in the browser, where `process.env` is
 *      `{}` or a tiny stub, firing the throw on page load.
 *
 * If a Client Component needs the site URL, expose it via a prop from a Server
 * Component wrapper, or split this into `env.server.ts` + `env.public.ts`.
 *
 * `safeParse` runs at module top level so the FIRST time any Server Component
 * imports `env`, the validation runs synchronously and a missing required var
 * throws — surfacing as a build-time error during `next build`.
 *
 * Phase 4 removes the `.default("https://pjnhek.com")` once Vercel production
 * env is set; doing so today would break preview deploys that haven't yet had
 * the env var configured. Task 3 of Plan 01-02 verifies the failure path.
 */
import { z } from "zod";

const schema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default("https://pjnhek.com"),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "❌ Invalid environment variables:",
    parsed.error.flatten().fieldErrors,
  );
  throw new Error("Invalid environment variables. See above.");
}

export const env = parsed.data;
