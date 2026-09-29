"use client";

import { useEffect, useState } from "react";
import Nav from "./components/Nav";
import HeroPhrases from "./components/HeroPhrases";
import Reveal from "./components/Reveal";
import ThumbsRow from "./components/ThumbsRow";
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
  { title: "Unico You", category: "Mobile", href: "/unico-you", thumb: "/thumbs/unico-you.webp" },
  { title: "Santander Design System", category: "Design System", href: "/santander-design-system", thumb: "/thumbs/santander-design-system.png", video: "/thumbs/santander-design-system.mp4", bg: "#ED0000" },
  { title: "Santander Workshops", category: "Design Ops", href: "/santander-workshops", thumb: "/thumbs/santander-workshops.jpg" },
  { title: "Vet Smart TV", category: "Web", href: "/vet-smart-tv", thumb: "/thumbs/vet-smart-tv.webp" },
];

const experiences: {
  company: string;
  role: string;
  period: { pt: string; en: string };
}[] = [
  { company: "Ticket", role: "Product Designer", period: { pt: "set/2024 – fev/2026", en: "Sep 2024 – Feb 2026" } },
  { company: "Santander", role: "Product Designer", period: { pt: "jul/2022 – jul/2024", en: "Jul 2022 – Jul 2024" } },
  { company: "Lojacorr", role: "Head of Design", period: { pt: "jun/2021 – jul/2022", en: "Jun 2021 – Jul 2022" } },
  { company: "Sioux", role: "Product Designer", period: { pt: "jan/2021 – jun/2021", en: "Jan 2021 – Jun 2021" } },
  { company: "Unico ID", role: "Head of Product", period: { pt: "out/2019 – dez/2020", en: "Oct 2019 – Dec 2020" } },
  { company: "Vet Smart", role: "Head of Design", period: { pt: "out/2015 – out/2019", en: "Oct 2015 – Oct 2019" } },
];

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

