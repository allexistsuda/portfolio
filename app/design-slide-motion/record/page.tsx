"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Renderiza o slide design-system em vídeo (mp4) ou gif. Desenha os mesmos frames da página num
// canvas 1920x1080 — o conteúdo de cada frame vem do TEMPO pedido, não do relógio, então o
// overhead do dev server não distorce o resultado. Salva em renders/ via /api/save-render.
const W = 1920;
const H = 1080;
const LEFT_W = Math.round(W * 0.51);
const RIGHT_W = W - LEFT_W;
const SEAM_OVERLAP = 2;

const COLOR_HOLD = 2200;
const RISE_DUR = 900;
const CYCLE = COLOR_HOLD + RISE_DUR;

const BLEED = 2;
const X0 = -BLEED;
const X1 = 100 + BLEED;
const clipY = (v: number) => (1 - v) * (100 + BLEED * 2) - BLEED;

const TEXT_SCALE = 0.57;
const TEXT_LEFT = SEAM_OVERLAP + RIGHT_W * 0.071 - 1 * TEXT_SCALE;
const TEXT_TOP = H * 0.313 - 19 * TEXT_SCALE;

const clamp = (n: number) => Math.min(1, Math.max(0, n));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const COLORS = [
  { hex: "#3AAE5B", png: "chateau-green.png", w: 670, h: 530 },
  { hex: "#1C1C1E", png: "aesthetic-black.png", w: 758, h: 530 },
  { hex: "#6B6E6D", png: "antique-silver.png", w: 626, h: 530 },
  { hex: "#F3F4F6", png: "titanium-white.png", w: 710, h: 530 },
  { hex: "#59D07B", png: "esmerald.png", w: 762, h: 334 },
];

const DURATION = COLORS.length * CYCLE; // volta completa, fecha em loop
const FPS = 60;
const TOTAL_FRAMES = (DURATION * FPS) / 1000;

// GIF: largura menor e menos fps na subida; a pausa vira UM frame com delay longo
const GIF_W = 1920;
const GIF_H = (GIF_W * H) / W;
const GIF_FPS = 20;

const PANEL_W = RIGHT_W + SEAM_OVERLAP;
const PANEL_X = W - PANEL_W;

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`falhou: ${src}`));
    img.src = src;
  });
}

