"use client";

import { clsx } from "clsx";
import { useId, useRef } from "react";
import { gsap, loadMotionPath, useGSAP, MQ } from "@/lib/gsap";

export type NetworkLine = {
  d: string;
  /** Light pulses travel this path. */ pulse?: boolean;
};
export type NetworkNode = { x: number; y: number; r?: number; hub?: boolean };

/**
 * Glowing network connectors: paths draw in (scrubbed or on enter), then light pulses travel along them.
 * Reduced motion: lines shown fully, no pulses.
 */
export function DrawLines({
  lines,
  nodes = [],
  viewBox,
  className,
  scrub = true,
  pulseDuration = 2.6,
  strokeWidth = 1.5,
  start = "top 80%",
  end = "center 45%",
}: {
  lines: NetworkLine[];
  nodes?: NetworkNode[];
  viewBox: string;
  className?: string;
  scrub?: boolean;
  pulseDuration?: number;
  strokeWidth?: number;
  start?: string;
  end?: string;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const gid = useId().replace(/:/g, "");

  useGSAP(
    () => {
      const svg = ref.current;
      if (!svg) return;
      const paths = gsap.utils.toArray<SVGPathElement>(".dl-line", svg);
      const nodeEls = gsap.utils.toArray<SVGGElement>(".dl-node", svg);
      const mm = gsap.matchMedia();
      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          reduce: MQ.reduce,
        },
        (ctx) => {
          if (ctx.conditions?.reduce) return;
          const tl = gsap.timeline({
            scrollTrigger: scrub
              ? { trigger: svg, start, end, scrub: 1 }
              : { trigger: svg, start, toggleActions: "play none none none" },
          });
          tl.from(paths, {
            drawSVG: "0%",
            duration: 1.2,
            stagger: 0.12,
            ease: scrub ? "none" : "power2.inOut",
          });
          tl.from(
            nodeEls,
            {
              scale: 0,
              transformOrigin: "50% 50%",
              duration: 0.5,
              stagger: 0.06,
              ease: "back.out(2)",
            },
            0.2,
          );

          // Continuous pulses along flagged paths (only while visible). MotionPath loads on demand.
          const pulses = gsap.utils.toArray<SVGCircleElement>(".dl-pulse", svg);
          if (!pulses.length) return;
          let dead = false;
          loadMotionPath().then(() => {
            if (dead) return;
            ctx.add(() => {
              const loops = pulses.map((dot, i) => {
                const path = svg.querySelector<SVGPathElement>(
                  `#${dot.dataset.path}`,
                );
                return gsap.to(dot, {
                  motionPath: {
                    path: path!,
                    align: path!,
                    alignOrigin: [0.5, 0.5],
                  },
                  duration: pulseDuration,
                  ease: "power1.inOut",
                  repeat: -1,
                  repeatDelay: 0.6,
                  delay: 0.4 * i,
                  paused: true,
                  onStart: () => gsap.set(dot, { autoAlpha: 1 }),
                });
              });
              gsap.timeline({
                scrollTrigger: {
                  trigger: svg,
                  start: "top bottom",
                  end: "bottom top",
                  onToggle: (self) =>
                    loops.forEach((l) =>
                      self.isActive ? l.play() : l.pause(),
                    ),
                },
              });
            });
          });
          return () => {
            dead = true;
          };
        },
      );
    },
    { scope: ref, dependencies: [lines.length] },
  );

  return (
    <svg
      ref={ref}
      viewBox={viewBox}
      className={clsx("overflow-visible", className)}
      aria-hidden="true"
      fill="none"
    >
      <defs>
        <linearGradient id={`dl-g${gid}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#00a8fc" />
          <stop offset="1" stopColor="#7fe3ff" />
        </linearGradient>
        <radialGradient id={`dl-p${gid}`}>
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.35" stopColor="#7fe3ff" />
          <stop offset="1" stopColor="#00a8fc" stopOpacity="0" />
        </radialGradient>
        <filter
          id={`dl-glow${gid}`}
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter={`url(#dl-glow${gid})`}>
        {lines.map((l, i) => (
          <path
            key={i}
            id={`dl${gid}-${i}`}
            className="dl-line"
            d={l.d}
            stroke={`url(#dl-g${gid})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </g>
      {nodes.map((n, i) => (
        <g key={i} className="dl-node">
          <circle
            cx={n.x}
            cy={n.y}
            r={(n.r ?? 4) * 2.6}
            fill="#00a8fc"
            opacity={0.18}
          />
          <circle
            cx={n.x}
            cy={n.y}
            r={n.r ?? 4}
            fill={n.hub ? "#7fe3ff" : "#00a8fc"}
          />
        </g>
      ))}
      {lines.map((l, i) =>
        l.pulse ? (
          <circle
            key={`p${i}`}
            className="dl-pulse invisible"
            data-path={`dl${gid}-${i}`}
            r={6}
            fill={`url(#dl-p${gid})`}
          />
        ) : null,
      )}
    </svg>
  );
}
