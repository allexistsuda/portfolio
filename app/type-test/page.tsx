"use client";

import { useState } from "react";

// Teste: ajustar peso e tamanho da frase do Contato ao vivo, com a referência do título do About ao lado.
const SAMPLES = [
  { w: 400, s: 48 },
  { w: 500, s: 48 },
  { w: 400, s: 60 },
  { w: 500, s: 60 },
  { w: 400, s: 72 },
  { w: 500, s: 72 },
];

function Phrase({ weight, size, tracking, line }: { weight: number; size: number; tracking: number; line: number }) {
  return (
    <div style={{ fontSize: size, fontWeight: weight, letterSpacing: `${tracking / 100}em`, lineHeight: line, color: "#F4F4F2" }}>
      Want to work together,
      <br />
      or talk about product?
    </div>
  );
}

export default function TypeTest() {
  const [w, setW] = useState(500);
  const [s, setS] = useState(60);
  const [ls, setLs] = useState(-2);
  const [lh, setLh] = useState(1.15);
  const row = (label: string, v: number, set: (n: number) => void, min: number, max: number, step: number) => (
    <label style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13, color: "#8D8D8D" }}>
      <span style={{ width: 90 }}>{label}</span>
      <input type="range" min={min} max={max} step={step} value={v} onChange={(e) => set(+e.target.value)} style={{ flex: 1 }} />
      <span style={{ width: 52, color: "#F4F4F2" }}>{v}</span>
    </label>
  );
  return (
    <main style={{ minHeight: "100vh", background: "#111", padding: "40px" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 2, background: "#111", paddingBottom: 24, display: "grid", gap: 8, maxWidth: 560 }}>
        {row("peso", w, setW, 300, 700, 100)}
        {row("tamanho (px)", s, setS, 32, 96, 2)}
        {row("tracking (/100em)", ls, setLs, -6, 2, 0.5)}
        {row("entrelinha", lh, setLh, 1, 1.4, 0.01)}
      </div>
      <div style={{ padding: "24px 0 56px", borderBottom: "1px solid rgba(244,244,242,0.18)" }}>
        <Phrase weight={w} size={s} tracking={ls} line={lh} />
      </div>
      <div style={{ padding: "32px 0", color: "#8D8D8D", fontSize: 13 }}>Comparação (tracking e entrelinha dos controles):</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(560px, 1fr))", gap: "48px 40px" }}>
        {SAMPLES.map((x) => (
          <div key={`${x.w}-${x.s}`}>
            <div style={{ color: "#8D8D8D", fontSize: 13, marginBottom: 12 }}>{x.w} · {x.s}px</div>
            <Phrase weight={x.w} size={x.s} tracking={ls} line={lh} />
          </div>
        ))}
      </div>
      <div style={{ marginTop: 64, color: "#8D8D8D", fontSize: 13 }}>Referência: título do About (500 · 36px, claro sobre escuro só para comparar)</div>
      <div style={{ marginTop: 12, fontSize: 36, fontWeight: 500, lineHeight: "44px", letterSpacing: "-0.72px", color: "#F4F4F2", maxWidth: 560 }}>
        I&apos;m Allexis, a Product Designer with end-to-end experience, from discovery and user journeys to prototyping and iterating on live products.
      </div>
    </main>
  );
}
