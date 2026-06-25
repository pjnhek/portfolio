import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
  const geistRegular = await readFile(
    join(
      process.cwd(),
      "node_modules/next/dist/compiled/@vercel/og/Geist-Regular.ttf"
    )
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#fafafa",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Geist",
          fontSize: 14,
          fontWeight: 400,
          color: "#0a0a0a",
          letterSpacing: "-0.02em",
        }}
      >
        JN
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Geist", data: geistRegular, style: "normal", weight: 400 }],
    }
  );
}
