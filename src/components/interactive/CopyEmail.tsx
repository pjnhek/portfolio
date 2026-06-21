"use client";
// CopyEmail client island (SEC-07, UI-SPEC §Components/CopyEmail).
//
// THE ONLY "use client" file in the entire codebase. SEC-07 is the hard
// invariant; the Phase 2 confidentiality gate (Plan 02-05 Task 5) verifies
// the count is exactly 1.
//
// Receives `email` as a prop from the home Contact section (page.tsx) which
// reads `site.email` server-side. NEVER imports the server-only env module
// (Pitfall 3 in 02-RESEARCH.md): doing so would drag the zod env validator
// into the client bundle and crash at runtime because env.ts's server-only
// invariant throws when evaluated in the browser.
//
// State machine: idle → success (2s) → idle  |  idle → error (5s) → idle.
// SR announcement uses `role="status" aria-live="polite"` (NOT `assertive`)
// because clipboard success is a non-urgent confirmation, per UI-SPEC line
// 715 / WAI-ARIA APG. The visible button label and the icon swap mirror the
// announcement; both are deliberate redundancy for SR users + visual users.
//
// Icon budget (Pitfall 8): exactly two lucide icons — Clipboard, Check.
// No other lucide imports are permitted anywhere in src/.
//
// `min-h-[44px]` enforces the WCAG 2.5.5 touch-target floor (UI-SPEC
// Spacing-Scale Exceptions). `focus-visible:` 4-class string is verbatim
// from `ExternalLink.tsx` line 57 — focus ring contract is centralized.
//
// React 19.2 + the React Compiler memoize handler identity automatically;
// `useCallback` is unnecessary and explicitly avoided (CLAUDE.md "elegance
// is when there's nothing left to take away").
//
// `attempt` is a monotonic counter, not duplicate state: it keys the live
// region so a screen reader re-announces back-to-back *identical* outcomes
// (two copies → "Copied" twice) — polite regions only fire on a detected
// content change, so identical text would otherwise be silent. The reset
// timer is tracked in a ref and cleared before each new schedule and on
// unmount, so rapid clicks can't stack overlapping timers that reset state
// out from under a later success, and no deferred setState runs after unmount.
import { Clipboard, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type CopyEmailProps = { email: string };

export function CopyEmail({ email }: CopyEmailProps) {
  const [state, setState] = useState<"idle" | "success" | "error">("idle");
  const [attempt, setAttempt] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  function scheduleReset(ms: number) {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), ms);
  }

  async function handleCopy() {
    setAttempt((n) => n + 1);
    try {
      await navigator.clipboard.writeText(email);
      setState("success");
      scheduleReset(2000);
    } catch {
      setState("error");
      scheduleReset(5000);
    }
  }

  const label =
    state === "success"
      ? "Copied"
      : state === "error"
        ? "Copy failed — select email manually"
        : "Copy email";
  const Icon = state === "success" ? Check : Clipboard;

  return (
    <>
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex min-h-[44px] items-center gap-2 border border-[color:var(--color-rule)] px-4 py-2 font-medium text-[length:var(--text-body)] text-[color:var(--color-ink)] hover:border-[color:var(--color-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-ink)]"
      >
        <Icon size={16} aria-hidden="true" />
        <span>{label}</span>
      </button>
      <span key={attempt} role="status" aria-live="polite" className="sr-only">
        {state === "success"
          ? "Copied to clipboard"
          : state === "error"
            ? "Copy failed. Select the email address to copy it manually."
            : ""}
      </span>
    </>
  );
}
