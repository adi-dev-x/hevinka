"use client";

import { clsx } from "clsx";
import {
  Bell, ChartColumn, FileText, Headset, LayoutDashboard, ListChecks, MessagesSquare, Settings, ShoppingCart, TrendingDown,
  TrendingUp, Users, Workflow,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { LogoMark } from "@/components/ui/Logo";

// Illustrative product UI (brochure p.8). Values are the brochure mock-up's own sample figures —
// they depict the interface, not company results.

const W = 1000;
const H = 625;

const KPIS = [
  { label: "Total Leads", value: 1320, delta: "+12%", up: true },
  { label: "Total Customers", value: 840, delta: "+8%", up: true },
  { label: "Open Opportunities", value: 320, delta: "+5%", up: true },
  { label: "Open Tickets", value: 75, delta: "-7%", up: false },
];
const FUNNEL = [
  { label: "New Lead", value: 233 },
  { label: "Qualified Lead", value: 188 },
  { label: "Proposal Sent", value: 129 },
  { label: "Negotiation", value: 99 },
  { label: "Closed Won", value: 48 },
];
const DONUT = [
  { label: "Direct", pct: 35, color: "#0b5bd3" },
  { label: "Channel", pct: 25, color: "#00a8fc" },
  { label: "Online", pct: 20, color: "#60a8e4" },
  { label: "Other", pct: 20, color: "#9fb3d1" },
];
// Cumulative start offsets for the donut segments.
const DONUT_OFFSETS = DONUT.map((_, i) => DONUT.slice(0, i).reduce((a, d) => a + d.pct, 0));
const LINE = [22, 30, 27, 38, 34, 46, 43, 55, 50, 62, 58, 72];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
const ACTIVITY = [
  { icon: Users, text: "New lead added", time: "2 mins ago" },
  { icon: FileText, text: "Quote sent to client", time: "16 mins ago" },
  { icon: Headset, text: "Support ticket updated", time: "42 mins ago" },
  { icon: ListChecks, text: "Follow-up scheduled", time: "1 hour ago" },
  { icon: Workflow, text: "Approval workflow completed", time: "2 hours ago" },
  { icon: MessagesSquare, text: "WhatsApp message received", time: "3 hours ago" },
];
const MENU = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: ShoppingCart, label: "Sales" },
  { icon: Users, label: "Customers" },
  { icon: ChartColumn, label: "Sales Pipeline" },
  { icon: ListChecks, label: "Tasks" },
  { icon: MessagesSquare, label: "Communications" },
  { icon: Headset, label: "Support" },
  { icon: FileText, label: "Reports" },
  { icon: Settings, label: "Settings" },
];

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

function linePath(w: number, h: number) {
  const max = 80;
  return LINE.map((v, i) => `${i === 0 ? "M" : "L"}${((i / (LINE.length - 1)) * w).toFixed(1)} ${(h - (v / max) * h).toFixed(1)}`).join(" ");
}

/**
 * Live HTML dashboard rendered at a fixed 1000×625 design size and scaled to its container.
 * KPIs count up, the line draws, funnel fills, donut sweeps; the activity feed ticks while on screen.
 */
