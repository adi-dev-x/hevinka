"use client";

// Decorative, below-the-fold visuals load after hydration so they stay out of the first-load JS budget.
// Placeholders reserve the exact box (no layout shift) and carry the accessible label.
import dynamic from "next/dynamic";

const box = (ratio: string, label?: string) =>
  function Placeholder() {
    return <div className="w-full" style={{ aspectRatio: ratio }} role={label ? "img" : undefined} aria-label={label} />;
  };

export const LazyDashboard = dynamic(() => import("./Dashboard").then((m) => m.Dashboard), {
  ssr: false,
  loading: box("1000 / 625", "Illustrative dashboard: leads, customers, sales pipeline, revenue and recent activity"),
});
export const LazyRentalRing = dynamic(() => import("./SolutionVisuals").then((m) => m.RentalRing), { ssr: false, loading: box("1 / 1") });
export const LazyRouteMap = dynamic(() => import("./SolutionVisuals").then((m) => m.RouteMap), { ssr: false, loading: box("300 / 170") });
export const LazyApiHub = dynamic(() => import("./SolutionVisuals").then((m) => m.ApiHub), { ssr: false, loading: box("1 / 1") });
export const LazyGrowthEngine = dynamic(() => import("./SolutionVisuals").then((m) => m.GrowthEngine), { ssr: false, loading: box("1 / 1") });
export const LazyIntegrationWheel = dynamic(() => import("./SolutionVisuals").then((m) => m.IntegrationWheel), { ssr: false, loading: box("1 / 1") });
export const LazyWebDevices = dynamic(() => import("./SolutionVisuals").then((m) => m.WebDevices), { ssr: false, loading: box("10 / 9") });
