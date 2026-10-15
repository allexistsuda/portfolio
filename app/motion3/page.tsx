"use client";

import { useEffect, useState } from "react";
import { Work_Sans } from "next/font/google";

const workSans = Work_Sans({ subsets: ["latin"], weight: ["400", "500"] });

// Composição medida no print (1201 x 2000); mostramos só o topo (y de CROP_Y até CROP_Y + VIEW_H).
const COMP_W = 1201;
const VIEW_H = 700;
const BG = "#D6D6D6";
// Rolagem automática (para gravar): depois da montagem do hero, o zoom out e a descida da câmera
// rodam sozinhos. Abra com ?manual=1 para controlar pelo scroll.
const AUTO_START = 1.4; // s: quando o hero termina de montar
const AUTO_ZOOM_S = 1.4; // duração do zoom out (com o assentar elástico)
const AUTO_HOLD_S = 0.4; // pausa antes de descer
const AUTO_SCROLL_S = 6.5;
const FULL_SCROLL_S = 7; // no modo ?full a página é maior na tela, então a mesma descida precisa de mais tempo
// rolagem contínua, de uma vez, até o depoimento
// Marco do progresso (0 a 1): até aqui é o zoom out; depois a câmera desce de uma vez.
const ZOOM_END = 0.2;
const ZOOM_OUT_AMOUNT = 0.6; // 0 = sem zoom out; 1 = recua até a composição inteira caber
// Gatilhos: cada seção monta quando a câmera (centro da janela, em y da composição) chega perto dela.
const TRIGGER_FY = { stats: 430, forums: 500, steps: 950, testi: 1330 };
// Curvas e tempos medidos no hero do Fuel (Framer).
const FUEL = "cubic-bezier(0.44, 0, 0.34, 0.98)"; // textos/peças: 0,5s, 10px
const SPRING = "cubic-bezier(0.2, 0.85, 0.3, 1)"; // header: mola amortecida, sem overshoot
// página branca dentro da janela (enquadramento inicial do zoom)
const PAGE_X = 144;
const PAGE_Y = 131;
const PAGE_W = 913;

type Layer = {
  src: string;
  x: number;
  y: number;
  w: number;
  at: number; // s em que entra
  dur?: number;
  rise?: number; // px de onde sobe até o lugar
  draw?: boolean; // revela da esquerda para a direita
  drop?: boolean; // cai de cima com mola amortecida
  mask?: boolean; // revela de baixo para cima (máscara) com a peça subindo
};

const LAYERS: Layer[] = [
  { src: "window.webp", x: 133, y: 75, w: 935, at: 0, dur: 0.6, rise: 0 },
  { src: "dot-r.png", x: 153, y: 100, w: 7, at: 0.3, dur: 0.4, rise: 0 },
  { src: "dot-y.png", x: 164, y: 99, w: 7, at: 0.4, dur: 0.4, rise: 0 },
  { src: "dot-g.png", x: 175, y: 100, w: 7, at: 0.5, dur: 0.4, rise: 0 },
  // nav: cai junto, como o header do Fuel (mola amortecida, sem overshoot)
  { src: "navbar.webp", x: 144, y: 131, w: 913, at: 0.3, rise: -100, drop: true },
  { src: "logo.png", x: 195, y: 147, w: 101, at: 0.3, rise: -100, drop: true },
  { src: "l-sobre.png", x: 353, y: 152, w: 25, at: 0.3, rise: -100, drop: true },
  { src: "l-foruns.png", x: 411, y: 152, w: 86, at: 0.3, rise: -100, drop: true },
  { src: "l-cert.png", x: 529, y: 152, w: 57, at: 0.3, rise: -100, drop: true },
  { src: "l-dep.png", x: 619, y: 152, w: 60, at: 0.3, rise: -100, drop: true },
  { src: "l-contato.png", x: 711, y: 153, w: 36, at: 0.3, rise: -100, drop: true },
  { src: "btn-entrar.png", x: 951, y: 144, w: 55, at: 0.3, rise: -100, drop: true },
  { src: "t-entrar.png", x: 965, y: 153, w: 28, at: 0.3, rise: -100, drop: true },
  // hero: fade + 10px, 0,5s, 0,1s entre as peças
  { src: "selo.png", x: 197, y: 250, w: 150, at: 0.5 },
  { src: "title1.webp", x: 199, y: 277, w: 306, at: 0.6 },
  { src: "title2.webp", x: 196, y: 311, w: 314, at: 0.7 },
  { src: "title3.png", x: 196, y: 344, w: 211, at: 0.8 },
  { src: "support.webp", x: 199, y: 391, w: 327, at: 1.0 },
  { src: "ic1.png", x: 195, y: 428, w: 15, at: 1.1 },
  { src: "ben1.png", x: 195, y: 456, w: 133, at: 1.2 },
  { src: "ic2.png", x: 376, y: 427, w: 16, at: 1.3 },
  { src: "ben2.png", x: 377, y: 456, w: 126, at: 1.4 },
  // divisória entre o hero e a faixa de números: faz parte da primeira montagem
  { src: "divider.png", x: 144, y: 565, w: 451, at: 1.1, dur: 0.8, draw: true },
];

