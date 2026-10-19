"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

const MENOS_MOVIMENTO = "(prefers-reduced-motion: reduce)";

function assinarMovimento(aoMudar: () => void) {
  const mq = window.matchMedia(MENOS_MOVIMENTO);
  mq.addEventListener("change", aoMudar);
  return () => mq.removeEventListener("change", aoMudar);
}

/**
 * Um pedaço da peça, em pixels do arquivo: `x`/`y` é o canto de cima à esquerda,
 * `w`/`h` o tamanho do recorte, e `sw`/`sh` o tamanho do vídeo inteiro.
 *
 * Serve pra quebrar uma arte larga em partes no celular sem gerar arquivo novo: os
 * pedaços saem do mesmo vídeo, que o navegador baixa uma vez só.
 */
export type Recorte = { x: number; y: number; w: number; h: number; sw: number; sh: number };

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
export default function VideoNaTela({ src, estatico, alt, repetir = false, recorte, fundo = "#FFFFFF" }:
  { src: string; estatico: string; alt: string; repetir?: boolean; recorte?: Recorte; fundo?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const caixa = useRef<HTMLDivElement>(null);
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
    // Com recorte quem é observado é o quadro, não o vídeo: o vídeo é bem maior que o
    // quadro e o que sobra fica cortado por overflow, que o observador desconta. A fração
    // visível do vídeo empaca perto de 30% e os 60% nunca chegam — ou seja, nunca tocava.
    obs.observe(caixa.current ?? v);
    return () => obs.disconnect();
  }, [semMovimento]);

  // Dentro do recorte a peça inteira é posicionada por cima do quadro e sobra pra fora.
  // A largura vem da regra de três entre o arquivo e o pedaço, e os deslocamentos são em
  // % do próprio quadro — assim tudo acompanha a largura da tela sem conta em JS.
  // maxWidth: "none" é obrigatório: o preflight do Tailwind põe max-width:100% em img e
  // video, o que espremeria a peça de volta na largura do quadro e desalinharia o recorte.
  const estilo: React.CSSProperties = recorte
    ? {
        position: "absolute",
        width: `${(100 * recorte.sw) / recorte.w}%`,
        height: "auto",
        maxWidth: "none",
        left: `${(-100 * recorte.x) / recorte.w}%`,
        top: `${(-100 * recorte.y) / recorte.h}%`,
        display: "block",
      }
    : { width: "100%", height: "auto", display: "block", borderRadius: 16, background: fundo };

  const midia = semMovimento ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={estatico} alt={recorte ? "" : alt} style={estilo} />
  ) : (
    <video
      ref={ref}
      src={src}
      muted
      playsInline
      loop={repetir}
      preload="auto"
      aria-label={recorte ? undefined : alt}
      style={estilo}
    />
  );

  if (!recorte) return midia;

  return (
    <div
      ref={caixa}
      role="img"
      aria-label={alt}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 16,
        aspectRatio: `${recorte.w} / ${recorte.h}`,
        background: fundo,
      }}
    >
      {midia}
    </div>
  );
}
