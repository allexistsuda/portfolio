"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { LETTERS, SYMBOL, VIEWBOX } from "./paths";

// Logo Vet Smart montando (1920 x 1080, fundo branco):
// 1) o símbolo vem de trás, no centro da tela, crescendo;
// 2) vai para o lado, na posição final;
// 3) o nome sai de uma máscara, por baixo, letra a letra (como o texto do Fuel);
// 4) quando montam, estão ~20% maiores que o final: dão um zoom out e encaixam;
// 5) o verde sobe por baixo, com a borda inclinada (direita na frente, esquerda atrás), igual ao
//    wipe do design-slide-motion. A palavra branca JÁ ESTÁ posicionada no lugar final — ela não
//    anda nem cresce, quem a revela é a mesma subida. Sem movimento do logo, sem estranheza.
const GREEN = "#3CAA5E";
const INK = "#111111";
const BRAND = "#48B46C"; // verde do fundo final

/**
 * A geometria sai de quatro números: o quadro, a largura do lockup e onde ele para.
 * Assim o mesmo componente serve à tela cheia (1920x1080) e ao render que vai virar
 * vídeo no /vet-smart, onde o logo precisa cair no tamanho exato do 02.png.
 */
function geometria(W: number, H: number, LOGO_W: number, CX: number, CY: number) {
  const S = LOGO_W / 1503.13; // 1503.13 = largura do viewBox do lockup
  const LOGO_H = 238.03 * S;
  const LEFT = CX - LOGO_W / 2;
  const TOP = CY - LOGO_H / 2;
  const SYMBOL_CX = 135 * S;
  const SYMBOL_CY = 119 * S;
  return {
    W, H, S, LOGO_W, LOGO_H, LEFT, TOP, SYMBOL_CX, SYMBOL_CY,
    START_DX: W / 2 - LEFT - SYMBOL_CX, // o símbolo parte do centro do quadro
    START_DY: H / 2 - TOP - SYMBOL_CY,
  };
}

/**
 * O símbolo do SVG é menor e mais afastado da palavra do que no lockup oficial (o do
 * public/vet-smart/02.png). Medido lá: símbolo 221px de largura contra 202 aqui, e 27px
 * de vão contra 48. Estes dois números corrigem a diferença em unidades do viewBox, então
 * valem em qualquer escala. Aplicados ao símbolo, não à palavra — ela já batia.
 */
const SIMBOLO_ESCALA = 221 / 201.9; // 1.0946
const SIMBOLO_DX = 14.1; // unidades do viewBox, empurrando o símbolo na direção da palavra

// tela cheia: logo de 783px centrado em (961, 553) — 13px abaixo do centro do quadro
const TELA = geometria(1920, 1080, 783, 961, 553);

// render pro /vet-smart: quadro e lockup medidos no public/vet-smart/02.png, onde o logo
// ocupa 1124x200 centrado em (1360, 732) — 19px abaixo do centro, a mesma proporção.
const RENDER = geometria(2720, 1426, 1124, 1360, 732);

// o enquadramento final do verde ainda é calculado sobre a tela cheia
const { W, H, LOGO_W, LOGO_H, S } = TELA;

// ordem das letras, da esquerda para a direita (por posição no desenho): v e t s m a r t
const RANK = [7, 4, 5, 0, 1, 2, 3, 6];

const EASE = "cubic-bezier(0.44, 0, 0.34, 0.98)"; // a mesma do Fuel
const ZOOM = 1.2; // tamanho com que montam

// ---------- final: verde subindo por baixo + palavra branca já posicionada ----------
// Medidas tiradas do vetsmart-full.svg: o ícone vai de x 0 a 270 e a palavra de x 333,8 a 1503,13.
const LETTERS_X0 = 333.8 * S;
const LETTERS_W = (1503.13 - 333.8) * S;
const LETTERS_H = 203.1 * S;

// Sem o ícone a palavra ocupa 609px de 1920 (31,7% do quadro) contra 783px (40,8%) do lockup
// completo — o final perderia presença no tamanho original. END_SCALE compensa a maior parte.
const END_SCALE = 1.18;
// Posição estática da palavra: centrada no quadro. O svg é o logo inteiro, deslocado de modo que
// seja a PALAVRA (e não o logo com ícone) que fique no centro.
const END_W = LOGO_W * END_SCALE;
const END_H = LOGO_H * END_SCALE;
const END_LEFT = W / 2 - (LETTERS_X0 + LETTERS_W / 2) * END_SCALE;
const END_TOP = H / 2 - (LETTERS_H / 2) * END_SCALE;

