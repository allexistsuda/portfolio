"use client";

import BottomNav from "../components/BottomNav";
import Nav from "../components/Nav";
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

type Section = { heading: string; blocks: Block[] };
type Content = {
  intro: Section;
  pain: Section;
  opportunity: Section;
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
      "Criamos um aplicativo que mudou o comportamento da consulta veterinária, reduzindo o tempo de tomada de decisão durante o atendimento",
    blocks: [
      { p: ["O Vet Smart surgiu em um momento em que não existiam aplicativos para médicos veterinários. Fomos os ", { h: "primeiros a construir um produto voltado para esse público." }] },
      { p: ["Desde o início, atuei como Product Designer conduzindo pesquisas e participando da definição do produto, mapeando problemas e oportunidades no dia a dia de veterinários de pequenos animais."] },
      { p: ["Como resultado, o Vet Smart alcançou 80 mil usuários ativos e 2,5 milhões de pageviews mensais, sendo posteriormente adquirido pela Petlove."] },
    ],
  },
  pain: {
    heading: "Onde identificamos uma dor",
    blocks: [
      { p: ["Acompanhamos diversas consultas veterinárias e observamos que, durante o atendimento, o veterinário ", { h: "alternava entre livros e memória", d: 0.2 }, " para buscar informações, ", { h: "incluindo dosagens de medicamentos.", d: 0.4 }] },
      { p: ["Esse processo não apenas consumia tempo, como também era suscetível a falhas: a informação podia estar desatualizada e a memória não era confiável. Isso ocorria justamente no ", { h: "momento mais crítico da consulta.", d: 0.6 }] },
    ],
  },
  opportunity: {
    heading: "Oportunidade",
    blocks: [
      { p: [{ h: "A informação já existia em algum lugar, mas não estava acessível de forma rápida", d: 0.2 }, " e, muitas vezes, estava desatualizada."] },
    ],
  },
  solution: {
    heading: "Solução",
    blocks: [
      { p: [{ h: "O problema acontecia durante a consulta, então a solução precisava existir nesse mesmo contexto.", d: 0.2 }] },
      { p: ["Levamos essa informação para um aplicativo, disponível na mão do veterinário durante o atendimento."] },
      { p: ["Começamos reorganizando o conteúdo para acesso rápido, estruturando a informação para ser compreendida sem necessidade de leitura completa."] },
      { p: ["Priorizamos ", { h: "escaneabilidade em vez de profundidade", d: 0.4 }, ", ", { h: "reduzindo a quantidade de informação visível", d: 0.6 }, " e organizando tudo em um padrão consistente."] },
      { p: ["Essa decisão veio da observação de que ", { h: "a leitura completa não acontecia durante a consulta.", d: 0.8 }] },
      { p: ["Adotamos, então, algumas premissas de estrutura para o aplicativo:"] },
      { ul: [[{ h: "busca direta", d: 1.0 }], [{ h: "listas simples", d: 1.2 }], [{ h: "informação sempre no mesmo formato", d: 1.4 }]], mt: 16 },
      { p: ["Com isso, o foco do veterinário passou para o acesso rápido à informação durante a consulta."] },
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
      "We built an app that changed how vets work during appointments, cutting decision-making time in the consult",
    blocks: [
      { p: ["Vet Smart came about at a time when there were no apps for veterinarians. We were the ", { h: "first to build a product for this audience." }] },
      { p: ["From the start, I worked as Product Designer, leading research and helping define the product, mapping problems and opportunities in the daily routine of small-animal vets."] },
      { p: ["As a result, Vet Smart reached 80,000 active users and 2.5 million monthly pageviews, and was later acquired by Petlove."] },
    ],
  },
  pain: {
    heading: "Where we spotted a pain point",
    blocks: [
      { p: ["We followed many vet appointments and noticed that, during the consult, the vet ", { h: "switched between books and memory", d: 0.2 }, " to look up information, ", { h: "including drug dosages.", d: 0.4 }] },
      { p: ["This process was not only time-consuming but also error-prone: information could be outdated and memory was unreliable. And it happened at exactly the ", { h: "most critical moment of the consult.", d: 0.6 }] },
    ],
  },
  opportunity: {
    heading: "Opportunity",
    blocks: [
      { p: [{ h: "The information already existed somewhere, but it wasn't quickly accessible", d: 0.2 }, " and was often outdated."] },
    ],
  },
  solution: {
    heading: "Solution",
    blocks: [
      { p: [{ h: "The problem happened during the consult, so the solution had to live in that same context.", d: 0.2 }] },
      { p: ["We brought that information into an app, available in the vet's hand during the consult."] },
      { p: ["We started by reorganizing the content for quick access, structuring information so it could be understood without reading it in full."] },
      { p: ["We prioritized ", { h: "scannability over depth", d: 0.4 }, ", ", { h: "reducing the amount of visible information", d: 0.6 }, " and organizing everything into a consistent pattern."] },
      { p: ["This decision came from observing that ", { h: "full reading didn't happen during the consult.", d: 0.8 }] },
      { p: ["So we adopted a few structural principles for the app:"] },
      { ul: [[{ h: "direct search", d: 1.0 }], [{ h: "simple lists", d: 1.2 }], [{ h: "information always in the same format", d: 1.4 }]], mt: 16 },
      { p: ["With that, the vet's focus shifted to quick access to information during the consult."] },
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
          <div className="hidden md:block"><Img src="/vet-smart/02.png" alt="Vet Smart" /></div>
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
          <div className="flex md:hidden"><Img src="/vet-smart/04-mobile.gif" alt="Vet Smart motion" /></div>
          <div className="hidden md:flex"><Img src="/vet-smart/04.gif" alt="Vet Smart motion" /></div>
          <div className="flex md:hidden"><Img src="/vet-smart/celular-mobile.png" alt="Vet Smart" /></div>
          <div className="hidden md:block"><Img src="/vet-smart/05.png" alt="Vet Smart resultados" /></div>
        </div>

        {/* Onde identificamos uma dor */}
        <TwoCol heading={c.pain.heading}>
          <Blocks blocks={c.pain.blocks} />
        </TwoCol>

        <Divider />

        {/* Oportunidade */}
        <TwoCol heading={c.opportunity.heading}>
          <Blocks blocks={c.opportunity.blocks} />
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
