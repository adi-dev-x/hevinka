"use client";
// Rendered once; GSAP owns the motion — React Compiler memoisation would only add bytes here.
"use no memo";

import { clsx } from "clsx";
import { Settings } from "lucide-react";
import { useRef } from "react";
import type { Feature } from "@/lib/content";
import { gsap, useGSAP } from "@/lib/gsap";
import { Icon } from "@/components/ui/Icon";

const R = 46;
const r = 31;

function wedge(i: number, n: number) {
  const span = (Math.PI * 2) / n;
  const c = -Math.PI / 2 + i * span; // centre angle; i = 0 sits at 12 o'clock
  const a0 = c - span / 2 + 0.018;
  const a1 = c + span / 2 - 0.018;
  const p = (rad: number, a: number) => `${(50 + rad * Math.cos(a)).toFixed(3)} ${(50 + rad * Math.sin(a)).toFixed(3)}`;
  return `M${p(R, a0)} A${R} ${R} 0 0 1 ${p(R, a1)} L${p(r, a1)} A${r} ${r} 0 0 0 ${p(r, a0)} Z`;
}

/**
 * Rental lifecycle (brochure p.12) — desktop: pinned; scrolling turns the 12-segment ring so each stage
 * passes under the fixed glowing wedge at 12 o'clock, while the centre readout and the stage list follow.
 * Mobile / reduced motion: the ring idles (or stays still) above a plain list of stages.
 */
