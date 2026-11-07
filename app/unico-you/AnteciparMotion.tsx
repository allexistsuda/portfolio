"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

import { montar } from "./antecipar/motor";
import { CSS, HTML } from "./antecipar/pagina";

/**
 * O fluxo de antecipação ao vivo, em HTML: a mesma peça de public/antecipar-motion.html, num palco de
 * 1920x1080 escalado pra largura do bloco. Ao vivo e não em vídeo porque o texto da tela é desenhado na
 * resolução do aparelho de quem vê — no vídeo os textos pequenos viravam pixel fixo e ficavam moles.
 * No celular o bloco mostra só o aparelho, com folga pra sombra (que sai pra direita e pra baixo).
 *
 * Pra não engasgar: as camadas e as fontes são decodificadas antes do primeiro quadro, o relógio só anda
 * com a peça na tela (fora dela fica parado, sem rAF), e com prefers-reduced-motion fica a Início parada.
 */
const PALCO = { w: 1920, h: 1080 };
const APARELHO = { x: 660, y: 50, w: 640, h: 1030 };

const LARGO = "(min-width: 768px)";
function assinarLargura(aoMudar: () => void) {
  const mq = window.matchMedia(LARGO);
  mq.addEventListener("change", aoMudar);
  return () => mq.removeEventListener("change", aoMudar);
}

// Uma instância só na página (e não uma escondida pra cada tamanho): a máscara da tela é um clipPath
// com id, e duas cópias na página fariam uma apontar pra outra.
export default function AnteciparMotion() {
  const caixa = useRef<HTMLDivElement>(null);
  const palco = useRef<HTMLDivElement>(null);
  const largo = useSyncExternalStore(assinarLargura, () => window.matchMedia(LARGO).matches, () => true);
  const vista = largo ? { x: 0, y: 0, ...PALCO } : APARELHO;

  useEffect(() => {
    const root = palco.current;
    const box = caixa.current;
    if (!root || !box) return;
    const peca = montar(root);
    const semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // o palco acompanha a largura do bloco
    const encaixa = () => {
      const k = box.clientWidth / vista.w;
      root.style.transform = `translate(${-vista.x * k}px, ${-vista.y * k}px) scale(${k})`;
    };
    const tam = new ResizeObserver(encaixa);
    tam.observe(box);
    encaixa();

    // começa no degradê vazio (o mesmo quadro em que o loop apaga); sem movimento, a Início montada
    peca.quadro(semMovimento ? peca.TOQUE - 0.6 : 0);
    if (semMovimento) return () => { tam.disconnect(); root.innerHTML = HTML; };

    let t = 0, ultimo = 0, raf = 0, visivel = false, pronto = false, vivo = true;
    const roda = (agora: number) => {
      if (!visivel || !vivo) { raf = 0; return; }
      if (ultimo) t += Math.min(0.1, (agora - ultimo) / 1000); // volta de outra aba sem pular a peça
      ultimo = agora;
      peca.quadro(t);
      raf = requestAnimationFrame(roda);
    };
    const liga = () => { if (visivel && pronto && !raf) { ultimo = 0; raf = requestAnimationFrame(roda); } };

    const obs = new IntersectionObserver(([e]) => {
      visivel = e.isIntersecting;
      if (visivel) liga();
    }, { threshold: 0.35 });
    obs.observe(box);

    // decodifica as camadas e carrega as fontes antes do primeiro quadro, pra não dar tranco
    const imgs = [...root.querySelectorAll("img")];
    Promise.all([
      ...imgs.map((i) => i.decode().catch(() => {})),
      document.fonts.load('300 48px "Unico Display"'),
      document.fonts.load('500 24px "Unico Display"'),
    ]).then(() => { pronto = true; liga(); });

    return () => {
      vivo = false; obs.disconnect(); tam.disconnect(); cancelAnimationFrame(raf);
      // o motor acrescenta confete e fatias na marcação: volta ao original pra montar de novo limpo
      root.innerHTML = HTML;
    };
  }, [vista.x, vista.y, vista.w]);

  return (
    <div
      ref={caixa}
      aria-label="Fluxo de antecipação do Unico You: da Início ao valor, à confirmação e ao saldo atualizado"
      role="img"
      style={{ position: "relative", width: "100%", aspectRatio: `${vista.w} / ${vista.h}`, overflow: "hidden",
        borderRadius: 16, background: "#fff" }}
    >
      <style>{CSS}</style>
      <div
        ref={palco}
        style={{ position: "absolute", left: 0, top: 0, width: PALCO.w, height: PALCO.h, transformOrigin: "0 0" }}
        dangerouslySetInnerHTML={{ __html: HTML }}
      />
    </div>
  );
}
