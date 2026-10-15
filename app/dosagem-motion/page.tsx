"use client";

import { useEffect, useState } from "react";

// 3 telas da calculadora de dosagem (frames 31, 34, 33 do Figma), montadas lado a lado.
// Só o que já tem PNG recortado aparece; o resto fica em branco (só a caixa/borda, sem
// texto nem ícone) até o PNG chegar — assim dá pra ver exatamente o que falta mandar.
const SCREEN_W = 375;
const SCREEN_H = 812;

// mockup dos 3 celulares (mesmo asset do phone-motion): palco 2000x1317,
// cada tela do celular ocupa 482x1040 com 138px de topo, telas em x=143/760/1377.
const W = 2000;
const H = 1317;
const MOCK = { top: 138, w: 482, h: 1040, xs: [143, 760, 1377] };
const SCALE = MOCK.w / SCREEN_W;

const GREEN = "#3aae5b";

// recortes PNG reais, exibidos na escala intrínseca deles (0,5x do tamanho do arquivo —
// confirmado batendo a largura do "Calculadora de dosagem" contra o node do Figma: 239,5 vs 242px)
function Tabs() {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/dosagem/t-doses.png" alt="" style={{ position: "absolute", left: 20, top: 122.5, width: 45.5, height: 11 }} />
      {/* wrapper recorta só a linha verde (3px) de dentro do PNG, que tem bastante espaço em branco acima */}
      <div style={{ position: "absolute", left: 16, top: 150, width: 56, height: 2, overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/dosagem/doses-underline.png" alt="" style={{ position: "absolute", left: 0, top: -34.5, width: 56, height: 36 }} />
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/dosagem/t-indicacoes.png" alt="" style={{ position: "absolute", left: 88, top: 120.25, width: 81.5, height: 15.5 }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/dosagem/t-apresentacoes.png" alt="" style={{ position: "absolute", left: 188, top: 120.5, width: 115.5, height: 15 }} />
      {/* Interações: sem PNG ainda (o recorte enviado veio cortado) */}
    </>
  );
}

function TopBar() {
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: SCREEN_W, height: 100 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/dosagem/ic-back.png" alt="" style={{ position: "absolute", left: 16, top: 60, width: 24, height: 24 }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/dosagem/ic-note.png" alt="" style={{ position: "absolute", left: 335, top: 60, width: 24, height: 24 }} />
    </div>
  );
}

