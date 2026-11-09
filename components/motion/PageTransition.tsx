"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef } from "react";
import { gsap, ScrollTrigger, MQ } from "@/lib/gsap";
import { BLADE_PATHS, MARK_VIEWBOX } from "@/components/ui/Logo";
import { scrollToTarget, useLenis } from "./SmoothScroll";

type Navigate = (href: string) => void;
const TransitionContext = createContext<Navigate | null>(null);

/** Navigate with the diagonal navy wipe (falls back to router.push). */
export function useTransitionRouter(): Navigate {
  const nav = useContext(TransitionContext);
  const router = useRouter();
  return nav ?? ((href) => router.push(href));
}

/**
 * Diagonal page transitions: a skewed navy panel sweeps in from the right, the route changes
 * underneath, then it exits left. Same-page hashes smooth-scroll instead.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();
  const panel = useRef<HTMLDivElement>(null);
  const pending = useRef<{ hash: string } | null>(null);
  const busy = useRef(false);

  const navigate = useCallback<Navigate>(
    (href) => {
      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) {
        window.location.href = href;
        return;
      }
      if (url.pathname === window.location.pathname) {
        if (url.hash) scrollToTarget(lenis, url.hash);
        else scrollToTarget(lenis, 0);
        history.replaceState(null, "", url.pathname + url.hash);
        return;
      }
      if (busy.current) return;
      if (window.matchMedia(MQ.reduce).matches || !panel.current) {
        pending.current = { hash: url.hash };
        router.push(url.pathname + url.search);
        return;
      }
      busy.current = true;
      lenis?.stop();
      gsap
        .timeline()
        .set(panel.current, { autoAlpha: 1, xPercent: 105 })
        .to(panel.current, { xPercent: 0, duration: 0.7, ease: "expo.inOut" })
        .from(".pt-blade", { scaleY: 0, transformOrigin: "50% 100%", stagger: 0.06, duration: 0.45, ease: "expo.out" }, "-=0.3")
        .add(() => {
          pending.current = { hash: url.hash };
          router.push(url.pathname + url.search, { scroll: false });
        });
    },
    [lenis, router],
  );

  // Route committed → reset scroll, recalc triggers, reveal.
  useEffect(() => {
    const p = pending.current;
    if (!p) return;
    pending.current = null;
    window.scrollTo(0, 0);
    lenis?.scrollTo(0, { immediate: true, force: true });
    lenis?.start();
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      if (p.hash) scrollToTarget(lenis, p.hash, true);
      if (!busy.current || !panel.current) return;
      gsap
        .timeline({ onComplete: () => void (busy.current = false) })
        .to(panel.current, { xPercent: -105, duration: 0.8, ease: "expo.inOut", delay: 0.1 })
        .set(panel.current, { autoAlpha: 0 });
    });
  }, [pathname, lenis]);

  return (
    <TransitionContext.Provider value={navigate}>
      {children}
      <div
        ref={panel}
        aria-hidden
        className="pointer-events-none invisible fixed inset-y-0 -left-[20vw] z-[350] w-[140vw] -skew-x-12 overflow-hidden [background:var(--grad-night)]"
      >
        <span className="absolute inset-y-0 left-0 w-[3px] bg-electric shadow-[0_0_30px_#00a8fc]" />
        <span className="absolute inset-y-0 right-0 w-[3px] bg-electric shadow-[0_0_30px_#00a8fc]" />
        <div className="grid h-full skew-x-12 place-items-center">
          <svg viewBox={MARK_VIEWBOX} className="h-16 w-auto overflow-visible">
            {BLADE_PATHS.map((d, i) => (
              <path key={i} d={d} fill="#fff" className="pt-blade" />
            ))}
          </svg>
        </div>
      </div>
    </TransitionContext.Provider>
  );
}
