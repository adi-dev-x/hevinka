"use client";

import { usePathname } from "next/navigation";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/** Thin brand-gradient bar showing page scroll progress. */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      gsap.fromTo(
        ref.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: 0.3 },
        },
      );
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  return (
    <div
      ref={ref}
      aria-hidden
      className="fixed inset-x-0 top-0 z-[120] h-[2px] origin-left scale-x-0 [background:var(--grad-brand)]"
    />
  );
}
