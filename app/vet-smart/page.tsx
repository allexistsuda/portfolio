"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import BottomNav from "../components/BottomNav";
import Nav from "../components/Nav";
import Reveal from "../components/Reveal";
import { useLang } from "../i18n/lang";
import { Blocks, type Block } from "../i18n/render";

const body: React.CSSProperties = {
  fontWeight: 400,
  color: "#222",
};

const title: React.CSSProperties = {
  fontWeight: 500,
  color: "#222",
};

function TwoCol({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div className="md:px-5">
      {/* entra como na home: um reveal por seção, título e texto juntos — são uma
          unidade de leitura, separar os dois só faria o olho esperar duas vezes */}
      {/* triggerMargin 0%, igual a home: o padrao do componente e -30%, que adia o
          gatilho em quase um terco da tela e faz o texto aparecer tarde demais */}
      <Reveal triggerMargin="0%">
      <div className="grid grid-cols-1 md:grid-cols-[42%_1fr] gap-y-6 gap-x-16 lg:gap-x-24">
        <h2
          className="text-[29px] md:text-[36px] leading-[38px] md:leading-[44px] tracking-[-0.58px] md:tracking-[-0.72px]"
          style={title}
        >{heading}</h2>
        <div
          className="text-[19px] md:text-[24px] leading-[29px] md:leading-[36px] tracking-[-0.19px] md:tracking-[-0.24px]"
          style={body}
        >{children}</div>
      </div>
      </Reveal>
    </div>
  );
}

function Divider() {
  return <div className="my-8 md:my-[100px] md:mx-5" style={{ height: 1, background: "rgba(34,34,34,0.15)" }} />;
}

function Img({ src, alt }: { src: string; alt: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} style={{ width: "100%", height: "auto", display: "block", borderRadius: 16 }} />
  );
}

/**
 * A montagem do logo, uma vez só. Sem autoplay: o bloco está no alto de uma página de
 * 17.000px, então disparar no load faria a animação acontecer antes de alguém ver.
 * Sem loop também — é um movimento com fim, e repetir a cada 2,3s vira tique.
 *
 * O primeiro quadro é branco, igual ao fundo do card, então não há salto ao começar.
 * Com prefers-reduced-motion nem monta o vídeo: entrega o PNG do quadro final.
 */
const MENOS_MOVIMENTO = "(prefers-reduced-motion: reduce)";

function assinarMovimento(aoMudar: () => void) {
  const mq = window.matchMedia(MENOS_MOVIMENTO);
  mq.addEventListener("change", aoMudar);
  return () => mq.removeEventListener("change", aoMudar);
}

function VideoNaTela({ src, estatico, alt, repetir = false }:
  { src: string; estatico: string; alt: string; repetir?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  // a preferência pode mudar durante a sessão, então aqui a assinatura é de verdade
  const semMovimento = useSyncExternalStore(
    assinarMovimento,
    () => window.matchMedia(MENOS_MOVIMENTO).matches,
    () => false,
  );

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        obs.disconnect(); // uma vez só: depois de tocar, não observa mais
        v.play().catch(() => {});
      },
      // 0.6 e não 0.35: o bloco tem 713px numa tela de 900, então a 35% ele dispara
      // ainda entrando pela borda de baixo. A 60% a montagem começa com ele já na tela.
      { threshold: 0.6 },
    );
    obs.observe(v);
    return () => obs.disconnect();
  }, [semMovimento]);

  if (semMovimento) return <Img src={estatico} alt={alt} />;

  return (
    <video
      ref={ref}
      src={src}
      muted
      playsInline
      loop={repetir}
      preload="auto"
      aria-label={alt}
      style={{ width: "100%", height: "auto", display: "block", borderRadius: 16, background: "#FFFFFF" }}
    />
  );
}

type Section = { heading: string; blocks: Block[] };
type Content = {
  intro: Section;
  pain: Section;
  solution: Section;
  evolution: Section;
  calc: Section;
  results: Section;
  role: Section;
  back: string;
};

