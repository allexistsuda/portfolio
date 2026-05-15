import Link from "next/link";
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
          <Img src="/unico-you/01.png" alt="Unico You" />
        </div>

        {/* Contexto */}
        <TwoCol heading="Contexto">
          <p>
            Liderei a criação do Unico You, <HighlightText>primeiro produto B2C da Unico</HighlightText>, empresa especializada em
            identidade digital e soluções para RH, que <HighlightText>se tornou unicórnio em 2021.</HighlightText>
          </p>
          <p style={{ marginTop: 32 }}>
            O produto foi criado para expandir a atuação da empresa para a relação direta com
            colaboradores, explorando novos serviços dentro do ecossistema já existente da companhia.
          </p>
        </TwoCol>

        {/* Images after Contexto */}
        <div className="my-8 md:my-[100px]" style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <Img src="/unico-you/02.png" alt="Unico You" />
          <Img src="/unico-you/03.png" alt="Unico You" />
        </div>

        {/* Oportunidade */}
        <TwoCol heading="Oportunidade">
          <p>
            Durante o discovery, conduzimos uma série de pesquisas e análises para entender quais
            problemas dentro da relação entre empresas e colaboradores poderiam gerar valor real como
            uma nova frente de produto.
          </p>
          <p style={{ marginTop: 32 }}>
            Mapeamos diferentes oportunidades relacionadas a benefícios, serviços financeiros e
            rotina do colaborador. Entre elas, <HighlightText>um dos pontos de dor mais recorrentes estava
            relacionado à pressão financeira cotidiana e seu impacto direto na rotina de trabalho.</HighlightText>
          </p>
        </TwoCol>

        <Divider />

        {/* Tese de produto */}
        <TwoCol heading="Tese de produto">
          <p>
            A partir desse contexto, definimos como foco inicial do produto a possibilidade de{" "}
            <HighlightText>permitir que colaboradores recebessem pelos dias já trabalhados antes da data tradicional
            de pagamento.</HighlightText>
          </p>
          <p style={{ marginTop: 32 }}>
            Além do impacto direto na rotina financeira dos usuários, a decisão também estava
            alinhada à necessidade de <HighlightText>construir um produto com alto potencial de recorrência e
            frequência de uso.</HighlightText>
          </p>
          <p style={{ marginTop: 32 }}>
            A proposta buscava transformar uma lógica rígida de pagamento mensal em uma experiência
            mais flexível, permitindo acesso imediato ao valor disponível diretamente pelo aplicativo
            e <HighlightText>sem custo para o colaborador.</HighlightText>
          </p>
          <p style={{ marginTop: 32 }}>
            A tese do produto era simples: <HighlightText>"trabalhei hoje, recebo hoje".</HighlightText>
          </p>
        </TwoCol>

        <Divider />

        {/* Construção do MVP */}
        <TwoCol heading="Construção do MVP">
          <p>
            Durante a construção do MVP, um dos principais desafios identificados estava relacionado
            à percepção de <HighlightText>segurança e confiança dos usuários em relação ao compartilhamento de
            dados e acesso financeiro.</HighlightText>
          </p>
          <p style={{ marginTop: 32 }}>
            A partir dos testes iniciais e validações com usuários, refinamos o fluxo de cadastro e
            onboarding, incorporando etapas de validação e reforçando elementos relacionados à
            segurança da experiência.
          </p>
          <p style={{ marginTop: 32 }}>
            O MVP inicial, lançado sob o nome DiaCinco, passou por diferentes ciclos de evolução e
            refinamento até chegar à versão final do Unico You.
          </p>
          <p style={{ marginTop: 32 }}>
            O produto foi desenvolvido em parceria com a <HighlightText>Creditas, responsável por viabilizar a
            operação financeira da solução.</HighlightText>
          </p>
        </TwoCol>

        {/* Final images */}
        <div className="my-8 md:my-[100px]" style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <Img src="/unico-you/04.png" alt="Unico You" />
          <Img src="/unico-you/05.png" alt="Unico You" />
          <Img src="/unico-you/06.png" alt="Unico You" />
        </div>

        {/* Resultados */}
        <TwoCol heading="Resultados">
          <p>
            O lançamento do <HighlightText>MVP validou tanto a aderência da proposta quanto o potencial de
            recorrência do produto.</HighlightText>
          </p>
          <ul style={{ marginTop: 32, listStyle: "disc", paddingLeft: "1.2em" }}>
            <li style={{ paddingBottom: 8 }}>55% de conversão no fluxo de cadastro</li>
            <li style={{ paddingBottom: 8 }}>45,7% de usuários ativos mensais</li>
            <li style={{ paddingBottom: 8 }}>Média de 5,5 sessões por usuário ao mês</li>
          </ul>
          <p style={{ marginTop: 32 }}>
            Os resultados reforçaram a frequência de uso e a relevância da proposta dentro da rotina
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
            A partir da validação do MVP, o produto continuou evoluindo com novas funcionalidades e
            serviços incorporados à plataforma.
          </p>
        </TwoCol>

        {/* Final 3 images */}
        <div className="my-8 md:my-[100px]" style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <Img src="/unico-you/09.png" alt="Unico You" />
          <Img src="/unico-you/10.png" alt="Unico You" />
          <Img src="/unico-you/11.png" alt="Unico You" />
        </div>

        {/* Bottom navigation */}
        <div className="flex items-center justify-between my-8 md:my-[100px]">
          <Link
            href="/vet-smart"
            className="flex items-center gap-3 hover:opacity-60 transition-opacity duration-200"
            style={{ textDecoration: "none" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontSize: 26, fontWeight: 400, letterSpacing: "-0.13px", color: "#222" }}>
              Vet Smart
            </span>
          </Link>
          <Link
            href="/santander-design-system"
            className="flex items-center gap-3 hover:opacity-60 transition-opacity duration-200"
            style={{ textDecoration: "none" }}
          >
            <span style={{ fontSize: 26, fontWeight: 400, letterSpacing: "-0.13px", color: "#222" }}>
              Santander Design System
            </span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

      </div>
    </div>
  );
}
