"use client";

import { useEffect, useRef } from "react";
import { santanderHeadline } from "./fonts";

/**
 * Os 8 pilares do Flame em cards (frame "Flame — Cards de token (v2)" no Figma).
 *
 * Os cards são HTML — título e subtítulo são texto de verdade e seguem o idioma —
 * e cada ilustração é um SVG gerado a cada quadro com as coordenadas do Figma. O SVG cobre
 * o card da borda de fora até 80px antes da base (onde começa o texto) e o viewBox põe o
 * card do Figma centrado na horizontal, em 1:1. Assim a ilustração fica no mesmo lugar
 * relativo em qualquer largura, do desktop (4 colunas) ao celular (1).
 *
 * SVG e não canvas: o canvas vira imagem, e o Chrome com GPU põe essa imagem numa camada
 * em meio pixel e a reescala — o traço de cima do botão saía mais fino que o de baixo.
 * Com SVG o navegador desenha o vetor direto na resolução da tela.
 *
 * As animações fecham em ciclos de 8s (16s no Colors), só rodam com a grade na tela, e com
 * prefers-reduced-motion cada card fica num quadro parado. A mesma peça existe solta em
 * public/flame-cards-motion.html, pra gravar.
 */

type Lang = "pt" | "en";

const INK = "#17181B", RED = "#CC0000", SKY = "#DEEDF2", APAGADO = "#EFEFEF";
const CICLO = 8;
const FONTE = santanderHeadline.style.fontFamily.replace(/"/g, "'");

/* ------------------------------------------------------------------ util */

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (x: number) => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const rgb = (h: string) => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const mix = (a: string, b: string, p: number) => {
  const A = rgb(a), B = rgb(b);
  return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], p))).join(",")})`;
};
const n = (v: number) => Math.round(v * 100) / 100;

// uma lista de estados, cada um `dur` segundos; a troca leva `tr` segundos, no início do estado
function passo(t: number, total: number, dur: number, tr: number) {
  const k = Math.floor(t / dur);
  return { atual: k % total, anterior: (k - 1 + total) % total, p: ease((t - k * dur) / tr) };
}
// quanto um item está ativo durante a troca anterior -> atual
const ativo = <T,>(item: T, de: T, para: T, p: number) => lerp(item === de ? 1 : 0, item === para ? 1 : 0, p);

// retângulo arredondado como path; r pode ser um raio só ou [cima-esq, cima-dir, baixo-dir, baixo-esq]
function retangulo(x: number, y: number, w: number, h: number, r: number | number[]) {
  const [a, b, c, d] = (Array.isArray(r) ? r : [r, r, r, r]).map(v => Math.max(0, Math.min(v, w / 2, h / 2)));
  return `M${n(x + a)} ${n(y)}H${n(x + w - b)}A${n(b)} ${n(b)} 0 0 1 ${n(x + w)} ${n(y + b)}V${n(y + h - c)}A${n(c)} ${n(c)} 0 0 1 ${n(x + w - c)} ${n(y + h)}H${n(x + d)}A${n(d)} ${n(d)} 0 0 1 ${n(x)} ${n(y + h - d)}V${n(y + a)}A${n(a)} ${n(a)} 0 0 1 ${n(x + a)} ${n(y)}Z`;
}

type Caixa = { x: number; y: number; w: number; h: number; r?: number | number[]; fill?: string; stroke?: string; sw?: number; strokeAlpha?: number };
// retângulo com traço por dentro (strokeAlign INSIDE do Figma): o traço anda meia espessura pra dentro
function caixa({ x, y, w, h, r = 0, fill, stroke, sw = 1, strokeAlpha = 1 }: Caixa) {
  let s = fill ? `<path d="${retangulo(x, y, w, h, r)}" fill="${fill}"/>` : "";
  if (stroke && strokeAlpha > 0) {
    const i = sw / 2, rr = Array.isArray(r) ? r.map(v => v - i) : r - i;
    s += `<path d="${retangulo(x + i, y + i, w - sw, h - sw, rr)}" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-opacity="${n(strokeAlpha)}"/>`;
  }
  return s;
}
function disco(cx: number, cy: number, r: number, fill: string | null, stroke?: string | null, alpha = 1) {
  let s = "";
  if (fill) s += `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}" fill="${fill}"/>`;
  if (stroke) s += `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r - .5)}" fill="none" stroke="${stroke}" stroke-width="1"/>`;
  return alpha < 1 ? `<g opacity="${n(alpha)}">${s}</g>` : s;
}
// caixa delimitadora de um path com M/L/C/Z (amostra as curvas)
function bbox(d: string) {
  const tk = d.match(/[MLCZ]|-?\d+(?:\.\d+)?/g) ?? [], xs: number[] = [], ys: number[] = [];
  let i = 0, cmd = "M", cur = [0, 0], ini = [0, 0];
  while (i < tk.length) {
    const a = tk[i];
    if (/[MLCZ]/.test(a)) { cmd = a; i++; if (cmd === "Z") cur = ini; continue; }
    if (cmd === "M" || cmd === "L") {
      cur = [+tk[i], +tk[i + 1]]; i += 2; xs.push(cur[0]); ys.push(cur[1]);
      if (cmd === "M") { ini = cur; cmd = "L"; }
    } else if (cmd === "C") {
      const p = tk.slice(i, i + 6).map(Number); i += 6;
      for (let s = 0; s <= 20; s++) {
        const t = s / 20, u = 1 - t;
        xs.push(u * u * u * cur[0] + 3 * u * u * t * p[0] + 3 * u * t * t * p[2] + t * t * t * p[4]);
        ys.push(u * u * u * cur[1] + 3 * u * u * t * p[1] + 3 * u * t * t * p[3] + t * t * t * p[5]);
      }
      cur = [p[4], p[5]];
    }
  }
  return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
}
// polígono com os cantos arredondados (como o cornerRadius de vetor do Figma)
function poligono(P: number[][], r: number) {
  const unid = (a: number[], b: number[]) => { const dx = a[0] - b[0], dy = a[1] - b[1], l = Math.hypot(dx, dy); return [dx / l, dy / l]; };
  return P.map((b, i) => {
    const a = P[(i - 1 + P.length) % P.length], c = P[(i + 1) % P.length];
    const ua = unid(a, b), uc = unid(c, b);
    const p1 = [b[0] + ua[0] * r, b[1] + ua[1] * r], p2 = [b[0] + uc[0] * r, b[1] + uc[1] * r];
    return `${i ? "L" : "M"}${n(p1[0])} ${n(p1[1])}Q${n(b[0])} ${n(b[1])} ${n(p2[0])} ${n(p2[1])}`;
  }).join("") + "Z";
}

