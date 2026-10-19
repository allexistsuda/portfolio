"use client";

import { useEffect, useRef, useState } from "react";

// Calculadora de dosagem: dois estados encadeados numa tomada só.
// Estado 1 — campo vazio. Foca, digita "1,5", pausa, e a validação derruba o estado 2:
// borda vermelha + alerta, que empurra 146pt da tela pra baixo.
//
// Regra de montagem: tudo que tem letra é PNG recortado do Figma (a fonte da tela não está
// no projeto, texto renderizado não bateria). Caixa do card, campo e cursor são CSS, porque
// são geometria — e é isso que permite animar altura e cor de borda sem trocar asset.
//
// Medidas tiradas pixel a pixel das duas referências (924x2000 = tela de 375pt a 2,464x);
// os PNGs saíram do Figma a 3,391x. Nada aqui é chute: ver public/dosagem/v2/_ref-*.webp.

const A = "/dosagem/v2/";
const SW = 375; // tela em pt
const SH = 812;
// Palco = o canvas nativo do mockup de 3 aparelhos (public/mockup3/mockup-vazio.webp).
// Status bar e notch já vêm desenhados nele, por isso a tela começa transparente no topo.
const W = 2000;
const H = 1317;
const MOCK = { top: 138, w: 481, h: 1040, xs: [143, 760, 1377], raio: 52 };
const SCALE = MOCK.w / SW;

// quanto a metade de baixo desce quando o alerta abre (= altura do alerta + respiro)
const SHIFT = 146.11;

// --- 2º aparelho: Chemitril. Mesma gramática, desfecho diferente: a dose sai, e o aviso
// âmbar é ressalva, não bloqueio. Os PNGs deste lote saíram a 3,227x (não 3,391x) — confere
// em três medidas independentes: 311,1 / 343,0 / 311,1.
// Só começa depois que o 1º fecha (alerta aberto em 2,60s), com uma batida de respiro.
// A pausa antes de validar é mais curta que a do 1º: a gramática já foi ensinada lá.
const OFF2 = 2.25;
const T2 = { focus: 0.6, k1: 0.9, k2: 1.08, abre: 1.78 };
const CLIP2 = [0, 8.68, 18.59]; // vãos entre "6" e "0" em t-valor-60.png
const CARD2 = { base: 230.32, aberto: 469.79 };
const SHIFT2 = CARD2.aberto - CARD2.base;

// --- 3º aparelho: Rimadyl. Último passo do arco, e o único em que o usuário age DEPOIS
// do resultado: toca no ⓘ pra perguntar de onde vem o número. Por isso o tooltip entra
// mais lento que os alertas — não é reação do sistema, é resposta a uma segunda pergunta.
const OFF3 = 4.1;
const T3 = { focus: 0.6, k1: 0.9, k2: 1.05, k3: 1.2, k4: 1.38, k5: 1.55, abre: 2.0, tip: 2.7 };
const D_TIP = 0.5; // mais lento que os alertas: é resposta a uma segunda pergunta, não reação
const CLIP3 = [0, 5.42, 15.18, 19.37, 28.82, 38.27];
const CARD3 = { base: 230.32, aberto: 299.97 };
const SHIFT3 = CARD3.aberto - CARD3.base;

// Uma passada só: digita, valida, e segura o estado 2 até o fim. Sem loop — o reset que
// limpava o campo pra reemendar no começo saiu, porque fazia a digitação acontecer de novo.
const DUR = 8.2;
const T = {
  focus: 0.6,
  k1: 0.9, // "1"
  k2: 1.12, // ","
  k3: 1.3, // "5"
  validate: 2.1,
  alert: 2.18,
};
const D = { focus: 0.28, validate: 0.32, alert: 0.42 };

// paradas do clip sobre t-valor-15.png, nos vãos entre os glifos
const CLIP = [0, 5.6, 10.32, 19.46];
// O cursor é um fio fino. Em posição fracionária o navegador espalha ele por dois pixels e
// ele engorda — era o que fazia a barra mudar de peso a cada tecla e diferir entre aparelhos.
// A peça é renderizada com o palco em escala 2 (4000x2634 pra um palco de 2000x1317), então
// meio pixel de palco é um pixel inteiro de saída: ancorando o fio nessa grade e dando a ele
// 1,5 de palco de largura, ele sai sempre com exatamente 3px, em qualquer posição.
const GRADE = 2; // escala do palco no render
const fio = (x: number) => Math.round(x * SCALE * GRADE) / (SCALE * GRADE);
const FIO_W = 1.5 / SCALE;

