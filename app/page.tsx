import Image from "next/image";
import TypingHero from "./components/TypingHero";
import HighlightText from "./components/HighlightText";

const projects = [
  { title: "Vet Smart", category: "Mobile" },
  { title: "Unico You", category: "Mobile" },
  { title: "Santander Design System", category: "Design System" },
  { title: "Santander Workshops", category: "Design Ops" },
  { title: "Vet Smart TV", category: "Web" },
];

const experiences = [
  { company: "Ticket", role: "Product Designer", period: "set/2024 – dez/2025" },
  { company: "Santander", role: "Product Designer", period: "jul/2022 – jul/2024" },
  { company: "Lojacorr", role: "Head of Design", period: "jun/2021 – jul/2022" },
  { company: "Sioux", role: "Product Designer", period: "jan/2021 – jun/2021" },
  { company: "Unico ID", role: "Head of Product", period: "out/2019 – dez/2020" },
  { company: "Vet Smart", role: "Head of Design", period: "out/2015 – out/2019" },
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
  return (
    <div className="min-h-screen bg-[#F6F6F5]" style={{ color: "#222", fontFamily: "inherit" }}>

      {/* Nav — 90px tall */}
      <nav
        className="mx-auto px-6 md:px-10"
        style={{ maxWidth: 1440, height: 90, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", alignItems: "center" }}
      >
        <div><Image src="/logo.png" alt="Allexis Tsuda" width={140} height={30} priority /></div>
        <div className="invisible md:visible" style={{ textAlign: "center" }}>
          <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.21px", color: "#8D8D8D" }}>
            UI/UX Designer
          </span>
        </div>
        <div style={{ textAlign: "right" }}>
          <a href="#contato" style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.21px", color: "#222" }}>
            Contato
          </a>
        </div>
      </nav>

      <div className="px-6 md:px-10" style={{ maxWidth: 1440, margin: "0 auto" }}>

        {/* Hero */}
        <section style={{ paddingTop: 80, paddingBottom: 100 }}>
          <TypingHero />
        </section>

        {/* Projetos */}
        <section style={{ paddingBottom: 100 }}>
          <Tag label="PROJETOS" />
          <div style={{ marginTop: 32 }}>
            {projects.map((p, i) => (
              <div
                key={i}
                className="flex items-center justify-between"
                style={{
                  height: 64,
                  borderTop: i > 0 ? "1px dashed #4F4F4F" : "none",
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.21px", color: "#222" }}>
                  {p.title}
                </span>
                <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.21px", color: "#999" }}>
                  {p.category}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Sobre */}
        <section style={{ paddingBottom: 100 }}>
          <Tag label="SOBRE" />
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
            <p>
              Atuação end-to-end em produtos digitais, passando por{" "}
              <HighlightText>
                discovery, definição de jornadas, prototipação e evolução de produtos.
              </HighlightText>
            </p>
            <p style={{ marginTop: "1.4em" }}>
              Vivência em empresas do segmento financeiro, SaaS e startups, com foco em soluções
              orientadas a negócio.{" "}
              <HighlightText>
                Experiência com Design System, discovery, validação com usuários e uso de IA para
                acelerar pesquisa, fluxos e protótipos.
              </HighlightText>
            </p>
            <p style={{ marginTop: "1.4em" }}>
              Co-fundador e Product Designer do{" "}
              <HighlightText>Vet Smart</HighlightText>, empresa adquirida pela Petlove em 2019.
              Participei também da criação do{" "}
              <HighlightText>Unico You</HighlightText> e atuei por 2 anos no time de Design System
              do <HighlightText>Santander</HighlightText>.
            </p>
          </div>
        </section>

        {/* Experiência */}
        <section style={{ paddingBottom: 100 }}>
          <Tag label="EXPERIÊNCIA" />

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
                      {exp.period}
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
                    {exp.period}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contato */}
        <section id="contato" style={{ paddingBottom: 96 }}>
          <Tag label="CONTATO" />
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
