"use client";

import { useEffect, useRef, useState } from "react";
import Nav from "./components/Nav";
import HeroPhrases from "./components/HeroPhrases";
import Reveal from "./components/Reveal";
// import ThumbsRow from "./components/ThumbsRow"; // teste: trocado por ProjectsList
import ProjectsList from "./components/ProjectsList";
import Depoimentos from "./components/Depoimentos";
// import LogosCarousel from "./components/LogosCarousel"; // escondido por enquanto
import { useLang, useHref } from "./i18n/lang";
import { type Seg } from "./i18n/render";

const projects: {
  title: string;
  category: string;
  href: string;
  thumb?: string;
  video?: string;
  bg?: string;
}[] = [
  { title: "Vet Smart", category: "Mobile", href: "/vet-smart", thumb: "/thumbs/vet-smart.png" },
  { title: "Unico You", category: "Mobile", href: "/unico-you", thumb: "/thumbs/unico-you.png" },
  { title: "Santander Flame", category: "Design System", href: "/santander-design-system", thumb: "/thumbs/santander-design-system.png", bg: "#ED0000" },
  { title: "Vet Smart TV", category: "Web", href: "/vet-smart-tv", thumb: "/thumbs/vet-smart-tv.png" },
  { title: "Santander Workshops", category: "Design Ops", href: "/santander-workshops", thumb: "/thumbs/santander-workshops.png" },
];

const experiences: {
  company: string;
  role: string;
  period: { pt: string; en: string };
}[] = [
  { company: "Ticket", role: "Product Designer", period: { pt: "set/2024 – mar/2026", en: "Sep 2024 – Mar 2026" } },
  { company: "Santander", role: "Product Designer", period: { pt: "jan/2022 – jul/2024", en: "Jan 2022 – Jul 2024" } },
  { company: "Sioux", role: "Product Designer", period: { pt: "jan/2021 – dez/2021", en: "Jan 2021 – Dec 2021" } },
  { company: "Unico ID", role: "Head of Product Design", period: { pt: "out/2019 – dez/2020", en: "Oct 2019 – Dec 2020" } },
  { company: "Vet Smart", role: "Product Designer", period: { pt: "out/2015 – out/2019", en: "Oct 2015 – Oct 2019" } },
];

// só os anos, a partir do período escrito; quando começa e termina no mesmo ano, mostra um ano só
const anos = (periodo: string) => {
  const ys = periodo.match(/\d{4}/g) ?? [];
  if (ys.length === 0) return periodo;
  return ys[0] === ys[ys.length - 1] ? ys[0] : `${ys[0]}–${ys[ys.length - 1]}`;
};

const LABELS = {
  projects: { pt: "PROJETOS", en: "PROJECTS" },
  about: { pt: "SOBRE", en: "ABOUT" },
  experience: { pt: "EXPERIÊNCIA", en: "EXPERIENCE" },
  contact: { pt: "CONTATO", en: "CONTACT" },
};

const aboutPt: Seg[][] = [
  [
    "Atuação end-to-end em produtos digitais, passando por ",
    { h: "discovery, definição de jornadas, prototipação e evolução de produtos." },
  ],
  [
    "Vivência em empresas do segmento financeiro, SaaS e startups, com foco em soluções orientadas a negócio. ",
    { h: "Experiência com Design System, discovery, validação com usuários e uso de IA para acelerar pesquisa, fluxos e protótipos." },
  ],
  [
    "Co-fundador e Product Designer do ",
    { h: "Vet Smart", d: 0.2 },
    ", empresa adquirida pela Petlove em 2019. Participei também da criação do ",
    { h: "Unico You", d: 0.4 },
    " e atuei por 2 anos no time de Design System do ",
    { h: "Santander", d: 0.6 },
    ".",
  ],
];

const aboutEnNew: Seg[][] = [
  ["I'm Allexis, a Product Designer with end-to-end experience, from discovery and user journeys to prototyping and iterating on live products."],
  ["Throughout my career, I've worked in advertising agencies, startups, and large companies, across different environments, teams, and business stages, from fast-growing companies to well-established ones."],
  ["Along the way, I've worked on products in banking, financial services, HR, insurance, veterinary health, and ticketing."],
  ["I co-founded Vet Smart, which became Brazil's leading veterinary app and was sold to Petlove in 2019."],
];

const aboutEnOld: Seg[][] = [
  [
    "End-to-end work on digital products, spanning ",
    { h: "discovery, journey definition, prototyping and product evolution." },
  ],
  [
    "Experience across fintech, SaaS and startups, with a focus on business-oriented solutions. ",
    { h: "Skilled in Design Systems, discovery, user validation and using AI to speed up research, flows and prototypes." },
  ],
  [
    "Co-founder and Product Designer of ",
    { h: "Vet Smart", d: 0.2 },
    ", a company acquired by Petlove in 2019. I also helped create ",
    { h: "Unico You", d: 0.4 },
    " and spent 2 years on the Design System team at ",
    { h: "Santander", d: 0.6 },
    ".",
  ],
];
// Teste: true usa o texto novo (4 parágrafos); false usa o texto antigo (3 parágrafos).
const USE_NEW_ABOUT = true;

// Teste: false mantém o Sobre todo claro; true escurece o fundo conforme a imagem fecha.
const ABOUT_DARK = false;
// Experiência fica escondida por enquanto (o bloco continua no código).
// vídeo do bloco grande que abre em tela cheia antes do About (teste: o reel; antes era "/thumbs/unico-you.mp4#t=0.001")
const ABOUT_VIDEO = "/reel/render-final.mp4#t=0.001";
const SHOW_EXPERIENCE = false;
// Teste: só o texto, ocupando a largura toda (esconde o rótulo e as imagens).
const TEXT_ONLY = false;
// Teste (referência Fuel): linha fina, "About" colado nela e o texto em corpo grande.
const BIG_ABOUT = true;
// Rótulo "About" escondido por enquanto (o código continua aqui).
const SHOW_ABOUT_LABEL = false;
// Texto do Sobre também escondido por enquanto.
const SHOW_ABOUT_TEXT = true;
// Layout de 3 colunas (referência Fuel "Research"): rótulo pequeno | 1ª frase grande | resto do texto menor.
const REF_LAYOUT = false;
// Segundo bloco: experiências em linhas (cargo, empresa e período), com divisórias finas.
const SHOW_EXP_ROWS = true;
// Layout da Experience: "horizontal" (timeline do v1, uma bolinha por empresa) ou "vertical" (guardado: na 2ª coluna do About,
// período | bolinha | empresa | cargo).
// "list" = lista com divisórias, embaixo do último parágrafo do About
// "vertical-sticky" = mesma timeline vertical, mas DENTRO da coluna que rola (ela passa pela foto/título presos)
// "ref-frase" / "ref-destaque" = as duas referências: data à esquerda + entrada como frase (régua fina),
// ou data à esquerda + empresa pequena em cima e cargo grande (hierarquia por escala). Nenhuma usa trilho/bolinha.
const EXP_LAYOUT: "horizontal" | "vertical" | "vertical-sticky" | "list" | "ref-frase" | "ref-destaque" = "ref-frase";
// Teste: About como declaração grande + timeline horizontal de experiências (colunas, como no site v1).
const STATEMENT_LAYOUT = true;
// Logos passando de lado embaixo da timeline.
const SHOW_LOGOS = false;
// Seção de Contato (o preto subindo): desligada por enquanto.
const SHOW_CONTACT = true;
// Rodapé do Contato (mensagem de despedida e voltar ao topo).
const SHOW_CONTACT_FOOTER = false;
// Lista Email / LinkedIn / Instagram na coluna da direita do Contato: desligada
// enquanto rediagramamos o rodapé.
const SHOW_CONTACT_LINKS = false;
// Chips soltos embaixo da frase do Contato (Email / LinkedIn / Resume).
const SHOW_CONTACT_CHIPS = false;
// Slider de depoimentos entre a timeline e o Contato (teste).
const SHOW_DEPOIMENTOS = false;
// Reel rodando apagado atrás do Contato: testado e descartado — ver comentário no JSX.
const SHOW_CONTACT_REEL = false;

/**
 * Chips do Contato: caem de cima, em cascata, e assentam com um leve overshoot
 * (mesma ideia da mola do Reveal, só que em CSS — são elementos pequenos).
 */
const CHIP_DROP = 22; // px de onde cada chip cai
const CHIP_STAGGER = 90; // ms entre um chip e o próximo
// ATENÇÃO: o PDF ainda não existe em public/ — o link dá 404 até o arquivo entrar.
const RESUME_URL = "/resume.pdf";