export default function RecordDesignSlide() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState("pronto");
  const [progress, setProgress] = useState(0);
  const busy = useRef(false);

  // Carrega as imagens e devolve a função que desenha o frame de um instante t (ms).
  const prepare = useCallback(async () => {
    const typography = await loadImage("/design-slide-motion/typography.png");
    const texts = await Promise.all(COLORS.map((c) => loadImage(`/design-slide-motion/${c.png}`)));
    const canvas = canvasRef.current;
    if (!canvas) throw new Error("canvas ausente");
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) throw new Error("contexto 2d ausente");
    const typoH = (LEFT_W * typography.naturalHeight) / typography.naturalWidth;

    const drawAt = (t: number) => {
      const index = Math.floor(t / CYCLE) % COLORS.length;
      const nextIndex = (index + 1) % COLORS.length;
      const tc = t % CYCLE;
      const p = tc < COLOR_HOLD ? 0 : (tc - COLOR_HOLD) / RISE_DUR;

      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, W, H);
      ctx.drawImage(typography, 0, 0, LEFT_W, typoH);

      const cur = COLORS[index];
      ctx.fillStyle = cur.hex;
      ctx.fillRect(PANEL_X, 0, PANEL_W, H);
      ctx.drawImage(texts[index], PANEL_X + TEXT_LEFT, TEXT_TOP, cur.w * TEXT_SCALE, cur.h * TEXT_SCALE);

      if (p > 0) {
        // próxima cor subindo: direita primeiro e mais rápido, esquerda atrás equalizando
        const right = easeOut(clamp(p * 1.25));
        const left = easeInOut(clamp((p - 0.12) / 0.88));
        const px = (pct: number) => PANEL_X + (pct / 100) * PANEL_W;
        const py = (v: number) => (clipY(v) / 100) * H;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(px(X0), py(left));
        ctx.lineTo(px(X1), py(right));
        ctx.lineTo(px(X1), py(0));
        ctx.lineTo(px(X0), py(0));
        ctx.closePath();
        ctx.clip();

        const nxt = COLORS[nextIndex];
        ctx.fillStyle = nxt.hex;
        ctx.fillRect(PANEL_X, 0, PANEL_W, H);
        ctx.drawImage(texts[nextIndex], PANEL_X + TEXT_LEFT, TEXT_TOP, nxt.w * TEXT_SCALE, nxt.h * TEXT_SCALE);
        ctx.restore();
      }
    };

    return { canvas, drawAt };
  }, []);

  const save = useCallback(async (blob: Blob, ext: string) => {
    setStatus(`enviando ${(blob.size / 1_000_000).toFixed(1)} MB…`);
    const res = await fetch(`/api/save-render?name=design-slide-motion.${ext}`, { method: "POST", body: blob });
    const json = await res.json();
    setStatus(res.ok ? `salvo em ${json.path} (${(json.bytes / 1_000_000).toFixed(1)} MB)` : `erro: ${json.error}`);
  }, []);

  const recordVideo = useCallback(async () => {
    if (busy.current) return;
    busy.current = true;
    try {
      setStatus("carregando imagens…");
      const { canvas, drawAt } = await prepare();

      // mp4/H.264 primeiro (é o que edita em qualquer lugar); webm só como reserva
      const mime = [
        "video/mp4;codecs=avc1.640028",
        "video/mp4;codecs=avc1",
        "video/mp4",
        "video/webm;codecs=vp9",
        "video/webm",
      ].find((m) => MediaRecorder.isTypeSupported(m));
      if (!mime) {
        setStatus("este navegador não suporta MediaRecorder");
        return;
      }
      const ext = mime.startsWith("video/mp4") ? "mp4" : "webm";

      const stream = canvas.captureStream(0);
      const track = stream.getVideoTracks()[0] as CanvasCaptureMediaStreamTrack;
      const chunks: Blob[] = [];
      const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 24_000_000 });
      rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
      const done = new Promise<void>((r) => (rec.onstop = () => r()));

      setStatus("gravando vídeo…");
      rec.start();

      // ritmo em tempo real (pra o container ter a duração certa), conteúdo vindo do índice do frame
      const t0 = performance.now();
      for (let f = 0; f < TOTAL_FRAMES; f++) {
        drawAt((f / FPS) * 1000);
        track.requestFrame();
        setProgress(Math.round(((f + 1) / TOTAL_FRAMES) * 100));
        const target = t0 + ((f + 1) / FPS) * 1000;
        const wait = target - performance.now();
        if (wait > 0) await new Promise((r) => setTimeout(r, wait));
      }

      rec.stop();
      await done;
      await save(new Blob(chunks, { type: mime }), ext);
    } catch (err) {
      setStatus(`erro: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      busy.current = false;
      setProgress(0);
    }
  }, [prepare, save]);

  const recordGif = useCallback(async () => {
    if (busy.current) return;
    busy.current = true;
    try {
      setStatus("carregando gifenc…");
      const url = "https://unpkg.com/gifenc@1.0.3/dist/gifenc.esm.js";
      const { GIFEncoder, quantize, applyPalette } = await import(
        /* webpackIgnore: true */ /* turbopackIgnore: true */ url
      );

      setStatus("carregando imagens…");
      const { canvas, drawAt } = await prepare();

      // canvas menor só pro gif
      const small = document.createElement("canvas");
      small.width = GIF_W;
      small.height = GIF_H;
      const sctx = small.getContext("2d", { alpha: false, willReadFrequently: true });
      if (!sctx) throw new Error("contexto 2d ausente");

      // lista de frames: pausa = 1 frame com delay longo; subida = fps cheio
      const plan: { t: number; delay: number }[] = [];
      for (let i = 0; i < COLORS.length; i++) {
        const base = i * CYCLE;
        plan.push({ t: base, delay: COLOR_HOLD });
        const riseFrames = Math.round((RISE_DUR / 1000) * GIF_FPS);
        for (let f = 0; f < riseFrames; f++) {
          plan.push({ t: base + COLOR_HOLD + (f / riseFrames) * RISE_DUR, delay: Math.round(RISE_DUR / riseFrames) });
        }
      }

      setStatus("desenhando frames…");
      const frames: Uint8ClampedArray[] = [];
      for (let i = 0; i < plan.length; i++) {
        drawAt(plan[i].t);
        sctx.drawImage(canvas, 0, 0, GIF_W, GIF_H);
        frames.push(sctx.getImageData(0, 0, GIF_W, GIF_H).data);
        setProgress(Math.round(((i + 1) / plan.length) * 60));
        if (i % 10 === 0) await new Promise((r) => setTimeout(r, 0));
      }

      // paleta única pro gif inteiro (evita piscar de cor entre frames)
      setStatus("montando paleta…");
      const step = Math.max(1, Math.floor(frames.length / 12));
      const sampled = frames.filter((_, i) => i % step === 0);
      const merged = new Uint8ClampedArray(sampled.reduce((n, f) => n + f.length, 0));
      let off = 0;
      for (const f of sampled) {
        merged.set(f, off);
        off += f.length;
      }
      // rgb565: rgb444 é grosseiro demais e achata #F3F4F6 em branco puro, fazendo a divisão
      // entre as duas metades sumir no slide Titanium White
      const palette = quantize(merged, 256, { format: "rgb565" });

      setStatus("codificando gif…");
      const gif = GIFEncoder();
      for (let i = 0; i < frames.length; i++) {
        const index = applyPalette(frames[i], palette, "rgb565");
        gif.writeFrame(index, GIF_W, GIF_H, { palette, delay: plan[i].delay });
        setProgress(60 + Math.round(((i + 1) / frames.length) * 40));
        if (i % 10 === 0) await new Promise((r) => setTimeout(r, 0));
      }
      gif.finish();

      await save(new Blob([gif.bytes()], { type: "image/gif" }), "gif");
    } catch (err) {
      setStatus(`erro: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      busy.current = false;
      setProgress(0);
    }
  }, [prepare, save]);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (q.has("auto")) recordVideo();
    if (q.has("gif")) recordGif();
  }, [recordVideo, recordGif]);

  const btn = {
    border: 0,
    borderRadius: 999,
    padding: "10px 18px",
    fontSize: 14,
    fontWeight: 500,
    background: "#F6F6F5",
    color: "#111",
    cursor: "pointer",
  } as const;

  return (
    <main style={{ minHeight: "100vh", background: "#111", color: "#F6F6F5", padding: 24, fontFamily: "system-ui" }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
        <button onClick={recordVideo} style={btn}>
          Gravar mp4 {(DURATION / 1000).toFixed(1)}s @ {FPS}fps
        </button>
        <button onClick={recordGif} style={btn}>
          Gerar gif {GIF_W}px @ {GIF_FPS}fps
        </button>
        <span style={{ fontSize: 14, opacity: 0.8 }}>
          {status} {progress > 0 && progress < 100 ? `(${progress}%)` : ""}
        </span>
      </div>
      <canvas ref={canvasRef} width={W} height={H} style={{ width: "100%", maxWidth: 960, display: "block" }} />
    </main>
  );
}
