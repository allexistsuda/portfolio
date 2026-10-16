"use client";

import Reveal from "./Reveal";

/**
 * Depoimentos: faixa de cards deslizando devagar (referência do Dribbble).
 *
 * Só o filete de borda, sem preenchimento nem sombra — a mesma régua da lista
 * de projetos. A faixa pausa com o mouse em cima (senão quem quiser ler
 * persegue o texto) e para de vez com prefers-reduced-motion.
 *
 * Os textos passaram por correção mínima de gramática, aprovada pelo Allexis:
 * "quick"->"quickly", "a invaluable"->"an invaluable", "teamplayer"->"team player",
 * "focused in"->"focused on" e uma vírgula. Sentido e tom intactos.
 *
 * ATENÇÃO: os três textos são reais. Só o Rafael tem autoria confirmada; os
 * outros dois estão com MARCADORES de nome e cargo — substituir pelos autores
 * verdadeiros antes de publicar.
 */

// modo de calibragem: um card só, parado, sem máscara nas pontas
const ESTATICO = true;

type Depoimento = { texto: string; nome: string; cargo: string; foto?: string };

// Quem aparece e em que ordem — 2 fileiras de 3. Quem não está aqui continua
// no array abaixo, só não renderiza. Se a lista crescer, o excedente vai pro
// slider lateral. Mexer só nesta lista, nunca na ordem do array.
const ORDEM = [
  "Rafael Morroni",
  "Marlon Zanatti",
  "Raphael Santos",
  "Bruna Comin",
  "Helizabeth Trindade",
  "Fernando Sotero",
];

const DEPOIMENTOS: Depoimento[] = [
  {
    texto:
      "Allexis is a great professional, always focused on his job and ready to help us. Working with him was a privilege.",
    nome: "Rafael Morroni",
    cargo: "Design System Lead at Santander",
    foto: "/depoimentos/rafael-morroni.jpg",
  },
  {
    texto:
      "Allexis gave me my first opportunity in UX/UI. He gave me autonomy, guided me when I was unsure, and was certainly one of the best bosses I've had.",
    nome: "Helizabeth Trindade",
    cargo: "Senior Product Designer at Elo",
    foto: "/depoimentos/helizabeth-trindade.jpg",
  },
  {
    texto:
      "He represents my whole introduction to the field. More than speed and results, what struck me was his broad view of projects from the start.",
    nome: "Daniele Oliva",
    cargo: "Community Operations Analyst at Covalen",
    foto: "/depoimentos/daniele-oliva.jpg",
  },
  {
    texto:
      "Smart and always on top of the latest market trends, Allexis is a reference for remarkable projects with great ROI.",
    nome: "Marlon Zanatti",
    cargo: "US Managing Director at DOJO",
    foto: "/depoimentos/marlon-zanatti.jpg",
  },
  {
    texto:
      "Allexis is a passionate, creative, and hardworking guy I was lucky enough to work with. Always getting things done, he is an invaluable team player.",
    nome: "Raphael Santos",
    cargo: "Front End Developer at HMH",
    foto: "/depoimentos/raphael-santos.jpg",
  },
  {
    texto:
      "An effective, dynamic professional and, above all, a great team manager. A privilege to work alongside you, Allexis!",
    nome: "Fernando Sotero",
    cargo: "Sales Executive at Localiza",
    foto: "/depoimentos/fernando-sotero.jpg",
  },
  {
    texto:
      "This boy is good at what he does and very committed, always willing to solve problems and welcome those who work with him.",
    nome: "Bruna Comin",
    cargo: "Product Portfolio Manager at Overlabs",
    foto: "/depoimentos/bruna-comin.jpg",
  },
  {
    texto:
      "Great professional and person. Very committed, solves problems very quickly, excellent art director and motion designer.",
    nome: "Jun Ikeya",
    cargo: "Senior Product & Brand Designer at SumUp",
    foto: "/depoimentos/jun-ikeya.jpg",
  },
];

