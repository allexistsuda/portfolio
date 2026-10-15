"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * Entrada de texto como no Fuel: cada linha fica numa máscara (overflow hidden) e sobe de baixo até o lugar,
 * uma depois da outra. As linhas são medidas no navegador (onde o texto realmente quebra) e refeitas quando a largura muda.
 */
export default function LineReveal({
  text,
  stagger = 110,
  duration = 900,
  delay = 0,
}: {
  text: string;
  stagger?: number;
  duration?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [lines, setLines] = useState<string[] | null>(null);
  const [shown, setShown] = useState(false);
  const lastWidth = useRef(0);

  // mede onde cada linha quebra: agrupa as palavras pelo topo
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || lines) return;
    const spans = Array.from(el.querySelectorAll<HTMLElement>("[data-w]"));
    const out: string[] = [];
    let top = -1;
    spans.forEach((s) => {
      const t = s.offsetTop;
      const word = (s.textContent ?? "").trim();
      if (t !== top) {
        out.push(word);
        top = t;
      } else {
        out[out.length - 1] += " " + word;
      }
    });
    setLines(out);
  }, [lines, text]);

  // refaz a medição quando a largura do bloco muda
  useEffect(() => {
    const el = ref.current?.parentElement;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const w = Math.round(el.getBoundingClientRect().width);
      if (lastWidth.current && lastWidth.current !== w) setLines(null);
      lastWidth.current = w;
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // dispara quando entra na tela
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          obs.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  if (!lines) {
    // primeira passada (medição): texto normal, invisível, palavra por palavra
    return (
      <span ref={ref} style={{ visibility: "hidden" }}>
        {text.split(" ").map((w, i) => (
          <span key={i} data-w style={{ display: "inline-block", whiteSpace: "pre" }}>
            {w}
            {i < text.split(" ").length - 1 ? " " : ""}
          </span>
        ))}
      </span>
    );
  }

  return (
    <span ref={ref} aria-label={text}>
      {lines.map((line, i) => (
        <span key={i} aria-hidden style={{ display: "block", overflow: "hidden", paddingBottom: "0.14em", marginBottom: "-0.14em" }}>
          <span
            style={{
              display: "inline-block",
              whiteSpace: "nowrap",
              transform: shown ? "translateY(0)" : "translateY(115%)",
              transition: shown ? `transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay + i * stagger}ms` : "none",
              willChange: "transform",
            }}
          >
            {line}
          </span>
        </span>
      ))}
    </span>
  );
}