const VAL_X = 44.64; // origem do texto dentro do campo
const VAL_Y = 396.92;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeInOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
/** progresso de 0 a 1 de uma transição que começa em `ini` e dura `dur` */
const ramp = (t: number, ini: number, dur: number) => clamp01((t - ini) / dur);

/** Opacidade de cada um dos três PNGs do campo. Sem glow: o estado é só a borda,
    e a troca de cor vira crossfade entre os recortes do Figma. */
function campo(t: number) {
  // easeInOut, não easeOut: o easeOut concentra a mudança no começo e o crossfade fica duro.
  const pFoco = easeInOut(ramp(t, T.focus, D.focus));
  const pErro = easeInOut(ramp(t, T.validate, D.validate));
  return { neutro: 1 - pFoco, foco: pFoco * (1 - pErro), erro: pErro };
}

/** opacidades do campo do 2º aparelho: nunca vai pro vermelho, fica verde */
function campo2(t: number) {
  const pFoco = easeInOut(ramp(t, T2.focus, D.focus));
  return { neutro: 1 - pFoco, foco: pFoco, erro: 0 };
}

/** largura do clip sobre o valor digitado do 2º aparelho */
function clipValor2(t: number) {
  if (t >= T2.k2) return CLIP2[2];
  if (t >= T2.k1) return CLIP2[1];
  return 0;
}

/** largura do clip sobre o valor digitado do 3º aparelho ("13,25" = 5 toques) */
function clipValor3(t: number) {
  if (t >= T3.k5) return CLIP3[5];
  if (t >= T3.k4) return CLIP3[4];
  if (t >= T3.k3) return CLIP3[3];
  if (t >= T3.k2) return CLIP3[2];
  if (t >= T3.k1) return CLIP3[1];
  return 0;
}

/** largura do clip sobre o valor digitado */
function clipValor(t: number) {
  if (t >= T.k3) return CLIP[3];
  if (t >= T.k2) return CLIP[2];
  if (t >= T.k1) return CLIP[1];
  return 0;
}

