"use client";

import { santander } from "../font";
import {
  Badge, BandIn, Botao, C, Dot, In, Money, NavBar, SCR_H, SCR_W, T, Tabs,
  chegaEm, clamp01, easeInOut, easeOut, seg, smooth, useT,
} from "./parts";

// Tela 3 (Evolução). A curva de área se desenha da esquerda pra direita, o preenchimento vem
// atrás pelo mesmo recorte, e cada mês estoura quando a ponta passa nele. No fim, a linha
// vertical desce do último ponto — é o gesto de "selecionei este mês".

const AZUL = "#6D97D4";
const SERIE: [number, number][] = [
  [0, 424], [20, 419], [40, 406], [60, 390], [80, 372], [95, 364], [120, 367], [140, 373],
  [160, 381], [185, 388], [210, 394], [230, 394], [250, 388], [275, 375], [300, 362], [320, 348],
  [345, 334], [366, 327],
];
const PONTOS: [number, number][] = [
  [95, 364],
  [185, 388],
  [275, 375],
  [366, 327],
];
const MESES = ["Jan/23", "Fev/23", "Mar/23", "Abr/23"];
const X0 = 0;
const X1 = 366;
const BASE = 455; // onde o preenchimento encosta
const GRADE = [310, 345, 380, 415, 450];

const LINHA = { d: 0.36, dur: 0.85 };
const VERTICAL = { d: 1.2, dur: 0.3 };

function Grafico() {
  const t = useT();
  const p = easeInOut(seg(t, LINHA.d, LINHA.dur));
  const d = smooth(SERIE);
  const pv = easeOut(seg(t, VERTICAL.d, VERTICAL.dur));
  return (
    <svg style={{ position: "absolute", left: 0, top: 0 }} width={SCR_W} height={SCR_H}>
      <defs>
        <linearGradient id="g3" x1="0" y1="320" x2="0" y2={BASE} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4C8BDA" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#4C8BDA" stopOpacity="0.02" />
        </linearGradient>
        <clipPath id="c3">
          <rect x={X0 - 2} y={300} width={(X1 - X0 + 4) * p} height={180} />
        </clipPath>
      </defs>

      {GRADE.map((y, i) => (
        <line
          key={y}
          x1={0}
          y1={y}
          x2={382 * easeInOut(seg(t, 0.26 + i * 0.025, 0.35))}
          y2={y}
          stroke="#232326"
          strokeWidth="1"
        />
      ))}

      <g clipPath="url(#c3)">
        <path d={`${d} L${X1} ${BASE} L${X0} ${BASE} Z`} fill="url(#g3)" />
      </g>
      {/* a linha se desenha: o dash corre ao longo do próprio traço */}
      <path
        d={d}
        fill="none"
        stroke={AZUL}
        strokeWidth="2.4"
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="1 1"
        strokeDashoffset={1 - p}
      />

      {pv > 0 && <line x1={366} y1={327} x2={366} y2={327 + (452 - 327) * pv} stroke="#FFFFFF" strokeWidth="1.6" />}

      {PONTOS.map(([x, y], i) => {
        const ultimo = i === PONTOS.length - 1;
        return (
          <Dot
            key={x}
            cx={x}
            cy={y}
            r={ultimo ? 6 : 5.4}
            fill={ultimo ? "#FFFFFF" : "#1C1E23"}
            stroke="#FFFFFF"
            d={chegaEm(x, X0, X1, LINHA.d, LINHA.dur)}
          />
        );
      })}
    </svg>
  );
}

function Mes({ i }: { i: number }) {
  const p = easeOut(seg(useT(), chegaEm(PONTOS[i][0], X0, X1, LINHA.d, LINHA.dur) + 0.06, 0.35));
  if (p <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: PONTOS[i][0] - 46,
        top: 462,
        width: 92,
        textAlign: "center",
        fontSize: 17,
        lineHeight: "24px",
        color: "#D5D5D7",
        whiteSpace: "nowrap",
        opacity: clamp01(p * 1.4),
        transform: `rotate(-45deg) translateY(${(1 - p) * 10}px)`,
      }}
    >
      {MESES[i]}
    </div>
  );
}

export default function Screen3() {
  return (
    <div
      className={santander.className}
      style={{ position: "relative", width: SCR_W, height: SCR_H, background: "#000", overflow: "hidden" }}
    >
      <BandIn y={0} h={112} c={C.nav} d={0} />
      <BandIn y={674} h={184} c={C.nav} d={0.07} />

      <In d={0} dist={12}>
        <NavBar />
      </In>
      <In d={0.1} dist={12}>
        <Tabs ativo={1} xs={[16, 142, 295]} inkTop={135} linha={{ y: 166.5, c: "#9F9F9F" }} bar={{ x: 140, w: 124, y: 164 }} />
      </In>

      <In d={0.2} dist={12}>
        <T x={10} top={211} size={20} lh={28} color="#E2E2E4">
          Selecione um mês no gráfico para detalhar
        </T>
      </In>
      <In d={0.27} dist={12}>
        <T x={10} top={244} size={20} lh={28} color="#E2E2E4">
          as informações.
        </T>
      </In>

      <Grafico />
      {[0, 1, 2, 3].map((i) => (
        <Mes key={i} i={i} />
      ))}

      <In d={0.6} dist={12}>
        <T x={10} top={533} size={18} lh={25} color="#BDBDBF">
          Patrimônio
        </T>
      </In>
      <Money x={11} top={560} size={20} lh={28} weight={700} color="#FAFAFA" to={850000} d={0.66} dur={0.6} />
      <In d={0.8} dist={12}>
        <T x={10} top={609} size={18} lh={25} color="#CBCBCD">
          Rendimentos de 01/04 a 30/4
        </T>
      </In>
      <Money x={11} top={642} size={20} lh={28} weight={700} color="#8BDC7F" to={8400} prefix="+ " d={0.86} dur={0.55} />
      <In d={1.1} dist={8}>
        <Badge x={320} y={643} w={70} h={26} texto="+ 8,5%" />
      </In>

      <In d={1.0} dist={18}>
        <Botao x={8} y={692.5} w={383} h={58} c="#EC6C67" texto="Investir" top={706} color="#2A2024" stroke="0.4px" />
      </In>
      <In d={1.08} dist={18}>
        <Botao x={8} y={766.5} w={383} h={58} border="1.5px solid #C9C9CB" texto="Resgatar" top={779} color="#E9E9EB" />
      </In>
    </div>
  );
}
