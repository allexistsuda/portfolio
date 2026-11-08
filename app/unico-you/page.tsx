"use client";

import Carousel from "../components/Carousel";
import VideoNaTela from "../components/VideoNaTela";
import BottomNav, { Folha } from "../components/BottomNav";
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
    <div>
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

function Divider() {
  return <div className="my-8 md:my-[100px]" style={{ height: 1, background: "rgba(34,34,34,0.15)" }} />;
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
  problem: Section;
  thesis: Section;
  mvp: Section;
  results: Section;
  closing: Section;
};

const pt: Content = {
  context: {
    heading: "Liderei a criação do Unico You, primeiro produto B2C da Unico, empresa especializada em identidade digital e soluções para RH",
    blocks: [
      { p: ["A Unico tinha ", { h: "três produtos principais", d: 0.2 }, ", todos vendidos para empresas. O People era uma ferramenta de onboarding usada pelo RH. O ID fazia verificação de identidade por biometria, usada por bancos e varejo. O Sign era assinatura digital de documentos."] },
      { p: ["Em todos eles, a Unico ficava entre a empresa e o colaborador, mas nunca falava com ele diretamente. O Unico You seria o ", { h: "primeiro produto voltado ao colaborador", d: 0.4 }, ", uma nova frente que abriria oportunidades de negócio dentro do mesmo mercado."] },
    ],
  },
  opportunity: {
    heading: "Mostrar documentos e assinaturas num app não sustentava um produto",
    blocks: [
      { p: ["Era possível reunir tudo isso para o colaborador. Mas nada ali era forte o suficiente para abrir essas oportunidades. Precisávamos de algo que ", { h: "resolvesse um problema de verdade.", d: 0.2 }] },
    ],
  },
  problem: {
    heading: "Na pesquisa, o problema que mais pesava era o salário chegar depois das contas",
    blocks: [
      { p: ["Fizemos pesquisas e entrevistas com colaboradores e empresas. O colaborador já tinha trabalhado metade do mês, mas ", { h: "o salário só chegava no fim.", d: 0.2 }] },
      { p: ["Até lá, ele se virava como dava. Entrava no cheque especial, deixava a fatura do cartão rodar, pegava um crédito pessoal caro ou pedia emprestado pra família, que muitas vezes estava na mesma situação. Tudo isso para ", { h: "cobrir contas até o dia do pagamento.", d: 0.4 }] },
    ],
  },
  thesis: {
    heading: "Chegamos numa tese simples: trabalhei hoje, recebo hoje",
    blocks: [
      { p: ["O colaborador recebe pelos dias já trabalhados, antes da data de pagamento, direto pelo app e sem custo. ", { h: "Não é empréstimo. É o salário dele chegando antes.", d: 0.2 }] },
      { p: ["Na tela, virou uma barra de progresso. O saldo cresce a cada dia trabalhado, e ele vê ", { h: "16 de 22 dias", d: 0.4 }, " antes de decidir se antecipa."] },
    ],
  },
  mvp: {
    heading: "Construímos o MVP em cima do que a Unico já tinha",
    blocks: [
      { p: ["A Unico não tinha operação financeira, então trouxemos a Creditas como parceira para fazer a antecipação. O que a Unico tinha era o resto: a identidade do colaborador vinha do ID, e o vínculo com a empresa, dos documentos validados no People. Com isso, a Creditas conseguia operar de forma segura, ", { h: "sem pedir nada de novo ao colaborador.", d: 0.2 }] },
      { p: [{ h: "Essa mesma base aparecia no app.", d: 0.4 }, " O colaborador tinha acesso aos próprios documentos, acompanhava onde a identidade dele tinha sido verificada e assinava o holerite pelo app."] },
    ],
  },
  results: {
    heading: "O MVP mostrou que o colaborador entrava e voltava",
    blocks: [
      { ul: [[{ h: "55% de conversão no cadastro", d: 0.2 }], [{ h: "45,7% de usuários ativos mensais", d: 0.4 }], [{ h: "5,5 sessões por usuário ao mês", d: 0.6 }]], liPad: 8, mt: 0 },
    ],
  },
  closing: {
    heading: "A tese funcionou e abriu caminho para novos produtos",
    blocks: [
      { p: ["Com o colaborador voltando ao app várias vezes por mês, abrimos espaço para outros serviços, como crédito consignado, e ", { h: "expandimos as frentes de negócio da Unico.", d: 0.2 }] },
    ],
  },
};

