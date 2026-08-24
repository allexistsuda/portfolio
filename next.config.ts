import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Serve the English version under /en/* using the same pages.
  // The language is then resolved from the URL on the client (see app/i18n/lang.tsx).
  async rewrites() {
    return [
      { source: "/en", destination: "/" },
      { source: "/en/:path*", destination: "/:path*" },
    ];
  },
};

export default nextConfig;
