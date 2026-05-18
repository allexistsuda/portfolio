import Link from "next/link";
import BottomNav from "../components/BottomNav";
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

export default function SantanderDesignSystem() {
  return (
    <div className="min-h-screen bg-[#F2F2F2]" style={{ color: "#222" }}>
      <Nav />

      <div className="px-6 md:px-10 mx-auto" style={{ maxWidth: 1440, paddingTop: 32 }}>

        {/* Video */}
        <div className="mb-8 md:mb-[100px]">
          <VideoPlayer videoId="ZhN6ttPgI-c" thumbnail="/santander/thumb.png" />
        </div>

        {/* Flame */}
        <TwoCol heading="Flame">
          <p>
            Atuação no time de Design System do Santander, contribuindo para a evolução de
            componentes, bibliotecas compartilhadas e padrões utilizados em diferentes produtos da
            companhia.
          </p>
          <p style={{ marginTop: 32 }}>
            Participação na construção de um novo Design System global para diferentes países,
            apoiando a consistência e escalabilidade da experiência.
          </p>
        </TwoCol>

        <BottomNav prev={{ label: "Unico You", href: "/unico-you" }} next={{ label: "Santander Workshops", href: "/santander-workshops" }} />

      </div>
    </div>
  );
}
