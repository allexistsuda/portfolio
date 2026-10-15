"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { santander } from "../font";

// VERSÃO DE FATIAS (a primeira). As telas aqui são recortes da referência animados por cima de
// um fundo vazio — idênticas ao pixel quando param, mas presas em 1:1. A versão vetorial, que
// recria as telas em HTML/SVG com a Santander Text, vive em /invest-motion.
// exatamente como na referência: mesmo enquadramento, mesmas posições, fundo branco. Escala 1:1 —
// nada é ampliado, então cada pixel da interface é o pixel original.
//
// Fidelidade vem da própria referência: os três aparelhos foram recortados de
// public/invest-motion/referencia.png em três telas de 397x858 (s1/s2/s3.png) + uma moldura
// (frame.png, RGBA com fundo e tela vazados). Nada é recriado em CSS — cada bloco da interface é
// uma JANELA (overflow hidden) por cima da imagem da tela, posicionada pixel a pixel. Mesma
// técnica do app/phone-motion.
//
// Os aparelhos já nascem montados: o que anima é só o conteúdo de cada tela, em cascata da
// esquerda pra direita.
//
// Relógio único: tudo sai de `t` (segundos), sem CSS animation/transition — o frame N é sempre
// idêntico, e `?t=3.4` congela num instante exato (gancho pra captura frame a frame).
// Teclas: R reinicia · espaço pausa · ←/→ 0,1s.

/* ---------------- palco ---------------- */
const W = 1920;
const H = 1080;
const STAGE_BG = "#FFFFFF"; // o fundo da referência é branco puro, sem sombra sob os aparelhos

/* ---------------- tela e moldura (medidos na referência) ---------------- */
const SCR_W = 397;
const SCR_H = 858;
const FR_W = 456; // frame.png
const FR_H = 913;
const FR_SX = 29; // onde a tela começa dentro da moldura
const FR_SY = 27;
/* molduras na referência: a primeira em (158, 84), as seguintes a cada 567px */
const FR_X0 = 158;
const FR_Y = 84;
const PITCH = 567;
const PH_X = [FR_X0, FR_X0 + PITCH, FR_X0 + PITCH * 2];

/* ---------------- linha do tempo (segundos) ---------------- */
const SCREEN_START = [0.15, 1.0, 1.85]; // cascata da esquerda pra direita
const TOTAL = 9.5; // segura ~3,5s com as três montadas antes de reiniciar

/* ---------------- helpers ---------------- */
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const easeOut = (p: number) => 1 - Math.pow(1 - p, 3);
const easeInOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
const seg = (t: number, start: number, dur: number) => clamp01((t - start) / dur);
/** A caixa de linha da Santander Text não é simétrica: centralizada no CSS, a tinta cai 1,5px
 *  abaixo do centro. Sem compensar, o número dá um pulinho na troca pro pixel original. */
const INK_DY = -1.5;
/** R$ sem Intl: evita o servidor e o navegador formatarem diferente */
const brl = (n: number) => {
  const [i, d] = Math.abs(n).toFixed(2).split(".");
  return `R$ ${i.replace(/\B(?=(\d{3})+(?!\d))/g, ".")},${d}`;
};

/* ---------------- fatias ----------------
   [x0, y0, x1, y1] no espaço da tela (397x858) + como entra.
   mode: "rise" (padrão) sobe e aparece · "wipe" varre da esquerda pra direita ·
         "dial" desenha a rosca no sentido horário */
type Mode = "rise" | "wipe" | "dial";
/** Contador: o valor sobe de 0 até `to` no mesmo intervalo (e na mesma curva) da fatia que ele
 *  acompanha — na tela 1, a rosca. Como o número da referência é pixel, o texto vivo é só a
 *  passagem: nos últimos 0,3s a imagem real cruza por cima, e o frame final é o pixel original.
 *  `left` fixa o número à esquerda da fatia; sem ele fica centralizado. */