/* 01 · Components — o cursor entra, clica e sai */

function components(t: number, compacto = false) {
  const PARADO = [720, 432], FORA = [790, 492];
  const anda = (a: number[], b: number[], p: number) => [lerp(a[0], b[0], p), lerp(a[1], b[1], p)];
  let pos = FORA;
  if (t >= 1.2 && t < 2.2) pos = anda(FORA, PARADO, ease((t - 1.2) / 1));
  else if (t >= 2.2 && t < 5.6) pos = PARADO;
  else if (t >= 5.6 && t < 6.6) pos = anda(PARADO, FORA, ease((t - 5.6) / 1));
  let aperto = 0;
  if (t >= 2.4 && t < 2.55) aperto = ease((t - 2.4) / .15);
  else if (t >= 2.55 && t < 2.85) aperto = 1 - ease((t - 2.55) / .3);
  const empurra = t >= 2.55 && t < 3.25 ? 6 * Math.sin(Math.PI * (t - 2.55) / .7) : 0;
  // no card compacto (celular) a posição de fora fica abaixo da área da ilustração e o
  // cursor sairia cortado: lá ele aparece e some com fade enquanto entra e sai
  let visivel = 1;
  if (compacto) {
    if (t < 1.2 || t >= 6.6) visivel = 0;
    else if (t < 2.2) visivel = ease((t - 1.2) / 1);
    else if (t >= 5.6) visivel = 1 - ease((t - 5.6) / 1);
  }

  const cx = 492 + 132, cy = 368 + 44, s = 1 - .03 * aperto;
  const botao = caixa({ x: 492, y: 368, w: 264, h: 88, r: 12, fill: mix(RED, "#A50000", aperto), stroke: INK, sw: 2 })
    + caixa({ x: 524, y: 410, w: 144, h: 4, r: 2, fill: "#FFFFFF" })
    + `<path d="M0 12H24M12 0L24 12L12 24" transform="translate(${n(692 + empurra)} 400)" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
  // ponteiro sem rabicho, com os cantos arredondados
  const ponteiro = poligono([[0, 0], [0, 48], [14.555, 31.897], [35.303, 32.516]], 2);
  return (aperto ? `<g transform="translate(${cx} ${cy}) scale(${n(s)}) translate(${-cx} ${-cy})">${botao}</g>` : botao)
    + (visivel > 0 ? `<path d="${ponteiro}" transform="translate(${n(pos[0])} ${n(pos[1])}) scale(${n(1 - .12 * aperto)})" fill="#FFFFFF" stroke="#000000" stroke-width="2" stroke-linejoin="round"${visivel < 1 ? ` opacity="${n(visivel)}"` : ""}/>` : "");
}

/* 02 · Colors — um anel de seleção passa por todas as bolhas, fileira por fileira */

const PALETAS = [
  ["#FCBABC", "#EC0000", "#A50000"], ["#E0E0E0", "#9A9A9A", "#626262"], ["#98DEE2", "#1EBCC5", "#13898F"],
  ["#EDDCE4", "#BC6A93", "#A93C71"], ["#6790FF", "#3B71FF", "#4364A4"],
];
// anda pela fileira até o fim, desce e volta na de baixo
const ROTA: number[][] = [];
for (let l = 0; l < 3; l++) for (let c = 0; c < 5; c++) ROTA.push([l % 2 ? 4 - c : c, l]);
function colors(t: number) {
  let s = "";
  PALETAS.forEach((p, c) => p.forEach((cor, l) => { s += disco(1080 + c * 24, 246 + l * 24, 8, cor); }));
  // 15 paradas de 1s (ciclo de 16s); o último segundo é a volta da última bolha até a primeira
  const centro = ([c, l]: number[]) => [1080 + c * 24, 246 + l * 24];
  let de: number[], para: number[], p: number;
  if (t < 15) { const k = Math.floor(t); de = ROTA[Math.max(0, k - 1)]; para = ROTA[k]; p = k ? ease((t - k) / .4) : 1; }
  else { de = ROTA[14]; para = ROTA[0]; p = ease((t - 15) / .8); }
  const x = lerp(centro(de)[0], centro(para)[0], p), y = lerp(centro(de)[1], centro(para)[1], p);
  return s + `<circle cx="${n(x)}" cy="${n(y)}" r="12" fill="none" stroke="${INK}" stroke-width="1"/>`;
}

/* 03 · Typography — o knob desliza e o "Aa" engrossa junto, sem degraus
   A Headline não é variável (só Light, Regular e Bold), então o peso contínuo vem do Light
   com contorno: a haste em 34px mede 1,6 no Light, 2,9 no Regular e 4,25 no Bold, e 2,6
   de contorno leva o Light até o Bold passando pelo Regular no meio. */

const CONTORNO_ATE_BOLD = 2.63;
function typography(t: number) {
  // ida e volta suave pelo trilho, uma vez por ciclo; u = 0 é Light, u = 1 é Bold
  const u = .5 - .5 * Math.cos(2 * Math.PI * t / CICLO);
  // a linha de base medida da fonte é 277,7; em 278 a guia tracejada cai inteira no pixel
  return `<path d="M1408 254H1520M1408 278H1520" fill="none" stroke="#CCCCCC" stroke-width="1" stroke-dasharray="2 2"/>`
    + `<path d="M1424 310H1504" fill="none" stroke="#CCCCCC" stroke-width="1"/>`
    + caixa({ x: 1503.5, y: 306, w: 1, h: 8, fill: "#CCCCCC" })
    + `<text x="1464.5" y="278" text-anchor="middle" fill="${INK}" stroke="${INK}" stroke-width="${n(u * CONTORNO_ATE_BOLD)}" stroke-linejoin="round" style="font-family:${FONTE};font-weight:300;font-size:34px">Aa</text>`
    + disco(1424 + 80 * u, 310, 4, "#EC0000", "#555555");
}

/* 04 · Icons — o tile ativo gira pela grade (ícones retraçados do print Santander) */

const ICONES: Record<string, string[]> = {
  casa: ["M 13.7 42 L 29 18 C 31.75 13.7 41.75 13.7 44.5 18 L 59.8 42", "M 21.3 30 L 21.3 55.4 C 21.3 57.2 22.8 58.7 24.6 58.7 L 48.9 58.7 C 50.7 58.7 52.2 57.2 52.2 55.4 L 52.2 30", "M 31.15 58.7 L 31.15 40.3 L 42.35 40.3 L 42.35 58.7"],
  cadeado: ["M 24.7 36.7 L 48.7 36.7 C 52 36.7 54.7 39.4 54.7 42.7 L 54.7 51.5 C 54.7 54.8 52 57.5 48.7 57.5 L 24.7 57.5 C 21.4 57.5 18.7 54.8 18.7 51.5 L 18.7 42.7 C 18.7 39.4 21.4 36.7 24.7 36.7 Z", "M 23.7 36.7 L 23.7 25 C 23.7 17.8 29.5 12 36.7 12 C 43.9 12 49.7 17.8 49.7 25 L 49.7 36.7", "M 28.7 36.7 L 28.7 25 C 28.7 20.6 32.3 17 36.7 17 C 41.1 17 44.7 20.6 44.7 25 L 44.7 36.7", "M 36.7 43.7 L 36.7 50.8"],
  coracao: ["M 36.5 55 C 28 48 16 40 16 29 C 16 22.5 20.5 18 26 18 C 31 18 34.5 21 36.5 25.5 C 38.5 21 42 18 47 18 C 52.5 18 57 22.5 57 29 C 57 40 45 48 36.5 55 Z", "M 36.5 25.5 L 36.5 29"],
  lupa: ["M 44.7 28.3 C 44.7 36.86 37.76 43.8 29.2 43.8 C 20.64 43.8 13.7 36.86 13.7 28.3 C 13.7 19.74 20.64 12.8 29.2 12.8 C 37.76 12.8 44.7 19.74 44.7 28.3 Z", "M 42.25 37.25 L 57.25 52.25 C 58.38 53.38 58.38 55.22 57.25 56.35 C 56.12 57.48 54.28 57.48 53.15 56.35 L 38.15 41.35"],
};
const CENTRO_ICONE = Object.fromEntries(Object.entries(ICONES).map(([k, ds]) => {
  const b = bbox(ds.join(" "));
  return [k, [(b[0] + b[2]) / 2, (b[1] + b[3]) / 2]];
}));
const TILES: Record<string, number[]> = { casa: [1094, 468], cadeado: [1130, 468], coracao: [1094, 504], lupa: [1130, 504] };
function icons(t: number) {
  const SEQ = ["cadeado", "lupa", "coracao", "casa"];
  const q = passo(t, 4, 2, .3);
  return Object.entries(TILES).map(([nome, [x, y]]) => {
    const a = ativo(nome, SEQ[q.anterior], SEQ[q.atual], q.p), [cx, cy] = CENTRO_ICONE[nome], k = 1 / 3;
    // ícones na escala 1/3 (caixa ~48 do print -> 16), traço 3 na escala dele = 1px na tela
    return caixa({ x, y, w: 32, h: 32, r: 6, fill: mix(APAGADO, RED, a), stroke: INK, strokeAlpha: a })
      + `<g transform="translate(${n(x + 16 - cx * k)} ${n(y + 16 - cy * k)}) scale(${k})" fill="none" stroke="${mix("#999999", "#FFFFFF", a)}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">`
      + ICONES[nome].map(d => `<path d="${d}"/>`).join("") + `</g>`;
  }).join("");
}

