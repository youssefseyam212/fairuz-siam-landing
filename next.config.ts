import type { NextConfig } from "next";

// GitHub Pages preview build: static export served under /<repo-name>.
// Set by the deploy workflow, which also removes src/app/api (route handlers cannot be exported);
// in that preview the pre-order popup shows a sample code and saves nothing.
// The real site (with the pre-order API) runs on a Node server: `npm run build && npm start`.
const isPages = process.env.GITHUB_PAGES === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = isPages
  ? {
      // static export cannot use Cache Components / partial prerendering
      output: "export",
      basePath,
      trailingSlash: true,
      images: { unoptimized: true },
    }
  : {
      cacheComponents: true,
      partialPrefetching: true,
    };

export default nextConfig;
