// RECREATION of the HEVINKA logo, traced from public/brand/logomark-reference-on-dark.png.
// TODO(content): replace with the original vector logo once supplied by the client.
import { clsx } from "clsx";
import { useId } from "react";

export const BLADE_PATHS = [
  "M80 280C86 252 108 238 136 224C136 270 134 300 128 322C116 355 78 372 16 375C54 356 74 333 80 310C84 298 78 290 80 280Z",
  "M145 205C152 172 186 156 220 146C220 222 218 290 212 320C202 365 152 392 52 396C112 372 140 335 144 285C147 250 140 225 145 205Z",
  "M230 84C236 50 272 28 306 14C304 120 304 250 300 300C294 360 252 400 138 412C196 384 226 340 230 270C233 200 226 120 230 84Z",
] as const;

export const MARK_VIEWBOX = "10 8 300 410";

type Tone = "white" | "gradient" | "cobalt";

export function LogoMark({
  tone = "gradient",
  className,
  title,
}: {
  tone?: Tone;
  className?: string;
  /** Pass a title only when the mark stands alone as the brand name. */
  title?: string;
}) {
  const id = useId().replace(/:/g, "");
  const fill = tone === "white" ? "#fff" : tone === "cobalt" ? "#0047a8" : `url(#g${id})`;
  return (
    <svg
      viewBox={MARK_VIEWBOX}
      className={clsx("logo-mark overflow-visible", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {tone === "gradient" && (
        <defs>
          <linearGradient id={`g${id}`} x1="0" y1="1" x2="0.9" y2="0">
            <stop offset="0" stopColor="#0047a8" />
            <stop offset="0.5" stopColor="#0b5bd3" />
            <stop offset="1" stopColor="#00a8fc" />
          </linearGradient>
        </defs>
      )}
      {BLADE_PATHS.map((d, i) => (
        <path key={i} d={d} fill={fill} className="logo-blade" data-blade={i} />
      ))}
    </svg>
  );
}

/**
 * Full lockup: mark + HEVINKA wordmark + TECHNOLOGIES PRIVATE LIMITED + rule.
 * `compact` drops the sub-line (nav at small sizes).
 */
export function Logo({
  variant = "dark",
  compact = false,
  className,
}: {
  /** Background the logo sits on. */
  variant?: "dark" | "light";
  compact?: boolean;
  className?: string;
}) {
  const onDark = variant === "dark";
  return (
    <span className={clsx("logo inline-flex items-center gap-[0.55em] leading-none", className)}>
      <LogoMark tone={onDark ? "white" : "gradient"} className="h-[2.1em] w-auto shrink-0" />
      <span className="flex flex-col">
        <span
          className={clsx(
            "logo-word font-display text-[1.55em] font-bold tracking-[0.02em]",
            onDark ? "text-white" : "text-cobalt",
          )}
        >
          HEVINKA
        </span>
        {!compact && (
          <>
            <span
              className={clsx(
                "logo-sub mt-[0.28em] font-display text-[0.5em] font-medium tracking-[0.06em] uppercase",
                onDark ? "text-white/85" : "text-cobalt",
              )}
            >
              Technologies Private Limited
            </span>
            <span className="logo-rule mt-[0.3em] block h-px w-full origin-left bg-electric" />
          </>
        )}
      </span>
    </span>
  );
}