// Subida: mesma mecânica do design-slide-motion — a direita sobe primeiro e mais rápido,
// a esquerda vem atrás e as duas equalizam no topo, deixando a borda inclinada.
const RISE_AT = 2.1; // s
const RISE_DUR = 900; // ms
const clamp = (n: number) => Math.min(1, Math.max(0, n));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
// O recorte estoura 2% além das bordas: parar exatamente em 0%/100% deixa vazar um fio do que
// está atrás por causa do antialiasing.
const BLEED = 2;
const X0 = -BLEED;
const X1 = 100 + BLEED;
const clipY = (v: number) => (1 - v) * (100 + BLEED * 2) - BLEED; // v=0 -> embaixo, fora; v=1 -> em cima, fora
const CLOSED_CLIP = `polygon(${X0}% ${clipY(0)}%, ${X1}% ${clipY(0)}%, ${X1}% ${clipY(0)}%, ${X0}% ${clipY(0)}%)`;

// ritmo em ondas que se sobrepõem: cada etapa entra com um acento (arranca rápido) ainda enquanto a anterior está assentando,
// então o movimento não "para" entre uma e outra (faz-faz-faz, em vez de faz-para-faz-para).
const T = {
  grow: 0.0, // o símbolo "estoura" no centro
  move: 0.3, // vai para o lado quando o símbolo está uns 65% crescido
  rise: 0.5, // o nome sobe da máscara, letra a letra, ainda durante o deslize
  stagger: 0.045,
  zoom: 1.0, // o zoom out começa com as letras ainda subindo
};

