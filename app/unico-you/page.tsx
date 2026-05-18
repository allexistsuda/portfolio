import Link from "next/link";
import Carousel from "../components/Carousel";
import BottomNav from "../components/BottomNav";
import Nav from "../components/Nav";
import HighlightText from "../components/HighlightText";

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

export default function UnicoYou() {
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
        <TwoCol heading="Contexto">
          <p>
            Liderei a criação do Unico You, <HighlightText delay={0.2}>primeiro produto B2C da Unico</HighlightText>, empresa especializada em
            identidade digital e soluções para RH, que se tornou <HighlightText delay={0.4}>unicórnio em 2021.</HighlightText>
          </p>
          <p style={{ marginTop: 32 }}>
            O produto foi criado para expandir a atuação da empresa para a <HighlightText delay={0.2}>relação direta com
            colaboradores</HighlightText>, explorando novos serviços dentro do ecossistema já existente da companhia.
          </p>
        </TwoCol>

        {/* Images after Contexto */}
        <div className="my-8 md:my-[100px]" style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <div className="md:hidden"><Img src="/unico-you/02-mobile.png" alt="Unico You" /></div>
          <div className="hidden md:block"><Img src="/unico-you/02.png" alt="Unico You" /></div>
          <div className="md:hidden"><Img src="/unico-you/03-mobile.png" alt="Unico You" /></div>
          <div className="hidden md:block"><Img src="/unico-you/03.png" alt="Unico You" /></div>
        </div>

        {/* Oportunidade */}
        <TwoCol heading="Oportunidade">
          <p>
            Durante o discovery, conduzimos uma série de pesquisas e análises para entender quais
            problemas dentro da relação entre empresas e colaboradores poderiam <HighlightText delay={0.2}>gerar valor real como
            uma nova frente de produto.</HighlightText>
          </p>
          <p style={{ marginTop: 32 }}>
            Mapeamos diferentes oportunidades relacionadas a benefícios, serviços financeiros e
            rotina do colaborador. Entre elas, um dos pontos de dor mais recorrentes estava
            relacionado à <HighlightText delay={0.4}>pressão financeira cotidiana</HighlightText> e seu <HighlightText delay={0.6}>impacto direto na rotina de trabalho.</HighlightText>
          </p>
        </TwoCol>

        <Divider />

        {/* Tese de produto */}
        <TwoCol heading="Tese de produto">
          <p>
            A partir desse contexto, definimos como foco inicial do produto a possibilidade de
            colaboradores <HighlightText delay={0.2}>recebessem pelos dias já trabalhados antes da data tradicional
            de pagamento.</HighlightText>
          </p>
          <p style={{ marginTop: 32 }}>
            Além do impacto direto na rotina financeira dos usuários, a decisão também estava
            alinhada à necessidade de construir um produto com <HighlightText delay={0.4}>alto potencial de recorrência e
            frequência de uso.</HighlightText>
          </p>
          <p style={{ marginTop: 32 }}>
            A proposta buscava transformar uma lógica rígida de pagamento mensal em uma experiência
            mais flexível, permitindo <HighlightText delay={0.6}>acesso imediato ao valor disponível</HighlightText> diretamente pelo aplicativo
            e <HighlightText delay={0.8}>sem custo para o colaborador.</HighlightText>
          </p>
          <p style={{ marginTop: 32 }}>
            <HighlightText delay={1.0}>A tese do produto era simples</HighlightText>: <HighlightText delay={1.2}>"trabalhei hoje, recebo hoje".</HighlightText>
          </p>
        </TwoCol>

        <Divider />

        {/* Construção do MVP */}
        <TwoCol heading="Construção do MVP">
          <p>
            Durante a construção do MVP, um dos principais desafios identificados estava relacionado
            à percepção de <HighlightText delay={0.2}>segurança e confiança dos usuários</HighlightText> em relação ao <HighlightText delay={0.4}>compartilhamento de
            dados e acesso financeiro.</HighlightText>
          </p>
          <p style={{ marginTop: 32 }}>
            A partir dos testes iniciais e validações com usuários, refinamos o fluxo de cadastro e
            onboarding, incorporando etapas de validação e reforçando elementos relacionados à
            segurança da experiência.
          </p>
          <p style={{ marginTop: 32 }}>
            O MVP inicial, lançado sob o nome DiaCinco, passou por <HighlightText delay={0.6}>diferentes ciclos de evolução e
            refinamento</HighlightText> até chegar à versão final do Unico You.
          </p>
          <p style={{ marginTop: 32 }}>
            O produto foi desenvolvido em parceria com a Creditas, responsável por <HighlightText delay={0.8}>viabilizar a
            operação financeira da solução.</HighlightText>
          </p>
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
        <TwoCol heading="Resultados">
          <p>
            O lançamento do MVP validou tanto a aderência da proposta quanto o potencial de
            recorrência do produto.
          </p>
          <ul style={{ marginTop: 32, listStyle: "disc", paddingLeft: "1.2em" }}>
            <li style={{ paddingBottom: 8 }}><HighlightText delay={0.2}>55% de conversão no fluxo de cadastro</HighlightText></li>
            <li style={{ paddingBottom: 8 }}><HighlightText delay={0.4}>45,7% de usuários ativos mensais</HighlightText></li>
            <li style={{ paddingBottom: 8 }}><HighlightText delay={0.6}>Média de 5,5 sessões por usuário ao mês</HighlightText></li>
          </ul>
          <p style={{ marginTop: 32 }}>
            Os resultados reforçaram a <HighlightText delay={0.8}>frequência de uso e a relevância da proposta</HighlightText> dentro da rotina
            dos colaboradores.
          </p>
        </TwoCol>

        {/* Images after Resultados */}
        <div className="my-8 md:my-[100px]" style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <Img src="/unico-you/07.png" alt="Unico You" />
          <Img src="/unico-you/08.png" alt="Unico You" />
        </div>

        {/* Evolução do produto */}
        <TwoCol heading="Evolução do produto">
          <p>
            A partir da validação do MVP, o produto continuou evoluindo com <HighlightText delay={0.2}>novas funcionalidades e
            serviços incorporados à plataforma.</HighlightText>
          </p>
        </TwoCol>

        {/* Final 3 images */}
        <div className="my-8 md:my-[100px]" style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <Img src="/unico-you/09.png" alt="Unico You" />
          <Img src="/unico-you/10.png" alt="Unico You" />
          <Img src="/unico-you/11.png" alt="Unico You" />
        </div>

        <BottomNav prev={{ label: "Vet Smart", href: "/vet-smart" }} next={{ label: "Santander Design System", href: "/santander-design-system" }} />

      </div>
    </div>
  );
}
