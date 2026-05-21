// Zod-validated env-var parser (FOUND-10).
//
// `safeParse` runs at module top level so the FIRST time any Server Component
// imports `env`, the validation runs synchronously and a missing required var
// throws — surfacing as a build-time error during `next build`. RESEARCH.md
// `## Common Pitfalls` 5 explains why this must NOT live inside a function.
//
// Phase 4 removes the `.default("https://pjnhek.com")` once Vercel production
// env is set; doing so today would break preview deploys that haven't yet had
// the env var configured. Task 3 of Plan 01-02 verifies the failure path.
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
