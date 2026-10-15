"use client";

import { createContext, useContext } from "react";

// Peças compartilhadas pelas três telas recriadas. Todas as medidas vêm da referência
// (public/invest-motion/referencia.png), no espaço da tela de 397x858.
//
// Os `top` dos textos não são chute: saem das métricas da Santander Text — pro tamanho e a
// entrelinha dados, é o valor que põe a TINTA na altura medida no mockup.

export const SCR_W = 397;
export const SCR_H = 858;

export const C = {
  nav: "#29282C", // faixa do topo e rodapé
  panel: "#1F1E22", // bloco "Todas as contas"
  red: "#EC6F6A",
  txt: "#E9E9EB",
};

export type TProps = {
  x: number;
  top: number;
  size: number;
  lh: number;
  color: string;
  weight?: number;
  underline?: boolean;
  children: React.ReactNode;
};

export function T({ x, top, size, lh, color, weight = 400, underline, children }: TProps) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top,
        fontSize: size,
        fontWeight: weight,
        lineHeight: `${lh}px`,
        color,
        whiteSpace: "nowrap",
        textDecoration: underline ? "underline" : undefined,
        textUnderlineOffset: underline ? 3 : undefined,
        textDecorationThickness: underline ? 1 : undefined,
      }}
    >
      {children}
    </div>
  );
}

export const Band = ({ y, h, c }: { y: number; h: number; c: string }) => (
  <div style={{ position: "absolute", left: 0, top: y, width: SCR_W, height: h, background: c }} />
);

/** Faixa de fundo que aparece em alpha. A tela nasce preta e os blocos cinza — a barra do topo,
 *  o painel da conta, o rodapé — se montam por cima, antes do conteúdo entrar. */
export function BandIn({ y, h, c, d = 0, dur = 0.5 }: { y: number; h: number; c: string; d?: number; dur?: number }) {
  const p = easeOut(seg(useT(), d, dur));
  if (p <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: y, width: SCR_W, height: h, background: c, opacity: p }} />
  );
}

export const Rect = (p: {
  x: number;
  y: number;
  w: number;
  h: number;
  c?: string;
  r?: number;
  border?: string;
}) => (
  <div
    style={{
      position: "absolute",
      left: p.x,
      top: p.y,
      width: p.w,
      height: p.h,
      background: p.c,
      borderRadius: p.r,
      border: p.border,
      boxSizing: "border-box",
    }}
  />
);

/** ilha dinâmica + barra de navegação, idênticas nas três telas */
export function NavBar() {
  return (
    <>
      <Rect x={141} y={15} w={114} h={32} r={16} c="#000" />
      <Rect x={232} y={27} w={7} h={7} r={4} c="#1B1B4D" />
      <svg style={{ position: "absolute", left: 16, top: 66 }} width="18" height="28" viewBox="0 0 18 28">
        <path d="M14 3 L4 14 L14 25" fill="none" stroke="#E2E2E4" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <T x={136} top={65} size={21} lh={29} weight={700} color="#FFFFFF">
        Investimentos
      </T>
      <svg style={{ position: "absolute", left: 362, top: 70 }} width="24" height="19" viewBox="0 0 24 19">
        {[0, 7.4, 14.8].map((y) => (
          <rect key={y} x="0" y={y} width="24" height="2.2" rx="1.1" fill="#E8E8EA" />
        ))}
      </svg>
    </>
  );
}

/** bloco "Todas as contas / Saldo / Trocar conta" — só nas telas 1 e 2 */
export function AccountBlock() {
  return (
    <>
      <T x={14} top={129.5} size={17} lh={24} color={C.txt}>
        Todas as contas
      </T>
      <T x={14} top={155.5} size={17} lh={24} color={C.txt}>
        Saldo disponível: <b style={{ fontWeight: 700 }}>R$ 130.000,00</b>
      </T>
      <svg style={{ position: "absolute", left: 363, top: 158 }} width="23" height="18" viewBox="0 0 23 18">
        <path d="M1.2 9S4.9 2.6 11.5 2.6 21.8 9 21.8 9s-3.7 6.4-10.3 6.4S1.2 9 1.2 9Z" fill="none" stroke={C.red} strokeWidth="1.5" />
        <circle cx="11.5" cy="9" r="3.1" fill="none" stroke={C.red} strokeWidth="1.5" />
      </svg>
      <T x={14} top={192} size={20} lh={28} color={C.red} underline>
        Trocar conta
      </T>
    </>
  );
}

/** abas. `inkTop` é a altura da tinta medida; `bar` é o retângulo do sublinhado vermelho. */
export function Tabs({
  ativo,
  xs,
  inkTop,
  linha,
  bar,
}: {
  ativo: 0 | 1 | 2;
  xs: [number, number, number];
  inkTop: number;
  linha: { y: number; c: string; h?: number };
  bar: { x: number; w: number; y: number };
}) {
  const rotulos = ["Patrimônio", "Rentabilidade", "Evolução"];
  return (
    <>
      {rotulos.map((r, i) => (
        <T key={r} x={xs[i]} top={inkTop - 7} size={20} lh={28} color={i === ativo ? C.red : "#FFFFFF"}>
          {r}
        </T>
      ))}
      <Rect x={0} y={linha.y} w={SCR_W} h={linha.h ?? 1.5} c={linha.c} />
      <Rect x={bar.x} y={bar.y} w={bar.w} h={3} c={C.red} />
    </>
  );
}

