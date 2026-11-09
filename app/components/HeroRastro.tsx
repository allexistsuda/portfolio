"use client";

import { useEffect } from "react";

// Teste (/teste): fotos que nascem onde o mouse passa no hero da home, atrás da frase.
// Base: demo 1 do "Image Trail Effects" da Codrops — a foto aparece num ponto que vem
// atrasado atrás do mouse, desliza até ele e some encolhendo. GSAP de lá, em WAAPI aqui.
// Na Codrops ela começa a sumir aos 0,4s; aqui fica 1s inteira, pra dar tempo de ver.
// Entra na home por fora (procura o .hero-sec), pra home de verdade não mudar nada.
// Só fotos sem outras pessoas reconhecíveis — o link é público.
const FOTOS = [4, 5, 6, 7, 13, 14, 15, 20, 22, 24, 26, 29].map(
  (n) => `/teste-fotos/foto-${String(n).padStart(2, "0")}.jpg`,
);

const DISTANCIA = 100; // px andados até a próxima foto (Codrops: 100)
const DESLIZE = 900; // ms do ponto atrasado até o mouse (Codrops: 0,9s)
const ESPERA = 1000; // ms inteira antes de começar a sumir (Codrops: 0,4s)
const SAIDA = 1000; // ms apagando e encolhendo (Codrops: 1s)
const ESCALA_FINAL = 0.2; // (Codrops: 20%)
const LARGURA = 160; // px no desktop, 112 no celular; proporção 4:5

const EXPO_OUT = "cubic-bezier(0.16, 1, 0.3, 1)";
const POWER1_OUT = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";
const QUINT_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";

export default function HeroRastro() {
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

    let proxima = 0;
    let z = 1;
    let vivas = 0;
    let mouse: { x: number; y: number } | null = null;
    let ultimo: { x: number; y: number } | null = null; // onde nasceu a última
    let atrasado: { x: number; y: number } | null = null; // segue o mouse a 10% por quadro
    let quadro = 0;

    // o ponto atrasado só anda enquanto o mouse anda; parado, o loop dorme
    function anda() {
      if (!mouse || !atrasado) { quadro = 0; return; }
      atrasado.x += (mouse.x - atrasado.x) * 0.1;
      atrasado.y += (mouse.y - atrasado.y) * 0.1;
      if (Math.hypot(mouse.x - atrasado.x, mouse.y - atrasado.y) < 0.5) { quadro = 0; return; }
      quadro = requestAnimationFrame(anda);
    }

    function nasce(x: number, y: number, de: { x: number; y: number }) {
      const w = window.innerWidth < 768 ? 112 : LARGURA;
      const img = document.createElement("img");
      img.src = FOTOS[proxima];
      proxima = (proxima + 1) % FOTOS.length;
      img.alt = "";
      img.draggable = false;
      Object.assign(img.style, {
        position: "absolute", left: `${x}px`, top: `${y}px`,
        width: `${w}px`, height: `${Math.round(w * 1.25)}px`,
        objectFit: "cover", maxWidth: "none", borderRadius: "8px", pointerEvents: "none",
        transform: "translate(-50%, -50%)", zIndex: String(z++),
      });
      palco.appendChild(img);
      vivas++;

      // aparece na hora, no ponto atrasado, e desliza até o mouse
      img.animate([{ translate: `${de.x - x}px ${de.y - y}px` }, { translate: "0 0" }], {
        duration: DESLIZE, easing: EXPO_OUT, fill: "forwards",
      });
      img.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: SAIDA, delay: ESPERA, easing: POWER1_OUT, fill: "both",
      });
      const some = img.animate([{ scale: 1 }, { scale: ESCALA_FINAL }], {
        duration: SAIDA, delay: ESPERA, easing: QUINT_OUT, fill: "both",
      });
      some.onfinish = () => {
        img.remove();
        if (--vivas === 0) z = 1;
      };
    }

    function ponto(cx: number, cy: number) {
      const r = palco.getBoundingClientRect();
      return { x: cx - r.left, y: cy - r.top };
    }

    function aoMover(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      const p = ponto(e.clientX, e.clientY);
      mouse = p;
      if (!ultimo || !atrasado) { ultimo = { ...p }; atrasado = { ...p }; return; }
      if (!quadro) quadro = requestAnimationFrame(anda);
      if (Math.hypot(p.x - ultimo.x, p.y - ultimo.y) <= DISTANCIA) return;
      nasce(p.x, p.y, atrasado);
      ultimo = { ...p };
    }

    // no celular, uma foto por toque
    function aoTocar(e: PointerEvent) {
      if (e.pointerType === "mouse") return;
      const p = ponto(e.clientX, e.clientY);
      nasce(p.x, p.y, p);
    }

    function aoSair() { mouse = null; ultimo = null; atrasado = null; }

    hero.addEventListener("pointermove", aoMover);
    hero.addEventListener("pointerdown", aoTocar);
    hero.addEventListener("pointerleave", aoSair);
    return () => {
      hero.removeEventListener("pointermove", aoMover);
      hero.removeEventListener("pointerdown", aoTocar);
      hero.removeEventListener("pointerleave", aoSair);
      window.removeEventListener("resize", estica);
      cancelAnimationFrame(quadro);
      palco.remove();
      if (frases) { frases.style.position = ""; frases.style.zIndex = ""; }
    };
  }, []);

  return null;
}
