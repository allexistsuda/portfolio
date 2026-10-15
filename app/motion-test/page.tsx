"use client";

import { useEffect, useRef, useState } from "react";

const VIDEO_RATIO = 768 / 512;
const MOCK_RATIO = 2000 / 1317;
const BG_VIDEO = "#FEFEFE";
// Camadas do app (posições medidas no mockup de 2000 x 1317; w = largura do elemento no mockup).
// `step` define a ordem de entrada; elementos com o mesmo step entram juntos.
const MOCK_W = 2000;
const MOCK_H = 1317;
const UI = [
  { src: "logo", x: 872, y: 286, w: 258, h: 46, lw: 649, lh: 113, step: 0 },
  { src: "title", x: 810, y: 368, w: 381, h: 23, lw: 958, lh: 56, step: 1 },
  { src: "sub1", x: 820, y: 404, w: 360, h: 19, lw: 908, lh: 46, step: 2 },
  { src: "sub2", x: 814, y: 435, w: 372, h: 21, lw: 935, lh: 50, step: 2 },
  { src: "btn-primary", x: 780, y: 902, w: 441, h: 63, lw: 1107, lh: 155, step: 3 },
  { src: "btn-secondary", x: 780, y: 979, w: 440, h: 62, lw: 1107, lh: 155, step: 4 },
  { src: "skip", x: 976, y: 1068, w: 50, h: 17, lw: 126, lh: 38, step: 5 },
];
// Área da tela com o conteúdo antigo, coberta com o branco da própria tela.
const ERASE = { x: 770, y: 270, w: 460, h: 830 };
// Entrada dos elementos: atraso depois do início do zoom, intervalo entre eles e deslocamento (px do mockup).
const UI_DELAY = 0.4;
const UI_STEP = 0.07;
const UI_RISE = 10;


