import Link from "next/link";
import Nav from "../components/Nav";
import BottomNav from "../components/BottomNav";
import HighlightText from "../components/HighlightText";

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

export default function VetSmartTV() {
  return (
    <div className="min-h-screen bg-[#F2F2F2]" style={{ color: "#222" }}>
      <Nav />

      <div className="px-6 md:px-10 mx-auto" style={{ maxWidth: 1440, paddingTop: 32 }}>

        {/* Hero image */}
        <div className="mb-8 md:mb-[100px]">
          <Img src="/vet-smart-tv/01.png" alt="Vet Smart TV" />
        </div>

        {/* Intro */}
        <TwoCol heading="Criamos um novo produto que expandiu o Vet Smart além da consulta, consolidando como plataforma de educação">
          <p>
            O Vet Smart já tinha uma <HighlightText delay={0.2}>base muito forte no aplicativo</HighlightText>, com uso concentrado no momento
            da consulta.
          </p>
          <p style={{ marginTop: 32 }}>
            Isso trazia um limite claro: o produto era extremamente útil, mas <HighlightText delay={0.4}>restrito a esse
            contexto.</HighlightText>
          </p>
          <p style={{ marginTop: 32 }}>
            <HighlightText delay={0.6}>Mais de 90% dos acessos eram para consulta de medicamentos</HighlightText>, com um fluxo e navegação já
            bem definidos. <HighlightText delay={0.8}>Qualquer tentativa de colocar outras coisas ali poderia atrapalhar esse
            uso.</HighlightText>
          </p>
        </TwoCol>

        <Divider />

        {/* Onde identificamos */}
        <TwoCol heading="Onde identificamos uma nova oportunidade">
          <p>
            Após diversas pesquisas, conversas com veterinários e com a indústria, e análise de
            mercado, vimos que <HighlightText delay={0.2}>atualização profissional ainda dependia de cursos e eventos
            presenciais</HighlightText>, com datas específicas e custo elevado.
          </p>
          <p style={{ marginTop: 32 }}>
            <HighlightText delay={0.4}>Muitos veterinários não conseguiam pagar por esses cursos</HighlightText> e conteúdos de atualização.
          </p>
          <p style={{ marginTop: 32 }}>
            Na época, <HighlightText delay={0.6}>não existia nenhum conteúdo digital voltado para isso.</HighlightText>
          </p>
          <p style={{ marginTop: 32 }}>
            A partir disso, <HighlightText delay={0.8}>decidimos criar um novo produto para atender essa demanda.</HighlightText>
          </p>
        </TwoCol>

        <Divider />

        {/* Como viabilizamos */}
        <TwoCol heading="Como viabilizamos">
          <p>
            <HighlightText delay={0.2}>Viabilizar esse produto era o maior desafio.</HighlightText>
          </p>
          <p style={{ marginTop: 32 }}>
            Além da incerteza de engajamento do novo produto, era necessário estruturar um modelo
            que funcionasse de ponta a ponta.
          </p>
          <p style={{ marginTop: 32 }}>Definimos algumas premissas:</p>
          <ul style={{ marginTop: 16, listStyle: "disc", paddingLeft: "1.2em" }}>
            <li style={{ paddingBottom: 8 }}><HighlightText delay={0.4}>assumir a produção completa do conteúdo</HighlightText>, garantindo controle de qualidade</li>
            <li style={{ paddingBottom: 8 }}><HighlightText delay={0.6}>contato direto com palestrantes</HighlightText>, escolhendo os principais nomes de cada tema</li>
            <li style={{ paddingBottom: 8 }}>organização dos temas, priorizando o que geraria mais interesse para os veterinários</li>
            <li style={{ paddingBottom: 8 }}>execução das transmissões, garantindo consistência na entrega</li>
          </ul>
          <p style={{ marginTop: 32 }}>
            <HighlightText delay={0.8}>A indústria entrava como patrocinadora, viabilizando o modelo.</HighlightText>
          </p>
        </TwoCol>

        {/* Image before Solução */}
        <div className="my-8 md:my-[100px]">
          <Img src="/vet-smart-tv/02.png" alt="Vet Smart TV" />
        </div>

        {/* Solução e evoluções */}
        <TwoCol heading="Solução e evoluções">
          <p><HighlightText delay={0.2}>Criamos o Vet Smart TV</HighlightText>, nossa plataforma de palestras.</p>
          <p style={{ marginTop: 32 }}>
            O formato foi evoluindo com o tempo, a partir do uso e do comportamento dos usuários.
          </p>
          <p style={{ marginTop: 32 }}>Com base nisso, incorporamos alguns elementos:</p>
          <ul style={{ marginTop: 16, listStyle: "disc", paddingLeft: "1.2em" }}>
            <li style={{ paddingBottom: 8 }}><HighlightText delay={0.4}>ao vivo, para permitir interação e dúvidas sendo respondidas na hora</HighlightText></li>
            <li style={{ paddingBottom: 8 }}><HighlightText delay={0.6}>gratuitas, resolvendo o problema de custo e acesso</HighlightText></li>
            <li style={{ paddingBottom: 8 }}>votações, para manter engajamento durante a palestra</li>
            <li style={{ paddingBottom: 8 }}>sorteios de brindes</li>
            <li style={{ paddingBottom: 8 }}><HighlightText delay={0.8}>certificados, válidos como horas complementares na faculdade</HighlightText></li>
          </ul>
          <p style={{ marginTop: 32 }}>
            <HighlightText delay={1.0}>O certificado se mostrou um ponto importante</HighlightText>, principalmente para estudantes, que
            passaram a usar como horas complementares.
          </p>
        </TwoCol>

        <div className="my-8 md:my-[100px]">
          <Img src="/vet-smart-tv/03.gif" alt="Vet Smart TV" />
        </div>

        {/* Resultados */}
        <TwoCol heading="Resultados">
          <ul style={{ listStyle: "disc", paddingLeft: "1.2em" }}>
            <li style={{ paddingBottom: 8 }}>as palestras foram um sucesso</li>
            <li style={{ paddingBottom: 8 }}><HighlightText delay={0.2}>picos de 7.500 pessoas assistindo ao vivo</HighlightText></li>
            <li style={{ paddingBottom: 8 }}><HighlightText delay={0.4}>expansão de 1 para 2 palestras por semana</HighlightText></li>
            <li style={{ paddingBottom: 8 }}><HighlightText delay={0.6}>programação definida com antecedência para todo o ano</HighlightText></li>
          </ul>
        </TwoCol>

        <Divider />

        {/* Meu papel */}
        <TwoCol heading="Meu papel">
          <p>
            Atuei desde o início na definição do produto, estruturando o modelo e a proposta.
          </p>
          <p style={{ marginTop: 32 }}>
            Conduzi a criação do formato, as decisões de experiência e a evolução do produto ao
            longo do tempo.
          </p>
          <p style={{ marginTop: 32 }}>
            Também liderei a execução, dirigindo as gravações e participando da produção das
            palestras.
          </p>
        </TwoCol>

        <BottomNav prev={{ label: "Santander Workshops", href: "/santander-workshops" }} next={{ label: "Home", href: "/" }} />

      </div>
    </div>
  );
}