const en: Content = {
  context: {
    heading: "I led the creation of Unico You, the first B2C product from Unico, a company specializing in digital identity and HR solutions",
    blocks: [
      { p: ["Unico had ", { h: "three main products", d: 0.2 }, ", all sold to companies. People was an onboarding tool used by HR. ID verified identity through biometrics, used by banks and retail. Sign handled digital document signing."] },
      { p: ["In all of them, Unico sat between the company and the employee, but never spoke to the employee directly. Unico You would be the ", { h: "first product aimed at the employee", d: 0.4 }, ", a new front that would open business opportunities within the same market."] },
    ],
  },
  opportunity: {
    heading: "Showing documents and signatures in an app wasn't enough to sustain a product",
    blocks: [
      { p: ["All of this could be brought together for the employee. But nothing there was strong enough to open up those opportunities. We needed something that ", { h: "solved a real problem.", d: 0.2 }] },
    ],
  },
  problem: {
    heading: "In our research, the problem that weighed most was the paycheck arriving after the bills",
    blocks: [
      { p: ["We ran research and interviews with employees and companies. Employees had already worked half the month, but ", { h: "their salary only arrived at the end.", d: 0.2 }] },
      { p: ["Until then, they got by however they could. They dipped into their overdraft, let their credit card bill roll over, took out expensive personal loans or borrowed from family, who were often in the same situation. All of it to ", { h: "cover bills until payday.", d: 0.4 }] },
    ],
  },
  thesis: {
    heading: "We landed on a simple thesis: worked today, paid today",
    blocks: [
      { p: ["Employees get paid for the days they've already worked, before payday, right in the app and at no cost. ", { h: "It isn't a loan. It's their own salary arriving earlier.", d: 0.2 }] },
      { p: ["On screen, it became a progress bar. The balance grows with each day worked, and they see ", { h: "16 of 22 days", d: 0.4 }, " before deciding whether to get paid early."] },
    ],
  },
  mvp: {
    heading: "We built the MVP on top of what Unico already had",
    blocks: [
      { p: ["Unico had no financial operation, so we brought in Creditas as a partner to handle the early payment. What Unico had was everything else: the employee's identity came from ID, and the link to the company came from the documents validated in People. With that, Creditas could operate securely, ", { h: "without asking the employee for anything new.", d: 0.2 }] },
      { p: [{ h: "That same foundation showed up in the app.", d: 0.4 }, " Employees had access to their own documents, could track where their identity had been verified and signed their payslip through the app."] },
    ],
  },
  results: {
    heading: "The MVP showed that employees came in and came back",
    blocks: [
      { ul: [[{ h: "55% conversion in sign-up", d: 0.2 }], [{ h: "45.7% monthly active users", d: 0.4 }], [{ h: "5.5 sessions per user per month", d: 0.6 }]], liPad: 8, mt: 0 },
    ],
  },
  closing: {
    heading: "The thesis worked and opened the way for new products",
    blocks: [
      { p: ["With employees returning to the app several times a month, we made room for other services, such as payroll loans, and ", { h: "expanded Unico's lines of business.", d: 0.2 }] },
    ],
  },
};

