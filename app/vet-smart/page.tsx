import Link from "next/link";
import Image from "next/image";
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


function ImgBlock({ ratio }: { ratio: string }) {
  return (
    <div className="-mx-6 md:mx-0">
      <div style={{ width: "100%", aspectRatio: ratio, background: "#D0D0D0", borderRadius: 16 }} />
    </div>
  );
}

function Img({ src, alt }: { src: string; alt: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} style={{ width: "100%", height: "auto", display: "block", borderRadius: 16 }} />
  );
}

export default function VetSmart() {
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
        <TwoCol heading="Criamos um aplicativo que mudou o comportamento da consulta veterinária, reduzindo o tempo de tomada de decisão durante o atendimento">
          <p>
            O Vet Smart surgiu em um momento em que não existiam aplicativos para médicos
            veterinários. <HighlightText>Fomos os primeiros a construir um produto voltado para esse público.</HighlightText>
          </p>
          <p style={{ marginTop: 32 }}>
            Desde o início, atuei como Product Designer conduzindo pesquisas e participando da
            definição do produto, mapeando problemas e oportunidades no dia a dia de veterinários de
            pequenos animais.
          </p>
          <p style={{ marginTop: 32 }}>
            Como resultado, o Vet Smart alcançou 80 mil usuários ativos e 2,5 milhões de pageviews
            mensais, sendo posteriormente adquirido pela Petlove.
          </p>
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
        <TwoCol heading="Onde identificamos uma dor">
          <p>
            Acompanhamos diversas consultas veterinárias e observamos que, durante o atendimento, o{" "}
            <HighlightText delay={0.2}>veterinário alternava entre livros e memória para buscar informações, incluindo dosagens de medicamentos.</HighlightText>
          </p>
          <p style={{ marginTop: 32 }}>
            Esse processo não apenas consumia tempo, como também era suscetível a falhas:{" "}
            <HighlightText>a informação podia estar desatualizada e a memória não era confiável.</HighlightText>{" "}
            Isso ocorria justamente no momento mais crítico da consulta.
          </p>
        </TwoCol>

        <Divider />

        {/* Oportunidade */}
        <TwoCol heading="Oportunidade">
          <p>
            A informação já existia em algum lugar, mas não estava{" "}
            <HighlightText>acessível de forma rápida e, muitas vezes, estava desatualizada.</HighlightText>
          </p>
        </TwoCol>

        <Divider />

        {/* Solução */}
        <TwoCol heading="Solução">
          <p>
            O problema acontecia durante a consulta, então a solução precisava existir nesse mesmo
            contexto.
          </p>
          <p style={{ marginTop: 32 }}>
            Levamos essa informação para um aplicativo, disponível na mão do veterinário durante o
            atendimento.
          </p>
          <p style={{ marginTop: 32 }}>
            Começamos reorganizando o conteúdo para acesso rápido, estruturando a informação para
            ser compreendida sem necessidade de leitura completa.
          </p>
          <p style={{ marginTop: 32 }}>
            Priorizamos <HighlightText>escaneabilidade em vez de profundidade, reduzindo a quantidade de informação visível e organizando tudo em um padrão consistente.</HighlightText>
          </p>
          <p style={{ marginTop: 32 }}>
            Essa decisão veio da <HighlightText>observação de que a leitura completa não acontecia durante a consulta.</HighlightText>
          </p>
          <p style={{ marginTop: 32 }}>
            Adotamos, então, algumas premissas de estrutura para o aplicativo:
          </p>
          <ul style={{ marginTop: 16, paddingLeft: "1.2em", listStyleType: "disc" }}>
            <li>busca direta</li>
            <li>listas simples</li>
            <li>informação sempre no mesmo formato</li>
          </ul>
          <p style={{ marginTop: 32 }}>
            Com isso, o foco do veterinário passou para o acesso rápido à informação durante a
            consulta.
          </p>
        </TwoCol>

        {/* Image after Solução */}
        <div className="my-8 md:my-[100px]">
          <div className="flex flex-col md:hidden" style={{ gap: 32 }}>
            <Img src="/vet-smart/f41-mobile-a.png" alt="Vet Smart" />
            <Img src="/vet-smart/f41-mobile-b.png" alt="Vet Smart" />
            <Img src="/vet-smart/f41-mobile-c.png" alt="Vet Smart" />
          </div>
          <div className="hidden md:block"><Img src="/vet-smart/frame41.png" alt="Vet Smart" /></div>
        </div>

        {/* Evolução */}
        <TwoCol heading="Evolução">
          <p>
            Apesar de o aplicativo ser bem aceito, identificamos um problema de recorrência.
          </p>
          <p style={{ marginTop: 32 }}>
            <HighlightText>O veterinário consultava quando precisava, mas não havia um motivo constante para voltar após ter domínio sobre o produto.</HighlightText>
          </p>
          <p style={{ marginTop: 32 }}>
            Com isso, fomos observar a consulta e o uso do aplicativo na prática e vimos que{" "}
            <HighlightText>havia um cálculo recorrente de dosagem de medicamentos.</HighlightText>
          </p>
          <p style={{ marginTop: 32 }}>
            A dose dependia do peso do animal e de regras específicas de cada medicamento.{" "}
            <HighlightText>Todo esse cálculo era feito manualmente durante a consulta.</HighlightText>
          </p>
          <p style={{ marginTop: 32 }}>Isso evidenciou uma oportunidade de evolução.</p>
        </TwoCol>

        <Divider />

        {/* O cálculo dentro do fluxo */}
        <TwoCol heading="O cálculo dentro do fluxo">
          <p>
            <HighlightText>Nossa resposta foi trazer o cálculo para dentro do aplicativo, transformando esse passo manual em uma ação rápida dentro do fluxo.</HighlightText>
          </p>
          <ul style={{ marginTop: 32, paddingLeft: "1.2em", listStyleType: "disc" }}>
            <li>o veterinário informa o peso do animal</li>
            <li>cruzamos com os dados do medicamento automaticamente</li>
            <li>o cálculo da dosagem já vem pronto</li>
          </ul>
          <p style={{ marginTop: 32 }}>
            Com essa solução, o uso deixou de ser pontual e passou a ser recorrente.
          </p>
        </TwoCol>

        {/* Image before Resultado */}
        <div className="my-8 md:my-[100px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <Img src="/vet-smart/06.png" alt="Vet Smart" />
        </div>

        {/* Resultado */}
        <TwoCol heading="Resultado">
          <ul style={{ listStyle: "disc", padding: 0, margin: 0, paddingLeft: "1.2em" }}>
            {[
              "80 mil usuários ativos",
              "média de 28 acessos por usuário por mês",
              "2,5 milhões de pageviews por mês",
              "6 minutos e 40 segundos por sessão",
              "avaliação de 4,75 nas stores",
              "empresa adquirida pela Petlove",
            ].map((item, i) => (
              <li key={i} style={{ paddingBottom: 8 }}>
                {item}
              </li>
            ))}
          </ul>
        </TwoCol>

        <Divider />

        {/* Meu papel */}
        <TwoCol heading="Meu papel">
          <p>
            Atuei desde o início na definição do produto, conduzindo pesquisas e entrevistas para
            entender a rotina de atendimento de veterinários de pequenos animais.
          </p>
          <p style={{ marginTop: 32 }}>
            A partir desses aprendizados, estruturei a experiência do aplicativo, definindo a
            organização da informação, os padrões de navegação e os princípios de uso focados em
            decisão durante a consulta.
          </p>
          <p style={{ marginTop: 32 }}>
            Ao longo da evolução do produto, conduzi testes e acompanhei o uso em campo, ajustando
            fluxos e priorizando funcionalidades com base no comportamento real dos usuários.
          </p>
        </TwoCol>

        {/* Final gifs */}
        <div className="mt-8 md:mt-[100px]" style={{ marginBottom: 32 }}>
          <Img src="/vet-smart/07.gif" alt="Vet Smart color" />
        </div>
        <div style={{ marginBottom: 100 }}>
          <Img src="/vet-smart/08.gif" alt="Vet Smart estudos" />
        </div>

        {/* Bottom navigation */}
        <div
          className="flex items-center justify-between"
          style={{ paddingBottom: 96 }}
        >
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-60 transition-opacity duration-200"
            style={{ textDecoration: "none" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontSize: 26, fontWeight: 400, letterSpacing: "-0.13px", color: "#222" }}>
              Voltar
            </span>
          </Link>

          <Link
            href="/unico-you"
            className="flex items-center gap-3 hover:opacity-60 transition-opacity duration-200"
            style={{ textDecoration: "none" }}
          >
            <span style={{ fontSize: 26, fontWeight: 400, letterSpacing: "-0.13px", color: "#222" }}>
              Unico You
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