// Vídeo no mockup (em % do mockup): centro da ilustração na tela e largura do quadro do vídeo.
const VIDEO = { width: 29.3, centerX: 50, centerY: 51.3 };
// Largura da tela do celular no mockup (%). O vídeo é cortado nessa largura desde o primeiro quadro.
const SCREEN_W = 24;
// Zoom elástico e macio: começa devagar, acelera e passa um pouco do ponto final antes de assentar.
// O 1.02 (4º valor) controla o overshoot; 1 = sem elástico.
const ZOOM_SECONDS = 1.0;
const ZOOM = `${ZOOM_SECONDS}s cubic-bezier(0.5, 0, 0.2, 1.1)`;
// Mão tocando em "Pular". Medidas no mockup de 2000 x 1317; a ponta do dedo é o ponto de contato.
const HAND = { w: 50, lw: 149, lh: 166, tipX: 61, tipY: 1, targetX: 1001, targetY: 1074 };
// Tela do celular no mockup (px de 2000 x 1317) e a próxima tela, que aparece logo depois do toque.
// A imagem começa abaixo do notch/barra de status (SCREEN_TOP_CLIP) e tem cantos arredondados embaixo.
const SCREEN = { x: 761, y: 141, w: 478, h: 1035 };
const SCREEN_TOP_CLIP = 190;
const SCREEN_RADIUS = 46;
// Celular recortado (fundo transparente) no espaço do mockup de 2000 x 1317.
const PHONE = { x: 659, y: 55, w: 684, h: 1207 };
const HOME_FADE = 0.25;
// Home em camadas. Coordenadas e tamanhos na própria Home (923 x 2000). A entrada acontece em cascata, de cima para baixo, pela posição vertical de cada elemento (syncX/syncY fazem uma peça entrar junto com outra).
// kind: down/up (deslizam), scale (cresce), right/left (deslizam de lado), draw (linha se desenha), pop (salta com leve overshoot).
const HOME_W = 923;
const HOME_H = 2000;
type Kind = "down" | "up" | "scale" | "right" | "left" | "draw" | "pop" | "fade";
const HOME_UI: { src: string; x: number; y: number; w: number; h: number; kind: Kind; syncY?: number; syncX?: number }[] = [
  { src: "62.png", x: 40, y: 123, w: 843, h: 99, kind: "down" },
  { src: "63.png", x: 70, y: 154, w: 37, h: 37, kind: "down", syncY: 123, syncX: 40 },
  { src: "64.png", x: 132, y: 159, w: 159, h: 32, kind: "down", syncY: 123, syncX: 40 },
  { src: "71.png", x: 39, y: 694, w: 844, h: 384, kind: "down" },
  { src: "61.webp", x: 40, y: 261, w: 844, h: 461, kind: "down" },
  { src: "65.png", x: 81, y: 770, w: 255, h: 30, kind: "down" },
  { src: "66.png", x: 786, y: 781, w: 59, h: 59, kind: "down" },
  { src: "67.png", x: 83, y: 818, w: 445, h: 39, kind: "down" },
  { src: "70.png", x: 79, y: 898, w: 766, h: 3, kind: "draw" },
  { src: "68.png", x: 83, y: 947, w: 425, h: 30, kind: "down" },
  { src: "66.png", x: 786, y: 958, w: 59, h: 59, kind: "down" },
  { src: "69.png", x: 81, y: 1001, w: 593, h: 33, kind: "down" },
  { src: "72.png", x: 428, y: 1106, w: 30, h: 10, kind: "down" },
  { src: "73.png", x: 468, y: 1105, w: 30, h: 10, kind: "down" },
  { src: "74.png", x: 44, y: 1188, w: 349, h: 37, kind: "down" },
  { src: "75.png", x: 739, y: 1193, w: 141, h: 26, kind: "down" },
  { src: "76.png", x: 39, y: 1268, w: 296, h: 345, kind: "down" },
  { src: "79.png", x: 42, y: 1651, w: 162, h: 70, kind: "down" },
  { src: "77.png", x: 364, y: 1268, w: 296, h: 345, kind: "down" },
  { src: "80.png", x: 368, y: 1646, w: 220, h: 70, kind: "down" },
  { src: "78.png", x: 689, y: 1268, w: 234, h: 345, kind: "down" },
  { src: "81.png", x: 693, y: 1647, w: 218, h: 77, kind: "down" },
  { src: "91.png", x: 0, y: 1794, w: 923, h: 3, kind: "draw" },
  { src: "82.png", x: 64, y: 1827, w: 54, h: 54, kind: "down" },
  { src: "83.png", x: 60, y: 1900, w: 67, h: 17, kind: "down" },
  { src: "84.png", x: 251, y: 1827, w: 54, h: 54, kind: "down" },
  { src: "85.png", x: 224, y: 1899, w: 106, h: 18, kind: "down" },
  { src: "tools-icon.png", x: 436, y: 1827, w: 54, h: 54, kind: "down" },
  { src: "86.png", x: 389, y: 1900, w: 149, h: 17, kind: "down" },
  { src: "87.png", x: 620, y: 1827, w: 54, h: 54, kind: "down" },
  { src: "88.png", x: 593, y: 1899, w: 108, h: 18, kind: "down" },
  { src: "89.png", x: 805, y: 1827, w: 54, h: 54, kind: "down" },
  { src: "90.png", x: 805, y: 1899, w: 52, h: 18, kind: "down" },
];
const HOME_SPAN = 1.0; // segundos que a onda leva para descer do topo até a barra de baixo
const HOME_SWEEP = 0.1; // segundos extras da esquerda para a direita, na mesma altura
const HOME_START = 0.12; // atraso depois do toque, para o fundo branco da Home entrar primeiro

