"use client";

import Nav from "../components/Nav";
import BottomNav from "../components/BottomNav";
import { useLang } from "../i18n/lang";
import { Blocks, type Block } from "../i18n/render";

const body: React.CSSProperties = { fontWeight: 400, color: "#222" };
const title: React.CSSProperties = { fontWeight: 500, color: "#222" };

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
  opportunity: Section;
  enable: Section;
  solution: Section;
  results: Section;
  role: Section;
};

const pt: Content = {
  intro: {
    heading:
      "Criamos um novo produto que expandiu o Vet Smart além da consulta, consolidando como plataforma de educação",
    blocks: [
      { p: ["O Vet Smart já tinha uma ", { h: "base muito forte no aplicativo", d: 0.2 }, ", com uso concentrado no momento da consulta."] },
      { p: ["Isso trazia um limite claro: o produto era extremamente útil, mas ", { h: "restrito a esse contexto.", d: 0.4 }] },
      { p: [{ h: "Mais de 90% dos acessos eram para consulta de medicamentos", d: 0.6 }, ", com um fluxo e navegação já bem definidos. ", { h: "Qualquer tentativa de colocar outras coisas ali poderia atrapalhar esse uso.", d: 0.8 }] },
    ],
  },
  opportunity: {
    heading: "Onde identificamos uma nova oportunidade",
    blocks: [
      { p: ["Após diversas pesquisas, conversas com veterinários e com a indústria, e análise de mercado, vimos que ", { h: "atualização profissional ainda dependia de cursos e eventos presenciais", d: 0.2 }, ", com datas específicas e custo elevado."] },
      { p: [{ h: "Muitos veterinários não conseguiam pagar por esses cursos", d: 0.4 }, " e conteúdos de atualização."] },
      { p: ["Na época, ", { h: "não existia nenhum conteúdo digital voltado para isso.", d: 0.6 }] },
      { p: ["A partir disso, ", { h: "decidimos criar um novo produto para atender essa demanda.", d: 0.8 }] },
    ],
  },
  enable: {
    heading: "Como viabilizamos",
    blocks: [
      { p: [{ h: "Viabilizar esse produto era o maior desafio.", d: 0.2 }] },
      { p: ["Além da incerteza de engajamento do novo produto, era necessário estruturar um modelo que funcionasse de ponta a ponta."] },
      { p: ["Definimos algumas premissas:"] },
      {
        ul: [
          [{ h: "assumir a produção completa do conteúdo", d: 0.4 }, ", garantindo controle de qualidade"],
          [{ h: "contato direto com palestrantes", d: 0.6 }, ", escolhendo os principais nomes de cada tema"],
          ["organização dos temas, priorizando o que geraria mais interesse para os veterinários"],
          ["execução das transmissões, garantindo consistência na entrega"],
        ],
        mt: 16,
        liPad: 8,
      },
      { p: [{ h: "A indústria entrava como patrocinadora, viabilizando o modelo.", d: 0.8 }] },
    ],
  },
  solution: {
    heading: "Solução e evoluções",
    blocks: [
      { p: [{ h: "Criamos o Vet Smart TV", d: 0.2 }, ", nossa plataforma de palestras."] },
      { p: ["O formato foi evoluindo com o tempo, a partir do uso e do comportamento dos usuários."] },
      { p: ["Com base nisso, incorporamos alguns elementos:"] },
      {
        ul: [
          [{ h: "ao vivo, para permitir interação e dúvidas sendo respondidas na hora", d: 0.4 }],
          [{ h: "gratuitas, resolvendo o problema de custo e acesso", d: 0.6 }],
          ["votações, para manter engajamento durante a palestra"],
          ["sorteios de brindes"],
          [{ h: "certificados, válidos como horas complementares na faculdade", d: 0.8 }],
        ],
        mt: 16,
        liPad: 8,
      },
      { p: [{ h: "O certificado se mostrou um ponto importante", d: 1.0 }, ", principalmente para estudantes, que passaram a usar como horas complementares."] },
    ],
  },
  results: {
    heading: "Resultados",
    blocks: [
      {
        ul: [
          ["as palestras foram um sucesso"],
          [{ h: "picos de 7.500 pessoas assistindo ao vivo", d: 0.2 }],
          [{ h: "expansão de 1 para 2 palestras por semana", d: 0.4 }],
          [{ h: "programação definida com antecedência para todo o ano", d: 0.6 }],
        ],
        mt: 0,
        liPad: 8,
      },
    ],
  },
  role: {
    heading: "Meu papel",
    blocks: [
      { p: ["Atuei desde o início na definição do produto, estruturando o modelo e a proposta."] },
      { p: ["Conduzi a criação do formato, as decisões de experiência e a evolução do produto ao longo do tempo."] },
      { p: ["Também liderei a execução, dirigindo as gravações e participando da produção das palestras."] },
    ],
  },
};

