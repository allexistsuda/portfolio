"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

// Slide "design system" (1920 x 1080): lado esquerdo é o PNG de referência, estático, sem motion.
// Lado direito começa já na 1ª cor (sem entrada) e troca de cor com a cor subindo de baixo —
// mesma mecânica do reveal preto do Contact (app/page.tsx): o canto direito sobe primeiro e mais
// rápido, o esquerdo vem atrás e equaliza, fechando no topo.
// Texto (hex + nome) é o PNG exportado pronto (texto já na cor certa), não recriado em CSS.
// Tecla R reinicia (útil pra gravar várias vezes).
const W = 1920;
const H = 1080;
// inteiros: largura fracionária + canvas escalado faz o navegador arredondar cada camada
// separadamente e vazar um fio no encontro das duas metades
const LEFT_W = Math.round(W * 0.51);
const RIGHT_W = W - LEFT_W;
const SEAM_OVERLAP = 2; // o painel avança 2px por baixo da imagem da esquerda, matando a emenda

const COLOR_HOLD = 2200; // ms que cada cor fica parada antes do próximo wipe
const RISE_DUR = 900; // ms da subida até fechar

const clamp = (n: number) => Math.min(1, Math.max(0, n));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
// O recorte estoura 2% além das bordas: se parar exatamente em 0%/100%, o antialiasing da borda
// (ainda por cima com o canvas escalado) deixa vazar um fio da cor de trás.
const BLEED = 2;
const X0 = -BLEED;
const X1 = 100 + BLEED;
const clipY = (v: number) => (1 - v) * (100 + BLEED * 2) - BLEED; // v=0 -> 102% (fora, embaixo); v=1 -> -2% (fora, em cima)
const CLOSED_CLIP = `polygon(${X0}% ${clipY(0)}%, ${X1}% ${clipY(0)}%, ${X1}% ${clipY(0)}%, ${X0}% ${clipY(0)}%)`;

// posição medida pixel a pixel na referência (painel ~1001x989): bloco de texto (hex+nome) começa
// a 31.3% do topo e 7.1% da largura do painel. Os PNGs têm ~19px/1px de respiro antes do texto
// (consistente entre todos), por isso a âncora já desconta isso.
const TEXT_SCALE = 0.57; // escala aplicada ao tamanho nativo dos PNGs pra bater com a referência
const TEXT_LEFT = SEAM_OVERLAP + RIGHT_W * 0.071 - 1 * TEXT_SCALE; // compensa a sobreposição da emenda
const TEXT_TOP = H * 0.313 - 19 * TEXT_SCALE;

const COLORS = [
  { hex: "#3AAE5B", name: "Chateau Green", png: "chateau-green.png", w: 670, h: 530 },
  { hex: "#1C1C1E", name: "Aesthetic Black", png: "aesthetic-black.png", w: 758, h: 530 },
  { hex: "#6B6E6D", name: "Antique Silver", png: "antique-silver.png", w: 626, h: 530 },
  { hex: "#F3F4F6", name: "Titanium White", png: "titanium-white.png", w: 710, h: 530 },
  { hex: "#59D07B", name: "Esmerald", png: "esmerald.png", w: 762, h: 334 },
];

function ColorPanelText({ png, w, h }: { png: string; w: number; h: number }) {
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={`/design-slide-motion/${png}`}
      alt=""
      style={{ position: "absolute", left: TEXT_LEFT, top: TEXT_TOP, width: w * TEXT_SCALE, height: h * TEXT_SCALE }}
    />
  );
}