export function Dashboard({ className, animate = true, live = true }: { className?: string; animate?: boolean; live?: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [feed, setFeed] = useState(() => ACTIVITY.slice(0, 4).map((a, i) => ({ ...a, id: i })));
  const visible = useRef(false);

  // Scale the fixed-size UI to the container width.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ motion: "(prefers-reduced-motion: no-preference)", reduce: MQ.reduce }, (c) => {
        gsap.timeline({
          scrollTrigger: {
            trigger: box.current,
            start: "top bottom",
            end: "bottom top",
            onToggle: (self) => void (visible.current = self.isActive),
          },
        });
        if (c.conditions?.reduce || !animate) return;
        const tl = gsap.timeline({ scrollTrigger: { trigger: box.current, start: "top 75%", toggleActions: "play none none none" } });
        tl.from(".db-kpi", { y: 16, autoAlpha: 0, duration: 0.6, stagger: 0.07 });
        gsap.utils.toArray<HTMLElement>(".db-num").forEach((el) => {
          const to = Number(el.dataset.value);
          const o = { v: 0 };
          tl.to(o, { v: to, duration: 1.4, ease: "power3.out", onUpdate: () => void (el.textContent = fmt(o.v)) }, 0.15);
        });
        tl.from(".db-line", { drawSVG: "0%", duration: 1.6, ease: "power2.inOut" }, 0.3)
          .from(".db-area", { autoAlpha: 0, duration: 1 }, 0.9)
          .from(".db-funnel", { scaleX: 0, transformOrigin: "50% 50%", duration: 0.8, stagger: 0.08 }, 0.35)
          .from(".db-seg", { drawSVG: "0%", duration: 1.1, stagger: 0.12, ease: "power2.inOut" }, 0.5)
          .from(".db-act", { x: 20, autoAlpha: 0, duration: 0.5, stagger: 0.08 }, 0.6);
      });
    },
    { scope: root, dependencies: [animate] },
  );

  // Live activity ticker — only while on screen, never for reduced motion.
  useEffect(() => {
    if (!live || window.matchMedia(MQ.reduce).matches) return;
    let n = 4;
    const id = setInterval(() => {
      if (!visible.current) return;
      const next = ACTIVITY[n % ACTIVITY.length];
      setFeed((f) => [{ ...next, time: "Just now", id: n }, ...f.slice(0, 3).map((x, i) => (i === 0 ? { ...x, time: "1 min ago" } : x))]);
      n++;
    }, 3200);
    return () => clearInterval(id);
  }, [live]);

  useEffect(() => {
    const first = root.current?.querySelector(".db-feed > li");
    if (first && feed[0]?.time === "Just now") gsap.fromTo(first, { y: -14, autoAlpha: 0, backgroundColor: "rgba(0,168,252,0.12)" }, { y: 0, autoAlpha: 1, backgroundColor: "rgba(0,168,252,0)", duration: 0.9, ease: "hevinka" });
  }, [feed]);

  const lp = linePath(380, 120);

  return (
    <div ref={box} className={clsx("relative w-full", className)} style={{ aspectRatio: `${W} / ${H}` }} role="img" aria-label="Illustrative dashboard: leads, customers, sales pipeline, revenue and recent activity">
      <div
        ref={root}
        aria-hidden
        className="absolute left-0 top-0 flex origin-top-left overflow-hidden bg-[#f6f9fd] font-sans text-ink"
        style={{ width: W, height: H, transform: `scale(${scale})`, visibility: scale ? "visible" : "hidden" }}
      >
        {/* sidebar */}
        <aside className="flex w-[176px] shrink-0 flex-col gap-1 bg-navy px-3 py-5 text-white">
          <div className="mb-5 flex items-center gap-2 px-2">
            <LogoMark tone="white" className="h-6 w-auto" />
            <span className="font-display text-[15px] font-bold tracking-wide">HEVINKA</span>
          </div>
          {MENU.map((m, i) => (
            <div key={m.label} className={clsx("flex items-center gap-2.5 rounded-lg px-3 py-2 text-[12px]", i === 0 ? "bg-royal text-white" : "text-white/70")}>
              <m.icon size={14} strokeWidth={1.75} />
              {m.label}
            </div>
          ))}
        </aside>

        <div className="flex flex-1 flex-col gap-3.5 p-5">
          {/* top bar */}
          <div className="flex items-center justify-between">
            <p className="font-display text-[18px] font-bold">Dashboard</p>
            <div className="flex items-center gap-3">
              <span className="rounded-md border border-ink/10 bg-white px-3 py-1.5 text-[11px] text-slate">Last 30 Days</span>
              <Bell size={16} strokeWidth={1.75} className="text-slate" />
              <span className="size-7 rounded-full [background:var(--grad-brand)]" />
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-4 gap-3">
            {KPIS.map((k) => (
              <div key={k.label} className="db-kpi rounded-xl bg-white p-3.5 shadow-[0_4px_18px_-8px_rgb(11_91_211/0.25)]">
                <p className="text-[11px] font-semibold text-slate">{k.label}</p>
                <p className="db-num mt-1.5 font-display text-[24px] font-bold" data-value={k.value}>
                  {fmt(k.value)}
                </p>
                <p className={clsx("mt-1 flex items-center gap-1 text-[11px] font-semibold", k.up ? "text-royal" : "text-slate")}>
                  {k.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {k.delta}
                </p>
              </div>
            ))}
          </div>

          {/* pipeline + revenue */}
          <div className="grid flex-1 grid-cols-[1fr_1.25fr] gap-3">
            <div className="rounded-xl bg-white p-4 shadow-[0_4px_18px_-8px_rgb(11_91_211/0.25)]">
              <p className="text-[12px] font-bold">Sales Pipeline</p>
              <div className="mt-3 flex flex-col gap-1.5">
                {FUNNEL.map((f, i) => (
                  <div key={f.label} className="flex items-center gap-3">
                    <div className="flex w-[52%] justify-center">
                      <span
                        className="db-funnel block h-[17px] rounded-[4px]"
                        style={{ width: `${100 - i * 15}%`, background: ["#0047a8", "#0b5bd3", "#3d7bff", "#00a8fc", "#60a8e4"][i] }}
                      />
                    </div>
                    <span className="flex-1 text-[10.5px] text-slate">{f.label}</span>
                    <span className="text-[11px] font-bold">{f.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-[0_4px_18px_-8px_rgb(11_91_211/0.25)]">
              <div className="flex items-center justify-between">
                <p className="text-[12px] font-bold">Revenue Overview</p>
                <span className="text-[10px] text-slate">This Year</span>
              </div>
              <svg viewBox="0 0 380 140" className="mt-2 w-full overflow-visible">
                <defs>
                  <linearGradient id="db-area" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="#00a8fc" stopOpacity="0.28" />
                    <stop offset="1" stopColor="#00a8fc" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[0, 1, 2, 3].map((g) => (
                  <line key={g} x1="0" x2="380" y1={g * 40} y2={g * 40} stroke="#0a1a33" strokeOpacity="0.06" />
                ))}
                <path className="db-area" d={`${lp} L380 120 L0 120 Z`} fill="url(#db-area)" />
                <path className="db-line" d={lp} fill="none" stroke="#0b5bd3" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
                {MONTHS.map((m, i) => (
                  <text key={m} x={(i / (MONTHS.length - 1)) * 370 + 5} y="138" fontSize="9" fill="#5b6b85" textAnchor="middle">
                    {m}
                  </text>
                ))}
              </svg>
            </div>
          </div>

          {/* distribution + activity */}
          <div className="grid grid-cols-[1fr_1.25fr] gap-3">
            <div className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-[0_4px_18px_-8px_rgb(11_91_211/0.25)]">
              <div className="relative size-[104px] shrink-0">
                <svg viewBox="0 0 42 42" className="size-full -rotate-90">
                  <circle cx="21" cy="21" r="15.9" fill="none" stroke="#e8eef7" strokeWidth="5" />
                  {DONUT.map((d, i) => (
                      <circle
                        key={d.label}
                        className="db-seg"
                        cx="21"
                        cy="21"
                        r="15.9"
                        fill="none"
                        stroke={d.color}
                        strokeWidth="5"
                        pathLength={100}
                        strokeDasharray={`${d.pct - 1} ${101 - d.pct}`}
                        strokeDashoffset={-DONUT_OFFSETS[i]}
                      />
                  ))}
                </svg>
                <div className="absolute inset-0 grid place-items-center text-center">
                  <p className="font-display text-[17px] font-bold leading-none">
                    860
                    <span className="block text-[9px] font-medium text-slate">Total</span>
                  </p>
                </div>
              </div>
              <div className="flex-1">
                <p className="mb-2 text-[12px] font-bold">Customer Distribution</p>
                {DONUT.map((d) => (
                  <p key={d.label} className="flex items-center gap-2 py-0.5 text-[10.5px] text-slate">
                    <span className="size-2 rounded-full" style={{ background: d.color }} />
                    <span className="flex-1">{d.label}</span>
                    <span className="font-semibold text-ink">{d.pct}%</span>
                  </p>
                ))}
              </div>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-[0_4px_18px_-8px_rgb(11_91_211/0.25)]">
              <div className="flex items-center justify-between">
                <p className="text-[12px] font-bold">Recent Activities</p>
                <span className="text-[10px] font-semibold text-royal">View All</span>
              </div>
              <ul className="db-feed mt-2 flex flex-col">
                {feed.map((a) => (
                  <li key={a.id} className="db-act flex items-center gap-2.5 rounded-md border-b border-ink/5 px-1 py-[5px] text-[11px] last:border-0">
                    <a.icon size={13} strokeWidth={1.75} className="text-royal" />
                    <span className="flex-1">{a.text}</span>
                    <span className="text-[10px] text-slate">{a.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
