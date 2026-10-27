"use client";

import { useEffect, useRef } from "react";
import { santanderHeadline } from "./fonts";

/**
 * Atomic Design no Flame (frame "Flame — Atomic Design" no Figma): seis cards numerados em
 * sequência, de design tokens até a página.
 *
 * Cards em HTML (texto de verdade, PT/EN) no mesmo padrão dos FlameCards: 216 de altura,
 * ilustração centrada em cima e texto na base. A ilustração é um SVG pequeno desenhado em 48 x 32 e
 * mostrado em 1,5x, como no Figma. Três por linha no desktop largo, dois no tablet e um no celular.
 *
 * Movimento: quando o bloco aparece, as ilustrações entram em sequência, de 01 a 06; depois
 * cada uma fica num loop curto que mostra a sua camada, sem nada sumir e reaparecer. Como nos
 * FlameCards, o SVG é redesenhado a cada quadro, só com o bloco na tela, e com
 * prefers-reduced-motion tudo fica parado no primeiro quadro.
 */

type Lang = "pt" | "en";

const INK = "#17181B", RED = "#CC0000", SKY = "#DEEDF2", TILE = "#EFEFEF", CINZA = "#999999";
const FONTE = santanderHeadline.style.fontFamily;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (x: number) => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const n = (v: number) => Math.round(v * 100) / 100;
const circ = (cx: number, cy: number, r: number, fill: string, stroke?: string) =>
  `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}" fill="${fill}"${stroke ? ` stroke="${stroke}"` : ""}/>`;
const ret = (x: number, y: number, w: number, h: number, r: number, attrs: string) =>
  `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" rx="${n(r)}" ${attrs}/>`;

// paleta da camada de tokens, a mesma do frame do Figma
const PALETA = ["#EC0000", "#C1271D", "#F8D45C", "#86BE7D", "#368F4D", "#5FB6BF", "#77C7D0", "#4971F7", "#397FBA", "#974671", "#AF6F91", "#7A8485"];
const bolinha = (i: number) => [4 + (i % 4) * 12, 4 + Math.floor(i / 4) * 12];

// mistura duas cores em hex (pra peça trocar de cor enquanto muda de forma)
const mix = (a: string, b: string, p: number) => {
  const A = [1, 3, 5].map(i => parseInt(a.slice(i, i + 2), 16)), B = [1, 3, 5].map(i => parseInt(b.slice(i, i + 2), 16));
  return "#" + A.map((v, i) => Math.round(lerp(v, B[i], clamp(p))).toString(16).padStart(2, "0")).join("");
};
// liga e desliga dentro de um ciclo: sobe em [a, a + ida] e desce em [b, b + volta]
const janela = (v: number, a: number, ida: number, b: number, volta: number) => ease((v - a) / ida) * (1 - ease((v - b) / volta));

// uma peça que começa como átomo (círculo) e vira um pedaço de interface (retângulo)
type Alvo = [number, number, number, number, number, string, string | null];
function peca(cx: number, cy: number, r: number, alvo: Alvo, m: number) {
  const [x, y, w, h, rx, fill, stroke] = alvo;
  const sw = stroke ? 1 : 1 - m;
  return ret(lerp(cx - r, x, m) + .5 * sw, lerp(cy - r, y, m) + .5 * sw, lerp(2 * r, w, m) - sw, lerp(2 * r, h, m) - sw, Math.max(0, lerp(r, rx, m) - .5 * sw),
    `fill="${mix("#FFFFFF", fill, m)}"` + (sw > .01 ? ` stroke="${INK}" stroke-width="${n(sw)}"` : ""));
}

