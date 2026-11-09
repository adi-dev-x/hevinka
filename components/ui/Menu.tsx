"use client";

import { clsx } from "clsx";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { company, contact, nav, solutions } from "@/lib/content";
import { useLenis } from "@/components/motion/SmoothScroll";
import { useTransitionRouter } from "@/components/motion/PageTransition";

const CLOSED = "polygon(130% 0%, 130% 0%, 115% 100%, 115% 100%)";
const OPEN = "polygon(0% 0%, 130% 0%, 115% 100%, -15% 100%)";

/** Full-screen menu: diagonal clip-path wipe, staggered link rise, dotted world map, contact details. */
export function Menu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const lenis = useLenis();
  const navigate = useTransitionRouter();
  const pathname = usePathname();
  const lastFocus = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia(MQ.reduce).matches;
      gsap.set(root.current, { clipPath: CLOSED, autoAlpha: 0 });
      tl.current = gsap
        .timeline({ paused: true })
        .set(root.current, { autoAlpha: 1 })
        .to(root.current, { clipPath: OPEN, duration: reduce ? 0.01 : 0.9, ease: "expo.inOut" })
        .from(".m-link", { yPercent: reduce ? 0 : 110, autoAlpha: reduce ? 0 : 1, duration: 0.8, stagger: 0.06, ease: "hevinka" }, "-=0.35")
        .from(".m-fade", { autoAlpha: 0, y: reduce ? 0 : 20, duration: 0.6, stagger: 0.05 }, "-=0.6")
        .from(".m-map", { autoAlpha: 0, scale: 1.08, duration: 1.4, ease: "power2.out" }, 0.3);
    },
    { scope: root },
  );

  useEffect(() => {
    const t = tl.current;
    if (!t) return;
    if (open) {
      lastFocus.current = document.activeElement as HTMLElement;
      t.timeScale(1).play();
      lenis?.stop();
      document.documentElement.style.overflow = "hidden";
      requestAnimationFrame(() => root.current?.querySelector<HTMLElement>("a, button")?.focus({ preventScroll: true }));
    } else if (t.progress() > 0) {
      t.timeScale(1.6).reverse();
      lenis?.start();
      document.documentElement.style.overflow = "";
      lastFocus.current?.focus({ preventScroll: true });
    }
  }, [open, lenis]);

  // Close on route change.
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Esc + focus trap.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key !== "Tab" || !root.current) return;
      // The toggle sits before the menu in DOM order, so it is the first stop of the loop.
      const toggle = document.querySelector<HTMLElement>("[aria-controls='site-menu']");
      const items = [
        ...(toggle ? [toggle] : []),
        ...Array.from(root.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")),
      ];
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const go = (href: string) => (e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    onClose();
    navigate(href);
  };

  return (
    <div
      ref={root}
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      inert={!open}
      className="invisible fixed inset-0 z-[90] overflow-y-auto [background:var(--grad-night)]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/world-dots.svg"
        alt=""
        aria-hidden
        className="m-map pointer-events-none absolute right-[-10%] top-1/2 w-[110%] max-w-none -translate-y-1/2 opacity-[0.22] md:w-[75%]"
      />
      <div className="relative mx-auto flex min-h-full max-w-[1440px] flex-col px-5 pb-10 pt-[calc(var(--nav-h)+2.5rem)] sm:px-8 lg:px-14">
        <div className="grid flex-1 gap-12 lg:grid-cols-[1.4fr_1fr]">
          <nav aria-label="Menu">
            <ul className="flex flex-col gap-1">
              {[{ label: "Home", href: "/" }, ...nav.primary].map((l, i) => (
                <li key={l.href} className="overflow-hidden">
                  <a
                    href={l.href}
                    onClick={go(l.href)}
                    aria-current={l.href === pathname ? "page" : undefined}
                    className="m-link group/m flex items-baseline gap-5 py-1 font-display text-[clamp(2.2rem,min(5.6vw,8.5svh),4.75rem)] font-bold uppercase leading-[1.02] tracking-[-0.02em] text-white transition-colors hover:text-electric"
                  >
                    <span className="font-mono text-xs font-medium tracking-[0.2em] text-haze">{String(i + 1).padStart(2, "0")}</span>
                    <span className="transition-transform duration-500 ease-[var(--ease-expo)] group-hover/m:translate-x-3">{l.label}</span>
                    <ArrowRight
                      aria-hidden
                      strokeWidth={1.5}
                      className="size-[0.5em] -translate-x-4 self-center opacity-0 transition-all duration-500 ease-[var(--ease-expo)] group-hover/m:translate-x-0 group-hover/m:opacity-100"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-10 lg:pt-4">
            <div className="m-fade">
              <p className="label mb-4 text-electric">Solutions</p>
              <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {solutions.map((s) => (
                  <li key={s.slug}>
                    <a
                      href={`/solutions/${s.slug}`}
                      onClick={go(`/solutions/${s.slug}`)}
                      className="group/s flex gap-3 text-sm text-white/75 transition-colors hover:text-white"
                    >
                      <span className="font-mono text-[11px] text-electric/80">{s.number}</span>
                      <span className="link-underline">{s.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-6 border-t border-white/10 pt-8 text-sm text-white/75 md:grid-cols-3">
          <div className="m-fade flex gap-3">
            <Phone aria-hidden size={18} strokeWidth={1.5} className="mt-0.5 shrink-0 text-electric" />
            <div className="flex flex-col">
              {contact.phones.map((p) => (
                <a key={p.href} href={p.href} className="hover:text-white">
                  {p.display}
                </a>
              ))}
            </div>
          </div>
          <div className="m-fade flex gap-3">
            <Mail aria-hidden size={18} strokeWidth={1.5} className="mt-0.5 shrink-0 text-electric" />
            <a href={`mailto:${contact.email}`} className="hover:text-white">
              {contact.email}
            </a>
          </div>
          <div className="m-fade flex gap-3">
            <MapPin aria-hidden size={18} strokeWidth={1.5} className="mt-0.5 shrink-0 text-electric" />
            <address className="not-italic">{contact.address.lines.join(" ")}</address>
          </div>
        </div>
        <p className={clsx("m-fade label mt-8 text-haze")}>
          {company.tagline.join(" ")} — {company.footprint.join(" | ")}
        </p>
      </div>
    </div>
  );
}
