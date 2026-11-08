"use client";

import Link from "next/link";
import { useHref } from "../i18n/lang";

// a seta tem o tamanho da fonte do nome (20 no celular, 24 no desktop), como na lista
// da home; non-scaling-stroke segura o traço em 1,5px nos dois tamanhos
function ArrowLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-5 w-5 md:h-6 md:w-6" style={{ flexShrink: 0 }}>
      <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-5 w-5 md:h-6 md:w-6" style={{ flexShrink: 0 }}>
      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// rodapé dos cases num tom abaixo do fundo, não no preto da home: lá o preto é o
// contato, o fechamento da página; aqui é só navegação e não pede esse peso.
// A sombra da folha fica leve — a de 35% que funciona no preto mancharia o cinza.
const RODAPE = { fundo: "#E6E6E6", texto: "#222", sombra: "0 24px 48px rgba(0,0,0,0.08)" };

const linkStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  minWidth: 0,
  fontWeight: 400,
  color: RODAPE.texto,
  textDecoration: "none",
};

const nomeStyle: React.CSSProperties = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

/**
 * A folha dos cases: a página clara por cima do rodapé preto, como na home. Envolve
 * do Nav ao fim do conteúdo — começar antes do Nav importa, senão o preto grudado no
 * fundo aparece atrás dele no topo. O respiro de baixo (72/100) é o mesmo das quebras
 * de seção: quem marca o fim agora é a borda da folha, não a distância.
 */
export function Folha({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="pb-[72px] md:pb-[100px]"
      style={{ position: "relative", zIndex: 1, background: "#F2F2F2", boxShadow: RODAPE.sombra }}
    >
      {children}
    </div>
  );
}

/**
 * Fim do case: rodapé preto revelado por baixo da folha, só com anterior e próximo,
 * pelo nome do projeto. No celular um embaixo do outro (anterior à esquerda, próximo
 * à direita): lado a lado os nomes cortavam. Os nomes têm o tamanho dos nomes de
 * projeto do resto do site — 24 no desktop (lista da home), 20 no celular.
 */
export default function BottomNav({
  prev,
  next,
}: {
  prev: { label: string; href: string };
  next: { label: string; href: string };
}) {
  const href = useHref();
  return (
    <footer style={{ position: "sticky", bottom: 0, zIndex: 0, background: RODAPE.fundo }}>
      <nav
        className="mx-auto flex flex-col gap-5 px-6 py-12 md:flex-row md:gap-4 md:px-10 md:py-16"
        style={{ maxWidth: 1440 }}
      >
        <Link
          href={href(prev.href)}
          className="text-[20px] tracking-[-0.012em] md:flex-1 md:text-[24px] md:tracking-[-0.01em] hover:opacity-60 transition-opacity duration-200"
          style={linkStyle}
        >
          <ArrowLeft />
          <span style={nomeStyle}>{prev.label}</span>
        </Link>
        <Link
          href={href(next.href)}
          className="self-end text-[20px] tracking-[-0.012em] md:flex-1 md:justify-end md:text-[24px] md:tracking-[-0.01em] hover:opacity-60 transition-opacity duration-200"
          style={linkStyle}
        >
          <span style={nomeStyle}>{next.label}</span>
          <ArrowRight />
        </Link>
      </nav>
    </footer>
  );
}
