// Static 1200×630 OG card — generated at build time (zero runtime CPU cost).
//
// D-OG-01: Static, not per-request. No request-time APIs called, so Next.js
// generates this as a static asset automatically (no dynamic export needed).
// D-OG-02: One site-wide identity card; all routes point to /opengraph-image.
// D-OG-03: Content — James Nhek / AI Engineer @ Asurion / RAG · evaluations ·
//           agentic workflows / pjnhek.com domain mark.
// D-OG-04: Left-aligned type stack on off-white, strict monochrome (hex values).
//
// CRITICAL: All styles are inline `style={{}}` objects with literal hex values.
// Satori (the renderer inside ImageResponse) does NOT resolve CSS custom
// properties — CSS variable references would render as literal strings, not
// colors (03-RESEARCH Pitfall 2). Every value must be a hex or numeric literal.
//
// Hex palette sourced from src/app/globals.css (resolved from oklch):
//   paper    oklch(0.985 0 0) → background hex
//   ink      oklch(0.18  0 0) → primary text hex
//   muted    oklch(0.55  0 0) → secondary text hex
//
// Font is bundled inside Next.js 16 at
// node_modules/next/dist/compiled/@vercel/og/ — no separate geist package needed.
// Build-time asset — no client directive needed or wanted.
import { ImageResponse } from "next/og";
import { readFile, access } from "node:fs/promises";
import { join, dirname } from "node:path";

export const alt = "James Nhek — AI Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Relative path (from any project root) to the Geist font bundled with Next.js.
const FONT_PATH = join(
  "node_modules",
  "next",
  "dist",
  "compiled",
  "@vercel",
  "og",
  "Geist-Regular.ttf"
);

/**
 * Walk upward from startDir until we find the font file.
 * This handles git worktrees, pnpm workspaces, and monorepos where
 * node_modules may not live at process.cwd().
 */
async function findFontPath(startDir: string): Promise<string> {
  let dir = startDir;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const candidate = join(dir, FONT_PATH);
    try {
      await access(candidate);
      return candidate;
    } catch {
      const parent = dirname(dir);
      if (parent === dir) {
        // Filesystem root — fall back to process.cwd() join (will throw with helpful ENOENT)
        return join(startDir, FONT_PATH);
      }
      dir = parent;
    }
  }
}

export default async function Image() {
  const fontFilePath = await findFontPath(process.cwd());
  const geistRegular = await readFile(fontFilePath);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#fafafa",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "Geist",
        }}
      >
        {/* Name — largest, primary ink */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 400,
            color: "#0a0a0a",
            lineHeight: 1.1,
          }}
        >
          James Nhek
        </div>

        {/* Role */}
        <div
          style={{
            fontSize: 36,
            color: "#0a0a0a",
            marginTop: 20,
            lineHeight: 1.2,
          }}
        >
          AI Engineer @ Asurion
        </div>

        {/* Specialization — muted, centered dot separator (D-OG-03) */}
        <div
          style={{
            fontSize: 28,
            color: "#737373",
            marginTop: 16,
            lineHeight: 1.4,
          }}
        >
          RAG · evaluations · agentic workflows
        </div>

        {/* Domain mark — absolute bottom-right */}
        <div
          style={{
            fontSize: 20,
            color: "#737373",
            position: "absolute",
            right: 80,
            bottom: 80,
          }}
        >
          pjnhek.com
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: geistRegular, style: "normal", weight: 400 },
      ],
    }
  );
}