export default function UnicoYou() {
  const { lang } = useLang();
  const c = lang === "pt" ? pt : en;

  return (
    <div className="min-h-screen bg-[#F2F2F2]" style={{ color: "#222" }}>
      <Folha>
      <Nav />

      <div className="px-6 md:px-10 mx-auto" style={{ maxWidth: 1440, paddingTop: 32 }}>

        {/* Hero image */}
        <div className="mb-8 md:mb-[100px]">
          <div className="md:hidden"><Img src="/unico-you/01-mobile.png" alt="Unico You" /></div>
          <div className="hidden md:block"><Img src="/unico-you/01.png" alt="Unico You" /></div>
        </div>

        {/* Contexto */}
        <TwoCol heading={c.context.heading}>
          <Blocks cascata blocks={c.context.blocks} />
        </TwoCol>

        {/* Images after Contexto */}
        <div className="my-8 md:my-[100px]" style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {/* o logo desenhado (a grade de construção), o logo pronto, o ícone aplicado e o splash */}
          <div className="md:hidden"><Img src="/unico-you/03-mobile.png" alt="Construção do logo da Unico" /></div>
          <div className="hidden md:block"><Img src="/unico-you/03.png" alt="Construção do logo da Unico" /></div>
          <div className="md:hidden"><Img src="/unico-you/02-mobile.png" alt="Logo da Unico" /></div>
          <div className="hidden md:block"><Img src="/unico-you/02.png" alt="Logo da Unico" /></div>
          {/* O ícone aplicado na tela inicial do iPhone */}
          <div className="md:hidden"><Img src="/unico-you/09-mobile.png" alt="Unico You" /></div>
          <div className="hidden md:block"><Img src="/unico-you/09.png" alt="Unico You" /></div>
          {/* A tela de entrada (Frame 8 no Figma), com o fundo passando pelos gradientes dos ícones; a peça é
              public/entrada-motion.html, gravada em 2688x1770. No celular, recortado no aparelho, com folga pra sombra. */}
          <div className="md:hidden">
            <VideoNaTela src="/unico-you/entrada-motion.mp4" estatico="/unico-you/entrada-poster.jpg" alt="Unico You — tela de entrada" repetir
              recorte={{ x: 960, y: 138, w: 800, h: 1562, sw: 2688, sh: 1770 }} />
          </div>
          <div className="hidden md:block">
            <VideoNaTela src="/unico-you/entrada-motion.mp4" estatico="/unico-you/entrada-poster.jpg" alt="Unico You — tela de entrada" repetir />
          </div>
        </div>

        {/* Documentos e assinaturas não bastavam */}
        <TwoCol heading={c.opportunity.heading}>
          <Blocks cascata blocks={c.opportunity.blocks} />
        </TwoCol>

        <Divider />

        {/* O salário depois das contas */}
        <TwoCol heading={c.problem.heading}>
          <Blocks cascata blocks={c.problem.blocks} />
        </TwoCol>

        <Divider />

        {/* A tese */}
        <TwoCol heading={c.thesis.heading}>
          <Blocks cascata blocks={c.thesis.blocks} />
        </TwoCol>

        {/* Na tela: a antecipação */}
        <div className="my-8 md:my-[100px]" style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {/* O fluxo de antecipação da revisita (a peça é desenhada em public/antecipar-motion.html),
              gravado a 1,4x (2688x1512) pra ficar nítido em tela retina. No celular, o mesmo vídeo recortado
              em volta do aparelho, com folga pra sombra (que sai pra direita e pra baixo) não ser cortada.
              A versão ao vivo em HTML está em ./AnteciparMotion. */}
          <div className="md:hidden">
            <VideoNaTela src="/unico-you/antecipar-motion-v2.mp4" estatico="/unico-you/antecipar-poster.jpg" alt="Unico You — antecipação" repetir
              recorte={{ x: 924, y: 70, w: 896, h: 1442, sw: 2688, sh: 1512 }} />
          </div>
          <div className="hidden md:block">
            <VideoNaTela src="/unico-you/antecipar-motion-v2.mp4" estatico="/unico-you/antecipar-poster.jpg" alt="Unico You — antecipação" repetir />
          </div>
        </div>

        {/* O MVP */}
        <TwoCol heading={c.mvp.heading}>
          <Blocks cascata blocks={c.mvp.blocks} />
        </TwoCol>

        {/* Final images */}
        <div className="my-8 md:my-[100px]" style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {/* Início, Documentos e RG (Frame 4 no Figma), com o primeiro aparelho rolando a Início até o fim e
              voltando; a peça é public/inicio-motion.html, gravada em 2688x1770. No celular, recortado no aparelho
              que anda, com folga pra sombra. */}
          <div className="md:hidden">
            <VideoNaTela src="/unico-you/inicio-motion.mp4" estatico="/unico-you/inicio-poster.jpg" alt="Unico You — Início" repetir
              recorte={{ x: 131, y: 138, w: 800, h: 1562, sw: 2688, sh: 1770 }} />
          </div>
          <div className="hidden md:block">
            <VideoNaTela src="/unico-you/inicio-motion.mp4" estatico="/unico-you/inicio-poster.jpg" alt="Unico You — Início, Documentos e RG" repetir />
          </div>
          {/* Documentos da empresa, o holerite aberto e a Atividade (Frame 7 no Figma) */}
          <div className="md:hidden">
            <Carousel images={["/unico-you/documentos-holerite-atividade-mobile-a.png", "/unico-you/documentos-holerite-atividade-mobile-b.png", "/unico-you/documentos-holerite-atividade-mobile-c.png"]} />
          </div>
          <div className="hidden md:block"><Img src="/unico-you/documentos-holerite-atividade.png" alt="Unico You — Documentos da empresa, holerite e Atividade" /></div>
          {/* 04, 05 e 06 fora por enquanto, pra ver o case só com os dois vídeos
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
          */}
        </div>

        {/* Resultados */}
        <TwoCol heading={c.results.heading}>
          <Blocks cascata blocks={c.results.blocks} />
        </TwoCol>

        <Divider />

        {/* Fechamento */}
        <TwoCol heading={c.closing.heading}>
          <Blocks cascata blocks={c.closing.blocks} />
        </TwoCol>

      </div>
      </Folha>

      <BottomNav prev={{ label: "Vet Smart", href: "/vet-smart" }} next={{ label: "Santander Design System", href: "/santander-design-system" }} />
    </div>
  );
}
