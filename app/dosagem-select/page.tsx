"use client";

import { useEffect, useRef, useState } from "react";

// Calculadora de dosagem — escolha da apresentação, em 3 tempos numa tomada só:
//   1. tela parada;
//   2. o campo do medicamento cresce pra fora do card e o fundo já escurece de leve
//      (o véu entra por baixo do campo, então quem escurece é o resto da tela, não ele);
//   3. "toque": o campo recua, o véu fecha por cima de tudo e a folha de apresentações
//      sobe por baixo, com as linhas entrando escalonadas.
//
// Regra de montagem das outras peças: tudo que tem letra é PNG recortado. Aqui os recortes
// saíram das próprias referências que o Allexis mandou — o mockup (1184x2000, tela a 1,941x)
// e o print da folha (1211px de largura = 375pt a 3,229x) — e não do Figma.
//
// Caixa, véu, folha, handle e divisórias são CSS: é geometria, e é isso que deixa animar
// escala, altura e opacidade sem trocar asset.

const A = "/dosagem/v2/";
const SW = 375; // tela em pt
const SH = 812;
const W = 1920; // palco do render
const H = 1080;

const DUR = 6;
const T = {
  zoom: 0.9, // campo começa a crescer — e o fundo a escurecer junto
  toque: 2.15, // recua, como quem é apertado
  veu: 2.28,
  folha: 2.32,
  linhas: 2.92, // linhas entram depois que a folha encosta
};
const D = { zoom: 0.55, toque: 0.32, veu: 0.5, folha: 0.62, linha: 0.26 };

const ESCALA_MAX = 1.12; // o campo passa da borda do card — é o ponto da ênfase
// O toque devolve o campo ao tamanho original. O que batia seco antes não era o destino,
// era o tempo: 0,16s. A 0,32s com entrada e saída suaves ele assenta em vez de estalar.
const ESCALA_TOQUE = 1;
const VEU_FOCO = 0.18; // escurecida leve durante o zoom
const VEU_MAX = 0.46; // véu cheio quando a folha sobe

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeOut = (p: number) => 1 - Math.pow(1 - clamp01(p), 3);
const easeInOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const ramp = (t: number, ini: number, dur: number) => clamp01((t - ini) / dur);

// --- geometria da tela (pt) ---
const CARD = { x: 15.83, y: 218, w: 343.26, h: 230.32 };
const MED = { x: 31.66, y: 234.98, w: 311.12, h: 44.24 };

// --- geometria da folha (pt), medida no print a 3,229x ---
const FOLHA = { h: 340, raio: 18.58 };
const FOLHA_Y = SH - FOLHA.h;
const HANDLE = { w: 39.95, h: 4.03, y: 9.91 };
const TITULO = { src: "t-escolher.png", x: 21.37, y: 41.49, w: 199.73, h: 17.34 };
const LINHAS = [
  { src: "o-0.png", x: 21.68, y: 79.89, w: 158.55, h: 15.48 }, // Rimadyl Injetável 5% (verde)
  { src: "o-1.png", x: 21.68, y: 131.92, w: 113.34, h: 15.48 },
  { src: "o-2.png", x: 21.68, y: 183.94, w: 113.96, h: 15.48 },
  { src: "o-3.png", x: 21.68, y: 235.96, w: 112.41, h: 15.48 },
  { src: "o-4.png", x: 21.68, y: 287.99, w: 120.46, h: 15.48 },
];
const CHECK = { src: "ic-check.png", x: 335.05, y: 75.87, w: 18.89, h: 19.2 };
const DIV = { x: 20.13, w: 334.76, y0: 112.25, passo: 51.97 };

/** escala e sombra do campo no instante t */
function campo(t: number) {
  if (t < T.zoom) return { s: 1, sombra: 0 };
  if (t < T.toque) {
    const p = easeOut(ramp(t, T.zoom, D.zoom));
    return { s: lerp(1, ESCALA_MAX, p), sombra: p };
  }
  const p = easeInOut(ramp(t, T.toque, D.toque));
  return { s: lerp(ESCALA_MAX, ESCALA_TOQUE, p), sombra: 1 - p };
}

