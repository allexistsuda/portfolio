"use client";

import { useEffect, useRef } from "react";
import { santanderHeadline, santanderMicro } from "./fonts";

/**
 * Anatomia do botão em tokens (frame "Flame — Anatomia do botão (tokens)" no Figma).
 *
 * Os 8 cards passam sozinhos em carrossel por baixo do CTA, ligados a ele por um ramo fixo.
 * A cada card que para no centro, o botão isola a parte que
 * aquele token controla (o resto vira contorno tracejado, como na ilustração do card), indo
 * direto do token anterior pro novo.
 *
 * É um SVG só, nas coordenadas do frame (1920 x 1080), redesenhado a cada quadro como nos
 * FlameCards e, como eles, em 1:1 com a tela: a janela mais larga mostra mais cards dos lados,
 * sem mudar o tamanho de nada. Com prefers-reduced-motion fica parado no Background.
 */

type Lang = "pt" | "en";

const INK = "#17181B", RED = "#CC0000", GUIA = "#CCCCCC", RAMO = "#C8C8C8", BORDA = "#E4E4E4";
const FUNDO = "#F9F9F9";   // entre o branco dos cards e o cinza da página
const FONTE = santanderHeadline.style.fontFamily.replace(/"/g, "'");
const MICRO = santanderMicro.style.fontFamily.replace(/"/g, "'");

// a fila anda um card em ANDA segundos (o botão troca de token junto) e cada card fica
// PARADO segundos no centro: tempo da montagem dele, ou de um ciclo do loop no States
const ANDA = .6, PARADO = 3;
// o quadro: altura fixa em px (centrada entre o topo do botão e a base dos cards) e a largura
// mínima em que o desenho fica em 1:1
const ALTURA = 768, ALTURA_CELULAR = 440, CENTRO_Y = 535, MIN_LARGURA = 400;

/* ------------------------------------------------------------------ util */

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (x: number) => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const faixa = (u: number, [a, b]: number[]) => ease((u - a) / (b - a));
const rgb = (h: string) => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const mix = (a: string, b: string, p: number) => {
  const A = rgb(a), B = rgb(b);
  // em hex, pra poder misturar de novo (o States passa por três tons)
  return "#" + A.map((v, i) => Math.round(lerp(v, B[i], clamp(p))).toString(16).padStart(2, "0")).join("");
};
const n = (v: number) => Math.round(v * 100) / 100;
const op = (a: number) => a >= 1 ? "" : ` opacity="${n(clamp(a))}"`;

function ret(x: number, y: number, w: number, h: number, r: number, attrs: string) {
  return `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" rx="${n(r)}" ${attrs}/>`;
}
// traço por dentro, como o strokeAlign INSIDE do Figma
function contorno(x: number, y: number, w: number, h: number, r: number, cor: string, sw: number, extra = "") {
  const i = sw / 2;
  return ret(x + i, y + i, w - sw, h - sw, Math.max(0, r - i), `fill="none" stroke="${cor}" stroke-width="${sw}" ${extra}`);
}
const traco = (d: string, cor: string, sw: number, extra = "") =>
  `<path d="${d}" fill="none" stroke="${cor}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
const texto = (s: string, x: number, y: number, tam: number, extra = "", fonte = FONTE) =>
  `<text x="${n(x)}" y="${n(y)}" dominant-baseline="central" style="font-family:${fonte};font-weight:400;font-size:${tam}px"${/\bfill=/.test(extra) ? "" : ` fill="${INK}"`} ${extra}>${s}</text>`;

/* ------------------------------------------------------------------ cards */

type Card = {
  t: Record<Lang, string>;
  // tokens: x, y (topo da linha de 24), texto; a etiqueta do valor vem depois do último
  tokens: [number, number, string][];
  valor: string; amostra?: string;
};

const CARDS: Card[] = [
  { t: { en: "Background", pt: "Fundo" },
    tokens: [[24, 104, "button.primary.background.default"], [56, 132, "color.background.action"], [88, 160, "color.red.600"]],
    valor: "#CC0000", amostra: "#CC0000" },
  { t: { en: "Text color", pt: "Cor do texto" },
    tokens: [[24, 104, "button.primary.text.default"], [56, 132, "color.text.on-action"], [88, 160, "color.neutral.0"]],
    valor: "#FFFFFF", amostra: "#FFFFFF" },
  { t: { en: "States", pt: "Estados" },
    tokens: [[24, 104, "button.primary.background.hover"], [56, 132, "color.background.action.hover"], [88, 160, "color.red.700"]],
    valor: "#990000", amostra: "#990000" },
  { t: { en: "Focus ring", pt: "Anel de foco" },
    tokens: [[24, 104, "button.focus-ring.color"], [56, 132, "color.border.focus"], [88, 160, "color.neutral.900"]],
    valor: "#17181B", amostra: INK },
  { t: { en: "Typography", pt: "Tipografia" },
    tokens: [[24, 104, "button.typography"], [56, 132, "typography.label.md"], [88, 160, "font.family.micro-text"]],
    valor: "16/24" },
  { t: { en: "Corner radius", pt: "Arredondamento" },
    tokens: [[24, 104, "button.radius"], [56, 132, "radius.md"]],
    valor: "6px" },
  { t: { en: "Padding", pt: "Respiro" },
    tokens: [[24, 104, "button.padding.x · .y"], [56, 132, "space.inset.md · .sm"], [88, 160, "space.16 · space.8"]],
    valor: "16 · 8px" },
  { t: { en: "Min height", pt: "Altura mínima" },
    tokens: [[24, 104, "button.min-height"], [56, 132, "size.target.min"], [88, 160, "size.44"]],
    valor: "44px" },
];

const W = 320, H = 208, VAO = 24, Y = 496;

// altura da maiúscula da Micro Text num tamanho, medida na fonte carregada (0,7 do tamanho até lá)
const maiusculas = new Map<number, number>();
function alturaMaiuscula(tam: number) {
  if (maiusculas.has(tam)) return maiusculas.get(tam)!;
  if (typeof document === "undefined" || !document.fonts || document.fonts.status !== "loaded") return tam * .7;
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return tam * .7;
  ctx.font = `400 ${tam}px ${MICRO}`;
  const h = ctx.measureText("A").actualBoundingBoxAscent;
  maiusculas.set(tam, h);
  return h;
}

// a miniatura mostra o que o token é (um mostruário do valor); o botão de cima mostra onde
// ele age. Cada uma tem a sua forma, na faixa de 24 de altura acima do título.
function ilustracao(k: number, x: number, y: number) {
  const cy = y + 12;
  switch (k) {
    // Background: a amostra da cor
    case 0: return ret(x, y, 24, 24, 4, `fill="${RED}"`);
    // Text color: a cor do texto sobre o fundo em que ela é usada
    case 1: return ret(x, y, 24, 24, 4, `fill="${RED}"`) + texto("Aa", x + 12, cy, 11, `text-anchor="middle" fill="#FFFFFF"`, MICRO);
    // States: a escada default -> hover -> pressed
    case 2: return ret(x, y, 24, 24, 4, `fill="${RED}"`) + ret(x + 28, y, 24, 24, 4, `fill="#990000"`) + ret(x + 56, y, 24, 24, 4, `fill="#660000"`);
    // Focus ring: o anel em tinta, afastado de uma forma neutra
    case 3: return ret(x + 4, y + 4, 32, 16, 3, `fill="#E4E4E4"`) + contorno(x, y, 40, 24, 6, INK, 1.5);
    // Typography: o "Aa" da Micro Text entre as guias de altura
    case 4: {
      // o texto pousa na linha de base (alfabética) e a guia de cima passa no topo do "A"
      const base = y + 19.5, topo = Math.round(base - alturaMaiuscula(20)) + .5;
      return traco(`M${x} ${topo}h40M${x} ${base}h40`, GUIA, 1)
        + `<text x="${x}" y="${base}" style="font-family:${MICRO};font-weight:400;font-size:20px" fill="${INK}">Aa</text>`;
    }
    // Corner radius: o canto ampliado, as retas em cinza e a curva em vermelho
    case 5: return traco(`M${x} ${y + 24}V${y + 14}`, GUIA, 1) + traco(`M${x + 14} ${y}H${x + 28}`, GUIA, 1)
      + traco(`M${x} ${y + 14}Q${x} ${y} ${x + 14} ${y}`, RED, 2);
    // Padding: a área do conteúdo com o respiro hachurado em volta
    case 6: return `<defs><pattern id="tk-hachura-mini" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="4" stroke="${RED}" stroke-width="1"/></pattern></defs>`
      + `<path d="M${x} ${y}h40v24h-40ZM${x + 10} ${y + 5}v14h20v-14Z" fill="url(#tk-hachura-mini)" fill-rule="evenodd" opacity=".7"/>`
      + contorno(x, y, 40, 24, 2, GUIA, 1, `stroke-dasharray="3 3"`);
    // Min height: a régua da altura
    default: return traco(`M${x} ${y + .75}h8M${x + 4} ${y + .75}V${y + 23.25}M${x} ${y + 23.25}h8`, RED, 1.5) + texto("44", x + 14, cy, 12);
  }
}

// a corrente do token: componente -> semântico -> primitivo, e a etiqueta do valor
function corrente(c: Card, x: number, y: number) {
  let s = "";
  c.tokens.forEach(([tx, ty, nome], i) => {
    if (i > 0) s += traco(`M${x + tx - 24} ${y + ty}v10.5q0 4 4 4h12m-3 -3l3 3l-3 3`, RAMO, 1);
    s += texto(nome, x + tx, y + ty + 12, 14);
  });
  // a etiqueta encosta no fim do último nome, com a largura medida na fonte carregada
  const [tx, ty, ultimo] = c.tokens[c.tokens.length - 1];
  const ex = tx + largura(ultimo, FONTE, 14) + 12, ey = ty + 2, pad = c.amostra ? 22 : 8;
  const ew = Math.ceil(pad + largura(c.valor, FONTE, 12) + 8);
  s += ret(x + ex + .5, y + ey + .5, ew - 1, 19, 3.5, `fill="#FFFFFF" stroke="${BORDA}"`);
  if (c.amostra) s += ret(x + ex + 7, y + ey + 5, 10, 10, 2, `fill="${c.amostra}"${c.amostra === "#FFFFFF" ? ` stroke="${GUIA}"` : ""}`);
  return s + texto(c.valor, x + ex + pad, y + ey + 10, 12);
}

function card(k: number, x: number, lang: Lang, aceso: number) {
  const c = CARDS[k];
  return ret(x + .5, Y + .5, W - 1, H - 1, 7.5, `fill="#FFFFFF" stroke="${BORDA}"`)
    + `<g${op(.5 + .5 * aceso)}>` + ilustracao(k, x + 24, Y + 28) + texto(c.t[lang], x + 24, Y + 84, 20) + corrente(c, x, Y) + `</g>`;
}

// retângulo arredondado como path (pra recortar a área do conteúdo de dentro do respiro)
function retangulo(x: number, y: number, w: number, h: number, r: number) {
  return `M${n(x + r)} ${n(y)}H${n(x + w - r)}Q${n(x + w)} ${n(y)} ${n(x + w)} ${n(y + r)}V${n(y + h - r)}Q${n(x + w)} ${n(y + h)} ${n(x + w - r)} ${n(y + h)}H${n(x + r)}Q${n(x)} ${n(y + h)} ${n(x)} ${n(y + h - r)}V${n(y + r)}Q${n(x)} ${n(y)} ${n(x + r)} ${n(y)}Z`;
}
// etiqueta de medida, como a do Figma: vermelha com o número em branco, centrada no ponto
function medida(v: string, cx: number, cy: number) {
  const w = 8 + 7 * v.length;
  return ret(cx - w / 2, cy - 8, w, 16, 3, `fill="${RED}"`) + texto(v, cx, cy, 11, `text-anchor="middle" fill="#FFFFFF"`);
}

/* ------------------------------------------------------------------ o botão de cima */

const BX = 861, BY = 366, BW = 198, BH = 66, BR = 9;
const FOLGA_RAMO = 16;

// o ponteiro do card Components: sem rabicho, com os cantos arredondados (raio 2)
const PONTEIRO = (() => {
  const P = [[0, 0], [0, 48], [14.555, 31.897], [35.303, 32.516]], r = 2;
  const unid = (a: number[], b: number[]) => { const dx = a[0] - b[0], dy = a[1] - b[1], l = Math.hypot(dx, dy); return [dx / l, dy / l]; };
  return P.map((b, i) => {
    const a = P[(i - 1 + P.length) % P.length], c = P[(i + 1) % P.length], ua = unid(a, b), uc = unid(c, b);
    return `${i ? "L" : "M"}${n(b[0] + ua[0] * r)} ${n(b[1] + ua[1] * r)}Q${b[0]} ${b[1]} ${n(b[0] + uc[0] * r)} ${n(b[1] + uc[1] * r)}`;
  }).join("") + "Z";
})();

// o que cada token deixa à mostra no botão (1 = visível); o resto vira contorno tracejado.
// Entre um card e outro o botão vai direto de um conjunto pro outro, camada por camada,
// sem voltar ao botão inteiro no meio.
type Camadas = { fundo: number; claro: number; borda: number; branco: number; tinta: number; anel: number; respiro: number; cantos: number; altura: number };
const VAZIO: Camadas = { fundo: 0, claro: 0, borda: 0, branco: 0, tinta: 0, anel: 0, respiro: 0, cantos: 0, altura: 0 };
const ISOLADO: Camadas[] = [
  { ...VAZIO, fundo: 1 },                                   // Background: só o fundo, que se preenche ao chegar
  { ...VAZIO, fundo: 1, branco: 1 },                        // Text color: fundo parado, linha e seta se desenham
  { ...VAZIO, fundo: 1, branco: 1 },                        // States: o cursor entra, hover, clique, sai
  { ...VAZIO, fundo: 1, branco: 1, anel: 1 },               // Focus ring: só o anel por fora, sem o contorno do fundo
  { ...VAZIO, fundo: 1, branco: 1 },                        // Typography: a linha apaga e um texto branco é digitado
  { ...VAZIO, cantos: 1 },                                  // Corner radius: o botão some e ficam os cantos
  { ...VAZIO, respiro: 1 },                                 // Padding: tracejado, respiro hachurado e as medidas
  { ...VAZIO, altura: 1 },                                  // Min height: a cota da altura por dentro
];

// Typography: digita a palavra, segura, apaga e digita de novo, com o cursor de texto
// piscando nas pausas. Micro Text Regular em 24px: o token é 16px e o botão está em 1,5x.
const PALAVRA: Record<Lang, string> = { pt: "Continuar", en: "Continue" };
const LETRA = .09, APAGA = .05, SEGURA = 1.4, VAZIO_ANTES = .4, COMECA = .45;
const larguras = new Map<string, number>();
function largura(t: string, fonte = MICRO, tam = 24) {
  const chave = `${fonte}|${tam}|${t}`;
  if (!larguras.has(chave)) {
    if (typeof document === "undefined") return t.length * tam * .5;
    const ctx = document.createElement("canvas").getContext("2d");
    if (!ctx) return t.length * tam * .5;
    ctx.font = `400 ${tam}px ${fonte}`;
    // só guarda depois que a fonte carregou, senão mede na fonte de reserva
    const w = ctx.measureText(t).width;
    if (!document.fonts || document.fonts.status !== "loaded") return w;
    larguras.set(chave, w);
  }
  return larguras.get(chave)!;
}
function digitado(u: number, lang: Lang, cy: number, cor: string) {
  if (u < COMECA) return "";
  const palavra = PALAVRA[lang], L = palavra.length;
  const digita = L * LETRA, apaga = L * APAGA, periodo = digita + SEGURA + apaga + VAZIO_ANTES;
  const w = (u - COMECA) % periodo;
  let k: number, pisca = false;
  if (w < digita) k = Math.min(L, Math.floor(w / LETRA) + 1);
  else if (w < digita + SEGURA) { k = L; pisca = true; }
  else if (w < digita + SEGURA + apaga) k = L - Math.floor((w - digita - SEGURA) / APAGA) - 1;
  else { k = 0; pisca = true; }
  const x = BX + 25.5, parte = palavra.slice(0, Math.max(0, k));
  const cursorVisivel = !pisca || Math.floor(w / .5) % 2 === 0;
  return (parte ? texto(parte, x, cy, 24, `fill="${cor}"`, MICRO) : "")
    + (cursorVisivel ? ret(x + largura(parte) + 2, cy - 13, 2, 26, 0, `fill="${cor}"`) : "");
}

// u: segundos desde que o card parou no centro (Background e Text color se montam; States e Typography em loop)
function botao(de: number, para: number, p: number, u: number, lang: Lang) {
  const A = ISOLADO[de], B = ISOLADO[para];
  // Corner radius: o botão chega ainda como estava, os cantos acendem e o resto some devagar
  const pp = para === 5 ? (p < 1 ? 0 : faixa(u, [.25, 1.1])) : p;
  const c = Object.fromEntries(Object.keys(A).map(k => [k, lerp(A[k as keyof Camadas], B[k as keyof Camadas], pp)])) as Camadas;
  if (para === 5) c.cantos = p < 1 ? 0 : faixa(u, [0, .3]);
  // os detalhes de Focus ring, Padding e Min height se montam depois que o card para
  const monta = p < 1 ? 0 : faixa(u, [0, .6]);
  if (para === 3) c.anel = monta > 0 ? 1 : 0;
  if (para === 6) c.respiro = monta;
  if (para === 7) c.altura = monta;
  // States: default -> hover -> pressed -> default enquanto está no centro
  let cor = RED;
  let cursor = "";
  if (para === 2 && p >= 1) {
    // o cursor do card Components (em 75%, como o botão) entra, fica em cima, clica e sai
    const v = u % 3.2;
    const chega = faixa(v, [.2, .8]), sai = faixa(v, [2.2, 2.8]);
    const aperta = faixa(v, [1.3, 1.4]) * (1 - faixa(v, [1.4, 1.6]));
    const hover = faixa(v, [.7, .9]) * (1 - faixa(v, [2.3, 2.5]));
    cor = mix(mix(RED, "#990000", hover), "#660000", aperta);
    const PARADO = [BX + 171, BY + 48], FORA = [BX + 223.5, BY + 93];
    const pos = chega < 1 ? [lerp(FORA[0], PARADO[0], chega), lerp(FORA[1], PARADO[1], chega)] : [lerp(PARADO[0], FORA[0], sai), lerp(PARADO[1], FORA[1], sai)];
    const a = faixa(v, [.1, .4]) * (1 - faixa(v, [2.5, 2.8]));
    if (a > 0) cursor = `<path d="${PONTEIRO}" transform="translate(${n(pos[0])} ${n(pos[1])}) scale(${n(.75 * (1 - .12 * aperta))})" fill="#FFFFFF" stroke="#000000" stroke-width="${n(2 / .75)}" stroke-linejoin="round"${op(a)}/>`;
  }
  let s = "";
  // o anel se desenha em volta (Focus ring) e some junto quando sai
  if (c.anel > 0) s += `<g${op(c.anel)}>` + contorno(BX - 6, BY - 6, BW + 12, BH + 12, BR + 6, INK, 2,
    // perto do fim o tracejado de desenho deixava um fio aberto na emenda: aí o anel fecha inteiro
    para === 3 && monta < .97 ? `pathLength="1" stroke-dasharray="${n(monta)} 2" stroke-linecap="round"` : "") + `</g>`;
  // fundo e o contorno do desenho são camadas separadas; sem fundo, fica o tracejado
  const tracejado = (a: number) => a <= 0 ? "" : `<g${op(a)}>` + contorno(BX, BY, BW, BH, BR, GUIA, 1, `stroke-dasharray="4 4"`) + `</g>`;
  if (para === 0) {
    // Background: o tracejado se desenha em volta (se o botão ainda não estava nele) e o
    // vermelho sobe de baixo pra cima, o lado direito na frente e o esquerdo alcançando
    const jaTinha = de !== para && A.fundo < 1;
    if (p < 1) s += tracejado(jaTinha ? 1 : 0) + (A.fundo > 0 ? ret(BX, BY, BW, BH, BR, `fill="${cor}"${op(A.fundo * (1 - p))}`) : "");
    else {
      const desenha = jaTinha ? 1 : faixa(u, [0, .45]);
      const some = 1 - faixa(u, [1, 1.3]);
      if (desenha > 0 && some > 0) s += `<defs><mask id="tk-tracejado"><rect x="${BX - 2}" y="${BY - 2}" width="${BW + 4}" height="${BH + 4}" rx="${BR + 2}" fill="none" stroke="#FFFFFF" stroke-width="6" pathLength="1" stroke-dasharray="${n(desenha)} 1"/></mask></defs>`
        + `<g mask="url(#tk-tracejado)">` + tracejado(some) + `</g>`;
      const dir = faixa(u, [.35, .9]), esq = faixa(u, [.5, 1.05]);
      if (dir > 0) {
        const base = BY + BH, yE = n(base - (BH + 6) * esq), yD = n(base - (BH + 6) * dir);
        s += `<defs><clipPath id="tk-sobe"><path d="M${BX} ${base}V${yE}L${BX + BW} ${yD}V${base}Z"/></clipPath></defs>`
          + `<g clip-path="url(#tk-sobe)">` + ret(BX, BY, BW, BH, BR, `fill="${cor}"`) + `</g>`;
      }
    }
  } else {
    if (c.claro > 0) s += ret(BX, BY, BW, BH, BR, `fill="#FFFFFF"${op(c.claro)}`);
    if (c.fundo > 0) s += ret(BX, BY, BW, BH, BR, `fill="${cor}"${op(c.fundo)}`);
    s += tracejado(1 - c.fundo);
  }
  if (c.borda > 0) s += `<g${op(c.borda)}>` + contorno(BX, BY, BW, BH, BR, INK, 1.5) + `</g>`;
  // Padding: o respiro em vermelho claro e a área do conteúdo em branco, com tracejado fino
  // Padding como o Figma mostra: o respiro hachurado em volta do conteúdo (16 nas laterais e 8 em cima e
  // embaixo; o botão está em 1,5x, então 24 e 12) e as medidas em etiquetas. A hachura cresce das bordas.
  if (c.respiro > 0) {
    const r = para === 6 ? monta : 1, ix = 24 * r, iy = 12 * r;
    s += `<defs><pattern id="tk-hachura" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="5" stroke="${RED}" stroke-width="1"/></pattern></defs>`
      + `<path d="${retangulo(BX, BY, BW, BH, BR)}${retangulo(BX + ix, BY + iy, BW - 2 * ix, BH - 2 * iy, 0)}" fill="url(#tk-hachura)" fill-rule="evenodd"${op(c.respiro * .7)}/>`;
    const e = para === 6 ? faixa(u, [.6, .85]) : c.respiro;
    if (e > 0) s += `<g${op(e)}>` + medida("16", BX + 12, BY + BH / 2) + medida("8", BX + BW / 2, BY + 6) + `</g>`;
  }
  // conteúdo: linha + seta, como no CTA desenhado
  const cy = BY + 33;
  // ini/fim: o trecho da linha que aparece (0 -> 1); seta: deslocamento e opacidade da seta
  const conteudo = (cor: string, sw: number, a: number, ini = 0, fim = 1, sx = 0, sa = 1) => {
    if (a <= 0) return "";
    let g = "";
    if (fim > ini) g += traco(`M${n(BX + 25.5 + 105 * ini)} ${cy}H${n(BX + 25.5 + 105 * fim)}`, cor, sw);
    if (sa > 0) g += `<g${op(sa)}>` + traco(`M${n(BX + 150 + sx)} ${cy}h18M${n(BX + 159 + sx)} ${cy - 9}l9 9l-9 9`, cor, sw) + `</g>`;
    return `<g${op(a)}>${g}</g>`;
  };
  if (para === 1) {
    // Text color: durante a troca o conteúdo do token anterior some; quando o card para,
    // a linha se desenha e a seta entra, uma vez só, e ficam
    if (p < 1) s += conteudo("#FFFFFF", 3, A.branco * (1 - p));
    else s += conteudo("#FFFFFF", 3, 1, 0, faixa(u, [0, .6]), -12 * (1 - faixa(u, [.4, .8])), faixa(u, [.4, .7]));
  } else if (para === 4 && p >= 1) {
    // Typography: a linha apaga e um texto é digitado no lugar, como num botão de verdade
    // só a linha apaga (fade); fundo e seta ficam como estavam
    const linha = 1 - faixa(u, [0, .35]);
    s += conteudo("#FFFFFF", 3, 1, 0, 0) + (linha > 0 ? `<g${op(linha)}>` + traco(`M${BX + 25.5} ${cy}H${BX + 130.5}`, "#FFFFFF", 3) + `</g>` : "")
      + digitado(u, lang, cy, "#FFFFFF");
  } else s += conteudo("#FFFFFF", 3, c.branco) + conteudo(INK, 3, c.tinta);
  if (c.cantos > 0) {
    const L = BR + 8;
    s += `<g${op(c.cantos)}>`
      + traco(`M${BX} ${BY + L}V${BY + BR}A${BR} ${BR} 0 0 1 ${BX + BR} ${BY}H${BX + L}`, RED, 2.5)
      + traco(`M${BX + BW - L} ${BY}H${BX + BW - BR}A${BR} ${BR} 0 0 1 ${BX + BW} ${BY + BR}V${BY + L}`, RED, 2.5)
      + traco(`M${BX + BW} ${BY + BH - L}V${BY + BH - BR}A${BR} ${BR} 0 0 1 ${BX + BW - BR} ${BY + BH}H${BX + BW - L}`, RED, 2.5)
      + traco(`M${BX + L} ${BY + BH}H${BX + BR}A${BR} ${BR} 0 0 1 ${BX} ${BY + BH - BR}V${BY + BH - L}`, RED, 2.5) + `</g>`;
  }
  // Min height: a cota por dentro do botão, no centro, de cima a baixo, com a medida no meio
  // (como a do Padding); cresce ao entrar e a etiqueta vem no fim
  if (c.altura > 0) {
    const cx = BX + BW / 2, h = (BH - 2) * c.altura, t = 5;
    s += traco(`M${cx - t} ${BY + 1}h${2 * t}M${cx} ${BY + 1}V${n(BY + 1 + h)}`, RED, 1.5)
      + (c.altura >= 1 ? traco(`M${cx - t} ${BY + BH - 1}h${2 * t}`, RED, 1.5) : "");
    const e = para === 7 ? faixa(u, [.6, .85]) : c.altura;
    if (e > 0) s += `<g${op(e)}>` + medida("44", cx, BY + BH / 2) + `</g>`;
  }
  return s + cursor;
}

/* ------------------------------------------------------------------ quadro */

// k: o card no centro; de: o que estava antes; p: o andamento da troca (0 -> 1);
// dir: +1 quando a fila anda pra esquerda (próximo), -1 quando volta (anterior)
function quadro(k: number, de: number, p: number, dir: number, u: number, lang: Lang, vb: number[]) {
  let s = "";
  const anda = dir * (1 - ease(p));
  for (let i = 0; i < 8; i++) {
    let slot = ((i - k) % 8 + 8) % 8;
    if (slot > 4) slot -= 8;
    const pos = slot + anda, x = 960 - W / 2 + pos * (W + VAO);
    if (x > vb[0] + vb[2] || x + W < vb[0]) continue;
    s += card(i, x, lang, clamp(1 - Math.abs(pos)));
  }
  // o ramo fica solto entre os dois: folga do botão (pra não encostar no anel do Focus ring) e do card.
  // Sem ponta de seta, que se confundiria com a seta do próprio botão
  s += traco(`M960 ${BY + BH + FOLGA_RAMO}V${Y - FOLGA_RAMO}`, RAMO, 1) + botao(de, k, ease(clamp((p - .2) / .8)), u, lang);
  // as pontas somem no fundo
  const fw = Math.round(clamp(vb[2] * .15, 40, 240));
  return `<defs><linearGradient id="tk-esq"><stop offset="0" stop-color="${FUNDO}"/><stop offset="1" stop-color="${FUNDO}" stop-opacity="0"/></linearGradient>`
    + `<linearGradient id="tk-dir"><stop offset="0" stop-color="${FUNDO}" stop-opacity="0"/><stop offset="1" stop-color="${FUNDO}"/></linearGradient></defs>`
    + s + `<rect x="${vb[0]}" y="${vb[1]}" width="${fw}" height="${vb[3]}" fill="url(#tk-esq)"/>`
    + `<rect x="${vb[0] + vb[2] - fw}" y="${vb[1]}" width="${fw}" height="${vb[3]}" fill="url(#tk-dir)"/>`;
}

export default function FlameTokens({ lang }: { lang: Lang }) {
  const tela = useRef<SVGSVGElement>(null);
  const idioma = useRef(lang);
  const redesenha = useRef<() => void>(() => {});

  // troca de idioma redesenha o quadro parado
  useEffect(() => { idioma.current = lang; redesenha.current(); }, [lang]);

  useEffect(() => {
    const sv = tela.current;
    if (!sv) return;
    const menosMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const caixa = sv.parentElement!;
    // 1:1 com a tela, como os FlameCards: o texto não cresce nem encolhe com a janela, o quadro
    // só mostra mais ou menos cards dos lados. Abaixo de 400px de largura reduz, pro card caber.
    let vb: number[] = [];
    const ajusta = () => {
      const w = caixa.clientWidth || 1, esc = Math.min(1, w / MIN_LARGURA);
      const h = w >= 768 ? ALTURA : ALTURA_CELULAR;
      vb = [960 - w / esc / 2, CENTRO_Y - h / 2, w / esc, h];
      sv.setAttribute("viewBox", vb.map(v => n(v)).join(" "));
      caixa.style.height = `${Math.round(h * esc)}px`;
    };
    // a fila anda sozinha: cada card fica PARADO segundos no centro depois da troca, e só
    // enquanto o quadro está na tela (fora dela o relógio para e retoma de onde estava)
    let k = 0, de = 0, p = 1, inicio = 0, raf = 0, visivel = false, pausa = 0;
    // u conta a partir do fim da troca: é o relógio das montagens e dos loops de cada card
    const u = () => Math.max(0, (performance.now() - inicio) / 1000 - ANDA);
    const desenha = () => { sv.innerHTML = quadro(k, de, p, 1, menosMovimento ? 0 : u(), idioma.current, vb); };
    const roda = () => {
      if (!visivel) { raf = 0; return; }
      if (u() >= PARADO) { de = k; k = (k + 1) % 8; inicio = performance.now(); }
      p = clamp((performance.now() - inicio) / (ANDA * 1000));
      desenha();
      raf = requestAnimationFrame(roda);
    };
    let viu = false;
    const obs = new IntersectionObserver(([e]) => {
      visivel = e.isIntersecting;
      if (menosMovimento) return;
      if (!visivel) { pausa = performance.now(); return; }
      // na primeira vez que o quadro aparece, o Background se monta na frente de quem vê;
      // depois, volta de onde parou
      if (!viu) { viu = true; inicio = performance.now() - ANDA * 1000; }
      else if (pausa) inicio += performance.now() - pausa;
      if (!raf) roda();
    }, { threshold: .1 });
    obs.observe(sv);
    redesenha.current = desenha;
    ajusta();
    desenha();
    const tam = new ResizeObserver(() => { ajusta(); desenha(); });
    tam.observe(caixa);
    return () => { obs.disconnect(); tam.disconnect(); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div className="relative w-full overflow-hidden" style={{ borderRadius: 16, background: FUNDO, height: ALTURA }}>
      <svg ref={tela} aria-hidden="true" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet" />
    </div>
  );
}
