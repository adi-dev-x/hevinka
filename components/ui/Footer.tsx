"use client";

import { ArrowUp, Mail, MapPin, Phone } from "lucide-react";
import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { company, contact, nav, solutions } from "@/lib/content";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { scrollToTarget, useLenis } from "@/components/motion/SmoothScroll";
import { Logo } from "./Logo";
import { LabelStack } from "./Brand";

const YEAR = process.env.NEXT_PUBLIC_BUILD_YEAR;

export function Footer() {
  const root = useRef<HTMLElement>(null);
  const lenis = useLenis();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ motion: "(prefers-reduced-motion: no-preference)", reduce: MQ.reduce }, (ctx) => {
        // Back-to-top ring draws with page progress.
        gsap.fromTo(
          ".ft-ring",
          { drawSVG: "0%" },
          {
            drawSVG: "100%",
            ease: "none",
            scrollTrigger: { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: 0.3 },
          },
        );
        if (ctx.conditions?.reduce) return;
        // Giant wordmark rises letter by letter as the page bottoms out.
        gsap.from(".ft-letter", {
          yPercent: 105,
          ease: "none",
          stagger: 0.08,
          scrollTrigger: { trigger: ".ft-word", start: "top bottom", end: "bottom bottom", scrub: 0.6 },
        });
        gsap.from(".ft-col", {
          y: 30,
          autoAlpha: 0,
          duration: 0.8,
          stagger: 0.08,
          scrollTrigger: { trigger: root.current, start: "top 85%", toggleActions: "play none none none" },
        });
      });
    },
    { scope: root },
  );

  return (
    <footer
      ref={root}
      className="relative isolate -mt-[var(--cut)] overflow-hidden bg-abyss pt-[calc(var(--cut)+5rem)] text-white [clip-path:polygon(0_var(--cut),100%_0,100%_100%,0_100%)]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-60 [background:radial-gradient(60%_50%_at_80%_0%,rgb(11_91_211/0.25),transparent_70%)]"
      />
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_0.8fr_1.2fr]">
          <div className="ft-col flex flex-col gap-6">
            <Logo className="text-[15px]" />
            <p className="max-w-xs font-display text-lg leading-snug text-white/85">
              {company.strapline}
            </p>
            <LabelStack items={company.tagline} inline className="text-electric" bar={false} />
          </div>

          <nav aria-label="Solutions" className="ft-col">
            <p className="label mb-5 text-haze">Solutions</p>
            <ul className="flex flex-col gap-2.5 text-sm text-white/75">
              {solutions.map((s) => (
                <li key={s.slug}>
                  <TransitionLink href={`/solutions/${s.slug}`} className="link-underline hover:text-white">
                    {s.title}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company" className="ft-col">
            <p className="label mb-5 text-haze">Company</p>
            <ul className="flex flex-col gap-2.5 text-sm text-white/75">
              {nav.company.map((l) => (
                <li key={l.href}>
                  <TransitionLink href={l.href} className="link-underline hover:text-white">
                    {l.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ft-col">
            <p className="label mb-5 text-haze">Contact</p>
            <ul className="flex flex-col gap-4 text-sm text-white/75">
              <li className="flex gap-3">
                <Phone aria-hidden size={18} strokeWidth={1.5} className="mt-0.5 shrink-0 text-electric" />
                <span className="flex flex-col">
                  {contact.phones.map((p) => (
                    <a key={p.href} href={p.href} className="link-underline w-fit hover:text-white">
                      {p.display}
                    </a>
                  ))}
                </span>
              </li>
              <li className="flex gap-3">
                <Mail aria-hidden size={18} strokeWidth={1.5} className="mt-0.5 shrink-0 text-electric" />
                <a href={`mailto:${contact.email}`} className="link-underline hover:text-white">
                  {contact.email}
                </a>
              </li>
              <li className="flex gap-3">
                <MapPin aria-hidden size={18} strokeWidth={1.5} className="mt-0.5 shrink-0 text-electric" />
                <address className="not-italic leading-relaxed">
                  {contact.address.lines.map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                </address>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Giant wordmark */}
      <div className="ft-word mt-20 select-none overflow-hidden px-3" aria-hidden>
        <p className="flex justify-center font-display text-[min(23vw,22rem)] font-extrabold leading-[0.78] tracking-[-0.04em]">
          {"HEVINKA".split("").map((ch, i) => (
            <span key={i} className="inline-block overflow-hidden pb-[0.04em]">
              <span className="ft-letter inline-block bg-gradient-to-b from-white/20 via-sky/10 to-transparent bg-clip-text text-transparent">
                {ch}
              </span>
            </span>
          ))}
        </p>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-4 px-5 py-6 text-xs text-haze sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-14">
          <p>
            © {YEAR} {company.legalName}
          </p>
          <p className="label !text-[10px]">{company.footprint.join("  |  ")}</p>
          <button
            type="button"
            onClick={() => scrollToTarget(lenis, 0)}
            className="group/top relative grid size-12 place-items-center rounded-full text-white transition-colors hover:text-electric"
            aria-label="Back to top"
          >
            <svg viewBox="0 0 48 48" className="absolute inset-0 -rotate-90" aria-hidden>
              <circle cx="24" cy="24" r="22" fill="none" stroke="rgb(255 255 255 / 0.12)" strokeWidth="1.5" />
              <circle className="ft-ring" cx="24" cy="24" r="22" fill="none" stroke="#00a8fc" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <ArrowUp size={18} strokeWidth={1.5} aria-hidden className="transition-transform duration-500 ease-[var(--ease-expo)] group-hover/top:-translate-y-1" />
          </button>
        </div>
      </div>
    </footer>
  );
}
