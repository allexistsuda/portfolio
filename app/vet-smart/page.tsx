"use client";

import BottomNav from "../components/BottomNav";
import VideoNaTela from "../components/VideoNaTela";
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
  return <div className="my-8 md:my-[100px] md:mx-5" style={{ height: 1, background: "rgba(34,34,34,0.15)" }} />;
}

function Img({ src, alt }: { src: string; alt: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} style={{ width: "100%", height: "auto", display: "block", borderRadius: 16 }} />
  );
}

/**
 * Os dois lados da peça da investigação (08-motion.mp4, 2720x1532: painel branco com a
 * lupa, painel cinza com a grade de ícones), pra remontar no celular um embaixo do outro.
 *
 * Os números saem de medir o vídeo quadro a quadro, não o poster: a lupa balança, e ao
 * longo da animação ela varre 839px — bem mais que os 550px em que ela para no fim.
 * Os dois recortes têm o mesmo tamanho (1100px) de propósito, pra lupa e ícones chegarem
 * no celular na mesma escala em que foram desenhados lado a lado.
 */
const LUPA = { x: 54, y: 293, w: 1100, h: 1100, sw: 2720, sh: 1532 };
const ICONES = { x: 1490, y: 218, w: 1100, h: 1100, sw: 2720, sh: 1532 };

/**
 * A montagem do logo, uma vez só. Sem autoplay: o bloco está no alto de uma página de
 * 17.000px, então disparar no load faria a animação acontecer antes de alguém ver.
 * Sem loop também — é um movimento com fim, e repetir a cada 2,3s vira tique.
 *
 * O primeiro quadro é branco, igual ao fundo do card, então não há salto ao começar.
 * Com prefers-reduced-motion nem monta o vídeo: entrega o PNG do quadro final.
 */
type Section = { heading: string; blocks: Block[] };
type Content = {
  intro: Section;
  pain: Section;
  solution: Section;
  evolution: Section;
  frequencia: Section;
  investigacao: Section;
  hipotese: Section;
  conteudo: Section;
  esforco: Section;
  olhos: Section;
  calc: Section;
  inteligencia: Section;
  results: Section;
  licao: Section;
  back: string;
};

