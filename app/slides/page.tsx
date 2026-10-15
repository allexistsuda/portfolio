"use client";

import { useCallback, useEffect, useState } from "react";
import ExperienceSlide from "./ExperienceSlide";
import VetSmartSlide from "./VetSmartSlide";
import { W, H } from "./shared";

// Slides em HTML (1920 x 1080). Setas do teclado ou os botões trocam de slide; ?clean esconde os botões (para gravar).
export default function Slides() {
  const [fit, setFit] = useState({ scale: 1, ox: 0, oy: 0 });
  const [index, setIndex] = useState(0);
  const [clean, setClean] = useState(false);

  useEffect(() => {
    const onFit = () => {
      const scale = Math.min(window.innerWidth / W, window.innerHeight / H);
      setFit({ scale, ox: (window.innerWidth - W * scale) / 2, oy: (window.innerHeight - H * scale) / 2 });
    };
    onFit();
    window.addEventListener("resize", onFit);
    // lê ?clean e ?slide=N depois da primeira pintura (evita diferença entre servidor e navegador)
    const raf = requestAnimationFrame(() => {
      const q = new URLSearchParams(window.location.search);
      setClean(q.has("clean"));
      const start = Number(q.get("slide"));
      if (start >= 1 && start <= 2) setIndex(start - 1);
    });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onFit);
    };
  }, []);

  const total = 2;
  const next = useCallback(() => setIndex((i) => Math.min(total - 1, i + 1)), []);
  const prev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") next();
      if (e.key === "ArrowLeft" || e.key === "PageUp") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const btn: React.CSSProperties = { border: 0, borderRadius: 999, padding: "10px 18px", fontSize: 14, fontWeight: 500, letterSpacing: "-0.1px", background: "rgba(34,34,34,0.92)", color: "#F6F6F5", cursor: "pointer" };

  return (
    <main style={{ position: "fixed", inset: 0, background: "#000", overflow: "hidden" }}>
      <style>{`
        @keyframes sl-in { from { opacity: 0; transform: translateY(var(--rise, 24px)); } to { opacity: 1; transform: translateY(0); } }
        @keyframes sl-line { from { transform: scaleY(0); } to { transform: scaleY(1); } }
        @keyframes sl-pop { from { opacity: 0; transform: scale(0.4); } to { opacity: 1; transform: scale(1); } }
      `}</style>
      <div style={{ position: "absolute", left: fit.ox, top: fit.oy, width: W, height: H, background: "#F6F6F5", overflow: "hidden", transformOrigin: "0 0", transform: `scale(${fit.scale})` }}>
        <div key={index} style={{ position: "absolute", inset: 0 }}>
          {index === 0 ? <ExperienceSlide /> : <VetSmartSlide />}
        </div>
      </div>

      {!clean && (
        <div style={{ position: "fixed", right: 20, bottom: 20, display: "flex", alignItems: "center", gap: 10, fontFamily: "inherit" }}>
          <span style={{ fontSize: 13, color: "#8D8D8D", marginRight: 4 }}>{index + 1} / {total}</span>
          <button type="button" onClick={prev} disabled={index === 0} style={{ ...btn, opacity: index === 0 ? 0.35 : 1 }}>← Voltar</button>
          <button type="button" onClick={next} disabled={index === total - 1} style={{ ...btn, opacity: index === total - 1 ? 0.35 : 1 }}>Avançar →</button>
        </div>
      )}
    </main>
  );
}
