"use client";

import { clsx } from "clsx";
import { Cloud, Monitor, Server, Settings, Settings2, Smartphone, Tablet, Truck } from "lucide-react";
import { useRef } from "react";
import { solutions } from "@/lib/content";
import { hubArc } from "@/lib/geo";
import { gsap, loadMotionPath, useGSAP, MQ } from "@/lib/gsap";
import { Icon } from "@/components/ui/Icon";

// Decorative solution visuals (brochure p.12–15). Each animates on enter and loops only while visible.

function useVisible(root: React.RefObject<HTMLElement | SVGSVGElement | null>, build: (loops: gsap.core.Animation[]) => void) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const loops: gsap.core.Animation[] = [];
        build(loops);
        loops.forEach((l) => l.pause());
        gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            onToggle: (self) => loops.forEach((l) => (self.isActive ? l.play() : l.pause())),
          },
        });
      });
      mm.add(MQ.reduce, () => {});
    },
    { scope: root },
  );
}

/** Rental lifecycle ring — 12 segments around a gear; a highlight sweeps through the stages. */
export function RentalRing({ className }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const stages = solutions.find((s) => s.detail.visual === "rental-ring")!.detail.modules;
  const N = stages.length;
  useVisible(root, (loops) => {
    loops.push(gsap.to(".rr-spin", { rotation: 360, duration: 40, ease: "none", repeat: -1, transformOrigin: "50% 50%" }));
    const segs = gsap.utils.toArray<SVGPathElement>(".rr-seg", root.current);
    const tl = gsap.timeline({ repeat: -1 });
    segs.forEach((s) => tl.to(s, { fill: "#00a8fc", duration: 0.25 }).to(s, { fill: "rgba(11,91,211,0.55)", duration: 0.6 }, "+=0.3"));
    loops.push(tl);
  });
  const seg = (i: number) => {
    const a0 = (i / N) * Math.PI * 2 - Math.PI / 2 + 0.02;
    const a1 = ((i + 1) / N) * Math.PI * 2 - Math.PI / 2 - 0.02;
    const R = 46;
    const r = 30;
    const p = (rad: number, a: number) => `${50 + rad * Math.cos(a)} ${50 + rad * Math.sin(a)}`;
    return `M${p(R, a0)} A${R} ${R} 0 0 1 ${p(R, a1)} L${p(r, a1)} A${r} ${r} 0 0 0 ${p(r, a0)} Z`;
  };
  return (
    <div ref={root} className={clsx("relative grid place-items-center", className)} aria-hidden>
      <svg viewBox="0 0 100 100" className="w-full max-w-[440px]">
        {Array.from({ length: N }, (_, i) => (
          <path key={i} className="rr-seg" d={seg(i)} fill="rgba(11,91,211,0.55)" stroke="#001c3d" strokeWidth="0.4" />
        ))}
        <circle cx="50" cy="50" r="26" fill="#000e21" stroke="#00a8fc" strokeOpacity="0.5" strokeWidth="0.4" />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <span className="rr-spin grid size-[22%] place-items-center rounded-full text-ion">
          <Settings className="size-full" strokeWidth={1.2} />
        </span>
      </div>
      <p className="label absolute bottom-[3%] text-center !text-[10px] text-haze">Complete rental lifecycle</p>
    </div>
  );
}

