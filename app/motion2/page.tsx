"use client";

import { useEffect, useRef, useState } from "react";

// Composição final (medida no print de 2000 x 924): vídeo à esquerda, chat à direita.
const COMP_W = 2000;
const COMP_H = 924;
const VIDEO_RECT = { x: 111, y: 111, w: 1247, h: 702 };
const VIDEO_RADIUS = 28;

const ZOOM_AT = 1.7; // segundos de vídeo até começar o zoom out
const ZOOM_SECONDS = 0.6;
const MSG_START = 0.55; // s depois do início do zoom: primeira mensagem
const MSG_STEP = 0.4; // entre mensagens
const PIECE_STEP = 0.1; // thumb -> pessoa -> mensagem
// Campo de texto: foco (borda verde), depois digita letra a letra.
const FOCUS_AT = 0.55; // s depois do início do zoom
const TYPE_AT = 0.7;
// x (px do PNG "typed", 575 de largura) onde termina cada caractere de "Adorando o tema! Parabéns a todos!"
const TYPE_EDGES = [20, 37, 58, 72, 89, 107, 127, 148, 160, 178, 188, 202, 220, 249, 269, 277, 291, 308, 327, 340, 357, 376, 395, 414, 432, 444, 462, 470, 485, 503, 522, 542, 559, 567];
const TYPE_MS = [48, 48, 48, 48, 48, 48, 48, 48, 85, 48, 85, 48, 48, 48, 48, 130, 85, 48, 48, 48, 48, 48, 48, 48, 48, 85, 48, 85, 48, 48, 48, 48, 48, 150];
const TEXT_AREA = 345; // largura útil do campo até o emoji (px da composição)
const SEND_PAUSE = 0.35; // s entre o fim da digitação e o envio
const ZOOM_EASE = "cubic-bezier(0.5, 0, 0.25, 1.1)"; // antes: cubic-bezier(0.65, 0, 0.35, 1) (sem elástico)

// Painel do chat (491 x 702 na composição). Os PNGs foram exportados a 708/491 do tamanho real.
const PANEL = { x: 1392, y: 111, w: 491, h: 702 };
const K = PANEL.w / 708;

// Todas as posições em px da composição, relativas ao painel (left/top = canto da peça).
type Item = { src: string; w: number; h: number; left: number; top: number; at: number };
const GAP = 12;
const ITEMS: Item[] = [
  { src: "title", w: 338, h: 30, left: 33, top: 44 - (30 * K) / 2, at: 0 },
  { src: "chevron", w: 48, h: 48, left: 298 - (48 * K) / 2, top: 45 - (48 * K) / 2, at: 0 },
  { src: "divider", w: 706, h: 2, left: 0.5, top: 87, at: 0 },
  // mensagem 1
  { src: "av1", w: 64, h: 64, left: 32, top: 121, at: 1 },
  { src: "name1", w: 167, h: 27, left: 90, top: 138 - (27 * K) / 2, at: 1 },
  { src: "t1a", w: 303, h: 25, left: 90 + 167 * K + GAP, top: 138 - (25 * K) / 2, at: 1 },
  { src: "t1b", w: 162, h: 32, left: 90, top: 171 - (32 * K) / 2, at: 1 },
  // mensagem 2
  { src: "av2", w: 64, h: 64, left: 32, top: 205, at: 2 },
  { src: "name2", w: 129, h: 26, left: 90, top: 221 - (26 * K) / 2, at: 2 },
  { src: "t2a", w: 359, h: 27, left: 90 + 129 * K + GAP, top: 221 - (27 * K) / 2, at: 2 },
  { src: "t2b", w: 103, h: 27, left: 90, top: 254 - (27 * K) / 2, at: 2 },
  // mensagem 3
  { src: "av3", w: 64, h: 64, left: 32, top: 288, at: 3 },
  { src: "name3", w: 154, h: 26, left: 90, top: 305 - (26 * K) / 2, at: 3 },
  { src: "t3a", w: 352, h: 22, left: 90 + 154 * K + GAP, top: 305 - (22 * K) / 2, at: 3 },
  { src: "t3b", w: 475, h: 27, left: 90, top: 338 - (27 * K) / 2, at: 3 },
];