// Seção "Fóruns e palestras" (fundo verde de 913 x 454 em x144, y718). Coordenadas relativas à seção.
// Faixa de impacto: monta quando a câmera chega nela (zoom out em andamento). `at` é relativo ao gatilho.
const STAT_LAYERS: Layer[] = [
  { src: "impact.png", x: 196, y: 628, w: 175, at: 0.1 },
  { src: "n50l.png", x: 482, y: 650, w: 134, at: 0.25 },
  { src: "n30l.png", x: 689, y: 650, w: 129, at: 0.45 },
  { src: "n20l.png", x: 885, y: 650, w: 119, at: 0.65 },
];


// Números da faixa de impacto: sobem contando (texto real, para poder contar).
const NUMS = [
  { to: 50, x: 481, y: 627, at: 0.25 },
  { to: 30, x: 688, y: 627, at: 0.45 },
  { to: 20000, x: 884, y: 627, at: 0.65 },
];
const COUNT_S = 1.4; // rápido, de 1 até o valor

function Counter({ to, at }: { to: number; at: number }) {
  const [v, setV] = useState(1);
  useEffect(() => {
    let raf = 0;
    const t0 = performance.now() + at * 1000;
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - t0) / (COUNT_S * 1000)));
      setV(Math.max(1, Math.round(to * (1 - Math.pow(1 - t, 3)))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, at]);
  return <>+{v.toLocaleString("pt-BR")}</>;
}

// Peças repetidas em cada card (selo de data, play). dx = deslocamento do card na seção.
// O número "15" não foi enviado como imagem: é escrito em Work Sans (num: null).
const CARD_PARTS = [
  { dx: 0, num: "f-d1-num.png", numW: 8.5 },
  { dx: 211, num: "f-d3-num.png", numW: 10.9 },
  { dx: 422, num: null, numW: 10.9 },
];

// Passos do certificado (sem fundo, sobre o branco da página). `at` relativo ao gatilho.
const STEP_LAYERS: Layer[] = [
  { src: "st-label.png", x: 498, y: 1227, w: 204, at: 0 },
  { src: "st-title.png", x: 390, y: 1251, w: 423, at: 0.1 },
  { src: "st-line.png", x: 195, y: 1357, w: 811, at: 0.3, dur: 1.0, draw: true },
  // cada passo: bolinha acende quando a linha chega
  ...[0, 1, 2, 3].flatMap((i): Layer[] => {
    const a = 0.45 + i * 0.25;
    const xs = [224, 417, 610, 803];
    const num = [
      { x: 227, y: 1390, w: 16 },
      { x: 420, y: 1390, w: 20 },
      { x: 612, y: 1390, w: 20 },
      { x: 805, y: 1390, w: 21 },
    ][i];
    const t = [
      { x: 227, y: 1437, w: 133 },
      { x: 419, y: 1436, w: 107 },
      { x: 612, y: 1436, w: 138 },
      { x: 804, y: 1436, w: 153 },
    ][i];
    const d = [
      { x: 226, y: 1461, w: 104 },
      { x: 419, y: 1460, w: 153 },
      { x: 612, y: 1460, w: 140 },
      { x: 805, y: 1460, w: 106 },
    ][i];
    return [
      { src: "st-ring.png", x: xs[i], y: 1353, w: 8, at: a },
      { src: `st-n${i + 1}.png`, ...num, at: a + 0.1 },
      { src: `st-t${i + 1}.png`, ...t, at: a + 0.2 },
      { src: `st-d${i + 1}.png`, ...d, at: a + 0.3 },
    ];
  }),
];

