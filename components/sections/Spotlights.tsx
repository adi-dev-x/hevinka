"use client";
// Rendered once; GSAP owns the motion — React Compiler memoisation would only add bytes here.
"use no memo";

import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { getSolution, type Solution } from "@/lib/content";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { Section, Container } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Brand";
import { TransitionLink } from "@/components/motion/TransitionLink";
import {
  LazyApiHub as ApiHub,
  LazyDashboard as Dashboard,
  LazyGrowthEngine as GrowthEngine,
  LazyRentalRing as RentalRing,
  LazyRouteMap as RouteMap,
} from "@/components/visuals/lazy";

const SLUGS = [
  "erp-enterprise-solutions",
  "equipment-asset-rental-management",
  "logistics-fleet-transport-solutions",
  "custom-software-applications",
  "digital-growth-optimization",
] as const;
const ITEMS = SLUGS.map((s) => getSolution(s)!) as Solution[];

function Visual({ s }: { s: Solution }) {
  switch (s.detail.visual) {
    case "dashboard":
      return <Dashboard live={false} className="w-[88%] overflow-hidden rounded-lg shadow-[0_20px_60px_-20px_rgb(0_0_0/0.6)]" />;
    case "rental-ring":
      return <RentalRing className="w-[78%]" />;
    case "route-map":
      return <RouteMap className="w-full" />;
    case "api-hub":
      return <ApiHub className="w-[78%]" />;
    default:
      return <GrowthEngine className="w-[82%]" />;
  }
}

/**
 * §11 — Solution spotlights (brochure p.10–15). Desktop: sticky media in the rounded-diagonal frame;
 * as each story block enters, the media swaps with a diagonal wipe. Mobile: media inline per block.
 */
