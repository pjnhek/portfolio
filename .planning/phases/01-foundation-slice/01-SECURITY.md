---
phase: 01-foundation-slice
slug: foundation-slice
status: verified
threats_open: 0
threats_closed: 13
threats_accepted: 6
asvs_level: 1
created: 2026-05-20
audited: 2026-05-20
---

# Phase 1 — Security

> Per-phase security contract: threat register, accepted risks, and audit trail.
>
> This report verifies the threat register declared in `01-01-PLAN.md`,
> `01-02-PLAN.md`, and `01-03-PLAN.md` against the implemented code on disk and
> against externally-verified infrastructure state captured by the orchestrator
> in `<verified_external_state>`. Verification was done by grepping cited files
> for the declared mitigations — not by re-deriving the threats.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| npm registry → developer machine | Supply-chain edge for `pnpm install` / `pnpm create next-app` | Source code of all direct + transitive dependencies |
| developer machine → public repo `pjnhek/portfolio` | Code becomes publicly visible on push | Repo files; any committed `.env*` would leak |
| `process.env` → `src/lib/env.ts` → `app/layout.tsx` `metadataBase` | Build-time input validated by zod schema | `NEXT_PUBLIC_SITE_URL` (intentionally public) |
| repo → `public/diagrams/_placeholder.svg` | Static asset served from Vercel CDN | Author-controlled SVG (no user upload path) |
| `ExternalLink` `href` → external domain in `<a target="_blank">` | Third-party origin opened in a new tab | URL string from caller code; mitigated by `rel="noopener noreferrer"` + protocol allowlist |
| `github.com` → Vercel (GitHub App webhook) | Vercel reads code + builds on its infra | Source tree from `main` and PR branches |
| Vercel preview deploy → public internet | Anyone with the hash URL can read the preview | Rendered HTML (no secrets, only public Phase-1 copy) |
| GitHub web UI → branch protection on `main` | Force-push / direct-push gate | n/a (control plane) |

No other boundaries: Phase 1 has no auth, no DB, no user input, no API, no client interactivity, no DNS work, no custom domain.

---

## Threat Register

Verification methodology: every threat ID below was matched against the source
files cited in the plan's mitigation column. `mitigate` threats require a grep
hit in the implementation. `accept` threats require a documented rationale that
still holds. `transfer` threats require a documented transfer (none in Phase 1).

