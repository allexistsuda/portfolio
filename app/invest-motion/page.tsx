"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import Screen1 from "./rebuilt/Screen1";
import Screen2 from "./rebuilt/Screen2";
import Screen3 from "./rebuilt/Screen3";
import Screen4 from "./rebuilt/Screen4";
import Screen5 from "./rebuilt/Screen5";
import { Clock, SCR_H, SCR_W } from "./rebuilt/parts";

// As três telas de Investimentos em 1920x1080, montadas como na referência: mesmo enquadramento,
// mesmas posições, fundo branco.
//
// As telas são recriadas em HTML/SVG com a Santander Text (app/invest-motion/rebuilt) — vetor, não
// recorte, então resolvem em qualquer escala. Só a MOLDURA continua sendo imagem: frame.png é o
// recorte do próprio aparelho da referência, em RGBA com o fundo e a tela vazados.
//
// A versão anterior, com as telas em fatias de imagem, está em /invest-motion/slices.
//
// Relógio único: tudo sai de `t` (segundos) descendo por contexto, sem CSS animation — o frame N
// é sempre idêntico, e `?t=3.4` congela num instante exato (gancho pra captura quadro a quadro).
// Teclas: R reinicia · espaço pausa · ←/→ 0,1s · + − 0 zoom.

const W = 1920;
const H = 1080;
const STAGE_BG = "#F0F0F1"; // a referência é branco puro; aqui fica um fio abaixo, só pra tirar o
// estouro sem perder o clima claro

/* moldura e posições, medidas na referência */
const FR_W = 456;
const FR_H = 913;
const FR_SX = 29; // onde a tela começa dentro da moldura
const FR_SY = 27;
const FR_Y = 84;
// a referência tem 567px entre aparelhos; aqui eles vêm um pouco mais juntos
const PITCH = 520;

const TELAS = [Screen1, Screen2, Screen3, Screen4, Screen5];

/* Esteira: cinco telas distintas deslizando sem fim. A sequência é desenhada DUAS vezes e a
   fileira anda exatamente um período — como o conteúdo se repete nesse intervalo, a volta ao
   início cai em cima de um aparelho idêntico e a emenda não aparece.
   Ordem: Renda variável · Patrimônio · Rentabilidade · Evolução · Produtos. */
const ORDEM = [4, 0, 1, 2, 3];
const PERIODO = ORDEM.length * PITCH; // o quanto a fileira anda antes de se repetir
const SEGUNDOS_POR_VOLTA = 22;
// a fileira nasce deslocada pra trás: o 1º aparelho entra cortado pela borda esquerda, que é o
// que faz parecer que a esteira já estava rodando antes de a gente chegar
const X_INICIAL = -170;
const ESPERA = 0;
const RAMPA = 0; // sem rampa: já nasce na velocidade de regime

const VELOCIDADE = PERIODO / SEGUNDOS_POR_VOLTA; // px por segundo em regime

/** Distância já percorrida pela fileira. Com RAMPA em zero é velocidade constante desde o frame 0;
 *  com RAMPA > 0 ela acelera nesse intervalo antes de entrar em regime (daí o t² no primeiro
 *  trecho, que é a integral de uma velocidade subindo em rampa). */
function andado(t: number) {
  const u = Math.max(0, t - ESPERA);
  if (RAMPA <= 0) return VELOCIDADE * u;
  return u <= RAMPA ? (VELOCIDADE * u * u) / (2 * RAMPA) : VELOCIDADE * (u - RAMPA / 2);
}

/** Em que segundo o aparelho de índice `n` (na fileira desenhada) começa a se montar: o MAIS TARDE
 *  entre a cascata de abertura e o instante em que ele cruza o gatilho. O inverso de `andado` dá o
 *  segundo em que a fileira terá andado (x do aparelho − GATILHO) px.
 *
 *  Tem que ser o máximo, não um condicional entre os dois: o aparelho que nasce logo DEPOIS do
 *  gatilho tem um "quando" positivo mas minúsculo, e escolhendo por condicional ele furava a fila
 *  — montava antes do vizinho da esquerda e quebrava a cascata. */
function entrada(n: number) {
  // da 2ª volta em diante o aparelho repete uma tela que já se montou em quadro: entra pronto.
  // Um tempo bem no passado deixa o relógio local alto, com tudo assentado desde o 1º frame.
  if (n >= ORDEM.length) return -1000;
  const x = X_INICIAL + n * PITCH;
  const cruzaOGatilho = (x - GATILHO) / VELOCIDADE;
  return Math.max(n * CASCATA_INICIAL, cruzaOGatilho);
}

/* Cada aparelho se monta quando ENTRA em quadro, não num horário fixo: o relógio dele começa a
   correr no instante em que a borda esquerda dele cruza GATILHO. Quem já nasce em quadro não tem
   esse instante, então faz a cascata de abertura por CASCATA_INICIAL.
   O gatilho fica logo na borda: a montagem começa assim que o aparelho aponta. Atrasar pra quando
   ele já coubesse inteiro parece mais correto no papel, mas aí ele entra em quadro PRETO e fica
   um tempo vazio antes de reagir — pior do que começar a montar meio cortado. */
const GATILHO = W - 60;
const CASCATA_INICIAL = 0.3;

