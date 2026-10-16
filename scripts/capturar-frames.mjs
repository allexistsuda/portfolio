// Captura o /invest-motion quadro a quadro, em 1920x1080, direto do Chrome via DevTools Protocol.
// Não depende de Playwright nem de ffmpeg: abre o Chrome em modo headless, fixa window.__t no
// segundo desejado e pede um screenshot. Como o conteúdo de cada frame sai do relógio e não do
// tempo real, o resultado é determinístico — o overhead do dev server não distorce a animação.
//
//   node scripts/capturar-frames.mjs [segundos] [fps] [url]
//
// Os PNGs saem em renders/frames/.

import { spawn } from "node:child_process";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const SEGUNDOS = Number(process.argv[2] ?? 15);
const FPS = Number(process.argv[3] ?? 30);
const URL_ALVO = process.argv[4] ?? "http://localhost:3100/invest-motion?render=1";
// o quadro deixou de ser fixo: o logo do /vet-smart sai em 2720x1426, a medida do 02.png
const W = Number(process.argv[5] ?? 1920);
const H = Number(process.argv[6] ?? 1080);
const PORTA = 9333;
const SAIDA = path.join(process.cwd(), "renders", "frames");

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

async function abrirChrome() {
  const perfil = path.join(process.cwd(), "renders", ".chrome-perfil");
  const p = spawn(
    CHROME,
    [
      "--headless=new",
      `--remote-debugging-port=${PORTA}`,
      `--user-data-dir=${perfil}`,
      `--window-size=${W},${H}`,
      "--hide-scrollbars",
      "--force-device-scale-factor=1",
      "--no-first-run",
      "--disable-extensions",
      "about:blank",
    ],
    { stdio: "ignore" },
  );
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORTA}/json/version`);
      if (r.ok) return p;
    } catch {}
    await espera(250);
  }
  throw new Error("Chrome não subiu na porta de depuração");
}

/** cliente mínimo do DevTools Protocol sobre o WebSocket nativo do node */
function conectar(url) {
  const ws = new WebSocket(url);
  let id = 0;
  const pendentes = new Map();
  const prontos = [];
  ws.addEventListener("message", (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pendentes.has(msg.id)) {
      const { resolve, reject } = pendentes.get(msg.id);
      pendentes.delete(msg.id);
      msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
    } else if (msg.method) {
      prontos.push(msg);
    }
  });
  const aberto = new Promise((res) => ws.addEventListener("open", res));
  return {
    aberto,
    enviar(method, params = {}) {
      return new Promise((resolve, reject) => {
        const n = ++id;
        pendentes.set(n, { resolve, reject });
        ws.send(JSON.stringify({ id: n, method, params }));
      });
    },
    eventos: prontos,
    fechar: () => ws.close(),
  };
}

const chrome = await abrirChrome();
try {
  const alvo = await (await fetch(`http://127.0.0.1:${PORTA}/json/new?${encodeURIComponent(URL_ALVO)}`, { method: "PUT" })).json();
  const cdp = conectar(alvo.webSocketDebuggerUrl);
  await cdp.aberto;

  await cdp.enviar("Page.enable");
  await cdp.enviar("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: 1, mobile: false });
  await cdp.enviar("Page.navigate", { url: URL_ALVO });

  // espera a página montar e as fontes carregarem — senão os primeiros frames saem na fonte errada
  for (let i = 0; i < 80; i++) {
    const r = await cdp.enviar("Runtime.evaluate", {
      expression: "document.readyState === 'complete' && document.fonts.status === 'loaded' && !!document.querySelector('main')",
      returnByValue: true,
    });
    if (r.result.value) break;
    await espera(250);
  }
  await espera(600);

  await rm(SAIDA, { recursive: true, force: true });
  await mkdir(SAIDA, { recursive: true });

  const total = Math.round(SEGUNDOS * FPS);
  for (let n = 0; n < total; n++) {
    // meio do intervalo, não a fronteira: pedir exatamente n/FPS cai em cima da divisa entre
    // dois quadros e o decodificador arredonda pra qualquer um dos lados — em página com vídeo
    // isso produzia quadros repetidos num padrão regular, parecendo fonte de taxa menor.
    const t = (n + 0.5) / FPS;
    // __pronto vai a false junto com o relógio: sem isso a página ainda não reagiu quando
    // perguntamos, e o primeiro teste passaria com o valor do quadro anterior
    await cdp.enviar("Runtime.evaluate", { expression: `window.__t = ${t}; if (typeof window.__pronto === "boolean") window.__pronto = false;` });
    // dois rAF: um pro React reagir ao novo relógio, outro pra garantir que já pintou.
    // Páginas que precisam de mais tempo por quadro (um seek de vídeo, por exemplo)
    // declaram window.__pronto e avisam quando terminaram.
    await cdp.enviar("Runtime.evaluate", {
      expression: `(async () => {
        if (typeof window.__pronto === "boolean") {
          const limite = Date.now() + 5000;
          while (!window.__pronto && Date.now() < limite) await new Promise(r => setTimeout(r, 8));
        }
        await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      })()`,
      awaitPromise: true,
    });
    const { data } = await cdp.enviar("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
    await writeFile(path.join(SAIDA, `f${String(n).padStart(5, "0")}.png`), Buffer.from(data, "base64"));
    if (n % 30 === 0 || n === total - 1) process.stdout.write(`\r  ${n + 1}/${total} quadros`);
  }
  console.log(`\n  ${total} quadros em renders/frames/ (${W}x${H}, ${FPS}fps)`);
  cdp.fechar();
} finally {
  chrome.kill();
}
