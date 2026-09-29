"use client";

import { useEffect, useState } from "react";

// 4 frases que se alternam automaticamente (não depende de scroll).
// Troca de linha manual onde fica melhor visualmente.
const phrases = [
  "I build design systems, and\nI stick around to keep them useful.",
  "Data first. Then the design\nhas something to stand on.",
  "AI raises the ceiling on the thinking,\nnot just the pace of shipping.",
  "The small interactions are where\na product starts to feel right.",
];

const HOLD_MS = 5600; // tempo que cada frase fica visível
const TRANSITION_MS = 750; // duração do fade/blur (entrada e saída)

export default function HeroPhrases() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  // entrada da primeira frase: também começa borrada, igual às trocas seguintes
  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(showTimer);
  }, []);

  // fase 1: depois de HOLD_MS, inicia a saída (fade + blur out)
  useEffect(() => {
    if (!visible) return;
    const hideTimer = setTimeout(() => setVisible(false), HOLD_MS);
    return () => clearTimeout(hideTimer);
  }, [index, visible]);

  // fase 2: quando termina de sair, troca o texto e inicia a entrada
  useEffect(() => {
    if (visible) return;
    const nextTimer = setTimeout(() => {
      setIndex((i) => (i + 1) % phrases.length);
      setVisible(true);
    }, TRANSITION_MS);
    return () => clearTimeout(nextTimer);
  }, [visible]);

  return (
    <h1
      className="text-[30px] md:text-[46px] text-center"
      style={{
        fontWeight: 500,
        letterSpacing: "-0.03em",
        lineHeight: 1.05,
        color: "#222",
        whiteSpace: "pre-line",
        opacity: visible ? 1 : 0,
        filter: visible ? "blur(0px)" : "blur(14px)",
        transition: `opacity ${TRANSITION_MS}ms ease, filter ${TRANSITION_MS}ms ease`,
        minHeight: "2.6em",
      }}
    >
      {phrases[index]}
    </h1>
  );
}