const pt: Content = {
  intro: {
    heading:
      "Cofundei o Vet Smart, um app para veterinários, construído com amigos desenvolvedores e sem investimento externo",
    blocks: [
      { p: ["Quando o Vet Smart surgiu, não existiam aplicativos para veterinários. Fomos os ", { h: "primeiros a construir um produto para esse público", d: 0.2 }, ", e eu era o único designer do time."] },
      { p: ["Com o tempo, ele se tornou o ", { h: "principal aplicativo de veterinária do Brasil", d: 0.4 }, ", usado por metade dos veterinários de pequenos animais, e foi adquirido pela Petlove."] },
    ],
  },
  pain: {
    heading: "Antes do Vet Smart, existia um problema durante a consulta",
    blocks: [
      { p: ["Na hora de prescrever, o veterinário não tinha onde buscar, de forma fácil e rápida, ", { h: "informações sobre medicamentos", d: 0.2 }, ", como dosagens, indicações de uso e interações."] },
      { p: ["Muitas vezes, precisava recorrer a ", { h: "livros ou a vários PDFs", d: 0.4 }, ". Cada bula organizava o conteúdo de um jeito."] },
    ],
  },
  solution: {
    heading: "Nossa solução foi levar essas informações para um aplicativo que o veterinário pudesse usar no próprio atendimento",
    blocks: [
      { p: ["Chegamos nesse formato depois de um longo discovery. Fizemos pesquisas, entrevistas e testes de usabilidade, validando diversas hipóteses com veterinários."] },
      { p: ["As bulas traziam tudo em texto corrido, então organizei o conteúdo em ", { h: "seções fixas", d: 0.4 }, " como doses, indicações, apresentações e interações medicamentosas, de forma consistente em todos os produtos, ", { h: "mais de 4 mil no total.", d: 0.6 }] },
      { p: ["Dentro delas, dividi o texto em módulos, um jeito mais visual e rápido de entender."] },
      { p: ["A ", { h: "busca tinha um peso grande na navegação", d: 0.8 }, ", porque era o caminho mais direto até o medicamento, e durante a consulta o veterinário não tinha tempo de procurar muito."] },
    ],
  },
  evolution: {
    heading: "Tínhamos mais de 75 mil cadastrados, de um universo de 130 mil veterinários no país",
    blocks: [
      { p: ["O feedback era positivo, com ", { h: "nota 4,75 nas stores", d: 0.2 }, ". Do lado do negócio, trabalhávamos com as principais marcas do mercado, como Royal Canin, Purina e Zoetis."] },
    ],
  },
  frequencia: {
    heading: "Apesar de todos esses dados parecerem bons, quando olhamos para o comportamento dos usuários, encontramos um problema: a frequência de uso era muito baixa",
    blocks: [
      { p: ["Dos 75 mil cadastrados, 35 mil eram ativos. Cada um acessava o app em média apenas ", { h: "cinco vezes por mês.", d: 0.2 }] },
      { p: ["Essa métrica importava porque nosso modelo de negócio dependia principalmente de publicidade dentro do app: cerca de ", { h: "70% da nossa receita vinha da venda de anúncios", d: 0.4 }, "."] },
      { p: ["Uma baixa frequência de uso significava menos acessos, menos visualizações de página e, consequentemente, menos impressões de anúncio e menos receita."] },
      { p: ["Sem essa receita, a gente não conseguia crescer como empresa."] },
    ],
  },
  investigacao: {
    heading: "Com os recursos limitados de uma startup, fui investigar da forma mais aberta até chegar em pontos específicos",
    blocks: [
      { p: ["Parti para uma ", { h: "pesquisa quantitativa", d: 0.2 }, ", disparada por e-mail para toda a nossa base. Perguntei em que situações usavam o Vet Smart, que tipo de conteúdo consultavam e do que sentiam falta. Um padrão apareceu de forma bem consistente: ", { h: "queriam se atualizar profissionalmente", d: 0.4 }, ", com estudos recentes, protocolos e casos de uso reais."] },
      { p: ["Depois fui mais fundo nas entrevistas. Os veterinários me contaram que dependiam de cursos e eventos presenciais, com datas fixas e custo alto, o que nem sempre cabia no orçamento. E o que existia disponível era ", { h: "desatualizado e descentralizado.", d: 0.6 }] },
      { p: ["Também olhei para o mercado, de produtos veterinários e de saúde humana, aqui e fora. Praticamente todo o conteúdo era a ", { h: "bula copiada e colada", d: 0.8 }, ", sem nenhuma estrutura por trás."] },
      { p: ["Por último, fui ver o uso do app no analytics. ", { h: "Metade dos acessos era para checar dosagem", d: 1.0 }, ". A princípio, isso parecia uma confirmação de que a área já funcionava bem. Não parecia um problema a ser explorado."] },
    ],
  },
  hipotese: {
    heading: "Cheguei numa hipótese: e se criássemos conteúdo novo e relevante, sempre atualizado?",
    blocks: [
      { p: ["Isso daria aos veterinários um ", { h: "motivo a mais para voltar ao Vet Smart", d: 0.2 }, ", além de checar dosagem. E sem nenhum custo para eles, como sempre foi a proposta do app."] },
    ],
  },
  conteudo: {
    heading: "Ao longo de vários meses, testamos diferentes tipos de conteúdo e formas de apresentá-lo",
    blocks: [
      { p: ["Dentro das bibliotecas, organizei o conteúdo em ", { h: "categorias: estudos, protocolos, informações por raça e casos de uso", d: 0.2 }, "."] },
      { p: ["Na hora de diagramar, em vez de manter o texto corrido do jeito que vinha no estudo original, criei uma ", { h: "hierarquia visual", d: 0.4 }, ", com pesos de fonte diferentes, destaques e imagens, para guiar a leitura."] },
    ],
  },
  esforco: {
    heading: "Eu tinha feito exatamente o que pediram nas pesquisas e entrevistas. Mas parece que não foi o suficiente",
    blocks: [
      { p: ["Mesmo com feedback positivo dos veterinários sobre o conteúdo, a frequência de uso continuou a mesma: ", { h: "cinco acessos por mês, por usuário ativo.", d: 0.2 }] },
    ],
  },
  olhos: {
    heading: "Então decidi fazer um shadowing com os veterinários durante as consultas, para entender mais sobre como trabalhavam no dia a dia e se havia alguma oportunidade ali",
    blocks: [
      { p: ["Uma coisa me chamou a atenção logo de cara. O veterinário precisava ", { h: "calcular a dose do medicamento com base no peso do animal", d: 0.2 }, ", muitas vezes usando uma regra de três para converter mg em ml. E repetia essa conta várias vezes ao longo do dia."] },
      { p: ["Nosso aplicativo já mostrava a dose recomendada, mas não fazíamos esse cálculo. Era ", { h: "uma dor que existia, mas, de tão automática, nenhum veterinário apontou antes.", d: 0.4 }] },
    ],
  },
  calc: {
    heading: "E se criássemos uma calculadora que fizesse essa conta pelo veterinário?",
    blocks: [
      { p: ["A ideia era reduzir o esforço ao mínimo: ele digitava o peso, ", { h: "sem precisar apertar nenhum botão", d: 0.2 }, ", e a dose aparecia na hora, em mg e ml."] },
    ],
  },
  inteligencia: {
    heading: "A calculadora precisava fazer mais do que calcular: tinha que identificar quando um resultado podia ser perigoso",
    blocks: [
      { p: ["Quando o peso informado ficava abaixo do mínimo seguro para o medicamento, o app ", { h: "bloqueava o resultado", d: 0.2 }, " e avisava que a segurança daquele produto não tinha sido estabelecida para animais tão pequenos."] },
      { p: ["Quando o volume calculado saía grande demais para uma aplicação só, orientava a ", { h: "dividir em dois pontos.", d: 0.4 }] },
      { p: ["E quando não havia nenhum alerta, o caso mais comum, o veterinário ainda podia conferir a referência do cálculo."] },
    ],
  },
  results: {
    heading: "Ao longo dos meses seguintes, os resultados apareceram",
    blocks: [
      {
        ul: [
          ["Frequência de uso: ", { h: "de 5 para 28 acessos por mês", d: 0.2 }, ", por usuário ativo"],
          ["Usuários ativos: ", { h: "de 35 mil para 70 mil", d: 0.4 }],
          ["Uso da área de dosagem: ", { h: "de 50% para 80% do total", d: 0.6 }],
          [{ h: "2,5 milhões de pageviews por mês", d: 0.8 }],
        ],
        mt: 0,
        liPad: 8,
      },
    ],
  },
  licao: {
    heading: "O maior aprendizado foi que uma métrica que já parecia boa escondia a grande oportunidade",
    blocks: [
      { p: ["Os 50% de acessos para dosagem eram dados de uma feature que já funcionava bem. Mas ali existia ", { h: "uma dor que nem os próprios veterinários foram capazes de identificar", d: 0.2 }, ", e que só apareceu com a observação do dia a dia."] },
      { p: ["No fim, metade dos veterinários de pequenos animais do Brasil virou usuário ativo, e o Vet Smart entrou na rotina desses profissionais. Isso chamou a atenção da Petlove, que queria entrar no setor e ", { h: "acabou comprando a nossa empresa.", d: 0.4 }] },
    ],
  },
  back: "Voltar",
};

