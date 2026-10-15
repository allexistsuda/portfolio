"use client";

import { santander } from "../font";
import { AccountBlock, Badge, BandIn, C, In, Money, NavBar, Rect, SCR_H, SCR_W, T, Tabs, clamp01, easeInOut, seg, useT } from "./parts";

// Tela 1 (Patrimônio). A rosca se desenha no sentido horário e o valor do miolo sobe JUNTO com
// ela — mesmo início, mesma duração, mesma curva, fecham no mesmo frame.

const BODY = "#141416";
const CARD = "#1F1E22";

/* rosca: graus a partir das 12h, sentido horário — medidos na referência */
const ARCS: [number, number, string][] = [
  [0.2, 144.0, "#3BC5D4"],
  [144.5, 179.2, "#41A875"],
  [179.8, 230.8, "#ED6C67"],
  [231.0, 287.8, "#94CC7E"],
  [288.2, 330.5, "#C05A55"], // tijolo, não salmão: na referência este arco é bem mais fechado
  [331.5, 359.2, "#FBD886"],
];
const ESPESSURA = 6.8; // medida na referência: o anel dela dá ~8px com o antialiasing, o meu
// com 6 dava ~7 — um fio mais fino, que era o que saltava no olho
const CX = 199;
const CY = 468;
const RR = 117.5; // meio do traço (externo 120,5)

const ROSCA = { d: 0.3, dur: 0.85 };

function Rosca() {
  const p = easeInOut(seg(useT(), ROSCA.d, ROSCA.dur));
  if (p <= 0) return null;
  const varrido = p * 360;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0 }} width={SCR_W} height={SCR_H}>
      <g transform={`rotate(-90 ${CX} ${CY})`}>
        {ARCS.map(([a, b, cor], i) => {
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

export default function Screen1() {
  return (
    <div
      className={santander.className}
      style={{ position: "relative", width: SCR_W, height: SCR_H, background: "#000", overflow: "hidden" }}
    >
      <BandIn y={0} h={111} c={C.nav} d={0} />
      <BandIn y={111} h={129} c={C.panel} d={0.05} />
      <BandIn y={240} h={618} c={BODY} d={0.09} />

      <In d={0} dist={12}>
        <NavBar />
      </In>
      <In d={0.08} dist={12}>
        <AccountBlock />
      </In>
      <In d={0.22} dist={12}>
        <Tabs ativo={0} xs={[15, 150, 307]} inkTop={280} linha={{ y: 313, c: "#878789" }} bar={{ x: 0, w: 132, y: 311 }} />
      </In>

      <Rosca />
      <In d={0.4} dist={10}>
        <T x={158} top={418.5} size={18} lh={25} color="#D9D9DB">
          Patrimônio
        </T>
      </In>
      <Money x={136} top={446} size={20} lh={28} color="#F4F4F4" to={900000} d={ROSCA.d} dur={ROSCA.dur} />
      <In d={0.72} dist={10}>
        <T x={126} top={487} size={20} lh={28} color={C.red} underline>
          Detalhar carteira
        </T>
      </In>

      {/* card de rendimentos */}
      <In d={0.8} dist={16}>
        <Rect x={0} y={613} w={SCR_W} h={155} c={CARD} />
        <T x={29} top={632.5} size={17.5} lh={24} color="#D6D6D8">
          Rendimentos de 02/01 a 08/05
        </T>
      </In>
      <Money x={30} top={658} size={20} lh={28} weight={700} color="#8FE084" to={12550} prefix="+ " d={0.86} dur={0.6} />
      <In d={1.15} dist={8}>
        <Badge x={291} y={659} w={79} h={26} texto="+ 22,2%" />
      </In>
      <In d={1.22} dist={14}>
        <Rect x={29} y={703} w={340} h={1.5} c="#5A595D" />
        <T x={29} top={723} size={18} lh={24} weight={700} color="#EDEDEF">
          Detalhar patrimônio
        </T>
        <svg style={{ position: "absolute", left: 354, top: 728 }} width="14" height="21" viewBox="0 0 14 21">
          <path d="M3 2 L11 10.5 L3 19" fill="none" stroke="#A9A8AC" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </In>
      <In d={1.32} dist={14}>
        <T x={14} top={799.5} size={25.5} lh={35} color="#EAEAEC">
          Sugestões pra você
        </T>
      </In>
    </div>
  );
}
