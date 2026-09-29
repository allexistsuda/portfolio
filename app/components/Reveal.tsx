"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Revela o conteúdo com fade + bounce quando entra na tela.
 * Dispara uma vez só (não fica repetindo/loop).
 *
 * O bounce é uma mola de física de verdade (integrada a cada frame via
 * requestAnimationFrame), não um @keyframes com poucos pontos — uma mola
 * nunca troca de direção abruptamente, então o assentar final fica suave
 * (sem aquela sensação "mecânica"/cortada de um keyframe com poucos stops).
 */

const STIFFNESS = 210; // rigidez da mola
const DAMPING = 12; // amortecimento (crítico ~29; em 12 dá ~20% de overshoot, bem visível)
const START_OFFSET = 26; // px de onde a posição parte até assentar em 0
const OPACITY_MS = 220; // fade-in rápido, desacoplado da mola (opacity não precisa "molar")
const SETTLE_MS = 550; // depois do pico do overshoot, volta suave (2ª fase) em vez de continuar oscilando

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

// duração/curva do fade simples usado em blocos de texto (sem mola/bounce —
// um bloco grande de texto saltando fica "duro"; isso aqui é só um fade+leve subida)
const SUBTLE_OFFSET = 14;
const SUBTLE_MS = 500;

export default function Reveal({
  children,
  delay = 0,
  className,
  style,
  subtle = false,
  triggerMargin = "-30%",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
  subtle?: boolean;
  triggerMargin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  // dispara quando entra na tela (com o delay de stagger)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer = setTimeout(() => setStarted(true), delay);
          obs.disconnect();
        }
      },
      { threshold: 0, rootMargin: `0px 0px ${triggerMargin} 0px` }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, [delay, triggerMargin]);

  // integra a mola frame a frame e escreve direto no DOM (sem re-render)
  useEffect(() => {
    if (subtle || !started) return;
    const el = ref.current;
    if (!el) return;

    let pos = START_OFFSET;
    let vel = 0;
    let last = performance.now();
    const startTime = last;
    let raf: number | null = null;

    // fase 1 ("spring"): sobe com a mola até passar do lugar (overshoot).
    // fase 2 ("settle"): a partir do pico do overshoot, volta suave e controlada
    // até 0 — em vez de deixar a mola continuar oscilando/corrigindo sozinha.
    let phase: "spring" | "settle" = "spring";
    let settleFrom = 0;
    let settleStart = 0;

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;

      if (phase === "spring") {
        const prevVel = vel;
        const acc = -STIFFNESS * pos - DAMPING * vel;
        vel += acc * dt;
        pos += vel * dt;
        // achou o fundo do overshoot (velocidade virou de negativa pra positiva)?
        if (prevVel < 0 && vel >= 0 && pos < 0) {
          phase = "settle";
          settleFrom = pos;
          settleStart = now;
        }
      } else {
        const t = Math.min((now - settleStart) / SETTLE_MS, 1);
        pos = settleFrom * (1 - easeOutCubic(t));
      }

      const opacityT = Math.min((now - startTime) / OPACITY_MS, 1);
      el.style.opacity = String(opacityT);
      el.style.transform = `translateY(${pos}px)`;

      const settleDone = phase === "settle" && now - settleStart >= SETTLE_MS;
      const springDone = phase === "spring" && Math.abs(pos) < 0.25 && Math.abs(vel) < 4;
      if ((settleDone || springDone) && opacityT >= 1) {
        el.style.transform = "translateY(0px)";
        el.style.opacity = "1";
        raf = null;
      } else {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, [subtle, started]);

  if (subtle) {
    return (
      <div
        ref={ref}
        className={className}
        style={{
          ...style,
          opacity: started ? 1 : 0,
          transform: started ? "translateY(0px)" : `translateY(${SUBTLE_OFFSET}px)`,
          transition: `opacity ${SUBTLE_MS}ms ease-out, transform ${SUBTLE_MS}ms ease-out`,
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: started ? undefined : 0,
        transform: started ? undefined : `translateY(${START_OFFSET}px)`,
      }}
    >
      {children}
    </div>
  );
}
