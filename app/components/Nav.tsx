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

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transition: "transform 0.2s ease", transform: open ? "rotate(180deg)" : "none" }}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function LangSwitcher() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  const options: { value: Lang; label: string }[] = [
    { value: "pt", label: "Português" },
    { value: "en", label: "English" },
  ];

  const choose = (l: Lang) => {
    setLang(l);
    setOpen(false);
  };

  return (
    <div ref={ref} style={{ position: "relative", display: "flex", alignItems: "center" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Language"
        className="hover:opacity-60 transition-opacity duration-200"
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
        <ChevronIcon open={open} />
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

export default function Nav() {
  const { lang } = useLang();
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
          <Image src="/logo.png" alt="Allexis Tsuda" width={140} height={30} priority />
        </Link>
      </div>
      <div className="invisible md:visible" style={{ textAlign: "center" }}>
        <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.21px", color: "#8D8D8D" }}>
          UI/UX Designer
        </span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 16,
        }}
      >
        <LangSwitcher />
        <Link
          href={href("/#contato")}
          className="hover:opacity-60 transition-opacity duration-200"
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
          {lang === "pt" ? "Contato" : "Contact"}
        </Link>
      </div>
    </nav>
  );
}