function Card({ d }: { d: Depoimento }) {
  return (
    <article className="depo-card">
      <span aria-hidden style={{ display: "block", fontSize: 46, lineHeight: "30px", color: "#222", marginBottom: 18 }}>
        &rdquo;
      </span>
      <p style={{ fontSize: 20, fontWeight: 400, letterSpacing: "-0.45px", lineHeight: "29px", color: "#222", margin: 0 }}>
        {d.texto}
      </p>
      <div // marginTop auto empurra SÓ a autoria pra base; com space-between o espaço
        // livre era dividido entre os três filhos e a citação descia junto
        style={{ display: "flex", alignItems: "center", gap: 12, marginTop: "auto", paddingTop: 24 }}>
        {d.foto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={d.foto}
            alt=""
            width={36}
            height={36}
            style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
          />
        ) : (
          // círculo cinza no lugar da foto que ainda não temos — nada de rosto emprestado
          <div aria-hidden style={{ width: 36, height: 36, borderRadius: "50%", background: "#DEDEDE", flexShrink: 0 }} />
        )}
        <div>
          <p style={{ fontSize: 14, letterSpacing: "-0.1px", lineHeight: "21px", color: "#222", margin: 0 }}>{d.nome}</p>
          <p style={{ fontSize: 14, letterSpacing: "-0.1px", lineHeight: "21px", color: "#8D8D8D", margin: 0 }}>
            {d.cargo}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function Depoimentos() {
  // a sequência entra duas vezes: a animação anda -50% e reinicia sem emenda
  const fila = [...DEPOIMENTOS, ...DEPOIMENTOS];

  if (ESTATICO) {
    return (
      // mesma guia do About: o bloco "I'm Allexis -> Throughout" vai de 60 a 1380
      <section className="depo-secao" style={{ maxWidth: 1440, margin: "0 auto", paddingBottom: 140 }}>
        <div>
          {/* cascata card a card. 90ms de passo (a lista de projetos usa 35, mas lá
              são linhas finas; aqui são blocos de 282px e 35 fica simultâneo) e
              -20% de margem pro gatilho: com 0% a animação terminava antes de
              você chegar no bloco. */}
          <div className="depo-grade">
            {ORDEM.map((nome) => DEPOIMENTOS.find((x) => x.nome === nome))
              .filter((d): d is Depoimento => Boolean(d))
              .map((d, i) => (
                <Reveal key={d.nome} delay={i * 90} triggerMargin="-20%" className="depo-celula">
                  <Card d={d} />
                </Reveal>
              ))}
          </div>

          {/* o convite ao LinkedIn sai por ora — o Allexis vai decidir onde entra */}
        </div>
        <style>{`
          /* o container pai já aplica 24/40; aqui só o que falta pra bater a guia do About */
          .depo-secao { padding-left: 0; padding-right: 0; }
          @media (min-width: 768px) { .depo-secao { padding-left: 20px; padding-right: 20px; } }
          /* 3 por linha, 2 linhas */
          .depo-grade { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; }
          @media (max-width: 1023px) { .depo-grade { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
          /* celular: em vez de empilhar, vira carrossel de arrastar com snap.
             As margens negativas fazem a faixa sangrar até as bordas da tela,
             e o padding devolve o alinhamento do primeiro card na guia. */
          @media (max-width: 767px) {
            .depo-grade {
              display: flex;
              overflow-x: auto;
              scroll-snap-type: x mandatory;
              -webkit-overflow-scrolling: touch;
              gap: 12px;
              margin-left: -24px;
              margin-right: -24px;
              padding-left: 24px;
              padding-right: 24px;
              scrollbar-width: none;
            }
            .depo-grade::-webkit-scrollbar { display: none; }
            .depo-celula { flex: 0 0 82%; scroll-snap-align: start; }
          }
          /* em 3 colunas (427px) nenhuma citação passa de 4 linhas: 4 x 29 = 116
             reserva o mesmo espaço pra todas e alinha nome e foto */
          /* sem min-height: o número de linhas muda com a largura (3 em 1440,
             5 em 1200), então travar altura nunca cobre todas. A grade já estica
             os cards da mesma fileira, e a autoria está ancorada na base — os
             nomes alinham sozinhos em qualquer largura. */
          /* o Reveal virou o item da grade; estica pro card pegar a altura da fileira */
          .depo-celula { display: flex; }
          .depo-celula > div { width: 100%; display: flex; }
          .depo-card {
            /* largura vem da grade (1fr), não de um número cravado */
            /* #E6E6E6 e não #DEDEDE: a régua é um traço, o card são 4 lados —
               a mesma cor pesa mais em caixa. O E6E6E6 já existe no nav e nos logos. */
            border: 1px solid #E6E6E6; border-radius: 8px;
            padding: 26px 26px 24px; background: transparent;
            /* ancora a autoria na base: com citações de tamanhos diferentes,
               os rodapés alinham e a sobra fica no meio, onde não se nota */
            display: flex; flex-direction: column;
          }
        `}</style>
      </section>
    );
  }

  return (
    <section style={{ paddingBottom: 140, overflow: "hidden" }}>
      <Reveal triggerMargin="0%">
        <div className="depo-faixa">
          <div className="depo-trilho">
            {fila.map((d, i) => (
              <Card key={i} d={d} />
            ))}
          </div>
        </div>
      </Reveal>

      <style>{`
        .depo-faixa {
          overflow: hidden;
          /* some nas pontas em vez de cortar seco */
          -webkit-mask-image: linear-gradient(to right, transparent, #000 80px, #000 calc(100% - 80px), transparent);
          mask-image: linear-gradient(to right, transparent, #000 80px, #000 calc(100% - 80px), transparent);
        }
        .depo-trilho {
          display: flex;
          gap: 20px;
          width: max-content;
          align-items: stretch;
          animation: depo-desliza 80s linear infinite;
        }
        .depo-faixa:hover .depo-trilho { animation-play-state: paused; }
        .depo-card {
          flex: 0 0 420px;
          border: 1px solid #DEDEDE;
          border-radius: 14px;
          padding: 26px 26px 24px;
          background: transparent;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        @keyframes depo-desliza {
          from { transform: translateX(0); }
          /* metade do trilho = exatamente uma volta da sequência duplicada */
          to { transform: translateX(calc(-50% - 10px)); }
        }
        @media (max-width: 767px) {
          .depo-card { flex-basis: 300px; padding: 22px; }
          .depo-trilho { gap: 14px; animation-duration: 60s; }
        }
        @media (prefers-reduced-motion: reduce) {
          .depo-trilho { animation: none; }
        }
      `}</style>
    </section>
  );
}
