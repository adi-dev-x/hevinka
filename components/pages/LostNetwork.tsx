"use client";
// Rendered once; GSAP owns the motion — React Compiler memoisation would only add bytes here.
"use no memo";

import { useRef } from "react";
import { nav } from "@/lib/content";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { Container } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { TransitionLink } from "@/components/motion/TransitionLink";

// Two hubs; the arc between them draws, falters and snaps — the gap sparks, then the halves pull apart.
const LEFT = "M60 190 Q150 40 240 120";
const RIGHT = "M300 132 Q380 60 440 190";

/** 404 — "Lost in the network". */
export function LostNetwork() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
        tl.from(".ln-hub", { scale: 0, transformOrigin: "50% 50%", duration: 0.6, stagger: 0.15, ease: "back.out(2)" })
          .from(".ln-arc", { drawSVG: "0%", duration: 1.1, stagger: 0.25 }, "-=0.2")
          .fromTo(".ln-spark", { scale: 0, autoAlpha: 0, transformOrigin: "50% 50%" }, { scale: 1, autoAlpha: 1, duration: 0.25, stagger: 0.05, ease: "back.out(3)" })
          .from(".ln-copy > *", { y: 30, autoAlpha: 0, duration: 0.8, stagger: 0.08, ease: "hevinka" }, "-=0.4");
        gsap.to(".ln-spark", { autoAlpha: 0.2, duration: 0.12, repeat: -1, yoyo: true, repeatDelay: 1.2, stagger: { each: 0.07, repeat: -1, yoyo: true }, delay: 3 });
        gsap.to(".ln-left", { x: -6, rotation: -2, duration: 2.4, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 2.4, svgOrigin: "60 190" });
        gsap.to(".ln-right", { x: 6, rotation: 2, duration: 2.4, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 2.4, svgOrigin: "440 190" });
      });
      mm.add(MQ.reduce, () => {});
    },
    { scope: root },
  );

  return (
    <section ref={root} data-section="404" className="relative isolate flex min-h-svh items-center overflow-hidden py-32 text-white [background:var(--grad-night)]">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[url(/brand/world-dots.svg)] bg-[length:max(1400px,120%)_auto] bg-center bg-no-repeat opacity-20" />
      <Container className="grid items-center gap-14 lg:grid-cols-2">
        <svg viewBox="0 0 500 240" className="w-full max-w-xl overflow-visible" aria-hidden>
          <g className="ln-left">
            <path className="ln-arc" d={LEFT} fill="none" stroke="#7fe3ff" strokeWidth="2.5" strokeLinecap="round" />
          </g>
          <g className="ln-right">
            <path className="ln-arc" d={RIGHT} fill="none" stroke="#7fe3ff" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.45" />
          </g>
          {[
            [262, 118, 4],
            [276, 136, 3],
            [258, 142, 2.5],
            [282, 112, 2],
          ].map(([x, y, r], i) => (
            <circle key={i} className="ln-spark" cx={x} cy={y} r={r} fill="#00a8fc" />
          ))}
          {[
            [60, 190],
            [440, 190],
          ].map(([x, y], i) => (
            <g key={i} className="ln-hub">
              <circle cx={x} cy={y} r="18" fill="#00a8fc" opacity="0.18" />
              <circle cx={x} cy={y} r="8" fill="#bff3ff" />
            </g>
          ))}
        </svg>
        <div className="ln-copy">
          <p className="font-mono text-sm tracking-[0.3em] text-electric">ERROR 404</p>
          <h1 className="mt-5 font-display text-[clamp(2.6rem,6vw,5.5rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.025em]">
            Lost in the <span className="text-electric">network</span>
          </h1>
          <span aria-hidden className="brand-bar mt-7 block" />
          <p className="mt-7 max-w-md text-lg leading-relaxed text-white/80">This connection didn&apos;t reach its destination. Let&apos;s route you back.</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button href="/">Back to home</Button>
            <Button href="/contact" variant="ghost" icon={false}>
              Contact us
            </Button>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-haze">
            {nav.primary.map((l) => (
              <li key={l.href}>
                <TransitionLink href={l.href} className="link-underline hover:text-white">
                  {l.label}
                </TransitionLink>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
