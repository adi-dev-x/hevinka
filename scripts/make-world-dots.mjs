// Generates the brand's dotted (halftone) world map from Natural Earth land polygons.
// Outputs:
//   public/brand/world-dots.svg   — flat equirectangular dot map (menu, contact, global section)
//   public/data/globe-dots.bin    — Int16 pairs [lng*100, lat*100] of land points for the 3D globe
// Run: node scripts/make-world-dots.mjs
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { feature } from "topojson-client";
import { geoContains } from "d3-geo";

const require = createRequire(import.meta.url);
const topo = JSON.parse(readFileSync(require.resolve("world-atlas/land-110m.json"), "utf8"));
const land = feature(topo, topo.objects.land);

const W = 1000, H = 500, STEP = 1.8; // degrees between dots on the flat map
let circles = "";
for (let lat = 83; lat > -58; lat -= STEP) {
  for (let lng = -180 + STEP / 2; lng < 180; lng += STEP) {
    if (!geoContains(land, [lng, lat])) continue;
    const x = ((lng + 180) / 360) * W, y = ((90 - lat) / 180) * H;
    circles += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.5"/>`;
  }
}
writeFileSync(
  "public/brand/world-dots.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" fill="#0b5bd3">${circles}</svg>\n`,
);

// Globe points: roughly equal-area sampling (fewer points toward the poles), ~17k dots.
// Every 3rd point is kept on mobile, so ordering is interleaved by latitude row already.
const pts = [];
const G = 0.82;
for (let lat = -58; lat <= 83; lat += G) {
  const n = Math.max(1, Math.round((360 / G) * Math.cos((lat * Math.PI) / 180)));
  for (let i = 0; i < n; i++) {
    const lng = -180 + (i + 0.5) * (360 / n);
    if (geoContains(land, [lng, lat])) pts.push(Math.round(lng * 100), Math.round(lat * 100));
  }
}
mkdirSync("public/data", { recursive: true });
writeFileSync("public/data/globe-dots.bin", Buffer.from(new Int16Array(pts).buffer));
console.log(`flat map written; globe points: ${pts.length / 2}`);