// as seis ilustrações, nas coordenadas do Figma (antes da escala de 1,5x), em função do tempo.
// Cada uma começa na metáfora e termina na peça real, e a peça de um card é a matéria do próximo.
const ILUSTRA: ((t: number) => string)[] = [
  // Design tokens: a paleta se condensa nos três tipos de token (cor, tipografia e espaço) e volta
  t => {
    const v = t % 5.5, m = janela(v, 1.5, .7, 4, .7), a = ease((m - .4) / .6);
    const ALVOS = [[9, 15], [24, 15], [39, 15], [39, 15]];
    let s = PALETA.map((c, i) => {
      const [x, y] = bolinha(i), [ax, ay] = ALVOS[i % 4], o = 1 - ease((m - .5) / .5);
      return o > 0 ? `<circle cx="${n(lerp(x, ax, m))}" cy="${n(lerp(y, ay, m))}" r="${n(lerp(4, 1.5, m))}" fill="${c}"${o < 1 ? ` opacity="${n(o)}"` : ""}/>` : "";
    }).join("");
    if (a > 0) s += `<g opacity="${n(a)}">` + ret(2, 8, 14, 14, 3, `fill="${RED}"`)
      + `<text x="24" y="19.5" text-anchor="middle" style="font-family:${FONTE.replace(/"/g, "'")};font-size:13px" fill="${INK}">Aa</text>`
      + `<path d="M32.5 8V22M45.5 8V22" stroke="${CINZA}"/><path d="M33 15H45M35 13L33 15L35 17M43 13L45 15L43 17" fill="none" stroke="${RED}" stroke-linecap="round" stroke-linejoin="round"/></g>`;
    return s;
  },
  // Átomo: o átomo vira uma peça só, a seta do CTA (o ícone), e volta a ser átomo.
  // A seta reaparece dentro do botão da busca, na molécula.
  t => {
    const v = t % 5, m = janela(v, 1.4, .7, 3.8, .7), ang = -Math.PI / 4 + 2 * Math.PI * t / 2.5;
    const ui = ease((m - .4) / .6), sai = 1 - ease(m / .7);
    let s = "";
    if (sai > 0) s += `<g opacity="${n(sai)}" transform="translate(24 16) scale(${n(lerp(1, .6, m))}) translate(-24 -16)">`
      + `<circle cx="24" cy="16" r="15.5" fill="none" stroke="${INK}"/>` + circ(24, 16, 5.5, RED, INK)
      + circ(24 + 16 * Math.cos(ang), 16 + 16 * Math.sin(ang), 2.5, RED, INK) + `</g>`;
    if (ui > 0) s += `<path d="M14 16H34M27 9L34 16L27 23" fill="none" stroke="${INK}" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="${n(ui)} 1"/>`;
    return s;
  },
  // Molécula: os átomos se juntam e viram uma busca (rótulo, campo e botão)
  t => {
    const v = t % 6, junta = janela(v, 0, .8, 5, .7), liga = janela(v, .6, .5, 4.8, .3), m = janela(v, 1.6, .7, 4, .7);
    const C = [24, 13.33], P = [[8, 8], [40, 8], [24, 24]].map(([x, y]) => [lerp(C[0] + (x - C[0]) * 1.35, x, junta), lerp(C[1] + (y - C[1]) * 1.35, y, junta)]);
    const ALVO: Alvo[] = [[2, 13, 30, 12, 2, "#FFFFFF", INK], [35, 13, 11, 12, 2, RED, INK], [2, 6, 16, 3, 1.5, CINZA, null]];
    const d = `M${n(P[0][0])} ${n(P[0][1])}L${n(P[1][0])} ${n(P[1][1])}L${n(P[2][0])} ${n(P[2][1])}Z`;
    const ui = ease((m - .6) / .4);
    return (liga * (1 - m) > .01 ? `<path d="${d}" fill="none" stroke="${INK}" stroke-linejoin="round" pathLength="1" stroke-dasharray="${n(liga)} 1" opacity="${n(1 - m)}"/>` : "")
      + P.map(([x, y], i) => peca(x, y, 7.5, ALVO[i], m) + (m < 1 ? circ(x + (ALVO[i][0] + ALVO[i][2] / 2 - x) * m, y + (ALVO[i][1] + ALVO[i][3] / 2 - y) * m, 2.5 * (1 - m), RED, m < .9 ? INK : undefined) : "")).join("")
      + (ui > 0 ? `<g opacity="${n(ui)}">` + ret(5, 18.25, 12, 1.5, .75, `fill="${TILE}"`)
        + `<path d="M38.5 19H42.5M40.5 17L42.5 19L40.5 21" fill="none" stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round"/></g>` : "");
  },
  // Organismo: as fileiras se juntam e viram um card (cabeçalho, a busca e uma lista)
  t => {
    const v = t % 6, junta = janela(v, 0, .8, 5, .7), liga = janela(v, .6, .5, 4.8, .3), m = janela(v, 1.6, .7, 4, .7);
    const fila = (l: number) => [lerp([-6, 0, 6][l], 0, junta), lerp(16 + (l - 1) * 11 * 1.4, 16 + (l - 1) * 11, junta)];
    const ALVO: Alvo[][] = [
      [[4, 4, 6, 6, 1.5, RED, INK], [13, 6, 14, 2, 1, TILE, null], [30, 6, 14, 2, 1, TILE, null]],
      [[4, 12.5, 28, 7, 1.5, "#FFFFFF", INK], [4, 12.5, 28, 7, 1.5, "#FFFFFF", INK], [35, 12.5, 9, 7, 1.5, RED, INK]],
      [[4, 23, 6, 6, 1, SKY, INK], [13, 23.5, 22, 2, 1, TILE, null], [13, 27, 14, 2, 1, TILE, null]],
    ];
    let s = m > 0 ? ret(.5, .5, 47, 31, 3, `fill="#FFFFFF" stroke="${INK}" opacity="${n(m)}"`) : "";
    for (let l = 0; l < 2; l++) {
      const [x0, y0] = fila(l), [x1, y1] = fila(l + 1);
      if (liga * (1 - m) > .01) s += `<path d="M${n(19 + x0)} ${n(y0 + 4.5)}L${n(19 + x1)} ${n(y1 - 4.5)}" stroke="${INK}" pathLength="1" stroke-dasharray="${n(liga)} 1" opacity="${n(1 - m)}"/>`;
    }
    for (let l = 0; l < 3; l++) {
      const [dx, y] = fila(l);
      if (m < 1) s += `<path d="M${n(5 + dx)} ${n(y)}H${n(33 + dx)}" stroke="${INK}" opacity="${n(1 - m)}"/>`;
      for (let i = 0; i < 3; i++) {
        const cx = 5 + i * 14 + dx;
        s += peca(cx, y, 4.5, ALVO[l][i], m) + (m < 1 ? circ(cx, y, 2 * (1 - m), RED) : "");
      }
    }
    return s;
  },
  // Template: os espaços do layout aparecem um a um e um bloco encaixa no principal
  t => {
    const v = t % 5;
    const SLOTS = [[.5, .5, 47, 6], [.5, 9.5, 29, 22], [32.5, 9.5, 15, 22]];
    let s = SLOTS.map(([x, y, w, h], k) => {
      const a = janela(v, .2 + k * .3, .4, 4.3, .4);
      return a > 0 ? `<g opacity="${n(a)}" transform="translate(${x + w / 2} ${y + h / 2}) scale(${n(.8 + .2 * a)}) translate(${-(x + w / 2)} ${-(y + h / 2)})">`
        + ret(x, y, w, h, 1.5, `fill="none" stroke="${CINZA}" stroke-dasharray="3 3"`) + `</g>` : "";
    }).join("");
    const b = janela(v, 1.4, .6, 3.6, .5);
    if (b > 0) s += `<g opacity="${n(b)}" transform="translate(0 ${n(lerp(8, 0, b))})">` + ret(.5, 9.5, 29, 22, 1.5, `fill="${RED}" stroke="${INK}"`) + `</g>`;
    return s;
  },
  // Página: o layout do template se preenche de conteúdo, peça por peça, e volta
  t => {
    const v = t % 5;
    const SLOTS = [[.5, .5, 47, 6], [.5, 9.5, 29, 22], [32.5, 9.5, 15, 22]];
    const ENTRA: string[] = [
      ret(.5, .5, 47, 6, 1.5, `fill="${RED}" stroke="${INK}"`) + ret(3, 3, 8, 1, .5, `fill="#FFFFFF"`),
      ret(.5, 9.5, 29, 13, 1.5, `fill="${SKY}" stroke="${INK}"`),
      ret(.5, 25, 24, 2, 1, `fill="${TILE}"`) + ret(.5, 28.5, 16, 2, 1, `fill="${TILE}"`),
      ret(21.5, 27, 8, 4, 1, `fill="${RED}"`),
      ret(32.5, 10, 15, 2, 1, `fill="${TILE}"`) + ret(32.5, 14, 12, 2, 1, `fill="${TILE}"`) + ret(32.5, 18, 14, 2, 1, `fill="${TILE}"`),
      ret(32.5, 22, 15, 9.5, 1.5, `fill="${SKY}" stroke="${INK}"`),
    ];
    const cheio = janela(v, .2, 1.2, 4.2, .5);
    let s = cheio < 1 ? `<g opacity="${n(1 - cheio)}">` + SLOTS.map(([x, y, w, h]) => ret(x, y, w, h, 1.5, `fill="none" stroke="${CINZA}" stroke-dasharray="3 3"`)).join("") + `</g>` : "";
    s += ENTRA.map((e, j) => { const a = janela(v, .2 + j * .18, .35, 4.2, .5); return a > 0 ? `<g opacity="${n(a)}">${e}</g>` : ""; }).join("");
    return s;
  },
];

