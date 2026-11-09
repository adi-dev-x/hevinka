// Keyboard QA: skip link, visible focus on the first tab stops, menu opens with Enter, traps focus, closes with Esc.
// node scripts/keyboard.mjs [url]
import { chromium } from "playwright";
const url = process.argv[2] ?? "http://localhost:3100/";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.addInitScript(() => sessionStorage.setItem("hv-visited", "1"));
const p = await ctx.newPage();
await p.goto(url, { waitUntil: "networkidle" });
const focused = () => p.evaluate(() => { const a = document.activeElement; const cs = getComputedStyle(a); return `${a.tagName}${a.getAttribute("aria-label") ? `[${a.getAttribute("aria-label")}]` : ""} "${(a.textContent || "").trim().slice(0, 24)}" outline=${cs.outlineStyle !== "none" && cs.outlineWidth !== "0px"}`; });
const stops = [];
for (let i = 0; i < 6; i++) { await p.keyboard.press("Tab"); stops.push(await focused()); }
console.log("first tab stops:\n  " + stops.join("\n  "));
await p.focus("button[aria-label='Open menu']");
await p.keyboard.press("Enter");
await p.waitForTimeout(1200);
const inMenu = [];
for (let i = 0; i < 25; i++) { await p.keyboard.press("Tab"); inMenu.push(await p.evaluate(() => !!document.activeElement.closest("[role=dialog], #site-menu, .menu-overlay") || document.activeElement.getAttribute("aria-label") === "Close menu")); }
console.log("menu open, focus stayed inside for 25 tabs:", inMenu.every(Boolean));
await p.keyboard.press("Escape");
await p.waitForTimeout(900);
console.log("after Esc, focus on:", await focused(), "| menu toggle expanded:", await p.getAttribute("button[aria-controls]", "aria-expanded"));
await b.close();