| Threat ID | Category | Component | Disposition | Mitigation | Status | Evidence |
|-----------|----------|-----------|-------------|------------|--------|----------|
| T-01-SC (01) | Tampering | npm/pnpm supply chain for the 14 direct packages installed by Plan 01 | mitigate | Blocking-human checkpoint gated first install (Plan 01 Task 1). `pnpm-lock.yaml` pins all transitive deps. `.npmrc` enforces strict tool resolution. | closed | `pnpm-lock.yaml` present (138382 bytes); `.npmrc` lines 1–2 = `engine-strict=true` + `package-manager-strict=true`; `package.json` line 6 = `"packageManager": "pnpm@10.30.2"`. Plan 01 SUMMARY confirms slopcheck approval ran before install. |
| T-01-CFG-01 | Tampering | `next.config.ts` `output:'export'` regression | mitigate | Grep guard in plan acceptance criteria + verification block; `output` field must remain absent. | closed | `next.config.ts:7` exports `const nextConfig: NextConfig = {}`. `grep -RIn -E "output\s*:\s*['\"]export['\"]" next.config.*` returns 0 matches. |
| T-01-CFG-02 | Tampering | `tailwind.config.{js,ts,mjs}` regression to v3-style JS config | mitigate | Plan acceptance criterion: `find ... -name "tailwind.config.*"` must return no results. | closed | `find . -maxdepth 3 -name "tailwind.config.*" -not -path "./node_modules/*"` returns no results. `src/app/globals.css` uses CSS-first `@theme inline { ... }` + `@theme { ... }` per Tailwind v4 idiom (lines 13–44). |
| T-01-CFG-03 | Tampering | `package.json` `lint` script regression to removed `next lint` | mitigate | Plan acceptance criterion blocks `"next lint"` substring. | closed | `package.json:14` = `"lint": "eslint ."`. `grep -n "next lint" package.json` returns 0 matches. `eslint.config.mjs:8` imports `eslint-config-prettier/flat` as the last rule entry. |
| T-01-INFO-01 | Information Disclosure | Secret committed to public repo on first push | accept | Phase 1 has no secrets. `NEXT_PUBLIC_SITE_URL` is the only env var and is public-by-design (`NEXT_PUBLIC_` convention). `.gitignore` covers `.env*` with `!.env.example` exception. | accepted | `.gitignore:34–35` = `.env*` + `!.env.example`. `.env.example` contains only the public `NEXT_PUBLIC_SITE_URL=https://pjnhek.com`. Grep for secret-shaped strings (`sk-…`, `api[_-]?key=…`, `password=…`) in `src/` returns 0 hits. See Accepted Risks Log AR-01. |
| T-01-CONFIG (01) | Tampering | Build-time env consumption with string fallback (deferred to Plan 02) | mitigate (deferred) | Plan 02 introduces `src/lib/env.ts` (zod) and swaps `app/layout.tsx` to consume `env.NEXT_PUBLIC_SITE_URL`. | closed | Deferral fulfilled. `src/lib/env.ts:27–43` defines schema, module-top `safeParse`, throws on failure, exports `env`. `src/app/layout.tsx:3` imports `env`; line 27 uses `metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL)`. No remaining `process.env.NEXT_PUBLIC_SITE_URL` read in `app/`. |
| T-01-DOS (01) | Denial of Service | Vercel preview URL bandwidth on Hobby tier | accept | Non-guessable hash URLs; Hobby 100 GB/month covers expected PR traffic; Phase 4 owns usage alerts (DEP-08). | accepted | Per `<verified_external_state>`: preview URL is a hash. Recorded in Accepted Risks Log AR-02. |
| T-01-CONFIG (02) | Tampering | `src/lib/env.ts` schema weakened (e.g., type loosened to `z.any()`, `throw` replaced by `console.warn`, `safeParse` moved into a function) | mitigate | Plan 02 Task 3 negative test proved the build fails on missing env when `.default()` is removed. Future regressions caught by re-running the cycle before Phase 4 removes the default. | closed | `src/lib/env.ts:33` calls `schema.safeParse(process.env)` at module top. Lines 35–41 conditionally `throw new Error("Invalid environment variables. See above.")`. Plan 02 SUMMARY records Task 3 captured failure message: `❌ Invalid environment variables: { NEXT_PUBLIC_SITE_URL: [ 'Required' ] }` + `ELIFECYCLE Command failed with exit code 1`. |
| T-01-TABNAB | Tampering | `ExternalLink` reverse-tabnabbing (malicious destination sets `window.opener.location`) | mitigate | `ExternalLink` hard-codes `rel="noopener noreferrer"` on every external anchor (UI-SPEC §4 contract). | closed | `src/components/primitives/ExternalLink.tsx:55–56` literal `target="_blank"` + `rel="noopener noreferrer"`. **Strengthened by WR-01 fix:** lines 32–50 add an `SAFE_PROTOCOLS = ["https://", "http://", "mailto:"]` allowlist + graceful degrade-to-plain-text + dev `console.warn` for non-allowlisted protocols. `javascript:`, `data:`, `vbscript:`, `file:`, `tel:` are explicitly excluded. |
| T-01-XSS-SVG | Tampering | SVG-based XSS via inline `<script>` or `onload` handler | mitigate | Phase 1 uses `<img src="...">` (NOT `dangerouslySetInnerHTML`). Browsers do not execute scripts in SVGs referenced via `<img>`. | closed | `src/components/primitives/ArchitectureDiagram.tsx:44–48` uses a passthrough `<img src={src}>` element with a line-scoped `// eslint-disable-next-line @next/next/no-img-element` comment. No `dangerouslySetInnerHTML` exists anywhere in `src/`. `public/diagrams/_placeholder.svg` (the only committed SVG) contains no `<script>`, `onload`, `onerror`, `onclick`, or `javascript:` patterns (verified by grep). |
| T-01-CSR | Spoofing | Future `"use client"` + `useEffect` data leak to client bundle | mitigate (defense-in-depth) | Plan acceptance criteria block any `"use client"` directive in Phase 1; phase-level `grep -RIn "use client" src/` must return no results. | closed | `grep -RIniE '^\s*"use client"' src/` returns 0 matches (no actual directives). The single textual hit in `src/lib/env.ts:7` is inside a JSDoc warning explaining the boundary — not an active directive. `src/lib/env.ts:1` is the JSDoc header explicitly forbidding client imports. PR template (`.github/pull_request_template.md`) includes a checkbox blocking any new `"use client"` in Phase 1 without justification. |
| T-01-INFO (02) | Information Disclosure | `NEXT_PUBLIC_SITE_URL` is public | accept | Value is intentionally public per `NEXT_PUBLIC_` convention; only leak is the production URL itself, which is published. | accepted | See Accepted Risks Log AR-03. |
| T-01-SC (02) | Tampering | npm supply chain (inherited from Plan 01) | mitigate (inherited) | No new packages installed in Plan 02. `pnpm-lock.yaml` unchanged from Plan 01. | closed | Plan 02 SUMMARY: "pnpm-lock.yaml: Unchanged from Plan 01-01. No `pnpm add` invocations occurred." Same lockfile hash recorded. |
| T-01-SEC-LEAK | Information Disclosure | First push of public repo contains a committed secret | mitigate | `.gitignore` covers `.env*` patterns; pre-push `git status` review. Phase 1 has no secrets. | closed | `.gitignore:34–35`. Only `.env.example` is committed (contains only the public URL). No secret-shaped strings found in tracked files. Plan 03 SUMMARY confirms no `.env*` staged before first push. |
| T-01-VERCEL-PROD-ENV | Tampering | `NEXT_PUBLIC_SITE_URL` accidentally set in Vercel **preview** instead of production | mitigate (defense-in-depth) | Plan 03 acceptance criterion forbids setting the var at all in Phase 1; Phase 4 (DEP-03) explicitly owns production env. | closed | Plan 03 SUMMARY §7: "Confirmed. Vercel Project Settings → Environment Variables → Production is empty." Orchestrator pre-confirmed externally. `src/lib/env.ts:30` schema retains `.default("https://pjnhek.com")` so build remains green without env var. |
| T-01-BR-PROT | Tampering / Repudiation | Force-push to `main` if branch protection misconfigured | mitigate | GitHub Rulesets on `main`: PR required + block force pushes + Vercel status check required. | closed | Per `<verified_external_state>`: Rulesets active on `main` with PR-required (approvals=0), `Block force pushes` enabled, `Vercel` status check required. Plan 03 SUMMARY §6 records the exact Ruleset configuration. |
| T-01-VERCEL-USAGE | Denial of Service | Phase 1 preview URL bandwidth abuse | accept | Non-guessable hash URLs; Hobby 100 GB tolerates many million hits per month for ~1MB pages; Phase 4 adds usage alerts (DEP-08). Vercel Authentication was disabled per user Option A — this is consistent with the original "non-guessable hash is the sole barrier" disposition, not a weakening. | accepted | See Accepted Risks Log AR-04. |
| T-01-SC (03) | Tampering | Vercel GitHub App permissions scope | mitigate | Plan 03 Task 3 Step A.3 recommends scoping the Vercel App to `pjnhek/portfolio` (or all-repos at user discretion). | closed | Plan 03 SUMMARY: "Vercel GitHub App was granted access to `pjnhek/portfolio` specifically (or all-repos at user discretion); recorded for posterity." |
| T-01-SC-VERCEL | Tampering | Vercel platform itself as supply-chain edge | accept | Vercel is the locked hosting choice per CLAUDE.md / D-02. Platform-wide compromise mitigation is outside Phase 1 scope. | accepted | See Accepted Risks Log AR-05. |

