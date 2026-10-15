"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Carrossel contínuo de logos (referência: seção de logos do unico.io/pt).
 * Lá, a faixa roda via JS (translate3d) o tempo todo, com blur progressivo
 * nas bordas em vez de um corte seco de opacidade. Aqui a rolagem é feita
 * em CSS puro (mais simples de manter) e a borda usa blur + máscara de
 * opacidade juntos (alpha+blur), não só opacidade.
 */

const LOGOS = [
  { name: "Ticket", src: "/logos/ticket.svg" },
  { name: "Santander", src: "/logos/santander.svg" },
  { name: "Unico", src: "/logos/unico.svg" },
  { name: "Ingresse", src: "/logos/ingresse.svg" },
  { name: "Petlove", src: "/logos/petlove.svg" },
  { name: "Bradesco", src: "/logos/bradesco.svg" },
  { name: "Vet Smart", src: "/logos/vetsmart.svg" },
  { name: "Publicis", src: "/logos/publicis.svg" },
];

const SPEED = 40; // px/s
const ROW_HEIGHT = 15; // ~30% menor que o padrão anterior (22px)
const GAP = 48;
const FADE_WIDTH = 56;

export default function LogosCarousel({ fadeColor = "#F6F6F5" }: { fadeColor?: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(30);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => setDuration(track.scrollWidth / 2 / SPEED);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    return () => ro.disconnect();
  }, []);

  return (
    <div style={{ position: "relative", overflow: "hidden", height: ROW_HEIGHT }}>
      <div
        ref={trackRef}
        className="flex items-center absolute inset-0"
        style={{
          gap: GAP,
          width: "max-content",
          animation: `marquee-scroll ${duration}s linear infinite`,
        }}
      >
        {[...LOGOS, ...LOGOS].map((logo, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={logo.src}
            alt={logo.name}
            style={{ height: ROW_HEIGHT, width: "auto", flexShrink: 0 }}
          />
        ))}
      </div>

      <div
        className="pointer-events-none absolute inset-y-0 left-0"
        style={{
          width: FADE_WIDTH,
          background: `linear-gradient(to right, ${fadeColor}, transparent)`,
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          maskImage: "linear-gradient(to right, black, transparent)",
          WebkitMaskImage: "linear-gradient(to right, black, transparent)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0"
        style={{
          width: FADE_WIDTH,
          background: `linear-gradient(to left, ${fadeColor}, transparent)`,
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          maskImage: "linear-gradient(to left, black, transparent)",
          WebkitMaskImage: "linear-gradient(to left, black, transparent)",
        }}
      />
    </div>
  );
}
