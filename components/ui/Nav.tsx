"use client";

import { clsx } from "clsx";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { nav } from "@/lib/content";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { Logo } from "./Logo";
import { Button } from "./Button";
import { Menu } from "./Menu";

/**
 * Transparent over the hero → glass after 80px; hides on scroll-down, returns on scroll-up.
 * Shows a "02 / 12 · Section" index for pages whose sections carry `data-section`.
 */
export function Nav() {
  const header = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState<{ i: number; total: number; label: string } | null>(null);

  useGSAP(
    () => {
      const el = header.current;
      if (!el) return;
      const show = gsap.quickTo(el, "yPercent", { duration: 0.5, ease: "power3.out" });
      show(0);
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate(self) {
          const y = self.scroll();
          setScrolled(y > 80);
          if (y < 200 || self.direction === -1) show(0);
          else show(-110);
        },
      });

      const sections = gsap.utils.toArray<HTMLElement>("[data-section]");
      setIndex(null);
      sections.forEach((s, i) =>
        ScrollTrigger.create({
          trigger: s,
          start: "top 40%",
          end: "bottom 40%",
          onToggle: (self) => self.isActive && setIndex({ i: i + 1, total: sections.length, label: s.dataset.section ?? "" }),
        }),
      );
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header
        ref={header}
        className={clsx(
          "fixed inset-x-0 top-0 z-[100] focus-within:!transform-none transition-[background-color,border-color,backdrop-filter] duration-500",
          scrolled && !open
            ? "border-b border-[var(--glass-border)] bg-navy/85 backdrop-blur-xl backdrop-saturate-150"
            : "border-b border-transparent",
        )}
      >
        <div className="mx-auto flex h-[var(--nav-h)] max-w-[1440px] items-center gap-6 px-5 sm:px-8 lg:px-14">
          <TransitionLink href="/" className="relative z-[2] text-[13px] sm:text-[15px]">
            <span className="sr-only">Home — </span>
            <span className="sm:hidden">
              <Logo variant="dark" compact />
            </span>
            <span className="hidden sm:block">
              <Logo variant="dark" />
            </span>
          </TransitionLink>

          {index && index.total > 1 && (
            <p className={clsx("label hidden items-center gap-2 text-[10px] text-haze transition-opacity xl:flex", open && "opacity-0")} aria-hidden>
              <span className="text-electric">{pad(index.i)}</span>
              <span>/ {pad(index.total)}</span>
              <span className="ml-2 max-w-[14ch] truncate">{index.label}</span>
            </p>
          )}

          <nav aria-label="Primary" className={clsx("ml-auto hidden transition-opacity duration-300 lg:block", open && "pointer-events-none opacity-0")}>
            <ul className="flex items-center gap-8">
              {nav.primary.map((l) => {
                const active = l.href === pathname;
                return (
                  <li key={l.href}>
                    <TransitionLink
                      href={l.href}
                      aria-current={active ? "page" : undefined}
                      className="group/link relative py-2 font-display text-sm font-medium text-white/85 transition-colors hover:text-white"
                    >
                      {l.label}
                      <span
                        aria-hidden
                        className={clsx(
                          "absolute -bottom-0.5 left-0 h-[2px] w-full origin-right scale-x-0 rounded-full transition-transform duration-500 ease-[var(--ease-expo)] [background:var(--grad-brand)] group-hover/link:origin-left group-hover/link:scale-x-100",
                          active && "!scale-x-100",
                        )}
                      />
                    </TransitionLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="relative z-[2] ml-auto flex items-center gap-3 lg:ml-0">
            <div className="hidden sm:block">
              <Button href="/contact" className="!py-2.5">
                Let&apos;s talk
              </Button>
            </div>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="group/menu grid size-11 place-items-center rounded-full border border-white/20 bg-white/[0.04] transition-colors hover:border-electric"
            >
              <span className="relative block h-3 w-5">
                <span
                  className={clsx(
                    "absolute left-0 top-0 h-[1.5px] w-full bg-white transition-transform duration-500 ease-[var(--ease-expo)]",
                    open ? "translate-y-[5px] rotate-45" : "group-hover/menu:w-3/4",
                  )}
                />
                <span
                  className={clsx(
                    "absolute bottom-0 right-0 h-[1.5px] w-full bg-white transition-transform duration-500 ease-[var(--ease-expo)]",
                    open ? "-translate-y-[5px] -rotate-45" : "",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>
      <Menu open={open} onClose={() => setOpen(false)} />
    </>
  );
}
