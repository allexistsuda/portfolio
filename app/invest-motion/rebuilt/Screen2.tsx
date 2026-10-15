"use client";

import { santander } from "../font";
import {
  AccountBlock, Badge, BandIn, Botao, C, Dot, In, Money, NavBar, Rect, SCR_H, SCR_W, T, Tabs,
  chegaEm, easeInOut, seg, smooth, useT,
} from "./parts";

// Tela 2 (Rentabilidade). As duas séries foram traçadas pixel a pixel da referência, amostrando a
// cor de cada uma coluna a coluna, e passam por uma Catmull-Rom.
//
// A linha da carteira SE DESENHA (dash correndo ao longo do próprio traço). A do CDI é tracejada,
// e aí o dash já é o padrão visual — então ela é revelada por um recorte que acompanha a mesma
// ponta. Os preenchimentos seguem o mesmo recorte, e cada ponto estoura quando a ponta passa nele.

const VERDE = "#5FD39A";
const CIANO = "#5FC9D4";

const CARTEIRA: [number, number][] = [
  [66, 697], [76, 698], [96, 699], [116, 709], [136, 712], [156, 702], [176, 684], [196, 670],
  [216, 670], [236, 680], [256, 685], [276, 678], [296, 662], [316, 646], [336, 638], [356, 630], [376, 624],
];
const CDI: [number, number][] = [
  [66, 742], [86, 752], [106, 759], [136, 760], [166, 759], [196, 757], [226, 750], [256, 740],
  [286, 728], [316, 713], [346, 684], [376, 647],
];
const X0 = 66;
const X1 = 376;
const BASE = 770; // onde o preenchimento encosta
const GRADE = [622, 665, 707, 750]; // 3,00% · 2,00% · 1,00% · 0,00%
const EIXO = ["3,00%", "2,00%", "1,00%", "0,00%"];

const LINHA = { d: 0.78, dur: 0.75 };
const TRACEJADA = { d: 0.86, dur: 0.75 };

function Grafico() {
  const t = useT();
  const pa = easeInOut(seg(t, LINHA.d, LINHA.dur));
  const pb = easeInOut(seg(t, TRACEJADA.d, TRACEJADA.dur));
  const dCart = smooth(CARTEIRA);
  const dCdi = smooth(CDI);
  return (
    <svg style={{ position: "absolute", left: 0, top: 0 }} width={SCR_W} height={SCR_H}>
      <defs>
        <linearGradient id="g2a" x1="0" y1="600" x2="0" y2={BASE} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4FBF86" stopOpacity="0.42" />
          <stop offset="100%" stopColor="#4FBF86" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="g2b" x1="0" y1="640" x2="0" y2={BASE} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4FB8C4" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#4FB8C4" stopOpacity="0.02" />
        </linearGradient>
        <clipPath id="c2a">
          <rect x={X0 - 2} y={590} width={(X1 - X0 + 4) * pa} height={200} />
        </clipPath>
        <clipPath id="c2b">
          <rect x={X0 - 2} y={590} width={(X1 - X0 + 4) * pb} height={200} />
        </clipPath>
      </defs>

      {GRADE.map((y, i) => (
        <line
          key={y}
          x1={X0}
          y1={y}
          x2={66 + 316 * easeInOut(seg(t, 0.68 + i * 0.03, 0.35))}
          y2={y}
          stroke="#3A3A3D"
          strokeWidth="1"
        />
      ))}

      <g clipPath="url(#c2b)">
        <path d={`${dCdi} L${X1} ${BASE} L${X0} ${BASE} Z`} fill="url(#g2b)" />
        <path d={dCdi} fill="none" stroke={CIANO} strokeWidth="2" strokeDasharray="7 6" strokeLinecap="round" />
      </g>
      <g clipPath="url(#c2a)">
        <path d={`${dCart} L${X1} ${BASE} L${X0} ${BASE} Z`} fill="url(#g2a)" />
      </g>
      {/* a linha da carteira se desenha de verdade: o dash corre ao longo do traço */}
      <path
        d={dCart}
        fill="none"
        stroke={VERDE}
        strokeWidth="2.2"
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="1 1"
        strokeDashoffset={1 - pa}
      />

      {CARTEIRA.filter((_, i) => i % 2 === 1).map(([x, y]) => (
        <Dot key={`a${x}`} cx={x} cy={y} r={3.2} fill="#121214" stroke="#9BE8BE" sw={1.6} d={chegaEm(x, X0, X1, LINHA.d, LINHA.dur)} />
      ))}
      {CDI.filter((_, i) => i % 2 === 1).map(([x, y]) => (
        <Dot key={`b${x}`} cx={x} cy={y} r={3} fill="#121214" stroke="#8FDEE8" sw={1.6} d={chegaEm(x, X0, X1, TRACEJADA.d, TRACEJADA.dur)} />
      ))}
    </svg>
  );
}