function Phone({ tela, x, t }: { tela: number; x: number; t: number }) {
  const Tela = TELAS[tela];
  return (
    <div style={{ position: "absolute", left: x, top: FR_Y, width: FR_W, height: FR_H }}>
      {/* forro preto um pouco maior que a tela: a borda do furo da moldura tem pixels
          semitransparentes, e sem isso o branco do palco vaza por ali */}
      <div
        style={{
          position: "absolute",
          left: FR_SX - 3,
          top: FR_SY - 3,
          width: SCR_W + 6,
          height: SCR_H + 6,
          borderRadius: 47,
          background: "#000",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: FR_SX,
          top: FR_SY,
          width: SCR_W,
          height: SCR_H,
          borderRadius: 44,
          overflow: "hidden",
        }}
      >
        <Clock.Provider value={t}>
          <Tela />
        </Clock.Provider>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/invest-motion/frame.png"
        alt=""
        width={FR_W}
        height={FR_H}
        draggable={false}
        style={{ position: "absolute", left: 0, top: 0, width: FR_W, height: FR_H, maxWidth: "none", pointerEvents: "none" }}
      />
    </div>
  );
}

export default function InvestMotion() {
  const [fit, setFit] = useState({ scale: 1, ox: 0, oy: 0, vw: W, vh: H });
  const [zoom, setZoom] = useState<number | null>(null); // null = cabe na janela
  const [t, setT] = useState(0);
  // ?render=1: palco em 1:1 encostado no canto e sem o HUD — é o que a captura usa, pra o quadro
  // sair exatamente 1920x1080 sem margem nem atalhos gravados por cima. Lido direto da URL (e
  // nunca no servidor), pra não depender de um setState dentro de efeito.
  const render =
    useSyncExternalStore(
      () => () => {},
      () => new URLSearchParams(window.location.search).get("render"),
      () => null,
    ) === "1";
  const [run, setRun] = useState(0); // muda quando R reinicia, pra religar o rAF já parado
  const paused = useRef(false);
  const origin = useRef(0);

  useEffect(() => {
    const onFit = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const scale = Math.min(vw / W, vh / H) * 0.94;
      setFit({ scale, ox: (vw - W * scale) / 2, oy: (vh - H * scale) / 2, vw, vh });
    };
    onFit();
    window.addEventListener("resize", onFit);
    return () => window.removeEventListener("resize", onFit);
  }, []);

  useEffect(() => {
    // Dois ganchos pra capturar quadro a quadro: ?t=3.4 congela num instante, e window.__t deixa
    // um roteiro externo pedir qualquer segundo sem recarregar a página (é o que o render usa).
    const q = new URLSearchParams(window.location.search).get("t");
    const freeze = q !== null && !Number.isNaN(Number(q)) ? Number(q) : null;
    let raf = 0;
    origin.current = performance.now();
    const tick = (now: number) => {
      const pedido = (window as unknown as { __t?: number }).__t;
      if (typeof pedido === "number") {
        setT(pedido);
        raf = requestAnimationFrame(tick);
        return;
      }
      if (freeze !== null) {
        setT(freeze);
        return; // congelado: um frame só, nada a animar
      }
      if (!paused.current) setT((now - origin.current) / 1000);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(3, (z ?? fit.scale) * 1.25));
      else if (e.key === "-" || e.key === "_") setZoom((z) => Math.max(0.15, (z ?? fit.scale) / 1.25));
      else if (e.key === "0") setZoom(null);
      else if (e.key === "r" || e.key === "R") {
        paused.current = false;
        setT(0);
        setRun((r) => r + 1);
      } else if (e.key === " ") {
        e.preventDefault();
        paused.current = !paused.current;
      } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        paused.current = true;
        setT((v) => Math.max(0, v + (e.key === "ArrowRight" ? 0.1 : -0.1)));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fit.scale]);

  const view = render ? 1 : (zoom ?? fit.scale);
  const ox = render ? 0 : zoom === null ? fit.ox : Math.max(0, (fit.vw - W * view) / 2);
  const oy = render ? 0 : zoom === null ? fit.oy : Math.max(0, (fit.vh - H * view) / 2);

  return (
    <main style={{ position: "fixed", inset: 0, background: "#111", overflow: "auto" }}>
      <div
        style={{
          position: "absolute",
          left: ox,
          top: oy,
          width: W,
          height: H,
          background: STAGE_BG,
          overflow: "hidden",
          transformOrigin: "0 0",
          transform: `scale(${view})`,
        }}
      >
        {/* a fileira anda pra esquerda e volta ao zero a cada período, sem emenda visível */}
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${-(andado(t) % PERIODO)}px)` }}>
          {[0, 1].map((volta) =>
            ORDEM.map((tela, i) => (
              <Phone
                key={`${volta}-${i}`}
                tela={tela}
                x={X_INICIAL + (volta * ORDEM.length + i) * PITCH}
                t={t - entrada(volta * ORDEM.length + i)}
              />
            )),
          )}
        </div>
      </div>

      {!render && (
        <div
          style={{
            position: "fixed",
            right: 16,
            bottom: 16,
            borderRadius: 999,
            padding: "9px 16px",
            fontSize: 13,
            background: "rgba(28,28,30,0.9)",
            color: "#E8E8E8",
          }}
        >
          {Math.round(view * 100)}% · R toca de novo · espaço pausa · ←/→ 0,1s · + − 0 zoom
        </div>
      )}
    </main>
  );
}