// caixa do seletor de espécie, com os PNGs reais do fundo cinza do "Gatos" e os dois rótulos
function SpeciesToggle() {
  return (
    <div style={{ position: "absolute", left: 16, top: 76, width: 138, height: 40, borderRadius: 8, border: "1px solid #dddddd" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/dosagem/bg-gatos.png" alt="" style={{ position: "absolute", left: 68, top: 0, width: 71, height: 40, borderRadius: "0 7px 7px 0" }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/dosagem/t-caes.png" alt="" style={{ position: "absolute", left: 16, top: 13.75, width: 32, height: 10.5 }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/dosagem/t-gatos.png" alt="" style={{ position: "absolute", left: 82, top: 14, width: 38.5, height: 10 }} />
    </div>
  );
}

// caixa do dropdown de medicamento, com o nome do remédio (PNG, muda por tela) e a seta
function MedSelect({ nameSrc, nameW }: { nameSrc: string; nameW: number }) {
  return (
    <div style={{ position: "absolute", left: 16, top: 16, width: 311, height: 44, borderRadius: 10, background: "#f3f4f6" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={nameSrc} alt="" style={{ position: "absolute", left: 12, top: 14.25, width: nameW, height: 15.5 }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/dosagem/ic-chevron.png" alt="" style={{ position: "absolute", left: 275, top: 10, width: 24, height: 24 }} />
    </div>
  );
}

// caixa do campo de peso — sem PNG do valor digitado ainda
function WeightField({ color }: { color: string }) {
  return <div style={{ position: "absolute", left: 16, top: 162, width: 311, height: 44, borderRadius: 10, border: `2px solid ${color}`, boxSizing: "border-box" }} />;
}

// card de administração — ícone/rótulo/valor em PNG quando tiver, senão fica em branco
function AdminCard({
  left,
  top,
  iconSrc,
  labelSrc,
  labelW,
  labelH = 12,
  valueSrc,
  valueW,
  valueH = 12,
}: {
  left: number;
  top: number;
  iconSrc?: string;
  labelSrc?: string;
  labelW?: number;
  labelH?: number;
  valueSrc?: string;
  valueW?: number;
  valueH?: number;
}) {
  return (
    <div style={{ position: "absolute", left, top, width: 164, height: 146, borderRadius: 10, background: "#f8faf8" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/dosagem/bg-circle.png" alt="" style={{ position: "absolute", left: 16, top: 16, width: 48, height: 48 }} />
      {iconSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={iconSrc} alt="" style={{ position: "absolute", left: 28, top: 28, width: 24, height: 24 }} />
      )}
      {labelSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={labelSrc} alt="" style={{ position: "absolute", left: 16, top: 84 + (12 - labelH) / 2, width: labelW, height: labelH }} />
      )}
      {valueSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={valueSrc} alt="" style={{ position: "absolute", left: 16, top: 112 + (12 - valueH) / 2, width: valueW, height: valueH }} />
      )}
    </div>
  );
}

// eslint-disable-next-line @next/next/no-img-element
const TituloCalculadora = () => <img src="/dosagem/t-calculadora-dosagem.png" alt="" style={{ position: "absolute", left: 16, top: 179.5, width: 239.5, height: 19 }} />;
// eslint-disable-next-line @next/next/no-img-element
const TituloAdministracao = ({ top }: { top: number }) => <img src="/dosagem/t-administracao.png" alt="" style={{ position: "absolute", left: 16, top, width: 141, height: 19 }} />;

// ---------- tela 31: estado de erro (peso abaixo do mínimo) ----------
function Screen31() {
  return (
    <>
      <TopBar />
      <Tabs />
      <TituloCalculadora />
      <div style={{ position: "absolute", left: 16, top: 219, width: 343, height: 376, borderRadius: 10, border: "1px solid #dddddd", background: "#ffffff" }}>
        <MedSelect nameSrc="/dosagem/t-defenza.png" nameW={110} />
        <SpeciesToggle />
        <WeightField color="#d64545" />
        <div style={{ position: "absolute", left: 16, top: 222, width: 311, height: 130, borderRadius: 10, background: "#fcecec", border: "1px solid #d64545", boxSizing: "border-box" }} />
      </div>
      <TituloAdministracao top={622.5} />
      <AdminCard left={16} top={661} iconSrc="/dosagem/ic-capsule.png" labelSrc="/dosagem/t-via.png" labelW={24} valueSrc="/dosagem/t-oral.png" valueW={31} />
      <AdminCard left={195} top={661} iconSrc="/dosagem/ic-clock.png" labelSrc="/dosagem/t-frequencia.png" labelW={85.5} labelH={15.5} valueSrc="/dosagem/t-dose-unica.png" valueW={84.5} />
      <AdminCard left={16} top={835} />
      <AdminCard left={195} top={835} />
    </>
  );
}

// ---------- tela 34: dose calculada + alerta de divisão ----------
function Screen34() {
  return (
    <>
      <TopBar />
      <Tabs />
      <TituloCalculadora />
      <div style={{ position: "absolute", left: 16, top: 219, width: 343, height: 470, borderRadius: 10, border: "1px solid #dddddd", background: "#ffffff" }}>
        <MedSelect nameSrc="/dosagem/t-chemitril.png" nameW={182.5} />
        <SpeciesToggle />
        <WeightField color={GREEN} />
        <div style={{ position: "absolute", left: 16, top: 292, width: 311, height: 154, borderRadius: 10, background: "#fdf4e0", border: "1px solid #b98a2e", boxSizing: "border-box" }} />
      </div>
      <TituloAdministracao top={716.5} />
      <AdminCard left={16} top={755} iconSrc="/dosagem/ic-capsule.png" labelSrc="/dosagem/t-via.png" labelW={24} valueSrc="/dosagem/t-oral.png" valueW={31} />
      <AdminCard left={195} top={755} iconSrc="/dosagem/ic-clock.png" labelSrc="/dosagem/t-frequencia.png" labelW={85.5} labelH={15.5} valueSrc="/dosagem/t-dose-unica.png" valueW={84.5} />
    </>
  );
}

// ---------- tela 33: dose calculada + tooltip de referência ----------
function Screen33() {
  return (
    <>
      <TopBar />
      <Tabs />
      <TituloCalculadora />
      <div style={{ position: "absolute", left: 16, top: 219, width: 343, height: 300, borderRadius: 10, border: "1px solid #dddddd", background: "#ffffff" }}>
        <MedSelect nameSrc="/dosagem/t-rimadyl.png" nameW={158.5} />
        <SpeciesToggle />
        <WeightField color={GREEN} />
      </div>
      <div style={{ position: "absolute", left: 134, top: 483, width: 201, height: 78, borderRadius: 10, background: "#fafaf7", border: "1px solid #dedede", boxSizing: "border-box" }} />
      <TituloAdministracao top={588.5} />
      <AdminCard left={16} top={585} iconSrc="/dosagem/ic-capsule.png" labelSrc="/dosagem/t-via.png" labelW={24} />
      <AdminCard left={195} top={585} iconSrc="/dosagem/ic-clock.png" labelSrc="/dosagem/t-frequencia.png" labelW={85.5} labelH={15.5} />
      <AdminCard left={16} top={747} />
      <AdminCard left={195} top={747} />
    </>
  );
}

function Screen({ x, children }: { x: number; children: React.ReactNode }) {
  return (
    <div style={{ position: "absolute", left: x, top: MOCK.top, width: MOCK.w, height: MOCK.h, overflow: "hidden", borderRadius: 52 }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: SCREEN_W, height: SCREEN_H, transformOrigin: "0 0", transform: `scale(${SCALE})`, background: "#ffffff" }}>
        {children}
      </div>
    </div>
  );
}

export default function DosagemMotion() {
  const [fit, setFit] = useState({ scale: 1, ox: 0, oy: 0 });

  useEffect(() => {
    const onFit = () => {
      const scale = Math.min(window.innerWidth / W, window.innerHeight / H);
      setFit({ scale, ox: (window.innerWidth - W * scale) / 2, oy: (window.innerHeight - H * scale) / 2 });
    };
    onFit();
    window.addEventListener("resize", onFit);
    return () => window.removeEventListener("resize", onFit);
  }, []);

  return (
    <main style={{ position: "fixed", inset: 0, background: "#F5F5F5", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: fit.ox, top: fit.oy, width: W, height: H, overflow: "hidden", transformOrigin: "0 0", transform: `scale(${fit.scale})` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/mockup3/mockup-vazio.webp" alt="" style={{ position: "absolute", left: 0, top: 0, width: W, height: 1317 }} />
        <Screen x={MOCK.xs[0]}>
          <Screen31 />
        </Screen>
        <Screen x={MOCK.xs[1]}>
          <Screen34 />
        </Screen>
        <Screen x={MOCK.xs[2]}>
          <Screen33 />
        </Screen>
      </div>
    </main>
  );
}