// Celulares extras que saem por trás do principal, para a direita, depois que a Home monta.
const EXTRA_PHONES: number[] = []; // celulares laterais desligados por enquanto ([0.32, -0.32] para religar) // deslocamento, em fração da largura da cena
// tela de cada celular extra (mesma ordem de EXTRA_PHONES); sem valor = Home
const EXTRA_SCREENS: (string | undefined)[] = [undefined, "/motion-test/screens/search.webp"];
const EXTRA_START = -0.5; // segundos depois do fim da cascata da Home
const EXTRA_STEP = 0.1;
const EXTRA_SECONDS = 0.7;
const HAND_DELAY = 1.2; // segundos depois do início do zoom
const HAND_TOTAL = 2.0; // sobe de fora da tela, toca (aos ~0,85s) e some
const HOME_TAP = HAND_DELAY + HAND_TOTAL * 0.425 + 0.05; // segundos depois do início do zoom em que a Home começa a entrar
// Curvas das entradas dos elementos: SMOOTH sem elástico; SOFT_ELASTIC com overshoot bem leve (o 1.25 é o overshoot).
// Sequência da busca no celular do meio: toque na barra, a tela de busca abre, digita, a lista surge.
const SHOW_SEARCH = false; // sequência da busca (toque, digitação, lista) guardada; true para religar
const SEARCH_BASE = HOME_TAP + HOME_START + HOME_SPAN + HOME_SWEEP + 0.7; // segundos depois do início do zoom em que a mão volta
const SEARCH_OPEN = SEARCH_BASE + HAND_TOTAL * 0.425 + 0.05; // a tela de busca abre no toque
const SEARCH_TYPE_AT = SEARCH_OPEN + 1.0; // a lupa fica um instante sozinha
const SEARCH_TYPE_SECONDS = 1.3;
const SEARCH_LIST_AT = SEARCH_TYPE_AT + SEARCH_TYPE_SECONDS + 0.25;
const SEARCH_BAR = { x: 460, y: 172 }; // onde o dedo toca, em px da Home
const SEARCH_W = 925; // largura das telas de busca exportadas
const SEARCH_H = 2000;
const SEARCH_TEXT = { x: 120, y: 135, w: 340, h: 80 }; // área do texto digitado, em px da tela
const SEARCH_LIST_TOP = 100; // a partir daqui a tela de resultados cobre a de busca
const LUPA = { x: 14, y: 591, w: 911 }; // lupa animada, em px da tela de busca
// peças da tela de busca (exportadas a ~1,38x): posição e tamanho em px da tela, d = atraso depois de abrir
const SEARCH_LAYERS: { src: string; x: number; y: number; w: number; d: number }[] = [
  { src: "226.png", x: 40, y: 124, w: 665, d: 0.05 },
  { src: "224.png", x: 70, y: 153, w: 37, d: 0.12 },
  { src: "225.png", x: 129, y: 159, w: 3, d: 0.16 },
  { src: "227.png", x: 736, y: 160, w: 146, d: 0.14 },
  { src: "231.png", x: 30, y: 266, w: 160, d: 0.2 },
  { src: "230.png", x: 61, y: 298, w: 98, d: 0.22 },
  { src: "233.png", x: 210, y: 266, w: 212, d: 0.26 },
  { src: "232.png", x: 240, y: 298, w: 148, d: 0.28 },
  { src: "235.png", x: 442, y: 266, w: 227, d: 0.32 },
  { src: "234.png", x: 475, y: 296, w: 161, d: 0.34 },
  { src: "237.png", x: 688, y: 266, w: 205, d: 0.38 },
  { src: "236.png", x: 721, y: 296, w: 139, d: 0.4 },
  { src: "228.png", x: 40, y: 441, w: 833, d: 0.46 },
];
const SMOOTH = "cubic-bezier(0.25, 1, 0.5, 1)";
const SOFT_ELASTIC = "cubic-bezier(0.3, 1.25, 0.5, 1)";
const FADE = "0.4s ease-in-out";
// Fade de entrada do celular: mais longo e com curva suave nas duas pontas.
const PHONE_FADE = "1s cubic-bezier(0.45, 0, 0.2, 1)";
// Quanto do tamanho da janela o vídeo ocupa na abertura (0.8 = 20% menor).
const START_SIZE = 0.8;
// Escala final da cena (1 = celular encaixado na janela; menor = a câmera se afasta mais).
const END_SCALE = 1;
// O zoom começa na metade do vídeo menos este tempo (em segundos).
const ZOOM_LEAD = 0.8;
// O celular começa a aparecer este tempo (em segundos) ANTES do zoom; 0 = os dois começam juntos.
const REVEAL_BEFORE_ZOOM = 0.45;

type Geo = {
  stage: { left: number; top: number; width: number; height: number };
  video: { left: number; top: number; width: number; height: number };
  clipX: number;
  handFrom: { x: number; y: number };
  endShift: { x: number; y: number };
  scale: number;
  origin: { x: number; y: number };
  startScale: number;
  startShift: { x: number; y: number };
};

