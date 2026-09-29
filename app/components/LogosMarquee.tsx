"use client";

/**
 * Faixa de empresas com as quais trabalhei, rolando em loop contínuo,
 * full-bleed (borda a borda). Placeholder: só o nome em texto cinza —
 * troca pelos logos de verdade depois. Sem hover, sem interação.
 */

const COMPANIES = ["Ticket", "Santander", "Lojacorr", "Sioux", "Unico ID", "Vet Smart"];

export default function LogosMarquee() {
  const items = [...COMPANIES, ...COMPANIES]; // duplicado pra loop perfeito (translateX -50%)

  return (
    <div
      style={{
        overflow: "hidden",
        width: "100vw",
        marginLeft: "calc(50% - 50vw)",
      }}
    >
      <div
        className="flex items-center"
        style={{
          gap: 64,
          width: "max-content",
          animation: "marquee-scroll 28s linear infinite",
        }}
      >
        {items.map((name, i) => (
          <span
            key={i}
            style={{
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "#C4C4C4",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
