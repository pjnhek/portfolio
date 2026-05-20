import type { NextConfig } from "next";

// Phase 1: bare-bones typed config. We intentionally do NOT enable static
// HTML export (the `output` field is left unset) — enabling it would disable
// `next/image`, dynamic OG, and ISR (FOUND-12). Turbopack is the default in
// Next.js 16, so no `experimental.turbopack` key is needed.
const nextConfig: NextConfig = {};

export default nextConfig;