export default function LogoMotion() {
  const [fit, setFit] = useState({ scale: 1, ox: 0, oy: 0 });
  // ?render=1 liga o modo de captura: quadro do /vet-smart, 1:1 na tela, sem o verde,
  // e o relógio passa a ser o window.__t que o capturar-frames.mjs escreve a cada quadro.
  // useSyncExternalStore e não useState+useEffect: a query não muda durante a sessão, então
  // não há nada a assinar — e isso evita a renderização em cascata de setState dentro de efeito.
  const modoRender = useSyncExternalStore(
    () => () => {},
    () => new URLSearchParams(location.search).get("render") === "1",
    () => false, // no servidor, sempre o modo tela
  );
  const riseRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);

  const g = modoRender ? RENDER : TELA;
  // no modo render o quadro sai 1:1, então o encaixe é fixo e não precisa de estado
  const enq = modoRender ? { scale: 1, ox: 0, oy: 0 } : fit;

  // Quadro a quadro: em vez de reescrever as animações, usamos a Web Animations API.
  // currentTime já inclui o animation-delay, então t segundos aqui é exatamente o
  // estado em t segundos lá — e como o conteúdo sai do relógio e não do tempo real,
  // o resultado não depende de quanto o dev server demorou pra pintar.
  useEffect(() => {
    if (!modoRender) return;
    let raf = 0;
    const tick = () => {
      const t = (window as unknown as { __t?: number }).__t ?? 0;
      for (const a of document.getAnimations()) {
        a.pause();
        a.currentTime = t * 1000;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [modoRender]);

  // As duas camadas (verde e palavra branca) recebem EXATAMENTE o mesmo recorte, por isso a
  // palavra aparece junto com a cor, sem animação própria.
  useEffect(() => {
    if (modoRender) return; // o verde não entra no vídeo do /vet-smart
    let raf = 0;
    const start = performance.now() + RISE_AT * 1000;
    const tick = (now: number) => {
      const p = clamp((now - start) / RISE_DUR);
      const right = easeOut(clamp(p * 1.25));
      const left = easeInOut(clamp((p - 0.12) / 0.88));
      const clip = `polygon(${X0}% ${clipY(left)}%, ${X1}% ${clipY(right)}%, ${X1}% ${clipY(0)}%, ${X0}% ${clipY(0)}%)`;
      if (riseRef.current) riseRef.current.style.clipPath = clip;
      if (wordRef.current) wordRef.current.style.clipPath = clip;
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [modoRender]);

  useEffect(() => {
    if (modoRender) return; // no render o quadro sai 1:1; não há encaixe a calcular
    const onFit = () => {
      const scale = Math.min(window.innerWidth / g.W, window.innerHeight / g.H);
      setFit({ scale, ox: (window.innerWidth - g.W * scale) / 2, oy: (window.innerHeight - g.H * scale) / 2 });
    };
    onFit();
    window.addEventListener("resize", onFit);
    return () => window.removeEventListener("resize", onFit);
  }, [modoRender, g.W, g.H]);

  return (
    <main style={{ position: "fixed", inset: 0, background: "#000", overflow: "hidden" }}>
      <style>{`
        @keyframes lg-grow { from { transform: scale(0.2); opacity: 0; } 40% { opacity: 1; } to { transform: scale(1); opacity: 1; } }
        @keyframes lg-move { from { transform: translate(${g.START_DX}px, ${g.START_DY}px); } to { transform: translate(0, 0); } }
        @keyframes lg-rise { from { transform: translateY(${300 * (g.LOGO_W / 783)}px); } to { transform: translateY(0); } }
        @keyframes lg-zoom { from { transform: scale(${ZOOM}); } to { transform: scale(1); } }
      `}</style>
      <div style={{ position: "absolute", left: enq.ox, top: enq.oy, width: g.W, height: g.H, background: "#FFFFFF", overflow: "hidden", transformOrigin: "0 0", transform: `scale(${enq.scale})` }}>
        {/* cena inteira: começa 20% maior e dá zoom out no final */}
        <div style={{ position: "absolute", left: g.LEFT, top: g.TOP, width: g.LOGO_W, height: g.LOGO_H, transformOrigin: "50% 50%", transform: `scale(${ZOOM})`, animation: `lg-zoom 0.8s cubic-bezier(0.4, 0, 0.1, 1) ${T.zoom}s both` }}>
          {/* símbolo: vem de trás, cresce no centro e depois vai para o lado */}
          <div style={{ position: "absolute", inset: 0, animation: `lg-move 0.65s cubic-bezier(0.25, 0.1, 0.1, 1) ${T.move}s both` }}>
            <div style={{ position: "absolute", inset: 0, transformOrigin: `${g.SYMBOL_CX}px ${g.SYMBOL_CY}px`, animation: `lg-grow 0.5s cubic-bezier(0.1, 1, 0.3, 1) ${T.grow}s both` }}>
              <svg
                viewBox={VIEWBOX}
                width={g.LOGO_W}
                height={g.LOGO_H}
                style={{
                  position: "absolute",
                  inset: 0,
                  overflow: "visible",
                  // cresce em torno do próprio centro (SYMBOL_CX/CY é o centro do ícone),
                  // depois encosta na palavra — o mesmo lockup do 02.png
                  transformOrigin: `${g.SYMBOL_CX}px ${g.SYMBOL_CY}px`,
                  transform: `translateX(${SIMBOLO_DX * g.S}px) scale(${SIMBOLO_ESCALA})`,
                }}
                fill={GREEN}
              >
                {SYMBOL.map((d, i) => (
                  <path key={i} d={d} />
                ))}
              </svg>
            </div>
          </div>

          {/* nome: sai de uma máscara, por baixo (o svg corta o que passa da caixa) */}
          <svg viewBox={VIEWBOX} width={g.LOGO_W} height={g.LOGO_H} style={{ position: "absolute", inset: 0, overflow: "hidden" }} fill={INK}>
            {LETTERS.map((d, i) => (
              <path key={i} d={d} style={{ animation: `lg-rise 0.65s ${EASE} ${T.rise + RANK[i] * T.stagger}s both` }} />
            ))}
          </svg>
        </div>

        {/* o verde sobe por baixo e cobre tudo, inclusive o ícone */}
        {!modoRender && (
          <>
            <div ref={riseRef} style={{ position: "absolute", inset: 0, background: BRAND, clipPath: CLOSED_CLIP, willChange: "clip-path" }} />

            {/* a palavra em branco, parada no lugar final e recortada pelo MESMO polígono:
                ela aparece junto com o verde, sem andar nem crescer. */}
            <div ref={wordRef} style={{ position: "absolute", inset: 0, clipPath: CLOSED_CLIP, willChange: "clip-path" }}>
              <svg viewBox={VIEWBOX} width={END_W} height={END_H} style={{ position: "absolute", left: END_LEFT, top: END_TOP, overflow: "visible" }} fill="#FFFFFF">
                {LETTERS.map((d, i) => (
                  <path key={i} d={d} />
                ))}
              </svg>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