const en: Content = {
  intro: {
    heading:
      "We built a new product that expanded Vet Smart beyond the consult, establishing it as an education platform",
    blocks: [
      { p: ["Vet Smart already had a ", { h: "very strong base in the app", d: 0.2 }, ", with usage concentrated around the consult."] },
      { p: ["That created a clear limit: the product was extremely useful, but ", { h: "restricted to that context.", d: 0.4 }] },
      { p: [{ h: "Over 90% of visits were to look up medications", d: 0.6 }, ", with a flow and navigation already well defined. ", { h: "Any attempt to add other things there could disrupt that use.", d: 0.8 }] },
    ],
  },
  opportunity: {
    heading: "Where we spotted a new opportunity",
    blocks: [
      { p: ["After extensive research, conversations with vets and the industry, and market analysis, we saw that ", { h: "professional development still depended on in-person courses and events", d: 0.2 }, ", with fixed dates and a high cost."] },
      { p: [{ h: "Many vets couldn't afford these courses", d: 0.4 }, " and continuing-education content."] },
      { p: ["At the time, ", { h: "there was no digital content aimed at this.", d: 0.6 }] },
      { p: ["From there, ", { h: "we decided to create a new product to meet that demand.", d: 0.8 }] },
    ],
  },
  enable: {
    heading: "How we made it work",
    blocks: [
      { p: [{ h: "Making this product viable was the biggest challenge.", d: 0.2 }] },
      { p: ["Beyond the uncertainty around engagement, we needed to structure a model that worked end to end."] },
      { p: ["We set a few principles:"] },
      {
        ul: [
          [{ h: "own the full content production", d: 0.4 }, ", ensuring quality control"],
          [{ h: "direct contact with speakers", d: 0.6 }, ", picking the top names in each topic"],
          ["organizing topics, prioritizing what would draw the most interest from vets"],
          ["running the broadcasts, ensuring consistent delivery"],
        ],
        mt: 16,
        liPad: 8,
      },
      { p: [{ h: "The industry came in as a sponsor, making the model viable.", d: 0.8 }] },
    ],
  },
  solution: {
    heading: "Solution and iterations",
    blocks: [
      { p: [{ h: "We created Vet Smart TV", d: 0.2 }, ", our platform for talks."] },
      { p: ["The format evolved over time, based on usage and user behavior."] },
      { p: ["Based on that, we added a few elements:"] },
      {
        ul: [
          [{ h: "live, to allow interaction and questions answered on the spot", d: 0.4 }],
          [{ h: "free, solving the cost and access problem", d: 0.6 }],
          ["polls, to keep engagement during the talk"],
          ["giveaways"],
          [{ h: "certificates, valid as extracurricular hours at university", d: 0.8 }],
        ],
        mt: 16,
        liPad: 8,
      },
      { p: [{ h: "The certificate turned out to be an important point", d: 1.0 }, ", especially for students, who started using it as extracurricular hours."] },
    ],
  },
  results: {
    heading: "Results",
    blocks: [
      {
        ul: [
          ["the talks were a success"],
          [{ h: "peaks of 7,500 people watching live", d: 0.2 }],
          [{ h: "expansion from 1 to 2 talks per week", d: 0.4 }],
          [{ h: "a schedule set in advance for the whole year", d: 0.6 }],
        ],
        mt: 0,
        liPad: 8,
      },
    ],
  },
  role: {
    heading: "My role",
    blocks: [
      { p: ["I worked from the start on defining the product, structuring the model and the proposition."] },
      { p: ["I led the creation of the format, the experience decisions and the product's evolution over time."] },
      { p: ["I also led execution, directing the recordings and taking part in producing the talks."] },
    ],
  },
};

export default function VetSmartTV() {
  const { lang } = useLang();
  const c = lang === "pt" ? pt : en;

  return (
    <div className="min-h-screen bg-[#F2F2F2]" style={{ color: "#222" }}>
      <Nav />

      <div className="px-6 md:px-10 mx-auto" style={{ maxWidth: 1440, paddingTop: 32 }}>

        {/* Hero image */}
        <div className="mb-8 md:mb-[100px]">
          <Img src="/vet-smart-tv/01.png" alt="Vet Smart TV" />
        </div>

        {/* Intro */}
        <TwoCol heading={c.intro.heading}>
          <Blocks blocks={c.intro.blocks} />
        </TwoCol>

        <Divider />

        {/* Onde identificamos */}
        <TwoCol heading={c.opportunity.heading}>
          <Blocks blocks={c.opportunity.blocks} />
        </TwoCol>

        <Divider />

        {/* Como viabilizamos */}
        <TwoCol heading={c.enable.heading}>
          <Blocks blocks={c.enable.blocks} />
        </TwoCol>

        {/* Image before Solução */}
        <div className="my-8 md:my-[100px]">
          <Img src="/vet-smart-tv/02.png" alt="Vet Smart TV" />
        </div>

        {/* Solução e evoluções */}
        <TwoCol heading={c.solution.heading}>
          <Blocks blocks={c.solution.blocks} />
        </TwoCol>

        <div className="my-8 md:my-[100px]">
          <Img src="/vet-smart-tv/03.gif" alt="Vet Smart TV" />
        </div>

        {/* Resultados */}
        <TwoCol heading={c.results.heading}>
          <Blocks blocks={c.results.blocks} />
        </TwoCol>

        <Divider />

        {/* Meu papel */}
        <TwoCol heading={c.role.heading}>
          <Blocks blocks={c.role.blocks} />
        </TwoCol>

        <BottomNav prev={{ label: "Santander Workshops", href: "/santander-workshops" }} next={{ label: "Home", href: "/" }} />

      </div>
    </div>
  );
}