/** Route map — dotted world, glowing routes, a truck travelling the network. */
export function RouteMap({ className }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const routes = [hubArc("kochi", "dubai", 0.35), hubArc("dubai", "riyadh", 0.4), hubArc("kochi", "singapore", 0.3), hubArc("dubai", "nairobi", 0.3)];
  useVisible(root, (loops) => {
    gsap.from(".rm-route", { drawSVG: "0%", duration: 1.6, stagger: 0.2, ease: "power2.inOut", scrollTrigger: { trigger: root.current, start: "top 80%", toggleActions: "play none none none" } });
    const path = root.current!.querySelector<SVGPathElement>(".rm-route")!;
    // A paused placeholder joins the visibility loop now; the real truck tween replaces it once MotionPath loads.
    const holder = gsap.timeline({ paused: true });
    loops.push(holder);
    loadMotionPath().then(() =>
      holder.add(gsap.to(root.current!.querySelector(".rm-truck"), { motionPath: { path, align: path, alignOrigin: [0.5, 0.5] }, duration: 5, ease: "power1.inOut", repeat: -1, yoyo: true })),
    );
  });
  return (
    <div ref={root} className={clsx("relative aspect-[300/170]", className)} aria-hidden>
      {/* Map image lives inside the SVG so the crop (Middle East → SE Asia) applies to both. */}
      <svg viewBox="560 110 300 170" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
        <image href="/brand/world-dots.svg" x="0" y="0" width="1000" height="500" opacity="0.75" />
        {routes.map((d, i) => (
          <path key={i} className="rm-route" d={d} fill="none" stroke="#7fe3ff" strokeWidth="1.2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        ))}
        <g className="rm-truck">
          <circle r="7" fill="#00a8fc" opacity="0.35" />
          <circle r="3.2" fill="#bff3ff" />
        </g>
      </svg>
      <div className="glass absolute bottom-[8%] left-[6%] flex items-center gap-3 rounded-full px-4 py-2">
        <Truck size={18} strokeWidth={1.5} className="text-ion" />
        <span className="label !text-[10px] text-white">Connected fleets. Smarter business.</span>
      </div>
    </div>
  );
}

/** API hub — central gateway with devices orbiting and pulses on the connectors. */
export function ApiHub({ className }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const devices = [Monitor, Server, Smartphone, Settings2, Tablet, Cloud];
  useVisible(root, (loops) => {
    gsap.from(".ah-dev", { scale: 0, duration: 0.7, stagger: 0.08, ease: "back.out(2)", scrollTrigger: { trigger: root.current, start: "top 80%", toggleActions: "play none none none" } });
    gsap.utils.toArray<HTMLElement>(".ah-pulse").forEach((p, i) =>
      loops.push(gsap.fromTo(p, { scaleY: 0, transformOrigin: "50% 100%" }, { scaleY: 1, duration: 1.2, repeat: -1, repeatDelay: 1.5, delay: i * 0.35, ease: "power2.inOut" })),
    );
    loops.push(gsap.to(".ah-ring", { rotation: 360, duration: 60, ease: "none", repeat: -1 }));
  });
  return (
    <div ref={root} className={clsx("relative mx-auto aspect-square w-full max-w-[440px]", className)} aria-hidden>
      <div className="ah-ring absolute inset-[6%] rounded-full border border-dashed border-electric/25" />
      {devices.map((D, i) => {
        const a = (i / devices.length) * Math.PI * 2 - Math.PI / 2;
        return (
          <div key={i} className="absolute left-1/2 top-1/2 h-[38%] w-px origin-top" style={{ transform: `rotate(${(a * 180) / Math.PI - 90}deg)` }}>
            <span className="absolute inset-0 bg-electric/25" />
            <span className="ah-pulse absolute inset-0 bg-gradient-to-t from-transparent via-ion to-transparent" />
            <span className="ah-dev absolute -bottom-6 left-1/2 grid size-12 -translate-x-1/2 place-items-center rounded-full border border-electric/60 bg-midnight text-ion shadow-[0_0_18px_rgb(0_168_252/0.35)]" style={{ rotate: `${-((a * 180) / Math.PI - 90)}deg` }}>
              <D size={20} strokeWidth={1.5} />
            </span>
          </div>
        );
      })}
      <div className="absolute left-1/2 top-1/2 grid size-[34%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-abyss shadow-[0_0_60px_rgb(0_168_252/0.5),inset_0_0_30px_rgb(0_168_252/0.3)] ring-2 ring-electric/70">
        <span className="font-display text-3xl font-extrabold text-white">API</span>
      </div>
      <p className="label absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap !text-[10px] text-haze">API Gateway &amp; Load Balancer</p>
    </div>
  );
}

/** Integrated Digital Growth Engine — six stages around a core, lighting up in sequence. */
export function GrowthEngine({ className }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const cycle = solutions.find((s) => s.detail.visual === "growth-engine")!.detail.cycle!;
  useVisible(root, (loops) => {
    const nodes = gsap.utils.toArray<HTMLElement>(".ge-node", root.current);
    const tl = gsap.timeline({ repeat: -1 });
    nodes.forEach((n) =>
      tl.to(n, { scale: 1.12, boxShadow: "0 0 34px rgba(0,168,252,0.75)", borderColor: "#7fe3ff", duration: 0.35 }).to(n, { scale: 1, boxShadow: "0 0 0 rgba(0,168,252,0)", borderColor: "rgba(0,168,252,0.5)", duration: 0.6 }, "+=0.45"),
    );
    loops.push(tl);
    loops.push(gsap.to(".ge-orbit", { rotation: 360, duration: 30, ease: "none", repeat: -1 }));
  });
  return (
    <div ref={root} className={clsx("relative mx-auto aspect-square w-full max-w-[460px]", className)} aria-hidden>
      <div className="ge-orbit absolute inset-[13%] rounded-full [background:conic-gradient(from_0deg,#00a8fc,transparent_25%,#0b5bd3_50%,transparent_75%,#00a8fc)] [mask:radial-gradient(farthest-side,transparent_calc(100%-4px),#000_calc(100%-3px))]" />
      {cycle.map((c, i) => {
        const a = (i / cycle.length) * Math.PI * 2 - Math.PI / 2;
        return (
          <div key={c.title} className="absolute flex w-[30%] -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center" style={{ left: `${50 + 37 * Math.cos(a)}%`, top: `${50 + 37 * Math.sin(a)}%` }}>
            <span className="ge-node grid size-14 place-items-center rounded-full border border-electric/50 bg-midnight text-ion">
              <Icon name={c.icon!} size={22} />
            </span>
            <span className="mt-1.5 font-display text-[11px] font-bold uppercase tracking-wider text-white">{c.title}</span>
          </div>
        );
      })}
      <div className="absolute left-1/2 top-1/2 w-[34%] -translate-x-1/2 -translate-y-1/2 text-center">
        <p className="font-display text-sm font-bold leading-tight text-white">Integrated Digital</p>
        <p className="font-display text-sm font-bold leading-tight text-electric">Growth Engine</p>
      </div>
    </div>
  );
}