export default function MotionTest() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<"play" | "reveal" | "zoom">("play");
  const [geo, setGeo] = useState<Geo | null>(null);

  // Pré-carrega e decodifica as imagens grandes agora, para não travar quando elas aparecerem.
  useEffect(() => {
    const files = [
      "/motion-test/phone2-cut.webp",
      "/motion-test/screens/search.webp",
      "/motion-test/screens/results.webp",
      "/motion-test/ui/home.webp",
      ...HOME_UI.map((el) => `/motion-test/home/${el.src}`),
      ...UI.map((el) => `/motion-test/ui/${el.src}.png`),
      "/motion-test/ui/hand.png",
    ];
    files.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.decode?.().catch(() => {});
    });
  }, []);

  useEffect(() => {
    const measure = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const sw = Math.min(vw, vh * MOCK_RATIO);
      const sh = sw / MOCK_RATIO;
      const stage = { width: sw, height: sh, left: (vw - sw) / 2, top: (vh - sh) / 2 };

      const tw = (sw * VIDEO.width) / 100;
      const th = tw / VIDEO_RATIO;
      const video = {
        width: tw,
        height: th,
        left: (sw * VIDEO.centerX) / 100 - tw / 2,
        top: (sh * VIDEO.centerY) / 100 - th / 2,
      };
      const clipX = Math.max(0, (tw - (sw * SCREEN_W) / 100) / 2);
      // Deslocamento que leva a mão (na posição do toque) para fora da janela, no canto de baixo à direita.
      const k = sw / MOCK_W;
      const stageCy = stage.top + sh / 2;
      // Posição do dedo na janela com a escala final (a cena encolhe em torno do centro do celular).
      const tipY = stageCy + END_SCALE * (stage.top + HAND.targetY * k - stageCy);
      const handFrom = { x: 0, y: (vh - tipY) / END_SCALE + 12 };
      const origin = { x: video.left + video.width / 2, y: video.top + video.height / 2 };
      // Mantém o celular centralizado quando a cena encolhe em torno do centro do vídeo.
      const endShift = { x: (1 - END_SCALE) * (sw / 2 - origin.x), y: (1 - END_SCALE) * (sh / 2 - origin.y) };

      // No começo a cena está ampliada até o vídeo ocupar a janela (inteiro, sem cortar), centralizado.
      const fitWidth = Math.min(vw, vh * VIDEO_RATIO);
      const startScale = (fitWidth * START_SIZE) / tw;
      const startShift = {
        x: vw / 2 - (stage.left + origin.x),
        y: vh / 2 - (stage.top + origin.y),
      };

      setGeo({ stage, video, clipX, handFrom, endShift, scale: k, origin, startScale, startShift });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // O zoom começa antes da metade do vídeo; ele segue tocando e fica em loop.
  // Depois que a Home cobre a tela, o vídeo não aparece mais: pausa para liberar processamento durante a cascata.
  useEffect(() => {
    if (phase !== "zoom") return;
    const id = window.setTimeout(() => videoRef.current?.pause(), (HOME_TAP + HOME_FADE + 0.2) * 1000);
    return () => window.clearTimeout(id);
  }, [phase]);

  const onTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || phase === "zoom" || !v.duration) return;
    if (v.currentTime >= v.duration / 2 - ZOOM_LEAD) {
      v.loop = true;
      setPhase("zoom");
    } else if (phase === "play" && v.currentTime >= v.duration / 2 - ZOOM_LEAD - REVEAL_BEFORE_ZOOM) {
      setPhase("reveal");
    }
  };

  const homeScreen = (base: number, withFade: boolean, still = false, custom?: string) =>
    geo && (
    <div
      aria-hidden
      style={{
        position: "absolute",
        left: `${(SCREEN.x / MOCK_W) * 100}%`,
        top: `${(SCREEN_TOP_CLIP / MOCK_H) * 100}%`,
        width: `${(SCREEN.w / MOCK_W) * 100}%`,
        height: `${((SCREEN.y + SCREEN.h - SCREEN_TOP_CLIP) / MOCK_H) * 100}%`,
        overflow: "hidden",
        ["--k" as string]: `${geo.scale}px`,
        ["--u" as string]: `${(geo.scale * SCREEN.w) / HOME_W}px`,
        borderRadius: `0 0 calc(${SCREEN_RADIUS} * var(--k)) calc(${SCREEN_RADIUS} * var(--k))`,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#fff",
          opacity: zoomed || !withFade || still ? 1 : 0,
          transition: zoomed && withFade && !still ? `opacity ${HOME_FADE}s ease-out ${base}s` : "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          width: "100%",
          aspectRatio: `${HOME_W} / ${HOME_H}`,
          top: `calc(${SCREEN.y - SCREEN_TOP_CLIP} * var(--k))`,
        }}
      >
        {custom ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={custom} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }} />
        ) : HOME_UI.map((el, i) => {
          const delay = base + HOME_START + ((el.syncY ?? el.y) / HOME_H) * HOME_SPAN + ((el.syncX ?? el.x) / HOME_W) * HOME_SWEEP;
          const from =
            el.kind === "down" ? "translateY(calc(-22 * var(--u)))"
            : el.kind === "up" ? "translateY(calc(16 * var(--u)))"
            : el.kind === "scale" ? "translateY(calc(18 * var(--u))) scale(0.96)"
            : el.kind === "right" ? "translateX(calc(60 * var(--u)))"
            : el.kind === "left" ? "translateX(calc(-14 * var(--u)))"
            : el.kind === "draw" ? "scaleX(0)"
            : el.kind === "fade" ? "none"
            : "scale(0.5)";
          const curve = SMOOTH;
          const dur = el.kind === "fade" ? 0.5 : el.kind === "draw" ? 0.55 : el.kind === "right" ? 0.7 : el.kind === "pop" ? 0.5 : 0.68;
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={`${el.src}-${i}`}
              src={`/motion-test/home/${el.src}`}
              alt=""
              style={{
                position: "absolute",
                left: `${(el.x / HOME_W) * 100}%`,
                top: `${(el.y / HOME_H) * 100}%`,
                width: `${(el.w / HOME_W) * 100}%`,
                display: "block",
                transformOrigin: el.kind === "draw" ? "left center" : "center",
                opacity: zoomed || still ? 1 : 0,
                transform: zoomed || still ? "none" : from,
                transition: zoomed && !still
                  ? `opacity ${dur * 0.7}s ease-out ${delay}s, transform ${dur}s ${curve} ${delay}s`
                  : "none",
              }}
            />
          );
        })}
      </div>
    </div>
    );
  const searchSeq = () =>
    geo && (
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: `${(SCREEN.x / MOCK_W) * 100}%`,
          top: `${(SCREEN_TOP_CLIP / MOCK_H) * 100}%`,
          width: `${(SCREEN.w / MOCK_W) * 100}%`,
          height: `${((SCREEN.y + SCREEN.h - SCREEN_TOP_CLIP) / MOCK_H) * 100}%`,
          overflow: "hidden",
          borderRadius: `0 0 calc(${SCREEN_RADIUS} * ${geo.scale}px) calc(${SCREEN_RADIUS} * ${geo.scale}px)`,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            width: "100%",
            aspectRatio: `${SEARCH_W} / ${SEARCH_H}`,
            ["--su" as string]: `${(geo.scale * SCREEN.w) / SEARCH_W}px`,
            top: `${(SCREEN.y - SCREEN_TOP_CLIP) * geo.scale}px`,
          }}
        >
          {/* tela de busca vazia, em camadas: o fundo entra no toque e cada peça sobe em seguida */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "#fff",
              opacity: 0,
              animation: zoomed ? `mt-s-fade 0.3s ease-out ${SEARCH_OPEN}s both` : "none",
            }}
          />
          {SEARCH_LAYERS.map((l) => {
            const hide = l.src === "225.png";
            return (
              <div
                key={l.src}
                style={{
                  position: "absolute",
                  left: `${(l.x / SEARCH_W) * 100}%`,
                  top: `${(l.y / SEARCH_H) * 100}%`,
                  width: `${(l.w / SEARCH_W) * 100}%`,
                  opacity: 0,
                  animation: zoomed
                    ? `mt-s-in 0.6s ${SMOOTH} ${SEARCH_OPEN + l.d}s both${hide ? `, mt-s-hide 0.01s linear ${SEARCH_TYPE_AT}s forwards` : ""}`
                    : "none",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/motion-test/search/${l.src}`}
                  alt=""
                  style={{ display: "block", width: "100%", animation: hide && zoomed ? "mt-blink 1s steps(1) infinite" : "none" }}
                />
              </div>
            );
          })}
          {/* lupa: desenha de baixo para cima e balança devagar até a digitação começar */}
          <div
            style={{
              position: "absolute",
              left: `${(LUPA.x / SEARCH_W) * 100}%`,
              top: `${(LUPA.y / SEARCH_H) * 100}%`,
              width: `${(LUPA.w / SEARCH_W) * 100}%`,
              opacity: 0,
              clipPath: "inset(100% 0 0 0)",
              animation: zoomed ? `mt-lupa-in 1s cubic-bezier(0.4, 0, 0.2, 1) ${SEARCH_OPEN + 0.25}s both` : "none",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/motion-test/search/229.png"
              alt=""
              style={{
                display: "block",
                width: "100%",
                transformOrigin: "20% 75%",
                animation: zoomed ? `mt-lupa-sway 2.4s ease-in-out ${SEARCH_OPEN + 1.25}s infinite` : "none",
              }}
            />
          </div>
          {/* texto digitado, letra a letra */}
          <div
            style={{
              position: "absolute",
              left: `${(SEARCH_TEXT.x / SEARCH_W) * 100}%`,
              top: `${(SEARCH_TEXT.y / SEARCH_H) * 100}%`,
              width: `${(SEARCH_TEXT.w / SEARCH_W) * 100}%`,
              height: `${(SEARCH_TEXT.h / SEARCH_H) * 100}%`,
              overflow: "hidden",
              clipPath: "inset(0 100% 0 0)",
              animation: zoomed ? `mt-type ${SEARCH_TYPE_SECONDS}s steps(18, end) ${SEARCH_TYPE_AT}s both` : "none",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/motion-test/screens/results.webp"
              alt=""
              style={{
                position: "absolute",
                left: `${(-SEARCH_TEXT.x / SEARCH_TEXT.w) * 100}%`,
                top: `${(-SEARCH_TEXT.y / SEARCH_TEXT.h) * 100}%`,
                width: `${(SEARCH_W / SEARCH_TEXT.w) * 100}%`,
                height: "auto",
                maxWidth: "none",
              }}
            />
          </div>
          {/* resultados: a lista sobe e aparece */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: `${(SEARCH_LIST_TOP / SEARCH_H) * 100}%`,
              bottom: 0,
              overflow: "hidden",
              opacity: 0,
              animation: zoomed ? `mt-list-in 0.7s ${SMOOTH} ${SEARCH_LIST_AT}s both` : "none",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/motion-test/screens/results.webp"
              alt=""
              style={{
                position: "absolute",
                left: 0,
                top: `${(-SEARCH_LIST_TOP / (SEARCH_H - SEARCH_LIST_TOP)) * 100}%`,
                width: "100%",
                height: `${(SEARCH_H / (SEARCH_H - SEARCH_LIST_TOP)) * 100}%`,
                maxWidth: "none",
              }}
            />
          </div>
        </div>
      </div>
    );
  const phonePos = {
    position: "absolute" as const,
    left: `${(PHONE.x / MOCK_W) * 100}%`,
    top: `${(PHONE.y / MOCK_H) * 100}%`,
    width: `${(PHONE.w / MOCK_W) * 100}%`,
    display: "block" as const,
  };
  const zoomed = phase === "zoom";
  const revealed = phase !== "play";

  return (
    <main
      style={{
        position: "fixed",
        inset: 0,
        background: BG_VIDEO,
        transition: `background-color ${FADE}`,
        overflow: "hidden",
      }}
    >
      {geo && (
        <div
          style={{
            position: "absolute",
            ...geo.stage,
            transformOrigin: `${geo.origin.x}px ${geo.origin.y}px`,
            transform: zoomed
              ? `translate(${geo.endShift.x}px, ${geo.endShift.y}px) scale(${END_SCALE})`
              : `translate(${geo.startShift.x}px, ${geo.startShift.y}px) scale(${geo.startScale})`,
            transition: zoomed ? `transform ${ZOOM}` : "none",
          }}
        >
          <style>{`
            @keyframes mt-hand {
              0% { opacity: 1; transform: translate(var(--hx), var(--hy)) rotate(0deg); animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1); }
              42.5% { opacity: 1; transform: translate(0, 0) rotate(0deg); }
              47.5% { opacity: 1; transform: translate(0, 0) rotate(0deg); }
              58% { opacity: 0; transform: translate(0, 0) rotate(0deg); visibility: visible; }
              58.5%, 100% { opacity: 0; transform: translate(0, 0) rotate(0deg); visibility: hidden; }
            }
            @keyframes mt-press {
              0%, 40.5% { transform: scale(1); animation-timing-function: ease-out; }
              44.5% { transform: scale(0.9); }
              52% { transform: scale(0.9); animation-timing-function: ease-out; }
              60%, 100% { transform: scale(1); }
            }
            @keyframes mt-s-fade { from { opacity: 0; } to { opacity: 1; } }
            @keyframes mt-s-in { from { opacity: 0; transform: translateY(calc(16 * var(--su, 1px))); } to { opacity: 1; transform: none; } }
            @keyframes mt-s-hide { to { opacity: 0; } }
            @keyframes mt-blink { 50% { opacity: 0; } }
            @keyframes mt-lupa-in { from { opacity: 0; clip-path: inset(100% 0 0 0); } 15% { opacity: 1; } to { opacity: 1; clip-path: inset(0 0 0 0); } }
            @keyframes mt-lupa-sway { 0%, 100% { transform: rotate(-2deg) translate(0, 0); } 50% { transform: rotate(2.5deg) translate(calc(8 * var(--su, 1px)), calc(-8 * var(--su, 1px))); } }
            @keyframes mt-type { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0 0 0); } }
            @keyframes mt-list-in { from { opacity: 0; transform: translateY(4%); } to { opacity: 1; transform: translateY(0); } }
            @media (prefers-reduced-motion: reduce) {
              .mt-hand, .mt-press { animation: none !important; }
              .mt-hand { opacity: 0 !important; }
            }
          `}</style>
          <div
            style={{
              position: "absolute",
              inset: 0,
            }}
          >
          {EXTRA_PHONES.map((off, i) => {
            const delay = HOME_TAP + HOME_START + HOME_SPAN + HOME_SWEEP + EXTRA_START + i * EXTRA_STEP;
            return (
              <div
                key={`extra-${i}`}
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  transform: zoomed ? `translateX(${off * 100}%)` : "translateX(0)",
                  visibility: zoomed ? "visible" : "hidden",
                  transition: zoomed
                    ? `transform ${EXTRA_SECONDS}s cubic-bezier(0.3, 0, 0.1, 1) ${delay}s`
                    : "none",
                  pointerEvents: "none",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/motion-test/phone2-cut.webp" alt="" style={phonePos} />
                {homeScreen(0, false, true, EXTRA_SCREENS[i])}
              </div>
            );
          })}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/motion-test/phone2-cut.webp"
            alt=""
            style={{
              ...phonePos,
              opacity: revealed ? 1 : 0,
              transition: `opacity ${PHONE_FADE}`,
            }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: `${(ERASE.x / MOCK_W) * 100}%`,
              top: `${(ERASE.y / MOCK_H) * 100}%`,
              width: `${(ERASE.w / MOCK_W) * 100}%`,
              height: `${(ERASE.h / MOCK_H) * 100}%`,
              background: "#fff",
            }}
          />
          {UI.map((el) => {
            const h = (el.w * el.lh) / el.lw;
            const top = el.y + el.h / 2 - h / 2;
            const delay = UI_DELAY + el.step * UI_STEP;
            const pressed = el.src === "skip";
            return (
              <div
                key={el.src}
                className={pressed ? "mt-press" : undefined}
                style={{
                  position: "absolute",
                  left: `${(el.x / MOCK_W) * 100}%`,
                  top: `${(top / MOCK_H) * 100}%`,
                  width: `${(el.w / MOCK_W) * 100}%`,
                  animation:
                    pressed && zoomed ? `mt-press ${HAND_TOTAL}s linear ${HAND_DELAY}s both` : "none",
                  visibility: zoomed ? "hidden" : "visible",
                  transition: zoomed ? `visibility 0s linear ${HOME_TAP + HOME_FADE}s` : "none",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/motion-test/ui/${el.src}.png`}
                  alt=""
                  style={{
                    display: "block",
                    width: "100%",
                    opacity: zoomed ? 1 : 0,
                    transform: zoomed ? "translateY(0px)" : `translateY(${UI_RISE}px)`,
                    transition: zoomed
                      ? `opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s, transform 0.8s ${SOFT_ELASTIC} ${delay}s`
                      : "none",
                  }}
                />
              </div>
            );
          })}
          <video
            ref={videoRef}
            src="/motion-test/hero.mp4"
            autoPlay
            muted
            playsInline
            onTimeUpdate={onTimeUpdate}
            style={{
              position: "absolute",
              ...geo.video,
              display: "block",
              mixBlendMode: "multiply",
              clipPath: `inset(0px ${geo.clipX}px)`,
              visibility: zoomed ? "hidden" : "visible",
              transition: zoomed ? `visibility 0s linear ${HOME_TAP + HOME_FADE}s` : "none",
            }}
          />
          {homeScreen(HOME_TAP, true)}
          {SHOW_SEARCH && searchSeq()}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="mt-hand"
            src="/motion-test/ui/hand.png"
            alt=""
            style={{
              position: "absolute",
              left: `${((HAND.targetX - (HAND.tipX * HAND.w) / HAND.lw) / MOCK_W) * 100}%`,
              top: `${((HAND.targetY - (HAND.tipY * HAND.w) / HAND.lw) / MOCK_H) * 100}%`,
              width: `${(HAND.w / MOCK_W) * 100}%`,
              opacity: 0,
              ["--hx" as string]: `${geo.handFrom.x}px`,
              ["--hy" as string]: `${geo.handFrom.y}px`,
              ["--k" as string]: `${geo.scale}px`,
              filter: "drop-shadow(calc(7 * var(--k)) calc(12 * var(--k)) calc(14 * var(--k)) rgba(0, 0, 0, 0.16))",
              transformOrigin: `${(HAND.tipX / HAND.lw) * 100}% 0%`,
              animation: zoomed ? `mt-hand ${HAND_TOTAL}s linear ${HAND_DELAY}s both` : "none",
              pointerEvents: "none",
            }}
          />
          {/* segunda mão: toca na barra de pesquisa */}
          {SHOW_SEARCH && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="mt-hand"
            src="/motion-test/ui/hand.png"
            alt=""
            style={{
              position: "absolute",
              left: `${((SCREEN.x + (SEARCH_BAR.x * SCREEN.w) / HOME_W - (HAND.tipX * HAND.w) / HAND.lw) / MOCK_W) * 100}%`,
              top: `${((SCREEN.y + (SEARCH_BAR.y * SCREEN.w) / HOME_W - (HAND.tipY * HAND.w) / HAND.lw) / MOCK_H) * 100}%`,
              width: `${(HAND.w / MOCK_W) * 100}%`,
              opacity: 0,
              ["--hx" as string]: `${geo.handFrom.x}px`,
              ["--hy" as string]: `${geo.handFrom.y}px`,
              ["--k" as string]: `${geo.scale}px`,
              filter: "drop-shadow(calc(7 * var(--k)) calc(12 * var(--k)) calc(14 * var(--k)) rgba(0, 0, 0, 0.16))",
              transformOrigin: `${(HAND.tipX / HAND.lw) * 100}% 0%`,
              animation: zoomed ? `mt-hand ${HAND_TOTAL}s linear ${SEARCH_BASE}s both` : "none",
              pointerEvents: "none",
            }}
          />
          )}
          </div>
        </div>
      )}
    </main>
  );
}
