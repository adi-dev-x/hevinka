// Quick Web Vitals probe: first-load JS (gz), lazy 3D chunk size, LCP element/time and CLS.
// node scripts/perf.mjs [url] — runs unthrottled and with 4× CPU + "Fast 4G"-ish network throttling.
import { chromium } from "playwright";
import { gzipSync } from "node:zlib";

const url = process.argv[2] ?? "http://localhost:3100/";
const browser = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });

for (const throttled of [false, true]) {
  const ctx = await browser.newContext({ viewport: throttled ? { width: 390, height: 844 } : { width: 1440, height: 900 } });
  await ctx.addInitScript(() => {
    sessionStorage.setItem("hv-visited", "1");
    window.__lcp = null; window.__cls = 0;
    new PerformanceObserver((l) => { const e = l.getEntries().at(-1); window.__lcp = { t: Math.round(e.startTime), el: e.element?.tagName + "." + (e.element?.className || "").toString().slice(0, 40) }; }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: "layout-shift", buffered: true });
  });
  const page = await ctx.newPage();
  if (throttled) {
    const cdp = await ctx.newCDPSession(page);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 60, downloadThroughput: (9 * 1024 * 1024) / 8, uploadThroughput: (3 * 1024 * 1024) / 8 });
  }
  let initial = 0, lazy = 0; const lazyFiles = [];
  let loaded = false;
  page.on("load", () => (loaded = true));
  page.on("response", async (r) => {
    const u = r.url();
    if (!u.includes("/_next/static/") || !u.endsWith(".js")) return;
    const gz = gzipSync(await r.body().catch(() => Buffer.alloc(0))).length;
    if (loaded) { lazy += gz; lazyFiles.push((gz / 1024).toFixed(1)); } else initial += gz;
  });
  await page.goto(url, { waitUntil: "load" });
  await page.waitForTimeout(throttled ? 9000 : 6000);
  const v = await page.evaluate(() => ({ lcp: window.__lcp, cls: +window.__cls.toFixed(4) }));
  console.log(`${throttled ? "mobile 4×CPU/fast-4G" : "desktop"}: LCP ${v.lcp?.t}ms (${v.lcp?.el}) · CLS ${v.cls} · JS at load ${(initial / 1024).toFixed(1)}KB gz · lazy after load ${(lazy / 1024).toFixed(1)}KB gz [${lazyFiles.join(", ")}]`);
  await ctx.close();
}
await browser.close();