export default function Motion2() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [zoomed, setZoomed] = useState(false);
  const [typed, setTyped] = useState(0);
  const [focused, setFocused] = useState(false);
  const [sent, setSent] = useState(false);
  const [vp, setVp] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const measure = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    if (!zoomed) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setFocused(true), FOCUS_AT * 1000));
    let at = TYPE_AT * 1000;
    TYPE_EDGES.forEach((_, i) => {
      at += TYPE_MS[i];
      timers.push(setTimeout(() => setTyped(i + 1), at));
    });
    // pausa curta, o campo esvazia na hora e a mensagem entra na lista
    at += SEND_PAUSE * 1000;
    timers.push(setTimeout(() => { setSent(true); setTyped(0); }, at));
    return () => timers.forEach(clearTimeout);
  }, [zoomed]);

  // o texto rola para a esquerda quando passa da área útil do campo, como num input de verdade
  const edge = typed ? TYPE_EDGES[typed - 1] + 1 : 0;
  const shift = Math.max(0, (edge + 3) * K - (TEXT_AREA - 8));

  const onTimeUpdate = () => {
    const v = videoRef.current;
    if (v && !zoomed && v.currentTime >= ZOOM_AT) setZoomed(true);
  };

  // A composição inteira (vídeo + chat já montado) é uma peça só: começa ampliada com o vídeo
  // cobrindo a janela e faz zoom out até caber centralizada.
  const s = vp ? Math.min(vp.w / COMP_W, vp.h / COMP_H) : 1;
  const ox = vp ? (vp.w - COMP_W * s) / 2 : 0;
  const oy = vp ? (vp.h - COMP_H * s) / 2 : 0;
  const t0 = vp ? Math.max(vp.w / VIDEO_RECT.w, vp.h / VIDEO_RECT.h) : 1;
  const start = vp
    ? `translate(${vp.w / 2 - (VIDEO_RECT.x + VIDEO_RECT.w / 2) * t0}px, ${vp.h / 2 - (VIDEO_RECT.y + VIDEO_RECT.h / 2) * t0}px) scale(${t0})`
    : "none";
  const end = `translate(${ox}px, ${oy}px) scale(${s})`;

  return (
    <main style={{ position: "fixed", inset: 0, zIndex: 50, background: "#F6F9F6", overflow: "hidden" }}>
      {vp && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: COMP_W,
            height: COMP_H,
            transformOrigin: "0 0",
            transform: zoomed ? end : start,
            transition: zoomed ? `transform ${ZOOM_SECONDS}s ${ZOOM_EASE}` : "none",
            willChange: "transform",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: VIDEO_RECT.x,
              top: VIDEO_RECT.y,
              width: VIDEO_RECT.w,
              height: VIDEO_RECT.h,
              overflow: "hidden",
              borderRadius: zoomed ? VIDEO_RADIUS : 0,
              transition: zoomed ? `border-radius ${ZOOM_SECONDS}s ${ZOOM_EASE}` : "none",
            }}
          >
            <video
              ref={videoRef}
              src="/motion2/presenter.mp4"
              autoPlay
              muted
              loop
              playsInline
              onTimeUpdate={onTimeUpdate}
              style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div
            aria-hidden
            style={{ position: "absolute", left: PANEL.x, top: PANEL.y, width: PANEL.w, height: PANEL.h }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/motion2/chat/panel.png"
              alt=""
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
            />
            {ITEMS.map((it) => {
              const piece = it.src.startsWith("av") ? 0 : it.src.startsWith("name") ? 1 : 2;
              const delay = MSG_START + (it.at - 1) * MSG_STEP + piece * PIECE_STEP;
              const gated = it.at > 0;
              return (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={it.src}
                  src={`/motion2/chat/${it.src}.png`}
                  alt=""
                  style={{
                    position: "absolute",
                    left: it.left,
                    top: it.top,
                    width: it.w * K,
                    height: it.h * K,
                    opacity: gated && !zoomed ? 0 : 1,
                    transition: gated && zoomed ? `opacity 0.3s ease-out ${delay}s` : "none",
                  }}
                />
              );
            })}
            {/* mensagem enviada (4ª): entra "clara" e assenta */}
            {sent &&
              [
                { src: "m4-av", left: 32, top: 373, w: 46, h: 46, d: 0 },
                { src: "m4-name", left: 87, top: 375, w: 90, h: 28, d: 0.06 },
                { src: "m4-t1", left: 180, top: 375, w: 272, h: 28, d: 0.12 },
                { src: "m4-t2", left: 87, top: 408, w: 86, h: 28, d: 0.12 },
              ].map((m) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={m.src}
                  className="m2-sent"
                  src={`/motion2/chat/${m.src}.png`}
                  alt=""
                  style={{ position: "absolute", left: m.left, top: m.top, width: m.w, height: m.h, animationDelay: `${m.d}s` }}
                />
              ))}
            {/* campo de texto */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/motion2/chat/field-off.png" alt="" style={{ position: "absolute", left: 33, top: 614, width: 612 * K, height: 88 * K }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/motion2/chat/field-on.png"
              alt=""
              style={{
                position: "absolute",
                left: 33,
                top: 614,
                width: 612 * K,
                height: 88 * K,
                opacity: zoomed && !sent ? 1 : 0,
                transition: sent ? "opacity 0.2s ease-out" : zoomed ? `opacity 0.25s ease-out ${FOCUS_AT}s` : "none",
              }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/motion2/chat/emoji.png" alt="" style={{ position: "absolute", left: 424 - (48 * K) / 2, top: 643 - (48 * K) / 2, width: 48 * K, height: 48 * K }} />
            <div
              style={{
                position: "absolute",
                left: 50,
                top: 643 - (29 * K) / 2,
                width: TEXT_AREA,
                height: 29 * K,
                overflow: "hidden",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/motion2/chat/typed.png"
                alt=""
                style={{
                  position: "absolute",
                  left: -shift,
                  top: 0,
                  width: 575 * K,
                  height: 29 * K,
                  maxWidth: "none",
                  clipPath: `inset(0 ${(575 - edge) * K}px 0 0)`,
                  transition: "left 0.08s linear",
                }}
              />
            </div>
            <div
              className="m2-caret"
              style={{
                position: "absolute",
                left: 50 + (typed ? edge + 3 : 0) * K - shift,
                top: 643 - (20 * K) / 2 - 1,
                width: 1.5,
                height: 20,
                background: "#222",
                                visibility: focused ? "visible" : "hidden",
              }}
            />
          </div>
        </div>
      )}
      <style>{`.m2-caret { animation: m2-blink 1s steps(1) infinite; } @keyframes m2-blink { 50% { opacity: 0; } } .m2-sent { opacity: 0; animation: m2-sent 0.6s ease-out forwards; } @keyframes m2-sent { 0% { opacity: 0; } 35% { opacity: 0.5; } 100% { opacity: 1; } }`}</style>
    </main>
  );
}