/* 05 · Motion — a lente anda em volta do logo, que só aparece por dentro dela */

const CHAMA = "M13.5775 -0.000214845C13.7039 0.617285 13.9251 1.22395 14.2411 1.78729L18.4333 9.19728C18.9073 10.0423 19.1707 10.9631 19.2023 11.9056C23.7 13.0973 26.7968 15.6431 26.7968 18.5898C26.7968 22.6848 20.7928 25.9998 13.3984 25.9998C6.004 25.9998 0 22.6848 0 18.5898C0 15.6431 3.0968 13.1081 7.59453 11.9056C7.5524 13.0106 7.8052 14.1373 8.36347 15.1231L12.5557 22.5331C12.8717 23.0965 13.0929 23.7031 13.2193 24.3206L13.3984 24.0065C14.4412 22.1756 14.4412 19.9115 13.3984 18.0806L10.0277 12.1331C8.99547 10.3023 9.006 8.04895 10.0277 6.21812L10.2068 5.90395C10.3332 6.52145 10.5544 7.12812 10.8704 7.69145L15.9053 16.5856C16.2213 17.149 16.4425 17.7556 16.5689 18.3731L16.748 18.059C17.7908 16.2281 17.7908 13.964 16.748 12.1331L13.3879 6.20729C12.3451 4.37645 12.3451 2.11229 13.3879 0.281452L13.5669 -0.0327148L13.5775 -0.000214845Z";
function motion(t: number) {
  const S = .9 * 40 / 26, F = [1453.75, 506.75];       // chama parada, centro da chama
  // raio de 16 em volta do centro da chama, duas voltas por ciclo
  const a = Math.atan2(-8.75, 6.25) + 2 * Math.PI * 2 * t / CICLO;
  const C = [F[0] + 16 * Math.cos(a), F[1] + 16 * Math.sin(a)], R = 20;

  // cabo: cápsula de 16 x 6 a 45 graus, saindo do aro
  const u = Math.SQRT1_2, h = 3, nn = [u, -u], ax = [u, u], k = .5523 * h;
  const add = (p: number[], v: number[], s: number) => [p[0] + v[0] * s, p[1] + v[1] * s];
  const P0 = [C[0] + R * u, C[1] + R * u], P1 = add(P0, ax, 16);
  const A1 = add(P0, nn, h), A2 = add(P0, nn, -h), B1 = add(P1, nn, h), B2 = add(P1, nn, -h), T = add(P1, ax, h);
  const pt = (p: number[]) => `${n(p[0])} ${n(p[1])}`;
  const cabo = `M${pt(A1)}L${pt(B1)}C${pt(add(B1, ax, k))} ${pt(add(T, nn, k))} ${pt(T)}C${pt(add(T, nn, -k))} ${pt(add(B2, ax, k))} ${pt(B2)}L${pt(A2)}Z`;
  return `<path d="${cabo}" fill="#FFFFFF" stroke="${INK}" stroke-width="1" stroke-linejoin="round"/>`
    + `<defs><clipPath id="flame-lente"><circle cx="${n(C[0])}" cy="${n(C[1])}" r="${R}"/></clipPath></defs>`
    + `<g clip-path="url(#flame-lente)"><circle cx="${n(C[0])}" cy="${n(C[1])}" r="${R}" fill="${SKY}"/>`
    + `<path d="${CHAMA}" transform="translate(1435.2 ${n(488.73 + .0327148 * S)}) scale(${n(S)})" fill="#EC0000" fill-rule="evenodd"/></g>`
    + `<circle cx="${n(C[0])}" cy="${n(C[1])}" r="${R}" fill="none" stroke="${INK}" stroke-width="1"/>`;
}

