"use client";

import Nav from "./components/Nav";
import TypingHero from "./components/TypingHero";
import { useLang, useHref } from "./i18n/lang";
import { Segs, type Seg } from "./i18n/render";

const projects = [
  { title: "Vet Smart", category: "Mobile", href: "/vet-smart" },
  { title: "Unico You", category: "Mobile", href: "/unico-you" },
  { title: "Santander Design System", category: "Design System", href: "/santander-design-system" },
  { title: "Santander Workshops", category: "Design Ops", href: "/santander-workshops" },
  { title: "Vet Smart TV", category: "Web", href: "/vet-smart-tv" },
];

const experiences: {
  company: string;
  role: string;
  period: { pt: string; en: string };
}[] = [
  { company: "Ticket", role: "Product Designer", period: { pt: "set/2024 – dez/2025", en: "Sep 2024 – Dec 2025" } },
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

function Tag({ label }: { label: string }) {
  return (
    <span
      className="inline-block bg-[#222] text-white uppercase"
      style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0, padding: "4px 8px" }}
    >
      {label}
    </span>
  );
}

export default function Home() {
  const { lang } = useLang();
  const href = useHref();
  const about = lang === "pt" ? aboutPt : aboutEn;

  return (
    <div className="min-h-screen bg-[#F6F6F5]" style={{ color: "#222", fontFamily: "inherit" }}>

      <Nav />

      <div className="px-6 md:px-10" style={{ maxWidth: 1440, margin: "0 auto" }}>

        {/* Hero */}
        <section style={{ paddingTop: 80, paddingBottom: 100 }}>
          <TypingHero />
        </section>

        {/* Projetos */}
        <section style={{ paddingBottom: 100 }}>
          <Tag label={LABELS.projects[lang]} />
          <div style={{ marginTop: 32 }}>
            {projects.map((p, i) => (
              <a
                key={i}
                href={href(p.href)}
                className="flex items-center justify-between hover:opacity-60 transition-opacity duration-200"
                style={{
                  height: 64,
                  borderTop: i > 0 ? "1px dashed #4F4F4F" : "none",
                  textDecoration: "none",
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.21px", color: "#222" }}>
                  {p.title}
                </span>
                <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.21px", color: "#999" }}>
                  {p.category}
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* Sobre */}
        <section style={{ paddingBottom: 100 }}>
          <Tag label={LABELS.about[lang]} />
          <div
            style={{
              marginTop: 32,
              fontSize: 26,
              fontWeight: 400,
              letterSpacing: "-0.13px",
              lineHeight: 1.4,
              color: "#222",
            }}
          >
            {about.map((segs, i) => (
              <p key={i} style={{ marginTop: i > 0 ? "1.4em" : 0 }}>
                <Segs segs={segs} />
              </p>
            ))}
          </div>
        </section>

        {/* Experiência */}
        <section style={{ paddingBottom: 100 }}>
          <Tag label={LABELS.experience[lang]} />

          {/* Desktop: horizontal timeline */}
          <div className="hidden md:block" style={{ marginTop: 36, position: "relative" }}>
            <div
              style={{
                position: "absolute",
                top: 3.5,
                left: 0,
                right: 0,
                height: 1,
                background: "#DDDDDD",
              }}
            />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)" }}>
              {experiences.map((exp, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "#fff",
                      border: "1px solid #7A7A7A",
                      position: "relative",
                      zIndex: 1,
                    }}
                  />
                  <div style={{ marginTop: 32 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.21px", color: "#222" }}>
                      {exp.company}
                    </p>
                    <p style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.21px", color: "#8D8D8D", marginTop: 6 }}>
                      {exp.role}
                    </p>
                    <p style={{ fontSize: 14, fontWeight: 400, letterSpacing: "-0.21px", color: "#8D8D8D", marginTop: 6 }}>
                      {exp.period[lang]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: vertical timeline */}
          <div className="md:hidden" style={{ marginTop: 32 }}>
            {experiences.map((exp, i) => (
              <div key={i} style={{ display: "flex", gap: 16 }}>
                {/* Line + circle column */}
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
                    <div style={{ width: 1, background: "#DDDDDD", flex: 1, marginTop: 6 }} />
                  )}
                </div>
                {/* Text */}
                <div style={{ paddingBottom: i < experiences.length - 1 ? 28 : 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.21px", color: "#222" }}>
                    {exp.company}
                  </p>
                  <p style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.21px", color: "#8D8D8D", marginTop: 4 }}>
                    {exp.role}
                  </p>
                  <p style={{ fontSize: 14, fontWeight: 400, letterSpacing: "-0.21px", color: "#8D8D8D", marginTop: 4 }}>
                    {exp.period[lang]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contato */}
        <section id="contato" style={{ paddingBottom: 96 }}>
          <Tag label={LABELS.contact[lang]} />
          <div className="flex items-center" style={{ marginTop: 20, gap: 12 }}>
            <span className="arrow-animate" style={{ display: "inline-flex", flexShrink: 0 }}>
              <svg className="w-[20px] h-[20px] md:w-[33px] md:h-[33px]" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.5 12.5H20.5M20.5 12.5L13.5 5.5M20.5 12.5L13.5 19.5" stroke="#222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <a
              href="mailto:allexistsuda@gmail.com"
              className="hover:opacity-60 transition-opacity duration-200 text-[26px] md:text-[60px]"
              style={{
                fontWeight: 400,
                letterSpacing: "-0.02em",
                color: "#222",
                textDecoration: "none",
              }}
            >
              allexistsuda@gmail.com
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}