const aboutEn: Seg[][] = [
  [
    "End-to-end work on digital products, spanning ",
    { h: "discovery, journey mapping, prototyping and product evolution." },
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

export default function Home() {
  const { lang } = useLang();
  const href = useHref();
  const about = lang === "pt" ? aboutPt : aboutEn;

  // "Scroll down..." some conforme o usuário começa a rolar
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const scrollHintOpacity = Math.max(0, 1 - scrollY / 120);

  return (
    <div className="min-h-screen bg-[#F6F6F5]" style={{ color: "#222", fontFamily: "inherit", overflowX: "clip" }}>

      <Nav />

      <div className="px-6 md:px-10" style={{ maxWidth: 1440, margin: "0 auto" }}>

        {/* Hero — ocupa a tela (abaixo do nav) e centraliza o texto verticalmente, um pouco acima do centro */}
        <section
          className="relative flex flex-col items-center justify-center"
          style={{ minHeight: "calc(100vh - 90px)" }}
        >
          <div style={{ transform: "translateY(-28%)" }}>
            <HeroPhrases />
          </div>

          {/* aviso de scroll — mesmo peso do antigo "UI/UX Designer", mas em medium.
              Estático (sem entrada própria), mas some assim que o usuário começa a rolar. */}
          <span
            className="absolute left-1/2"
            style={{
              bottom: 40,
              transform: "translateX(-50%)",
              opacity: scrollHintOpacity,
              transition: "opacity 0.2s ease",
              pointerEvents: scrollHintOpacity < 0.1 ? "none" : "auto",
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: "-0.21px",
              color: "#8D8D8D",
              textAlign: "center",
            }}
          >
            Explore meus projetos
          </span>
        </section>

        {/* Thumbs dos projetos — revela ao rolar.
            Mobile: grid estático simples (não tem mouse, não faz sentido magnificar).
            Desktop: fileira com magnificação estilo Dock/geenie (ThumbsRow). */}
        <section style={{ paddingBottom: 160 }}>
          <div className="grid grid-cols-2 gap-4 md:hidden">
            {projects.map((p, i) => (
              <Reveal key={i} delay={i * 100}>
                <a
                  href={href(p.href)}
                  className="group block overflow-hidden rounded-[12px] aspect-[4/5]"
                  style={{ textDecoration: "none" }}
                >
                  {p.thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.thumb}
                      alt={p.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-[#DADADA]" />
                  )}
                </a>
              </Reveal>
            ))}
          </div>
          <div className="hidden md:block">
            <ThumbsRow items={projects} />
          </div>
        </section>

        {/* Sobre */}
        <section style={{ paddingBottom: 160 }}>
          <Reveal subtle triggerMargin="-10%">
            <div className="md:grid" style={{ gridTemplateColumns: "90px 1fr", columnGap: 56, maxWidth: "65%", margin: "0 auto" }}>
              <div>
                <span
                  className="uppercase"
                  style={{
                    fontFamily: "var(--font-geist-mono)",
                    fontSize: 12,
                    fontWeight: 400,
                    letterSpacing: "0.02em",
                    color: "#222",
                  }}
                >
                  {LABELS.about[lang]}
                </span>
              </div>
              <div
                className="mt-4 md:mt-0"
                style={{
                  fontSize: 20,
                  fontWeight: 400,
                  letterSpacing: "-0.45px",
                  lineHeight: "29px",
                  color: "#222",
                }}
              >
                {about.map((segs, i) => (
                  <p key={i} style={{ marginTop: i > 0 ? "1.4em" : 0 }}>
                    {segs.map((s) => (typeof s === "string" ? s : s.h)).join("")}
                  </p>
                ))}
                {/* duas fotos lado a lado fecham o bloco de Sobre: retrato pessoal +
                    resultado real do que foi construído (loja Vet Smart/Petlove) */}
                <div className="flex" style={{ marginTop: 48, gap: 8 }}>
                  <div style={{ width: 208, aspectRatio: "1 / 1", borderRadius: 8, overflow: "hidden" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/about/allexis.webp"
                      alt="Allexis Tsuda"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div style={{ width: 208, aspectRatio: "1 / 1", borderRadius: 8, overflow: "hidden" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/about/vetsmart-store-full.webp"
                      alt="Loja Vet Smart / Petlove"
                      className="h-full w-full object-cover"
                      style={{ transform: "scale(1.03)" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* Experiência */}
        <section style={{ paddingBottom: 160 }}>
          <Reveal subtle triggerMargin="-10%">
            <div className="md:grid" style={{ gridTemplateColumns: "90px 1fr", columnGap: 56, maxWidth: "65%", margin: "0 auto" }}>
              <div>
                <span
                  className="uppercase"
                  style={{
                    fontFamily: "var(--font-geist-mono)",
                    fontSize: 12,
                    fontWeight: 400,
                    letterSpacing: "0.02em",
                    color: "#222",
                  }}
                >
                  {LABELS.experience[lang]}
                </span>
              </div>
              <div className="mt-4 md:mt-0">
                {/* Desktop: fileira horizontal — data | bolinha+linha | empresa | cargo */}
                <div className="relative hidden md:flex md:flex-col" style={{ gap: 40 }}>
                  <div
                    style={{
                      position: "absolute",
                      left: 156,
                      top: 20,
                      bottom: 20,
                      width: 1,
                      background: "#E6E6E6",
                    }}
                  />
                  {experiences.map((exp, i) => (
                    <div
                      key={i}
                      className="relative grid md:grid-cols-[140px_220px_1fr] md:items-center"
                      style={{ columnGap: 32 }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          left: 156,
                          top: "50%",
                          transform: "translate(-50%, -50%)",
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          background: "#fff",
                          border: "1px solid #7A7A7A",
                          zIndex: 1,
                        }}
                      />
                      <span
                        style={{ fontSize: 12, fontWeight: 400, letterSpacing: "0.02em", color: "#8D8D8D", whiteSpace: "nowrap" }}
                      >
                        {exp.period[lang]}
                      </span>
                      <span style={{ fontSize: 20, fontWeight: 400, letterSpacing: "-0.13px", color: "#222", marginLeft: 32, paddingRight: 32 }}>
                        {exp.company}
                      </span>
                      <span style={{ fontSize: 14, fontWeight: 400, letterSpacing: "-0.21px", color: "#8D8D8D" }}>
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
                            background: "#fff",
                            border: "1px solid #7A7A7A",
                            flexShrink: 0,
                            marginTop: 4,
                            zIndex: 1,
                          }}
                        />
                        {i < experiences.length - 1 && (
                          <div style={{ width: 1, background: "#E6E6E6", flex: 1, marginTop: 6 }} />
                        )}
                      </div>
                      <div style={{ paddingBottom: i < experiences.length - 1 ? 28 : 0 }}>
                        <p
                          style={{ fontSize: 12, fontWeight: 400, letterSpacing: "0.02em", color: "#8D8D8D" }}
                        >
                          {exp.period[lang]}
                        </p>
                        <p style={{ fontSize: 20, fontWeight: 400, letterSpacing: "-0.13px", color: "#222", marginTop: 4 }}>
                          {exp.company}
                        </p>
                        <p style={{ fontSize: 14, fontWeight: 400, letterSpacing: "-0.21px", color: "#8D8D8D", marginTop: 4 }}>
                          {exp.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
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

        {/* Contato */}
        <section id="contato" style={{ paddingBottom: 120 }}>
          <Reveal subtle triggerMargin="-10%">
          <div className="md:grid" style={{ gridTemplateColumns: "90px 1fr", columnGap: 56, maxWidth: "65%", margin: "0 auto" }}>
            <div>
              <span
                className="uppercase"
                style={{
                  fontFamily: "var(--font-geist-mono)",
                  fontSize: 12,
                  fontWeight: 400,
                  letterSpacing: "0.02em",
                  color: "#222",
                }}
              >
                {LABELS.contact[lang]}
              </span>
            </div>
            <div
              className="mt-4 md:mt-0"
              style={{
                fontSize: 20,
                fontWeight: 400,
                letterSpacing: "-0.45px",
                lineHeight: "29px",
                color: "#222",
              }}
            >
              {lang === "pt" ? (
                <>
                  Quer trabalhar junto ou conversar sobre produto?
                  <br />
                  Manda um oi pra{" "}
                  <a
                    href="mailto:allexistsuda@gmail.com"
                    className="hover:opacity-60 transition-opacity duration-300 ease-out"
                    style={{ color: "#222", textDecoration: "underline", textUnderlineOffset: "3px", textDecorationThickness: "1px" }}
                  >
                    allexistsuda@gmail.com
                  </a>{" "}
                  ou no{" "}
                  <a
                    href="https://www.linkedin.com/in/allexistsuda"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-60 transition-opacity duration-300 ease-out"
                    style={{ color: "#222", textDecoration: "underline", textUnderlineOffset: "3px", textDecorationThickness: "1px" }}
                  >
                    LinkedIn
                  </a>
                  .
                </>
              ) : (
                <>
                  Want to work together, or talk about product?
                  <br />
                  Say hi at{" "}
                  <a
                    href="mailto:allexistsuda@gmail.com"
                    className="hover:opacity-60 transition-opacity duration-300 ease-out"
                    style={{ color: "#222", textDecoration: "underline", textUnderlineOffset: "3px", textDecorationThickness: "1px" }}
                  >
                    allexistsuda@gmail.com
                  </a>{" "}
                  or on{" "}
                  <a
                    href="https://www.linkedin.com/in/allexistsuda"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-60 transition-opacity duration-300 ease-out"
                    style={{ color: "#222", textDecoration: "underline", textUnderlineOffset: "3px", textDecorationThickness: "1px" }}
                  >
                    LinkedIn
                  </a>
                  .
                </>
              )}
            </div>
          </div>
          </Reveal>
        </section>

      </div>
    </div>
  );
}