type CountSpec = {
  to: number;
  /** texto fixo antes do valor, ex. "+ " */
  prefix?: string;
  size: number;
  weight: number;
  color: string;
  /** largura (px) que o número ocupa na referência; o texto vivo é espremido até bater com ela,
   *  pra entrega cruzada não dar um pulo de largura entre a fonte daqui e a do mockup */
  w: number;
  /** cor exata do fundo atrás do número na referência. A fatia pinta esse fundo ela mesma:
   *  enquanto conta, o número impresso está escondido, e sem isso abriria um buraco no card. */
  bg: string;
  left?: number;
  ls?: number;
};
/** hole: raio (px) de um furo circular no centro da fatia — usado pra a rosca não arrastar junto
 *  o texto do miolo, que entra depois em fatias próprias. */
type Slice = {
  r: [number, number, number, number];
  d: number;
  dur?: number;
  dist?: number;
  mode?: Mode;
  hole?: number;
  count?: CountSpec;
  /** retângulo chapado em vez de recorte da imagem: é assim que o fundo de um card entra
   *  inteiro, de uma vez, em vez de chegar em pedaços junto com cada texto que vai em cima. */
  fill?: { color: string; radius?: number };
};

const S1: Slice[] = [
  { r: [0, 60, 397, 98], d: 0.0, dist: 12 }, // nav: voltar · Investimentos · menu
  { r: [0, 128, 397, 154], d: 0.12, dist: 12 }, // Todas as contas
  { r: [0, 154, 397, 184], d: 0.22, dist: 12 }, // Saldo disponível + olho
  { r: [0, 192, 210, 224], d: 0.33, dist: 12 }, // Trocar conta
  { r: [0, 268, 397, 318], d: 0.46, dist: 12 }, // abas + sublinhado
  { r: [78, 347, 320, 589], d: 0.62, dur: 1.3, mode: "dial", hole: 104 }, // rosca (só o anel)
  { r: [150, 418, 248, 444], d: 0.8, dist: 10 }, // "Patrimônio"
  // o valor sobe junto com a rosca: mesmo início, mesma duração, mesma curva — fecham no mesmo frame
  { r: [128, 446, 270, 478], d: 0.62, dur: 1.3, count: { to: 900000, size: 20, weight: 400, color: "#F4F4F4", w: 126, bg: "#141416" } },
  { r: [118, 488, 280, 520], d: 2.02, dist: 10 }, // Detalhar carteira
  { r: [0, 613, 397, 768], d: 2.18, dist: 16, fill: { color: "#1F1E22" } }, // fundo do card, inteiro
  { r: [0, 610, 397, 654], d: 2.18, dist: 16 }, // card: "Rendimentos de 02/01 a 08/05"
  { r: [14, 654, 200, 692], d: 2.28, dur: 0.8, count: { to: 12550, prefix: "+ ", size: 20, weight: 700, color: "#8FE084", w: 134, left: 16, bg: "#1F1E22" } },
  { r: [205, 654, 397, 692], d: 2.98, dist: 12 }, // badge + 22,2% (estoura junto com o valor fechando)
  { r: [0, 692, 397, 770], d: 3.1, dist: 16 }, // divisória + Detalhar patrimônio
  { r: [0, 798, 397, 842], d: 3.24, dist: 12 }, // Sugestões pra você
  { r: [0, 842, 397, 858], d: 3.34, dist: 12 }, // cartões cortados na borda
];

const S2: Slice[] = [
  { r: [0, 60, 397, 98], d: 0.0, dist: 12 },
  { r: [0, 128, 397, 154], d: 0.12, dist: 12 },
  { r: [0, 154, 397, 184], d: 0.22, dist: 12 },
  { r: [0, 192, 210, 224], d: 0.33, dist: 12 },
  { r: [0, 268, 397, 316], d: 0.46, dist: 12 }, // abas (Rentabilidade ativa)
  { r: [11, 329, 382, 457], d: 0.62, dist: 18, fill: { color: "#1E1D21", radius: 9 } }, // fundo do card
  { r: [0, 324, 397, 409], d: 0.62, dist: 18 }, // Rendimentos da carteira + de 02/01 a 08/05
  { r: [14, 406, 212, 450], d: 0.72, dur: 0.8, count: { to: 12550, prefix: "+ ", size: 20, weight: 700, color: "#8CD881", w: 131, left: 17, bg: "#1E1D21" } },
  { r: [212, 405, 397, 452], d: 1.42, dist: 12 }, // badge + 22,2%
  { r: [0, 486, 397, 518], d: 0.88, dist: 12 }, // Compare sua carteira...
  { r: [6, 522, 194, 594], d: 1.02, dist: 14 }, // pílula Carteira
  { r: [194, 522, 206, 594], d: 1.12, dist: 14 }, // ×
  { r: [206, 522, 392, 594], d: 1.2, dist: 14 }, // pílula CDI
  { r: [0, 606, 66, 768], d: 1.36, dist: 12 }, // eixo Y
  { r: [66, 602, 397, 770], d: 1.48, dur: 1.5, mode: "wipe" }, // gráfico
  { r: [4, 770, 393, 842], d: 3.08, dist: 18 }, // botão Investir
];

