"use client";

import { useRef, useState, useEffect } from "react";
import Reveal from "./Reveal";

/**
 * Slider de depoimentos (teste) — cards em rolagem horizontal com scroll-snap,
 * na mesma guia editorial do resto da página.
 *
 * ATENÇÃO: só o primeiro card tem texto real (mandado pelo Allexis). Os outros
 * dois são marcadores vazios pra dar o que arrastar no teste — nenhum elogio
 * aqui foi inventado. Substituir pelos depoimentos reais do LinkedIn, com
 * nome e cargo, antes de qualquer publicação.
 */

type Depoimento = { texto: string; nome: string; cargo: string; vazio?: boolean };

const DEPOIMENTOS: Depoimento[] = [
  {
    texto:
      "Great professional and person. Very committed, solves problems very quick, excellent art director and motion designer.",
    // AUTORIA PENDENTE — nome e cargo abaixo são marcadores, não pessoas reais
    nome: "Nome Sobrenome",
    cargo: "Cargo, Empresa",
  },
  {
    texto:
      "Allexis is a passionate, creative and hardworking guy I was lucky enough to work with. Always getting things done, he is an invaluable teamplayer.",
    // AUTORIA PENDENTE — idem
    nome: "Nome Sobrenome",
    cargo: "Cargo, Empresa",
  },
  { texto: "(colar aqui o depoimento 3)", nome: "—", cargo: "", vazio: true },
];

// um card por vez, ocupando a coluna inteira — sem espiar o próximo
const GAP = 20;

export default function Depoimentos() {
  const trilhoRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(0);

  // acompanha em qual card a rolagem parou, pra acender o indicador certo
  useEffect(() => {
    const el = trilhoRef.current;
    if (!el) return;
    const onScroll = () => setPos(Math.round(el.scrollLeft / (el.clientWidth + GAP)));
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const irPara = (i: number) => {
    const el = trilhoRef.current;
    el?.scrollTo({ left: i * (el.clientWidth + GAP), behavior: "smooth" });
  };

  return (
    // sem padding nem largura própria: mora dentro da coluna da timeline e herda a guia dela.
    // minWidth 0 é obrigatório: sem ele o item de grid estica até caber o trilho inteiro e vaza.
    <div style={{ marginTop: 56, minWidth: 0, maxWidth: "100%" }}>
      <div style={{ minWidth: 0, maxWidth: "100%" }}>
        <Reveal triggerMargin="0%">
          <div
            ref={trilhoRef}
            className="depo-trilho"
            style={{ display: "flex", gap: GAP, overflowX: "auto", scrollSnapType: "x mandatory" }}
          >
            {DEPOIMENTOS.map((d, i) => (
              <div
                key={i}
                style={{
                  flex: "0 0 100%",
                  scrollSnapAlign: "start",
                  border: "1px solid #DEDEDE",
                  borderRadius: 14,
                  padding: "28px 28px 24px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: 210,
                }}
              >
                <p
                  style={{
                    fontSize: 20,
                    fontWeight: 400,
                    letterSpacing: "-0.45px",
                    lineHeight: "29px",
                    color: d.vazio ? "#BDBDBD" : "#222",
                  }}
                >
                  {d.texto}
                </p>
                <p style={{ fontSize: 14, letterSpacing: "-0.1px", lineHeight: "21px", color: "#8D8D8D", marginTop: 24 }}>
                  {d.nome}
                  {d.cargo ? `, ${d.cargo}` : ""}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* indicadores: traços finos, no lugar das bolinhas */}
        <div style={{ display: "flex", gap: 6, marginTop: 20 }}>
          {DEPOIMENTOS.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Depoimento ${i + 1}`}
              onClick={() => irPara(i)}
              style={{
                width: 28,
                height: 2,
                border: "none",
                padding: 0,
                cursor: "pointer",
                background: i === pos ? "#222" : "#DEDEDE",
                transition: "background 0.3s ease",
              }}
            />
          ))}
        </div>
      </div>

      {/* esconde a barra de rolagem sem perder o arrasto */}
      <style>{`
        .depo-trilho { scrollbar-width: none; }
        .depo-trilho::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