/* 06 · Grids & templates — as colunas ficam, os blocos trocam de arranjo */

type Bloco = [number, number, number, number];   // coluna, colunas, y, altura
const TEMPLATES: Record<string, Bloco>[] = [
  { destaque: [0, 3, 0, 16], bloco: [0, 2, 24, 16], lateral: [3, 1, 0, 40] },
  { destaque: [0, 4, 0, 16], bloco: [0, 2, 24, 16], lateral: [2, 2, 24, 16] },
  { destaque: [2, 2, 0, 40], bloco: [0, 2, 0, 16], lateral: [0, 2, 24, 16] },
];
const emPx = ([c, cols, y, h]: Bloco) => [408 + c * 26, 710 + y, cols * 18 + (cols - 1) * 8, h];
function grids(t: number) {
  let s = caixa({ x: 400, y: 702, w: 112, h: 64, r: 4, fill: "#FFFFFF", stroke: INK });
  for (let c = 0; c < 4; c++) s += caixa({ x: 408 + c * 26, y: 710, w: 18, h: 48, r: 1, fill: SKY });
  const q = passo(t, 3, CICLO / 3, .6);
  for (const nome of ["lateral", "bloco", "destaque"]) {
    const a = emPx(TEMPLATES[q.anterior][nome]), b = emPx(TEMPLATES[q.atual][nome]);
    const [x, y, w, h] = a.map((v, i) => lerp(v, b[i], q.p));
    s += caixa({ x, y, w, h, r: 2, fill: nome === "destaque" ? RED : "#FFFFFF", stroke: INK });
  }
  return s;
}

