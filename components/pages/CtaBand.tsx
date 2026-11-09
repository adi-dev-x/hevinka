"use client";
// Rendered once per page; GSAP owns the motion — React Compiler memoisation would only add bytes here.
"use no memo";

import { clsx } from "clsx";
import { MessageCircle } from "lucide-react";
import { useRef } from "react";
import { contact, cta } from "@/lib/content";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { Section, Container } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

/**
 * Compact closing CTA for inner pages (brochure p.16 language). Scroll-linked: the words grow
 * from 0.86 → 1 as the band rises; values slide in after.
 */
export function CtaBand({ href = "/contact", label = "Start a project" }: { href?: string; label?: string }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".cb-word",
          { scale: 0.86, autoAlpha: 0.3, yPercent: 20 },
          { scale: 1, autoAlpha: 1, yPercent: 0, stagger: 0.06, ease: "none", scrollTrigger: { trigger: ".cb-words", start: "top 95%", end: "center 55%", scrub: 0.8 } },
        );
        gsap.from(".cb-in", { y: 24, autoAlpha: 0, duration: 0.7, stagger: 0.07, scrollTrigger: { trigger: ".cb-body", start: "top 88%", toggleActions: "play none none none" } });
      });
      mm.add(MQ.reduce, () => {});
    },
    { scope: root },
  );

  return (
    <Section ref={root} tone="night" cut="left" morph label="Let's build" className="overflow-hidden pb-36 md:pb-44">
      <span aria-hidden className="pointer-events-none absolute -right-[15%] top-[10%] size-[50vw] rounded-full bg-royal/25 blur-[120px]" />
      <Container className="relative">
        <h2
          aria-label={cta.title.join(" ")}
          className="cb-words font-display text-[clamp(3rem,9vw,8.5rem)] font-extrabold uppercase leading-[0.88] tracking-[-0.03em]"
        >
          {cta.title.map((w, i) => (
            <span key={w} aria-hidden className={clsx("cb-word mr-[0.22em] inline-block origin-bottom-left", cta.accent.includes(i) && "text-electric")}>
              {w}
            </span>
          ))}
        </h2>
        <div className="cb-body mt-12 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="cb-in max-w-[36rem] text-lg leading-relaxed text-white/85">{cta.body}</p>
            <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
              {cta.values.map((v) => (
                <li key={v.title} className="cb-in flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-full border border-electric/50 text-ion">
                    <Icon name={v.icon} size={18} />
                  </span>
                  <span className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-white">{v.title}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="cb-in flex flex-wrap gap-4">
            <Button href={href}>{label}</Button>
            <a
              href={contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-full border border-white/25 px-6 py-3.5 font-display text-sm font-semibold text-white transition-colors hover:border-electric"
            >
              <MessageCircle aria-hidden size={18} strokeWidth={1.5} className="text-ion" />
              WhatsApp us
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </div>
      </Container>
    </Section>
  );
}
