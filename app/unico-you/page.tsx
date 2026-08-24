"use client";

import Carousel from "../components/Carousel";
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
  context: Section;
  opportunity: Section;
  thesis: Section;
  mvp: Section;
  results: Section;
  evolution: Section;
};

const pt: Content = {
  context: {
    heading: "Contexto",
    blocks: [
      { p: ["Liderei a criação do Unico You, ", { h: "primeiro produto B2C da Unico", d: 0.2 }, ", empresa especializada em identidade digital e soluções para RH, que se tornou ", { h: "unicórnio em 2021.", d: 0.4 }] },
      { p: ["O produto foi criado para expandir a atuação da empresa para a ", { h: "relação direta com colaboradores", d: 0.2 }, ", explorando novos serviços dentro do ecossistema já existente da companhia."] },
    ],
  },
  opportunity: {
    heading: "Oportunidade",
    blocks: [
      { p: ["Durante o discovery, conduzimos uma série de pesquisas e análises para entender quais problemas dentro da relação entre empresas e colaboradores poderiam ", { h: "gerar valor real como uma nova frente de produto.", d: 0.2 }] },
      { p: ["Mapeamos diferentes oportunidades relacionadas a benefícios, serviços financeiros e rotina do colaborador. Entre elas, um dos pontos de dor mais recorrentes estava relacionado à ", { h: "pressão financeira cotidiana", d: 0.4 }, " e seu ", { h: "impacto direto na rotina de trabalho.", d: 0.6 }] },
    ],
  },
  thesis: {
    heading: "Tese de produto",
    blocks: [
      { p: ["A partir desse contexto, definimos como foco inicial do produto a possibilidade de colaboradores ", { h: "recebessem pelos dias já trabalhados antes da data tradicional de pagamento.", d: 0.2 }] },
      { p: ["Além do impacto direto na rotina financeira dos usuários, a decisão também estava alinhada à necessidade de construir um produto com ", { h: "alto potencial de recorrência e frequência de uso.", d: 0.4 }] },
      { p: ["A proposta buscava transformar uma lógica rígida de pagamento mensal em uma experiência mais flexível, permitindo ", { h: "acesso imediato ao valor disponível", d: 0.6 }, " diretamente pelo aplicativo e ", { h: "sem custo para o colaborador.", d: 0.8 }] },
      { p: [{ h: "A tese do produto era simples", d: 1.0 }, ": ", { h: "\"trabalhei hoje, recebo hoje\".", d: 1.2 }] },
    ],
  },
  mvp: {
    heading: "Construção do MVP",
    blocks: [
      { p: ["Durante a construção do MVP, um dos principais desafios identificados estava relacionado à percepção de ", { h: "segurança e confiança dos usuários", d: 0.2 }, " em relação ao ", { h: "compartilhamento de dados e acesso financeiro.", d: 0.4 }] },
      { p: ["A partir dos testes iniciais e validações com usuários, refinamos o fluxo de cadastro e onboarding, incorporando etapas de validação e reforçando elementos relacionados à segurança da experiência."] },
      { p: ["O MVP inicial, lançado sob o nome DiaCinco, passou por ", { h: "diferentes ciclos de evolução e refinamento", d: 0.6 }, " até chegar à versão final do Unico You."] },
      { p: ["O produto foi desenvolvido em parceria com a Creditas, responsável por ", { h: "viabilizar a operação financeira da solução.", d: 0.8 }] },
    ],
  },
  results: {
    heading: "Resultados",
    blocks: [
      { p: ["O lançamento do MVP validou tanto a aderência da proposta quanto o potencial de recorrência do produto."] },
      { ul: [[{ h: "55% de conversão no fluxo de cadastro", d: 0.2 }], [{ h: "45,7% de usuários ativos mensais", d: 0.4 }], [{ h: "Média de 5,5 sessões por usuário ao mês", d: 0.6 }]], liPad: 8 },
      { p: ["Os resultados reforçaram a ", { h: "frequência de uso e a relevância da proposta", d: 0.8 }, " dentro da rotina dos colaboradores."] },
    ],
  },
  evolution: {
    heading: "Evolução do produto",
    blocks: [
      { p: ["A partir da validação do MVP, o produto continuou evoluindo com ", { h: "novas funcionalidades e serviços incorporados à plataforma.", d: 0.2 }] },
    ],
  },
};

