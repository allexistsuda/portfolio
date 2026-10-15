// Preview + gravação, compartilhado pelas peças do ácaro.
//
// Regra da casa: o conteúdo de cada quadro vem do ÍNDICE do quadro, nunca do relógio —
// é o que garante que o que se vê no preview é exatamente o que a gravação gera.
//
//   ?f=120 / ?t=4   congela num quadro
//   espaço          pausa
//   ←/→             anda quadro a quadro (shift = de 10 em 10)
//
// A gravação roda os quadros em ritmo real (pro container ter a duração certa) e manda
// pra renders/ via /api/save-render, que só existe em dev. Como as peças usam imagem,
// abrir por file:// contamina o canvas e o captureStream morre — tem que ser pelo next dev.

window.mountPlayer = function ({ canvas, hud, recBtn, msg, FPS, TOTAL_FRAMES, drawFrame, name, maxScale = 2.4 }) {
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  const LOOP_S = TOTAL_FRAMES / FPS;

  function fit() {
    const s = Math.min(innerWidth / W, innerHeight / H, maxScale);
    canvas.style.width = W * s + "px";
    canvas.style.height = H * s + "px";
    canvas.style.left = (innerWidth - W * s) / 2 + "px";
    canvas.style.top = (innerHeight - H * s) / 2 + "px";
  }
  fit();
  addEventListener("resize", fit);

  const q = new URLSearchParams(location.search);
  let frame = q.has("f") ? +q.get("f") : q.has("t") ? Math.round(+q.get("t") * FPS) : 0;
  let playing = !(q.has("f") || q.has("t"));
  let anchorFrame = frame, anchorTime = performance.now();
  let recording = false;

  (function tick() {
    if (!recording) {
      if (playing) frame = anchorFrame + Math.round((performance.now() - anchorTime) / 1000 * FPS);
      const f = ((frame % TOTAL_FRAMES) + TOTAL_FRAMES) % TOTAL_FRAMES;
      drawFrame(ctx, f);
      if (hud) hud.textContent = `${f}/${TOTAL_FRAMES}  ${(f / FPS).toFixed(2)}s  ${playing ? "" : "⏸"}  ·  ${LOOP_S}s @ ${FPS}fps · ␣ pausa · ←/→ quadro`;
    }
    requestAnimationFrame(tick);
  })();

  addEventListener("keydown", e => {
    if (e.key === " ") {
      e.preventDefault();
      playing = !playing;
      anchorFrame = frame;
      anchorTime = performance.now();
    }
    if (e.key === "ArrowRight") { playing = false; frame += e.shiftKey ? 10 : 1; }
    if (e.key === "ArrowLeft")  { playing = false; frame -= e.shiftKey ? 10 : 1; }
  });

  if (!recBtn) return;
  recBtn.onclick = async () => {
    if (recording) return;
    recording = true;
    playing = false;
    recBtn.disabled = true;
    const say = t => { if (msg) msg.textContent = t; };
    try {
      const stream = canvas.captureStream(0);
      const track = stream.getVideoTracks()[0];
      const mime = MediaRecorder.isTypeSupported("video/mp4;codecs=avc1.640034")
        ? "video/mp4;codecs=avc1.640034"
        : "video/webm;codecs=vp9";
      const ext = mime.startsWith("video/mp4") ? "mp4" : "webm";
      const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 16e6 });
      const chunks = [];
      rec.ondataavailable = e => e.data.size && chunks.push(e.data);
      const done = new Promise(r => rec.onstop = r);

      rec.start();
      const t0 = performance.now();
      for (let f = 0; f < TOTAL_FRAMES; f++) {
        drawFrame(ctx, f);
        track.requestFrame();
        say(`gravando ${Math.round((f + 1) / TOTAL_FRAMES * 100)}%`);
        const wait = t0 + (f + 1) / FPS * 1000 - performance.now();
        if (wait > 0) await new Promise(r => setTimeout(r, wait));
      }
      rec.stop();
      await done;

      const blob = new Blob(chunks, { type: mime });
      say(`enviando ${(blob.size / 1e6).toFixed(1)} MB…`);
      let saved = false;
      try {
        const res = await fetch(`/api/save-render?name=${name}.${ext}`, { method: "POST", body: blob });
        if (res.ok) {
          const json = await res.json();
          say(`salvo em ${json.path} (${(json.bytes / 1e6).toFixed(1)} MB)`);
          saved = true;
        }
      } catch {}
      if (!saved) {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `${name}.${ext}`;
        a.click();
        say(`baixado (${(blob.size / 1e6).toFixed(1)} MB)`);
      }
    } catch (err) {
      say("erro: " + err.message);
    } finally {
      recording = false;
      recBtn.disabled = false;
      anchorFrame = frame = 0;
      anchorTime = performance.now();
      playing = true;
    }
  };
};