export default function Page() {
  const [t, setT] = useState(0);
  const [fit, setFit] = useState(1);
  const origem = useRef(0);
  const pausado = useRef(false);
  const [run, setRun] = useState(0);

  useEffect(() => {
    const onFit = () => setFit(Math.min(window.innerWidth / W, window.innerHeight / H));
    onFit();
    window.addEventListener("resize", onFit);
    return () => window.removeEventListener("resize", onFit);
  }, []);

  // mesmos ganchos das outras peças: ?t=2.4 congela um instante, window.__t deixa o
  // scripts/capturar-frames.mjs pedir qualquer segundo sem recarregar.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("t");
    const congelado = run === 0 && q !== null && !Number.isNaN(Number(q)) ? Number(q) : null;
    let raf = 0;
    origem.current = performance.now();
    const tick = (agora: number) => {
      const pedido = (window as unknown as { __t?: number }).__t;
      if (typeof pedido === "number") {
        setT(Math.min(pedido, DUR));
        raf = requestAnimationFrame(tick);
        return;
      }
      if (congelado !== null) {
        setT(congelado);
        return;
      }
      if (!pausado.current) setT(Math.min((agora - origem.current) / 1000, DUR));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault();
        pausado.current = !pausado.current;
        origem.current = performance.now() - t * 1000;
      } else if (e.key === "r" || e.key === "R") {
        pausado.current = false;
        setT(0);
        setRun((r) => r + 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [t]);

  const f = campo(t);
  const fecha = easeInOut(ramp(t, T.veu, D.veu));
  // Dois véus: o de foco fica DEBAIXO do campo (escurece o resto enquanto ele cresce) e
  // sai de cena na mesma rampa em que o de cima entra — assim o fundo só escurece, nunca
  // clareia no meio da troca, e no fim campo e fundo ficam no mesmo tom.
  const veuFoco = VEU_FOCO * easeOut(ramp(t, T.zoom, D.zoom)) * (1 - fecha);
  const veuFolha = VEU_MAX * fecha;
  const folha = easeOut(ramp(t, T.folha, D.folha));

  return (
    <main style={{ width: "100vw", height: "100vh", background: "#111", overflow: "hidden", position: "relative" }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: W,
          height: H,
          transform: `translate(-50%,-50%) scale(${fit})`,
          background: "#f6f6f6",
        }}
      >
        <Celular>
          <Tela t={t} campo={f} veuFoco={veuFoco} veuFolha={veuFolha} folha={folha} />
        </Celular>
      </div>
    </main>
  );
}

/**
 * Moldura: o mockup que veio pronto (public/dosagem/v2/mockup.webp) — aro verde, botões,
 * sombra e entalhe já renderizados. A tela animada entra por cima do retângulo da tela,
 * com o mesmo raio de canto. A barra de status (relógio, sinal, wi-fi, bateria) foi
 * recortada do próprio mockup e volta por cima, senão ela sumiria debaixo da tela nova.
 *
 * Medidas tiradas pixel a pixel do mockup (1184x2000): tela em x 228, y 211, 728x1576,
 * raio 77 — 728px para 375pt dá 1,941x.
 */
const MOCK = { w: 1184, h: 2000, telaX: 228, telaY: 211, telaW: 728, telaH: 1576.4, raio: 77 };
const MS = H / MOCK.h; // o mockup inteiro cabe na altura do palco: nada de sombra cortada
const MOCK_X = (W - MOCK.w * MS) / 2;

function Celular({ children }: { children: React.ReactNode }) {
  const telaL = MOCK_X + MOCK.telaX * MS;
  const telaT = MOCK.telaY * MS;
  const telaW = MOCK.telaW * MS;
  const S = telaW / SW; // pt -> px do palco

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/dosagem/v2/mockup.webp"
        alt=""
        style={{ position: "absolute", left: MOCK_X, top: 0, width: MOCK.w * MS, height: H, maxWidth: "none" }}
      />
      <div
        style={{
          position: "absolute",
          left: telaL,
          top: telaT,
          width: telaW,
          height: MOCK.telaH * MS,
          borderRadius: MOCK.raio * MS,
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", left: 0, top: 0, width: SW, height: SH, transform: `scale(${S})`, transformOrigin: "top left" }}>
          {children}
        </div>
      </div>
    </>
  );
}

function P({ src, x, y, w, h, o = 1 }: { src: string; x: number; y: number; w: number; h: number; o?: number }) {
  // maxWidth:"none" é obrigatório: o preflight do Tailwind põe max-width:100% em toda img e
  // espremeria o PNG dentro de qualquer wrapper mais estreito.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={A + src} alt="" style={{ position: "absolute", left: x, top: y, width: w, height: h, maxWidth: "none", opacity: o }} />
  );
}