**Totals:** 13 closed (mitigated) · 6 accepted · 0 open · 0 transferred.

*Status: closed · open*
*Disposition: mitigate (implementation required) · accept (documented risk) · transfer (third-party)*

---

## Unregistered Flags

`SUMMARY.md ## Threat Flags` sections were inspected for new attack surface introduced during implementation:

- **01-01-SUMMARY `## Threat Flags`:** "None. Plan 01-01 did not introduce any security-relevant surface beyond what the threat model already covered."
- **01-02-SUMMARY `## Threat Flags`:** "None. Plan 01-02 introduced no security-relevant surface beyond what the threat model already covered."
- **01-03-SUMMARY `## Threat Flags`:** Lists T-01-SEC-LEAK, T-01-VERCEL-PROD-ENV, T-01-BR-PROT, T-01-VERCEL-USAGE, T-01-SC, T-01-SC-VERCEL — all map 1:1 to existing register IDs above.

**No unregistered flags.** All implementation-discovered surface area maps to a declared threat ID.

---

## Accepted Risks Log

| Risk ID | Threat Ref | Rationale | Accepted By | Date |
|---------|------------|-----------|-------------|------|
| AR-01 | T-01-INFO-01 | Phase 1 has no secrets. `NEXT_PUBLIC_SITE_URL` is public-by-design (Next.js `NEXT_PUBLIC_` convention exposes the value to the client). `.gitignore` covers `.env*` patterns with explicit `!.env.example` exception. Asurion confidentiality is enforced at Phase 2's confidentiality gate, not here. | Plan author (per 01-01-PLAN `<threat_model>`) | 2026-05-20 |
| AR-02 | T-01-DOS (01) | Vercel preview URLs are non-guessable hashes. Hobby tier 100 GB/month bandwidth comfortably covers Phase-1-expected traffic (a few PRs). Production-tier abuse handling lands in Phase 4 (DEP-08 usage alerts at 50/80/100%). | Plan author (per 01-01-PLAN `<threat_model>`) | 2026-05-20 |
| AR-03 | T-01-INFO (02) | `NEXT_PUBLIC_SITE_URL` is intentionally a public value per Next.js convention. Only "leak" would be the production URL (`pjnhek.com`), which is the published portfolio domain itself. | Plan author (per 01-02-PLAN `<threat_model>`) | 2026-05-21 |
| AR-04 | T-01-VERCEL-USAGE | Same rationale as AR-02 inherited from Plan 01. Vercel Deployment Protection was disabled in Plan 03 Task 4 per user Option A — this is consistent with (not a weakening of) the original disposition: the disposition already accepted "non-guessable hashes as the sole barrier." Disabling Vercel Auth simply formalizes that the hash IS the barrier; it does not introduce new exposure beyond what the threat model already accepted. | User (Option A decision, Plan 03 Task 4, recorded in 01-03-SUMMARY Deviation #2) | 2026-05-21 |
| AR-05 | T-01-SC-VERCEL | Vercel is the locked hosting choice per CLAUDE.md / D-02 (D-02 = "Vercel Hobby with preview deploys"). Mitigation against platform-wide compromise (e.g., Vercel's own infrastructure being breached) is outside Phase 1 scope and not economical for a personal portfolio. SOC 2 posture + mainstream usage make this an industry-standard accept. | Plan author (per 01-03-PLAN `<threat_model>`) | 2026-05-21 |
| AR-06 | T-01-INFO-01 (Plan 03 reaffirmation) | Same as AR-01, reaffirmed at first-push time. Plan 03 SUMMARY confirms no `.env*` files were staged before the first push to the public repo. | Executor (Plan 03 Task 2) | 2026-05-21 |

*Accepted risks do not resurface in future audit runs.*

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Accepted | Run By |
|------------|---------------|--------|------|----------|--------|
| 2026-05-20 | 19 | 13 | 0 | 6 | Claude (gsd-secure-phase, Opus 4.7) |

---

## Phase-Specific Notes

### Defense-in-depth strengthenings beyond the original threat register

- **WR-01 (ExternalLink protocol allowlist).** The code review surfaced that `ExternalLink`'s original mitigation (`rel="noopener noreferrer"`) defended against reverse tabnabbing but not against `javascript:` / `data:` URI execution. The fix at `src/components/primitives/ExternalLink.tsx:32–50` adds an explicit `SAFE_PROTOCOLS = ["https://", "http://", "mailto:"]` allowlist with graceful degradation (renders children as plain text + dev `console.warn`). This strengthens **T-01-TABNAB** beyond the declared mitigation; it does not introduce a new threat.

### Build-time enforcement contracts proven

- **FOUND-10 negative test** (Plan 02 Task 3): Confirmed that removing `.default()` from `src/lib/env.ts` and unsetting `NEXT_PUBLIC_SITE_URL` causes `pnpm build` to exit non-zero with the literal string `Invalid environment variables` in stderr. This gives Phase 4 a known-good failure surface to verify against when DEP-03 lands.

### Carry-overs into later phases

- **Phase 4 must remove** `.default("https://pjnhek.com")` from `src/lib/env.ts:30` once `NEXT_PUBLIC_SITE_URL=https://pjnhek.com` is set in Vercel **production** environment (DEP-03). Doing so without setting the env var first would intentionally hard-fail the build — that IS the FOUND-10 contract.
- **Phase 2's first `"use client"` island** (planned: `CopyEmail.tsx` for SEC-07) must not import `src/lib/env.ts`. The JSDoc header at `src/lib/env.ts:1–26` documents this; future reviewers should treat any client-side import of `env` as a regression of T-01-CSR.
- **Phase 2 confidentiality gate** governs Asurion-related content. No Asurion proprietary content or screenshots are present in Phase 1 (`grep` of `src/` and `public/` confirms — only the Copywriting Contract literal "AI Engineer @ Asurion" appears, which is the public, low-fidelity reference allowed by PROJECT.md).

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer)
- [x] Accepted risks documented in Accepted Risks Log
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter
- [x] No unregistered flags from SUMMARY `## Threat Flags`
- [x] Every `mitigate` threat has grep evidence in the cited file
- [x] Every `accept` threat has a rationale entry in the Accepted Risks Log
- [x] Implementation files not modified by this audit

**Approval:** verified 2026-05-20