export default function DesignSlideMotion() {
  const [fit, setFit] = useState({ scale: 1, ox: 0, oy: 0 });
  const [run, setRun] = useState(0); // muda a key pra reiniciar tudo
  const [index, setIndex] = useState(0); // cor atual (assentada)
  const [wipeRun, setWipeRun] = useState(0); // 0 = nenhuma subida ainda; incrementa a cada troca
  const riseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onFit = () => {
      // margem preta sempre visível ao redor (não gruda nas bordas da janela)
      const PADDING = 0.86;
      const scale = Math.min(window.innerWidth / W, window.innerHeight / H) * PADDING;
      setFit({ scale, ox: (window.innerWidth - W * scale) / 2, oy: (window.innerHeight - H * scale) / 2 });
    };
    onFit();
    window.addEventListener("resize", onFit);
    return () => window.removeEventListener("resize", onFit);
  }, []);

  const replay = useCallback(() => {
    setRun((r) => r + 1);
    setIndex(0);
    setWipeRun(0);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "r" || e.key === "R") replay();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [replay]);

  // ciclo automático: espera, dispara a próxima subida; ao fechar no topo, a cor assenta e reagenda
  useEffect(() => {
    const t = setTimeout(() => setWipeRun((w) => w + 1), COLOR_HOLD);
    return () => clearTimeout(t);
  }, [index, run]);

  const nextIndex = (index + 1) % COLORS.length;
  const color = COLORS[index];

  // Assim que a cor assenta (index muda), esconde a camada de cima de novo. Precisa ser na mão:
  // o React não reescreve um style inline cujo valor no JSX não mudou, então o clip-path aberto
  // que o rAF deixou no fim da subida ficaria lá, mostrando a próxima cor inteira de uma vez.
  // useLayoutEffect = roda depois do DOM commitar a cor nova embaixo e antes de pintar (sem flash).
  useLayoutEffect(() => {
    if (riseRef.current) riseRef.current.style.clipPath = CLOSED_CLIP;
  }, [index, run]);

  // anima a subida: direita sobe primeiro e mais rápido, esquerda vem atrás e equaliza no topo.
  // A camada é fixa (nunca remonta) — resetamos o clip-path na mão antes de cada subida pra não
  // depender da ordem entre o React re-renderizando o style declarativo e o rAF escrevendo nele.
  useEffect(() => {
    if (wipeRun === 0) return;
    const el = riseRef.current;
    if (!el) return;
    el.style.clipPath = CLOSED_CLIP;
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const p = clamp((now - start) / RISE_DUR);
      const right = easeOut(clamp(p * 1.25));
      const left = easeInOut(clamp((p - 0.12) / 0.88));
      el.style.clipPath = `polygon(${X0}% ${clipY(left)}%, ${X1}% ${clipY(right)}%, ${X1}% ${clipY(0)}%, ${X0}% ${clipY(0)}%)`;
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setIndex(nextIndex);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wipeRun]);

  return (
    <main style={{ position: "fixed", inset: 0, background: "#000", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: fit.ox,
          top: fit.oy,
          width: W,
          height: H,
          background: "#FFFFFF",
          overflow: "hidden",
          transformOrigin: "0 0",
          transform: `scale(${fit.scale})`,
        }}
      >
        {/* esquerda: o PNG de referência direto, sem recriar com CSS — garante a posição exata */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/design-slide-motion/typography.png"
          alt=""
          style={{ position: "absolute", left: 0, top: 0, width: LEFT_W, height: "auto" }}
        />

        {/* direita: já começa na 1ª cor, sem entrada. Troca de cor com a próxima cor subindo de
            baixo — direita primeiro e mais rápido, esquerda atrás equalizando (igual ao Contact). */}
        <div key={run} style={{ position: "absolute", top: 0, right: 0, width: RIGHT_W + SEAM_OVERLAP, height: H }}>
          {/* camada atual (assentada) */}
          <div style={{ position: "absolute", inset: 0, background: color.hex }}>
            <ColorPanelText png={color.png} w={color.w} h={color.h} />
          </div>

          {/* camada da próxima cor, subindo de baixo (clip-path animado via rAF). Fica sempre
              montada (nunca remonta) — o efeito reseta o clip-path na mão a cada ciclo. */}
          <div
            ref={riseRef}
            style={{
              position: "absolute",
              inset: 0,
              background: COLORS[nextIndex].hex,
              clipPath: CLOSED_CLIP,
              willChange: "clip-path",
            }}
          >
            <ColorPanelText png={COLORS[nextIndex].png} w={COLORS[nextIndex].w} h={COLORS[nextIndex].h} />
          </div>
        </div>
      </div>

      <button
        onClick={replay}
        style={{
          position: "fixed",
          right: 16,
          bottom: 16,
          border: 0,
          borderRadius: 999,
          padding: "10px 18px",
          fontSize: 14,
          fontWeight: 500,
          letterSpacing: "-0.1px",
          background: "rgba(34,34,34,0.92)",
          color: "#F6F6F5",
          cursor: "pointer",
        }}
      >
        Reiniciar (R)
      </button>
    </main>
  );
}
