"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Foto redonda que "vira" quando aparece na tela: começa de costas (mostrando a fachada da Petlove)
 * e gira até mostrar a frente. Com o mouse em cima ela vira de novo para o outro lado.
 */
export default function FlipPhoto({
  front,
  back,
  size,
  mobileSize,
  delay = 350,
  entrance = true,
  every = 0,
  backScale = 1,
  backPosition = "28% 45%",
}: {
  front: string;
  back: string;
  size: number;
  mobileSize: number;
  delay?: number;
  /** true = começa de costas e gira ao entrar na tela; false = só vira no hover */
  entrance?: boolean;
  /** segundos entre viradas automáticas (0 = desligado); sempre gira para o mesmo lado */
  every?: number;
  /** tamanho da imagem de trás dentro do círculo (1 = preenche; menor = mais afastada) */
  backScale?: number;
  backPosition?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(!entrance);
  const [hover, setHover] = useState(false);
  const [turns, setTurns] = useState(0);

  useEffect(() => {
    if (!every || !shown || hover) return;
    const id = setInterval(() => setTurns((t) => t + 1), every * 1000);
    return () => clearInterval(id);
  }, [every, shown, hover]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !entrance) return;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer = setTimeout(() => setShown(true), delay);
          obs.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, [delay, entrance]);

  // 180° = de costas; 0° = de frente; no hover vai para 180° de novo
  // no hover mostra o verso e segura (o giro automático pausa); ao sair, completa a volta para o mesmo lado
  const angle = !shown ? 180 : (turns + (hover && turns % 2 === 0 ? 1 : 0)) * 180;

  const face: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    borderRadius: "50%",
    overflow: "hidden",
    background: "#F3F3F3",
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
  };

  return (
    <div
      ref={ref}
      className="relative h-[var(--m)] w-[var(--m)] md:h-[var(--d)] md:w-[var(--d)]"
      style={
        {
          "--m": `${mobileSize}px`,
          "--d": `${size}px`,
          perspective: 900,
        } as React.CSSProperties
      }
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setTurns((t) => (t % 2 === 0 ? t + 2 : t));
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformStyle: "preserve-3d",
          transform: `rotateY(${angle}deg)`,
          transition: shown ? "transform 1.1s cubic-bezier(0.22, 1, 0.36, 1)" : "none",
        }}
      >
        <div style={face}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={front} alt="" className="absolute inset-0 h-full w-full object-cover" />
        </div>
        <div style={{ ...face, transform: "rotateY(180deg)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={back} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: backPosition, transform: `scale(${backScale})` }} />
        </div>
      </div>
    </div>
  );
}
