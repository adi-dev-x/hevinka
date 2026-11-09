import { clsx } from "clsx";
import { company } from "@/lib/content";
import { HUBS, hubArc, project, type HubKey } from "@/lib/geo";
import { DrawLines } from "@/components/motion/DrawLines";

// Crop of the dotted world (Middle East → South-East Asia) used by the About and Contact heroes.
const VB = { x: 540, y: 110, w: 300, h: 170 };
const viewBox = `${VB.x} ${VB.y} ${VB.w} ${VB.h}`;
const pct = (k: HubKey) => {
  const p = project(HUBS[k].lat, HUBS[k].lng);
  return { left: `${((p.x - VB.x) / VB.w) * 100}%`, top: `${((p.y - VB.y) / VB.h) * 100}%`, ...p };
};
const kochi = pct("kochi");
const dubai = pct("dubai");

/** India | UAE | Beyond — Kochi ↔ Dubai with routes reaching past the frame. */
export function FootprintMap({ className }: { className?: string }) {
  return (
    <div className={clsx("relative aspect-[300/170] w-full", className)} aria-hidden>
      <svg viewBox={viewBox} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
        <image href="/brand/world-dots.svg" x="0" y="0" width="1000" height="500" opacity="0.85" />
      </svg>
      <DrawLines
        viewBox={viewBox}
        className="absolute inset-0 size-full"
        scrub={false}
        start="top 95%"
        strokeWidth={1.4}
        lines={[
          { d: hubArc("kochi", "dubai", 0.45), pulse: true },
          { d: hubArc("dubai", "london", 0.25), pulse: true },
          { d: hubArc("kochi", "singapore", 0.35), pulse: true },
          { d: hubArc("kochi", "sydney", 0.25) },
          { d: hubArc("dubai", "nairobi", 0.3) },
          { d: hubArc("kochi", "bengaluru", 0.6) },
        ]}
        nodes={[
          { x: kochi.x, y: kochi.y, r: 3.2, hub: true },
          { x: dubai.x, y: dubai.y, r: 3.2, hub: true },
        ]}
      />
      {[
        { at: kochi, name: "Kochi", place: company.footprint[0] },
        { at: dubai, name: "Dubai", place: company.footprint[1] },
      ].map((h) => (
        <span key={h.name} className="absolute -translate-x-1/2 translate-y-3" style={{ left: h.at.left, top: h.at.top }}>
          <span className="glass block whitespace-nowrap rounded-full px-3 py-1 text-center font-display text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
            {h.name} <span className="text-electric">· {h.place}</span>
          </span>
        </span>
      ))}
      <span className="label absolute bottom-[6%] left-[22%] !text-[10px] text-haze">{company.footprint.join(" | ")}</span>
    </div>
  );
}
