"use client";

import Link from "next/link";
import { useTransitionRouter } from "./PageTransition";

type Props = React.ComponentProps<typeof Link> & { href: string };

/** next/link that plays the diagonal page transition (and smooth-scrolls same-page hashes). */
export function TransitionLink({ href, onClick, target, ...rest }: Props) {
  const navigate = useTransitionRouter();
  return (
    <Link
      href={href}
      target={target}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || target === "_blank" || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        if (/^(mailto:|tel:|https?:)/.test(href) && !href.startsWith(window.location.origin)) return;
        e.preventDefault();
        navigate(href);
      }}
      {...rest}
    />
  );
}
