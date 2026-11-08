"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLang, useHref, type Lang } from "../i18n/lang";

function GlobeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#globe_clip)">
        <path d="M12 22.75C6.07 22.75 1.25 17.93 1.25 12C1.25 6.07 6.07 1.25 12 1.25C17.93 1.25 22.75 6.07 22.75 12C22.75 17.93 17.93 22.75 12 22.75ZM12 2.75C6.9 2.75 2.75 6.9 2.75 12C2.75 17.1 6.9 21.25 12 21.25C17.1 21.25 21.25 17.1 21.25 12C21.25 6.9 17.1 2.75 12 2.75Z" />
        <path d="M8.99999 21.75H7.99999C7.58999 21.75 7.24999 21.41 7.24999 21C7.24999 20.59 7.56999 20.26 7.97999 20.25C6.40999 14.89 6.40999 9.11 7.97999 3.75C7.56999 3.74 7.24999 3.41 7.24999 3C7.24999 2.59 7.58999 2.25 7.99999 2.25H8.99999C9.23999 2.25 9.46999 2.37 9.60999 2.56C9.74999 2.76 9.78999 3.01 9.70999 3.24C7.82999 8.89 7.82999 15.11 9.70999 20.77C9.78999 21 9.74999 21.25 9.60999 21.45C9.46999 21.63 9.23999 21.75 8.99999 21.75Z" />
        <path d="M14.9999 21.7507C14.9199 21.7507 14.8399 21.7407 14.7599 21.7107C14.3699 21.5807 14.1499 21.1507 14.2899 20.7607C16.1699 15.1107 16.1699 8.89067 14.2899 3.23067C14.1599 2.84067 14.3699 2.41067 14.7599 2.28067C15.1599 2.15067 15.5799 2.36067 15.7099 2.75067C17.6999 8.71067 17.6999 15.2707 15.7099 21.2207C15.6099 21.5507 15.3099 21.7507 14.9999 21.7507Z" />
        <path d="M12 17.2008C9.21 17.2008 6.43 16.8108 3.75 16.0208C3.74 16.4208 3.41 16.7508 3 16.7508C2.59 16.7508 2.25 16.4108 2.25 16.0008V15.0008C2.25 14.7608 2.37 14.5308 2.56 14.3908C2.76 14.2508 3.01 14.2108 3.24 14.2908C8.89 16.1708 15.12 16.1708 20.77 14.2908C21 14.2108 21.25 14.2508 21.45 14.3908C21.65 14.5308 21.76 14.7608 21.76 15.0008V16.0008C21.76 16.4108 21.42 16.7508 21.01 16.7508C20.6 16.7508 20.27 16.4308 20.26 16.0208C17.57 16.8108 14.79 17.2008 12 17.2008Z" />
        <path d="M21 9.74938C20.92 9.74938 20.84 9.73938 20.76 9.70938C15.11 7.82938 8.88003 7.82938 3.23003 9.70938C2.83003 9.83938 2.41003 9.62937 2.28003 9.23937C2.16003 8.83937 2.37003 8.41938 2.76003 8.28938C8.72003 6.29938 15.28 6.29938 21.23 8.28938C21.62 8.41938 21.84 8.84937 21.7 9.23937C21.61 9.54937 21.31 9.74938 21 9.74938Z" />
      </g>
      <defs>
        <clipPath id="globe_clip">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  );
}

// abre no hover (só em dispositivos com mouse de verdade) — toque/mobile não mexe, continua só no clique
const canHover = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(hover: hover) and (pointer: fine)").matches;

const HOVER_OPEN_DELAY = 100; // evita abrir ao só "passar" o mouse de raspão
const HOVER_CLOSE_DELAY = 250; // dá tempo de mover o mouse até o menu sem fechar

