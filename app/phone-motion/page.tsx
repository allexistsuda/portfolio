"use client";

import { useEffect, useRef, useState } from "react";

// Mockup dos três celulares (moldura parada) com o conteúdo de cada tela animado por cima.
// Palco: 2000 x 1317 (o mesmo tamanho do mockup vazio). A tela de cada celular ocupa 482 x 1040,
// com 138px de topo; o 1º celular começa em x=143, o 2º em x=760, o 3º em x=1377 (mesmo espaçamento, 617px).
// A tela 3 está em branco por enquanto (de propósito) — só a moldura do mockup aparece nela.
const W = 2000;
const H = 1317;
const EASE = "cubic-bezier(0.44, 0, 0.34, 0.98)";
const PUNCH = "cubic-bezier(0.16, 1, 0.3, 1)"; // saída forte: arranca rápido e assenta (sem passar do ponto)

// escala das imagens exportadas da tela 1/2 (layers avulsos, ~1,55x do tamanho real na tela)
const S = 0.643;
const CX = 384;
const BTN = { left: 163, w: 440, h: 61.6 };

// ---------- tela 3 (busca): a imagem de referência inteira (925x2000) vira um "sprite" único;
// cada bloco (campo de busca, chips, cada linha da lista) é uma janela recortada por cima dela,
// medida pixel a pixel na imagem original — garante que a posição bate exatamente com a referência.
const K3 = 482 / 925; // escala: tela do celular (482px) / imagem de referência (925px)
const IMG3_H = 2000 * K3; // altura da imagem inteira já escalada pra largura da tela
type Slice3 = { top: number; bottom: number; left?: number; right?: number; delay: number; dist?: number };
const SLICES3: Slice3[] = [
  { top: 115, bottom: 225, right: 715, delay: 0.0, dist: 22 }, // campo de busca + ícone + texto
  { top: 115, bottom: 225, left: 715, delay: 0.05, dist: 18 }, // Cancelar
  { top: 260, bottom: 358, right: 210, delay: 0.12, dist: 16 }, // chip Todos
  { top: 260, bottom: 358, left: 210, right: 440, delay: 0.16, dist: 16 }, // chip Produtos
  { top: 260, bottom: 358, left: 440, right: 685, delay: 0.2, dist: 16 }, // chip Empresas
  { top: 260, bottom: 358, left: 685, delay: 0.24, dist: 16 }, // chip Doenças
  { top: 400, bottom: 430, delay: 0.3 }, // letra "A"
  { top: 460, bottom: 590, delay: 0.36 }, // Alcort
  { top: 618, bottom: 748, delay: 0.42 }, // Alumex
  { top: 776, bottom: 906, delay: 0.48 }, // Atriben
  { top: 934, bottom: 1064, delay: 0.54 }, // Aurivet
  { top: 1091, bottom: 1222, delay: 0.6 }, // Azicox-2
  { top: 1262, bottom: 1294, delay: 0.66 }, // letra "B"
  { top: 1323, bottom: 1453, delay: 0.72 }, // Biopen
  { top: 1481, bottom: 1611, delay: 0.78 }, // Bromelina
  { top: 1651, bottom: 1684, delay: 0.84 }, // letra "C"
  { top: 1713, bottom: 1843, delay: 0.9 }, // Carprofan
  { top: 1870, bottom: 2000, delay: 0.96 }, // Cipro-otic
];

const rise = (delay: number, dist = 46): React.CSSProperties => ({
  opacity: 0,
  ["--rise" as string]: `${dist}px`,
  animation: `ph-in 0.8s ${PUNCH} ${delay}s both`,
});

// ---------- tela 1 (abertura) ----------
type El = { src: string; w: number; h: number; cy: number; delay: number };
const TEXTS: El[] = [
  { src: "logo.png", w: 402 * S, h: 70 * S, cy: 310, delay: 0.0 },
  { src: "tagline.png", w: 594 * S, h: 35 * S, cy: 379, delay: 0.12 },
  { src: "desc.png", w: 580 * S, h: 79 * S, cy: 430, delay: 0.24 },
];
const VIDEO = { w: 530, cx: CX, cy: 690, start: 0.36, dur: 5.084 };