/* 07 · Accessibility — o vermelho percorre as 8 dimensões, começando em technology */

function accessibility(t: number) {
  const cx = 792, cy = 734, R = 32, r = 26, VAO = 2 / 29;
  const q = passo(t, 8, 1, .25);
  const de = (7 + q.anterior) % 8, para = (7 + q.atual) % 8;
  const em = (raio: number, ang: number) => `${n(cx + raio * Math.cos(ang))} ${n(cy + raio * Math.sin(ang))}`;
  let s = "";
  for (let k = 0; k < 8; k++) {
    const a0 = -Math.PI / 2 + k * Math.PI / 4 + VAO / 2, a1 = a0 + Math.PI / 4 - VAO;
    s += `<path d="M${em(R, a0)}A${R} ${R} 0 0 1 ${em(R, a1)}L${em(r, a1)}A${r} ${r} 0 0 0 ${em(r, a0)}Z" fill="${mix(APAGADO, RED, ativo(k, de, para, q.p))}"/>`;
  }
  return s;
}

/* 08 · Illustrations — o montador troca cabelo e calça, e a figura veste a escolha */

const FRANJA = "M -1 0.05 C -1 -1.35 1 -1.35 1 -0.1 C 0.55 -0.55 0 -0.62 -0.55 -0.42 L -1 0.05 Z";
const LONGO = "M -1.12 -0.1 C -1.12 -1.48 1.12 -1.48 1.12 -0.1 L 1.12 1.35 L 0.62 1.35 L 0.62 0.25 L -0.62 0.25 L -0.62 1.35 L -1.12 1.35 Z";
const forma = (d: string, cx: number, cy: number, r: number, cor: string, alpha = 1) =>
  alpha <= 0 ? "" : `<path d="${d}" transform="translate(${n(cx)} ${n(cy)}) scale(${n(r)})" fill="${cor}"${alpha < 1 ? ` opacity="${n(alpha)}"` : ""}/>`;