export function Spotlights() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const layers = gsap.utils.toArray<HTMLElement>(".sp-layer");
        let z = 10;
        let current = 0;
        gsap.set(layers, { autoAlpha: 0 });
        gsap.set(layers[0], { autoAlpha: 1, zIndex: z });
        const show = (i: number) => {
          if (i === current) return;
          const down = i > current;
          current = i;
          const el = layers[i];
          gsap.killTweensOf(el);
          gsap.set(el, { zIndex: ++z, autoAlpha: 1 });
          gsap.fromTo(
            el,
            { clipPath: down ? "polygon(0% 100%, 0% 100%, -30% 100%, -30% 100%)" : "polygon(100% 0%, 130% 0%, 130% 0%, 100% 0%)" },
            {
              clipPath: down ? "polygon(0% 0%, 130% 0%, 100% 100%, -30% 100%)" : "polygon(-30% 0%, 130% 0%, 130% 100%, 0% 100%)",
              duration: 1.1,
              ease: "expo.inOut",
              // Hide only what's underneath the *current* layer (an older wipe may finish after a newer one starts).
              onComplete: () => layers.forEach((l, k) => k !== current && gsap.set(l, { autoAlpha: 0 })),
            },
          );
          gsap.fromTo(el.firstElementChild, { scale: 1.12 }, { scale: 1, duration: 1.4, ease: "hevinka" });
        };
        gsap.utils.toArray<HTMLElement>(".sp-block").forEach((b, i) => {
          ScrollTrigger_create(b, () => show(i), () => show(Math.max(0, i - 1)));
          gsap.from(b.querySelectorAll(".sp-in"), { y: 30, autoAlpha: 0, duration: 0.8, stagger: 0.08, scrollTrigger: { trigger: b, start: "top 70%", toggleActions: "play none none none" } });
        });
        // Scroll-linked: the frame's glow edge drifts with progress.
        gsap.fromTo(".sp-frame-glow", { y: -24, x: 12 }, { y: 24, x: -12, ease: "none", scrollTrigger: { trigger: ".sp-list", start: "top center", end: "bottom center", scrub: true } });
      });
      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>(".sp-block").forEach((b) =>
          gsap.from(b.querySelectorAll(".sp-in, .sp-mobile-media"), { y: 30, autoAlpha: 0, duration: 0.8, stagger: 0.08, scrollTrigger: { trigger: b, start: "top 80%", toggleActions: "play none none none" } }),
        );
      });
      mm.add(MQ.reduce, () => {});

      function ScrollTrigger_create(el: HTMLElement, onEnter: () => void, onLeaveBack: () => void) {
        gsap.timeline({ scrollTrigger: { trigger: el, start: "top 55%", end: "bottom 55%", onEnter, onEnterBack: onEnter, onLeaveBack } });
      }
    },
    { scope: root },
  );

  return (
    <Section ref={root} tone="white" cut="right" label="Spotlights" className="pb-24 md:pb-36">
      <Container>
        <div className="max-w-2xl">
          <Eyebrow>Solution spotlights</Eyebrow>
          <p className="mt-4 font-display text-[clamp(1.6rem,3vw,2.5rem)] font-bold leading-tight text-ink">
            Built around the way <span className="text-royal">your business works.</span>
          </p>
        </div>

        <div className="mt-10 grid gap-16 lg:mt-4 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div className="sp-list">
            {ITEMS.map((s, i) => (
              <article key={s.slug} className="sp-block flex flex-col justify-center py-10 lg:min-h-[88vh] lg:py-0">
                <div className="sp-mobile-media relative mb-8 grid aspect-[4/3] place-items-center overflow-hidden rounded-frame [background:var(--grad-night)] lg:hidden">
                  <Visual s={s} />
                </div>
                <p className="sp-in label text-royal">
                  {s.number} — {s.detail.microLabel ?? s.short}
                </p>
                <h3 className="sp-in mt-4 font-display text-[clamp(2rem,3.4vw,3.25rem)] font-bold leading-[1.05] text-ink">
                  {s.titleParts[0]} <span className="block text-royal">{s.titleParts[1]}</span>
                </h3>
                <span className="sp-in brand-bar mt-6" />
                <p className="sp-in mt-6 max-w-lg text-lg leading-relaxed text-slate">{s.detail.intro[0]}</p>
                <ul className="sp-in mt-7 flex max-w-lg flex-wrap gap-2">
                  {s.detail.modules.slice(0, 4).map((m) => (
                    <li key={m.title} className="rounded-full border border-royal/20 bg-mist px-3.5 py-1.5 text-[13px] font-medium text-ink">
                      {m.title}
                    </li>
                  ))}
                </ul>
                <div className="sp-in mt-8">
                  <TransitionLink href={`/solutions/${s.slug}`} className="group/x inline-flex items-center gap-3 font-display text-sm font-semibold text-royal">
                    <span className="link-underline">Explore {s.title}</span>
                    <ArrowRight aria-hidden size={18} strokeWidth={1.5} className="transition-transform duration-500 ease-[var(--ease-expo)] group-hover/x:translate-x-1.5" />
                  </TransitionLink>
                </div>
                {i < ITEMS.length - 1 && <span aria-hidden className="mt-14 block h-px w-full bg-ink/10 lg:hidden" />}
              </article>
            ))}
          </div>

          {/* Sticky media frame (desktop) */}
          <div className="relative hidden lg:block" aria-hidden>
            <div className="sticky top-[calc(var(--nav-h)+4vh)] h-[min(78vh,720px)]">
              <span aria-hidden className="sp-frame-glow absolute -inset-3 rounded-[2.6rem] border-2 border-electric/40 [clip-path:polygon(14%_0,100%_0,100%_86%,86%_100%,0_100%,0_14%)]" />
              <div className="relative size-full overflow-hidden rounded-[2.2rem] shadow-[0_40px_80px_-30px_rgb(0_28_61/0.55)] [clip-path:polygon(14%_0,100%_0,100%_86%,86%_100%,0_100%,0_14%)] [background:var(--grad-night)]">
                {ITEMS.map((s) => (
                  <div key={s.slug} className="sp-layer absolute inset-0 grid place-items-center [background:var(--grad-night)]">
                    <div className="grid size-full place-items-center p-[6%]">
                      <Visual s={s} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
