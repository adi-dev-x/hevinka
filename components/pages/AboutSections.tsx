"use client";
// Rendered once; GSAP owns the motion — React Compiler memoisation would only add bytes here.
"use no memo";

import { useRef } from "react";
import { company, globalSolutions } from "@/lib/content";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { Section, Container } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";

/**
 * Global mindset, local understanding (brochure p.3). Four pillars with ring pulses; the footprint
 * INDIA / UAE / BEYOND slides in from alternating sides as the section scrolls (scrubbed).
 */
export function GlobalMindset() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>(".gm-word").forEach((w, i) => {
          gsap.fromTo(w, { xPercent: i % 2 ? 18 : -18, autoAlpha: 0.15 }, { xPercent: 0, autoAlpha: 1, ease: "none", scrollTrigger: { trigger: ".gm-words", start: "top 95%", end: "center 55%", scrub: 0.6 } });
        });
        gsap.utils.toArray<HTMLElement>(".gm-pillar").forEach((p, i) => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: p, start: "top 88%", toggleActions: "play none none none" }, delay: i * 0.1 });
          tl.from(p, { y: 30, autoAlpha: 0, duration: 0.7 }).fromTo(p.querySelector(".gm-pulse"), { scale: 1, autoAlpha: 0.9 }, { scale: 1.9, autoAlpha: 0, duration: 1.4, ease: "power2.out" }, 0.2);
        });
      });
      mm.add(MQ.reduce, () => {});
    },
    { scope: root },
  );

  return (
    <Section ref={root} tone="night" cut="left" morph label="Global" className="overflow-hidden pb-32 md:pb-44">
      <Container>
        <div className="grid gap-16 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-20">
          <div>
            <SectionHeading eyebrow="Global mindset, local understanding" title={globalSolutions.title} intro={globalSolutions.intro} introClassName="text-white/80" />
            <ul className="mt-14 grid gap-8 sm:grid-cols-2">
              {globalSolutions.pillars.map((p) => (
                <li key={p.title} className="gm-pillar flex items-start gap-5">
                  <span className="relative grid size-14 shrink-0 place-items-center rounded-full border border-electric/60 bg-midnight/60 text-ion shadow-[0_0_24px_rgb(0_168_252/0.35)]">
                    <span aria-hidden className="gm-pulse absolute inset-0 rounded-full border border-ion opacity-0" />
                    <Icon name={p.icon} size={24} />
                  </span>
                  <p className="pt-1.5 font-display text-base font-semibold leading-snug text-white">{p.title}</p>
                </li>
              ))}
            </ul>
          </div>
          <p
            className="gm-words font-display text-[clamp(4rem,12vw,10rem)] font-extrabold uppercase leading-[0.86] tracking-[-0.035em] lg:text-right"
          >
            <span className="sr-only">{company.footprint.join(", ")}</span>
            {company.footprint.map((w, i) => (
              <span key={w} aria-hidden className={i === 2 ? "gm-word block text-transparent [-webkit-text-stroke:2px_#00a8fc]" : "gm-word block"}>
                {w}
              </span>
            ))}
          </p>
        </div>
      </Container>
    </Section>
  );
}