function Tela({
  t,
  campo: f,
  veuFoco,
  veuFolha,
  folha,
}: {
  t: number;
  campo: ReturnType<typeof campo>;
  veuFoco: number;
  veuFolha: number;
  folha: number;
}) {
  return (
    <div style={{ position: "absolute", inset: 0, background: "#fff" }}>
      <P src="ic-back.png" x={16.23} y={59.7} w={24.18} h={24.18} />
      <P src="ic-note.png" x={333.98} y={59.7} w={24.18} h={24.18} />
      <P src="tabs.png" x={15.5} y={115.86} w={359.19} h={36.27} />
      <P src="t-calculadora.png" x={16.23} y={181.41} w={239.46} h={18.87} />

      <div
        style={{
          position: "absolute",
          left: CARD.x,
          top: CARD.y,
          width: CARD.w,
          height: CARD.h,
          border: "1px solid #e7e7e7",
          borderRadius: 8,
          background: "#fff",
          boxSizing: "border-box",
        }}
      />

      <P src="box-especie.png" x={31.66} y={293.83} w={138.31} h={40.11} />
      <P src="t-peso-label.png" x={33.2} y={355.52} w={88.17} h={15.33} />
      <div
        style={{
          position: "absolute",
          left: 31.66,
          top: 380.68,
          width: 311.12,
          height: 44.24,
          border: "1px solid #bfbdb8",
          borderRadius: 8,
          background: "#fff",
          boxSizing: "border-box",
        }}
      />
      <P src="t-placeholder.png" x={45.45} y={396.51} w={65.47} h={13.27} />

      <P src="t-administracao.png" x={16.23} y={477.27} w={140.96} h={18.87} />
      <P src="r-card-via.png" x={16} y={513.8} w={163.67} h={146.27} />
      <P src="r-card-frequencia.png" x={194.81} y={513.8} w={163.67} h={146.27} />
      <P src="r-card-duracao.png" x={16} y={675.32} w={163.67} h={136.24} />
      <P src="r-card-tipo-dose.png" x={194.81} y={675.32} w={163.67} h={136.24} />

      {/* relógio, sinal, wi-fi, bateria e o entalhe — recortados do mockup e devolvidos
          por cima da tela animada. Ficam antes dos véus de propósito: escurecem junto. */}
      <P src="statusbar.png" x={0} y={0} w={375} h={44} />

      {/* véu de foco: entra DEBAIXO do campo, então escurece a tela sem apagar o que cresceu */}
      <div style={{ position: "absolute", inset: 0, background: "#000", opacity: veuFoco, pointerEvents: "none" }} />

      {/* campo do medicamento — cresce por cima do card e do véu de foco */}
      <div
        style={{
          position: "absolute",
          left: MED.x,
          top: MED.y,
          width: MED.w,
          height: MED.h,
          transform: `scale(${f.s})`,
          transformOrigin: "50% 50%",
          borderRadius: 8,
          filter: f.sombra > 0 ? `drop-shadow(0 ${7 * f.sombra}px ${20 * f.sombra}px rgba(20,32,24,${0.22 * f.sombra}))` : "none",
        }}
      >
        <P src="box-rimadyl.png" x={0} y={0} w={MED.w} h={MED.h} />
      </div>

      {/* véu da folha: esse sim passa por cima de tudo, campo incluído */}
      <div style={{ position: "absolute", inset: 0, background: "#000", opacity: veuFolha, pointerEvents: "none" }} />

      <Folha t={t} p={folha} />
    </div>
  );
}

/** folha de apresentações: sobe por baixo, linhas entram escalonadas depois que ela encosta */
function Folha({ t, p }: { t: number; p: number }) {
  if (p <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: FOLHA_Y,
        width: SW,
        height: FOLHA.h,
        background: "#fff",
        borderRadius: `${FOLHA.raio}px ${FOLHA.raio}px 0 0`,
        transform: `translateY(${(1 - p) * FOLHA.h}px)`,
        boxShadow: "0 -8px 28px rgba(0,0,0,.12)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: (SW - HANDLE.w) / 2,
          top: HANDLE.y,
          width: HANDLE.w,
          height: HANDLE.h,
          borderRadius: HANDLE.h / 2,
          background: "#dedede",
        }}
      />
      <P src={TITULO.src} x={TITULO.x} y={TITULO.y} w={TITULO.w} h={TITULO.h} />

      {LINHAS.map((l, i) => {
        const o = easeOut(ramp(t, T.linhas + i * 0.07, D.linha));
        return (
          <div key={l.src} style={{ position: "absolute", inset: 0, opacity: o, transform: `translateY(${(1 - o) * 8}px)` }}>
            {/* a divisória vem junto com a linha de baixo, pra lista ir se montando pra baixo */}
            {i > 0 && (
              <div
                style={{
                  position: "absolute",
                  left: DIV.x,
                  top: DIV.y0 + (i - 1) * DIV.passo,
                  width: DIV.w,
                  height: 0.93,
                  background: "#dddddd",
                }}
              />
            )}
            <P src={l.src} x={l.x} y={l.y} w={l.w} h={l.h} />
            {i === 0 && <P src={CHECK.src} x={CHECK.x} y={CHECK.y} w={CHECK.w} h={CHECK.h} />}
          </div>
        );
      })}
    </div>
  );
}