// Depoimento (fundo verde claro) + rodapé. `at` relativo ao gatilho.
const TESTI_LAYERS: Layer[] = [
  { src: "tm-quote.png", x: 583, y: 1645, w: 35, at: 0.25 },
  { src: "tm-text.png", x: 312, y: 1700, w: 578, at: 0.4 },
  { src: "tm-prev.png", x: 195, y: 1725, w: 20, at: 0.55 },
  { src: "tm-next.png", x: 986, y: 1725, w: 20, at: 0.6 },
  { src: "tm-chip.png", x: 525, y: 1801, w: 153, at: 0.7 },
  { src: "tm-photo.png", x: 536, y: 1814, w: 37, at: 0.8 },
  { src: "tm-name.png", x: 581, y: 1822, w: 62, at: 0.88 },
  { src: "tm-role.png", x: 583, y: 1837, w: 76, at: 0.95 },
  { src: "tm-dot-on.png", x: 581, y: 1890, w: 11, at: 1.05 },
  { src: "tm-dot-off.png", x: 596, y: 1890, w: 10, at: 1.1 },
  { src: "tm-dot-off.png", x: 611, y: 1890, w: 10, at: 1.15 },
  { src: "ft-logo.png", x: 195, y: 1975, w: 101, at: 1.0 },
  { src: "ft-copy.png", x: 329, y: 1980, w: 234, at: 1.05 },
  { src: "ft-yt.png", x: 768, y: 1976, w: 16, at: 1.1 },
  { src: "ft-fb.png", x: 796, y: 1976, w: 16, at: 1.15 },
  { src: "ft-ig.png", x: 824, y: 1976, w: 16, at: 1.2 },
  { src: "ft-top.png", x: 917, y: 1980, w: 68, at: 1.25 },
  { src: "ft-up.png", x: 991, y: 1976, w: 16, at: 1.3 },
];

// Caminho da câmera: depois do zoom out ela desce contínua (um easing só) até o depoimento.
const CAM_END_Y = 1770;
const WINDOW_TOP = 75; // topo do mockup na composição
const NUMS_BOTTOM = 662; // base dos rótulos da faixa de números
const TOP_MARGIN = 28; // cinza que sobra acima do mockup quando o zoom out termina
const easeIO = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
// escalas e centro vertical da câmera no início/fim do zoom out (o fim enquadra o topo do mockup)
const viewGeom = (vp: { w: number; h: number }) => {
  const sStart = vp.w / PAGE_W;
  const sFit = Math.min(vp.w / COMP_W, vp.h / VIEW_H);
  // recua o bastante para enquadrar do topo do mockup até a faixa de números (rótulos em y ~ 662)
  const sNums = vp.h / (NUMS_BOTTOM + 24 - (WINDOW_TOP - TOP_MARGIN));
  const sEnd = Math.min(sStart + (sFit - sStart) * ZOOM_OUT_AMOUNT, sNums);
  return { sStart, sEnd, fyStart: PAGE_Y + vp.h / 2 / sStart, fyEnd: WINDOW_TOP - TOP_MARGIN + vp.h / 2 / sEnd };
};
// depois do zoom out a câmera desce contínua (um easing só) até o depoimento
const camY = (p: number, startY: number) => {
  const q = Math.min(1, Math.max(0, (p - ZOOM_END) / (1 - ZOOM_END)));
  // mesmo ritmo de antes no geral; só a largada é mais rápida (não começa parada)
  const eased = 0.8 * easeIO(q) + 0.2 * (1 - Math.pow(1 - q, 4));
  return startY + (CAM_END_Y - startY) * eased;
};
// base da página branca (y da composição) menos a curvatura do canto: onde a tela termina em tela cheia; o respiro de baixo (rodapé até a borda) iguala o de cima (depoimento até o rodapé)
const FULL_END_Y = 2056;
const STATS_DELAY_S = 0.5; // em tela cheia: o impacto anima este tempo depois de a rolagem começar
const STATS_P = 0.02; // a faixa de impacto monta junto com o zoom out (sincronizada)