const en: Content = {
  context: {
    heading: "Context",
    blocks: [
      { p: ["I led the creation of Unico You, ", { h: "Unico's first B2C product", d: 0.2 }, " — a company specialized in digital identity and HR solutions that became a ", { h: "unicorn in 2021.", d: 0.4 }] },
      { p: ["The product was created to expand the company into a ", { h: "direct relationship with employees", d: 0.2 }, ", exploring new services within its existing ecosystem."] },
    ],
  },
  opportunity: {
    heading: "Opportunity",
    blocks: [
      { p: ["During discovery, we ran a series of studies and analyses to understand which problems in the relationship between companies and employees could ", { h: "create real value as a new product line.", d: 0.2 }] },
      { p: ["We mapped several opportunities around benefits, financial services and the employee's routine. Among them, one of the most recurring pain points was ", { h: "everyday financial pressure", d: 0.4 }, " and its ", { h: "direct impact on the workday.", d: 0.6 }] },
    ],
  },
  thesis: {
    heading: "Product thesis",
    blocks: [
      { p: ["From that context, we set the product's initial focus on letting employees ", { h: "get paid for days already worked, before the traditional payday.", d: 0.2 }] },
      { p: ["Beyond the direct impact on users' financial routine, the decision also aligned with the need to build a product with ", { h: "high potential for recurring, frequent use.", d: 0.4 }] },
      { p: ["The idea was to turn a rigid monthly-payment logic into a more flexible experience, allowing ", { h: "immediate access to the available amount", d: 0.6 }, " right from the app and ", { h: "at no cost to the employee.", d: 0.8 }] },
      { p: [{ h: "The product thesis was simple", d: 1.0 }, ": ", { h: "\"worked today, paid today\".", d: 1.2 }] },
    ],
  },
  mvp: {
    heading: "Building the MVP",
    blocks: [
      { p: ["While building the MVP, one of the main challenges was users' perception of ", { h: "safety and trust", d: 0.2 }, " around ", { h: "data sharing and financial access.", d: 0.4 }] },
      { p: ["Based on early tests and user validation, we refined the sign-up and onboarding flow, adding validation steps and reinforcing elements tied to the safety of the experience."] },
      { p: ["The initial MVP, launched under the name DiaCinco, went through ", { h: "several cycles of evolution and refinement", d: 0.6 }, " before reaching the final Unico You."] },
      { p: ["The product was developed in partnership with Creditas, responsible for ", { h: "enabling the financial operation behind the solution.", d: 0.8 }] },
    ],
  },
  results: {
    heading: "Results",
    blocks: [
      { p: ["The MVP launch validated both the appeal of the idea and the product's recurring-use potential."] },
      { ul: [[{ h: "55% conversion in the sign-up flow", d: 0.2 }], [{ h: "45.7% monthly active users", d: 0.4 }], [{ h: "an average of 5.5 sessions per user per month", d: 0.6 }]], liPad: 8 },
      { p: ["The results reinforced the ", { h: "frequency of use and the relevance of the idea", d: 0.8 }, " within employees' routines."] },
    ],
  },
  evolution: {
    heading: "Product evolution",
    blocks: [
      { p: ["After validating the MVP, the product kept evolving with ", { h: "new features and services added to the platform.", d: 0.2 }] },
    ],
  },
};