function LangSwitcher() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    openTimer.current = null;
    closeTimer.current = null;
  };

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => clearTimers, []);

  const options: { value: Lang; label: string }[] = [
    { value: "pt", label: "Português" },
    { value: "en", label: "English" },
  ];

  const choose = (l: Lang) => {
    clearTimers();
    setLang(l);
    setOpen(false);
  };

  const handleMouseEnter = () => {
    if (!canHover()) return;
    if (closeTimer.current) clearTimeout(closeTimer.current);
    openTimer.current = setTimeout(() => setOpen(true), HOVER_OPEN_DELAY);
  };

  const handleMouseLeave = () => {
    if (!canHover()) return;
    if (openTimer.current) clearTimeout(openTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), HOVER_CLOSE_DELAY);
  };

  return (
    <div
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ position: "relative", display: "flex", alignItems: "center" }}
    >
      <button
        type="button"
        onClick={() => {
          clearTimers();
          setOpen((o) => !o);
        }}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Language"
        className="hover:opacity-60 transition-opacity duration-300 ease-out"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          color: "#222",
        }}
      >
        <GlobeIcon />
      </button>

      {open && (
        <div
          role="menu"
          style={{
            position: "absolute",
            top: "calc(100% + 10px)",
            right: 0,
            background: "#fff",
            border: "1px solid #E6E6E6",
            borderRadius: 10,
            boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
            padding: 4,
            minWidth: 148,
            zIndex: 50,
          }}
        >
          {options.map((opt) => {
            const active = lang === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                role="menuitem"
                onClick={() => choose(opt.value)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  gap: 12,
                  padding: "9px 12px",
                  borderRadius: 7,
                  border: "none",
                  background: active ? "#F2F2F2" : "transparent",
                  color: "#222",
                  fontSize: 14,
                  fontWeight: active ? 600 : 400,
                  letterSpacing: "-0.21px",
                  cursor: "pointer",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.background = "#F7F7F7";
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.background = "transparent";
                }}
              >
                {opt.label}
                {active && <CheckIcon />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}


// ---- menu de contato ----------------------------------------------------------
// O "Contact" abre um painel ali mesmo, em vez de levar até o rodapé da home: nos
// cases ele tirava a pessoa do case justo quando ela se interessou. Os ícones são os
// do site (public/icons), em tinta escura.

const LINKEDIN_URL = "https://www.linkedin.com/in/allexis-tsuda-a99ab18/";
const INSTAGRAM_URL = "https://www.instagram.com/allexistsuda";
const RESUME_URL = "/resume.pdf";
const EMAIL = "allexistsuda@gmail.com";

// os ícones de contato são os do site (public/icons), em tinta escura. A seta e o
// copiar/check são da mesma família (a do e-mail e do Instagram) e no mesmo tamanho,
// 20px num viewBox de 24 — assim o traço tem a mesma espessura em todos.
function IconeEmail() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden style={{ flexShrink: 0 }}>
      <path d="M17 21.25H7C3.35 21.25 1.25 19.15 1.25 15.5V8.5C1.25 4.85 3.35 2.75 7 2.75H17C20.65 2.75 22.75 4.85 22.75 8.5V15.5C22.75 19.15 20.65 21.25 17 21.25ZM7 4.25C4.14 4.25 2.75 5.64 2.75 8.5V15.5C2.75 18.36 4.14 19.75 7 19.75H17C19.86 19.75 21.25 18.36 21.25 15.5V8.5C21.25 5.64 19.86 4.25 17 4.25H7Z" />
      <path d="M11.9998 12.87C11.1598 12.87 10.3098 12.61 9.65978 12.08L6.52978 9.57997C6.20978 9.31997 6.14978 8.84997 6.40978 8.52997C6.66978 8.20997 7.13978 8.14997 7.45978 8.40997L10.5898 10.91C11.3498 11.52 12.6398 11.52 13.3998 10.91L16.5298 8.40997C16.8498 8.14997 17.3298 8.19997 17.5798 8.52997C17.8398 8.84997 17.7898 9.32997 17.4598 9.57997L14.3298 12.08C13.6898 12.61 12.8398 12.87 11.9998 12.87Z" />
    </svg>
  );
}

function IconeLinkedin() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden style={{ flexShrink: 0 }}>
      <rect x="2" y="2" width="20" height="20" rx="7" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8.1" cy="8.4" r="0.9" fill="currentColor" />
      <path d="M8.1 11.2V16.65" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M11.9 16.65V11.2M11.9 13.4C11.9 12.1 12.85 11.2 14.05 11.2C15.25 11.2 16.15 12.1 16.15 13.5V16.65" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconeInstagram() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden style={{ flexShrink: 0 }}>
      <path d="M15 22.75H9C3.57 22.75 1.25 20.43 1.25 15V9C1.25 3.57 3.57 1.25 9 1.25H15C20.43 1.25 22.75 3.57 22.75 9V15C22.75 20.43 20.43 22.75 15 22.75ZM9 2.75C4.39 2.75 2.75 4.39 2.75 9V15C2.75 19.61 4.39 21.25 9 21.25H15C19.61 21.25 21.25 19.61 21.25 15V9C21.25 4.39 19.61 2.75 15 2.75H9Z" />
      <path d="M12 16.25C9.66 16.25 7.75 14.34 7.75 12C7.75 9.66 9.66 7.75 12 7.75C14.34 7.75 16.25 9.66 16.25 12C16.25 14.34 14.34 16.25 12 16.25ZM12 9.25C10.48 9.25 9.25 10.48 9.25 12C9.25 13.52 10.48 14.75 12 14.75C13.52 14.75 14.75 13.52 14.75 12C14.75 10.48 13.52 9.25 12 9.25Z" />
      <circle cx="17" cy="6.5" r="1" />
    </svg>
  );
}

