"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

import Screen1 from "./Screen1";
import Screen2 from "./Screen2";
import Screen3 from "./Screen3";
import Screen4 from "./Screen4";
import Screen5 from "./Screen5";
import { Clock, SCR_H, SCR_W } from "./parts";

// Conferência das telas recriadas. Sem ?only, mostra as três lado a lado no tamanho que couber.
// Com ?only=2, mostra só aquela tela em 1:1 encostada no canto — é assim que o script de diff
// tira o print pra sobrepor na referência e medir o desvio.
const TELAS = [Screen1, Screen2, Screen3, Screen4, Screen5];

export default function Rebuilt() {
  const [zoom, setZoom] = useState<number | null>(null);
  const [fit, setFit] = useState(1);

  // lido direto da URL (e nunca no servidor), pra não depender de um setState dentro de efeito
  const q = useSyncExternalStore(
    () => () => {},
    () => new URLSearchParams(window.location.search).get("only"),
    () => null,
  );
  const only = q && Number(q) >= 1 && Number(q) <= TELAS.length ? Number(q) : null;

  useEffect(() => {
    const onFit = () =>
      setFit(Math.min((window.innerWidth - 80) / (SCR_W * TELAS.length + 30 * (TELAS.length - 1)), (window.innerHeight - 40) / SCR_H));
    onFit();
    window.addEventListener("resize", onFit);
    return () => window.removeEventListener("resize", onFit);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(4, (z ?? fit) * 1.25));
      else if (e.key === "-" || e.key === "_") setZoom((z) => Math.max(0.15, (z ?? fit) / 1.25));
      else if (e.key === "0") setZoom(null);
      else if (e.key === "1") setZoom(1);
      else if (e.key === "2") setZoom(2);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fit]);

  // o modo de conferência é cru de propósito: 1:1, sem escala, encostado no canto
  if (only) {
    const Tela = TELAS[only - 1];
    return (
      <main style={{ position: "fixed", inset: 0, background: "#4A4A4A", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0 }}>
          {/* t alto = tudo já montado: é esse estado que o diff compara com a referência */}
          <Clock.Provider value={99}>
            <Tela />
          </Clock.Provider>
        </div>
      </main>
    );
  }

  const s = zoom ?? fit;
  return (
    <main
      style={{ position: "fixed", inset: 0, background: "#4A4A4A", overflow: "auto", display: "grid", placeItems: "center" }}
    >
      <div style={{ width: (SCR_W * TELAS.length + 30 * (TELAS.length - 1)) * s, height: SCR_H * s }}>
        <div style={{ display: "flex", gap: 30, transformOrigin: "0 0", transform: `scale(${s})` }}>
          {TELAS.map((Tela, i) => (
            <Clock.Provider key={i} value={99}>
              <Tela />
            </Clock.Provider>
          ))}
        </div>
      </div>
      <div
        style={{
          position: "fixed",
          right: 14,
          bottom: 14,
          borderRadius: 999,
          padding: "8px 15px",
          fontSize: 12.5,
          background: "rgba(20,20,22,0.92)",
          color: "#E8E8E8",
        }}
      >
        {Math.round(s * 100)}% · + − zoom · 1 = 100% · 2 = 200% · 0 = caber · ?only=1..5 isola
      </div>
    </main>
  );
}