const S3: Slice[] = [
  { r: [0, 60, 397, 98], d: 0.0, dist: 12 },
  { r: [0, 126, 397, 172], d: 0.14, dist: 12 }, // abas + sublinhado
  { r: [330, 176, 397, 194], d: 0.26, dist: 10 }, // sobra verde da rosca acima
  { r: [0, 208, 397, 242], d: 0.38, dist: 12 }, // Selecione um mês no gráfico...
  { r: [0, 242, 397, 276], d: 0.5, dist: 12 }, // ...as informações.
  { r: [0, 300, 397, 458], d: 0.66, dur: 1.5, mode: "wipe" }, // gráfico de área
  { r: [26, 452, 122, 514], d: 1.42, dist: 12 }, // Jan/23
  { r: [122, 452, 211, 514], d: 1.54, dist: 12 }, // Fev/23
  { r: [211, 452, 301, 514], d: 1.66, dist: 12 }, // Mar/23
  { r: [301, 452, 397, 514], d: 1.78, dist: 12 }, // Abr/23
  { r: [0, 530, 397, 558], d: 1.94, dist: 12 }, // Patrimônio
  { r: [0, 558, 397, 594], d: 2.02, dur: 0.85, count: { to: 850000, size: 20, weight: 700, color: "#FFFFFF", w: 131, left: 10, bg: "#000000" } },
  { r: [0, 606, 397, 636], d: 2.5, dist: 12 }, // Rendimentos de 01/04 a 30/4
  { r: [4, 639, 180, 675], d: 2.6, dur: 0.8, count: { to: 8400, prefix: "+ ", size: 20, weight: 700, color: "#8ADA7E", w: 122, left: 7, bg: "#000000" } },
  { r: [185, 636, 397, 678], d: 3.3, dist: 12 }, // badge + 8,5%
  { r: [4, 686, 393, 756], d: 3.42, dist: 18 }, // Investir
  { r: [4, 760, 393, 832], d: 3.54, dist: 18 }, // Resgatar
];

// base{n}.png = o recorte da tela com todo o conteúdo apagado (cada retângulo de fatia foi
// preenchido esticando a linha limpa logo acima dele). Guarda o cromo fixo — ilha dinâmica,
// faixas cinzas do topo e do rodapé, divisórias — exatamente como na referência, sem chute.
const SCREENS = [
  { src: "/invest-motion/s1.png", base: "/invest-motion/base1.png", slices: S1 },
  { src: "/invest-motion/s2.png", base: "/invest-motion/base2.png", slices: S2 },
  { src: "/invest-motion/s3.png", base: "/invest-motion/base3.png", slices: S3 },
];

/* ---------------- contador ----------------
   O número da referência é pixel, não texto — então o contador é só a passagem: enquanto sobe,
   é texto vivo; nos últimos 0,3s a imagem real cruza por cima e o frame final volta a ser o
   pixel original. Pra a troca não dar um pulo, o texto se mede e se espreme até ocupar
   exatamente a mesma largura do número no mockup (CountSpec.w). */
