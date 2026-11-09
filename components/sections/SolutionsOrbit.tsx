"use client";
// Rendered once; GSAP owns the motion — React Compiler memoisation would only add bytes here.
"use no memo";

import { clsx } from "clsx";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { company, solutions, solutionsIntro } from "@/lib/content";
import { gsap, ScrollTrigger, useGSAP, MQ } from "@/lib/gsap";
import { Section, Container } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { LogoMark } from "@/components/ui/Logo";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { TiltCard } from "@/components/motion/TiltCard";
import { Reveal } from "@/components/motion/Reveal";
import { scrollToTarget, useLenis } from "@/components/motion/SmoothScroll";

const STEP = 360 / solutions.length; // 45°
const LAST = solutions.length - 1;

/**
 * §5 — Our Solutions (brochure p.7). Desktop: pinned orbit wheel — scrolling turns the ring, the solution
 * arriving at the 3 o'clock focus enlarges and the panel swaps to it (snaps per solution).
 * Mobile / reduced motion: no pin; snap carousel (mobile) or clickable dots (reduced).
 */
export function SolutionsOrbit() {
  const root = useRef<HTMLElement>(null);
  const st = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);
  const lenis = useLenis();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.desktop, () => {
        const nodes = gsap.utils.toArray<HTMLElement>(".orb-node-inner");
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: ".orb-stage",
            start: "top top",
            end: () => "+=" + window.innerHeight * 0.55 * LAST,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            snap: { snapTo: 1 / LAST, duration: { min: 0.2, max: 0.6 }, ease: "power2.inOut", delay: 0.05 },
            invalidateOnRefresh: true,
            onUpdate(self) {
              const i = Math.round(self.progress * LAST);
              setActive((a) => (a === i ? a : i));
              const ring = -self.progress * LAST * STEP;
              nodes.forEach((n, k) => {
                let d = Math.abs(((k * STEP + ring) % 360) + 360) % 360;
                if (d > 180) d = 360 - d;
                const near = Math.max(0, 1 - d / STEP);
                gsap.set(n, { scale: 1 + 0.45 * near, "--near": near });
              });
            },
          },
        });
        st.current = tl.scrollTrigger ?? null;
        tl.to(".orb-ring", { rotation: -LAST * STEP, duration: 1 }, 0).to(nodes, { rotation: LAST * STEP, duration: 1 }, 0);

        // Entrance: wheel scales up from the core, nodes pop in around it.
        gsap.from(".orb-wheel", { scale: 0.7, autoAlpha: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: root.current, start: "top 70%", toggleActions: "play none none none" } });
        gsap.from(".orb-node", { scale: 0, duration: 0.7, stagger: 0.06, ease: "back.out(1.8)", delay: 0.3, scrollTrigger: { trigger: root.current, start: "top 70%", toggleActions: "play none none none" } });

        return () => {
          st.current = null;
        };
      });
    },
    { scope: root },
  );

  // Panel content swap.
  useEffect(() => {
    if (window.matchMedia(MQ.reduce).matches) return;
    const els = root.current?.querySelectorAll(".orb-swap");
    if (els?.length) gsap.fromTo(els, { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.55, stagger: 0.05, ease: "hevinka", overwrite: true });
  }, [active]);

  const goTo = (i: number) => {
    const t = st.current;
    if (!t) return setActive(i);
    scrollToTarget(lenis, t.start + ((t.end - t.start) * i) / LAST);
  };

  const s = solutions[active];

  return (
    <>
      <Section ref={root} tone="navy" cut="left" morph id="solutions" label="Solutions" className="overflow-hidden">
        {/* ===== Desktop: pinned orbit ===== */}
        <div className="orb-stage relative hidden h-svh min-h-[640px] md:block">
          <div aria-hidden className="pointer-events-none absolute inset-0 [background:radial-gradient(55%_70%_at_18%_50%,rgb(11_91_211/0.35),transparent_70%)]" />

          {/* Wheel — centred off the left edge, focus at 3 o'clock pointing at the panel */}
          <div className="absolute left-[-6vw] top-1/2 size-[min(86vh,58vw)] -translate-y-1/2">
            <div className="orb-wheel relative size-full">
              {/* orbit rings */}
              <span aria-hidden className="absolute inset-[8%] rounded-full border border-electric/25" />
              <span aria-hidden className="absolute inset-[20%] rounded-full border border-dashed border-sky/25" />
              <span aria-hidden className="absolute inset-[31%] rounded-full border border-electric/15" />
              {/* focus marker */}
              <span aria-hidden className="absolute right-[2%] top-1/2 h-px w-[14%] -translate-y-1/2 bg-gradient-to-r from-transparent to-electric" />

              <div className="orb-ring absolute inset-[8%]">
                {solutions.map((sol, k) => {
                  const a = (k * STEP * Math.PI) / 180;
                  return (
                    <div
                      key={sol.slug}
                      className="orb-node absolute size-[17%]"
                      style={{ left: `${50 + 50 * Math.cos(a)}%`, top: `${50 + 50 * Math.sin(a)}%`, translate: "-50% -50%" }}
                    >
                      <TransitionLink
                        href={`/solutions/${sol.slug}`}
                        aria-label={sol.title}
                        tabIndex={-1}
                        className="orb-node-inner group/n relative grid size-full place-items-center rounded-full border border-electric/40 bg-midnight text-ion shadow-[0_0_calc(var(--near,0)*40px)_rgb(0_168_252/0.6)] transition-colors hover:border-ion"
                      >
                        <span aria-hidden className="absolute inset-[-10%] rounded-full border border-ion/60 opacity-[var(--near,0)]" />
                        <Icon name={sol.icon} className="size-[42%]" />
                        <span className="absolute -bottom-1 right-[-6%] grid size-[34%] place-items-center rounded-full bg-royal font-mono text-[10px] text-white">
                          {sol.number}
                        </span>
                      </TransitionLink>
                    </div>
                  );
                })}
              </div>

              {/* core */}
              <div className="absolute inset-[34%] grid place-items-center rounded-full bg-abyss shadow-[0_0_80px_rgb(0_168_252/0.35),inset_0_0_40px_rgb(0_168_252/0.25)] ring-2 ring-electric/60">
                <div className="flex flex-col items-center gap-2 text-center">
                  <LogoMark tone="white" className="h-[3.2vw] max-h-14 w-auto" />
                  <span className="font-display text-[1.3vw] font-bold tracking-wide xl:text-lg">HEVINKA</span>
                  <span className="label !text-[8px] !tracking-[0.24em] text-electric">{company.tagline.join(" ")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Panel */}
          <div className="absolute right-0 top-1/2 w-[46%] -translate-y-1/2 pr-8 lg:pr-14 xl:w-[44%]">
            <SectionHeading eyebrow="What we deliver" title={solutionsIntro.title} intro={solutionsIntro.intro} breakAccent={false} introClassName="text-white/80" />
            <div className="mt-12 min-h-[230px] border-t border-white/10 pt-8" aria-live="polite">
              <p className="orb-swap font-mono text-sm text-electric">
                {s.number} <span className="text-white/40">/ {String(solutions.length).padStart(2, "0")}</span>
              </p>
              <h3 key={s.slug} className="orb-swap mt-3 font-display text-[clamp(1.6rem,2.6vw,2.5rem)] font-bold leading-tight">
                {s.titleParts[0]} <span className="text-electric">{s.titleParts[1]}</span>
              </h3>
              <p className="orb-swap mt-4 max-w-md text-lg text-white/80">{s.short}</p>
              <div className="orb-swap mt-7">
                <TransitionLink
                  href={`/solutions/${s.slug}`}
                  className="group/x inline-flex items-center gap-3 font-display text-sm font-semibold text-white"
                >
                  <span className="link-underline">Explore {s.title}</span>
                  <ArrowRight aria-hidden size={18} strokeWidth={1.5} className="text-electric transition-transform duration-500 ease-[var(--ease-expo)] group-hover/x:translate-x-1.5" />
                </TransitionLink>
              </div>
            </div>
            {/* Progress dots — also keyboard navigation through the pinned steps */}
            <div className="mt-10 flex items-center gap-2.5" role="group" aria-label="Choose a solution">
              {solutions.map((sol, i) => (
                <button
                  key={sol.slug}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={sol.title}
                  aria-current={i === active ? "true" : undefined}
                  className={clsx(
                    "h-1.5 rounded-full transition-all duration-500 ease-[var(--ease-expo)]",
                    i === active ? "w-10 bg-electric" : "w-1.5 bg-white/25 hover:bg-white/60",
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ===== Mobile: heading + horizontal snap carousel ===== */}
        <div className="pb-24 md:hidden">
          <Container>
            <SectionHeading eyebrow="What we deliver" title={solutionsIntro.title} intro={solutionsIntro.intro} breakAccent={false} introClassName="text-white/80" />
          </Container>
          <ul className="mt-10 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none]" aria-label="Solutions">
            {solutions.map((sol) => (
              <li key={sol.slug} className="w-[78vw] max-w-80 shrink-0 snap-start">
                <TransitionLink
                  href={`/solutions/${sol.slug}`}
                  className="glass flex h-full flex-col gap-4 rounded-card p-6"
                >
                  <span className="grid size-14 place-items-center rounded-full border border-electric/50 text-ion shadow-[0_0_20px_rgb(0_168_252/0.3)]">
                    <Icon name={sol.icon} size={26} />
                  </span>
                  <span className="font-mono text-xs text-electric">{sol.number}</span>
                  <span className="h3">{sol.title}</span>
                  <span className="text-sm text-white/75">{sol.short}</span>
                  <span className="mt-auto inline-flex items-center gap-2 pt-2 text-sm font-semibold text-electric">
                    Explore <ArrowRight aria-hidden size={16} strokeWidth={1.5} />
                  </span>
                </TransitionLink>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <SolutionsGrid />
    </>
  );
}

/** Grid of all 8 solutions as tilt cards (desktop & tablet; mobile already has the carousel). */
function SolutionsGrid() {
  return (
    <Section tone="white" cut="right" morph className="hidden pb-28 md:block md:pb-36">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <p className="label text-royal">{String(solutions.length).padStart(2, "0")} connected solutions</p>
            <p className="mt-3 max-w-xl font-display text-2xl font-semibold leading-snug text-ink">{solutionsIntro.intro}</p>
          </Reveal>
        </div>
        <Reveal stagger={0.06} className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {solutions.map((sol) => (
            <TiltCard key={sol.slug} tone="light" className="rounded-card border border-ink/10 bg-mist transition-shadow duration-500 hover:shadow-card-light">
              <TransitionLink href={`/solutions/${sol.slug}`} className="group/c relative flex h-full flex-col gap-5 p-7">
                <span className="relative grid size-14 place-items-center rounded-full bg-royal/10 text-royal ring-1 ring-royal/20 transition-colors duration-500 group-hover/c:bg-royal group-hover/c:text-white">
                  <Icon name={sol.icon} size={26} />
                </span>
                <span className="font-mono text-xs text-royal">{sol.number}</span>
                <span className="h3 text-ink">{sol.title}</span>
                <span className="text-sm leading-relaxed text-slate">{sol.short}</span>
                <span className="mt-auto inline-flex items-center gap-2 pt-3 text-sm font-semibold text-royal">
                  Explore
                  <ArrowUpRight aria-hidden size={16} strokeWidth={1.75} className="transition-transform duration-500 ease-[var(--ease-expo)] group-hover/c:-translate-y-0.5 group-hover/c:translate-x-0.5" />
                </span>
              </TransitionLink>
            </TiltCard>
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}
