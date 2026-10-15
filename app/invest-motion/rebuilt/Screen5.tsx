"use client";

import { santander } from "../font";
import { BandIn, C, In, NavBar, Rect, SCR_H, SCR_W, T, easeOut, seg, useT } from "./parts";

// Tela 5 (Carteira - Renda variável), montada a partir de santander-2.png. Cabeçalho é o nosso;
// da linha da conta pra baixo segue a referência nova.
//
// As barras não são decorativas: a largura de cada uma é o valor investido sobre o total, que é
// exatamente a proporção medida na imagem (AÇÕES ocupa 59% do trilho para 600k de 1M).

const BODY = "#141416";
const TRILHO = "#2E2D33";

type Linha = { grupo: string; rent: string; valor: number; cor: string };
const LINHAS: Linha[] = [
  { grupo: "AÇÕES", rent: "+ 1,50%", valor: 600000, cor: "#FFD684" },
  { grupo: "ALGO+", rent: "+ 1,00%", valor: 200000, cor: "#BB4D4E" },
  { grupo: "ETF", rent: "+ 1,00%", valor: 100000, cor: "#3F6FD2" },
  { grupo: "FII", rent: "+ 1,30%", valor: 50000, cor: "#5FA85F" },
  { grupo: "TESOURO", rent: "+ 0,90%", valor: 50000, cor: "#EFC2CE" },
];
const TOTAL_INVESTIDO = LINHAS.reduce((s, l) => s + l.valor, 0);
const Y0 = 286; // tinta do rótulo da 1ª linha
const PASSO = 66;
const TRILHO_X = 22;
const TRILHO_W = 353;

const brlCheio = (n: number) => `R$${n.toFixed(2).split(".")[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".")},00`;

/** a barra cresce da esquerda até a fatia que o grupo representa */
function Barra({ l, y, d }: { l: Linha; y: number; d: number }) {
  const p = easeOut(seg(useT(), d, 0.7));
  if (p <= 0) return null;
  return (
    <>
      <Rect x={TRILHO_X} y={y} w={TRILHO_W} h={7} r={3.5} c={TRILHO} />
      <Rect x={TRILHO_X} y={y} w={TRILHO_W * (l.valor / TOTAL_INVESTIDO) * p} h={7} r={3.5} c={l.cor} />
    </>
  );
}

/* cinco períodos dividindo a largura da tela; o último é o ativo */
const CHIPS = ["1M", "3M", "6M", "9M", "12M"];
const CHIP_X0 = 8;
const CHIP_W = 68;
const CHIP_GAP = 9;

export default function Screen5() {
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
          Ag 2050 Cc 01234567-1
        </T>
        <div style={{ position: "absolute", left: 0, top: 127, width: 383, textAlign: "right" }}>
          <span style={{ fontSize: 17, lineHeight: "24px", color: C.red, textDecoration: "underline", textUnderlineOffset: 3 }}>
            Trocar
          </span>
        </div>
      </In>

      <In d={0.22} dist={12}>
        <div style={{ position: "absolute", left: 0, top: 193, width: SCR_W, textAlign: "center", fontSize: 20, lineHeight: "28px", fontWeight: 700, color: "#F2F2F4" }}>
          Carteira - Renda variável
        </div>
        <svg style={{ position: "absolute", left: 318, top: 201 }} width="18" height="12" viewBox="0 0 18 12">
          <path d="M2 2.5 L9 9.5 L16 2.5" fill="none" stroke="#E4E4E6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </In>

      {/* cabeçalho da tabela */}
      <In d={0.32} dist={12}>
        <T x={22} top={233} size={16} lh={22} color="#B9B9BC">
          Grupo
        </T>
        <div style={{ position: "absolute", left: 140, top: 233, width: 110, textAlign: "center", fontSize: 16, lineHeight: "22px", color: "#B9B9BC" }}>
          Rent.
        </div>
        <div style={{ position: "absolute", left: 0, top: 233, width: 375, textAlign: "right", fontSize: 16, lineHeight: "22px", color: "#B9B9BC" }}>
          Valor investido
        </div>
      </In>

      {LINHAS.map((l, i) => {
        const y = Y0 + i * PASSO;
        const d = 0.44 + i * 0.09;
        return (
          <div key={l.grupo}>
            <In d={d} dist={12}>
              <T x={22} top={y - 7} size={17} lh={24} color="#EDEDEF">
                {l.grupo}
              </T>
              <div style={{ position: "absolute", left: 140, top: y - 7, width: 110, textAlign: "center", fontSize: 17, lineHeight: "24px", color: "#8FE084" }}>
                {l.rent}
              </div>
              <div style={{ position: "absolute", left: 0, top: y - 7, width: 375, textAlign: "right", fontSize: 17, lineHeight: "24px", color: "#EDEDEF" }}>
                {brlCheio(l.valor)}
              </div>
            </In>
            <Barra l={l} y={y + 26} d={d + 0.12} />
          </div>
        );
      })}

      {/* período */}
      <In d={0.95} dist={12}>
        {CHIPS.map((c, i) => {
          const ativo = i === CHIPS.length - 1;
          const x = CHIP_X0 + i * (CHIP_W + CHIP_GAP);
          return (
            <div key={c}>
              <Rect x={x} y={616} w={CHIP_W} h={44} r={22} c={ativo ? C.red : undefined} border={ativo ? undefined : "1px solid #46454B"} />
              <div
                style={{
                  position: "absolute",
                  left: x,
                  top: 625,
                  width: CHIP_W,
                  textAlign: "center",
                  fontSize: 17,
                  lineHeight: "24px",
                  color: ativo ? "#2A2024" : "#E4E4E6",
                }}
              >
                {c}
              </div>
            </div>
          );
        })}
      </In>

      {/* faixa de cotações */}
      <In d={1.08} dist={12}>
        <Rect x={0} y={688} w={SCR_W} h={48} c="#000000" />
        <T x={22} top={699} size={16} lh={22} color="#EDEDEF">
          MGLU3 R$ 14,23
        </T>
        <T x={148} top={699} size={16} lh={22} color={C.red}>
          - 2,40%
        </T>
        <Rect x={224} y={700} w={1} h={24} c="#4A494E" />
        <T x={246} top={699} size={16} lh={22} color="#EDEDEF">
          SANB11 R$ 5,52
        </T>
      </In>

      {/* abas do rodapé */}
      <In d={1.18} dist={12}>
        <div style={{ position: "absolute", left: 0, top: 750, width: 198, textAlign: "center", fontSize: 20, lineHeight: "28px", color: C.red }}>
          Mercado
        </div>
        <div style={{ position: "absolute", left: 198, top: 750, width: 199, textAlign: "center", fontSize: 20, lineHeight: "28px", color: "#FFFFFF" }}>
          Ordens
        </div>
        <Rect x={0} y={790} w={SCR_W} h={1.5} c="#5A595D" />
        <Rect x={28} y={788} w={142} h={3} c={C.red} />
      </In>

      <In d={1.3} dist={14}>
        <T x={22} top={812} size={25.5} lh={35} color="#EAEAEC">
          Buscar ativos
        </T>
      </In>
    </div>
  );
}