const pt: Content = {
  intro: {
    heading:
      "Cofundei o Vet Smart, um app para médicos veterinários, junto de amigos desenvolvedores e sem investimento externo",
    blocks: [
      { p: ["O Vet Smart surgiu em um momento em que não existiam aplicativos para médicos veterinários. Fomos os ", { h: "primeiros a construir um produto voltado para esse público" }, ", e eu era o único designer do time."] },
      { p: ["Como resultado, o Vet Smart se tornou o principal aplicativo de veterinária do Brasil, usado por 1 a cada 2 veterinários de pequenos animais, e foi adquirido pela Petlove."] },
    ],
  },
  pain: {
    heading: "O problema durante a consulta",
    blocks: [
      { p: ["Os veterinários não tinham um lugar onde buscar, de forma fácil e rápida, ", { h: "informações sobre medicamentos", d: 0.2 }, ", como dosagens, indicações de uso e interações."] },
      { p: ["Muitas vezes, precisavam recorrer a ", { h: "livros ou a vários PDFs.", d: 0.4 }] },
    ],
  },
  solution: {
    heading: "Solução",
    blocks: [
      { p: ["Levamos essa informação para um aplicativo, que o veterinário usa ", { h: "durante o próprio atendimento.", d: 0.2 }] },
      { p: ["Durante a consulta o veterinário não tinha tempo de navegar muito. Por isso a ", { h: "busca tinha peso grande na navegação", d: 0.4 }, ", era o caminho mais direto para chegar na informação. Ela funcionava por nome, princípio ativo, empresa ou doença."] },
      { p: ["As bulas vinham cada uma de um jeito e traziam tudo em texto corrido. Organizei o conteúdo em ", { h: "seções fixas", d: 0.6 }, ": doses, indicações, apresentações e interações medicamentosas, consistentes em todos os produtos, ", { h: "mais de 4 mil no total.", d: 0.8 }] },
      { p: ["Também transformei o texto corrido em módulos, que organizavam a informação de um jeito mais visual e rápido de entender."] },
    ],
  },
  evolution: {
    heading: "Evolução",
    blocks: [
      { p: ["Apesar de o aplicativo ser bem aceito, identificamos um ", { h: "problema de recorrência.", d: 0.2 }] },
      { p: [{ h: "O veterinário consultava quando precisava, mas não havia um motivo constante para voltar", d: 0.4 }, " após ter domínio sobre o produto."] },
      { p: ["Com isso, fomos observar a consulta e o uso do aplicativo na prática e vimos que havia um ", { h: "cálculo recorrente de dosagem de medicamentos.", d: 0.6 }] },
      { p: [{ h: "A dose dependia do peso do animal e de regras específicas de cada medicamento.", d: 0.8 }, " ", { h: "Todo esse cálculo era feito manualmente durante a consulta.", d: 1.0 }] },
      { p: ["Isso evidenciou uma ", { h: "oportunidade de evolução.", d: 1.2 }] },
    ],
  },
  calc: {
    heading: "O cálculo dentro do fluxo",
    blocks: [
      { p: ["Nossa resposta foi ", { h: "trazer o cálculo para dentro do aplicativo", d: 0.2 }, ", ", { h: "transformando esse passo manual em uma ação rápida dentro do fluxo.", d: 0.4 }] },
      { ul: [[{ h: "o veterinário informa o peso do animal", d: 0.6 }], [{ h: "cruzamos com os dados do medicamento automaticamente", d: 0.8 }], [{ h: "o cálculo da dosagem já vem pronto", d: 1.0 }]] },
      { p: ["Com essa solução, ", { h: "o uso deixou de ser pontual e passou a ser recorrente.", d: 1.2 }] },
    ],
  },
  results: {
    heading: "Resultado",
    blocks: [
      {
        ul: [
          [{ h: "80 mil usuários ativos", d: 0.2 }],
          ["média de ", { h: "28 acessos por usuário por mês", d: 0.4 }],
          [{ h: "2,5 milhões de pageviews por mês", d: 0.6 }],
          [{ h: "6 minutos e 40 segundos por sessão", d: 0.8 }],
          ["avaliação de 4,75 nas stores"],
          [{ h: "empresa adquirida pela Petlove", d: 1.0 }],
        ],
        mt: 0,
        liPad: 8,
      },
    ],
  },
  role: {
    heading: "Meu papel",
    blocks: [
      { p: ["Atuei desde o início na definição do produto, conduzindo pesquisas e entrevistas para entender a rotina de atendimento de veterinários de pequenos animais."] },
      { p: ["A partir desses aprendizados, estruturei a experiência do aplicativo, definindo a organização da informação, os padrões de navegação e os princípios de uso focados em decisão durante a consulta."] },
      { p: ["Ao longo da evolução do produto, conduzi testes e acompanhei o uso em campo, ajustando fluxos e priorizando funcionalidades com base no comportamento real dos usuários."] },
    ],
  },
  back: "Voltar",
};