const CAMADAS: { t: Record<Lang, string>; s: Record<Lang, string> }[] = [
  { t: { en: "Design tokens", pt: "Design tokens" }, s: { en: "Base variables for color, type and spacing.", pt: "As variáveis de base de cor, tipografia e espaçamento." } },
  { t: { en: "Atoms", pt: "Átomos" }, s: { en: "The smallest parts of the interface: icons, labels and inputs.", pt: "As menores peças da interface: ícones, rótulos e campos." } },
  { t: { en: "Molecules", pt: "Moléculas" }, s: { en: "Groups of atoms that make up simple components.", pt: "Grupos de átomos que formam componentes simples." } },
  { t: { en: "Organisms", pt: "Organismos" }, s: { en: "Larger components built from molecules and atoms.", pt: "Componentes maiores, feitos de moléculas e átomos." } },
  { t: { en: "Templates", pt: "Templates" }, s: { en: "Layouts that show how components connect.", pt: "Layouts que mostram como os componentes se conectam." } },
  { t: { en: "Pages", pt: "Páginas" }, s: { en: "Final screens, filled with real content and data.", pt: "As telas finais, com conteúdo e dados reais." } },
];

// a montagem: cada ilustração entra ENTRA_INTERVALO depois da anterior, em ENTRA segundos
const ENTRA = .5, ENTRA_INTERVALO = .18;

