"use client";

import BottomNav from "../components/BottomNav";
import Nav from "../components/Nav";
import Reveal from "../components/Reveal";
import VideoPlayer from "../components/VideoPlayer";
import FlameCards from "./FlameCards";
import FlameTokens from "./FlameTokens";
import { useLang } from "../i18n/lang";
import { Blocks, type Block } from "../i18n/render";

const body: React.CSSProperties = { fontWeight: 400, color: "#222" };
const title: React.CSSProperties = { fontWeight: 500, color: "#222" };

function TwoCol({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div className="md:px-5">
      <div className="grid grid-cols-1 md:grid-cols-[42%_1fr] gap-y-6 gap-x-16 lg:gap-x-24">
        {/* o título abre a cascata e os parágrafos vêm atrás, escalonados dentro do
            Blocks — mesmo ritmo do About na home. triggerMargin 0% porque o padrão do
            componente, -30%, adia o gatilho em quase um terço da tela. */}
        <Reveal triggerMargin="0%">
          <h2
            className="text-[29px] md:text-[36px] leading-[38px] md:leading-[44px] tracking-[-0.58px] md:tracking-[-0.72px]"
            style={title}
          >{heading}</h2>
        </Reveal>
        <div
          className="text-[19px] md:text-[24px] leading-[29px] md:leading-[36px] tracking-[-0.19px] md:tracking-[-0.24px]"
          style={body}
        >{children}</div>
      </div>
    </div>
  );
}

// a primeira frase foi partida: o começo vira o título da esquerda, e o texto da direita
// abre com uma frase completa ("também contribuí") que amarra com o título sem depender dele
const tituloPt = "Trabalhei na criação de um Design System do zero e também na sua manutenção";
const tituloEn = "I worked on building a Design System from scratch and on maintaining it";

const flamePt: Block[] = [
  { p: ["Também contribuí para a evolução de componentes, bibliotecas compartilhadas e padrões utilizados em diferentes produtos da companhia."] },
  { p: ["Como principal resultado, reduzimos em 35% o tempo de criação de interfaces com o uso do Design System."] },
  { p: ["Fui selecionado também para participar da construção de um Design System global, com reuniões frequentes de alinhamento com outros times internacionais."] },
];

const flameEn: Block[] = [
  { p: ["I also contributed to the evolution of components, shared libraries and patterns used across the company's products."] },
  { p: ["As the main outcome, we cut the time it takes to design interfaces by 35% with the Design System."] },
  { p: ["I was also selected to help build a global Design System, with frequent alignment meetings with international teams."] },
];

const tokensTituloPt = "No Flame, cada propriedade de um componente vem de um token";
const tokensTituloEn = "In Flame, every property of a component comes from a token";

const tokensPt: Block[] = [
  { p: ["No botão primário, o fundo, o texto, os cantos e o respiro passam por uma cadeia de tokens até chegar ao valor. Assim, uma mudança no fim da cadeia alcança todos os botões de uma vez."] },
];

const tokensEn: Block[] = [
  { p: ["In the primary button, the background, text, corners and padding go through a chain of tokens before reaching their value. A change at the end of that chain reaches every button at once."] },
];

export default function SantanderDesignSystem() {
  const { lang } = useLang();
  const flame = lang === "pt" ? flamePt : flameEn;

  return (
    <div className="min-h-screen bg-[#F2F2F2]" style={{ color: "#222" }}>
      <Nav />

      <div className="px-6 md:px-10 mx-auto" style={{ maxWidth: 1440, paddingTop: 32 }}>

        {/* Video */}
        <div className="mb-8 md:mb-[100px]">
          <VideoPlayer videoId="ZhN6ttPgI-c" thumbnail="/santander/thumb.png" />
        </div>

        {/* Flame */}
        <TwoCol heading={lang === "pt" ? tituloPt : tituloEn}>
          <Blocks cascata blocks={flame} />
        </TwoCol>

        {/* Os 8 pilares do Flame: cards em HTML na largura do container, com as
            ilustrações animadas em canvas (FlameCards) */}
        <div className="my-8 md:my-[100px]">
          <FlameCards lang={lang} />
        </div>

        {/* Tokens: o texto e, embaixo, a anatomia do botão em carrossel (FlameTokens) */}
        <TwoCol heading={lang === "pt" ? tokensTituloPt : tokensTituloEn}>
          <Blocks cascata blocks={lang === "pt" ? tokensPt : tokensEn} />
        </TwoCol>
        <div className="my-8 md:my-[100px]">
          <FlameTokens lang={lang} />
        </div>

        <BottomNav prev={{ label: "Unico You", href: "/unico-you" }} next={{ label: "Santander Workshops", href: "/santander-workshops" }} />

      </div>
    </div>
  );
}