const en: Content = {
  intro: {
    heading:
      "I co-founded Vet Smart, an app for veterinarians, with developer friends and no outside investment",
    blocks: [
      { p: ["Vet Smart came about at a time when there were no apps for veterinarians. We were the ", { h: "first to build a product for this audience" }, ", and I was the only designer on the team."] },
      { p: ["As a result, Vet Smart became the leading veterinary app in Brazil, used by 1 in every 2 small-animal vets, and was acquired by Petlove."] },
    ],
  },
  pain: {
    heading: "The problem during the consult",
    blocks: [
      { p: ["Vets had nowhere to look up ", { h: "drug information", d: 0.2 }, " quickly and easily, such as dosages, indications and interactions."] },
      { p: ["More often than not, they fell back on ", { h: "books or a pile of PDFs.", d: 0.4 }] },
    ],
  },
  solution: {
    heading: "Solution",
    blocks: [
      { p: ["We brought that information into an app the vet uses ", { h: "during the appointment itself.", d: 0.2 }] },
      { p: ["There was no time to browse during a consult, so ", { h: "search did most of the work", d: 0.4 }, ". It was the most direct route to the information, and it ran on name, active ingredient, company or disease."] },
      { p: ["Every package insert was laid out differently, all of it running text. I organized the content into ", { h: "fixed sections", d: 0.6 }, ": doses, indications, formats and drug interactions, consistent across every product, ", { h: "more than 4,000 of them.", d: 0.8 }] },
      { p: ["I also broke the running text into modules, which made the information more visual and faster to take in."] },
    ],
  },
  evolution: {
    heading: "Evolution",
    blocks: [
      { p: ["Although the app was well received, we identified a ", { h: "retention problem.", d: 0.2 }] },
      { p: [{ h: "Vets looked things up when they needed to, but there was no constant reason to come back", d: 0.4 }, " once they had mastered the product."] },
      { p: ["So we went to observe the consult and real-world app use, and saw there was a ", { h: "recurring calculation of drug dosages.", d: 0.6 }] },
      { p: [{ h: "The dose depended on the animal's weight and rules specific to each drug.", d: 0.8 }, " ", { h: "All of it was calculated by hand during the consult.", d: 1.0 }] },
      { p: ["This revealed an ", { h: "opportunity to evolve.", d: 1.2 }] },
    ],
  },
  calc: {
    heading: "The calculation inside the flow",
    blocks: [
      { p: ["Our answer was to ", { h: "bring the calculation into the app", d: 0.2 }, ", ", { h: "turning that manual step into a quick action within the flow.", d: 0.4 }] },
      { ul: [[{ h: "the vet enters the animal's weight", d: 0.6 }], [{ h: "we cross-reference the drug data automatically", d: 0.8 }], [{ h: "the dosage comes out ready to use", d: 1.0 }]] },
      { p: ["With this solution, ", { h: "use went from occasional to recurring.", d: 1.2 }] },
    ],
  },
  results: {
    heading: "Results",
    blocks: [
      {
        ul: [
          [{ h: "80,000 active users", d: 0.2 }],
          ["an average of ", { h: "28 visits per user per month", d: 0.4 }],
          [{ h: "2.5 million pageviews per month", d: 0.6 }],
          [{ h: "6 minutes and 40 seconds per session", d: 0.8 }],
          ["4.75 rating on the app stores"],
          [{ h: "company acquired by Petlove", d: 1.0 }],
        ],
        mt: 0,
        liPad: 8,
      },
    ],
  },
  role: {
    heading: "My role",
    blocks: [
      { p: ["I worked from the start on defining the product, running research and interviews to understand the appointment routine of small-animal vets."] },
      { p: ["From those learnings, I structured the app experience — defining information organization, navigation patterns and usage principles focused on decision-making during the consult."] },
      { p: ["As the product evolved, I ran tests and followed field usage, adjusting flows and prioritizing features based on real user behavior."] },
    ],
  },
  back: "Back",
};

