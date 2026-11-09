// Renders the live globe scene in its deterministic "poster" state and saves the LCP poster:
//   public/images/globe-poster-{1400,800}.{avif,webp}  +  lib/globe-poster.json (hub positions, %)
// Usage: npm run build && npx next start -p 3100 &  then  node scripts/make-globe-poster.mjs [baseUrl]
import { chromium } from "playwright";
import sharp from "sharp";
import { writeFileSync } from "node:fs";

const base = process.argv[2] ?? "http://localhost:3100";
const browser = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
const ctx = await browser.newContext({ viewport: { width: 1400, height: 1400 }, deviceScaleFactor: 1 });
await ctx.addInitScript(() => sessionStorage.setItem("hv-visited", "1"));
const page = await ctx.newPage();
page.on("console", (m) => m.type() === "error" && console.error("[page]", m.text()));
await page.goto(`${base}/?globe-poster`, { waitUntil: "networkidle" });
await page.waitForFunction(() => window.__posterHubs, null, { timeout: 30000 });
await page.waitForTimeout(800);
const png = await page.locator("#poster-studio").screenshot({ type: "png" });
const hubs = await page.evaluate(() => window.__posterHubs);
await browser.close();

for (const size of [1400, 800]) {
  const img = sharp(png).resize(size, size);
  await img.clone().avif({ quality: 58, effort: 7 }).toFile(`public/images/globe-poster-${size}.avif`);
  await img.clone().webp({ quality: 78 }).toFile(`public/images/globe-poster-${size}.webp`);
}
writeFileSync("lib/globe-poster.json", JSON.stringify(hubs, null, 2) + "\n");
console.log("poster written; hubs:", Object.keys(hubs).join(", "));