export default function Page() {
  const [t, setT] = useState(0);
  const [fit, setFit] = useState(1);
  const origem = useRef(0);
  const pausado = useRef(false);
  const [run, setRun] = useState(0);

  useEffect(() => {
    const onFit = () => setFit(Math.min(window.innerWidth / W, window.innerHeight / H));
    onFit();
    window.addEventListener("resize", onFit);
    return () => window.removeEventListener("resize", onFit);
  }, []);

  // mesmos ganchos das outras peças: ?t=2.4 congela um instante, window.__t deixa o
  // scripts/capturar-frames.mjs pedir qualquer segundo sem recarregar.
  useEffect(() => {
    // O ?t= só vale até o primeiro R: senão você congela um quadro pra olhar e fica preso nele,
    // porque este efeito releria o parâmetro e congelaria de novo.
    const q = new URLSearchParams(window.location.search).get("t");
    const congelado = run === 0 && q !== null && !Number.isNaN(Number(q)) ? Number(q) : null;
    let raf = 0;
    origem.current = performance.now();
    const tick = (agora: number) => {
      const pedido = (window as unknown as { __t?: number }).__t;
      if (typeof pedido === "number") {
        setT(Math.min(pedido, DUR));
        raf = requestAnimationFrame(tick);
        return;
      }
      if (congelado !== null) {
        setT(congelado);
        return;
      }
      if (!pausado.current) setT(Math.min((agora - origem.current) / 1000, DUR));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault();
        pausado.current = !pausado.current;
        origem.current = performance.now() - t * 1000;
      } else if (e.key === "r" || e.key === "R") {
        pausado.current = false;
        setT(0);
        setRun((r) => r + 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [t]);

  // --- estado derivado do relógio ---
  const alerta = easeInOut(ramp(t, T.alert, D.alert));
  const f = campo(t);
  const clip = clipValor(t);
  const focado = t >= T.focus;
  // sólido enquanto digita, piscando depois — é o que um campo de verdade faz
  const piscar = t < T.k3 + 0.15 ? true : (t - (T.k3 + 0.15)) % 1.06 < 0.56;
  // some quando o passo resolve: cursor piscando num quadro parado é ruído
  const cursorOn = focado && piscar && clamp01(1 - ramp(t, T.alert + D.alert, 0.25)) > 0.5;
  const placeholder = clamp01(1 - ramp(t, T.focus, 0.15));

  const desce = SHIFT * alerta;
  const cardH = 230.32 + SHIFT * alerta;

  // 2º aparelho, no seu próprio relógio
  const t2 = t - OFF2;
  const abre2 = easeInOut(ramp(t2, T2.abre, D.alert));
  const f2 = campo2(t2);
  const clip2 = clipValor2(t2);
  const focado2 = t2 >= T2.focus;
  const piscar2 = t2 < T2.k2 + 0.15 ? true : (t2 - (T2.k2 + 0.15)) % 1.06 < 0.56;
  const cursorOn2 = focado2 && piscar2 && clamp01(1 - ramp(t2, T2.abre + D.alert, 0.25)) > 0.5;
  const placeholder2 = clamp01(1 - ramp(t2, T2.focus, 0.15));

  // 3º aparelho
  const t3 = t - OFF3;
  const abre3 = easeInOut(ramp(t3, T3.abre, D.alert));
  const pFoco3 = easeInOut(ramp(t3, T3.focus, D.focus));
  const f3 = { neutro: 1 - pFoco3, foco: pFoco3, erro: 0 };
  const clip3 = clipValor3(t3);
  const piscar3 = t3 < T3.k5 + 0.15 ? true : (t3 - (T3.k5 + 0.15)) % 1.06 < 0.56;
  const placeholder3 = clamp01(1 - ramp(t3, T3.focus, 0.15));
  const tip3 = easeInOut(ramp(t3, T3.tip, D_TIP));
  const cursorOn3 = t3 >= T3.focus && piscar3 && t3 < T3.tip;

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#f6f6f6", overflow: "hidden", position: "relative" }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: W,
          height: H,
          transform: `translate(-50%,-50%) scale(${fit})`,
          background: "#f6f6f6",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/mockup3/mockup-vazio.webp" alt="" style={{ position: "absolute", left: 0, top: 0, width: W, height: H }} />

        {/* 1º aparelho: a tela viva */}
        <Slot i={0}>
          <Tela
            alerta={alerta}
            campo={f}
            clip={clip}
            cursorOn={cursorOn}
            placeholder={placeholder}
            desce={desce}
            cardH={cardH}
          />
        </Slot>

        {/* 2º aparelho: Chemitril, também vivo */}
        <Slot i={1}>
          <Tela2
            abre={abre2}
            campo={f2}
            clip={clip2}
            cursorOn={cursorOn2}
            placeholder={placeholder2}
          />
        </Slot>

        {/* 3º aparelho: Rimadyl */}
        <Slot i={2}>
          <Tela3
            tip={tip3}
            abre={abre3}
            campo={f3}
            clip={clip3}
            cursorOn={cursorOn3}
            placeholder={placeholder3}
          />
        </Slot>
      </div>
    </div>
  );
}

/** 2º aparelho: Chemitril. O card cresce e revela a dose + o aviso âmbar, empurrando
    a Administração 239pt pra baixo. Mesmo recorte-pelo-card do 1º. */
function Tela2({
  abre,
  campo: f,
  clip,
  cursorOn,
  placeholder,
}: {
  abre: number;
  campo: { neutro: number; foco: number; erro: number };
  clip: number;
  cursorOn: boolean;
  placeholder: number;
}) {
  const cardH = CARD2.base + SHIFT2 * abre;
  const desce = SHIFT2 * abre;
  const op = clamp01((abre - 0.15) / 0.85);
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* O mockup de fundo tem as telas preenchidas; este branco cobre o conteúdo dele
          sem tapar o status bar e o notch, que ficam acima de 47pt. */}
      <div style={{ position: "absolute", left: 0, top: 47, width: SW, height: SH - 47, background: "#fff" }} />
      <P src="ic-back.png" x={16.23} y={59.7} w={24.18} h={24.18} />
      <P src="ic-note.png" x={333.98} y={59.7} w={24.18} h={24.18} />
      <P src="tabs.png" x={15.5} y={115.86} w={359.19} h={36.27} />
      <P src="t-calculadora.png" x={16.23} y={181.41} w={239.46} h={18.87} />

      <div
        style={{
          position: "absolute",
          left: 15.83,
          top: 218,
          width: 343.26,
          height: cardH,
          border: "1px solid #e7e7e7",
          borderRadius: 8,
          background: "#fff",
          boxSizing: "border-box",
        }}
      />

      <P src="box-chemitril.png" x={31.66} y={234.98} w={311.12} h={44.24} />
      <P src="box-especie.png" x={31.66} y={293.83} w={138.31} h={40.11} />
      <P src="t-peso-label.png" x={33.2} y={355.52} w={88.17} h={15.33} />

      <P src="box-input-vazio.png" x={31.66} y={380.68} w={311.12} h={44.24} o={f.neutro} />
      <P src="box-input-foco.png" x={31.66} y={380.68} w={311.12} h={44.24} o={f.foco} />
      <P src="t-placeholder.png" x={45.45} y={396.51} w={65.47} h={13.27} o={clamp01(placeholder)} />

      <div style={{ position: "absolute", left: VAL_X, top: VAL_Y, width: clip, height: 14.56, overflow: "hidden" }}>
        <P src="t-valor-60.png" x={0} y={0} w={21.38} h={14.56} />
      </div>
      <div
        style={{
          position: "absolute",
          left: fio(VAL_X + clip + 1.24),
          top: VAL_Y,
          width: FIO_W,
          height: 14.56,
          background: "#18181b",
          opacity: cursorOn ? 1 : 0,
        }}
      />

      {/* dose + aviso: recortados pelo card que cresce, igual ao 1º aparelho */}
      <div style={{ position: "absolute", left: 15.83, top: 218, width: 343.26, height: cardH, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: -15.83, top: -218, width: SW, height: SH, opacity: op }}>
          <P src="t-dose-calculada.png" x={33.2} y={446.4} w={116.83} h={12.09} />
          <P src="ic-info.png" x={157.5} y={443.3} w={18.28} h={18.28} />
          <P src="t-300mg.png" x={33.2} y={471.6} w={170.75} h={25.1} />
          <P src="box-aviso.png" x={31.66} y={510.4} w={311.12} h={154.01} />
          <P src="ic-aviso.png" x={48.3} y={527.4} w={22.0} h={22.0} />
          <P src="t-aviso-titulo.png" x={82.7} y={530.8} w={167.34} h={39.36} />
          <P src="t-aviso-corpo.png" x={82.7} y={579.5} w={238.61} h={63.53} />
        </div>
      </div>

      <div style={{ position: "absolute", inset: 0, transform: `translateY(${desce}px)` }}>
        <P src="t-administracao.png" x={16.23} y={477.27} w={140.96} h={18.87} />
        <P src="card-via-subcutanea.png" x={16} y={513.8} w={163.67} h={146.27} />
        {/* TODO provisório: cards do Defenza. Faltam os do Chemitril
            (24 horas / 5 dias / Por peso) — a tela "antes" dele não chegou no disco. */}
        <P src="card-freq-dose-unica.png" x={194.81} y={513.8} w={163.67} h={146.27} />
        <P src="card-duracao.png" x={16} y={675.32} w={163.67} h={136.24} />
        <P src="card-tipo-dose.png" x={194.81} y={675.32} w={163.67} h={136.24} />
      </div>
    </div>
  );
}

