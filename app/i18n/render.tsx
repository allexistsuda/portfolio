import HighlightText from "../components/HighlightText";
import Reveal from "../components/Reveal";

// A segment is either plain text or a highlighted span (yellow marker).
export type Seg = string | { h: string; d?: number };

// A content block inside a TwoCol section: a paragraph or a bullet list.
export type Block =
  | { p: Seg[]; mt?: number }
  | { ul: Seg[][]; mt?: number; liPad?: number };

// O marcador amarelo saiu das internas. Os segmentos { h: "..." } continuam no conteúdo
// de propósito: assim a marcação de quais trechos importam não se perde, e voltar o efeito
// é trocar este false por true. A home não passa por aqui, então não é afetada.
const MARCADOR = false;

function renderSegs(segs: Seg[]) {
  return segs.map((s, i) =>
    typeof s === "string" ? (
      <span key={i}>{s}</span>
    ) : MARCADOR ? (
      <HighlightText key={i} delay={s.d ?? 0.2}>
        {s.h}
      </HighlightText>
    ) : (
      <span key={i}>{s.h}</span>
    )
  );
}

/** Inline renderer for a single run of segments (text + highlights). */
export function Segs({ segs }: { segs: Seg[] }) {
  return <>{renderSegs(segs)}</>;
}

/**
 * Renders an array of content blocks with the portfolio's usual spacing.
 *
 * Com `cascata`, cada bloco entra por conta própria, escalonado — o mesmo ritmo do About
 * na home (80ms de atraso inicial, 70 por item). `base` é quantos itens já entraram antes
 * no mesmo bloco de texto, para o título contar como o primeiro da sequência.
 */
export function Blocks({ blocks, cascata = false, base = 0 }: { blocks: Block[]; cascata?: boolean; base?: number }) {
  const envolver = (i: number, no: React.ReactNode) =>
    cascata ? (
      <Reveal key={i} delay={80 + (base + i) * 70} triggerMargin="0%">
        {no}
      </Reveal>
    ) : (
      no
    );
  return (
    <>
      {blocks.map((b, i) => {
        const mt = b.mt ?? (i === 0 ? 0 : 32);
        if ("ul" in b) {
          return envolver(i,
            <ul
              key={i}
              style={{
                marginTop: b.mt ?? 32,
                listStyle: "disc",
                paddingLeft: "1.2em",
              }}
            >
              {b.ul.map((item, j) => (
                <li key={j} style={{ paddingBottom: b.liPad ?? 0 }}>
                  {renderSegs(item)}
                </li>
              ))}
            </ul>
          );
        }
        return envolver(i,
          <p key={i} style={{ marginTop: mt }}>
            {renderSegs(b.p)}
          </p>
        );
      })}
    </>
  );
}
