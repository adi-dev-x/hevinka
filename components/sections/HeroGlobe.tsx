"use client";
// Rendered once; GSAP owns the motion — React Compiler memoisation would only add bytes here.
"use no memo";

import dynamic from "next/dynamic";
import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { company, globalSolutions } from "@/lib/content";
import { gsap, ScrollTrigger, useGSAP, MQ } from "@/lib/gsap";
import { onSiteReady } from "@/lib/ready";
import posterHubs from "@/lib/globe-poster.json";
import { createGlobeController, GLOBE_BG, POSTER_SCALE, setPointer, updateController } from "@/components/three/controller";
import { Button } from "@/components/ui/Button";
import { BrandBar, LabelStack } from "@/components/ui/Brand";
import { Icon } from "@/components/ui/Icon";
import { Marquee } from "@/components/motion/Marquee";
import { SplitHeading, Accent } from "@/components/motion/SplitHeading";
import { Reveal } from "@/components/motion/Reveal";

const GlobeCanvas = dynamic(() => import("@/components/three/GlobeCanvas"), { ssr: false });

const WORDS = company.tagline;
const noopSubscribe = () => () => {};
const isPosterMode = () => window.location.search.includes("globe-poster"); // INNOVATE. INTEGRATE. ELEVATE.
const HOME_HUBS = new Set(["kochi", "dubai"]);

function hasWebGL2() {
  try {
    return !!document.createElement("canvas").getContext("webgl2");
  } catch {
    return false;
  }
}

/**
 * Home §1 Hero + §4 Global Solutions, sharing one sticky WebGL stage:
 * the globe sits in the brochure's rounded-diagonal frame, the frame opens with scroll, the camera
 * dollies in and turns to Kochi, then the globe slides right to become the Global Solutions backdrop.
 */
