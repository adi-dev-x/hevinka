import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  env: {
    // Footer copyright year, fixed at build time (avoids runtime Date in prerendered pages).
    NEXT_PUBLIC_BUILD_YEAR: String(new Date().getFullYear()),
  },
  turbopack: {
    // A stray package-lock.json in the home folder would otherwise be picked as the workspace root.
    root: process.cwd(),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
