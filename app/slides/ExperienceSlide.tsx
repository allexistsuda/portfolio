"use client";

import { appear, EASE, W } from "./shared";

// Slide "Experiência": texto à esquerda, timeline à direita e a faixa de logos do site deslizando embaixo, de ponta a ponta.
const K = 1920 / 1440; // o site tem 1440 de largura; tudo é escalado por esta razão

const TEXT_LINES = [
  "Ao longo da minha carreira,",
  "trabalhei em agências de",
  "publicidade, startups e grandes",
  "empresas, me desenvolvendo",
  "como designer em diferentes",
  "ambientes, equipes e",
  "momentos de negócio.",
];

const EXPERIENCES = [
  { period: "2024 – 2026", company: "Ticket" },
  { period: "2022 – 2024", company: "Santander" },
  { period: "2021", company: "Sioux" },
  { period: "2019 – 2020", company: "Unico ID" },
  { period: "2015 – 2019", company: "Vet Smart" },
];

// mesmos logos e tamanhos do site (px do site), na mesma ordem
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
const LOGO_SPEED = 50 * K; // px por segundo, como no site
const SET_W = LOGOS.length * (BLOCK_W + BLOCK_GAP);

export default function ExperienceSlide() {
  return (
    <>
      <style>{`@keyframes sl-marquee { from { transform: translateX(0); } to { transform: translateX(-${SET_W}px); } }`}</style>

      <div style={{ position: "absolute", left: 128, top: 150, width: 780, fontSize: 48, fontWeight: 500, lineHeight: "66px", letterSpacing: "-0.96px", color: "#222", ...appear(0.15) }}>
        {TEXT_LINES.map((line, i) => (
          <div key={i} style={{ whiteSpace: "nowrap" }}>{line}</div>
        ))}
      </div>

      <div style={{ position: "absolute", left: 0, top: 154, width: W, height: 520 }}>
        <div aria-hidden style={{ position: "absolute", left: 1361 + 5, top: 27, width: 1, height: 4 * 96, background: "#DDDDDD", transformOrigin: "top", animation: `sl-line 1.1s ${EASE} 0.5s both` }} />
        {EXPERIENCES.map((e, i) => (
          <div key={e.company} style={{ position: "absolute", left: 0, top: i * 96, width: W, height: 48 }}>
            <div style={{ position: "absolute", left: 1055, top: 10.5, width: 250, textAlign: "right", fontSize: 24, lineHeight: "34px", letterSpacing: "-0.17px", color: "#8D8D8D", ...appear(0.5 + i * 0.12, 16) }}>{e.period}</div>
            <div style={{ position: "absolute", left: 1361, top: 22, width: 10, height: 10, boxSizing: "border-box", borderRadius: "50%", background: "#F6F6F5", border: "1.25px solid #7A7A7A", animation: `sl-pop 0.5s ${EASE} ${0.55 + i * 0.12}s both` }} />
            <div style={{ position: "absolute", left: 1427, top: 0, width: 330, fontSize: 34, lineHeight: "48px", letterSpacing: "-0.77px", color: "#222", ...appear(0.5 + i * 0.12, 16) }}>{e.company}</div>
          </div>
        ))}
      </div>

      <div style={{ position: "absolute", left: 0, top: 735, width: W, height: BLOCK_H, overflow: "hidden", ...appear(1.2, 40) }}>
        <div style={{ display: "flex", width: "max-content", animation: `sl-marquee ${SET_W / LOGO_SPEED}s linear 1.2s infinite` }}>
          {[...LOGOS, ...LOGOS, ...LOGOS].map((l, i) => (
            <div key={i} style={{ width: BLOCK_W, height: BLOCK_H, marginRight: BLOCK_GAP, flexShrink: 0, borderRadius: 5 * K, background: "#ECECE9", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/logos/${l.file}`} alt="" style={{ width: l.w * K, height: l.h * K, objectFit: "contain", filter: "brightness(0)", opacity: 0.84 }} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
