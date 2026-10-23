"use client";

import { useEffect, useState } from "react";

// 4 frases que se alternam automaticamente (não depende de scroll).
// Cada frase é [linha1, linha2] — a quebra só é forçada no desktop (md+);
// no mobile o texto flui naturalmente, sem cortar no meio de uma palavra.
const phrases = [
  // a ordem vai do durável pro perecível: quem é, o que faz, como decide, onde se
  // importa, e por último a ferramenta do momento — que é a que envelhece primeiro.
  "Over fifteen years designing products,\nand still obsessed with making things.",
  "I build design systems, and\nI stick around to keep them useful.",
  // o | quebra só no mobile (no desktop vira um espaço); o \n quebra só no desktop
  "Data first.|Then the design\nhas something to stand on.",
  "The small interactions are where\na product starts to feel right.",
  "AI raises the ceiling on the thinking,\nnot just the pace of shipping.",
];

const HOLD_MS = 3800; // tempo que cada frase fica visível
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
    <>
    <style>{`
      .quebra-mobile { display: inline; }
      @media (min-width: 768px) { .quebra-mobile { display: none; } }
    `}</style>
    <h1
      className="text-[30px] md:text-[46px] text-center"
      style={{
        fontWeight: 500,
        letterSpacing: "-0.03em",
        lineHeight: 1.05,
        color: "#222",
        // balance distribui as linhas por igual (no mobile, sem o <br>, o texto fluía
        // deixando preposição e artigo pendurados no fim das linhas)
        textWrap: "balance",
        opacity: visible ? 1 : 0,
        filter: visible ? "blur(0px)" : "blur(14px)",
        transition: `opacity ${TRANSITION_MS}ms ease, filter ${TRANSITION_MS}ms ease`,
        minHeight: "2.6em",
      }}
    >
      {phrases[index].split("\n").map((line, i) => (
        <span key={i}>
          {i > 0 && (
            <>
              {" "}
              <br className="hidden md:inline" />
            </>
          )}
          {line.split("|").map((pedaco, j) => (
            <span key={j}>
              {j > 0 && (
                <>
                  {" "}
                  <br className="quebra-mobile" />
                </>
              )}
              {pedaco}
            </span>
          ))}
        </span>
      ))}
    </h1>
    </>
  );
}