// cabeça de avatar: cabelo comprido atrás, cabeça branca, franja, coque
const cabeca = (cx: number, cy: number, r: number, longo: number, coque: number, traco: string, cabelo: string) =>
  forma(LONGO, cx, cy, r, cabelo, longo) + disco(cx, cy, r, "#FFFFFF", traco) + forma(FRANJA, cx, cy, r, cabelo)
  + (coque > 0 ? disco(cx, cy - 1.3 * r, .4 * r, cabelo, null, coque) : "");
const ESTADOS = [["coque", SKY], ["longo", SKY], ["longo", "#FFFFFF"], ["curto", "#9A9A9A"]];
function illustrations(t: number) {
  const q = passo(t, 4, 2, .3), de = ESTADOS[q.anterior], para = ESTADOS[q.atual];
  const tem = (e: string[], c: string) => e[0] === c ? 1 : 0;
  const calca = mix(de[1], para[1], q.p);
  let s = caixa({ x: 1219, y: 746, w: 8, h: 28, r: 4, fill: calca, stroke: INK })
    + caixa({ x: 1229, y: 746, w: 8, h: 28, r: 4, fill: calca, stroke: INK })
    + caixa({ x: 1216, y: 722, w: 24, h: 28, r: [10, 10, 3, 3], fill: RED, stroke: INK })
    + cabeca(1228, 711, 8, lerp(tem(de, "longo"), tem(para, "longo"), q.p), lerp(tem(de, "coque"), tem(para, "coque"), q.p), INK, INK);
  ["curto", "coque", "longo"].forEach((cab, c) => {
    const a = ativo(cab, de[0], para[0], q.p), x = 1272 + c * 36, cor = mix("#999999", INK, a);
    s += caixa({ x, y: 700, w: 32, h: 32, r: 6, fill: mix(APAGADO, RED, a), stroke: INK, strokeAlpha: a })
      + cabeca(x + 16, 718, 6, cab === "longo" ? 1 : 0, cab === "coque" ? 1 : 0, cor, cor);
  });
  ["#FFFFFF", "#9A9A9A", SKY].forEach((cor, c) => {
    const a = ativo(cor, de[1], para[1], q.p), x = 1272 + c * 36;
    s += caixa({ x, y: 736, w: 32, h: 32, r: 6, fill: mix(APAGADO, RED, a), stroke: INK, strokeAlpha: a })
      + disco(x + 16, 752, 6, cor, INK);
  });
  return s;
}

