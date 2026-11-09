// Shared Open Graph card (next/og): navy night gradient, dotted-glow accents, logo mark, two-tone title.
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { company } from "./content";
import { BLADE_PATHS, MARK_VIEWBOX } from "@/components/ui/Logo";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_TYPE = "image/png";

const mark = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${MARK_VIEWBOX}"><defs><linearGradient id="g" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#0b5bd3"/><stop offset="1" stop-color="#7fe3ff"/></linearGradient></defs>${BLADE_PATHS.map((d) => `<path d="${d}" fill="url(#g)"/>`).join("")}</svg>`,
)}`;

const fontDir = join(process.cwd(), "node_modules/@fontsource/sora/files");
const fonts = () =>
  Promise.all([
    readFile(join(fontDir, "sora-latin-400-normal.woff")).then((data) => ({ name: "Sora", data, weight: 400 as const, style: "normal" as const })),
    readFile(join(fontDir, "sora-latin-800-normal.woff")).then((data) => ({ name: "Sora", data, weight: 800 as const, style: "normal" as const })),
  ]);

export async function ogImage({ eyebrow, title }: { eyebrow: string; title: readonly [string, string] | readonly string[] }) {
  const fs = Math.max(...title.map((t) => t.length)) > 20 ? 58 : 76;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          color: "#fff",
          background: "radial-gradient(120% 80% at 70% 0%, #0b3a80 0%, #001c3d 45%, #000e21 100%)",
          fontFamily: "Sora",
          position: "relative",
        }}
      >
        {/* diagonal frame accent */}
        <div style={{ position: "absolute", right: -120, top: -80, width: 560, height: 560, borderRadius: 9999, background: "rgba(0,168,252,0.18)", filter: "blur(80px)" }} />
        <div style={{ position: "absolute", right: 72, bottom: 0, width: 260, height: 8, background: "linear-gradient(90deg,#0047a8,#00a8fc)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- next/og renders <img>, not next/image */}
          <img src={mark} width={52} height={71} alt="" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 34, fontWeight: 800, letterSpacing: 2 }}>HEVINKA</span>
            <span style={{ fontSize: 13, letterSpacing: 4, color: "#9fb3d1" }}>TECHNOLOGIES PRIVATE LIMITED</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 18, letterSpacing: 5, color: "#00a8fc", textTransform: "uppercase", marginBottom: 24 }}>{eyebrow}</span>
          <span style={{ fontSize: fs, fontWeight: 800, lineHeight: 1, textTransform: "uppercase", letterSpacing: -2 }}>{title[0]}</span>
          <span style={{ fontSize: fs, fontWeight: 800, lineHeight: 1.05, textTransform: "uppercase", letterSpacing: -2, color: "#00a8fc" }}>{title[1]}</span>
          <div style={{ width: 96, height: 6, borderRadius: 6, marginTop: 28, background: "linear-gradient(90deg,#0047a8,#00a8fc)" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, color: "#9fb3d1", letterSpacing: 3 }}>
          <span>{company.strapline}</span>
          <span>{company.footprint.join(" | ")}</span>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: await fonts() },
  );
}
