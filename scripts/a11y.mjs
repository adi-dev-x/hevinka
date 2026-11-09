// axe-core audit (WCAG 2.x A/AA) per route, after scrolling through so scroll-driven states settle.
// node scripts/a11y.mjs [baseUrl] [routes...]
import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";

const base = process.argv[2] ?? "http://localhost:3100";
const routes = process.argv.slice(3).length
  ? process.argv.slice(3)
  : ["/", "/about", "/approach", "/industries", "/contact", "/solutions/erp-enterprise-solutions", "/solutions/equipment-asset-rental-management", "/does-not-exist"];
const browser = await chromium.launch();
let total = 0;
for (const width of [1440, 390]) {
  const ctx = await browser.newContext({ viewport: { width, height: width < 768 ? 844 : 900 } });
  await ctx.addInitScript(() => sessionStorage.setItem("hv-visited", "1"));
  for (const r of routes) {
    const page = await ctx.newPage();
    await page.goto(base + r, { waitUntil: "networkidle" });
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.5) {
        window.scrollTo(0, y);
        await new Promise((res) => setTimeout(res, 120));
      }
      // Stay at the end: every section has arrived, so tints and reveals are in their settled state.
      window.scrollTo(0, document.documentElement.scrollHeight);
      await new Promise((res) => setTimeout(res, 1200));
    });
    const res = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    const bad = res.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    total += bad.length;
    console.log(`${r} @${width}: ${bad.length ? bad.map((v) => `${v.id}(${v.nodes.length}) ${v.nodes.slice(0, 2).map((n) => n.target.join(" ")).join(" | ")}`).join("; ") : "0 serious/critical"}${res.violations.length - bad.length ? ` · ${res.violations.length - bad.length} minor/moderate: ${res.violations.filter((v) => !bad.includes(v)).map((v) => v.id).join(",")}` : ""}`);
    await page.close();
  }
  await ctx.close();
}
await browser.close();
console.log(`TOTAL serious/critical: ${total}`);