/* ------------------------------------------------------------------ cards */

type Card = {
  n: string; x: number; y: number; w: number; h: number; classe: string;
  t: Record<Lang, string>; s: Record<Lang, string>;
  desenha: (t: number, compacto?: boolean) => string;
  parado: number;   // quadro de quem prefere menos movimento, em segundos
  ciclo?: number;   // duração do loop do card; 8s se não disser
  // no celular todo card tem 216 de altura; quem é maior que isso no Figma diz aqui o
  // pedaço que forma a ilustração e a escala pra caber na área de 92 acima do texto
  compacto?: { x: number; y: number; w: number; h: number; escala: number };
};

// x/y/w/h: o card no Figma; classe: o encaixe na grade (4, 2 ou 1 coluna)
const CARDS: Card[] = [
  { n: "01", x: 296, y: 200, w: 656, h: 448, classe: "md:col-span-2 md:row-span-2", desenha: components, parado: 3.5,
    // botão + cursor; em 50% o botão fica com 132 de largura, na faixa das outras ilustrações (64–112)
    compacto: { x: 492, y: 368, w: 264, h: 112, escala: .5 },
    t: { en: "Components", pt: "Componentes" }, s: { en: "1,780 ready-made UI components", pt: "1.780 componentes de UI prontos" } },
  { n: "02", x: 968, y: 200, w: 320, h: 216, classe: "", desenha: colors, parado: 1, ciclo: 16,
    t: { en: "Colors", pt: "Cores" }, s: { en: "5 color palettes", pt: "5 paletas de cores" } },
  { n: "03", x: 1304, y: 200, w: 320, h: 216, classe: "", desenha: typography, parado: 1,
    t: { en: "Typography", pt: "Tipografia" }, s: { en: "23 exclusive weight fonts", pt: "23 fontes exclusivas" } },
  { n: "04", x: 968, y: 432, w: 320, h: 216, classe: "", desenha: icons, parado: 1,
    t: { en: "Icons", pt: "Ícones" }, s: { en: "602 exclusive icons", pt: "602 ícones exclusivos" } },
  { n: "05", x: 1304, y: 432, w: 320, h: 216, classe: "", desenha: motion, parado: 0,
    t: { en: "Motion", pt: "Motion" }, s: { en: "45 motion elements", pt: "45 elementos de motion" } },
  { n: "06", x: 296, y: 664, w: 320, h: 216, classe: "", desenha: grids, parado: 1,
    t: { en: "Grids & templates", pt: "Grids e templates" }, s: { en: "13 grids and templates", pt: "13 grids e templates" } },
  { n: "07", x: 632, y: 664, w: 320, h: 216, classe: "", desenha: accessibility, parado: .5,
    t: { en: "Accessibility", pt: "Acessibilidade" }, s: { en: "8 inclusive dimensions", pt: "8 dimensões inclusivas" } },
  { n: "08", x: 968, y: 664, w: 656, h: 216, classe: "md:col-span-2", desenha: illustrations, parado: 1,
    t: { en: "Illustrations", pt: "Ilustrações" }, s: { en: "Automatic illustration generator", pt: "Gerador automático de ilustrações" } },
];

