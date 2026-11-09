"use client";

import { useEffect, useRef, useState } from "react";
import { MotionGateContext, ScrollTrigger, type MotionGate } from "@/lib/gsap";

// Safety net for fast scrollers: once the visitor shows intent (scroll/pointer/touch/key), remaining
// gates open in document order during idle time. Untouched pages do no deferred setup work at all.
const queue: (() => void)[] = [];
let armed = false;
const INTENT = ["scroll", "wheel", "pointerdown", "touchstart", "keydown"] as const;
function drain() {
  const open = queue.shift();
  if (!open) return;
  open();
  if ("requestIdleCallback" in window) window.requestIdleCallback(drain, { timeout: 1500 });
  else setTimeout(drain, 200);
}
function arm() {
  if (armed) return;
  armed = true;
  const go = () => {
    INTENT.forEach((e) => window.removeEventListener(e, go));
    setTimeout(drain, 600);
  };
  INTENT.forEach((e) => window.addEventListener(e, go, { passive: true }));
}

/**
 * Defers animation setup for a non-pinned, below-the-fold section until it comes within a viewport
 * of the screen (or idle time reaches it). Pinned sections may only be deferred where they don't pin
 * (pass `media`): their pin spacing must exist from the start so page geometry stays stable.
 */
export function DeferMotion({ children, media }: { children: React.ReactNode; /** Only defer while this query matches (e.g. pinned sections on mobile, where they don't pin). */ media?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [gate] = useState<MotionGate>(() => {
    const subs = new Set<() => void>();
    const g: MotionGate = {
      open: false,
      subscribe: (cb) => {
        subs.add(cb);
        return () => void subs.delete(cb);
      },
      release: () => {
        if (g.open) return;
        g.open = true;
        subs.forEach((cb) => cb());
        subs.clear();
        // Triggers created late must still refresh in page order (pins above affect positions below).
        setTimeout(() => ScrollTrigger.sort(), 0);
      },
    };
    return g;
  });

  useEffect(() => {
    const release = gate.release;
    if (media && !window.matchMedia(media).matches) return release();
    const io = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && release(), { rootMargin: "100% 0px" });
    if (ref.current) io.observe(ref.current);
    queue.push(release);
    arm();
    return () => {
      io.disconnect();
      const i = queue.indexOf(release);
      if (i >= 0) queue.splice(i, 1);
    };
  }, [gate, media]);

  return (
    <MotionGateContext.Provider value={gate}>
      <div ref={ref}>{children}</div>
    </MotionGateContext.Provider>
  );
}
