// Hero QA: screenshots at 390 / 1440 at three scroll beats (hero, Kochi focus, Global Solutions),
// a mid-intro frame on first visit, and a reduced-motion frame. node scripts/hero-shots.mjs [baseUrl] [outDir]
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const base = process.argv[2] ?? "http://localhost:3100";
const out = process.argv[3] ?? "qa-screenshots";
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });

async function settle(page, ms = 1800) {
  await page.waitForTimeout(ms);
}

for (const [w, h] of [[1440, 900], [390, 844]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  await ctx.addInitScript(() => sessionStorage.setItem("hv-visited", "1"));
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(base + "/", { waitUntil: "networkidle" });
  // wait for the live canvas to cross-fade in
  await page.waitForFunction(() => document.querySelector("canvas") && getComputedStyle(document.querySelector("canvas").parentElement.parentElement).opacity === "1", null, { timeout: 30000 }).catch(() => console.log("canvas not revealed in time"));
  await settle(page, 2500);
  await page.screenshot({ path: `${out}/hero-${w}-0.png` });
  const H = await page.evaluate(() => document.querySelector("#global").offsetTop);
  const range = await page.evaluate(() => document.querySelector(".hero-section").parentElement.offsetHeight - innerHeight);
  for (const [name, y] of [["1", Math.round(range * 0.42)], ["2", H]]) {
    // scroll gradually so scrubbed timelines settle
    await page.evaluate(async (target) => {
      const step = 60;
      for (let y = window.scrollY; y < target; y += step) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 16)); }
      window.scrollTo(0, target);
    }, y);
    await settle(page, 2200);
    await page.screenshot({ path: `${out}/hero-${w}-${name}.png` });
  }
  console.log(`@${w}: errors=${errors.length} ${errors.slice(0, 2).join(" | ")}`);
  await ctx.close();
}

// first-visit intro mid-flight
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(base + "/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2900);
  await page.screenshot({ path: `${out}/hero-intro-mid.png` });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${out}/hero-intro-end.png` });
  await ctx.close();
}
// reduced motion
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${out}/hero-reduced.png` });
  await ctx.close();
}
await browser.close();