export function HeroGlobe() {
  const wrap = useRef<HTMLDivElement>(null);
  const [ctrl] = useState(createGlobeController);
  const anchor = useRef<HTMLDivElement>(null);
  const visual = useRef<HTMLDivElement>(null);
  const canvasLayer = useRef<HTMLDivElement>(null);
  const poster = useRef<HTMLDivElement>(null);
  const kochiLabel = useRef<HTMLDivElement>(null);
  const dubaiLabel = useRef<HTMLDivElement>(null);
  const cycle = useRef<gsap.core.Timeline | null>(null);

  // null until WebGL should load; then carries the device class.
  const [globe, setGlobe] = useState<{ mobile: boolean } | null>(null);
  const [active, setActive] = useState(true);
  const [paused, setPaused] = useState(false);
  const posterMode = useSyncExternalStore(noopSubscribe, isPosterMode, () => false);

  // Wire the controller to the DOM.
  useEffect(() => {
    updateController(ctrl, { anchor: anchor.current, labels: { kochi: kochiLabel.current, dubai: dubaiLabel.current } });
  }, [ctrl]);

  // Lazy-load WebGL after the preloader/LCP, when idle. Reduced motion / no WebGL2 keep the poster.
  useEffect(() => {
    if (window.matchMedia(MQ.reduce).matches) return;
    let idle = 0;
    // The WebGL probe itself creates a GL context, so it also waits until after LCP.
    const go = () => {
      if (hasWebGL2()) setGlobe({ mobile: window.matchMedia("(max-width: 767px)").matches });
      else document.documentElement.classList.add("no-webgl");
    };
    const schedule = () => {
      if ("requestIdleCallback" in window) idle = window.requestIdleCallback(go, { timeout: 1800 });
      else idle = globalThis.setTimeout(go, 700) as unknown as number;
    };
    // Wait for the preloader handoff AND the window load event (poster painted = LCP done), then idle.
    const afterLoad = () => (document.readyState === "complete" ? schedule() : window.addEventListener("load", schedule, { once: true }));
    const off = onSiteReady(afterLoad);
    return () => {
      off();
      window.removeEventListener("load", schedule);
      if ("cancelIdleCallback" in window) window.cancelIdleCallback(idle);
    };
  }, []);

  // Render only while the stage is on screen.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Pointer → controller (normalised), and whether the cursor is over the globe.
  useEffect(() => {
    const move = (e: PointerEvent) => {
      const r = anchor.current?.getBoundingClientRect();
      const inside = !!r && Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2)) < r.width / 2;
      setPointer(ctrl, (e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1, inside);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [ctrl]);

  // Cross-fade poster → live canvas once the first frame is drawn and the intro has finished.
  useEffect(() => {
    let firstFrame = false;
    const reveal = () => {
      if (!firstFrame || ctrl.intro < 1) return;
      gsap.to(canvasLayer.current, { autoAlpha: 1, duration: 0.9, ease: "power2.out", onComplete: () => gsap.set(poster.current, { autoAlpha: 0 }) });
    };
    updateController(ctrl, {
      onFirstFrame: () => {
        firstFrame = true;
        reveal();
      },
    });
    const id = setInterval(reveal, 250);
    return () => clearInterval(id);
  }, [ctrl]);

  useGSAP(
    () => {
      if (!wrap.current) return; // poster-tooling mode renders no stage
      const html = document.documentElement;
      const firstVisit = html.classList.contains("preload");
      const mm = gsap.matchMedia();

      mm.add({ desktop: MQ.desktop, mobile: MQ.mobile, reduce: MQ.reduce }, (c) => {
        const { desktop, reduce } = c.conditions!;

        if (reduce) {
          updateController(ctrl, { intro: 1, paused: true });
          gsap.set(".hero-reveal", { autoAlpha: 1 });
          return;
        }

        // ---------- Intro (after the preloader hands off) ----------
        const intro = gsap.timeline({ paused: true, defaults: { ease: "hevinka" } });
        if (desktop && firstVisit) {
          intro
            .from(".hero-hole, .hero-ring", { scale: 0, duration: 1.5, ease: "expo.inOut" }, 0)
            .from(".hero-ring", { autoAlpha: 0, duration: 0.6 }, 0.4);
        }
        intro
          .to(ctrl, { intro: 1, duration: 2.2, ease: "power2.out" }, 0.35)
          .from(anchor.current, { scale: 0.86, duration: 2, ease: "expo.out" }, 0.3)
          .set(".hero-reveal", { autoAlpha: 1 }, 0.3)
          .from(".hero-label", { autoAlpha: 0, y: 14, duration: 0.8, stagger: 0.08 }, 0.4)
          .from(".hero-line", { yPercent: 110, duration: 1.2, stagger: 0.1 }, 0.45)
          .from(".hero-bar", { scaleX: 0, transformOrigin: "0% 50%", duration: 1 }, 0.95)
          .from(".hero-sub", { autoAlpha: 0, y: 24, duration: 0.9 }, 1.0)
          .from(".hero-cta", { autoAlpha: 0, y: 20, scale: 0.94, duration: 0.8, stagger: 0.08, ease: "back.out(1.6)" }, 1.15)
          .from(".hero-bottom", { autoAlpha: 0, y: 20, duration: 0.8 }, 1.3)
          // release the rise masks so the glow isn't clipped into a hard-edged band
          .set(".hero-mask", { overflow: "visible" }, 1.8)
          .add(() => cycle.current?.play(), 1.4);

        // ---------- Cycling glow on INNOVATE. / INTEGRATE. / ELEVATE. ----------
        const glows = gsap.utils.toArray<HTMLElement>(".hero-glow");
        const tl = gsap.timeline({ paused: true, repeat: -1 });
        glows.forEach((g) => {
          tl.fromTo(g, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.7, ease: "power2.out" })
            .to(g, { autoAlpha: 0, duration: 0.6, ease: "power2.in" }, "+=1.5");
        });
        cycle.current = tl;

        const offReady = onSiteReady(() => intro.play());

        // ---------- Scroll choreography ----------
        const scroll = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: wrap.current, start: "top top", end: "bottom bottom", scrub: 1, invalidateOnRefresh: true },
        });
        if (desktop) {
          scroll
            // 1 — frame opens to full bleed, camera dollies in, headline parallaxes away faster than the globe
            .to(".hero-hole, .hero-ring", { scale: 4.2, duration: 0.3 }, 0)
            .to(".hero-ring", { autoAlpha: 0, duration: 0.18 }, 0.04)
            .to(anchor.current, { x: () => -window.innerWidth * 0.2, y: () => -window.innerHeight * 0.03, scale: 1.22, duration: 0.3 }, 0)
            .to(".hero-content", { yPercent: -22, autoAlpha: 0, duration: 0.24 }, 0.04)
            .to(".hero-bottom, .hero-corner", { autoAlpha: 0, duration: 0.12 }, 0.06)
            // 2 — turn to Kochi, brighten its routes, label the hubs
            .to(ctrl, { focus: 1, arcBoost: 1, duration: 0.28 }, 0.18)
            .to(ctrl, { labelAlpha: 1, duration: 0.08 }, 0.26)
            .to(ctrl, { labelAlpha: 0, duration: 0.07 }, 0.56)
            // 3 — glide right and recede: backdrop for Global Solutions
            .to(anchor.current, { x: () => window.innerWidth * 0.06, y: 0, scale: 0.92, duration: 0.36 }, 0.44)
            .to(ctrl, { arcBoost: 0.35, duration: 0.2 }, 0.6)
            .to(visual.current, { opacity: 0.5, duration: 0.3 }, 0.55)
            .to(".hero-shade", { opacity: 1, duration: 0.3 }, 0.5);
        } else {
          scroll
            .to(".hero-content", { yPercent: -12, autoAlpha: 0, duration: 0.35 }, 0.05)
            .to(".hero-bottom", { autoAlpha: 0, duration: 0.15 }, 0.05)
            .to(ctrl, { focus: 1, arcBoost: 1, duration: 0.4 }, 0.05)
            .to(anchor.current, { x: () => -window.innerWidth * 0.18, y: () => window.innerHeight * 0.16, scale: 1.1, duration: 0.5 }, 0.1)
            .to(visual.current, { opacity: 0.32, duration: 0.4 }, 0.45);
        }

        // Loops only run while the hero is on screen.
        const loopST = ScrollTrigger.create({
          trigger: ".hero-section",
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            if (!cycle.current || ctrl.paused) return;
            if (self.isActive && intro.progress() === 1) cycle.current.play();
            else cycle.current.pause();
          },
        });

        return () => {
          offReady();
          loopST.kill();
          tl.kill();
          cycle.current = null;
        };
      });
    },
    { scope: wrap },
  );

  const togglePause = () => {
    const next = !paused;
    updateController(ctrl, { paused: next });
    if (next) cycle.current?.pause();
    else cycle.current?.play();
    setPaused(next);
  };

  const hubs = posterHubs as unknown as Record<string, [number, number]>;

  if (posterMode) return <PosterStudio />;

  return (
    <div ref={wrap} className="relative bg-navy">
      {/* ===== Sticky WebGL stage (takes no layout space) ===== */}
      <div className="sticky top-0 -mb-[100svh] h-svh overflow-hidden" aria-hidden>
        <div ref={visual} className="absolute inset-0 opacity-55 md:opacity-100">
          {/* Positioner (static CSS centring) → anchor (GSAP x/y/scale). Kept separate so GSAP never
              folds the CSS translate into its own x/y. The camera tracks the anchor's on-screen circle. */}
          <div className="absolute left-[80%] top-[24%] size-[118vw] -translate-x-1/2 -translate-y-1/2 md:left-[73vw] md:top-[56%] md:size-[min(82vh,54vw)]">
          <div ref={anchor} className="absolute inset-0">
            <div
              ref={poster}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ width: `${POSTER_SCALE * 100}%`, height: `${POSTER_SCALE * 100}%` }}
            >
              {/* Pre-optimised AVIF/WebP poster (LCP candidate) — plain <picture>, not next/image. */}
              <picture>
                <source srcSet="/images/globe-poster-800.avif 800w, /images/globe-poster-1400.avif 1400w" type="image/avif" sizes="(max-width: 767px) 190vw, 90vw" />
                <img
                  src="/images/globe-poster-1400.webp"
                  srcSet="/images/globe-poster-800.webp 800w, /images/globe-poster-1400.webp 1400w"
                  sizes="(max-width: 767px) 190vw, 90vw"
                  alt=""
                  width={1400}
                  height={1400}
                  fetchPriority="high"
                  decoding="async"
                  className="h-full w-full select-none"
                  draggable={false}
                />
              </picture>
              {/* Reduced-motion / no-WebGL fallback: soft CSS pulse on the hubs only */}
              {Object.entries(hubs).map(([key, [x, y]]) => (
                <span
                  key={key}
                  className="hub-pulse absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{ left: `${x}%`, top: `${y}%`, ["--s" as string]: HOME_HUBS.has(key) ? "14px" : "9px" }}
                />
              ))}
            </div>
          </div>
          </div>

          <div ref={canvasLayer} className="invisible absolute inset-0 opacity-0">
            {globe && <GlobeCanvas ctrl={ctrl} active={active} mobile={globe.mobile} />}
          </div>
        </div>

        {/* Brochure frame: everything outside the rounded diamond is masked by a giant shadow */}
        <div className="hero-hole pointer-events-none absolute left-[71vw] top-[52%] hidden size-[min(66vh,46vw)] -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[22%] shadow-[0_0_0_250vmax_#00142f] md:block" />
        <div className="hero-ring pointer-events-none absolute left-[71vw] top-[52%] hidden size-[min(66vh,46vw)] -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[22%] border-2 border-electric shadow-[0_0_40px_2px_rgb(0_168_252/0.55),inset_0_0_40px_rgb(0_168_252/0.25)] md:block" />

        {/* Depth & legibility overlays */}
        <div className="pointer-events-none absolute inset-0 [background:radial-gradient(70%_60%_at_15%_10%,rgb(11_58_128/0.55),transparent_70%)]" />
        <div className="hero-shade pointer-events-none absolute inset-0 opacity-0 [background:linear-gradient(90deg,#001c3d_0%,rgb(0_28_61/0.85)_40%,transparent_70%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy to-transparent" />

        {/* Hub labels — positioned every frame by the scene */}
        {(
          [
            [kochiLabel, "Kochi", "India"],
            [dubaiLabel, "Dubai", "UAE"],
          ] as const
        ).map(([ref, city, country]) => (
          <div key={city} ref={ref} className="pointer-events-none absolute left-0 top-0 opacity-0 will-change-transform">
            <div className="absolute bottom-3 left-0 -translate-x-1/2">
              <div className="glass flex items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-1.5">
                <span className="size-1.5 rounded-full bg-ion shadow-[0_0_10px_#7fe3ff]" />
                <span className="font-display text-sm font-semibold text-white">{city}</span>
                <span className="label !text-[10px] !tracking-[0.2em] text-haze">{country}</span>
              </div>
              <span className="mx-auto block h-5 w-px bg-gradient-to-b from-ion/80 to-transparent" />
            </div>
          </div>
        ))}
      </div>

      {/* ===== §1 Hero ===== */}
      <section className="hero-section relative z-10 flex h-svh min-h-[640px] flex-col" data-section="Home" data-qa-scroll-fade aria-labelledby="hero-title">
        <div className="hero-content mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-center px-5 pt-[var(--nav-h)] sm:px-8 lg:px-14">
          <LabelStack items={company.microLabels.peopleTech} className="hero-label hero-reveal reveal mb-8 text-white/75 md:mb-10" />
          <h1 id="hero-title" className="font-display text-[clamp(2.9rem,7.4vw,8rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.025em]">
            {WORDS.map((w) => (
              <span key={w} className="hero-mask block overflow-hidden pb-[0.04em]">
                <span className="hero-line relative block w-fit">
                  {w}
                  <span
                    aria-hidden
                    className="hero-glow invisible absolute inset-0 text-electric opacity-0 [text-shadow:0_0_24px_rgb(0_168_252/0.5)]"
                  >
                    {w}
                  </span>
                </span>
              </span>
            ))}
          </h1>
          <span className="hero-bar brand-bar mt-8" aria-hidden />
          <p className="hero-sub hero-reveal reveal mt-7 max-w-[34rem] text-base leading-relaxed text-white/85 sm:text-lg">
            Digital transformation &amp; business technology solutions — ERP, CRM, automation, logistics, asset rental, web &amp;
            digital.
          </p>
          <div className="mt-9 flex flex-wrap gap-3 sm:gap-4">
            <span className="hero-cta hero-reveal reveal">
              <Button href="/#solutions">Explore solutions</Button>
            </span>
            <span className="hero-cta hero-reveal reveal">
              <Button href="/contact" variant="ghost">
                Let&apos;s build what&apos;s next
              </Button>
            </span>
          </div>
        </div>

        <LabelStack
          items={company.microLabels.smarterTogether}
          className="hero-label hero-corner hero-reveal reveal absolute right-5 top-[calc(var(--nav-h)+2rem)] hidden text-right text-white/70 sm:right-8 lg:right-14 lg:block [&_span.block]:ml-auto"
        />

        {/* Keyword ticker + scroll indicator */}
        <div className="hero-bottom hero-reveal reveal relative">
          <div className="mx-auto flex max-w-[1440px] items-center gap-6 px-5 pb-6 sm:px-8 lg:px-14">
            <div className="hidden shrink-0 items-center gap-3 sm:flex" aria-hidden>
              <span className="relative block h-12 w-px overflow-hidden bg-white/15">
                <span className="scroll-dot absolute left-0 top-0 block h-4 w-px bg-ion" />
              </span>
              <span className="label !text-[10px] text-haze">Scroll</span>
            </div>
            <Marquee
              items={company.serviceKeywords}
              separator="|"
              speed={34}
              label="Service keywords"
              className="label min-w-0 flex-1 border-y border-white/10 py-3.5 text-[11px] text-white/75 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]"
            />
            <button
              type="button"
              onClick={togglePause}
              aria-pressed={paused}
              aria-label={paused ? "Play background animation" : "Pause background animation"}
              className="grid size-10 shrink-0 place-items-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-electric hover:text-white motion-reduce:hidden"
            >
              {paused ? <Play size={14} strokeWidth={1.5} /> : <Pause size={14} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </section>

      {/* Scroll room for the "turn to Kochi" beat (desktop only) */}
      <div className="hidden h-[80vh] md:block motion-reduce:hidden" aria-hidden />

      {/* ===== §4 Global Solutions for a Connected World (brochure p.3) ===== */}
      <GlobalSolutions />
    </div>
  );
}