export default function UnicoYou() {
  const { lang } = useLang();
  const c = lang === "pt" ? pt : en;

  return (
    <div className="min-h-screen bg-[#F2F2F2]" style={{ color: "#222" }}>
      <Nav />

      <div className="px-6 md:px-10 mx-auto" style={{ maxWidth: 1440, paddingTop: 32 }}>

        {/* Hero image */}
        <div className="mb-8 md:mb-[100px]">
          <div className="md:hidden"><Img src="/unico-you/01-mobile.png" alt="Unico You" /></div>
          <div className="hidden md:block"><Img src="/unico-you/01.png" alt="Unico You" /></div>
        </div>

        {/* Contexto */}
        <TwoCol heading={c.context.heading}>
          <Blocks blocks={c.context.blocks} />
        </TwoCol>

        {/* Images after Contexto */}
        <div className="my-8 md:my-[100px]" style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <div className="md:hidden"><Img src="/unico-you/02-mobile.png" alt="Unico You" /></div>
          <div className="hidden md:block"><Img src="/unico-you/02.png" alt="Unico You" /></div>
          <div className="md:hidden"><Img src="/unico-you/03-mobile.png" alt="Unico You" /></div>
          <div className="hidden md:block"><Img src="/unico-you/03.png" alt="Unico You" /></div>
        </div>

        {/* Oportunidade */}
        <TwoCol heading={c.opportunity.heading}>
          <Blocks blocks={c.opportunity.blocks} />
        </TwoCol>

        <Divider />

        {/* Tese de produto */}
        <TwoCol heading={c.thesis.heading}>
          <Blocks blocks={c.thesis.blocks} />
        </TwoCol>

        <Divider />

        {/* Construção do MVP */}
        <TwoCol heading={c.mvp.heading}>
          <Blocks blocks={c.mvp.blocks} />
        </TwoCol>

        {/* Final images */}
        <div className="my-8 md:my-[100px]" style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <div className="md:hidden">
            <Carousel images={["/unico-you/04-mobile-a.png", "/unico-you/04-mobile-b.png", "/unico-you/04-mobile-c.png"]} />
          </div>
          <div className="hidden md:block"><Img src="/unico-you/04.png" alt="Unico You" /></div>
          <div className="md:hidden">
            <Carousel images={["/unico-you/05-mobile-1.png", "/unico-you/05-mobile-2.png", "/unico-you/05-mobile-3.png", "/unico-you/05-mobile-4.png", "/unico-you/05-mobile-5.png"]} />
          </div>
          <div className="hidden md:block"><Img src="/unico-you/05.png" alt="Unico You" /></div>
          <div className="md:hidden">
            <Carousel images={["/unico-you/06-mobile-a.png", "/unico-you/06-mobile-b.png", "/unico-you/06-mobile-c.png", "/unico-you/06-mobile-d.png"]} />
          </div>
          <div className="hidden md:block"><Img src="/unico-you/06.png" alt="Unico You" /></div>
        </div>

        {/* Resultados */}
        <TwoCol heading={c.results.heading}>
          <Blocks blocks={c.results.blocks} />
        </TwoCol>

        {/* Images after Resultados */}
        <div className="my-8 md:my-[100px]" style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <div className="md:hidden">
            <Carousel images={["/unico-you/07-mobile-1.png", "/unico-you/07-mobile-2.png", "/unico-you/07-mobile-3.png"]} />
          </div>
          <div className="hidden md:block"><Img src="/unico-you/07.png" alt="Unico You" /></div>
          <div className="md:hidden">
            <Carousel images={["/unico-you/08-mobile-1.png", "/unico-you/08-mobile-2.png", "/unico-you/08-mobile-3.png"]} />
          </div>
          <div className="hidden md:block"><Img src="/unico-you/08.png" alt="Unico You" /></div>
        </div>

        {/* Evolução do produto */}
        <TwoCol heading={c.evolution.heading}>
          <Blocks blocks={c.evolution.blocks} />
        </TwoCol>

        {/* Final 3 images */}
        <div className="my-8 md:my-[100px]" style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <div className="md:hidden"><Img src="/unico-you/09-mobile.png" alt="Unico You" /></div>
          <div className="hidden md:block"><Img src="/unico-you/09.png" alt="Unico You" /></div>
          <div className="md:hidden"><Img src="/unico-you/10-mobile.png" alt="Unico You" /></div>
          <div className="hidden md:block"><Img src="/unico-you/10.png" alt="Unico You" /></div>
          <div className="md:hidden"><Img src="/unico-you/11-mobile.png" alt="Unico You" /></div>
          <div className="hidden md:block"><Img src="/unico-you/11.png" alt="Unico You" /></div>
        </div>

        <BottomNav prev={{ label: "Vet Smart", href: "/vet-smart" }} next={{ label: "Santander Design System", href: "/santander-design-system" }} />

      </div>
    </div>
  );
}
