"use client";
// Rendered once; GSAP owns the motion — React Compiler memoisation would only add bytes here.
"use no memo";

import { useRef } from "react";
import { company, cta } from "@/lib/content";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { Marquee } from "@/components/motion/Marquee";
import { Section } from "@/components/ui/Section";

/** §2 — two opposing rows of huge type; speed, direction and skew react to scroll velocity. */
export function VelocityMarquee() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ motion: "(prefers-reduced-motion: no-preference)", reduce: MQ.reduce }, (c) => {
        if (c.conditions?.reduce) return;
        // Entrance: rows slide in from opposite sides.
        gsap.from(".vm-row-a", { xPercent: -12, autoAlpha: 0, duration: 1.2, scrollTrigger: { trigger: root.current, start: "top 80%", toggleActions: "play none none none" } });
        gsap.from(".vm-row-b", { xPercent: 12, autoAlpha: 0, duration: 1.2, delay: 0.1, scrollTrigger: { trigger: root.current, start: "top 80%", toggleActions: "play none none none" } });
        // Scroll-linked drift in opposite directions on top of the velocity loop.
        gsap.fromTo(".vm-drift-a", { xPercent: 4 }, { xPercent: -6, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
        gsap.fromTo(".vm-drift-b", { xPercent: -6 }, { xPercent: 4, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
      });
    },
    { scope: root },
  );

  return (
    <Section ref={root} tone="abyss" cut="left" label="Connected" className="overflow-hidden pb-24 md:pb-32">
      <h2 className="sr-only">Connected systems. Smarter business.</h2>
      <div className="vm-drift-a">
        <Marquee
          items={["Connected systems", "Smarter business"]}
          separator="·"
          outline
          speed={40}
          label="Connected systems, smarter business"
          className="vm-row-a font-display text-[clamp(3.25rem,10vw,9.5rem)] font-extrabold uppercase leading-[1.05] tracking-[-0.02em]"
        />
      </div>
      <div className="vm-drift-b">
        <Marquee
          items={[...cta.values.map((v) => v.title), ...company.footprint]}
          separator="·"
          reverse
          speed={48}
          label="Innovate, integrate, elevate, grow together"
          className="vm-row-b font-display text-[clamp(3.25rem,10vw,9.5rem)] font-extrabold uppercase leading-[1.05] tracking-[-0.02em] text-white"
        />
      </div>
    </Section>
  );
}