function CountView({ s, t, box, img }: { s: Slice; t: number; box: React.CSSProperties; img: React.ReactNode }) {
  const c = s.count!;
  const [sx, setSx] = useState(1);

  useLayoutEffect(() => {
    const probe = document.createElement("span");
    probe.textContent = (c.prefix ?? "") + brl(c.to);
    probe.className = santander.className;
    Object.assign(probe.style, {
      position: "absolute",
      left: "-9999px",
      top: "0",
      visibility: "hidden",
      whiteSpace: "nowrap",
      fontSize: `${c.size}px`,
      fontWeight: String(c.weight),
      fontVariantNumeric: "tabular-nums",
    });
    document.body.appendChild(probe);
    const fit = () => {
      const natural = probe.getBoundingClientRect().width;
      if (natural > 0) setSx(c.w / natural);
    };
    fit();
    // a fonte pode chegar depois do primeiro layout; remede quando ela carregar
    document.fonts?.ready.then(fit).catch(() => {});
    return () => probe.remove();
  }, [c]);

  const dur = s.dur ?? 1.2;
  const pr = easeOut(seg(t, s.d, 0.7)); // entrada da fatia, igual às vizinhas
  if (pr <= 0) return null;
  const p = easeInOut(seg(t, s.d, dur)); // progresso do valor
  const hand = easeInOut(seg(t, s.d + dur - 0.3, 0.3)); // a entrega pro pixel original
  const left = c.left !== undefined;

  return (
    <div style={{ ...box, opacity: pr, transform: `translateY(${(1 - pr) * (s.dist ?? 12)}px)` }}>
      {/* 1. o fundo da referência, pintado pela própria fatia */}
      <div style={{ position: "absolute", inset: 0, background: c.bg }} />
      {/* 2. o número impresso, que só aparece na entrega */}
      <div style={{ position: "absolute", inset: 0, opacity: hand }}>{img}</div>
      {/* 3. o número vivo, que some quando o impresso chega */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: left ? "flex-start" : "center",
          paddingLeft: c.left,
          marginTop: INK_DY,
          opacity: 1 - hand,
        }}
      >
        <span
          className={santander.className}
          style={{
            color: c.color,
            fontSize: c.size,
            fontWeight: c.weight,
            fontVariantNumeric: "tabular-nums",
            whiteSpace: "nowrap",
            transform: `scaleX(${sx})`,
            transformOrigin: left ? "left center" : "center",
          }}
        >
          {(c.prefix ?? "") + brl(p * c.to)}
        </span>
      </div>
    </div>
  );
}

/* ---------------- render de uma fatia ---------------- */
function SliceView({ src, s, t }: { src: string; s: Slice; t: number }) {
  const [x0, y0, x1, y1] = s.r;
  const w = x1 - x0;
  const h = y1 - y0;
  const mode = s.mode ?? "rise";

  const box: React.CSSProperties = {
    position: "absolute",
    left: x0,
    top: y0,
    width: w,
    height: h,
    overflow: "hidden",
  };

  const img = (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={src}
      alt=""
      width={SCR_W}
      height={SCR_H}
      draggable={false}
      style={{ position: "absolute", left: -x0, top: -y0, width: SCR_W, height: SCR_H, maxWidth: "none" }}
    />
  );

  if (s.count) return <CountView s={s} t={t} box={box} img={img} />;

  if (s.fill) {
    const p = easeOut(seg(t, s.d, s.dur ?? 0.7));
    if (p <= 0) return null;
    return (
      <div
        style={{
          ...box,
          background: s.fill.color,
          borderRadius: s.fill.radius,
          opacity: p,
          transform: `translateY(${(1 - p) * (s.dist ?? 20)}px)`,
        }}
      />
    );
  }

  if (mode === "wipe") {
    const p = easeInOut(seg(t, s.d, s.dur ?? 1.2));
    if (p <= 0) return null;
    box.clipPath = `inset(0 ${(1 - p) * 100}% 0 0)`;
  } else if (mode === "dial") {
    const p = easeInOut(seg(t, s.d, s.dur ?? 1.2));
    if (p <= 0) return null;
    // conic-gradient começa às 12h e gira no sentido horário — igual ao desenho da rosca
    const mask = `conic-gradient(from 0turn, #000 0turn ${p}turn, rgba(0,0,0,0) ${p}turn 1turn)`;
    box.maskImage = mask;
    box.WebkitMaskImage = mask;
  } else {
    const p = easeOut(seg(t, s.d, s.dur ?? 0.7));
    if (p <= 0) return null;
    box.opacity = p;
    box.transform = `translateY(${(1 - p) * (s.dist ?? 20)}px)`;
  }

  // o furo vai numa camada própria: duas máscaras em elementos aninhados se cruzam sozinhas,
  // sem depender de mask-composite (que muda de sintaxe entre engines)
  if (s.hole) {
    const hole = `radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 0 ${s.hole}px, #000 ${s.hole + 2}px)`;
    return (
      <div style={box}>
        <div style={{ position: "absolute", inset: 0, maskImage: hole, WebkitMaskImage: hole }}>{img}</div>
      </div>
    );
  }

  return <div style={box}>{img}</div>;
}