// ---------- tela 2 (home) ----------
const T2 = 0; // as telas montam ao mesmo tempo (cada uma com a sua cascata de cima para baixo)
type P2 = { src: string; x: number; y: number; w: number; h: number; delay: number };
const P2_TEXTS: P2[] = [
  { src: "ic-busca.png", x: 796, y: 218, w: 32 * S, h: 32 * S, delay: 0.0 },
  { src: "t-pesquisar.png", x: 827, y: 228 - (26 * S) / 2, w: 129 * S, h: 26 * S, delay: 0.0 },
  { src: "card-base.png", x: 780, y: 499, w: 686 * S, h: 312 * S, delay: 0.12 },
  { src: "produto-trissulfin.png", x: 780, y: 274, w: 686 * S, h: 374 * S, delay: 0.12 },
  { src: "t-trissulfin.png", x: 801, y: 548 - (24 * S) / 2, w: 208 * S, h: 24 * S, delay: 0.24 },
  { src: "t-trissulfin-sub.png", x: 801, y: 575 - (32 * S) / 2, w: 362 * S, h: 32 * S, delay: 0.24 },
  { src: "ic-seta.png", x: 1169.5, y: 545, w: 48 * S, h: 48 * S, delay: 0.24 },
  { src: "divisor.png", x: 801, y: 607.5 - (3 * S) / 2, w: 622 * S, h: 3 * S, delay: 0.36 },
  { src: "t-eficacia.png", x: 801, y: 641 - (25 * S) / 2, w: 345 * S, h: 25 * S, delay: 0.36 },
  { src: "t-eficacia-sub.png", x: 801, y: 669 - (27 * S) / 2, w: 482 * S, h: 27 * S, delay: 0.36 },
  { src: "ic-seta.png", x: 1169.5, y: 639.5, w: 48 * S, h: 48 * S, delay: 0.36 },
  { src: "dot-ativo.png", x: 983.3, y: 716.5, w: 24 * S, h: 8 * S, delay: 0.48 },
  { src: "dot.png", x: 1003.3, y: 716.5, w: 24 * S, h: 8 * S, delay: 0.48 },
  { src: "t-medicamentos.png", x: 780, y: 769.5 - (30 * S) / 2, w: 284 * S, h: 30 * S, delay: 0.6 },
  { src: "t-vertudo.png", x: 1147.6, y: 769.5 - (21 * S) / 2, w: 115 * S, h: 21 * S, delay: 0.6 },
  { src: "prod-meloxicam.png", x: 779.7, y: 800.4, w: 240 * S, h: 280 * S, delay: 0.72 },
  { src: "prod-enrotrat.png", x: 949.6, y: 800.4, w: 240 * S, h: 280 * S, delay: 0.84 },
  { src: "prod-imunizan.png", x: 1119.7, y: 800.4, w: 240 * S, h: 280 * S, delay: 0.96 },
  { src: "t-meloxicam.png", x: 780, y: 999, w: 132 * S, h: 57 * S, delay: 0.72 },
  { src: "t-enrotrat.png", x: 949.6, y: 999, w: 180 * S, h: 57 * S, delay: 0.84 },
  { src: "t-imunizan.png", x: 1119.7, y: 999, w: 178 * S, h: 63 * S, delay: 0.96 },
  { src: "tb-divisor.png", x: 760, y: 1076, w: 750 * S, h: 2 * S, delay: 1.08 },
  { src: "ic-home.png", x: 807 - (44 * S) / 2, y: 1107 - (44 * S) / 2, w: 44 * S, h: 44 * S, delay: 1.08 },
  { src: "t-home.png", x: 807 - (55 * S) / 2, y: 1135.6 - (14 * S) / 2, w: 55 * S, h: 14 * S, delay: 1.08 },
  { src: "ic-produtos.png", x: 903.6 - (44 * S) / 2, y: 1107 - (44 * S) / 2, w: 44 * S, h: 44 * S, delay: 1.14 },
  { src: "t-produtos.png", x: 903.6 - (86 * S) / 2, y: 1135.6 - (15 * S) / 2, w: 86 * S, h: 15 * S, delay: 1.14 },
  { src: "ic-ferramentas.png", x: 1001 - (44 * S) / 2, y: 1107 - (44 * S) / 2, w: 44 * S, h: 44 * S, delay: 1.2 },
  { src: "t-ferramentas.png", x: 1001 - (121 * S) / 2, y: 1135.6 - (14 * S) / 2, w: 121 * S, h: 14 * S, delay: 1.2 },
  { src: "ic-parceiros.png", x: 1097 - (44 * S) / 2, y: 1107 - (44 * S) / 2, w: 44 * S, h: 44 * S, delay: 1.26 },
  { src: "t-parceiros.png", x: 1097 - (88 * S) / 2, y: 1135.6 - (15 * S) / 2, w: 88 * S, h: 15 * S, delay: 1.26 },
  { src: "ic-mais.png", x: 1193 - (44 * S) / 2, y: 1107 - (44 * S) / 2, w: 44 * S, h: 44 * S, delay: 1.32 },
  { src: "t-mais.png", x: 1193 - (42 * S) / 2, y: 1135.6 - (15 * S) / 2, w: 42 * S, h: 15 * S, delay: 1.32 },
];