/**
 * Frase do Contato: alterna entre o convite e a procedência com o mesmo
 * fade+blur do hero (ver HeroPhrases) — 3,8s parado, 750ms de transição.
 */
const CONTACT_PHRASES: Record<"pt" | "en", string[]> = {
  en: ["Want to work together, or talk about product? Say hi.", "Based in São Paulo, Brazil."],
  pt: ["Quer trabalhar junto ou conversar sobre produto? Manda um oi.", "Em São Paulo, Brasil."],
};
const CONTACT_HOLD_MS = 3800;
const CONTACT_FADE_MS = 750;

function ContactPhrases({ lang }: { lang: string }) {
  const list = CONTACT_PHRASES[lang === "pt" ? "pt" : "en"];
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setVisible(false), CONTACT_HOLD_MS);
    return () => clearTimeout(t);
  }, [index, visible]);

  useEffect(() => {
    if (visible) return;
    const t = setTimeout(() => {
      setIndex((i) => (i + 1) % list.length);
      setVisible(true);
    }, CONTACT_FADE_MS);
    return () => clearTimeout(t);
  }, [visible, list.length]);

  return (
    <span
      style={{
        display: "inline-block",
        opacity: visible ? 1 : 0,
        filter: visible ? "blur(0px)" : "blur(14px)",
        transition: `opacity ${CONTACT_FADE_MS}ms ease, filter ${CONTACT_FADE_MS}ms ease`,
      }}
    >
      {list[index]}
    </span>
  );
}

function ContactChips({ lang, show }: { lang: string; show: boolean }) {
  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "11px 22px",
    borderRadius: 999,
    // 0.5px vira um fio de 1 pixel real em tela retina (em 1x o Chrome arredonda pra 1)
    border: "0.5px solid rgba(244,244,242,0.3)",
    color: "#F4F4F2",
    fontSize: 15,
    letterSpacing: "-0.1px",
    lineHeight: "20px",
    textDecoration: "none",
    background: "transparent",
    cursor: "pointer",
    transition: "border-color 0.3s ease, background-color 0.3s ease",
  };

  const anim = (i: number): React.CSSProperties => ({
    opacity: show ? 1 : 0,
    transform: show ? "translateY(0)" : `translateY(${-CHIP_DROP}px)`,
    // bezier com overshoot: cai, passa um pouco do ponto e volta — "fica solto"
    transition: `opacity 260ms ease ${i * CHIP_STAGGER}ms, transform 620ms cubic-bezier(0.22, 1.5, 0.36, 1) ${i * CHIP_STAGGER}ms`,
  });

  const hoverOn = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.borderColor = "rgba(244,244,242,0.6)";
    e.currentTarget.style.backgroundColor = "rgba(244,244,242,0.06)";
  };
  const hoverOff = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.borderColor = "rgba(244,244,242,0.3)";
    e.currentTarget.style.backgroundColor = "transparent";
  };

  return (
    <div>
    {/* 40px vêm do gap-y-10 da grid; +40 aqui pra frase respirar antes dos chips */}
    <div className="flex flex-wrap items-center justify-center" style={{ gap: 12, marginTop: 40 }}>
      {/* e-mail virou chip junto com os outros; sem marca de canto, não é link externo */}
      <a
        href="mailto:allexistsuda@gmail.com"
        style={{ ...base, ...anim(0) }}
        onMouseEnter={hoverOn}
        onMouseLeave={hoverOff}
      >
        {lang === "pt" ? "E-mail" : "Email"}
      </a>
      <a
        href="https://www.linkedin.com/in/allexis-tsuda-a99ab18/"
        target="_blank"
        rel="noopener noreferrer"
        style={{ ...base, ...anim(1) }}
        onMouseEnter={hoverOn}
        onMouseLeave={hoverOff}
      >
        LinkedIn
      </a>
      <a
        href={RESUME_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{ ...base, ...anim(2) }}
        onMouseEnter={hoverOn}
        onMouseLeave={hoverOff}
      >
        Resume
      </a>
      </div>
    </div>
  );
}
// Teste: About com a estrutura das páginas internas (TwoCol): frase principal à esquerda, o resto à direita.
const INTERNAL_ABOUT = true;
// Cada logo cabe numa caixa de 104 x 24 (centralizada no bloco de 227 x 170), mantendo a proporção do SVG.
// Velocidade do ticker do Fuel: 462px em 9,24s = 50px/s (medido na animação dele).
const LOGO_SPEED = 50;
// Tamanhos pensados para SVGs com recorte justo. Se os novos logos vierem centralizados pelo meio óptico (com folga em cima/embaixo),
// a altura aqui precisa acompanhar a proporção do novo frame (h = w x altura / largura do SVG).
const LOGOS = [
  { file: "ingresse.svg", w: 99, h: 16 }, // 153 x 25
  { file: "ticket.svg", w: 34, h: 34 }, // 60 x 60
  { file: "santander.svg", w: 104, h: 17 }, // 158 x 26
  // { file: "sioux.svg", w: 0, h: 0 }, // falta o SVG da Sioux: entra aqui, entre Santander e Unico
  { file: "unico.svg", w: 72, h: 15 }, // 94 x 20
  { file: "petlove.svg", w: 89, h: 20 }, // 131 x 29
  { file: "vetsmart.svg", w: 114, h: 17.2 }, // 166 x 25 (109 + 5%, proporção exata 6,64:1)
  { file: "publicis.svg", w: 90.8, h: 38.7 }, // 160 x 68
  // fora da fileira por enquanto: bradesco.svg (99 x 19)
];
// Posição das duas imagens em relação ao texto: "none" (sem fotos), "before" (antes), "after" (depois) ou "inline" (dentro da frase).
const ABOUT_IMAGES: "none" | "before" | "after" | "inline" = "none";

// Miniaturas dentro do texto: aparecem logo depois da primeira ocorrência da palavra-chave.
const INLINE_IMAGES = [
  { key: "Product Designer", src: "/about/allexis.png", pos: "50% 22%" },
  { key: "Petlove", src: "/about/vetsmart-store.png", pos: "50% 50%" },
];
const THUMB_W = 56;
const THUMB_H = 38;

function withInlineImages(text: string, used: Set<string>): React.ReactNode[] {
  if (ABOUT_IMAGES !== "inline") return [text];
  const hit = INLINE_IMAGES.filter((m) => !used.has(m.key) && text.includes(m.key))
    .map((m) => ({ ...m, end: text.indexOf(m.key) + m.key.length }))
    .sort((a, b) => a.end - b.end);
  const out: React.ReactNode[] = [];
  let from = 0;
  for (const m of hit) {
    used.add(m.key);
    out.push(text.slice(from, m.end));
    out.push(
      // eslint-disable-next-line @next/next/no-img-element
      <img
        key={m.key}
        src={m.src}
        alt=""
        style={{
          display: "inline-block",
          width: THUMB_W,
          height: THUMB_H,
          objectFit: "cover",
          objectPosition: m.pos,
          borderRadius: 6,
          verticalAlign: "-0.22em",
          margin: "0 0.3em",
        }}
      />,
    );
    from = m.end;
  }
  out.push(text.slice(from));
  return out;
}

