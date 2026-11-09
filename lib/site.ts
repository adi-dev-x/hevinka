// Canonical site URL and the public route list (sitemap, metadata, JSON-LD).
import { solutions } from "./content";

export const SITE_URL = "https://www.hevinka.com";

export const ROUTES = [
  { path: "/", priority: 1 },
  { path: "/about", priority: 0.8 },
  { path: "/approach", priority: 0.7 },
  { path: "/industries", priority: 0.7 },
  { path: "/contact", priority: 0.8 },
  ...solutions.map((s) => ({ path: `/solutions/${s.slug}`, priority: 0.9 })),
];

/** Per-page metadata with canonical + Open Graph/Twitter titles (OG images come from each route's opengraph-image). */
export function pageMeta({ title, description, path }: { title: string; description: string; path: string }) {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type: "website" as const, locale: "en_IN", siteName: "HEVINKA Technologies Private Limited" },
    twitter: { card: "summary_large_image" as const, title, description },
  };
}
