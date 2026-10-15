import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // O badge de dev do Next entra nos quadros capturados das peças de motion (que rodam no
  // dev server). Desligar só esconde o indicador — erros de build e runtime continuam aparecendo.
  devIndicators: false,

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