export default function Home() {
  const { lang } = useLang();
  const href = useHref();
  const about = lang === "pt" ? aboutPt : USE_NEW_ABOUT ? aboutEnNew : aboutEnOld;

  // "Scroll down..." some conforme o usuário começa a rolar
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  // Sobre: a imagem abre em tela cheia, fica presa (sticky) e fecha as laterais até a largura do conteúdo.
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const imgBlockRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLElement>(null);
  const darkRef = useRef<HTMLDivElement>(null);
  const contactTextRef = useRef<HTMLDivElement>(null);
  const contactFooterRef = useRef<HTMLDivElement>(null);
  // chips do contato: caem uma vez só, quando a frase já está quase toda visível
  const chipsFiredRef = useRef(false);
  const [chipsIn, setChipsIn] = useState(false);
  const logoWrapRef = useRef<HTMLDivElement>(null);
  const aboutVideoRef = useRef<HTMLVideoElement>(null);
  // Contato: o preto sobe pelo canto direito primeiro; o lado esquerdo vem atrás e equaliza (como no Fuel)
  useEffect(() => {
    const clamp = (n: number) => Math.min(1, Math.max(0, n));
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const update = () => {
      const sec = contactRef.current;
      const dark = darkRef.current;
      const text = contactTextRef.current;
      if (!sec || !dark || !text) return;
      const vh = window.innerHeight;
      const rect = sec.getBoundingClientRect();
      // 0 quando o topo da seção entra pela base da janela; 1 quando ele chega a ~15% do topo
      const p = clamp((vh - rect.top) / (vh * 0.85));
      const right = easeOut(clamp(p * 1.25));
      const left = easeInOut(clamp((p - 0.12) / 0.88));
      dark.style.clipPath = `polygon(0% ${(1 - left) * 100}%, 100% ${(1 - right) * 100}%, 100% 100%, 0% 100%)`;
      text.style.opacity = String(clamp((p - 0.55) / 0.35));
      if (contactFooterRef.current) contactFooterRef.current.style.opacity = String(clamp((p - 0.7) / 0.3));
      text.style.transform = `translateY(${(1 - clamp((p - 0.55) / 0.35)) * 24}px)`;
      // os chips caem logo depois que a frase já está quase toda visível
      if (p > 0.82 && !chipsFiredRef.current) {
        chipsFiredRef.current = true;
        setChipsIn(true);
      }
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // Logos: com o mouse em cima, o carrossel desacelera de forma suave (e volta ao normal ao sair)
  useEffect(() => {
    const wrap = logoWrapRef.current;
    const track = wrap?.querySelector<HTMLElement>(".logo-track");
    if (!wrap || !track) return;
    let target = 1;
    let rate = 1;
    let raf = 0;
    const tick = () => {
      rate += (target - rate) * 0.08;
      if (Math.abs(target - rate) < 0.005) rate = target;
      track.getAnimations().forEach((a) => (a.playbackRate = rate));
      if (rate !== target) raf = requestAnimationFrame(tick);
    };
    const set = (t: number) => {
      target = t;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };
    const enter = () => set(0.6);
    const leave = () => set(1);
    wrap.addEventListener("mouseenter", enter);
    wrap.addEventListener("mouseleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      wrap.removeEventListener("mouseenter", enter);
      wrap.removeEventListener("mouseleave", leave);
    };
  }, []);

  // o vídeo só toca quando o bloco aparece na tela
  useEffect(() => {
    const v = aboutVideoRef.current;
    if (!v) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.25 }
    );
    obs.observe(v);
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    const clamp = (n: number) => Math.min(1, Math.max(0, n));
    const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
    const TOP_END = 64;
    // No Safari do iOS, innerHeight muda durante a rolagem (a barra de endereço
    // encolhe e a tela "cresce" ~80px). Como a margem do conteúdo é calculada a
    // partir dela, o bloco pulava a cada troca. Congelamos a altura e só
    // atualizamos quando a LARGURA muda — ou seja, giro de tela / resize de verdade.
    // ...mas congelar o innerHeight do carregamento também erra: com as barras à
    // mostra ele é ~180px menor que o 100vh do CSS que dimensiona o sticky, e aí
    // sobra um buraco. Medimos o 100vh do CSS — o mesmo valor que o sticky usa.
    const sonda = document.createElement("div");
    sonda.style.cssText = "position:absolute;top:0;left:0;width:0;height:100vh;pointer-events:none;visibility:hidden";
    document.body.appendChild(sonda);
    const medirVh = () => sonda.offsetHeight || window.innerHeight;
    let vhEstavel = medirVh();
    let larguraAnterior = window.innerWidth;
    const update = () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      const block = imgBlockRef.current;
      const content = contentRef.current;
      if (!section || !track || !block || !content) return;
      const vw = window.innerWidth;
      if (vw !== larguraAnterior) {
        larguraAnterior = vw;
        vhEstavel = medirVh();
      }
      const vh = vhEstavel;
      const cs = getComputedStyle(content);
      const cw = content.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const startH = vw * (9 / 16);
      const endH = cw * (9 / 16);
      const rect = track.getBoundingClientRect();
      const p = clamp(-rect.top / (rect.height - vh));
      const e = easeInOut(p);
      const dark = ABOUT_DARK ? easeInOut(clamp(p / 0.85)) : 0;
      const mix = (a: number, b: number) => Math.round(a + (b - a) * dark);
      section.style.background = `rgb(${mix(246, 17)}, ${mix(246, 17)}, ${mix(245, 17)})`;
      // a entrada do conteúdo agora é feita só pelos Reveals (mola); antes o bloco inteiro aparecia com fade preso ao scroll do vídeo
      content.style.opacity = "1";
      const startTop = 0;
      block.style.width = `${vw + (cw - vw) * e}px`;
      block.style.height = `${startH + (endH - startH) * e}px`;
      block.style.top = `${startTop + (TOP_END - startTop) * e}px`;
      block.style.borderRadius = `${8 * e}px`;
      // no mobile o texto do About sobe mais perto do vídeo
      content.style.marginTop = `${TOP_END + endH + (vw < 768 ? 28 : 100) - vh}px`;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      sonda.remove();
    };
  }, []);
  // Sobre fica sempre sobre o painel escuro, então as cores são fixas.
  const fg = ABOUT_DARK ? "#E4E4E4" : "#222";
  const mute = "#8D8D8D";
  const dim = ABOUT_DARK ? "#666666" : "#8D8D8D";
  const lineColor = ABOUT_DARK ? "#2E2E2E" : "#E6E6E6";
  const dotBg = ABOUT_DARK ? "#111" : "#fff";

  const scrollHintOpacity = Math.max(0, 1 - scrollY / 25);

  return (
    <div className="min-h-screen bg-[#F6F6F5]" style={{ color: "#222", fontFamily: "inherit", overflowX: "clip" }}>

      <Nav />

      <div className="px-6 md:px-10" style={{ maxWidth: 1440, margin: "0 auto" }}>

        {/* Hero — ocupa a tela (abaixo do nav) e centraliza o texto verticalmente, um pouco acima do centro */}
        <section className="hero-sec relative flex flex-col items-center justify-center">
          <div className="hero-frases">
            <HeroPhrases />
          </div>

          {/* aviso de scroll — some assim que o usuário começa a rolar.
              Estático — seta à direita do texto, sem animação própria
              (evita competir com o motion do Hero). */}
          <div
            className="hero-hint flex items-center"
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              opacity: scrollHintOpacity,
              transition: "opacity 0.2s ease",
              pointerEvents: scrollHintOpacity < 0.1 ? "none" : "auto",
              gap: 5,
            }}
          >
            <span
              style={{
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: "-0.21px",
                color: "#8D8D8D",
                whiteSpace: "nowrap",
              }}
            >
              See the work
            </span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="#8D8D8D"
              stroke="#8D8D8D"
              strokeWidth="0.5"
              style={{ flexShrink: 0 }}
            >
              <path d="M12 21.2501C11.81 21.2501 11.62 21.1801 11.47 21.0301L5.4 14.9601C5.11 14.6701 5.11 14.1901 5.4 13.9001C5.69 13.6101 6.17 13.6101 6.46 13.9001L12 19.4401L17.54 13.9001C17.83 13.6101 18.31 13.6101 18.6 13.9001C18.89 14.1901 18.89 14.6701 18.6 14.9601L12.53 21.0301C12.38 21.1801 12.19 21.2501 12 21.2501Z" />
              <path d="M12 21.08C11.59 21.08 11.25 20.74 11.25 20.33V3.5C11.25 3.09 11.59 2.75 12 2.75C12.41 2.75 12.75 3.09 12.75 3.5V20.33C12.75 20.74 12.41 21.08 12 21.08Z" />
            </svg>
          </div>
        </section>

        {/* Thumbs dos projetos — revela ao rolar.
            Mobile: grid estático simples (não tem mouse, não faz sentido magnificar).
            Desktop: fileira com magnificação estilo Dock/geenie (ThumbsRow). */}
        <section className="pb-[72px] md:pb-[160px]">
          {/* Mobile: lista como a do v1 (nome à esquerda, categoria à direita, sem thumbs), com o tipo e as divisórias do v2 */}
          <div className="md:hidden">
            {projects.map((p, i) => (
              <Reveal key={i} delay={i * 35} triggerMargin="0%">
                <a
                  href={href(p.href)}
                  className="flex items-baseline justify-between gap-4"
                  // sem régua no último item (igual à ProjectsList do desktop)
                  style={{ padding: "24px 0", borderBottom: i === projects.length - 1 ? "none" : "1px solid #DEDEDE", textDecoration: "none" }}
                >
                  <span style={{ fontSize: 20, fontWeight: 400, letterSpacing: "-0.45px", lineHeight: "29px", color: "#222" }}>{p.title}</span>
                  <span style={{ fontSize: 14, fontWeight: 400, letterSpacing: "-0.1px", color: "#8D8D8D", whiteSpace: "nowrap" }}>{p.category}</span>
                </a>
              </Reveal>
            ))}
          </div>
          <div className="hidden md:block">
            <ProjectsList items={projects} />
          </div>
        </section>

        {/* Sobre + Experiência — seção preta; a imagem abre em tela cheia, fica presa e fecha as laterais ao rolar */}
        <section ref={sectionRef} style={{ position: "relative", marginLeft: "calc(50% - 50vw)", width: "100vw", background: "#F6F6F5", paddingBottom: 100 }}>
          <div ref={trackRef} className="reel-track" style={{ position: "relative" }}>
            <div style={{ position: "sticky", top: 0, height: "100vh" }}>
              <div
                ref={imgBlockRef}
                style={{ position: "absolute", left: "50%", transform: "translateX(-50%) translateZ(0)", width: "100vw", height: "60vh", top: 0, overflow: "hidden", background: "#F6F6F5", isolation: "isolate", willChange: "width, height, top, border-radius" }}
              >
                <video
                  ref={aboutVideoRef}
                  src={ABOUT_VIDEO}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  onEnded={(e) => {
                    // garante o loop mesmo se o navegador ignorar o atributo (vídeo longo ou com fragmento #t)
                    e.currentTarget.currentTime = 0;
                    e.currentTarget.play().catch(() => {});
                  }}
                  className="block h-full w-full object-cover"
                  style={{ transform: "scale(1.012)" }}
                />
              </div>
            </div>
          </div>
          <div ref={contentRef} className="px-6 md:px-10" style={{ maxWidth: 1440, margin: "0 auto" }}>
              {BIG_ABOUT && SHOW_ABOUT_TEXT && REF_LAYOUT && (() => {
                const first = about[0].map((s) => (typeof s === "string" ? s : s.h)).join("");
                const cut = first.indexOf(",");
                // destaque = primeira oração (até a vírgula); o resto da frase abre o bloco menor
                const big = cut > 0 ? first.slice(0, cut) : first;
                // quebra fixa em duas linhas: "Product Designer with" / "end-to-end experience"
                const brk = big.indexOf(" end-to-end");
                const bigLines = brk > 0 ? [big.slice(0, brk), big.slice(brk + 1)] : [big];
                const rest = cut > 0 ? first.slice(cut + 1).trim() : "";
                const restCap = rest ? rest.charAt(0).toUpperCase() + rest.slice(1) : "";
                const small = [restCap, ...about.slice(1).map((segs) => segs.map((s) => (typeof s === "string" ? s : s.h)).join(""))].filter(Boolean);
                return (
                  <div className="md:grid" style={{ gridTemplateColumns: "auto max-content minmax(0, 1fr)", columnGap: 72, alignItems: "start" }}>
                    <span
                      style={{
                        display: "block",
                        fontSize: 15,
                        fontWeight: 400,
                        letterSpacing: "-0.1px",
                        color: fg, transition: "color 0.5s ease",
                      }}
                    >
                      About
                    </span>
                    <p
                      className="mt-6 md:mt-0"
                      style={{
                        fontSize: "clamp(26px, 2.8vw, 40px)",
                        fontWeight: 400,
                        letterSpacing: "-0.04em",
                        lineHeight: 1.05,
                        color: fg, transition: "color 0.5s ease",
                      }}
                    >
                      {bigLines.map((l, i) => (
                        <span key={i} style={{ display: "block", whiteSpace: "nowrap" }}>
                          {l}
                        </span>
                      ))}
                    </p>
                    <div
                      className="mt-8 md:mt-2"
                      style={{
                        maxWidth: 640,
                        fontSize: 20,
                        fontWeight: 400,
                        letterSpacing: "-0.45px",
                        lineHeight: "29px",
                        color: fg, transition: "color 0.5s ease",
                      }}
                    >
                      {small.map((t, i) => (
                        <p key={i} style={{ marginTop: i > 0 ? "1.2em" : 0 }}>
                          {t}
                        </p>
                      ))}
                    </div>
                  </div>
                );
              })()}
              {BIG_ABOUT && SHOW_ABOUT_TEXT && STATEMENT_LAYOUT && (
                <div>
                  {/* About (arquitetura do layout anterior): rótulo na coluna da esquerda; a partir dos 20% da largura,
                      o texto e, embaixo dele, uma foto só. Tipografia: frase de abertura grande + parágrafos de 20px. */}
                  {INTERNAL_ABOUT ? (
                    // Estrutura e tipografia das internas (TwoCol): coluna de 42% | 1fr, gap 64/96px, recuo lateral de 20px;
                    // título 36px/44px/-0,72px (peso 500); corpo 24px/36px/-0,24px (peso 400); 32px entre parágrafos.
                    <div className="md:px-5">
                      {SHOW_ABOUT_LABEL && (
                        <span style={{ display: "block", textTransform: "uppercase", fontSize: 14, fontWeight: 400, letterSpacing: "0.02em", color: "#8D8D8D", marginBottom: 32 }}>
                          About
                        </span>
                      )}
                      {/* o respiro vai na coluna da direita (ela define a altura da linha do grid, que é o alcance do sticky):
                          a segurada da coluna da esquerda dura (altura da linha − altura da coluna presa) */}
                      {/* o Tailwind não está gerando classes novas nesta sessão; media query na mão */}
                      <style>{`
                        @media (min-width: 768px) { .about-texto { padding-bottom: 120px; } }
                        /* mesmos valores do .about-texto: 19/29/-0.19 → 24/36/-0.24 */
                        .contato-frase { font-size: 19px; line-height: 29px; letter-spacing: -0.19px; }
                        /* Timeline. No mobile as três colunas somavam 370px em 327 disponíveis:
                           a empresa colapsava pra zero e o cargo vazava. Vira duas linhas. */
                        .exp-linha {
                          display: grid; align-items: center;
                          grid-template-columns: minmax(0, 1fr) auto;
                          grid-template-areas: "empresa data" "cargo cargo";
                          column-gap: 16px; row-gap: 2px;
                        }
                        .exp-data { grid-area: data; text-align: right; }
                        .exp-empresa { grid-area: empresa; }
                        .exp-cargo { grid-area: cargo; }
                        @media (min-width: 768px) {
                          .exp-linha {
                            grid-template-columns: 110px minmax(0, 1fr) 180px;
                            grid-template-areas: "data empresa cargo";
                            column-gap: 40px;
                          }
                          .exp-data { text-align: left; }
                          .exp-cargo { text-align: right; white-space: nowrap; }
                        }
                        /* Pista do vídeo do About: 140vh no desktop dá 325px de scroll
                           pro efeito. No mobile 122vh dá 179px — o mesmo efeito, mais rápido. */
                        .reel-track { height: 140vh; }
                        @media (max-width: 767px) { .reel-track { height: 122vh; } }
                        /* Hero. 100vh no Safari do iOS inclui a área atrás da barra de baixo,
                           então o aviso de scroll ficava embaixo dela. dvh mede só o visível. */
                        .hero-sec { min-height: calc(100vh - 90px); }
                        @supports (height: 100dvh) { .hero-sec { min-height: calc(100dvh - 90px); } }
                        /* foto do About: o gap-8 da coluna deixava 32px até a frase.
                           (o md:mt-5 que estava aqui computava 0 — classe não gerada) */
                        @media (min-width: 768px) { .about-foto { margin-top: -4px; } }
                        .hero-frases { transform: translateY(-28%); }
                        .hero-hint { bottom: calc(40px + env(safe-area-inset-bottom)); }
                        @media (max-width: 767px) {
                          .hero-frases { transform: translateY(-26%); }
                          .hero-hint { bottom: calc(32px + env(safe-area-inset-bottom)); }
                        }
                        /* grid do contato: 1 coluna no mobile, texto + links no desktop */
                        /* minmax(0,1fr): sem isso a coluna cresce até caber o e-mail e corta no mobile */
                        .contato-grid { display: grid; grid-template-columns: minmax(0, 1fr); }
                        .contato-grid > * { min-width: 0; }
                        /* e-mail: no celular 28px (cabe inteiro em 375); no desktop o corpo do hero */
                        .contato-email { font-size: 28px; line-height: 34px; letter-spacing: -0.84px; gap: 8px; }
                        .contato-email svg { width: 20px; height: 20px; margin-top: 8px; }
                        @media (min-width: 768px) {
                          .contato-email { font-size: 46px; line-height: 48.3px; letter-spacing: -1.38px; gap: 12px; }
                          /* 12, nao 9: alinha pelo centro da altura-x, que e 3px abaixo do centro da maiuscula */
                          .contato-email svg { width: 32px; height: 32px; margin-top: 12px; }
                        }
                        /* lista da direita: mesma régua da lista de projetos, em claro sobre escuro */
                        /* sem max-width: a régua tem que morrer na mesma guia dos outros blocos */
                        .contato-links { display: block; margin-bottom: 20px; }
                        .contato-links a {
                          display: flex; align-items: center; justify-content: space-between;
                          gap: 24px; padding: 14px 0;
                          border-bottom: 0.5px solid rgba(244, 244, 242, 0.18);
                          color: #8D8D8D; text-decoration: none;
                          transition: color 0.3s ease, border-color 0.3s ease;
                        }
                        .contato-links a:last-child { border-bottom: none; }
                        .contato-links a:hover { color: #F4F4F2; }
                        /* ícone sempre visível, no lugar do thumb da lista de projetos */
                        .contato-links a img, .contato-links a svg { opacity: 0.55; flex-shrink: 0; transition: opacity 0.3s ease; }
                        .contato-links a:hover img, .contato-links a:hover svg { opacity: 1; }
                        /* duas colunas só a partir de 1100: abaixo disso a coluna esquerda
                           fica menor que os 535px do e-mail em 46px e ele amassa */
                        @media (min-width: 1100px) {
                          .contato-grid { grid-template-columns: minmax(0, 1fr) 320px; align-items: end; }
                          /* com items-end, a margem embaixo é o que levanta o texto da esquerda */
                          .contato-esq { margin-bottom: 90px; }
                        }
                        /* 32 em vez dos 36 do About: são 2 linhas curtas, 36 soltava demais */
                        @media (min-width: 768px) { .contato-frase { font-size: 24px; line-height: 32px; letter-spacing: -0.24px; } }
                        /* mesma animação da seta do allexis.vercel.app */
                        @keyframes arrow-nudge {
                          0%, 40%, 100% { transform: translate(0px); }
                          20% { transform: translate(10px); }
                        }
                        .arrow-animate {
                          display: inline-flex;
                          will-change: transform;
                          animation: arrow-nudge 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                        }
                        @media (prefers-reduced-motion: reduce) { .arrow-animate { animation: none; } }
                      `}</style>
                      <div className="grid grid-cols-1 gap-x-16 gap-y-6 md:grid-cols-[42%_1fr] lg:gap-x-24" style={{ color: fg, transition: "color 0.5s ease" }}>
                        {/* coluna da esquerda: o título e, logo abaixo (como no começo), a foto redonda; aparece com o Reveal (fade + subida leve).
                            A coluna inteira fica presa (sticky) enquanto o texto da direita rola. */}
                        {/* o `top` vem inline: o md:top-24 (96px) prendia a frase baixa demais */}
                        <div className="flex flex-col gap-8 md:sticky md:self-start" style={{ top: 72 }}>
                          <Reveal delay={50} triggerMargin="0%">
                            <h2
                              className="text-[29px] leading-[38px] tracking-[-0.58px] md:text-[36px] md:leading-[44px] md:tracking-[-0.72px]"
                              style={{ fontWeight: 500, color: "#222" }}
                            >
                              {about[0].map((s) => (typeof s === "string" ? s : s.h)).join("")}
                            </h2>
                          </Reveal>
                          <Reveal delay={0} triggerMargin="0%" className="about-foto">
                            {/* círculo de 198px com a allexis2 (foto casual em preto e branco); o flip com o kanji está desligado por enquanto (FlipPhoto + public/about/kanji.png guardados) */}
                            <div
                              className="relative h-[153px] w-[153px] overflow-hidden md:h-[198px] md:w-[198px]"
                              style={{ borderRadius: "50%", background: "#CFCFCF" }}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src="/about/allexis2.png"
                                alt=""
                                className="absolute inset-0 h-full w-full object-cover"
                                style={{ objectPosition: "50% 40%" }}
                              />
                            </div>
                          </Reveal>
                        </div>
                        {/* texto da direita: cada parágrafo entra com a mesma mola da lista de projetos, em cascata depois do título */}
                        <div
                          className="about-texto text-[19px] leading-[29px] tracking-[-0.19px] md:text-[24px] md:leading-[36px] md:tracking-[-0.24px]"
                          style={{ fontWeight: 400, color: "#222" }}
                        >
                          {about.slice(1).map((segs, i) => (
                            <Reveal key={i} delay={80 + i * 70} triggerMargin="0%">
                              <p style={{ marginTop: i === 0 ? 0 : 32 }}>
                                {segs.map((s) => (typeof s === "string" ? s : s.h)).join("")}
                              </p>
                            </Reveal>
                          ))}
                          {/* Referência A: ano à esquerda (caixa alta, miúdo) + empresa e cargo empilhados; régua fina entre as linhas */}
                          {SHOW_EXP_ROWS && EXP_LAYOUT === "ref-frase" && (
                            <div style={{ marginTop: 72 }}>
                              {experiences.map((exp, i) => (
                                // mesma cascata da lista de projetos (35ms por item)
                                <Reveal key={exp.company} delay={i * 35} triggerMargin="0%">
                                  <div
                                    // larguras fixas (cada linha é um grid próprio: com "auto" o cargo começaria num x diferente por linha)
                                    // colunas e ordem vêm do .exp-linha: no mobile empresa+data em cima e cargo embaixo
                                    className="exp-linha"
                                    style={{ padding: "26px 0", borderBottom: i === experiences.length - 1 ? "none" : "1px solid #DEDEDE" }}
                                  >
                                    {/* mesma escala e mesma régua da lista de projetos (20px/-0,45px/29px, 14px/-0,1px/21px, #DEDEDE) */}
                                    {/* data com tracking largo (escolha visual, destoa do 0,02em que o site usa noutros lugares); tabular pra os dígitos alinharem */}
                                    <div className="exp-data" style={{ fontSize: 12, fontWeight: 400, letterSpacing: "0.08em", lineHeight: "21px", color: "#8D8D8D", fontVariantNumeric: "tabular-nums" }}>
                                      {anos(exp.period[lang])}
                                    </div>
                                    <div className="exp-empresa" style={{ fontSize: 20, fontWeight: 400, letterSpacing: "-0.45px", lineHeight: "29px", color: "#222" }}>{exp.company}</div>
                                    <div className="exp-cargo" style={{ fontSize: 14, fontWeight: 400, letterSpacing: "-0.1px", lineHeight: "21px", color: "#8D8D8D" }}>{exp.role}</div>
                                  </div>
                                </Reveal>
                              ))}
                              {SHOW_DEPOIMENTOS && <Depoimentos />}
                            </div>
                          )}
                          {/* Referência B: ano à esquerda + cargo grande (hierarquia por escala) e empresa miúda embaixo; sem réguas */}
                          {SHOW_EXP_ROWS && EXP_LAYOUT === "ref-destaque" && (
                            <div style={{ marginTop: 72 }}>
                              {experiences.map((exp) => (
                                <div
                                  key={exp.company}
                                  style={{ display: "grid", gridTemplateColumns: "130px minmax(0, 1fr)", columnGap: 32, alignItems: "baseline", padding: "26px 0" }}
                                >
                                  <div style={{ fontSize: 16, fontWeight: 400, letterSpacing: "-0.1px", color: "#8D8D8D", fontVariantNumeric: "tabular-nums" }}>
                                    {anos(exp.period[lang])}
                                  </div>
                                  <div>
                                    <div style={{ fontSize: 28, fontWeight: 500, letterSpacing: "-0.6px", lineHeight: "34px", color: "#222" }}>{exp.role}</div>
                                    <div style={{ fontSize: 15, fontWeight: 400, letterSpacing: "-0.1px", color: "#8D8D8D", marginTop: 4 }}>{exp.company}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          {/* Timeline vertical dentro da coluna que rola: ela passa enquanto o título e a foto ficam presos à esquerda */}
                          {SHOW_EXP_ROWS && EXP_LAYOUT === "vertical-sticky" && (
                            <div style={{ marginTop: 72 }}>
                              {experiences.map((exp, i) => (
                                <div
                                  key={exp.company}
                                  style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", alignItems: "center", columnGap: 24, position: "relative", padding: "26px 0" }}
                                >
                                  {/* trilho e bolinha ficam pendurados na margem (fora do bloco), pra empresa cair na mesma linha guia dos parágrafos */}
                                  <div aria-hidden style={{ position: "absolute", left: -44, top: 0, bottom: 0, width: 7 }}>
                                    <div style={{ position: "absolute", left: 3, width: 1, background: "#DDDDDD", top: i === 0 ? "50%" : 0, bottom: i === experiences.length - 1 ? "50%" : 0 }} />
                                    <div style={{ position: "absolute", left: 0, top: "50%", marginTop: -3.5, width: 7, height: 7, borderRadius: "50%", background: "#F6F6F5", border: "1px solid #7A7A7A" }} />
                                  </div>
                                  <div>
                                    <div style={{ fontSize: 20, fontWeight: 400, letterSpacing: "-0.45px", lineHeight: "29px", color: "#222" }}>{exp.company}</div>
                                    <div style={{ fontSize: 14, fontWeight: 400, letterSpacing: "-0.1px", color: "#8D8D8D", marginTop: 2 }}>{exp.role}</div>
                                  </div>
                                  <div style={{ fontSize: 14, fontWeight: 400, letterSpacing: "-0.1px", color: "#8D8D8D" }}>{exp.period[lang]}</div>
                                </div>
                              ))}
                            </div>
                          )}
                          {/* Experience em lista (como no print): empresa em cima; cargo e período embaixo, com divisória fina */}
                          {SHOW_EXP_ROWS && EXP_LAYOUT === "list" && (
                            <div style={{ marginTop: 64 }}>
                              {experiences.map((exp, i) => (
                                <Reveal key={exp.company} delay={i * 60} triggerMargin="0%">
                                  <div style={{ padding: "20px 0 18px", borderBottom: "1px solid #E4E4E1" }}>
                                    <div style={{ fontSize: 20, fontWeight: 500, letterSpacing: "-0.45px", lineHeight: "29px", color: "#222" }}>{exp.company}</div>
                                    <div className="flex items-baseline justify-between" style={{ marginTop: 2, fontSize: 14, fontWeight: 400, letterSpacing: "-0.1px", color: "#8D8D8D" }}>
                                      <span>{exp.role}</span>
                                      <span>{exp.period[lang]}</span>
                                    </div>
                                  </div>
                                </Reveal>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                  {/* About em 3 blocos na horizontal: rótulo | foto | texto */}
                  <div className="md:grid" style={{ gridTemplateColumns: "auto 330px minmax(0, 1fr)", columnGap: 96, alignItems: "start" }}>
                    <span style={{ display: "block", textTransform: "uppercase", fontSize: 12, fontWeight: 500, letterSpacing: "0.06em", color: "#222" }}>
                      About
                    </span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/about/allexis.png"
                      alt=""
                      className="my-6 w-[220px] md:my-0 md:w-[330px]"
                      style={{ aspectRatio: "4 / 5", objectFit: "cover", borderRadius: 10, display: "block" }}
                    />
                    <div style={{ color: fg, transition: "color 0.5s ease" }}>
                      <div style={{ fontSize: "clamp(20px, 1.8vw, 26px)", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.4 }}>
                        {about.map((segs, i) => (
                          <p key={i} style={{ marginTop: i > 0 ? 28 : 0 }}>
                            {segs.map((s) => (typeof s === "string" ? s : s.h)).join("")}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                    </>
                  )}
                  {SHOW_EXP_ROWS && EXP_LAYOUT === "vertical" && (
                    // Experience na 2ª coluna do About (a do texto "Throughout my career…"): mesma grade 42% | 1fr; a linha do tempo
                    // (período | bolinha | empresa | cargo) começa onde o texto começa.
                    <div className="md:px-5" style={{ marginTop: 96 }}>
                      <div className="grid grid-cols-1 gap-x-16 md:grid-cols-[42%_1fr] lg:gap-x-24">
                        <div className="hidden md:block" />
                        <div>
                          {experiences.map((exp, i) => (
                            <div
                              key={exp.company}
                              className="md:grid"
                              style={{ gridTemplateColumns: "150px 56px minmax(0, 1fr) minmax(0, 1fr)", alignItems: "center", position: "relative", padding: "30px 0" }}
                            >
                              <div className="md:text-right md:pr-5" style={{ fontSize: 14, fontWeight: 400, letterSpacing: "-0.1px", color: "#8D8D8D" }}>{exp.period[lang]}</div>
                              <div className="hidden md:block" style={{ position: "relative", alignSelf: "stretch" }}>
                                <div
                                  aria-hidden
                                  style={{ position: "absolute", left: 24, width: 1, background: "#DDDDDD", top: i === 0 ? "50%" : -30, bottom: i === experiences.length - 1 ? "50%" : -30 }}
                                />
                                <div style={{ position: "absolute", left: 21, top: "50%", marginTop: -3.5, width: 7, height: 7, borderRadius: "50%", background: "#F6F6F5", border: "1px solid #7A7A7A" }} />
                              </div>
                              <div style={{ fontSize: 20, fontWeight: 400, letterSpacing: "-0.45px", lineHeight: "29px", color: fg }}>{exp.company}</div>
                              <div style={{ fontSize: 14, fontWeight: 400, letterSpacing: "-0.1px", color: "#8D8D8D" }}>{exp.role}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  {SHOW_EXP_ROWS && EXP_LAYOUT === "horizontal" && (
                    // Mobile: a mesma timeline na vertical (linha à esquerda, uma bolinha por empresa, empresa, cargo e período empilhados).
                    <div className="md:hidden" style={{ marginTop: 72 }}>
                      <div style={{ position: "relative" }}>
                        <div aria-hidden style={{ position: "absolute", left: 3, top: 14, bottom: 14, width: 1, background: "#DDDDDD" }} />
                        {experiences.map((exp, i) => (
                          <div key={exp.company} style={{ position: "relative", paddingLeft: 28, paddingBottom: i === experiences.length - 1 ? 0 : 36 }}>
                            <div style={{ position: "absolute", left: 0, top: 11, width: 7, height: 7, borderRadius: "50%", background: "#F6F6F5", border: "1px solid #7A7A7A" }} />
                            <div style={{ fontSize: 20, fontWeight: 400, letterSpacing: "-0.45px", lineHeight: "29px", color: "#222" }}>{exp.company}</div>
                            <div style={{ fontSize: 14, fontWeight: 400, letterSpacing: "-0.1px", color: "#8D8D8D", marginTop: 2 }}>{exp.role}</div>
                            <div style={{ fontSize: 14, fontWeight: 400, letterSpacing: "-0.1px", color: "#8D8D8D" }}>{exp.period[lang]}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {SHOW_EXP_ROWS && EXP_LAYOUT === "horizontal" && (
                    // Timeline horizontal (a do v1): linha fina com uma bolinha por empresa; um tamanho só (16px), hierarquia pelo peso e pela cor.
                    // Anda para o lado quando não cabe. Só no desktop (no mobile é a vertical acima).
                    <div className="hidden md:block md:px-5" style={{ marginTop: "clamp(112px, 13vw, 190px)" }}>
                      <div className="overflow-x-auto pb-2" style={{ scrollbarWidth: "none", scrollSnapType: "x proximity" }}>
                        <div className="grid" style={{ position: "relative", gridAutoFlow: "column", gridAutoColumns: "minmax(200px, 1fr)", columnGap: 0 }}>
                          <div aria-hidden style={{ position: "absolute", top: 3.5, left: 0, right: 0, height: 1, background: "#DDDDDD" }} />
                          {experiences.map((exp) => (
                            <div key={exp.company} style={{ position: "relative", paddingRight: 24, scrollSnapAlign: "start" }}>
                              <div
                                style={{ width: 7, height: 7, borderRadius: "50%", background: "#F6F6F5", border: "1px solid #7A7A7A", position: "relative", zIndex: 1 }}
                              />
                              <div style={{ marginTop: 32 }}>
                                <p style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.005em", lineHeight: "24px", color: "#222" }}>{exp.company}</p>
                                <p style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.005em", lineHeight: "24px", color: "#8D8D8D", marginTop: 4 }}>{exp.role}</p>
                                <p style={{ fontSize: 16, fontWeight: 400, letterSpacing: "-0.005em", lineHeight: "24px", color: "#8D8D8D", marginTop: 4 }}>{exp.period[lang]}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  {SHOW_LOGOS && (
                    <div style={{ marginTop: "clamp(64px, 7vw, 104px)", marginLeft: "calc(50% - 50vw)", width: "100vw" }}>
                      <style>{`
                        @keyframes logo-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
                        .logo-track { animation: logo-marquee 38s linear infinite; }
                        @media (prefers-reduced-motion: reduce) { .logo-track { animation: none; } }
                      `}</style>
                      {/* logos passando de lado, em cinza (referência: Fuel); as bordas esmaecem */}
                      <div
                        ref={logoWrapRef}
                        className="overflow-hidden"
                      >
                        <div className="logo-track flex w-max items-center" style={{ animationDuration: `${(LOGOS.length * (227 + 10)) / LOGO_SPEED}s` }}>
                          {[...LOGOS, ...LOGOS].map((l, i) => (
                            // bloco cinza por logo (referência Fuel): 227x170 (4:3), 5px de raio, 10px entre blocos, #ECECE9 sobre o cinza da seção (#F6F6F5)
                            <div
                              key={i}
                              className="flex items-center justify-center"
                              style={{ width: 227, height: 170, marginRight: 10, flexShrink: 0, borderRadius: 5, background: "#ECECE9" }}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={`/logos/${l.file}`}
                                alt=""
                                aria-hidden
                                style={{ height: l.h, width: l.w, objectFit: "contain", filter: "brightness(0)", opacity: 0.84 }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {BIG_ABOUT && SHOW_ABOUT_TEXT && !REF_LAYOUT && !STATEMENT_LAYOUT && (
                <div
                  className="md:grid md:px-5"
                  style={{
                    gridTemplateColumns: SHOW_EXP_ROWS ? "minmax(0, 620px) minmax(0, 1fr)" : "minmax(0, 1fr)", // About na largura do texto; Experience fica com o resto
                    columnGap: 96,
                    alignItems: "start",
                  }}
                >
                  {/* About: título em cima, texto embaixo (à esquerda) */}
                  <div>
                    <span
                      style={{
                        display: SHOW_ABOUT_LABEL ? "block" : "none",
                        textTransform: "uppercase",
                        fontSize: 15,
                        fontWeight: 400,
                        letterSpacing: "1px",
                        marginBottom: 24,
                        color: fg, transition: "color 0.5s ease",
                      }}
                    >
                      About
                    </span>
                    <div
                      style={{
                        maxWidth: 620,
                        // estilo dos títulos das páginas internas, em 32px / 40px e peso 400
                        fontSize: "clamp(18px, 1.5vw, 22px)",
                        fontWeight: 400,
                        letterSpacing: "-0.02em",
                        lineHeight: "clamp(26px, 2.15vw, 31px)",
                        color: fg, transition: "color 0.5s ease",
                      }}
                    >
                      {(() => {
                        const used = new Set<string>();
                        return about.map((segs, i) => (
                          <p key={i} style={{ marginTop: i > 0 ? 28 : 0 }}>
                            {withInlineImages(segs.map((s) => (typeof s === "string" ? s : s.h)).join(""), used)}
                          </p>
                        ));
                      })()}
                    </div>
                  </div>
                  {/* Experience: mesmo padrão, ao lado do About */}
                  {SHOW_EXP_ROWS && (
                    <div className="mt-16 md:mt-0">
                      <span
                        style={{
                          display: "block",
                          textTransform: "uppercase",
                          fontSize: 15,
                          fontWeight: 400,
                          letterSpacing: "1px",
                          marginBottom: 24,
                          color: fg, transition: "color 0.5s ease",
                        }}
                      >
                        Experience
                      </span>
                      <div>
                        {experiences.map((exp, ei) => (
                          // a 1ª linha começa na mesma altura da 1ª linha do texto do About (3px compensam a diferença de entrelinha)
                          <div key={exp.company} style={{ padding: ei === 0 ? "3px 0 16px" : "18px 0 16px", borderBottom: "1px solid #E4E4E1" }}>
                            <div style={{ fontSize: 18, fontWeight: 500, letterSpacing: "-0.13px", lineHeight: "26px", color: fg, transition: "color 0.5s ease" }}>
                              {exp.company}
                            </div>
                            <div className="flex items-baseline justify-between" style={{ fontSize: 18, fontWeight: 400, letterSpacing: "-0.13px", lineHeight: "26px", color: "#8D8D8D", marginTop: 2 }}>
                              <span>{exp.role}</span>
                              <span style={{ fontSize: 14, letterSpacing: "-0.1px", fontVariantNumeric: "tabular-nums" }}>{exp.period[lang]}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className="md:grid" style={{ display: BIG_ABOUT ? "none" : undefined, gridTemplateColumns: TEXT_ONLY ? "1fr" : "96px 200px minmax(0, 560px)", columnGap: 32, width: TEXT_ONLY ? undefined : "fit-content", maxWidth: "100%", margin: TEXT_ONLY ? undefined : "0 auto", alignItems: "start" }}>
                <span
                  className="uppercase"
                  style={{
                    display: TEXT_ONLY ? "none" : "block",
                    fontFamily: "var(--font-geist-mono)",
                    fontSize: 12,
                    fontWeight: 400,
                    letterSpacing: "0.02em",
                    color: fg, transition: "color 0.5s ease",
                  }}
                >
                  About
                </span>
                <div className={TEXT_ONLY ? "hidden" : "mt-6 grid grid-cols-2 gap-4 md:mt-0 md:flex md:flex-col"}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/about/allexis.png"
                    alt=""
                    className="w-full object-cover"
                    style={{ borderRadius: 6, aspectRatio: "4 / 5" }}
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/about/vetsmart-store.png"
                    alt=""
                    className="w-full object-cover"
                    style={{ borderRadius: 6, aspectRatio: "3 / 2" }}
                  />
                </div>
                <div
                  className="mt-6 md:mt-0"
                  style={{
                    maxWidth: TEXT_ONLY ? "none" : 560,
                    fontSize: 20,
                    fontWeight: 400,
                    letterSpacing: "-0.45px",
                    lineHeight: "29px",
                    color: fg, transition: "color 0.5s ease",
                  }}
                >
                  {[about.slice(0, 2), about.slice(2)].map((block, bi) => (
                    <div key={bi} style={{ marginTop: bi > 0 ? (TEXT_ONLY ? "1.4em" : 36) : 0 }}>
                      {block.map((segs, i) => (
                        <p key={i} style={{ marginTop: i > 0 ? "1.4em" : 0 }}>
                          {segs.map((s) => (typeof s === "string" ? s : s.h)).join("")}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
                <div className={SHOW_EXPERIENCE ? "mt-12 md:mt-0" : "hidden"}>
                  <span
                    className="uppercase"
                    style={{
                      display: "block",
                      marginBottom: 28,
                      fontFamily: "var(--font-geist-mono)",
                      fontSize: 12,
                      fontWeight: 400,
                      letterSpacing: "0.02em",
                      color: fg, transition: "color 0.5s ease",
                    }}
                  >
                    {LABELS.experience[lang]}
                  </span>
                  <div className="mt-10 md:mt-0">
                  {/* Desktop: fileira horizontal — data | bolinha+linha | empresa | cargo */}
                  <div className="relative hidden md:flex md:flex-col" style={{ gap: 40, ["--date-col" as string]: "140px", ["--co-col" as string]: "220px" }}>
                    <div
                      style={{
                        position: "absolute",
                        left: "calc(var(--date-col) + 16px)",
                        top: 20,
                        bottom: 20,
                        width: 1,
                        background: lineColor,
                      }}
                    />
                    {experiences.map((exp, i) => (
                      <div
                        key={i}
                        className="relative grid md:grid-cols-[var(--date-col)_var(--co-col)_1fr] md:items-center"
                        style={{ columnGap: 32 }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            left: "calc(var(--date-col) + 16px)",
                            top: "50%",
                            transform: "translate(-50%, -50%)",
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            background: dotBg,
                            border: "1px solid #5C5C5C",
                            zIndex: 1,
                          }}
                        />
                        <span
                          style={{ fontSize: 12, fontWeight: 400, letterSpacing: "0.02em", color: dim, transition: "color 0.5s ease", whiteSpace: "nowrap" }}
                        >
                          {exp.period.pt}
                        </span>
                        <span style={{ fontSize: 20, fontWeight: 400, letterSpacing: "-0.13px", color: fg, transition: "color 0.5s ease", marginLeft: 32, paddingRight: 32 }}>
                          {exp.company}
                        </span>
                        <span style={{ fontSize: 14, fontWeight: 400, letterSpacing: "-0.21px", color: mute, transition: "color 0.5s ease", whiteSpace: "nowrap" }}>
                          {exp.role}
                        </span>
                      </div>
                    ))}
                  </div>
  
                  {/* Mobile: timeline vertical */}
                  <div className="md:hidden">
                    {experiences.map((exp, i) => (
                      <div key={i} style={{ display: "flex", gap: 16 }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                          <div
                            style={{
                              width: 7,
                              height: 7,
                              borderRadius: "50%",
                              background: dotBg,
                              border: "1px solid #5C5C5C",
                              flexShrink: 0,
                              marginTop: 4,
                              zIndex: 1,
                            }}
                          />
                          {i < experiences.length - 1 && (
                            <div style={{ width: 1, background: lineColor, flex: 1, marginTop: 6 }} />
                          )}
                        </div>
                        <div style={{ paddingBottom: i < experiences.length - 1 ? 28 : 0 }}>
                          <p
                            style={{ fontSize: 12, fontWeight: 400, letterSpacing: "0.02em", color: dim, transition: "color 0.5s ease" }}
                          >
                            {exp.period.pt}
                          </p>
                          <p style={{ fontSize: 20, fontWeight: 400, letterSpacing: "-0.13px", color: fg, transition: "color 0.5s ease", marginTop: 4 }}>
                            {exp.company}
                          </p>
                          <p style={{ fontSize: 14, fontWeight: 400, letterSpacing: "-0.21px", color: mute, transition: "color 0.5s ease", marginTop: 4 }}>
                            {exp.role}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                </div>
              </div>
          </div>
        </section>

        {/* Empresas — escondido por enquanto, repensando o layout.
        <section style={{ paddingTop: 60, paddingBottom: 220 }}>
          <div style={{ maxWidth: "65%", margin: "0 auto" }}>
            <div style={{ height: 1, background: "#E6E6E6", marginBottom: 60 }} />
            <LogosCarousel />
            <div style={{ height: 1, background: "#E6E6E6", marginTop: 60 }} />
          </div>
        </section>
        */}

        {SHOW_CONTACT && (
          <>
        {/* Contato: seção escura; o preto sobe pelo canto direito e o esquerdo equaliza */}
        <section
          ref={contactRef}
          id="contato"
          style={{ position: "relative", marginLeft: "calc(50% - 50vw)", width: "100vw", minHeight: "100vh", overflow: "hidden", background: "#F6F6F5" }}
        >
          <div
            ref={darkRef}
            aria-hidden
            style={{ position: "absolute", inset: 0, background: "#111", clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)", willChange: "clip-path" }}
          >
            {/* reel apagado atrás do texto — mesmo arquivo do About, então não baixa de novo.
                Vai dentro do painel escuro pra ser recortado junto com ele na subida. */}
            {SHOW_CONTACT_REEL && (
              <video
                src={ABOUT_VIDEO}
                autoPlay
                loop
                muted
                playsInline
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.15, pointerEvents: "none" }}
              />
            )}
          </div>
          <div
            className="px-6 md:px-10"
            style={{ position: "relative", maxWidth: 1440, margin: "0 auto", minHeight: "100vh", display: "flex", alignItems: "center" }}
          >
            {/* dois blocos (como no Fuel): o texto à esquerda e, à direita, uma lista de links com divisórias finas */}
            <div
              ref={contactTextRef}
              className="contato-grid w-full items-end gap-x-16 gap-y-10 md:px-5"
              style={{ opacity: 0 }}
            >
              <div className="contato-esq">
              <div
                className="contato-frase"
                style={{
                  maxWidth: 1120,
                  // apoio em regular; o peso 500 fica só no e-mail
                  // (tamanho, entrelinha e tracking vêm do .contato-frase, iguais ao About)
                  fontWeight: 400,
                  // a frase virou apoio; o e-mail embaixo é que carrega o peso
                  color: "#8D8D8D",
                }}
              >
                <ContactPhrases lang={lang} />
              </div>
              {/* e-mail por extenso, sublinhado — o alvo de clique da seção */}
              <a
                href="mailto:allexistsuda@gmail.com"
                className="contato-email"
                style={{
                  justifySelf: "start",
                  display: "inline-flex",
                  alignItems: "flex-start",
                  // frase e e-mail agora dividem o mesmo wrapper: o espaço é só este
                  marginTop: 8,
                  // corpo, entrelinha, tracking e tamanho da seta vêm do .contato-email (responsivo)
                  fontWeight: 500,
                  color: "#F4F4F2",
                  textDecoration: "none",
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#8D8D8D")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#F4F4F2")}
              >
                {/* mesma seta do resto do site (public/icons/seta-contato.svg), em currentColor */}
                {/* a margem que centra a seta vem só do .contato-email svg (responsiva) — aqui ela dobrava */}
                <span style={{ display: "inline-flex", flexShrink: 0 }}>
                  <svg width="32" height="32" viewBox="0 0 25 25" fill="none" aria-hidden>
                    <path
                      d="M4.5 12.5H20.5M20.5 12.5L13.5 5.5M20.5 12.5L13.5 19.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                {/* o sublinhado fica só no texto; a seta não entra nele */}
                <span
                  style={{
                    textDecoration: "underline",
                    textUnderlineOffset: 6,
                    textDecorationThickness: 1,
                  }}
                >
                  allexistsuda@gmail.com
                </span>
              </a>
              </div>
              {/* coluna da direita: links secundários, alinhados pela base do e-mail */}
              <nav
                aria-label="Links"
                className="contato-links"
                style={{ fontSize: 20, letterSpacing: "-0.45px", lineHeight: "29px", color: "#8D8D8D" }}
              >
                {[
                  { label: "LinkedIn", href: "https://www.linkedin.com/in/allexis-tsuda-a99ab18/", icon: "/icons/linkedin.svg" },
                  { label: "Instagram", href: "https://www.instagram.com/allexistsuda", icon: "/icons/instagram.svg" },
                  { label: "Resume", href: RESUME_URL, icon: null },
                ].map((item) => (
                  <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer">
                    <span>{item.label}</span>
                    {item.icon ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.icon} alt="" width={22} height={22} />
                    ) : (
                      // não existe ícone de currículo em public/icons; este é inline.
                      // branco chumbado como nos outros dois arquivos — currentColor deixava ele escuro demais
                      // caixa do LinkedIn (20x20) com as linhas do documento dentro, só que com menos raio (5 em vez de 7)
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <rect x="2" y="2" width="20" height="20" rx="5" stroke="#ffffff" strokeWidth="1.5" />
                        <path d="M7.8 9h8.4M7.8 12.5h8.4M7.8 16h5" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    )}
                  </a>
                ))}
              </nav>
              {SHOW_CONTACT_CHIPS && <ContactChips lang={lang} show={chipsIn} />}
              {SHOW_CONTACT_LINKS && (
              <nav aria-label="Social" className="md:-mt-[12.6px]">
                <a href="mailto:allexistsuda@gmail.com" className="group flex items-center justify-between hover:opacity-70 transition-opacity duration-300 ease-out" style={{ padding: "16px 0", borderBottom: "1px solid rgba(244,244,242,0.18)", color: "#F4F4F2", fontWeight: 400, fontSize: 20, letterSpacing: "-0.45px", lineHeight: "29px" }}>
                  <span>Email</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/icons/email.svg" alt="" width={22} height={22} className="transition-transform duration-300 ease-out group-hover:-translate-y-0.5" />
                </a>
                <a href="https://www.linkedin.com/in/allexis-tsuda-a99ab18/" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between hover:opacity-70 transition-opacity duration-300 ease-out" style={{ padding: "16px 0", borderBottom: "1px solid rgba(244,244,242,0.18)", color: "#F4F4F2", fontWeight: 400, fontSize: 20, letterSpacing: "-0.45px", lineHeight: "29px" }}>
                  <span>LinkedIn</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/icons/linkedin.svg" alt="" width={22} height={22} className="transition-transform duration-300 ease-out group-hover:-translate-y-0.5" />
                </a>
                <a href="https://www.instagram.com/allexistsuda" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between hover:opacity-70 transition-opacity duration-300 ease-out" style={{ padding: "16px 0", borderBottom: "1px solid rgba(244,244,242,0.18)", color: "#F4F4F2", fontWeight: 400, fontSize: 20, letterSpacing: "-0.45px", lineHeight: "29px" }}>
                  <span>Instagram</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/icons/instagram.svg" alt="" width={22} height={22} className="transition-transform duration-300 ease-out group-hover:-translate-y-0.5" />
                </a>
              </nav>
              )}
            </div>
          </div>
          {/* rodapé: linha fina, © à esquerda; links e "voltar ao topo" à direita (aparece junto do texto) */}
          {SHOW_CONTACT_FOOTER && (
          <div
            ref={contactFooterRef}
            className="px-6 md:px-10"
            style={{ position: "absolute", left: 0, right: 0, bottom: 0, opacity: 0 }}
          >
            <div
              className="mx-auto flex flex-wrap items-center justify-between gap-x-8 gap-y-2"
              style={{ maxWidth: 1360, borderTop: "0.5px solid rgba(244,244,242,0.18)", padding: "20px 0 28px", fontSize: 13, letterSpacing: "-0.1px", color: "#8D8D8D" }}
            >
              <span>Allexis Tsuda — Product Designer</span>
              <span>
                {lang === "pt" ? "Em São Paulo, Brasil" : "Based in São Paulo, Brazil"}
              </span>
            </div>
          </div>
          )}
        </section>
          </>
        )}

      </div>
    </div>
  );
}