/** 3º aparelho: Rimadyl. O card abre só 70pt — é o bloco da dose, sem caixa de alerta. */
function Tela3({
  tip,
  abre,
  campo: f,
  clip,
  cursorOn,
  placeholder,
}: {
  tip: number;
  abre: number;
  campo: { neutro: number; foco: number; erro: number };
  clip: number;
  cursorOn: boolean;
  placeholder: number;
}) {
  const cardH = CARD3.base + SHIFT3 * abre;
  const desce = SHIFT3 * abre;
  const op = clamp01((abre - 0.15) / 0.85);
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* O mockup de fundo tem as telas preenchidas; este branco cobre o conteúdo dele
          sem tapar o status bar e o notch, que ficam acima de 47pt. */}
      <div style={{ position: "absolute", left: 0, top: 47, width: SW, height: SH - 47, background: "#fff" }} />
      <P src="ic-back.png" x={16.23} y={59.7} w={24.18} h={24.18} />
      <P src="ic-note.png" x={333.98} y={59.7} w={24.18} h={24.18} />
      <P src="tabs.png" x={15.5} y={115.86} w={359.19} h={36.27} />
      <P src="t-calculadora.png" x={16.23} y={181.41} w={239.46} h={18.87} />

      <div
        style={{
          position: "absolute",
          left: 15.83,
          top: 218,
          width: 343.26,
          height: cardH,
          border: "1px solid #e7e7e7",
          borderRadius: 8,
          background: "#fff",
          boxSizing: "border-box",
        }}
      />

      <P src="box-rimadyl.png" x={31.66} y={234.98} w={311.12} h={44.24} />
      <P src="box-especie.png" x={31.66} y={293.83} w={138.31} h={40.11} />
      <P src="t-peso-label.png" x={33.2} y={355.52} w={88.17} h={15.33} />

      <P src="box-input-vazio.png" x={31.66} y={380.68} w={311.12} h={44.24} o={f.neutro} />
      <P src="box-input-foco.png" x={31.66} y={380.68} w={311.12} h={44.24} o={f.foco} />
      <P src="t-placeholder.png" x={45.45} y={396.51} w={65.47} h={13.27} o={clamp01(placeholder)} />

      <div style={{ position: "absolute", left: VAL_X, top: VAL_Y, width: clip, height: 14.56, overflow: "hidden" }}>
        <P src="t-valor-1325.png" x={0} y={0} w={40.9} h={14.56} />
      </div>
      <div
        style={{
          position: "absolute",
          left: fio(VAL_X + clip + 1.09),
          top: VAL_Y,
          width: FIO_W,
          height: 14.56,
          background: "#18181b",
          opacity: cursorOn ? 1 : 0,
        }}
      />

      <div style={{ position: "absolute", left: 15.83, top: 218, width: 343.26, height: cardH, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: -15.83, top: -218, width: SW, height: SH, opacity: op }}>
          <P src="t-dose-calculada.png" x={33.2} y={446.4} w={116.83} h={12.09} />
          <P src="ic-info.png" x={157.5} y={443.3} w={18.28} h={18.28} />
          <P src="t-583mg.png" x={33.2} y={471.6} w={181.9} h={25.1} />
        </div>
      </div>

      <div style={{ position: "absolute", inset: 0, transform: `translateY(${desce}px)` }}>
        <P src="t-administracao.png" x={16.23} y={477.27} w={140.96} h={18.87} />
        <P src="card-via-subcutanea.png" x={16} y={513.8} w={163.67} h={146.27} />
        <P src="card-freq-12-12.png" x={194.81} y={513.8} w={163.67} h={146.27} />
        <P src="card-duracao-14dias.png" x={16} y={675.32} w={163.67} h={136.24} />
        <P src="card-tipo-unica.png" x={194.81} y={675.32} w={163.67} h={136.24} />
      </div>

      {/* Tooltip: popover, fica FORA do recorte do card e por cima de tudo. A ponta da seta
          (49,12 / 96,99 dentro do asset) fica centrada no ⓘ — left = 166,64 - 49,12.
          A ponta fica 4pt acima do ícone (era 6, desceu 2). Entra só com fade. */}
      <div
        style={{
          position: "absolute",
          left: 117.52,
          top: 342.31,
          width: 221.26,
          height: 110.63,
          opacity: tip,
        }}
      >
        <P src="box-tooltip.png" x={0} y={0} w={221.26} h={110.63} />
      </div>
    </div>
  );
}

