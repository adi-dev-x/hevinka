"use client";
// Rendered once; GSAP owns the motion — React Compiler memoisation would only add bytes here.
"use no memo";

import { clsx } from "clsx";
import { useLayoutEffect, useRef, useState } from "react";
import { ecosystem } from "@/lib/content";
import { gsap, loadMotionPath, useGSAP, MQ } from "@/lib/gsap";
import { Section, Container } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { LogoMark } from "@/components/ui/Logo";

const LEFT = [0, 2, 4, 6];
const RIGHT = [1, 3, 5, 7];

type Wire = { d: string; i: number };

/**
 * §7 — Connected Business Ecosystem (brochure p.9). Desktop: 8 nodes around a glowing core, connectors
 * measured from the DOM, drawn with scroll; light pulses travel both ways; hovering a node isolates its path.
 * Mobile: two-column grid on a vertical spine.
 */
export function Ecosystem() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [wires, setWires] = useState<Wire[]>([]);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [hover, setHover] = useState<number | null>(null);

  // Measure node + core positions → connector paths.
  useLayoutEffect(() => {
    const el = stage.current;
    if (!el) return;
    const measure = () => {
      const s = el.getBoundingClientRect();
      const core = el.querySelector(".eco-core")!.getBoundingClientRect();
      const cx = core.left + core.width / 2 - s.left;
      const cy = core.top + core.height / 2 - s.top;
      const r = core.width / 2 + 6;
      const out: Wire[] = [];
      el.querySelectorAll<HTMLElement>(".eco-node").forEach((n) => {
        const i = Number(n.dataset.i);
        const b = n.getBoundingClientRect();
        const left = LEFT.includes(i);
        const x1 = (left ? b.right : b.left) - s.left + (left ? 6 : -6);
        const y1 = b.top + b.height / 2 - s.top;
        const ang = Math.atan2(y1 - cy, x1 - cx);
        const x2 = cx + r * Math.cos(ang);
        const y2 = cy + r * Math.sin(ang);
        const dx = (x2 - x1) * 0.55;
        out.push({
          i,
          d: `M${x1.toFixed(1)} ${y1.toFixed(1)} C${(x1 + dx).toFixed(1)} ${y1.toFixed(1)} ${(x2 - dx * 0.6).toFixed(1)} ${y2.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`,
        });
      });
      setBox({ w: s.width, h: s.height });
      setWires(out);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useGSAP(
    () => {
      if (!wires.length) return;
      const mm = gsap.matchMedia();
      mm.add(
        {
          desktop:
            "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
          motion: "(prefers-reduced-motion: no-preference)",
          reduce: MQ.reduce,
        },
        (c) => {
          if (c.conditions?.reduce) return;
          gsap.fromTo(
            ".eco-node",
            { autoAlpha: 0, y: 24 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.06,
              scrollTrigger: {
                trigger: stage.current,
                start: "top 75%",
                toggleActions: "play none none none",
              },
            },
          );
          gsap.fromTo(
            ".eco-core",
            { scale: 0.6, autoAlpha: 0 },
            {
              scale: 1,
              autoAlpha: 1,
              duration: 1.2,
              ease: "expo.out",
              scrollTrigger: {
                trigger: stage.current,
                start: "top 75%",
                toggleActions: "play none none none",
              },
            },
          );
          if (!c.conditions?.desktop) return;
          // Scroll-linked: connectors draw toward the core.
          gsap.fromTo(
            ".eco-wire",
            { drawSVG: "0%" },
            {
              drawSVG: "100%",
              ease: "none",
              stagger: 0.05,
              scrollTrigger: {
                trigger: stage.current,
                start: "top 70%",
                end: "center 50%",
                scrub: 0.6,
              },
            },
          );
          // Pulses both ways, only while on screen. MotionPath loads on demand.
          let dead = false;
          loadMotionPath().then(() => {
            if (dead) return;
            c.add(() => {
              const loops = gsap.utils
                .toArray<SVGCircleElement>(".eco-pulse")
                .map((dot, k) => {
                  const path = stage.current!.querySelector<SVGPathElement>(
                    `#eco-w-${dot.dataset.i}`,
                  )!;
                  const inbound = dot.dataset.dir === "in";
                  return gsap.fromTo(
                    dot,
                    { autoAlpha: 0 },
                    {
                      autoAlpha: 1,
                      motionPath: {
                        path,
                        align: path,
                        alignOrigin: [0.5, 0.5],
                        start: inbound ? 0 : 1,
                        end: inbound ? 1 : 0,
                      },
                      duration: 2.2,
                      ease: "power1.inOut",
                      repeat: -1,
                      repeatDelay: 0.8 + (k % 5) * 0.3,
                      delay: k * 0.25,
                      paused: true,
                    },
                  );
                });
              gsap.timeline({
                scrollTrigger: {
                  trigger: stage.current,
                  start: "top bottom",
                  end: "bottom top",
                  onToggle: (self) =>
                    loops.forEach((l) =>
                      self.isActive ? l.play() : l.pause(),
                    ),
                },
              });
            });
          });
          return () => {
            dead = true;
          };
        },
      );
    },
    { scope: root, dependencies: [wires.length], revertOnUpdate: true },
  );

  const node = (i: number) => {
    const n = ecosystem.nodes[i];
    const side = LEFT.includes(i) ? "left" : "right";
    return (
      <li
        key={n.title}
        data-i={i}
        className={clsx(
          "eco-node group/e relative flex flex-col items-center gap-3 rounded-card border bg-white/[0.04] p-4 text-center backdrop-blur-md transition-[filter,border-color,box-shadow] duration-500",
          "lg:flex-row lg:gap-4 lg:rounded-full lg:py-2.5 lg:pl-2.5 lg:pr-6 lg:text-left",
          side === "right" &&
            "lg:flex-row-reverse lg:pl-6 lg:pr-2.5 lg:text-right",
          hover === i
            ? "border-electric shadow-[0_0_40px_-6px_rgb(0_168_252/0.55)]"
            : "border-white/12",
          hover !== null && hover !== i && "lg:brightness-50",
        )}
        onPointerEnter={() => setHover(i)}
        onPointerLeave={() => setHover(null)}
        tabIndex={0}
        onFocus={() => setHover(i)}
        onBlur={() => setHover(null)}
      >
        <span className="grid size-12 shrink-0 place-items-center rounded-full text-white lg:size-14 shadow-[0_0_24px_rgb(0_168_252/0.35)] [background:var(--grad-brand)]">
          <Icon name={n.icon} size={24} />
        </span>
        <span className="font-display text-sm font-semibold leading-tight lg:text-[0.95rem]">
          {n.title}
        </span>
      </li>
    );
  };

  return (
    <Section
      ref={root}
      tone="night"
      cut="right"
      morph
      label="Ecosystem"
      className="overflow-hidden pb-28 md:pb-40"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/world-dots.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute -right-[12%] top-[6%] w-[70%] max-w-none opacity-30"
      />
      <Container className="relative">
        <SectionHeading
          eyebrow="Integration"
          title={ecosystem.title}
          intro={ecosystem.intro}
          introClassName="text-white/80"
        />

        <div ref={stage} className="relative mt-16 md:mt-20">
          {/* connectors (desktop) */}
          {box.w > 0 && (
            <svg
              className="pointer-events-none absolute inset-0 hidden lg:block"
              width={box.w}
              height={box.h}
              viewBox={`0 0 ${box.w} ${box.h}`}
              aria-hidden
              fill="none"
            >
              <defs>
                <linearGradient id="eco-g" x1="0" x2="1">
                  <stop offset="0" stopColor="#00a8fc" />
                  <stop offset="1" stopColor="#7fe3ff" />
                </linearGradient>
                <radialGradient id="eco-p">
                  <stop offset="0" stopColor="#fff" />
                  <stop offset="0.4" stopColor="#7fe3ff" />
                  <stop offset="1" stopColor="#00a8fc" stopOpacity="0" />
                </radialGradient>
              </defs>
              {wires.map((w) => (
                <path
                  key={w.i}
                  id={`eco-w-${w.i}`}
                  className="eco-wire transition-opacity duration-500"
                  d={w.d}
                  stroke="url(#eco-g)"
                  strokeWidth={hover === w.i ? 2.5 : 1.5}
                  strokeLinecap="round"
                  opacity={hover === null ? 0.7 : hover === w.i ? 1 : 0.12}
                />
              ))}
              {wires.flatMap((w) =>
                ["in", "out"].map((dir) => (
                  <circle
                    key={`${w.i}${dir}`}
                    className="eco-pulse"
                    data-i={w.i}
                    data-dir={dir}
                    r={5}
                    fill="url(#eco-p)"
                    opacity={0}
                  />
                )),
              )}
            </svg>
          )}

          <div className="relative grid items-center gap-6 lg:grid-cols-[1fr_auto_1fr] lg:gap-24">
            {/* mobile spine */}
            <span
              aria-hidden
              className="absolute bottom-0 left-1/2 top-40 w-px -translate-x-1/2 bg-gradient-to-b from-electric/60 to-transparent lg:hidden"
            />
            <ul className="order-2 grid grid-cols-2 gap-4 lg:order-1 lg:grid-cols-1 lg:gap-7">
              {LEFT.map(node)}
            </ul>

            <div className="order-1 mx-auto lg:order-2">
              <div className="eco-core relative grid size-40 place-items-center rounded-full bg-abyss shadow-[0_0_90px_rgb(0_168_252/0.45),inset_0_0_40px_rgb(0_168_252/0.25)] ring-1 ring-electric/50 md:size-56">
                <span
                  aria-hidden
                  className="eco-spin absolute -inset-3 rounded-full [background:conic-gradient(from_0deg,transparent_0deg,#00a8fc_60deg,transparent_120deg,transparent_360deg)] [mask:radial-gradient(farthest-side,transparent_calc(100%-2px),#000_calc(100%-1px))]"
                />
                <span
                  aria-hidden
                  className="absolute -inset-8 rounded-full border border-dashed border-electric/20"
                />
                <LogoMark
                  tone="gradient"
                  className="h-16 w-auto drop-shadow-[0_0_20px_rgba(0,168,252,0.7)] md:h-20"
                  title="HEVINKA"
                />
              </div>
            </div>

            <ul className="order-3 grid grid-cols-2 gap-4 lg:grid-cols-1 lg:gap-7">
              {RIGHT.map(node)}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}