/* ---------------- um aparelho ---------------- */
function Phone({ i, t }: { i: number; t: number }) {
  const ts = t - SCREEN_START[i];
  const { src, base, slices } = SCREENS[i];
  return (
    <div style={{ position: "absolute", left: PH_X[i], top: FR_Y, width: FR_W, height: FR_H }}>
      {/* tela: o fundo vazio da referência + as fatias de conteúdo por cima */}
      <div
        style={{
          position: "absolute",
          left: FR_SX,
          top: FR_SY,
          width: SCR_W,
          height: SCR_H,
          borderRadius: 44,
          overflow: "hidden",
          background: "#000",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={base}
          alt=""
          width={SCR_W}
          height={SCR_H}
          draggable={false}
          style={{ position: "absolute", left: 0, top: 0, width: SCR_W, height: SCR_H, maxWidth: "none" }}
        />
        {slices.map((sl, k) => (
          <SliceView key={k} src={src} s={sl} t={ts} />
        ))}
      </div>

      {/* moldura por cima: recorte da própria referência em RGBA — fundo e tela vazados */}
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

/* ---------------- página ---------------- */
export default function InvestMotion() {
  const [fit, setFit] = useState({ scale: 1, ox: 0, oy: 0, vw: W, vh: H });
  const [zoom, setZoom] = useState<number | null>(null); // null = cabe na janela
  const [t, setT] = useState(0);
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
    // ?t=3.4 congela num instante exato — é o gancho pra captura frame a frame
    const q = new URLSearchParams(window.location.search).get("t");
    const freeze = q !== null && !Number.isNaN(Number(q)) ? Number(q) : null;
    let raf = 0;
    origin.current = performance.now();
    const tick = (now: number) => {
      if (freeze !== null) setT(freeze);
      else if (!paused.current) setT(((now - origin.current) / 1000) % TOTAL);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "r" || e.key === "R") {
        origin.current = performance.now();
        paused.current = false;
        setT(0);
      } else if (e.key === " ") {
        e.preventDefault();
        paused.current = !paused.current;
      } else if (e.key === "+" || e.key === "=") {
        setZoom((z) => Math.min(3, (z ?? fit.scale) * 1.25));
      } else if (e.key === "-" || e.key === "_") {
        setZoom((z) => Math.max(0.15, (z ?? fit.scale) / 1.25));
      } else if (e.key === "0") {
        setZoom(null);
      } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        paused.current = true;
        setT((v) => Math.max(0, Math.min(TOTAL, v + (e.key === "ArrowRight" ? 0.1 : -0.1))));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fit.scale]);

  // `fit` cabe na janela; o zoom manual (+ / − / 0) manda quando existe
  const view = zoom ?? fit.scale;
  const ox = zoom === null ? fit.ox : Math.max(0, (fit.vw - W * view) / 2);
  const oy = zoom === null ? fit.oy : Math.max(0, (fit.vh - H * view) / 2);

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
        {[0, 1, 2].map((i) => (
          <Phone key={i} i={i} t={t} />
        ))}
      </div>

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
        {Math.round(view * 100)}% · R reinicia · espaço pausa · ←/→ 0,1s · + − 0 zoom
      </div>
    </main>
  );
}
