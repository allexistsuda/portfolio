"use client";

import { useEffect, useState } from "react";

// Faixa de logos das empresas, em scroll infinito (sem fade-in), para gravar em vídeo com loop perfeito:
// 1920 x 1080, fundo igual ao do slide, faixa na mesma posição do slide (y = 735).
// O ciclo dura exatamente LOOP_S segundos e anda exatamente um conjunto de logos, então o último quadro emenda no primeiro.
const W = 1920;
const H = 1080;
const K = 1920 / 1440;
const LOOP_S = 33; // 33 s a 30 fps = 990 quadros exatos (mesma velocidade do site, ~67 px/s)

const LOGOS = [
  { file: "ingresse.svg", w: 99, h: 16 },
  { file: "ticket.svg", w: 34, h: 34 },
  { file: "santander.svg", w: 104, h: 17 },
  { file: "unico.svg", w: 72, h: 15 },
  { file: "petlove.svg", w: 89, h: 20 },
  { file: "vetsmart.svg", w: 114, h: 17.2 },
  { file: "publicis.svg", w: 104.4, h: 44.5 },
];
const BLOCK_W = 227 * K;
const BLOCK_H = 170 * K;
const BLOCK_GAP = 10 * K;
const SET_W = LOGOS.length * (BLOCK_W + BLOCK_GAP);

export default function StripMotion() {
  const [fit, setFit] = useState({ scale: 1, ox: 0, oy: 0 });
  useEffect(() => {
    const onFit = () => {
      const scale = Math.min(window.innerWidth / W, window.innerHeight / H);
      setFit({ scale, ox: (window.innerWidth - W * scale) / 2, oy: (window.innerHeight - H * scale) / 2 });
    };
    onFit();
    window.addEventListener("resize", onFit);
    return () => window.removeEventListener("resize", onFit);
  }, []);

  return (
    <main style={{ position: "fixed", inset: 0, background: "#000", overflow: "hidden" }}>
      <style>{`@keyframes st-scroll { from { transform: translateX(0); } to { transform: translateX(-${SET_W}px); } }`}</style>
      <div style={{ position: "absolute", left: fit.ox, top: fit.oy, width: W, height: H, background: "#F6F6F5", overflow: "hidden", transformOrigin: "0 0", transform: `scale(${fit.scale})` }}>
        <div style={{ position: "absolute", left: 0, top: 735, width: W, height: BLOCK_H, overflow: "hidden" }}>
          <div style={{ display: "flex", width: "max-content", animation: `st-scroll ${LOOP_S}s linear infinite` }}>
            {[...LOGOS, ...LOGOS, ...LOGOS].map((l, i) => (
              <div key={i} style={{ width: BLOCK_W, height: BLOCK_H, marginRight: BLOCK_GAP, flexShrink: 0, borderRadius: 5 * K, background: "#ECECE9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/logos/${l.file}`} alt="" style={{ width: l.w * K, height: l.h * K, objectFit: "contain", filter: "brightness(0)", opacity: 0.84 }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
