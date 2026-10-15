"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export type Lang = "pt" | "en";

type LangCtx = { lang: Lang; setLang: (l: Lang) => void; toggle: () => void };

const Ctx = createContext<LangCtx | null>(null);

/** Remove a leading "/en" from a pathname, returning the Portuguese path. */
function stripEn(path: string) {
  if (path === "/en") return "/";
  if (path.startsWith("/en/")) return path.slice(3);
  return path;
}

export function LangProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  // English only for now: the language is fixed and the URL no longer decides it.
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
  }, [lang]);

  const setLang = (next: Lang) => {
    if (next === lang) return;
    setLangState(next);
    const base = stripEn(window.location.pathname);
    const hash = window.location.hash || "";
    const target = next === "en" ? (base === "/" ? "/en" : "/en" + base) + hash : base + hash;
    router.push(target);
  };

  const toggle = () => setLang(lang === "pt" ? "en" : "pt");

  return <Ctx.Provider value={{ lang, setLang, toggle }}>{children}</Ctx.Provider>;
}

export function useLang() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}

/** English only for now, so internal hrefs are used as-is (no /en prefix). */
export function useHref() {
  return (href: string): string => href;
}
