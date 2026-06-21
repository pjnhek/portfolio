import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/primitives/SiteFooter";
import { env } from "@/lib/env";
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

// `env.NEXT_PUBLIC_SITE_URL` is the zod-validated read path (Plan 01-02 wired
// `src/lib/env.ts`). The schema's `.default("https://pjnhek.com")` keeps the
// build green when the env var is unset; Phase 4 removes the default once
// Vercel production env is configured, at which point a missing var hard-fails
// `next build` per FOUND-10.
export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
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
      <body>
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
