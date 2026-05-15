import Link from "next/link";
import Nav from "../components/Nav";
import VideoPlayer from "../components/VideoPlayer";

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

export default function SantanderWorkshops() {
  return (
    <div className="min-h-screen bg-[#F2F2F2]" style={{ color: "#222" }}>
      <Nav />

      <div className="px-6 md:px-10 mx-auto" style={{ maxWidth: 1440, paddingTop: 32 }}>

        {/* All images */}
        <div className="my-8 md:my-[100px]" style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <div style={{ display: "flex", gap: 32 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/santander-workshops/01.jpg" alt="Santander Workshops" style={{ width: "calc(50% - 16px)", height: "auto", display: "block", borderRadius: 16 }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/santander-workshops/02.jpg" alt="Santander Workshops" style={{ width: "calc(50% - 16px)", height: "auto", display: "block", borderRadius: 16 }} />
          </div>
          <VideoPlayer videoId="z0vpfWb699Q" thumbnail="/santander-workshops/05.png" />
          <div style={{ display: "flex", gap: 32 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/santander-workshops/03.jpg" alt="Santander Workshops" style={{ width: "calc(50% - 16px)", height: "auto", display: "block", borderRadius: 16 }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/santander-workshops/04.jpg" alt="Santander Workshops" style={{ width: "calc(50% - 16px)", height: "auto", display: "block", borderRadius: 16 }} />
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/santander-workshops/06.png" alt="Santander Workshops" style={{ width: "100%", height: "auto", display: "block", borderRadius: 16 }} />
        </div>

        {/* Workshops text */}
        <TwoCol heading="Workshops">
          <p>
            Criação e condução de workshops internos voltados à disseminação de boas práticas,
            utilização de Design Systems e fortalecimento de uma cultura de design orientada por dados.
          </p>
          <p style={{ marginTop: 32 }}>
            As apresentações envolveram mais de 50 designers, promovendo alinhamento entre diferentes
            squads e maior consistência na construção de produtos digitais.
          </p>
        </TwoCol>

        {/* Bottom navigation */}
        <div className="flex items-center justify-between my-8 md:my-[100px]">
          <Link
            href="/santander-design-system"
            className="flex items-center gap-3 hover:opacity-60 transition-opacity duration-200"
            style={{ textDecoration: "none" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontSize: 26, fontWeight: 400, letterSpacing: "-0.13px", color: "#222" }}>
              Santander Design System
            </span>
          </Link>
          <Link
            href="/vet-smart-tv"
            className="flex items-center gap-3 hover:opacity-60 transition-opacity duration-200"
            style={{ textDecoration: "none" }}
          >
            <span style={{ fontSize: 26, fontWeight: 400, letterSpacing: "-0.13px", color: "#222" }}>
              Vet Smart TV
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
