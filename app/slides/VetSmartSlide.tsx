"use client";

import { appear, EASE } from "./shared";

// Slide "Vet Smart", com os mesmos elementos do slide de Experiência (e do site): frase em Geist Medium à esquerda
// e, à direita, os pontos, cada um com a seta original.
const TITLE_LINES = ["I co-founded Vet Smart,", "a veterinary app, with two", "developer friends"];

const POINTS = [
  "Vets needed quick access to information about medications during consultations",
  "Started as a small project at a time when there was nothing similar in the market",
  "Built entirely without external investment",
  "The only designer on the app, from navigation and architecture to product decisions",
];

const DOT_X = 1000;
const TEXT_X = 1066;
const GAP = 60;

export default function VetSmartSlide() {
  return (
    <>
      <div style={{ position: "absolute", left: 128, top: 232, width: 800, fontSize: 60, fontWeight: 500, lineHeight: "78px", letterSpacing: "-1.2px", color: "#222", ...appear(0.15) }}>
        {TITLE_LINES.map((line, i) => (
          <div key={i} style={{ whiteSpace: "nowrap" }}>{line}</div>
        ))}
      </div>

      <div style={{ position: "absolute", left: 0, top: 236, width: 1920, display: "flex", flexDirection: "column", gap: GAP }}>
        {POINTS.map((p, i) => (
          <div key={i} style={{ position: "relative", marginLeft: TEXT_X, width: 740 }}>
            {/* seta original (a mesma do site e do slide anterior), no lugar da bolinha */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/seta-contato.svg" alt="" width={30} height={30} style={{ position: "absolute", left: DOT_X - TEXT_X, top: 12, opacity: 0, animation: `sl-in 0.7s ${EASE} ${0.5 + i * 0.3}s both`, ["--rise" as string]: "0px" } as React.CSSProperties} />
            <div style={{ fontSize: 40, lineHeight: "54px", letterSpacing: "-0.9px", color: "#222", ...appear(0.5 + i * 0.3, 16) }}>{p}</div>
          </div>
        ))}
      </div>
    </>
  );
}
