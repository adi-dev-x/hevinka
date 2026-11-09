"use client";
// Rendered once per page; GSAP owns the motion — React Compiler memoisation would only add bytes here.
"use no memo";

import { clsx } from "clsx";
import { ChevronRight } from "lucide-react";
import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { onSiteReady } from "@/lib/ready";
import { Container } from "@/components/ui/Section";
import { LabelStack } from "@/components/ui/Brand";
import { TransitionLink } from "@/components/motion/TransitionLink";

export type Crumb = { label: string; href?: string };

/**
 * Inner-page hero (brochure cover language): night gradient, faint dotted world, breadcrumb,
 * masked two-tone H1, intro, optional media in the rounded-diagonal frame.
 * Entrance waits for the preloader; on scroll the copy lifts away faster than the map (parallax).
 */
export function PageHero({
  crumbs,
  title,
  intro,
  labels,
  media,
  children,
  className,
  label = "Intro",
}: {
  crumbs: Crumb[];
  /** [plain, accent] */
  title: readonly [string, string] | readonly string[];
  intro?: readonly string[] | string;
  labels?: readonly string[];
  /** Right-hand media, rendered inside the diagonal frame on desktop. */
  media?: React.ReactNode;
  /** Extra content under the intro (qualities, CTAs). */
  children?: React.ReactNode;
  className?: string;
  label?: string;
}) {
  const root = useRef<HTMLElement>(null);
  const paras = typeof intro === "string" ? [intro] : (intro ?? []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ motion: "(prefers-reduced-motion: no-preference)", reduce: MQ.reduce, desktop: "(min-width: 1024px)" }, (ctx) => {
        const { reduce, desktop } = ctx.conditions!;
        const q = gsap.utils.selector(root);
        gsap.set(q(".ph-in"), { autoAlpha: 0 });
        if (!reduce) gsap.set(q(".ph-bar"), { scaleX: 0, transformOrigin: "0% 50%" });
        let tl: gsap.core.Timeline | undefined;
        const off = onSiteReady(() =>
          ctx.add(() => {
            if (reduce) {
              tl = gsap.timeline().to(q(".ph-in"), { autoAlpha: 1, duration: 0.5, stagger: 0.05 });
              return;
            }
            tl = gsap
              .timeline({ defaults: { ease: "hevinka" } })
              .fromTo(q(".ph-crumbs"), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.7 })
              .fromTo(q(".ph-line > span"), { yPercent: 110 }, { yPercent: 0, duration: 1.2, stagger: 0.1 }, 0.05)
              .set(q(".ph-title"), { autoAlpha: 1 }, 0.05)
              .to(q(".ph-bar"), { scaleX: 1, duration: 0.9 }, 0.45)
              .fromTo(q(".ph-copy"), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08 }, 0.5)
              .fromTo(
                q(".ph-media"),
                { autoAlpha: 1, clipPath: "polygon(100% 0%, 130% 0%, 100% 100%, 100% 100%)" },
                { clipPath: "polygon(0% 0%, 130% 0%, 100% 100%, -30% 100%)", duration: 1.4, ease: "expo.inOut", clearProps: "clipPath" },
                0.2,
              )
              .fromTo(q(".ph-media-inner"), { scale: 1.15 }, { scale: 1, duration: 1.8 }, 0.2);
          }),
        );
        if (!reduce) {
          // Scroll-linked: copy lifts and fades faster than the map/media behind it.
          const st = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
          gsap.to(q(".ph-scroll"), { yPercent: desktop ? -18 : -8, autoAlpha: 0.15, ease: "none", scrollTrigger: st });
          gsap.to(q(".ph-map"), { yPercent: 12, ease: "none", scrollTrigger: st });
          if (desktop) gsap.to(q(".ph-media-wrap"), { yPercent: -8, ease: "none", scrollTrigger: st });
        }
        return () => {
          off();
          tl?.kill();
        };
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      data-section={label}
      data-qa-scroll-fade
      className={clsx("relative isolate overflow-hidden text-white [background:var(--grad-night)] [--accent:var(--color-electric)]", className)}
    >
      {/* dotted world + glows */}
      <div aria-hidden className="ph-map pointer-events-none absolute inset-x-0 -top-[10%] bottom-0 -z-10">
        <div className="absolute inset-0 bg-[url(/brand/world-dots.svg)] bg-[length:max(1400px,120%)_auto] bg-[position:60%_30%] bg-no-repeat opacity-[0.22]" />
        <span className="absolute -right-[10%] top-[5%] size-[55vw] rounded-full bg-royal/25 blur-[120px]" />
        <span className="absolute -left-[15%] bottom-[-20%] size-[45vw] rounded-full bg-electric/10 blur-[120px]" />
      </div>
      <span aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-b from-transparent to-abyss/60" />

      <Container className="relative grid min-h-[min(92svh,60rem)] items-center gap-14 pb-36 pt-32 md:pb-44 md:pt-40 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
        <div className="ph-scroll">
          <nav aria-label="Breadcrumb" className="ph-crumbs ph-in reveal">
            <ol className="label flex flex-wrap items-center gap-2 !text-[11px] text-haze">
              {crumbs.map((c, i) => (
                <li key={c.label} className="flex items-center gap-2">
                  {i > 0 && <ChevronRight aria-hidden size={12} strokeWidth={1.75} className="text-electric" />}
                  {c.href ? (
                    <TransitionLink href={c.href} className="link-underline transition-colors hover:text-white">
                      {c.label}
                    </TransitionLink>
                  ) : (
                    <span aria-current="page" className="text-white">
                      {c.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          {labels && <LabelStack items={labels} inline bar={false} className="ph-copy ph-in reveal mt-8 text-white/60" />}

          <h1
            className={clsx(
              "ph-title ph-in reveal mt-6 font-display font-extrabold uppercase leading-[1] tracking-[-0.025em]",
              // Long brochure headings (e.g. "Technology adapted to different business environments") step down a size.
              title.join(" ").length > 24 ? "text-[clamp(2.1rem,4.6vw,4.4rem)]" : "text-[clamp(2.5rem,6.4vw,5.75rem)]",
            )}
          >
            <span className="ph-line block overflow-hidden pb-[0.06em]">
              <span className="block">{title[0]}</span>
            </span>
            <span className="ph-line block overflow-hidden pb-[0.06em]">
              <span className="block text-electric">{title[1]}</span>
            </span>
          </h1>
          <span aria-hidden className="ph-bar brand-bar mt-7 block" />

          {paras.map((p, i) => (
            <p key={i} className={clsx("ph-copy ph-in reveal max-w-[38rem] leading-relaxed text-white/85", i === 0 ? "mt-7 text-lg" : "mt-4 text-base text-white/75")}>
              {p}
            </p>
          ))}
          {children && <div className="ph-copy ph-in reveal mt-10">{children}</div>}
        </div>

        {media && (
          <div className="ph-media-wrap relative">
            <div className="ph-media ph-in reveal relative overflow-hidden rounded-[2rem] frame-diag [background:radial-gradient(90%_90%_at_60%_30%,#0b3a80,#001c3d_55%,#000e21)]">
              <div className="ph-media-inner relative">{media}</div>
            </div>
            {/* electric edge on the frame's diagonals */}
            <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 size-full overflow-visible">
              <polyline points="0,18 18,0" fill="none" stroke="#00a8fc" strokeWidth="2" vectorEffect="non-scaling-stroke" className="drop-shadow-[0_0_6px_#00a8fc]" />
              <polyline points="100,82 82,100" fill="none" stroke="#00a8fc" strokeWidth="2" vectorEffect="non-scaling-stroke" className="drop-shadow-[0_0_6px_#00a8fc]" />
            </svg>
          </div>
        )}
      </Container>
    </section>
  );
}
