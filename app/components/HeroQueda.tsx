"use client";

import { useEffect } from "react";

// Teste (/teste): fotos que nascem onde o mouse passa no hero da home, atrás da frase,
// ficam um instante paradas, caem até o pé do hero, param, quicam e saem por baixo.
// Base: madewithgsap.com/codrops (GSAP), aqui em WAAPI e bem mais lento.
// Entra na home por fora (procura o .hero-sec), pra home de verdade não mudar nada.
// Só fotos sem outras pessoas reconhecíveis — o link é público.
const FOTOS = [4, 5, 6, 7, 13, 14, 15, 20, 22, 24, 26, 29].map(
  (n) => `/teste-fotos/foto-${String(n).padStart(2, "0")}.jpg`,
);

const LENTIDAO = 4; // × o tempo da ref (0,4s caindo + 0,3s saindo)
const DISTANCIA = 180; // px andados até a próxima foto (a ref usa 1/8 da tela)
const LARGURA = 160; // px no desktop; 112 no celular
const ABRE = 1000; // parada onde nasce, antes de cair
const PAUSA = 800; // parada no chão, antes de sair

// os easings do GSAP, amostrados pra linear() do CSS
const backIn = (k: number) => (t: number) => t * t * ((k + 1) * t - k);
const power1In = (t: number) => t * t;
function curva(f: (t: number) => number) {
  const pts = Array.from({ length: 41 }, (_, i) => +f(i / 40).toFixed(4));
  return `linear(${pts.join(", ")})`;
}