export function Lifecycle({ stages, intro }: { stages: Feature[]; intro?: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const N = stages.length;
  const step = 360 / N;

  useGSAP(
    () => {
      const el = root.current!;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        el.dataset.pinned = "";
        const items = q<HTMLElement>(".lc-item");
        const readouts = q<HTMLElement>(".lc-readout");
        gsap.set(readouts, { autoAlpha: 0 });
        gsap.set(readouts[0], { autoAlpha: 1 });
        let current = 0;
        const activate = (i: number) => {
          if (i === current) return;
          const prev = current;
          current = i;
          items.forEach((it, k) => it.classList.toggle("is-active", k === i));
          gsap.to(readouts[prev], { autoAlpha: 0, y: i > prev ? -16 : 16, duration: 0.35, overwrite: true });
          gsap.fromTo(readouts[i], { autoAlpha: 0, y: i > prev ? 16 : -16 }, { autoAlpha: 1, y: 0, duration: 0.5, overwrite: true });
        };
        items[0]?.classList.add("is-active");
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: q(".lc-stage")[0],
            start: "top top",
            end: () => `+=${window.innerHeight * 0.38 * N}`,
            pin: true,
            scrub: 0.6,
            snap: { snapTo: 1 / (N - 1), duration: { min: 0.2, max: 0.5 }, ease: "power2.inOut" },
            invalidateOnRefresh: true,
            onUpdate: (self) => activate(Math.round(self.progress * (N - 1))),
          },
        });
        tl.to(q(".lc-spin"), { rotation: -(N - 1) * step, svgOrigin: "50 50" }, 0).to(q(".lc-gear"), { rotation: (N - 1) * step * 0.5 }, 0);
        return () => {
          delete el.dataset.pinned;
          items.forEach((it) => it.classList.remove("is-active"));
        };
      });
      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.to(q(".lc-spin"), { rotation: -360, svgOrigin: "50 50", duration: 60, ease: "none", repeat: -1 });
        q<HTMLElement>(".lc-card").forEach((card) =>
          gsap.from(card, { y: 24, autoAlpha: 0, duration: 0.6, scrollTrigger: { trigger: card, start: "top 92%", toggleActions: "play none none none" } }),
        );
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="group/lc">
      <div className="lc-stage grid items-center gap-12 lg:min-h-svh lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-20">
        <div className="relative mx-auto aspect-square w-full max-w-[540px]">
          <svg viewBox="0 0 100 100" className="size-full overflow-visible" aria-hidden>
            <defs>
              <radialGradient id="lc-glow" cx="50%" cy="20%" r="60%">
                <stop offset="0" stopColor="#7fe3ff" />
                <stop offset="1" stopColor="#00a8fc" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="49" fill="none" stroke="#00a8fc" strokeOpacity="0.18" strokeWidth="0.3" strokeDasharray="0.6 1.4" />
            <g className="lc-spin">
              {stages.map((_, i) => (
                <path key={i} d={wedge(i, N)} fill="rgba(11,91,211,0.42)" stroke="#000e21" strokeWidth="0.35" />
              ))}
            </g>
            {/* fixed highlight at 12 o'clock — stages turn under it */}
            <path d={wedge(0, N)} fill="url(#lc-glow)" className="drop-shadow-[0_0_6px_#00a8fc] hidden group-data-[pinned]/lc:block" />
            <g className="lc-spin">
              {stages.map((_, i) => {
                const a = -Math.PI / 2 + (i * Math.PI * 2) / N;
                const x = 50 + 38.5 * Math.cos(a);
                const y = 50 + 38.5 * Math.sin(a);
                return (
                  <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="central" transform={`rotate(${i * step} ${x} ${y})`} className="fill-white font-mono text-[3.4px] font-medium">
                    {String(i + 1).padStart(2, "0")}
                  </text>
                );
              })}
            </g>
            <circle cx="50" cy="50" r="28" fill="#000e21" stroke="#00a8fc" strokeOpacity="0.45" strokeWidth="0.35" />
          </svg>

          {/* centre readout */}
          <div className="absolute inset-[24%] grid place-items-center rounded-full text-center">
            <span className="lc-gear pointer-events-none absolute inset-[18%] text-electric/10" aria-hidden>
              <Settings className="size-full" strokeWidth={0.8} />
            </span>
            <div className="relative grid w-full place-items-center">
              <p className="label !text-[10px] text-haze group-data-[pinned]/lc:hidden">Complete rental lifecycle</p>
              {stages.map((s, i) => (
                <div key={s.title} aria-hidden className="lc-readout col-start-1 row-start-1 hidden w-[78%] flex-col items-center group-data-[pinned]/lc:flex">
                  <span className="font-mono text-[11px] tracking-[0.2em] text-electric">
                    {String(i + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
                  </span>
                  <span className="mt-2 grid size-11 place-items-center rounded-full border border-electric/60 text-ion">
                    <Icon name={s.icon!} size={20} />
                  </span>
                  <p className="mt-2 font-display text-[0.95rem] font-bold leading-tight text-white">{s.title}</p>
                  <p className="mt-1.5 text-[11px] leading-snug text-white/70">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          {intro}
          {/* Stage list: titles only while pinned (the centre readout carries the text) */}
          <ol className="lc-cards mt-10 grid gap-3 sm:grid-cols-2 lg:mt-8 group-data-[pinned]/lc:grid-flow-col group-data-[pinned]/lc:grid-rows-6 group-data-[pinned]/lc:gap-x-8 group-data-[pinned]/lc:gap-y-0">
            {stages.map((s, i) => (
              <li
                key={s.title}
                className={clsx(
                  "lc-card lc-item flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4",
                  "group-data-[pinned]/lc:rounded-none group-data-[pinned]/lc:border-0 group-data-[pinned]/lc:border-b group-data-[pinned]/lc:border-white/10 group-data-[pinned]/lc:bg-transparent group-data-[pinned]/lc:px-0 group-data-[pinned]/lc:py-2.5",
                  "transition-[color,transform,opacity] duration-500 group-data-[pinned]/lc:opacity-60 [&.is-active]:translate-x-3 [&.is-active]:opacity-100",
                )}
              >
                <span className="w-6 shrink-0 pt-0.5 font-mono text-xs text-ion">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className="font-display text-[0.95rem] font-semibold leading-snug text-white group-data-[pinned]/lc:text-sm">{s.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/70 group-data-[pinned]/lc:sr-only">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