export default function FlameAtomic({ lang }: { lang: Lang }) {
  const grade = useRef<HTMLDivElement>(null);
  const telas = useRef<(SVGSVGElement | null)[]>([]);

  useEffect(() => {
    const el = grade.current;
    if (!el) return;
    const menosMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // o relógio só anda com o bloco na tela; a montagem começa na primeira vez que ele aparece
    let raf = 0, visivel = false, inicio = 0, pausa = 0, viu = false;
    const desenha = (t: number | null) => telas.current.forEach((sv, i) => {
      if (!sv) return;
      // antes de ver o bloco, nada aparece; com menos movimento, tudo já montado e parado
      const entra = t === null ? (menosMovimento ? 1 : 0) : ease((t - i * ENTRA_INTERVALO) / ENTRA);
      const s = .85 + .15 * entra;
      sv.innerHTML = entra <= 0 ? "" : `<g opacity="${n(entra)}" transform="translate(24 16) scale(${n(s)}) translate(-24 -16)">${ILUSTRA[i](t === null ? 0 : Math.max(0, t - i * ENTRA_INTERVALO))}</g>`;
    });
    const roda = () => {
      if (!visivel) { raf = 0; return; }
      desenha((performance.now() - inicio) / 1000);
      raf = requestAnimationFrame(roda);
    };
    desenha(null);
    if (menosMovimento) return;
    const obs = new IntersectionObserver(([e]) => {
      visivel = e.isIntersecting;
      if (!visivel) { pausa = performance.now(); return; }
      if (!viu) { viu = true; inicio = performance.now(); }
      else if (pausa) inicio += performance.now() - pausa;
      if (!raf) roda();
    }, { threshold: .25 });
    obs.observe(el);
    return () => { obs.disconnect(); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div
      ref={grade}
      className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 auto-rows-[216px] gap-4"
      style={{ fontFamily: FONTE, fontWeight: 400, color: INK }}
    >
      {CAMADAS.map((c, i) => (
        <div key={i} className="relative flex flex-col rounded-[8px] bg-white border border-[#E4E4E4] p-6">
          {/* a ordem das camadas vem do número, como nos FlameCards */}
          <span className="absolute top-6 right-6 text-[14px] leading-6" style={{ opacity: .6 }}>{String(i + 1).padStart(2, "0")}</span>
          {/* a ilustração centrada na área acima do texto, como nos FlameCards */}
          <div className="flex-1 flex items-center justify-center">
            <svg ref={sv => { telas.current[i] = sv; }} aria-hidden="true" width={72} height={48} viewBox="0 0 48 32" className="overflow-visible" />
          </div>
          {/* texto na base, título 20 e apoio 16 a 60%, como nos FlameCards */}
          <div>
            <p className="text-[20px] leading-6">{c.t[lang]}</p>
            <p className="mt-1 text-[16px] leading-6" style={{ opacity: .6 }}>{c.s[lang]}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