/** Botão com o rótulo centralizado na horizontal e na altura medida na referência.
 *  `stroke` engrossa a letra: a família só tem Light/Regular/Bold, então o "medium" sai de um
 *  contorno fino na própria cor — não existe arquivo de peso 500 pra carregar. */
export function Botao(p: {
  x: number;
  y: number;
  w: number;
  h: number;
  texto: string;
  top: number;
  color: string;
  c?: string;
  border?: string;
  weight?: number;
  stroke?: string;
}) {
  return (
    <>
      <Rect x={p.x} y={p.y} w={p.w} h={p.h} r={6} c={p.c} border={p.border} />
      <div
        style={{
          position: "absolute",
          left: p.x,
          top: p.top,
          width: p.w,
          textAlign: "center",
          fontSize: 20,
          lineHeight: "28px",
          fontWeight: p.weight ?? 400,
          color: p.color,
          WebkitTextStroke: p.stroke,
        }}
      >
        {p.texto}
      </div>
    </>
  );
}

/** Catmull-Rom -> bezier: curva suave passando por todos os pontos traçados da referência */
export function smooth(pts: [number, number][]) {
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    d += ` C${p1[0] + (p2[0] - p0[0]) / 6} ${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6} ${
      p2[1] - (p3[1] - p1[1]) / 6
    } ${p2[0]} ${p2[1]}`;
  }
  return d;
}

/** badge verde "+ X%" */
export function Badge({ x, y, w, h, texto }: { x: number; y: number; w: number; h: number; texto: string }) {
  return (
    <>
      <Rect x={x} y={y} w={w} h={h} r={5} c="#91E785" />
      <T x={x + 11} top={y + 1.5} size={16.5} lh={21} weight={700} color="#1E4D1A">
        {texto}
      </T>
    </>
  );
}

/* ================= motion ================= */
// Um relógio só, em segundos, descendo por contexto. Nada de CSS animation: o frame N é sempre
// idêntico, o que mantém a página capturável quadro a quadro.

export const Clock = createContext(0);
export const useT = () => useContext(Clock);

export const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
export const easeOut = (p: number) => 1 - Math.pow(1 - p, 3);
export const easeInOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
export const backOut = (p: number) => 1 + 2.4 * Math.pow(p - 1, 3) + 1.4 * Math.pow(p - 1, 2);
export const seg = (t: number, start: number, dur: number) => clamp01((t - start) / dur);

/** Entrada padrão: sobe `dist`px e aparece. Cobre a tela inteira e não cria contexto de
 *  posicionamento novo pros filhos — eles continuam com as coordenadas da referência. */
export function In({
  d,
  dist = 12,
  dur = 0.45,
  children,
}: {
  d: number;
  dist?: number;
  dur?: number;
  children: React.ReactNode;
}) {
  const p = easeOut(seg(useT(), d, dur));
  if (p <= 0) return null;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: p, transform: `translateY(${(1 - p) * dist}px)` }}>
      {children}
    </div>
  );
}

/** R$ sem Intl: evita o servidor e o navegador formatarem diferente */
export const brl = (n: number) => {
  const [i, d] = Math.abs(n).toFixed(2).split(".");
  return `R$ ${i.replace(/\B(?=(\d{3})+(?!\d))/g, ".")},${d}`;
};

/** Valor subindo de 0 até `to`. Como a tela é vetor e a fonte é a do mockup, o número é texto de
 *  verdade do início ao fim — sem troca cruzada nem aperto de largura. */
export function Money({
  x,
  top,
  size,
  lh,
  color,
  weight = 400,
  to,
  prefix = "",
  d,
  dur,
  center,
}: {
  x: number;
  top: number;
  size: number;
  lh: number;
  color: string;
  weight?: number;
  to: number;
  prefix?: string;
  d: number;
  dur: number;
  /** centraliza na largura da tela em vez de ancorar em `x` */
  center?: boolean;
}) {
  const t = useT();
  const p = easeInOut(seg(t, d, dur));
  if (p <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: center ? 0 : x,
        top,
        width: center ? SCR_W : undefined,
        textAlign: center ? "center" : undefined,
        fontSize: size,
        fontWeight: weight,
        lineHeight: `${lh}px`,
        color,
        whiteSpace: "nowrap",
        fontVariantNumeric: "tabular-nums",
        opacity: clamp01(seg(t, d, 0.3)),
      }}
    >
      {prefix + brl(p * to)}
    </div>
  );
}

/** Ponto do gráfico: estoura quando a ponta da linha passa por ele. */
export function Dot({
  cx,
  cy,
  r,
  fill,
  stroke,
  sw = 2,
  d,
}: {
  cx: number;
  cy: number;
  r: number;
  fill: string;
  stroke: string;
  sw?: number;
  d: number;
}) {
  const p = seg(useT(), d, 0.42);
  if (p <= 0) return null;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={r * (0.3 + backOut(p) * 0.7)}
      fill={fill}
      stroke={stroke}
      strokeWidth={sw}
      opacity={clamp01(p * 2.5)}
    />
  );
}

/** Quando a ponta da linha chega em `x`, dado que ela varre de `x0` a `x1` entre `d` e `d+dur`. */
export const chegaEm = (x: number, x0: number, x1: number, d: number, dur: number) =>
  d + dur * clamp01((x - x0) / (x1 - x0));
