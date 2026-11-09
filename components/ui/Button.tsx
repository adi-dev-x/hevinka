"use client";

import { clsx } from "clsx";
import { ArrowUpRight } from "lucide-react";
import { Magnetic } from "@/components/motion/Magnetic";
import { TransitionLink } from "@/components/motion/TransitionLink";

type Variant = "primary" | "ghost" | "ghost-light";

const styles: Record<Variant, string> = {
  primary:
    "text-white [background:var(--grad-brand)] shadow-[0_10px_40px_-10px_rgb(0_168_252/0.6)] hover:shadow-[0_14px_50px_-8px_rgb(0_168_252/0.8)]",
  ghost: "text-white border border-white/25 hover:border-electric hover:text-white bg-white/[0.03] backdrop-blur-sm",
  "ghost-light": "text-ink border border-ink/20 hover:border-royal hover:text-royal bg-white/60",
};

function Inner({ children, icon = true }: { children: React.ReactNode; icon?: boolean }) {
  return (
    <>
      {/* sheen sweep on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-[var(--ease-expo)] group-hover/btn:translate-x-full"
      />
      <span className="relative">{children}</span>
      {icon && (
        <span className="relative grid size-6 place-items-center overflow-hidden rounded-full bg-white/10">
          <ArrowUpRight
            size={14}
            strokeWidth={1.75}
            aria-hidden
            className="transition-transform duration-500 ease-[var(--ease-expo)] group-hover/btn:translate-x-4 group-hover/btn:-translate-y-4"
          />
          <ArrowUpRight
            size={14}
            strokeWidth={1.75}
            aria-hidden
            className="absolute -translate-x-4 translate-y-4 transition-transform duration-500 ease-[var(--ease-expo)] group-hover/btn:translate-x-0 group-hover/btn:translate-y-0"
          />
        </span>
      )}
    </>
  );
}

const base =
  "group/btn relative inline-flex items-center gap-3 overflow-hidden rounded-full px-6 py-3.5 font-display text-sm font-semibold tracking-wide transition-[box-shadow,border-color,color] duration-300";

/** Brand button. Renders a TransitionLink when `href` is set, else a <button>. Magnetic by default. */
export function Button({
  href,
  children,
  variant = "primary",
  icon = true,
  magnetic = true,
  className,
  ...rest
}: {
  href?: string;
  children: React.ReactNode;
  variant?: Variant;
  icon?: boolean;
  magnetic?: boolean;
  className?: string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className">) {
  const el = href ? (
    <TransitionLink href={href} className={clsx(base, styles[variant], className)}>
      <Inner icon={icon}>{children}</Inner>
    </TransitionLink>
  ) : (
    <button type="button" className={clsx(base, styles[variant], className)} {...rest}>
      <Inner icon={icon}>{children}</Inner>
    </button>
  );
  return magnetic ? <Magnetic>{el}</Magnetic> : el;
}
