// CPU profile of a page load (4× CPU throttle, 390px): top self/inclusive functions. node scripts/profile.mjs <url>
import { chromium } from "playwright";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
const p = await ctx.newPage();
const cdp = await ctx.newCDPSession(p);
await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
await cdp.send("Profiler.enable");
await cdp.send("Profiler.setSamplingInterval", { interval: 200 });
await cdp.send("Profiler.start");
await p.goto(process.argv[2], { waitUntil: "load" });
await p.waitForTimeout(5000);
const { profile } = await cdp.send("Profiler.stop");
const byId = new Map(profile.nodes.map((n) => [n.id, n]));
const self = new Map();
const dt = profile.timeDeltas;
profile.samples.forEach((id, i) => self.set(id, (self.get(id) ?? 0) + (dt[i] ?? 0)));
// inclusive time per function (name+url), via parent links
const parent = new Map();
profile.nodes.forEach((n) => (n.children ?? []).forEach((c) => parent.set(c, n.id)));
const incl = new Map();
for (const [id, t] of self) {
  const seen = new Set();
  for (let cur = id; cur != null; cur = parent.get(cur)) {
    const n = byId.get(cur);
    const k = `${n.callFrame.functionName || "(anon)"} ${n.callFrame.url.split("/").pop()}:${n.callFrame.lineNumber}`;
    if (seen.has(k)) continue;
    seen.add(k);
    incl.set(k, (incl.get(k) ?? 0) + t);
  }
}
const selfAgg = new Map();
for (const [id, t] of self) { const n = byId.get(id); const k = `${n.callFrame.functionName || "(anon)"} ${n.callFrame.url.split("/").pop()}`; selfAgg.set(k, (selfAgg.get(k) ?? 0) + t); }
console.log("TOP SELF");[...selfAgg].sort((a, b) => b[1] - a[1]).slice(0, 15).forEach(([k, t]) => console.log(Math.round(t / 1000), k));
console.log("TOP INCLUSIVE");[...incl].sort((a, b) => b[1] - a[1]).slice(0, 30).forEach(([k, t]) => console.log(Math.round(t / 1000), k));
await b.close();
