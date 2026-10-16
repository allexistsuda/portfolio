"use client";

import { useEffect, useRef, useState } from "react";
import { santanderHead, santanderText } from "./fonts";

/**
 * "One experience, multiple variations": a tela do Flame refeita em SVG — um botão base
 * à esquerda e a árvore tracejada que o abre em todas as variações (raio, cor, estado).
 *
 * Fundo transparente de propósito: o desenho assenta no cinza da página, sem as bolhas
 * nem os confetes do vídeo. Os fios são cinza e parados; por cima deles corre um tracejado
 * na cor do destino, feito com uma máscara que anda pelo próprio caminho — primeiro do
 * botão base para a 2ª coluna, depois dela para a 3ª, como se a definição fosse se
 * propagando (o contrário do diagrama que converge: aqui um vira muitos).
 *
 * No celular a mesma árvore vira vertical.
 */

type Variant = {
  key: string;
  fill: string;
  text: string;
  border?: string;
  rx: number;
  shadow?: boolean;
  color: string; // cor do pulso que chega nela
};

// sem shadow: a sombra vermelha marcava o base como origem, mas entre botões chapados
// ela lia como outro nível de elevação — ou como estado de foco. shadow: true a traz de volta.
const BASE: Variant = { key: "base", fill: "#EC0000", text: "#FFFFFF", rx: 999, color: "#EC0000" };

// 2ª coluna: o mesmo botão com outro raio / outra intenção
const COL2: Variant[] = [
  { key: "c2-primary", fill: "#EC0000", text: "#FFFFFF", rx: 8, color: "#EC0000" },
  { key: "c2-secondary", fill: "#FFFFFF", text: "#EC0000", border: "#EC0000", rx: 999, color: "#EC0000" },
  { key: "c2-success", fill: "#63BA68", text: "#FFFFFF", rx: 8, color: "#63BA68" },
];

// 3ª coluna: a família de canto reto, mais o estado desabilitado
const COL3: Variant[] = [
  { key: "c3-disabled", fill: "#4A4A4A", text: "#D6D6D6", rx: 8, color: "#4A4A4A" },
  { key: "c3-primary", fill: "#EC0000", text: "#FFFFFF", rx: 0, color: "#EC0000" },
  { key: "c3-secondary", fill: "#FFFFFF", text: "#EC0000", border: "#EC0000", rx: 0, color: "#EC0000" },
  { key: "c3-info", fill: "#1BB3C4", text: "#FFFFFF", rx: 0, color: "#1BB3C4" },
];

const LABEL = "CTA button";
const RAIL = "#C9C9C9"; // fio parado da árvore

function Button({
  v,
  x,
  y,
  w,
  h,
  size,
  delay,
}: {
  v: Variant;
  x: number;
  y: number;
  w: number;
  h: number;
  size: number;
  delay: number;
}) {
  return (
    <g className="fv-item" style={{ animationDelay: `${delay}s` }}>
      <rect
        x={x}
        y={y - h / 2}
        width={w}
        height={h}
        rx={Math.min(v.rx, h / 2)}
        fill={v.fill}
        stroke={v.border ?? "none"}
        strokeWidth={v.border ? 1.8 : 0}
        filter={v.shadow ? "url(#fv-shadow)" : undefined}
      />
      <text x={x + w / 2} y={y + size * 0.35} textAnchor="middle" fontSize={size} fontWeight={700} fill={v.text}>
        {LABEL}
      </text>
    </g>
  );
}

/** um fio da árvore: trilho cinza parado + tracejado colorido correndo por cima */
function Wire({ d, color, id, delay, area }: { d: string; color: string; id: string; delay: number; area: [number, number] }) {
  return (
    <>
      <mask id={id} maskUnits="userSpaceOnUse" x={-30} y={-30} width={area[0] + 60} height={area[1] + 60}>
        <path
          className="fv-run"
          d={d}
          pathLength={100}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth={10}
          strokeDasharray="22 100"
          style={{ animationDelay: `${delay}s` }}
        />
      </mask>
      <path className="fv-rail" d={d} fill="none" stroke={RAIL} strokeWidth={1.6} />
      <path d={d} fill="none" stroke={color} strokeWidth={2.6} strokeDasharray="7 7" strokeLinecap="round" mask={`url(#${id})`} />
    </>
  );
}

/* ---------------------------------------------------------------- desktop */

// Sem o título em cima, a altura passa a ser só a da árvore: 40 de respiro, o desenho,
// 40 de respiro. O botão base fica no centro vertical exato (H / 2).
const W = 1340; // 60 de margem dos dois lados (antes sobrava 80 na direita)
const H = 600;
const BW = 300;
const BH = 70;
const BASE_X = 60;
const BASE_Y = 300;
const C2_X = 520;
const C3_X = 980;
const S1 = 440; // dobra entre a base e a 2ª coluna
const S2 = 900; // dobra entre a 2ª e a 3ª coluna
// as duas colunas seguem a mesma grade de 150 — é isso que mantém retos os fios entre elas
const C2_Y = [225, 375, 525];
const C3_Y = [75, 225, 375, 525];

// do botão base até cada item da 2ª coluna (ortogonal, como no quadro do vídeo)
const wire1 = (y: number) =>
  y === BASE_Y ? `M ${BASE_X + BW} ${BASE_Y} H ${C2_X - 10}` : `M ${BASE_X + BW} ${BASE_Y} H ${S1} V ${y} H ${C2_X - 10}`;

