import Image from "next/image";
import Link from "next/link";

export default function Nav() {
  return (
    <nav
      className="mx-auto px-6 md:px-10"
      style={{
        maxWidth: 1440,
        height: 90,
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        alignItems: "center",
      }}
    >
      <div>
        <Link href="/">
          <Image src="/logo.png" alt="Allexis Tsuda" width={140} height={30} priority />
        </Link>
      </div>
      <div className="invisible md:visible" style={{ textAlign: "center" }}>
        <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.21px", color: "#8D8D8D" }}>
          UI/UX Designer
        </span>
      </div>
      <div style={{ textAlign: "right" }}>
        <Link
          href="/#contato"
          className="hover:opacity-60 transition-opacity duration-200"
          style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.21px", color: "#222" }}
        >
          Contato
        </Link>
      </div>
    </nav>
  );
}