// Modo ?fly: padrão único, na diagonal. Peças do lado esquerdo chegam de cima à esquerda, as do lado direito
// de baixo à direita (mesma distância); a barra de navegação chega de cima. Alpha (fade linear no voo) só depois do zoom out; as peças da primeira montagem voam sem alpha.
// O atraso de cada peça é arredondado para a grade de batidas (BEAT): o que cai na mesma batida chega junto.
// distância de partida (px da composição): quanto menor, mais perto de onde a peça monta
const FLY_X = 220;
const FLY_Y = 120;
const FLY_TOP = 120;
const BEAT = 0.2; // s: uma batida (grade de entradas)
const flyOf = (on: boolean, cx: number, cy: number, ox: number, _oy: number, _idx: number, delay: number, alpha = true): React.CSSProperties => {
  if (!on) return {};
  const fromTop = cy < 200;
  const side = cx < ox ? -1 : 1;
  const fx = fromTop ? 0 : side * FLY_X;
  const fy = fromTop ? -FLY_TOP : side * FLY_Y;
  const d = Math.round(delay / BEAT) * BEAT;
  return {
    ["--fx" as string]: `${fx}px`,
    ["--fy" as string]: `${fy}px`,
    animation: `m3-fly 1.1s cubic-bezier(0.22, 1, 0.36, 1) ${d}s both, ${alpha ? "m3-alpha 1s" : "m3-alpha 0.01s"} linear ${d}s both`,
  } as React.CSSProperties;
};

const SEC = { x: 144, y: 718, w: 913, h: 454 };
const FORUM_LAYERS: Layer[] = [
  { src: "f-label.png", x: 53, y: 101, w: 111, at: 0 },
  { src: "f-title.png", x: 52, y: 126, w: 229, at: 0.1 },
  { src: "f-p1.png", x: 52, y: 193, w: 236, at: 0.25 },
  { src: "f-p2.png", x: 52, y: 234, w: 231, at: 0.35 },
  { src: "f-btn.png", x: 51, y: 291, w: 131, at: 0.5 },
  { src: "f-btn-text.png", x: 66, y: 301, w: 100, at: 0.55 },
  // card 1
  { src: "f-c1-title.png", x: 364, y: 332, w: 144, at: 0.8 },
  { src: "f-c1-by.png", x: 365, y: 370, w: 77, at: 0.88 },
  // card 2 e 3 (fotos ainda não enviadas)
  { src: "f-c2-title.png", x: 575, y: 332, w: 146, at: 0.94 },
  { src: "f-c2-by.png", x: 576, y: 370, w: 98, at: 1.02 },
  { src: "f-c3-title.png", x: 787, y: 332, w: 126, at: 1.08 },
  { src: "f-c3-by.png", x: 787, y: 370, w: 74, at: 1.16 },
];

const PHOTO = { x: 615, y: 207, w: 391, at: 0.5 };

