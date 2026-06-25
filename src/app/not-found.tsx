import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24 md:px-12">
      <p className="font-mono text-[length:var(--text-caption)] text-[color:var(--color-ink-muted)] tracking-widest uppercase mb-6">
        404
      </p>
      <h1 className="text-[length:var(--text-display)] font-medium tracking-[-0.02em] text-[color:var(--color-ink)] leading-[var(--leading-display)]">
        404
      </h1>
      <p className="mt-6 text-[length:var(--text-body)] text-[color:var(--color-ink-muted)] leading-[var(--leading-body)]">
        This page wandered off. Here&rsquo;s the way back.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block text-[length:var(--text-body)] text-[color:var(--color-ink)] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-ink)]"
      >
        ← Back to home
      </Link>
    </main>
  );
}