function IconeCurriculo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden style={{ flexShrink: 0 }}>
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7.8 9h8.4M7.8 12.5h8.4M7.8 16h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// copiar e check: o "copy" e o "tick" da mesma família do e-mail, em cinza
function IconeCopiar({ feito }: { feito: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden style={{ flexShrink: 0, color: "#8D8D8D" }}>
      {feito ? (
        <path d="M4.5 12.5L9.5 17.5L19.5 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <>
          <path d="M16 12.9V17.1C16 20.6 14.6 22 11.1 22H6.9C3.4 22 2 20.6 2 17.1V12.9C2 9.4 3.4 8 6.9 8H11.1C14.6 8 16 9.4 16 12.9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M22 6.9V11.1C22 14.6 20.6 16 17.1 16H16V12.9C16 9.4 14.6 8 11.1 8H8V6.9C8 3.4 9.4 2 12.9 2H17.1C20.6 2 22 3.4 22 6.9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
    </svg>
  );
}

// a seta da mesma família ("arrow-right"), no mesmo tamanho dos outros
function SetaMenu() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden className="contato-seta" style={{ flexShrink: 0, color: "#8D8D8D" }}>
      <path d="M14.43 5.93L20.5 12L14.43 18.07" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.5 12H20.33" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const linhaStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  width: "100%",
  padding: "22px 0",
  background: "transparent",
  border: "none",
  textAlign: "left",
  textDecoration: "none",
  color: "#222",
  cursor: "pointer",
  font: "inherit",
};

function Linha({ icone, titulo, fim }: { icone: React.ReactNode; titulo: React.ReactNode; fim: React.ReactNode }) {
  return (
    <>
      <span style={{ display: "flex", flexShrink: 0, color: "#222" }}>{icone}</span>
      <span className="contato-nome" style={{ minWidth: 0, flex: 1, fontSize: 16, fontWeight: 400, letterSpacing: "-0.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {titulo}
      </span>
      {fim}
    </>
  );
}

// Link simples pro contato. O contato da home é um rodapé grudado no fundo (sticky),
// então o scrollIntoView não sai do lugar: na home rola até o fim da página; fora dela,
// vai pra /#contato e a home faz esse mesmo rolar ao abrir.
function ContatoLink() {
  const href = useHref();
  return (
    <Link
      href={href("/#contato")}
      onClick={(e) => {
        if (!document.getElementById("contato")) return;
        e.preventDefault();
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
      }}
      className="hover:opacity-60 transition-opacity duration-300 ease-out"
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontSize: 14,
        fontWeight: 600,
        letterSpacing: "-0.21px",
        color: "#222",
        lineHeight: 1,
      }}
    >
      Contact
    </Link>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- segurado por enquanto
function ContactMenu() {
  const { lang } = useLang();
  const pt = lang === "pt";
  const [open, setOpen] = useState(false);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!copiado) return;
    const t = setTimeout(() => setCopiado(false), 1800);
    return () => clearTimeout(t);
  }, [copiado]);

  // copia o e-mail em vez de abrir o app de e-mail (que muita gente nem configurou).
  // Fora de https/localhost não há área de transferência: aí cai no mailto.
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopiado(true);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  // cada item entra 35ms depois do anterior, o ritmo das listas da home
  const item = (i: number, extra?: React.CSSProperties): React.CSSProperties => ({
    ...linhaStyle,
    borderTop: i === 0 ? "none" : "1px solid #EDEDED",
    animationDelay: `${90 + i * 35}ms`,
    ...extra,
  });

  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="hover:opacity-60 transition-opacity duration-300 ease-out"
        style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: 14, fontWeight: 600, letterSpacing: "-0.21px", color: "#222", lineHeight: 1 }}
      >
        Contact
      </button>

      <style>{`
/* menu de contato do Nav. O painel abre como um recorte crescendo a partir do canto
   do "Contact" (cima, à direita), e os itens entram em cascata — 35ms entre eles, o
   ritmo das listas da home. O fundo escurece de leve. */
.contato-menu {
  transform-origin: right top;
  animation: contato-abre 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.contato-menu .contato-item {
  animation: contato-entra 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.contato-scrim {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(0, 0, 0, 0.12);
  animation: contato-escurece 0.3s ease both;
}
.contato-nome { transition: color 0.25s ease; }
.contato-item:hover .contato-nome { color: #8D8D8D; }
.contato-item .contato-seta { transition: transform 0.3s cubic-bezier(0.2, 0.7, 0.2, 1); }
.contato-item:hover .contato-seta { transform: translateX(4px); }
@keyframes contato-abre {
  from { clip-path: inset(0 0 100% 40% round 8px); transform: translateY(-6px); }
  to { clip-path: inset(0 0 0 0 round 8px); transform: none; }
}
@keyframes contato-entra {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: none; }
}
@keyframes contato-escurece {
  from { opacity: 0; }
  to { opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .contato-menu, .contato-menu .contato-item, .contato-scrim { animation: none; }
}
      `}</style>

      {open && (
        <>
          <div className="contato-scrim" onClick={() => setOpen(false)} aria-hidden />
          <div
            role="dialog"
            aria-label={pt ? "Contato" : "Contact"}
            className="contato-menu"
            style={{ position: "absolute", right: 0, top: "calc(100% + 20px)", zIndex: 51, width: "min(320px, calc(100vw - 48px))", background: "#fff", border: "1px solid #E6E6E6", borderRadius: 8, padding: "6px 20px", boxShadow: "0 16px 40px rgba(0,0,0,0.08)" }}
          >
            <button type="button" onClick={copiar} className="contato-item" style={item(0)} aria-label={pt ? `Copiar ${EMAIL}` : `Copy ${EMAIL}`}>
              <Linha
                icone={<IconeEmail />}
                titulo={EMAIL}
                fim={<IconeCopiar feito={copiado} />}
              />
            </button>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="contato-item" style={item(1)}>
              <Linha icone={<IconeLinkedin />} titulo="LinkedIn" fim={<SetaMenu />} />
            </a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="contato-item" style={item(2)}>
              <Linha icone={<IconeInstagram />} titulo="Instagram" fim={<SetaMenu />} />
            </a>
            <a href={RESUME_URL} target="_blank" rel="noopener noreferrer" className="contato-item" style={item(3)}>
              <Linha icone={<IconeCurriculo />} titulo={pt ? "Currículo" : "Resume"} fim={<SetaMenu />} />
            </a>
          </div>
        </>
      )}
    </div>
  );
}

export default function Nav() {
  const href = useHref();
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
        <Link href={href("/")}>
          <Image src="/logo.png" alt="Allexis Tsuda" width={110} height={23} priority />
        </Link>
      </div>
      <div />
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 16,
        }}
      >
        {/* menu de contato segurado por enquanto (ContactMenu fica guardado acima);
            volta o link simples que leva ao contato no fim da home */}
        <ContatoLink />
      </div>
    </nav>
  );
}
