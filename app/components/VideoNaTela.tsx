"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

const MENOS_MOVIMENTO = "(prefers-reduced-motion: reduce)";

function assinarMovimento(aoMudar: () => void) {
  const mq = window.matchMedia(MENOS_MOVIMENTO);
  mq.addEventListener("change", aoMudar);
  return () => mq.removeEventListener("change", aoMudar);
}

/**
 * Um vídeo que se comporta como imagem da página: sem controles, sem som, e só começa
 * quando entra na tela.
 *
 * Sem autoplay porque estas páginas têm milhares de pixels de altura — disparar no load
 * faria a peça acontecer antes de alguém chegar nela. `repetir` separa os dois usos: a
 * montagem de um logo tem fim e para no último quadro; um loop ambiente, como o cachorro
 * ou a fileira rolando, repete. Com prefers-reduced-motion nem monta o vídeo e entrega
 * o quadro estático.
 */
export default function VideoNaTela({ src, estatico, alt, repetir = false }:
  { src: string; estatico: string; alt: string; repetir?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  // a preferência pode mudar durante a sessão, então aqui a assinatura é de verdade
  const semMovimento = useSyncExternalStore(
    assinarMovimento,
    () => window.matchMedia(MENOS_MOVIMENTO).matches,
    () => false,
  );

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        obs.disconnect(); // uma vez só: depois de tocar, não observa mais
        v.play().catch(() => {});
      },
      // 0.6 e não 0.35: estes blocos ocupam quase a tela toda, então a 35% a peça
      // dispararia ainda entrando pela borda de baixo
      { threshold: 0.6 },
    );
    obs.observe(v);
    return () => obs.disconnect();
  }, [semMovimento]);

  if (semMovimento) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={estatico} alt={alt} style={{ width: "100%", height: "auto", display: "block", borderRadius: 16 }} />;
  }

  return (
    <video
      ref={ref}
      src={src}
      muted
      playsInline
      loop={repetir}
      preload="auto"
      aria-label={alt}
      style={{ width: "100%", height: "auto", display: "block", borderRadius: 16, background: "#FFFFFF" }}
    />
  );
}