export default function FlameCards({ lang }: { lang: Lang }) {
  const grade = useRef<HTMLDivElement>(null);
  const telas = useRef<(SVGSVGElement | null)[]>([]);

  useEffect(() => {
    const el = grade.current;
    if (!el) return;
    const menosMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0, visivel = false;
    const inicio = performance.now();
    // tamanho de cada SVG em pixels de CSS, medido só quando a grade muda (não a cada quadro)
    let tamanhos: [number, number][] = [];
    const mede = () => {
      tamanhos = telas.current.map(sv => {
        const card = sv?.parentElement;
        // o SVG começa 1px fora do card (na borda de fora) e para 80px antes da base
        return card ? [card.clientWidth + 2, card.clientHeight + 2 - 80] : [0, 0];
      });
    };

    const desenhaTudo = (tempo: number | null) => {
      CARDS.forEach((c, i) => {
        const sv = telas.current[i];
        if (!sv || !tamanhos[i]) return;
        const [W, H] = tamanhos[i];
        const compacto = !!c.compacto && H + 80 < c.h - 8;
        let conteudo = c.desenha(tempo === null ? c.parado : tempo % (c.ciclo ?? CICLO), compacto);
        if (compacto && c.compacto) {
          // card mais baixo que no Figma (celular): a ilustração é reduzida e centrada na
          // área acima do texto (do 24 ao 116 do card; o SVG começa 1px acima do card)
          const b = c.compacto;
          sv.setAttribute("viewBox", `0 0 ${W} ${H}`);
          conteudo = `<g transform="translate(${Math.round(W / 2)} 71) scale(${b.escala}) translate(${-(b.x + b.w / 2)} ${-(b.y + b.h / 2)})">${conteudo}</g>`;
        } else {
          // card do Figma centrado na horizontal, em 1:1 (arredondado pra não cair em meio pixel)
          sv.setAttribute("viewBox", `${c.x - Math.round((W - c.w) / 2)} ${c.y} ${W} ${H}`);
        }
        sv.innerHTML = conteudo;
      });
    };
    // relógio corrido; cada card tira o seu ciclo (8s, ou 16s no Colors)
    const agora = () => (performance.now() - inicio) / 1000;
    const roda = () => {
      if (!visivel) { raf = 0; return; }
      desenhaTudo(agora());
      raf = requestAnimationFrame(roda);
    };

    mede();
    desenhaTudo(menosMovimento ? null : agora());
    const obs = new IntersectionObserver(([e]) => {
      visivel = e.isIntersecting;
      if (visivel && !menosMovimento && !raf) roda();
    }, { threshold: .1 });
    // redesenha no tamanho novo quando a grade muda de largura (troca de coluna, giro do celular)
    const tam = new ResizeObserver(() => { mede(); desenhaTudo(menosMovimento ? null : agora()); });
    obs.observe(el);
    tam.observe(el);
    return () => { obs.disconnect(); tam.disconnect(); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div
      ref={grade}
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 auto-rows-[216px] gap-4"
      style={{ fontFamily: FONTE, fontWeight: 400, color: INK }}
    >
      {CARDS.map((c, i) => (
        <div key={c.n} className={`relative overflow-hidden rounded-[8px] bg-white border border-[#E4E4E4] ${c.classe}`}>
          <svg
            ref={el => { telas.current[i] = el; }}
            aria-hidden="true"
            className="absolute -left-px -top-px"
            // da borda de fora do card, como no Figma, até 80px antes da base (no texto)
            style={{ width: "calc(100% + 2px)", height: "calc(100% - 78px)", overflow: "hidden" }}
          />
          <div className="absolute left-6 right-6 bottom-6">
            <p className="text-[20px] leading-6">{c.t[lang]}</p>
            <p className="mt-1 text-[16px] leading-6" style={{ opacity: .6 }}>{c.s[lang]}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
