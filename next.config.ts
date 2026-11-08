import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // O badge de dev do Next entra nos quadros capturados das peças de motion (que rodam no
  // dev server). Desligar só esconde o indicador — erros de build e runtime continuam aparecendo.
  devIndicators: false,

  // libera o IP do Mac na rede local pra testar no iPhone (http://192.168.15.5:3100).
  // Sem isso o dev server bloqueia o JS pra outros aparelhos: o HTML chega, mas
  // nada hidrata e tudo que entra com animação fica invisível. Só vale no dev; se
  // o roteador trocar o IP do Mac, é atualizar aqui.
  allowedDevOrigins: ["192.168.15.5"],

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