export default function VetSmart() {
  const { lang } = useLang();
  const c = lang === "pt" ? pt : en;

  return (
    <div className="min-h-screen bg-[#F2F2F2]" style={{ color: "#222" }}>
      <Nav />

      <div className="px-6 md:px-10 mx-auto" style={{ maxWidth: 1440, paddingTop: 32 }}>

        {/* Hero images */}
        <div style={{ marginBottom: 32 }}>
          <div className="md:hidden">
            <Img src="/vet-smart/01-mobile.png" alt="Vet Smart" />
          </div>
          <div className="hidden md:block">
            <Img src="/vet-smart/01.png" alt="Vet Smart" />
          </div>
        </div>
        <div className="mb-8 md:mb-[100px]">
          <div className="md:hidden"><Img src="/vet-smart/02-mobile.png" alt="Vet Smart" /></div>
          <div className="hidden md:block"><VideoNaTela src="/vet-smart/02-motion.mp4" estatico="/vet-smart/02.png" alt="Vet Smart" /></div>
        </div>

        {/* Intro */}
        <TwoCol heading={c.intro.heading}>
          <Blocks blocks={c.intro.blocks} />
        </TwoCol>

        {/* Images grouped */}
        <div className="my-8 md:my-[100px]" style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <div>
            <div className="flex flex-col md:hidden" style={{ gap: 32 }}>
              <Img src="/vet-smart/03-mobile.png" alt="Vet Smart" />
              <Img src="/vet-smart/03b-mobile.png" alt="Vet Smart" />
            </div>
            <div className="hidden md:block"><Img src="/vet-smart/03.png" alt="Vet Smart" /></div>
          </div>
          {/* o cachorro repete: é ambiente, não tem começo nem fim como a montagem do logo */}
          <div className="flex md:hidden"><VideoNaTela src="/vet-smart/04-mobile-motion.mp4" estatico="/vet-smart/04-mobile-poster.jpg" alt="Vet Smart motion" repetir /></div>
          <div className="hidden md:flex"><VideoNaTela src="/vet-smart/04-motion.mp4" estatico="/vet-smart/04-poster.jpg" alt="Vet Smart motion" repetir /></div>
          <div className="flex md:hidden"><Img src="/vet-smart/celular-mobile.png" alt="Vet Smart" /></div>
          <div className="hidden md:block"><Img src="/vet-smart/05.png" alt="Vet Smart resultados" /></div>
        </div>

        {/* O problema durante a consulta */}
        <TwoCol heading={c.pain.heading}>
          <Blocks blocks={c.pain.blocks} />
        </TwoCol>


        <Divider />

        {/* Solução */}
        <TwoCol heading={c.solution.heading}>
          <Blocks blocks={c.solution.blocks} />
        </TwoCol>

        {/* Image after Solução */}
        <div className="my-8 md:my-[100px]">
          <div className="md:hidden space-y-8">
            <Img src="/vet-smart/f41-mobile-a.png" alt="Vet Smart" />
            <Img src="/vet-smart/f41-mobile-b.png" alt="Vet Smart" />
            <Img src="/vet-smart/f41-mobile-c.png" alt="Vet Smart" />
          </div>
          <div className="hidden md:block"><Img src="/vet-smart/frame41.png" alt="Vet Smart" /></div>
        </div>

        {/* Evolução */}
        <TwoCol heading={c.evolution.heading}>
          <Blocks blocks={c.evolution.blocks} />
        </TwoCol>

        {/* As bibliotecas: o que a Evolução descreve, mostrado.
            Mesmo padrão dos outros grupos: 100px por fora, 32 entre as imagens. */}
        <div className="my-8 md:my-[100px]" style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {/* a fileira das Bibliotecas rola; no celular a arte de tres telefones
              ja e pequena demais pro movimento somar, entao la fica parada */}
          <div className="md:hidden"><Img src="/vet-smart/bibliotecas-01.jpg" alt="Vet Smart bibliotecas" /></div>
          <div className="hidden md:block"><VideoNaTela src="/vet-smart/bibliotecas-01-motion.mp4" estatico="/vet-smart/bibliotecas-01.jpg" alt="Vet Smart bibliotecas" repetir /></div>
          <Img src="/vet-smart/bibliotecas-02.jpg" alt="Vet Smart estudos e protocolos" />
        </div>

        <Divider />

        {/* O cálculo dentro do fluxo */}
        <TwoCol heading={c.calc.heading}>
          <Blocks blocks={c.calc.blocks} />
        </TwoCol>

        {/* Image before Resultado */}
        <div className="my-8 md:my-[100px]">
          <div className="md:hidden"><Img src="/vet-smart/06-mobile.png" alt="Vet Smart" /></div>
          <div className="hidden md:block"><Img src="/vet-smart/06.png" alt="Vet Smart" /></div>
        </div>

        {/* Resultado */}
        <TwoCol heading={c.results.heading}>
          <Blocks blocks={c.results.blocks} />
        </TwoCol>

        <Divider />

        {/* Meu papel */}
        <TwoCol heading={c.role.heading}>
          <Blocks blocks={c.role.blocks} />
        </TwoCol>

        {/* Final gifs */}
        <div className="mt-8 md:mt-[100px]" style={{ marginBottom: 32 }}>
          <div className="md:hidden space-y-8">
            <Img src="/vet-smart/07-mobile-a.png" alt="Vet Smart" />
            <Img src="/vet-smart/07-mobile-b.gif" alt="Vet Smart" />
          </div>
          <div className="hidden md:block"><Img src="/vet-smart/07.gif" alt="Vet Smart color" /></div>
        </div>
        <div>
          <div className="md:hidden space-y-8">
            <Img src="/vet-smart/08-mobile-a.gif" alt="Vet Smart" />
            <Img src="/vet-smart/08-mobile-b.png" alt="Vet Smart" />
            <Img src="/vet-smart/08-mobile-c.png" alt="Vet Smart" />
          </div>
          <div className="hidden md:block"><Img src="/vet-smart/08.gif" alt="Vet Smart estudos" /></div>
        </div>

        <BottomNav prev={{ label: c.back, href: "/" }} next={{ label: "Unico You", href: "/unico-you" }} />

      </div>
    </div>
  );
}
