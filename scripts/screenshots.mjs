// Launch-QA screenshots: node scripts/screenshots.mjs [baseUrl] [routes...]
// Scrolls each page slowly (so ScrollTrigger reveals fire), then captures full-page shots at 390/768/1440,
// plus a reduced-motion pass and a JS-disabled pass. Reports horizontal overflow and content left hidden.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const base = process.argv[2] ?? "http://localhost:3000";
const routes = process.argv.slice(3).length ? process.argv.slice(3) : ["/", "/playground"];
const out = "qa-screenshots";
mkdirSync(out, { recursive: true });

const widths = [390, 768, 1440];
const browser = await chromium.launch();

async function scrollThrough(page) {
  await page.evaluate(async () => {
    const step = innerHeight * 0.5;
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      window.__lenis?.scrollTo?.(y, { immediate: true });
      await new Promise((r) => setTimeout(r, 160));
    }
    await new Promise((r) => setTimeout(r, 1200));
  });
}

async function audit(page) {
  return page.evaluate(() => {
    const overflow = document.documentElement.scrollWidth - innerWidth;
    const hidden = [...document.querySelectorAll("main *, footer *")].filter((el) => {
      const cs = getComputedStyle(el);
      // [data-qa-scroll-fade]: content that is meant to fade out once scrolled past (e.g. the hero)
      if (el.closest("[aria-hidden='true'], .preloader, #site-menu, [data-qa-scroll-fade]")) return false;
      return (cs.visibility === "hidden" || cs.opacity === "0") && el.textContent?.trim() && el.getBoundingClientRect().height > 0;
    }).length;
    return { overflow, hidden };
  });
}

for (const route of routes) {
  const slug = route === "/" ? "home" : route.replace(/\//g, "_").replace(/^_/, "");
  for (const w of widths) {
    const ctx = await browser.newContext({ viewport: { width: w, height: w < 768 ? 844 : w < 1200 ? 1024 : 900 }, deviceScaleFactor: 1 });
    await ctx.addInitScript(() => sessionStorage.setItem("hv-visited", "1"));
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    await page.goto(base + route, { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${out}/${slug}-${w}-top.png` });
    await scrollThrough(page);
    const a = await audit(page);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${out}/${slug}-${w}-full.png`, fullPage: true });
    console.log(`${route} @${w}: overflow=${a.overflow}px hiddenText=${a.hidden} errors=${errors.length}${errors.length ? " → " + errors.slice(0, 3).join(" | ") : ""}`);
    await ctx.close();
  }
  for (const mode of ["reduced", "nojs"]) {
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: mode === "reduced" ? "reduce" : "no-preference",
      javaScriptEnabled: mode !== "nojs",
    });
    const page = await ctx.newPage();
    await page.goto(base + route, { waitUntil: "load" });
    await page.waitForTimeout(800);
    if (mode !== "nojs") await scrollThrough(page);
    const a = await audit(page);
    await page.screenshot({ path: `${out}/${slug}-${mode}.png`, fullPage: true });
    console.log(`${route} [${mode}]: overflow=${a.overflow}px hiddenText=${a.hidden}`);
    await ctx.close();
  }
}
await browser.close();