// de um item da 2ª coluna até um da 3ª
const wire2 = (from: number, to: number) =>
  from === to ? `M ${C2_X + BW} ${from} H ${C3_X - 10}` : `M ${C2_X + BW} ${from} H ${S2} V ${to} H ${C3_X - 10}`;

// quem alimenta quem: o vermelho de raio 8 abre o desabilitado e o de canto reto
const LINKS: { from: number; to: number; color: string }[] = [
  { from: C2_Y[0], to: C3_Y[0], color: COL3[0].color },
  { from: C2_Y[0], to: C3_Y[1], color: COL3[1].color },
  { from: C2_Y[1], to: C3_Y[2], color: COL3[2].color },
  { from: C2_Y[2], to: C3_Y[3], color: COL3[3].color },
];

function Desktop() {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block", overflow: "visible" }} aria-hidden="true">
      {COL2.map((v, i) => (
        <Wire key={v.key} d={wire1(C2_Y[i])} color={v.color} id={`fvd-w1-${i}`} delay={i * 0.12} area={[W, H]} />
      ))}
      {LINKS.map((l, i) => (
        <Wire key={`${l.from}-${l.to}`} d={wire2(l.from, l.to)} color={l.color} id={`fvd-w2-${i}`} delay={0.9 + i * 0.12} area={[W, H]} />
      ))}

      <Button v={BASE} x={BASE_X} y={BASE_Y} w={BW} h={BH} size={22} delay={0.1} />
      {COL2.map((v, i) => (
        <Button key={v.key} v={v} x={C2_X} y={C2_Y[i]} w={BW} h={BH} size={22} delay={0.3 + i * 0.08} />
      ))}
      {COL3.map((v, i) => (
        <Button key={v.key} v={v} x={C3_X} y={C3_Y[i]} w={BW} h={BH} size={22} delay={0.6 + i * 0.08} />
      ))}
    </svg>
  );
}

/* ----------------------------------------------------------------- mobile */

const MW = 360;
const M_BW = 262;
const M_BH = 52;
const M_X = 84; // botões à direita, dobra da árvore à esquerda
const M_SPINE = 30;
const M_BASE_Y = 50; // subiu 80 junto com o resto, agora que não há título em cima
const M_LIST = [...COL2, ...COL3];
const M_FIRST = 170;
const M_GAP = 84;
const M_Y = M_LIST.map((_, i) => M_FIRST + i * M_GAP);
const MH = M_Y[M_Y.length - 1] + 50;

const mWire = (y: number) => `M ${M_X + M_BW / 2} ${M_BASE_Y + M_BH / 2} V ${M_BASE_Y + M_BH / 2 + 34} H ${M_SPINE} V ${y} H ${M_X - 10}`;

function Mobile() {
  return (
    <svg viewBox={`0 0 ${MW} ${MH}`} width="100%" style={{ display: "block", overflow: "visible" }} aria-hidden="true">
      {M_LIST.map((v, i) => (
        <Wire key={v.key} d={mWire(M_Y[i])} color={v.color} id={`fvm-w-${i}`} delay={i * 0.14} area={[MW, MH]} />
      ))}

      <Button v={BASE} x={M_X} y={M_BASE_Y} w={M_BW} h={M_BH} size={17} delay={0.1} />
      {M_LIST.map((v, i) => (
        <Button key={v.key} v={v} x={M_X} y={M_Y[i]} w={M_BW} h={M_BH} size={17} delay={0.3 + i * 0.07} />
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------------ */

export default function FlameVariations() {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  // só começa a animar quando o desenho entra na tela
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    const fallback = setTimeout(() => setOn(true), 1500);
    return () => {
      obs.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`fv ${santanderText.variable} ${santanderHead.variable}`}
      data-on={on ? "true" : "false"}
      role="img"
      aria-label="One experience, multiple variations: um botão base do Flame se abrindo nas suas variações de raio, cor e estado"
    >
      <style>{`
        @keyframes fv-run {
          0%   { stroke-dashoffset: 22; }
          55%  { stroke-dashoffset: -100; }
          100% { stroke-dashoffset: -100; }
        }
        @keyframes fv-in {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fv text { font-family: var(--font-santander-text), system-ui, sans-serif; }
        .fv .fv-head { font-family: var(--font-santander-head), system-ui, sans-serif; }
        .fv .fv-rail { stroke-dasharray: 7 7; }
        .fv .fv-run { animation: fv-run 4.2s cubic-bezier(0.45, 0, 0.5, 1) infinite both; }
        .fv .fv-item { opacity: 0; animation: fv-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) both; transform-box: fill-box; }
        .fv[data-on="false"] .fv-run,
        .fv[data-on="false"] .fv-item { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .fv .fv-run { animation: none; }
          .fv .fv-item { opacity: 1; animation: none; }
        }
      `}</style>

      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <filter id="fv-shadow" x="-30%" y="-40%" width="160%" height="200%">
            <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#EC0000" floodOpacity="0.22" />
          </filter>
        </defs>
      </svg>

      <div className="hidden md:block">
        <Desktop />
      </div>
      <div className="md:hidden">
        <Mobile />
      </div>
    </div>
  );
}
