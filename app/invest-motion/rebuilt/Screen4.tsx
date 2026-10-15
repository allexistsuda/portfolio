"use client";

import { santander } from "../font";
import {
  BandIn, Botao, C, In, Money, NavBar, Rect, SCR_H, SCR_W, T,
  clamp01, easeInOut, seg, useT,
} from "./parts";

// Tela 4 (Carteira - Produtos), montada a partir de santander-2.png. O cabeçalho é o nosso, igual
// ao das outras telas; da linha da conta pra baixo segue a referência nova.
//
// Os ângulos da rosca foram medidos na imagem — repare que eles não batem exatamente com as
// porcentagens da legenda (o ciano ocupa 40° a mais do que os 35% diriam). Mantive o que está
// desenhado lá, não o que a legenda promete.

const BODY = "#141416";
const ROSCA_ARCS: [number, number, string][] = [
  [0.5, 144.5, "#2FD4DE"],
  [145.0, 229.5, "#F5696A"],
  [230.0, 288.0, "#87CE7B"],
  [288.5, 331.0, "#C25255"],
  [332.0, 359.5, "#FFD684"],
];
const CX = 199;
const CY = 410;
const RR = 100;
const ESPESSURA = 6.8;
const DIAL = { d: 0.42, dur: 0.95 };

/* legenda: [rótulo, %, cor, x, largura] por linha */
const CHIPS: [string, string, string, number, number][][] = [
  [
    ["CDB", "35%", "#2FD4DE", 14, 166],
    ["Poupança", "30%", "#F5696A", 190, 192],
  ],
  [
    ["Previdência", "15%", "#87CE7B", 14, 196],
    ["Algo+", "12%", "#C25255", 220, 150],
  ],
  [["Ações", "8%", "#FFD684", 14, 148]],
];

function Rosca() {
  const p = easeInOut(seg(useT(), DIAL.d, DIAL.dur));
  if (p <= 0) return null;
  const varrido = p * 360;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0 }} width={SCR_W} height={SCR_H}>
      <g transform={`rotate(-90 ${CX} ${CY})`}>
        {ROSCA_ARCS.map(([a, b, cor], i) => {
          const visivel = clamp01((varrido - a) / (b - a)) * (b - a);
          if (visivel <= 0) return null;
          return (
            <circle
              key={i}
              cx={CX}
              cy={CY}
              r={RR}
              fill="none"
              stroke={cor}
              strokeWidth={ESPESSURA}
              pathLength={360}
              strokeDasharray={`${visivel} 360`}
              strokeDashoffset={-a}
            />
          );
        })}
      </g>
    </svg>
  );
}

function Chip({ rotulo, pct, cor, x, w, y }: { rotulo: string; pct: string; cor: string; x: number; w: number; y: number }) {
  return (
    <>
      <Rect x={x} y={y} w={w} h={46} r={23} border="1px solid #46454B" />
      <div style={{ position: "absolute", left: x + 16, top: y + 16, width: 14, height: 14, borderRadius: 7, background: cor }} />
      <T x={x + 40} top={y + 9} size={17} lh={24} color="#E4E4E6">
        {rotulo}
      </T>
      <div
        style={{
          position: "absolute",
          left: x,
          top: y + 9,
          width: w - 18,
          textAlign: "right",
          fontSize: 17,
          lineHeight: "24px",
          fontWeight: 700,
          color: "#FFFFFF",
        }}
      >
        {pct}
      </div>
    </>
  );
}

export default function Screen4() {
  return (
    <div
      className={santander.className}
      style={{ position: "relative", width: SCR_W, height: SCR_H, background: "#000", overflow: "hidden" }}
    >
      <BandIn y={0} h={111} c={C.nav} d={0} />
      <BandIn y={111} h={61} c={C.panel} d={0.05} />
      <BandIn y={172} h={686} c={BODY} d={0.09} />

      <In d={0} dist={12}>
        <NavBar />
      </In>
      <In d={0.1} dist={12}>
        <T x={14} top={127} size={17} lh={24} color="#E9E9EB">
          Todas as contas
        </T>
        <div style={{ position: "absolute", left: 0, top: 127, width: 383, textAlign: "right" }}>
          <span style={{ fontSize: 17, lineHeight: "24px", color: C.red, textDecoration: "underline", textUnderlineOffset: 3 }}>
            Trocar
          </span>
        </div>
      </In>

      <In d={0.22} dist={12}>
        <div
          style={{ position: "absolute", left: 0, top: 193, width: SCR_W, textAlign: "center", fontSize: 20, lineHeight: "28px", fontWeight: 700, color: "#F2F2F4" }}
        >
          Carteira - Produtos
        </div>
      </In>

      {/* olho e sincronizar, nos ombros da rosca */}
      <In d={0.32} dist={10}>
        <svg style={{ position: "absolute", left: 20, top: 296 }} width="26" height="22" viewBox="0 0 26 22">
          <path d="M2 11S5.6 4.6 13 4.6 24 11 24 11s-3.6 6.4-11 6.4S2 11 2 11Z" fill="none" stroke={C.red} strokeWidth="1.6" />
          <circle cx="13" cy="11" r="3.4" fill="none" stroke={C.red} strokeWidth="1.6" />
          <path d="M3 20 L23 2" stroke={C.red} strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        {/* refresh: arco quase fechado com a seta no canto superior direito */}
        <svg style={{ position: "absolute", left: 350, top: 294 }} width="25" height="25" viewBox="0 0 24 24">
          <path
            d="M20.5 14.5A9 9 0 1 1 18.4 5.6L22.5 9.5"
            fill="none"
            stroke={C.red}
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M22.5 4.2V9.7H17" fill="none" stroke={C.red} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </In>

      <Rosca />
      <In d={0.56} dist={10}>
        <div style={{ position: "absolute", left: 0, top: 371, width: SCR_W, textAlign: "center", fontSize: 17, lineHeight: "24px", color: "#D9D9DB" }}>
          Patrimônio
        </div>
      </In>
      <Money center x={0} top={396} size={21} lh={29} weight={700} color="#FAFAFA" to={23456.78} d={DIAL.d} dur={DIAL.dur} />
      <In d={1.0} dist={10}>
        <div style={{ position: "absolute", left: 0, top: 436, width: SCR_W, textAlign: "center" }}>
          <span style={{ fontSize: 19, lineHeight: "27px", color: C.red, textDecoration: "underline", textUnderlineOffset: 3 }}>
            Detalhar
          </span>
        </div>
      </In>

      {CHIPS.map((linha, li) =>
        linha.map(([rotulo, pct, cor, x, w], ci) => (
          <In key={rotulo} d={0.9 + li * 0.1 + ci * 0.05} dist={12}>
            <Chip rotulo={rotulo} pct={pct} cor={cor} x={x} w={w} y={556 + li * 54} />
          </In>
        )),
      )}

      <In d={1.3} dist={18}>
        <Botao x={14} y={760} w={369} h={57} c="#EE6C67" texto="Investir" top={773} color="#2A2024" stroke="0.4px" />
      </In>
    </div>
  );
}