export default function Motion3() {
  // Decodifica as fotos antes de a animação começar, para não piscar branco quando entrarem.
  useEffect(() => {
    ["photo.webp", "f-c1-photo.webp", "f-c2-photo.webp", "f-c3-photo.webp"].forEach((f) => {
      const img = new Image();
      img.src = `/motion3/${f}`;
      img.decode?.().catch(() => {});
    });
  }, []);
  const [vp, setVp] = useState<{ w: number; h: number } | null>(null);
  const [p, setP] = useState(0); // progresso do scroll (0 a 1)
  const [manual, setManual] = useState(false);
  const [full, setFull] = useState(false); // teste: sem zoom out, página em tela cheia o tempo todo (?full)
  const [fly, setFly] = useState(false); // teste: peças chegam de fora do container cinza (?fly)
  const [run, setRun] = useState(0); // clique reinicia (modo automático)
  const [forums, setForums] = useState(false);
  const [testi, setTesti] = useState(false); // depoimento + rodapé
  const [steps, setSteps] = useState(false); // passos do certificado
  const [stats, setStats] = useState(false); // faixa de impacto monta quando a câmera chega nela // seção de fóruns monta quando a câmera desce

  useEffect(() => {
    const measure = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Zoom out ligado ao scroll: começa com a página preenchendo a janela (mockup fora de vista)
  // e recua até mostrar a janela inteira.
  useEffect(() => {
    const detect = () => {
      const q = new URLSearchParams(window.location.search);
      setManual(q.has("manual"));
      setFly(q.has("fly") || q.has("full")); // o modo ?full já vem com o fly
      setFull(q.has("full"));
    };
    detect();
  }, []);

  // linha do tempo automática: p vai de 0 a 1 em duas fases
  useEffect(() => {
    if (manual) return;
    let raf = 0;
    const t0 = performance.now();
    // sem zoom out, a fase do zoom some: a descida começa logo depois da montagem do hero
    const zoomS = full ? 0.01 : AUTO_ZOOM_S;
    const holdS = full ? 0.5 : AUTO_HOLD_S;
    const scrollS = full ? FULL_SCROLL_S : AUTO_SCROLL_S;
    const tick = (now: number) => {
      let done = false;
      const t = (now - t0) / 1000 - AUTO_START;
      let np = 0;
      if (t <= 0) {
        setForums(false);
        setStats(false);
        setSteps(false);
        setTesti(false);
      }
      if (t > 0) {
        if (t < zoomS) np = (t / zoomS) * ZOOM_END;
        else if (t < zoomS + holdS) np = ZOOM_END;
        else {
          const t1 = t - zoomS - holdS;
          // desce sem parar: câmera em velocidade constante
          const u = Math.min(1, t1 / scrollS);
          // velocidade constante, com rampa curta na largada e na chegada (sem aceleração no meio)
          const ra = 0.08;
          const rb = 0.16;
          const area = ra / 2 + (1 - ra - rb) + rb / 2;
          const w = u - (1 - rb);
          const g =
            (u < ra ? (u * u) / (2 * ra) : u < 1 - rb ? ra / 2 + (u - ra) : ra / 2 + (1 - ra - rb) + w - (w * w) / (2 * rb)) / area;
          const fe = vp ? viewGeom(vp).fyEnd : 0;
          // em tela cheia a descida acaba com a base da tela na base da página (rodapé), sem mostrar o cinza da janela
          const endFy = full && vp ? FULL_END_Y - vp.h / 2 / viewGeom(vp).sStart - (viewGeom(vp).fyStart - fe) : CAM_END_Y;
          const target = fe + (endFy - fe) * g;
          let lo = ZOOM_END;
          let hi = 1;
          for (let k = 0; k < 30; k++) {
            const mid = (lo + hi) / 2;
            if (camY(mid, fe) < target) lo = mid;
            else hi = mid;
          }
          np = hi;
          if (u >= 1) done = true;
        }
      }
      setP(np);
      let fy = vp ? camY(np, viewGeom(vp).fyEnd) : 0;
      if (full && vp) {
        // em tela cheia a janela enxerga menos da página: o gatilho vale quando a borda de baixo chega onde chegaria no modo com zoom out
        const g = viewGeom(vp);
        fy += g.fyStart - g.fyEnd + vp.h / 2 / g.sStart - vp.h / 2 / g.sEnd;
      }
      if (fy > TRIGGER_FY.forums) setForums(true);
      // em tela cheia o impacto anima quando a rolagem começa; com zoom out, junto com ele
      if (full ? t > zoomS + holdS + STATS_DELAY_S : np > STATS_P) setStats(true);
      if (fy > TRIGGER_FY.steps) setSteps(true);
      if (fy > TRIGGER_FY.testi) setTesti(true);
      if (np < 1 && !done) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [manual, run, vp, full]);

  const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
  // zoom out dinâmico: arranca rápido, passa um pouco do enquadramento e assenta (elástico)
  const softBack = (t: number) => {
    const sm = t * t * (3 - 2 * t); // sem arrancada seca: acelera com suavidade
    const u = 1 - Math.pow(1 - sm, 1.8); // e freia mais devagar no fim
    const c1 = 1.2; // passa ~7% e assenta
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2);
  };
  const e = full ? 0 : softBack(clamp01(p / ZOOM_END));
  let transform = "none";
  if (vp) {
    const { sStart, sEnd, fyStart, fyEnd } = viewGeom(vp);
    const sc = sStart + (sEnd - sStart) * e;
    // ponto da composição que fica no centro da janela
    const fxStart = PAGE_X + PAGE_W / 2;
    const fxEnd = COMP_W / 2;
    const fx = fxStart + (fxEnd - fxStart) * e;
    const fy = fyStart + (fyEnd - fyStart) * e + (camY(p, fyEnd) - fyEnd);
    transform = `translate(${vp.w / 2 - fx * sc}px, ${vp.h / 2 - fy * sc}px) scale(${sc})`;
  }

  return (
    <main
      onClick={() => !manual && setRun((n) => n + 1)}
      onScroll={(ev) => {
        const el = ev.currentTarget;
        const np = el.scrollTop / (el.scrollHeight - el.clientHeight || 1);
        setP(np);
        const fy = vp ? camY(np, viewGeom(vp).fyEnd) : 0;
        if (fy > TRIGGER_FY.forums) setForums(true);
        if (np > STATS_P) setStats(true);
        if (fy > TRIGGER_FY.steps) setSteps(true);
        if (fy > TRIGGER_FY.testi) setTesti(true);
      }}
      style={{ position: "fixed", inset: 0, zIndex: 50, background: BG, overflowY: manual ? "auto" : "hidden", overflowX: "hidden", cursor: manual ? "auto" : "pointer" }}
    >
      <div key={manual ? "m" : run} style={{ height: manual ? "280vh" : "100vh", position: "relative" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
      <style>{`
        @keyframes m3-in { from { opacity: 0; transform: translateY(var(--rise, 0px)); } to { opacity: 1; transform: translateY(0); } }
        @keyframes m3-fly { from { transform: translate(var(--fx), var(--fy)); } to { transform: translate(0, 0); } }
        @keyframes m3-alpha { from { opacity: 0; } to { opacity: 1; } }
        @keyframes m3-draw { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0 0 0); } }
        @keyframes m3-reveal-d { from { clip-path: polygon(0 0, 0 0, 0 0); } to { clip-path: polygon(0 0, 215% 0, 0 215%); } }
        @keyframes m3-slide-d { from { transform: scale(1.3) translate(-55px, -55px); } to { transform: scale(1) translate(0, 0); } }
      `}</style>
      {vp && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: COMP_W,
            height: 2000,
            transform,
            transformOrigin: "0 0",
            willChange: "transform",
          }}
        >
          <div style={{ position: "absolute", left: 0, top: 0, width: COMP_W, height: 2000 }}>
            {/* continuação da janela cinza abaixo do rodapé (o PNG da janela acaba em y ~1997) */}
            <div
              style={{
                position: "absolute",
                left: 133,
                top: 1990,
                width: 935,
                height: 66,
                background: "#ECECEC",
                borderRadius: "0 0 18px 18px",
                zIndex: 0,
                opacity: 0,
                animation: "m3-in 0.6s cubic-bezier(0.44, 0, 0.34, 0.98) 0s both",
                ["--rise" as string]: "0px",
              } as React.CSSProperties}
            />
            {/* fundo branco da página dentro da janela */}
            <div
              style={{
                position: "absolute",
                left: 144,
                top: 131,
                width: 913,
                height: 1925,
                background: "#fff",
                zIndex: 1,
                borderRadius: "0 0 12px 12px",
                opacity: 0,
                animation: `m3-in 0.6s ${FUEL} 0.15s both`,
              }}
            />
            {/* fundo verde claro da seção de fóruns */}
            <div
              style={{
                position: "absolute",
                left: 144,
                top: 718,
                width: 913,
                height: 454,
                background: "#F6F9F6",
                zIndex: 1,
                borderRadius: 16,
                opacity: 0,
                animation: `m3-in 0.6s ${FUEL} 0.2s both`,
              }}
            />
            {LAYERS.map((l, idx) => {
              // modo ?fly: as peças vêm de fora do container, na direção oposta ao centro do hero
              const flies = fly && !l.draw && l.src !== "window.webp" && l.src !== "navbar.webp" && !l.src.startsWith("dot-");
              return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={`${l.src}-${idx}`}
                src={`/motion3/${l.src}`}
                alt=""
                style={
                  {
                    position: "absolute",
                    left: l.x,
                    top: l.y,
                    width: l.w,
                    height: "auto",
                    zIndex: l.src === "window.webp" ? 0 : 2,
                    opacity: 0,
                    ["--rise" as string]: `${l.rise ?? 10}px`,
                    animation: l.draw
                      ? `m3-draw ${l.dur ?? 0.5}s ${FUEL} ${l.at}s both, m3-in 0.01s linear ${l.at}s both`
                      : l.drop
                        ? `m3-in 0.7s ${SPRING} ${l.at}s both`
                        : `m3-in ${l.dur ?? 0.5}s ${FUEL} ${l.at}s both`,
                    ...flyOf(flies, l.x + l.w / 2, l.y, 600, 330, idx, l.at * 0.9, false),
                  } as React.CSSProperties
                }
              />
              );
            })}
            {steps &&
              STEP_LAYERS.map((l, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={`${l.src}-${i}`}
                  src={`/motion3/${l.src}`}
                  alt=""
                  style={
                    {
                      position: "absolute",
                      left: l.x,
                      top: l.y,
                      width: l.w,
                      height: "auto",
                      zIndex: 2,
                      opacity: 0,
                      ["--rise" as string]: l.draw ? "0px" : "10px",
                      animation: l.draw
                        ? `m3-draw ${l.dur ?? 0.5}s ${FUEL} ${l.at}s both, m3-in 0.01s linear ${l.at}s both`
                        : `m3-in 0.5s ${FUEL} ${l.at}s both`,
                      ...flyOf(fly && !l.draw, l.x + l.w / 2, l.y, 600, 1350, i, l.at * 0.9),
                    } as React.CSSProperties
                  }
                />
              ))}
            {testi && (
              <>
                <div
                  style={{
                    position: "absolute",
                    left: 144,
                    top: 1590,
                    width: 913,
                    height: 358,
                    background: "#F6F9F6",
                    borderRadius: 16,
                    zIndex: 1,
                    opacity: 0,
                    ["--rise" as string]: "10px",
                    animation: `m3-in 0.6s ${FUEL} 0s both`,
                  } as React.CSSProperties}
                />
                {TESTI_LAYERS.map((l, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={`${l.src}-${i}`}
                    src={`/motion3/${l.src}`}
                    alt=""
                    style={
                      {
                        position: "absolute",
                        left: l.x,
                        top: l.y,
                        width: l.w,
                        height: "auto",
                        zIndex: l.src === "tm-photo.png" || l.src.startsWith("tm-n") || l.src === "tm-role.png" ? 3 : 2,
                        opacity: 0,
                        ["--rise" as string]: "10px",
                        animation: `m3-in 0.5s ${FUEL} ${l.at}s both`,
                        ...flyOf(fly, l.x + l.w / 2, l.y, 600, 1770, i, l.at * 0.9),
                      } as React.CSSProperties
                    }
                  />
                ))}
              </>
            )}
            {/* seção de fóruns: monta quando a câmera desce */}
            {forums && (
              <div
                style={{
                  position: "absolute",
                  left: SEC.x,
                  top: SEC.y,
                  width: SEC.w,
                  height: SEC.h,
                  overflow: fly ? "visible" : "hidden",
                  borderRadius: 16,
                  zIndex: 2,
                }}
              >
                {/* fotos dos cards (a 3 é só a parte visível, 127 px) */}
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      left: 363 + i * 211,
                      top: 76,
                      width: i === 2 ? 127 : 186,
                      height: 243,
                      borderRadius: i === 2 ? "13px 0 0 13px" : 13, // a 3 vaza pela direita: só os cantos da esquerda arredondam
                      overflow: "hidden",
                      background: "#E3E8E3",
                      animation: `m3-reveal-d 0.9s cubic-bezier(0.76, 0, 0.18, 1) ${0.3 + i * 0.14}s both`,
                      ...flyOf(fly, SEC.x + 363 + i * 211 + 93, SEC.y + 196, 600, 945, i, (0.3 + i * 0.14) * 0.9),
                    }}
                  >
                    {(
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={`/motion3/f-c${i + 1}-photo.webp`} alt="" style={{ display: "block", width: "100%", height: "100%", animation: fly ? undefined : `m3-slide-d 1.6s cubic-bezier(0.2, 0.7, 0.2, 1) ${0.3 + i * 0.14}s both` }} />
                    )}
                  </div>
                ))}
                {CARD_PARTS.map((c, i) => {
                  const base = 0.3 + i * 0.14 + 0.45; // depois que a abertura da foto passa da metade
                  const fade = (extra: number) =>
                    ({ opacity: 0, ["--rise" as string]: "10px", animation: `m3-in 0.5s ${FUEL} ${base + extra}s both`, ...flyOf(fly, SEC.x + 390 + c.dx, SEC.y + 150, 600, 945, i, base * 0.9 + extra) }) as React.CSSProperties;
                  const cx = 372 + 17.5 + c.dx;
                  return (
                    <div key={i}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/motion3/f-badge.png" alt="" style={{ position: "absolute", left: 372 + c.dx, top: 85, width: 35, height: "auto", ...fade(0) }} />
                      {c.num ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={`/motion3/${c.num}`} alt="" style={{ position: "absolute", left: cx - c.numW / 2, top: 93, width: c.numW, height: "auto", ...fade(0.05) }} />
                      ) : (
                        <div
                          className={workSans.className}
                          style={{ position: "absolute", left: cx - 12, top: 92, width: 24, textAlign: "center", color: "#fff", fontSize: 9, fontWeight: 500, lineHeight: "10px", ...fade(0.05) }}
                        >
                          15
                        </div>
                      )}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/motion3/f-d1-mon.png" alt="" style={{ position: "absolute", left: cx - 8, top: 106, width: 16, height: "auto", ...fade(0.05) }} />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/motion3/f-play-bg.png" alt="" style={{ position: "absolute", left: 437 + c.dx, top: 178, width: 38, height: "auto", ...fade(0.12) }} />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/motion3/f-play-icon.png" alt="" style={{ position: "absolute", left: 450 + c.dx, top: 191, width: 13, height: "auto", ...fade(0.17) }} />
                    </div>
                  );
                })}
                {FORUM_LAYERS.map((l, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={l.src}
                    src={`/motion3/${l.src}`}
                    alt=""
                    style={
                      {
                        position: "absolute",
                        left: l.x,
                        top: l.y,
                        width: l.w,
                        height: "auto",
                        opacity: 0,
                        ["--rise" as string]: "10px",
                        animation: `m3-in 0.5s ${FUEL} ${0.15 + l.at}s both`,
                        zIndex: l.src.includes("btn-text") || l.src.includes("play-icon") || l.src.includes("-d1-") ? 3 : undefined,
                        ...flyOf(fly, SEC.x + l.x + l.w / 2, SEC.y + l.y, 600, 945, i, 0.15 + l.at * 0.9),
                      } as React.CSSProperties
                    }
                  />
                ))}
              </div>
            )}
            {stats && (
              <>
            {STAT_LAYERS.map((l, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={`${l.src}-${i}`}
                src={`/motion3/${l.src}`}
                alt=""
                style={
                  {
                    position: "absolute",
                    left: l.x,
                    top: l.y,
                    width: l.w,
                    height: "auto",
                    zIndex: 2,
                    opacity: 0,
                    ["--rise" as string]: "10px",
                    animation: l.draw
                      ? `m3-draw ${l.dur ?? 0.5}s ${FUEL} ${l.at}s both, m3-in 0.01s linear ${l.at}s both`
                      : `m3-in 0.5s ${FUEL} ${l.at}s both`,
                    ...flyOf(fly && !l.draw, l.x + l.w / 2, l.y, 600, 640, i, l.at * 0.9),
                  } as React.CSSProperties
                }
              />
            ))}
            {NUMS.map((n, i) => (
              <div
                key={n.to}
                className={workSans.className}
                style={
                  {
                    position: "absolute",
                    left: n.x,
                    top: n.y,
                    fontSize: 14,
                    lineHeight: "14px",
                    fontWeight: 400,
                    color: "#1D1D1F",
                    fontVariantNumeric: "tabular-nums",
                    whiteSpace: "nowrap",
                    zIndex: 2,
                    opacity: 0,
                    ["--rise" as string]: "10px",
                    animation: `m3-in 0.5s ${FUEL} ${n.at}s both`,
                    ...flyOf(fly, n.x + 12, n.y, 600, 640, i + 1, n.at * 0.9),
                  } as React.CSSProperties
                }
              >
                <Counter to={n.to} at={n.at} />
              </div>
            ))}
              </>
            )}
            {/* foto da médica: fade com zoom out lento */}
            <div
              style={{
                position: "absolute",
                left: PHOTO.x,
                top: PHOTO.y,
                width: PHOTO.w,
                aspectRatio: "2000 / 1854",
                overflow: "hidden",
                zIndex: 2,
                borderRadius: 13,
                animation: `m3-reveal-d 1.1s cubic-bezier(0.76, 0, 0.18, 1) ${PHOTO.at}s both`,
                ...flyOf(fly, PHOTO.x + PHOTO.w / 2, PHOTO.y + 180, 600, 330, 7, PHOTO.at * 0.9, false),
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/motion3/photo.webp" alt="" style={{ display: "block", width: "100%", height: "100%", animation: fly ? undefined : `m3-slide-d 1.6s cubic-bezier(0.2, 0.7, 0.2, 1) ${PHOTO.at}s both` }} />
            </div>
          </div>
        </div>
      )}
      </div>
      </div>
    </main>
  );
}
