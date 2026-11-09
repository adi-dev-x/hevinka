"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";

/** Rendered last on chunk-hydrated pages: once every section's triggers and pins exist, recalc positions. */
export function RefreshTriggers() {
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, []);
  return null;
}