export default function PhoneMotion() {
  const [fit, setFit] = useState({ scale: 1, ox: 0, oy: 0 });
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const onFit = () => {
      const scale = Math.min(window.innerWidth / W, window.innerHeight / H);
      setFit({ scale, ox: (window.innerWidth - W * scale) / 2, oy: (window.innerHeight - H * scale) / 2 });
    };
    onFit();
    window.addEventListener("resize", onFit);
    return () => window.removeEventListener("resize", onFit);
  }, []);

  return (
    <main style={{ position: "fixed", inset: 0, background: "#F5F5F5", overflow: "hidden" }}>
      <style>{`
        @keyframes ph-in { from { opacity: 0; transform: translateY(var(--rise, 26px)); } to { opacity: 1; transform: translateY(0); } }
        @keyframes ph-fade { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
      <div style={{ position: "absolute", left: fit.ox, top: fit.oy, width: W, height: H, overflow: "hidden", transformOrigin: "0 0", transform: `scale(${fit.scale})` }}>
        {/* mockup: moldura parada (as 3 telas em branco; o conteúdo entra por cima, só nas telas 1 e 2) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/mockup3/mockup-vazio.webp" alt="" style={{ position: "absolute", left: 0, top: 0, width: W, height: 1317 }} />

        {/* tela 1: recorta o que passar das bordas da tela */}
        <div style={{ position: "absolute", left: 143, top: 138, width: 482, height: 1040, overflow: "hidden", borderRadius: "0 0 52px 52px" }}>
          <div style={{ position: "absolute", left: -143, top: -138, width: W, height: H }}>
            {TEXTS.map((e) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={e.src} src={`/mockup3/tela1/${e.src}`} alt="" style={{ position: "absolute", left: CX - e.w / 2, top: e.cy - e.h / 2, width: e.w, height: e.h, ...rise(e.delay) }} />
            ))}

            {/* desenho (vídeo): o branco do vídeo some contra a tela branca */}
            <video
              ref={videoRef}
              src="/mockup3/tela1/pet.mp4"
              muted
              autoPlay
              loop
              playsInline
              preload="auto"
              style={{ position: "absolute", left: VIDEO.cx - VIDEO.w / 2, top: VIDEO.cy - (VIDEO.w * 512) / 768 / 2, width: VIDEO.w, height: (VIDEO.w * 512) / 768, mixBlendMode: "multiply", opacity: 0, animation: `ph-fade 0.6s ${EASE} ${VIDEO.start}s both` }}
            />

            {/* botões */}
            {[
              { bg: "btn-verde.png", txt: "t-criar.png", tw: 173, th: 24, top: 907, delay: 0.48 },
              { bg: "btn-cinza.png", txt: "t-ja.png", tw: 235, th: 25, top: 984.5, delay: 0.6 },
            ].map((b) => (
              <div key={b.bg} style={{ position: "absolute", left: BTN.left, top: b.top, width: BTN.w, height: BTN.h, ...rise(b.delay, 58) }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/mockup3/tela1/${b.bg}`} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/mockup3/tela1/${b.txt}`} alt="" style={{ position: "absolute", left: (BTN.w - b.tw * S) / 2, top: (BTN.h - b.th * S) / 2, width: b.tw * S, height: b.th * S }} />
              </div>
            ))}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/mockup3/tela1/t-pular.png" alt="" style={{ position: "absolute", left: CX - (78 * S) / 2, top: 1082 - (24 * S) / 2, width: 78 * S, height: 24 * S, ...rise(0.72, 22) }} />
          </div>
        </div>

        {/* tela 2 (home): entra junto com a tela 1 */}
        <div style={{ position: "absolute", left: 760, top: 138, width: 482, height: 1040, overflow: "hidden", borderRadius: "0 0 52px 52px" }}>
          <div style={{ position: "absolute", left: -760, top: -138, width: W, height: H }}>
            {/* campo de busca */}
            <div style={{ position: "absolute", left: 780, top: 202, width: 442, height: 52, boxSizing: "border-box", borderRadius: 9, background: "#F3F3F4", border: "1.2px solid #D6D6DA", ...rise(T2 + 0, 46) }} />
            {P2_TEXTS.map((e, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={`${e.src}-${i}`} src={`/mockup3/tela2/${e.src}`} alt="" style={{ position: "absolute", left: e.x, top: e.y, width: e.w, height: e.h, ...rise(T2 + e.delay, 46) }} />
            ))}
          </div>
        </div>

        {/* tela 3 (busca): cada bloco da referência entra recortado da mesma imagem, com cascata própria */}
        <div style={{ position: "absolute", left: 1377, top: 138, width: 482, height: 1040, overflow: "hidden", borderRadius: "0 0 52px 52px" }}>
          {SLICES3.map((s, i) => {
            const left = s.left ?? 0;
            const right = s.right ?? 925;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: left * K3,
                  top: s.top * K3,
                  width: (right - left) * K3,
                  height: (s.bottom - s.top) * K3,
                  overflow: "hidden",
                  ...rise(s.delay, s.dist ?? 46),
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/mockup3/tela3/completa.webp"
                  alt=""
                  style={{ position: "absolute", left: -left * K3, top: -s.top * K3, width: 482, maxWidth: "none", height: IMG3_H, maxHeight: "none" }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
