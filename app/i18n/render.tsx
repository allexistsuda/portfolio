import HighlightText from "../components/HighlightText";

// A segment is either plain text or a highlighted span (yellow marker).
export type Seg = string | { h: string; d?: number };

// A content block inside a TwoCol section: a paragraph or a bullet list.
export type Block =
  | { p: Seg[]; mt?: number }
  | { ul: Seg[][]; mt?: number; liPad?: number };

function renderSegs(segs: Seg[]) {
  return segs.map((s, i) =>
    typeof s === "string" ? (
      <span key={i}>{s}</span>
    ) : (
      <HighlightText key={i} delay={s.d ?? 0.2}>
        {s.h}
      </HighlightText>
    )
  );
}

/** Inline renderer for a single run of segments (text + highlights). */
export function Segs({ segs }: { segs: Seg[] }) {
  return <>{renderSegs(segs)}</>;
}

/** Renders an array of content blocks with the portfolio's usual spacing. */
export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        const mt = b.mt ?? (i === 0 ? 0 : 32);
        if ("ul" in b) {
          return (
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
        return (
          <p key={i} style={{ marginTop: mt }}>
            {renderSegs(b.p)}
          </p>
        );
      })}
    </>
  );
}