const en: Content = {
  intro: {
    heading:
      "I co-founded Vet Smart, an app for vets, built with developer friends and no outside investment",
    blocks: [
      { p: ["When Vet Smart came along, there were no apps for vets. We were the ", { h: "first to build a product for them", d: 0.2 }, ", and I was the only designer on the team."] },
      { p: ["In time it became the ", { h: "leading veterinary app in Brazil", d: 0.4 }, ", used by half of all small-animal vets, and was acquired by Petlove."] },
    ],
  },
  pain: {
    heading: "Before Vet Smart, there was a problem during the consult",
    blocks: [
      { p: ["When it came to prescribing, the vet had nowhere to look up ", { h: "drug information", d: 0.2 }, " quickly and easily, such as dosages, indications and interactions."] },
      { p: ["More often than not, they fell back on ", { h: "books or a pile of PDFs", d: 0.4 }, ". Every package insert organized its content differently."] },
    ],
  },
  solution: {
    heading: "Our answer was to bring that information into an app the vet could use during the appointment itself",
    blocks: [
      { p: ["We arrived at that shape after a long discovery. We ran research, interviews and usability sessions, validating a range of hypotheses with vets."] },
      { p: ["Package inserts presented everything as running text, so I organized the content into ", { h: "fixed sections", d: 0.4 }, " like doses, indications, formats and drug interactions, consistent across every product, ", { h: "more than 4,000 of them.", d: 0.6 }] },
      { p: ["Inside them, I broke the text into modules, a more visual and quicker way to take it in."] },
      { p: ["", { h: "Search carried a lot of weight in the navigation", d: 0.8 }, ", because it was the most direct route to the drug, and during a consult the vet had no time to hunt around."] },
    ],
  },
  evolution: {
    heading: "We had more than 75,000 signed up, out of 130,000 vets in the country",
    blocks: [
      { p: ["The feedback was positive, ", { h: "4.75 on the stores", d: 0.2 }, ". On the business side, we worked with the biggest brands in the market, like Royal Canin, Purina and Zoetis."] },
    ],
  },
  frequencia: {
    heading: "Despite all of this looking good, when we looked at how people actually used the app we found a problem: they came back very rarely",
    blocks: [
      { p: ["Of the 75,000 signed up, 35,000 were active. Each of them opened the app an average of ", { h: "five times a month.", d: 0.2 }] },
      { p: ["That metric mattered because our business model depended mostly on advertising inside the app: around ", { h: "70% of our revenue came from selling ads", d: 0.4 }, "."] },
      { p: ["Low frequency meant fewer visits, fewer pageviews and, in turn, fewer ad impressions and less revenue."] },
      { p: ["Without that revenue, we could not grow as a company."] },
    ],
  },
  investigacao: {
    heading: "With a startup's limited resources, I investigated as broadly as possible before narrowing to specifics",
    blocks: [
      { p: ["I started with a ", { h: "quantitative survey", d: 0.2 }, ", emailed to our whole base. I asked in what situations they used Vet Smart, what kind of content they looked up and what they missed. A pattern came up very consistently: ", { h: "they wanted to keep up professionally", d: 0.4 }, ", with recent studies, protocols and real use cases."] },
      { p: ["Then I went deeper in interviews. Vets told me they relied on courses and in-person events, with fixed dates and a high cost that did not always fit the budget. And what was available was ", { h: "outdated and scattered.", d: 0.6 }] },
      { p: ["I also looked at the market, veterinary and human health, here and abroad. Almost all of the content was the ", { h: "package insert copied and pasted", d: 0.8 }, ", with no structure behind it."] },
      { p: ["Last, I looked at how the app was used, in the analytics. ", { h: "Half of all visits were to check a dose", d: 1.0 }, ". At first that looked like confirmation that the area already worked well. It did not look like a problem to explore."] },
    ],
  },
  hipotese: {
    heading: "I landed on a hypothesis: what if we made new, relevant content, always up to date?",
    blocks: [
      { p: ["That would give vets ", { h: "one more reason to come back to Vet Smart", d: 0.2 }, ", beyond checking a dose. And at no cost to them, the way the app had always worked."] },
    ],
  },
  conteudo: {
    heading: "Over several months we tested different kinds of content, and different ways of presenting it",
    blocks: [
      { p: ["Inside the libraries I organized the content into ", { h: "categories: studies, protocols, breed-specific information and use cases", d: 0.2 }, "."] },
      { p: ["Laying it out, instead of keeping the running text the way it came in the original study, I built a ", { h: "visual hierarchy", d: 0.4 }, ": different font weights, highlights and images, to guide the reading."] },
    ],
  },
  esforco: {
    heading: "I had done exactly what they asked for in the surveys and the interviews. And it turned out not to be enough",
    blocks: [
      { p: ["Even with positive feedback from vets about the content, usage frequency stayed exactly the same: ", { h: "five visits a month, per active user.", d: 0.2 }] },
    ],
  },
  olhos: {
    heading: "So I decided to shadow vets during appointments, to understand more about how they worked day to day and whether there was an opportunity there",
    blocks: [
      { p: ["One thing caught my attention right away. The vet had to ", { h: "work the drug's dose out from the animal's weight", d: 0.2 }, ", often with a rule of three to convert mg into ml. And they repeated that calculation several times a day."] },
      { p: ["Our app already showed the recommended dose, but we did not do that calculation. It was ", { h: "a real pain, and so automatic that no vet had ever raised it.", d: 0.4 }] },
    ],
  },
  calc: {
    heading: "What if we built a calculator that did the maths for the vet?",
    blocks: [
      { p: ["The idea was to cut the effort to the bare minimum: they typed the weight, ", { h: "without pressing anything", d: 0.2 }, ", and the dose appeared right there, in mg and ml."] },
    ],
  },
  inteligencia: {
    heading: "The calculator had to do more than calculate: it had to spot when a result could be dangerous",
    blocks: [
      { p: ["When the weight entered fell below the drug's safe minimum, the app ", { h: "blocked the result", d: 0.2 }, " and warned that the product's safety had not been established for animals that small."] },
      { p: ["When the calculated volume came out too large for a single application, it advised ", { h: "splitting it across two sites.", d: 0.4 }] },
      { p: ["And when there was no alert at all, the most common case, the vet could still check the reference behind the calculation."] },
    ],
  },
  results: {
    heading: "Over the following months, the results showed up",
    blocks: [
      {
        ul: [
          ["Usage frequency: ", { h: "from 5 to 28 visits a month", d: 0.2 }, ", per active user"],
          ["Active users: ", { h: "from 35,000 to 70,000", d: 0.4 }],
          ["Use of the dosage area: ", { h: "from 50% to 80% of the total", d: 0.6 }],
          [{ h: "2.5 million pageviews a month", d: 0.8 }],
        ],
        mt: 0,
        liPad: 8,
      },
    ],
  },
  licao: {
    heading: "The biggest lesson was that a metric that already looked good was hiding the biggest opportunity",
    blocks: [
      { p: ["The 50% of visits going to dosage were numbers from a feature that already worked well. But there was ", { h: "a pain not even the vets themselves were able to name", d: 0.2 }, ", and it only showed up by watching the day to day."] },
      { p: ["In the end, half of Brazil's small-animal vets became active users, and Vet Smart made it into these professionals' routine. That caught Petlove's attention. They wanted into the sector, and ", { h: "ended up buying our company.", d: 0.4 }] },
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
          <Blocks cascata blocks={c.intro.blocks} />
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

        {/* Antes do Vet Smart, existia um problema durante a consulta */}
        <TwoCol heading={c.pain.heading}>
          <Blocks cascata blocks={c.pain.blocks} />
        </TwoCol>


        <Divider />

        {/* Solução */}
        <TwoCol heading={c.solution.heading}>
          <Blocks cascata blocks={c.solution.blocks} />
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

        {/* Tínhamos mais de 75 mil cadastrados */}
        <TwoCol heading={c.evolution.heading}>
          <Blocks cascata blocks={c.evolution.blocks} />
        </TwoCol>

        <Divider />

        {/* A frequência baixa: o problema que motiva a investigação seguinte */}
        <TwoCol heading={c.frequencia.heading}>
          <Blocks cascata blocks={c.frequencia.blocks} />
        </TwoCol>

        <Divider />

        {/* A investigação: é ela que as imagens das bibliotecas ilustram */}
        <TwoCol heading={c.investigacao.heading}>
          <Blocks cascata blocks={c.investigacao.blocks} />
        </TwoCol>

        {/* A lupa e os doze ícones: o motion repete, é ambiente, como o do cachorro.
            A peça é dois painéis lado a lado, então no celular ela cabe inteira mas cada
            ícone fica com 13px. Lá ela vira dois quadrados, um embaixo do outro, recortados
            do mesmo vídeo — mesma escala nos dois, que é a escala em que a arte foi desenhada. */}
        <div className="my-8 md:my-[100px]">
          <div className="md:hidden space-y-4">
            <VideoNaTela src="/vet-smart/08-motion.mp4" estatico="/vet-smart/08-poster.jpg" alt="Vet Smart investigação: a lupa" repetir recorte={LUPA} />
            <VideoNaTela src="/vet-smart/08-motion.mp4" estatico="/vet-smart/08-poster.jpg" alt="Vet Smart investigação: a grade de ícones" repetir recorte={ICONES} fundo="#F7F9F6" />
          </div>
          <div className="hidden md:block">
            <VideoNaTela src="/vet-smart/08-motion.mp4" estatico="/vet-smart/08-poster.jpg" alt="Vet Smart investigação" repetir />
          </div>
        </div>

        {/* A hipótese que sai da investigação */}
        <TwoCol heading={c.hipotese.heading}>
          <Blocks cascata blocks={c.hipotese.blocks} />
        </TwoCol>

        <Divider />

        {/* O teste de conteúdo: é o texto que as imagens das bibliotecas ilustram */}
        <TwoCol heading={c.conteudo.heading}>
          <Blocks cascata blocks={c.conteudo.blocks} />
        </TwoCol>

        {/* As bibliotecas e os artigos */}
        <div className="my-8 md:my-[100px]" style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {/* a fileira das Bibliotecas rola; no celular a arte ja e pequena demais
              pro movimento somar, entao la fica parada.
              Tres aparelhos lado a lado em 375px deixam cada um com 109px — a tela some.
              No celular eles viram um bloco cada, empilhados, como as f41-mobile. */}
          <div className="md:hidden space-y-8">
            <Img src="/vet-smart/bibliotecas-01-mobile-a.jpg" alt="Vet Smart bibliotecas: a chamada" />
            <VideoNaTela src="/vet-smart/bibliotecas-01-mobile-b-motion.mp4" estatico="/vet-smart/bibliotecas-01-mobile-b.jpg" alt="Vet Smart bibliotecas: a home com a fileira" repetir />
            <Img src="/vet-smart/bibliotecas-01-mobile-c.jpg" alt="Vet Smart bibliotecas: a lista por categoria" />
          </div>
          <div className="hidden md:block"><VideoNaTela src="/vet-smart/bibliotecas-01-motion.mp4" estatico="/vet-smart/bibliotecas-01.jpg" alt="Vet Smart bibliotecas" repetir /></div>
          {/* a foto do ácaro ganha vida dentro do celular do meio */}
          <div className="md:hidden space-y-8">
            <VideoNaTela src="/vet-smart/bibliotecas-02-mobile-a-motion.mp4" estatico="/vet-smart/bibliotecas-02-mobile-a.jpg" alt="Vet Smart estudos e protocolos: o artigo do ácaro" repetir />
            <Img src="/vet-smart/bibliotecas-02-mobile-b.jpg" alt="Vet Smart estudos e protocolos: o artigo de manejo da dor" />
          </div>
          <div className="hidden md:block"><VideoNaTela src="/vet-smart/bibliotecas-02-motion.mp4" estatico="/vet-smart/bibliotecas-02.jpg" alt="Vet Smart estudos e protocolos" repetir /></div>
        </div>

        {/* O conteúdo saiu, e os números não se mexeram */}
        <TwoCol heading={c.esforco.heading}>
          <Blocks cascata blocks={c.esforco.blocks} />
        </TwoCol>

        <Divider />

        {/* O shadowing, e o que ele mostrou que nenhuma entrevista mostrou */}
        <TwoCol heading={c.olhos.heading}>
          <Blocks cascata blocks={c.olhos.blocks} />
        </TwoCol>

        <Divider />

        {/* A segunda hipótese, e a calculadora que saiu dela */}
        <TwoCol heading={c.calc.heading}>
          <Blocks cascata blocks={c.calc.blocks} />
        </TwoCol>

        {/* a calculadora sendo usada: digita o peso e a dose sai sem apertar botão.
            o 06.png era exatamente o quadro final disto, por isso virou o vídeo */}
        <div className="my-8 md:my-[100px]">
          <div className="md:hidden"><VideoNaTela src="/vet-smart/calculadora-mobile-motion.mp4" estatico="/vet-smart/calculadora-mobile.jpg" alt="Vet Smart calculadora" repetir /></div>
          <div className="hidden md:block"><VideoNaTela src="/vet-smart/calculadora-motion.mp4" estatico="/vet-smart/calculadora-poster.jpg" alt="Vet Smart calculadora" repetir /></div>
        </div>

        {/* O que a calculadora fazia além de calcular */}
        <TwoCol heading={c.inteligencia.heading}>
          <Blocks cascata blocks={c.inteligencia.blocks} />
        </TwoCol>

        {/* os três desfechos do cálculo: bloqueia, manda dividir em dois pontos, ou deixa
            conferir a referência. Sem repetir: é uma passada só, com começo e fim, e o
            quadro que fica parado no final é o estado resolvido dos três aparelhos */}
        <div className="my-8 md:my-[100px]">
          {/* no celular os três viram um bloco cada, recortados do mesmo vídeo: lá eles
              agem em sequência numa linha do tempo só, e cada clipe traz a fatia do seu */}
          <div className="md:hidden space-y-8">
            <VideoNaTela src="/vet-smart/alertas-mobile-1-motion.mp4" estatico="/vet-smart/alertas-mobile-1.jpg" alt="Vet Smart: a calculadora bloqueia o peso abaixo do mínimo" />
            <VideoNaTela src="/vet-smart/alertas-mobile-2-motion.mp4" estatico="/vet-smart/alertas-mobile-2.jpg" alt="Vet Smart: a calculadora manda dividir em dois pontos de aplicação" />
            <VideoNaTela src="/vet-smart/alertas-mobile-3-motion.mp4" estatico="/vet-smart/alertas-mobile-3.jpg" alt="Vet Smart: a calculadora deixa conferir a referência do cálculo" />
          </div>
          <div className="hidden md:block">
            <VideoNaTela src="/vet-smart/alertas-motion.mp4" estatico="/vet-smart/alertas-poster.jpg" alt="Vet Smart estados de alerta da calculadora" />
          </div>
        </div>

        <Divider />

        {/* Resultado */}
        <TwoCol heading={c.results.heading}>
          <Blocks cascata blocks={c.results.blocks} />
        </TwoCol>

        <Divider />

        {/* A lição: a métrica boa escondia a oportunidade */}
        <TwoCol heading={c.licao.heading}>
          <Blocks cascata blocks={c.licao.blocks} />
        </TwoCol>



        {/* tipografia e cor fecham a página */}
        <div className="mt-8 md:mt-[100px]" style={{ marginBottom: 32 }}>
          <div className="md:hidden space-y-8">
            <Img src="/vet-smart/07-mobile-a.png" alt="Vet Smart typeface" />
            {/* o GIF tinha 5 quadros em 15s: os cinco estados com corte seco. Este é a
                metade direita do próprio vídeo do desktop, com as transições de verdade,
                no mesmo 1920x1898 que o GIF tinha */}
            <VideoNaTela src="/vet-smart/07-mobile-b-motion.mp4" estatico="/vet-smart/07-mobile-b.jpg" alt="Vet Smart color" repetir />
          </div>
          <div className="hidden md:block"><VideoNaTela src="/vet-smart/typeface-motion.mp4" estatico="/vet-smart/typeface-poster.jpg" alt="Vet Smart typeface e cor" repetir /></div>
        </div>

        <BottomNav prev={{ label: c.back, href: "/" }} next={{ label: "Unico You", href: "/unico-you" }} />

      </div>
    </div>
  );
}