/** encaixa a tela de 375x812 num dos slots do mockup, com o canto arredondado da moldura */
function Slot({ i, children }: { i: number; children: React.ReactNode }) {
  return (
    <div
      style={{
        position: "absolute",
        left: MOCK.xs[i],
        top: MOCK.top,
        width: MOCK.w,
        height: MOCK.h,
        borderRadius: MOCK.raio,
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", left: 0, top: 0, width: SW, height: SH, transform: `scale(${SCALE})`, transformOrigin: "top left" }}>
        {children}
      </div>
    </div>
  );
}

function P({ src, x, y, w, h, o = 1 }: { src: string; x: number; y: number; w: number; h: number; o?: number }) {
  // maxWidth:"none" é obrigatório: o preflight do Tailwind põe max-width:100% em toda img, o que
  // dentro do wrapper estreito do clip espremia o PNG do valor e arrastava o cursor embutido nele
  // pra dentro do recorte — dois cursores na tela.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={A + src}
      alt=""
      style={{ position: "absolute", left: x, top: y, width: w, height: h, maxWidth: "none", opacity: o }}
    />
  );
}

function Tela({
  alerta,
  campo: f,
  clip,
  cursorOn,
  placeholder,
  desce,
  cardH,
}: {
  alerta: number;
  campo: ReturnType<typeof campo>;
  clip: number;
  cursorOn: boolean;
  placeholder: number;
  desce: number;
  cardH: number;
}) {
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* O mockup de fundo tem as telas preenchidas; este branco cobre o conteúdo dele
          sem tapar o status bar e o notch, que ficam acima de 47pt. */}
      <div style={{ position: "absolute", left: 0, top: 47, width: SW, height: SH - 47, background: "#fff" }} />
      <P src="ic-back.png" x={16.23} y={59.7} w={24.18} h={24.18} />
      <P src="ic-note.png" x={333.98} y={59.7} w={24.18} h={24.18} />
      <P src="tabs.png" x={15.5} y={115.86} w={359.19} h={36.27} />
      <P src="t-calculadora.png" x={16.23} y={181.41} w={239.46} h={18.87} />

      {/* card — CSS pra poder crescer sem deformar o canto */}
      <div
        style={{
          position: "absolute",
          left: 15.83,
          top: 218,
          width: 343.26,
          height: cardH,
          border: "1px solid #e7e7e7",
          borderRadius: 8,
          background: "#fff",
          boxSizing: "border-box",
        }}
      />

      <P src="box-defenza.png" x={31.66} y={234.98} w={311.12} h={44.24} />
      <P src="box-especie.png" x={31.66} y={293.83} w={138.31} h={40.11} />
      <P src="t-peso-label.png" x={33.2} y={355.52} w={88.17} h={15.33} />

      {/* campo de peso: os três estados são PNG do Figma, empilhados e cruzados em opacidade */}
      <P src="box-input-vazio.png" x={31.66} y={380.68} w={311.12} h={44.24} o={f.neutro} />
      <P src="box-input-foco.png" x={31.66} y={380.68} w={311.12} h={44.24} o={f.foco} />
      <P src="box-input-erro.png" x={31.66} y={380.68} w={311.12} h={44.24} o={f.erro} />
      <P src="t-placeholder.png" x={45.45} y={396.51} w={65.47} h={13.27} o={clamp01(placeholder)} />

      {/* valor digitado: um PNG só, revelado por máscara. O cursor é CSS e persegue a borda do clip. */}
      <div style={{ position: "absolute", left: VAL_X, top: VAL_Y, width: clip, height: 14.45, overflow: "hidden" }}>
        <P src="t-valor-15.png" x={0} y={0} w={22.12} h={14.45} />
      </div>
      <div
        style={{
          position: "absolute",
          left: fio(VAL_X + clip + 1.17),
          top: VAL_Y,
          width: FIO_W,
          height: 14.45,
          background: "#18181b",
          opacity: cursorOn ? 1 : 0,
        }}
      />

      {/* Alerta recortado pelo card: quem revela é o card crescendo, não um fade por cima.
          Assim ele nunca aparece sobre o que ainda não desceu. */}
      <div style={{ position: "absolute", left: 15.83, top: 218, width: 343.26, height: cardH, overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            left: 31.66 - 15.83,
            top: 440.75 - 218,
            width: 311.12,
            height: 130.05,
            opacity: clamp01((alerta - 0.15) / 0.85),
          }}
        >
          <P src="box-alerta.png" x={0} y={0} w={311.12} h={130.05} />
          <P src="ic-alerta.png" x={16.57} y={16.38} w={22.12} h={22.12} />
          <P src="t-alerta-titulo.png" x={51.94} y={21.91} w={179.59} h={12.39} />
          <P src="t-alerta-corpo.png" x={50.73} y={47.89} w={219.99} h={63.11} />
        </div>
      </div>

      {/* metade de baixo: o alerta empurra tudo isso pra baixo */}
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${desce}px)` }}>
        <P src="t-administracao.png" x={16.23} y={477.27} w={140.96} h={18.87} />
        <P src="card-via.png" x={16} y={513.8} w={163.67} h={146.27} />
        {/* "Dose única", não "Mensal": é o que a referência das 3 telas mostra pro Defenza.
            Fatiado dela em 1:1 com o slot, porque o PNG de elemento veio com o texto errado. */}
        <P src="card-freq-dose-unica.png" x={194.81} y={513.8} w={163.67} h={146.27} />
        <P src="card-duracao.png" x={16} y={675.32} w={163.67} h={136.24} />
        <P src="card-tipo-dose.png" x={194.81} y={675.32} w={163.67} h={136.24} />
      </div>
    </div>
  );
}