export default function HeroQueda() {
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>(".hero-sec");
    const frases = document.querySelector<HTMLElement>(".hero-frases");
    if (!hero) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // a frase fica por cima das fotos
    if (frases) Object.assign(frases.style, { position: "relative", zIndex: "1" });

    // o palco sobe até o topo da página e vai de borda a borda da janela: as fotos só
    // nascem no hero, mas não são cortadas na faixa do menu nem na margem do container
    const palco = document.createElement("div");
    palco.setAttribute("aria-hidden", "true");
    Object.assign(palco.style, {
      position: "absolute", top: "0", bottom: "0", left: "0", width: "100%",
      overflow: "hidden", zIndex: "0", pointerEvents: "none",
    });
    hero.prepend(palco);
    function estica() {
      const r = hero!.getBoundingClientRect();
      palco.style.top = `${-(r.top + window.scrollY)}px`;
      palco.style.left = `${-r.left}px`;
      palco.style.width = `${document.documentElement.clientWidth}px`;
    }
    estica();
    window.addEventListener("resize", estica);

    FOTOS.forEach((src) => { const i = new Image(); i.src = src; });

    const P1_IN = curva(power1In);
    const BACK_IN_11 = curva(backIn(1.1));
    let proxima = 0;
    let andado = 0;
    let anterior: { x: number; y: number } | null = null;

    function nasce(x: number, y: number, dx: number) {
      const H = palco.clientHeight;
      if (y > H - 200) return; // não solta foto perto do chão
      const t1 = 400 * LENTIDAO; // caindo até o chão
      const t2 = 300 * LENTIDAO; // o pulinho e a saída por baixo
      const total = ABRE + t1 + PAUSA + t2;
      const solta = ABRE / total;
      const corte = (ABRE + t1) / total;
      const volta = (ABRE + t1 + PAUSA) / total;
      const w = window.innerWidth < 768 ? 112 : LARGURA;

      // três camadas porque x, y e o resto têm easings diferentes ao mesmo tempo
      const camadaX = document.createElement("div");
      const camadaY = document.createElement("div");
      const img = document.createElement("img");
      Object.assign(camadaX.style, { position: "absolute", left: `${x}px`, top: `${y}px` });
      Object.assign(camadaY.style, { position: "absolute", left: "0", top: "0" });
      img.src = FOTOS[proxima];
      proxima = (proxima + 1) % FOTOS.length;
      img.alt = "";
      img.draggable = false;
      Object.assign(img.style, {
        display: "block", width: `${w}px`, height: `${Math.round(w * 1.25)}px`,
        objectFit: "cover", maxWidth: "none", borderRadius: "8px", pointerEvents: "none",
      });
      camadaY.appendChild(img);
      camadaX.appendChild(camadaY);
      palco.appendChild(camadaX);

      const xPct = 80 * (Math.random() - 0.5) - 50;
      const yPct = 10 * (Math.random() - 0.5) - 50;
      const giro1 = 20 * (Math.random() - 0.5);
      const giro2 = 40 * (Math.random() - 0.5);
      const BACK_IN_SAIDA = curva(backIn(1 - y / H + 1.5)); // nasce mais alto, sai com mais tranco

      // x: embala na direção do mouse
      camadaX.animate(
        [
          { translate: "0 0" },
          { translate: "0 0", offset: solta, easing: P1_IN },
          { translate: `${2 * dx}px 0`, offset: corte },
          { translate: `${2 * dx}px 0`, offset: volta, easing: P1_IN },
          { translate: `${3.6 * dx}px 0` },
        ],
        { duration: total, fill: "forwards" },
      );
      // y: depois da parada, cai até o chão do hero
      camadaY.animate([{ translate: "0 0" }, { translate: `0 ${H - y}px` }], {
        duration: t1, delay: ABRE, easing: BACK_IN_11, fill: "both",
      });
      // a foto: assenta o pé no chão (-95%), dá o pulinho e sai por baixo (150%)
      img.animate(
        [
          { translate: `${xPct}% ${yPct}%` },
          { translate: `${xPct}% ${yPct}%`, offset: solta, easing: BACK_IN_11 },
          { translate: `${xPct}% -95%`, offset: corte },
          { translate: `${xPct}% -95%`, offset: volta, easing: BACK_IN_SAIDA },
          { translate: `${xPct}% 150%` },
        ],
        { duration: total, fill: "forwards" },
      );
      img.animate(
        [
          { rotate: `${giro1}deg` },
          { rotate: `${giro1}deg`, offset: solta, easing: P1_IN },
          { rotate: "0deg", offset: corte },
          { rotate: "0deg", offset: volta, easing: P1_IN },
          { rotate: `${giro2}deg` },
        ],
        { duration: total, fill: "forwards" },
      );
      // nasce pequena e cresce até o tamanho cheio na parada de abertura
      const fim = img.animate(
        [
          { scale: 0.4, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
          { scale: 1, offset: Math.min(600 / total, solta) },
          { scale: 1 },
        ],
        { duration: total, fill: "forwards" },
      );
      fim.onfinish = () => camadaX.remove();
    }

    function passo(cx: number, cy: number) {
      const r = palco.getBoundingClientRect();
      const x = cx - r.left;
      const y = cy - r.top;
      if (!anterior) { anterior = { x, y }; return; }
      andado += Math.abs(x - anterior.x) + Math.abs(y - anterior.y);
      if (andado > DISTANCIA) {
        andado = 0;
        nasce(x, y, x - anterior.x);
      }
      anterior = { x, y };
    }

    const aoMover = (e: MouseEvent) => passo(e.clientX, e.clientY);
    const aoTocar = (e: TouchEvent) => { const t = e.touches[0]; if (t) passo(t.clientX, t.clientY); };
    const aoSair = () => { anterior = null; };

    hero.addEventListener("mousemove", aoMover);
    hero.addEventListener("mouseleave", aoSair);
    hero.addEventListener("touchstart", aoTocar, { passive: true });
    hero.addEventListener("touchmove", aoTocar, { passive: true });
    return () => {
      hero.removeEventListener("mousemove", aoMover);
      hero.removeEventListener("mouseleave", aoSair);
      hero.removeEventListener("touchstart", aoTocar);
      hero.removeEventListener("touchmove", aoTocar);
      window.removeEventListener("resize", estica);
      palco.remove();
      if (frases) { frases.style.position = ""; frases.style.zIndex = ""; }
    };
  }, []);

  return null;
}
