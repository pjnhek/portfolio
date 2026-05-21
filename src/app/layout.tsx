import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Geist Sans + Geist Mono are loaded via `next/font/google` — self-hosted at
// build time (zero layout shift, no external request). Geist is a variable
// font, so no `weight` array is passed. `subsets: ["latin"]` is required.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// Phase 1 reads `NEXT_PUBLIC_SITE_URL` directly with a string fallback so
// previews build without an env var being set. Plan 02 will swap this to
// `env.NEXT_PUBLIC_SITE_URL` from `src/lib/env.ts` (zod-validated) — at which
// point removing the `.default()` makes the build hard-fail (FOUND-10).
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://pjnhek.com",
  ),
  title: "James Nhek — AI Engineer",
  description:
    "AI Engineer at Asurion. RAG, evaluations, and agentic workflows. Based in San Francisco. Open to roles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