export default function Screen2() {
  return (
    <div
      className={santander.className}
      style={{ position: "relative", width: SCR_W, height: SCR_H, background: "#000", overflow: "hidden" }}
    >
      <BandIn y={0} h={111} c={C.nav} d={0} />
      <BandIn y={111} h={130} c={C.panel} d={0.05} />
      <BandIn y={471} h={387} c={C.nav} d={0.09} />

      <In d={0} dist={12}>
        <NavBar />
      </In>
      <In d={0.08} dist={12}>
        <AccountBlock />
      </In>
      <In d={0.22} dist={12}>
        <Tabs ativo={1} xs={[15, 142, 294]} inkTop={278} linha={{ y: 309, c: "#838383" }} bar={{ x: 140, w: 124, y: 308 }} />
      </In>

      <In d={0.32} dist={18}>
        <Rect x={11} y={329} w={371} h={128} r={9} c="#1E1E20" />
        <T x={31} top={349} size={20} lh={28} color="#E4E4E6">
          Rendimentos da carteira
        </T>
        <T x={30} top={379} size={17} lh={24} color="#D3D3D6">
          de 02/01 a 08/05
        </T>
      </In>
      <Money x={31} top={414} size={20} lh={28} weight={700} color="#8DDB82" to={12550} prefix="+ " d={0.4} dur={0.6} />
      <In d={0.78} dist={8}>
        <Badge x={286} y={415} w={77} h={25} texto="+ 22,2%" />
      </In>

      <In d={0.5} dist={12}>
        <T x={14} top={491} size={17.5} lh={25} color="#CFCFD2">
          Compare sua carteira com os índices de mercado:
        </T>
      </In>

      <In d={0.58} dist={14}>
        <Rect x={11} y={531} w={180} h={52} r={7} border="1px solid #565559" />
        <T x={31} top={544} size={20} lh={28} color="#D8D8DB">
          Carteira
        </T>
        <T x={112} top={544} size={20} lh={28} weight={700} color="#8FE084">
          +2,2%
        </T>
      </In>
      <In d={0.64} dist={14}>
        <T x={195} top={544} size={18} lh={26} color="#8E8D91">
          ×
        </T>
      </In>
      <In d={0.7} dist={14}>
        <Rect x={206} y={531} w={181} h={52} r={7} border="1px solid #565559" />
        <T x={226} top={544} size={20} lh={28} color="#D8D8DB">
          CDI
        </T>
        <T x={266} top={544} size={20} lh={28} weight={700} color="#6FD2DC">
          +2,2%
        </T>
        <svg style={{ position: "absolute", left: 349, top: 548 }} width="20" height="14" viewBox="0 0 20 14">
          <path d="M2 3 L10 11 L18 3" fill="none" stroke="#D8D8DB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </In>

      {EIXO.map((r, i) => (
        <In key={r} d={0.68 + i * 0.03} dist={8}>
          <T x={15} top={GRADE[i] - 11.5} size={16} lh={22} color="#C3C3C6">
            {r}
          </T>
        </In>
      ))}
      <Grafico />

      <In d={1.0} dist={18}>
        <Botao x={13} y={777} w={371} h={57} c="#EE6C67" texto="Investir" top={790} color="#2A2024" stroke="0.4px" />
      </In>
    </div>
  );
}