/** Tooling only (`/?globe-poster`): renders a deterministic 1400² still for scripts/make-globe-poster.mjs. */
function PosterStudio() {
  const [ctrl] = useState(() => {
    const c = createGlobeController();
    updateController(c, { intro: 1, paused: true });
    return c;
  });
  const size = 1400;
  return (
    <div id="poster-studio" className="fixed left-0 top-0 z-[1000]" style={{ width: size, height: size, background: GLOBE_BG }}>
      <div
        ref={(el) => updateController(ctrl, { anchor: el })}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ width: size / POSTER_SCALE, height: size / POSTER_SCALE }}
      />
      <GlobeCanvas ctrl={ctrl} poster />
    </div>
  );
}

function GlobalSolutions() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>(".pillar").forEach((p, i) => {
          gsap.fromTo(
            p.querySelector(".pillar-pulse"),
            { scale: 1, autoAlpha: 0.9 },
            { scale: 1.9, autoAlpha: 0, duration: 1.4, delay: 0.25 + i * 0.12, ease: "power2.out", scrollTrigger: { trigger: p, start: "top 88%", toggleActions: "play none none none" } },
          );
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="global"
      data-section="Global"
      className="relative z-10 flex min-h-[110svh] items-center py-28 md:py-36"
      aria-labelledby="global-title"
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-14">
        <div className="max-w-[40rem]">
          <LabelStack items={company.microLabels.peopleTech} inline bar={false} className="mb-8 text-white/70" />
          <SplitHeading id="global-title" className="font-display text-[clamp(2.4rem,5vw,4.75rem)] font-extrabold uppercase leading-[0.98] tracking-[-0.02em]">
            {globalSolutions.title[0]}
            <br />
            <Accent>{globalSolutions.title[1]}</Accent>
          </SplitHeading>
          <BrandBar className="mt-7" />
          <Reveal as="p" className="mt-7 max-w-[32rem] text-lg leading-relaxed text-white/85" delay={0.15}>
            <strong className="font-semibold text-white">HEVINKA</strong>
            {globalSolutions.intro.replace(/^HEVINKA/, "")}
          </Reveal>
        </div>

        <Reveal as="ul" stagger={0.1} className="mt-16 grid max-w-[46rem] gap-x-10 gap-y-10 sm:grid-cols-2">
          {globalSolutions.pillars.map((p) => (
            <li key={p.title} className="pillar flex items-start gap-5">
              <span className="relative grid size-16 shrink-0 place-items-center rounded-full border border-electric/60 bg-midnight/60 text-ion shadow-[0_0_24px_rgb(0_168_252/0.35),inset_0_0_18px_rgb(0_168_252/0.25)] backdrop-blur-sm">
                <span aria-hidden className="pillar-pulse absolute inset-0 rounded-full border border-ion opacity-0" />
                <Icon name={p.icon} size={28} />
              </span>
              <p className="pt-2 font-display text-[1.05rem] font-semibold leading-snug text-white">{p.title}</p>
            </li>
          ))}
        </Reveal>

        <div className="mt-20 border-l-2 border-electric pl-4">
          <p className="label !text-[11px] text-electric">{company.tagline.join(" ")}</p>
          <p className="label mt-1 !text-[11px] text-white/80">{company.strapline}</p>
        </div>
      </div>
    </section>
  );
}
