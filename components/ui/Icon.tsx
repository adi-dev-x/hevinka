import { clsx } from "clsx";
import type { IconName } from "@/lib/content";

/**
 * Brand line icon — 1.5 stroke, rounded joins (matches the brochure). Decorative by default.
 * Renders a reference into the inline sprite (<IconSprite/> in the root layout), so icon paths
 * ship once as HTML instead of as JS in every route bundle. Stroke width inherits into the symbol.
 */
export function Icon({
  name,
  size = 24,
  strokeWidth = 1.5,
  className,
}: {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={clsx("lucide shrink-0", className)}
    >
      <use href={`#i-${name}`} />
    </svg>
  );
}
