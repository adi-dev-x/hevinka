// Section QA: viewport screenshots at chosen scroll points, after scrolling there gradually so
// scrubbed/pinned timelines settle. Points are "selector" or "selector+N" (N = extra viewport heights).
// PAGE=/route node scripts/section-shots.mjs <outDir> <width> "<sel>[+N]" ...  (PAGE defaults to /)
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const [out, width, ...points] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const w = Number(width);
const browser = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
const ctx = await browser.newContext({ viewport: { width: w, height: w < 768 ? 844 : 900 } });
await ctx.addInitScript(() => sessionStorage.setItem("hv-visited", "1"));
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto(`http://localhost:3100${process.env.PAGE ?? "/"}`, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
let n = 0;
for (const pt of points) {
  const [sel, extra = "0"] = pt.split("+");
  const y = await page.evaluate(({ sel, extra }) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    return el.getBoundingClientRect().top + window.scrollY + Number(extra) * innerHeight;
  }, { sel, extra });
  if (y == null) { console.log("missing", sel); continue; }
  await page.evaluate(async (target) => {
    const dir = target > scrollY ? 1 : -1;
    for (let y = scrollY; dir * (target - y) > 0; y += dir * 70) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 14)); }
    window.scrollTo(0, target);
  }, Math.max(0, Math.round(y)));
  await page.waitForTimeout(1700);
  const name = `${out}/${w}-${String(++n).padStart(2, "0")}-${sel.replace(/[^a-z0-9]/gi, "")}${extra !== "0" ? "-" + extra : ""}.png`;
  await page.screenshot({ path: name });
}
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
console.log(`@${w}: overflow=${overflow}px errors=${errors.length} ${errors.slice(0, 3).join(" | ")}`);
await browser.close();
