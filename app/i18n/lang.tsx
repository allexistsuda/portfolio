"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export type Lang = "pt" | "en";

type LangCtx = { lang: Lang; setLang: (l: Lang) => void; toggle: () => void };

const Ctx = createContext<LangCtx | null>(null);

// URL is the single source of truth: "/" is Portuguese, "/en/*" is English.
function isEnPath(path: string) {
  return path === "/en" || path.startsWith("/en/");
}

/** Remove a leading "/en" from a pathname, returning the Portuguese path. */
function stripEn(path: string) {
  if (path === "/en") return "/";
  if (path.startsWith("/en/")) return path.slice(3);
  return path;
}

export function LangProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  // Server render and first client render use "pt"; the URL is read right after
  // mount, which avoids a hydration mismatch (English pages briefly show PT).
  const [lang, setLangState] = useState<Lang>("pt");

  useEffect(() => {
    if (isEnPath(window.location.pathname)) setLangState("en");
  }, []);

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

/** Prefixes internal hrefs with /en when the current language is English. */
export function useHref() {
  const { lang } = useLang();
  return (href: string): string => {
    if (lang !== "en") return href;
    if (href.startsWith("#")) return href;
    const [path, hashPart] = href.split("#");
    const hash = hashPart ? "#" + hashPart : "";
    if (!path || path === "/") return "/en" + hash;
    if (path.startsWith("/")) return "/en" + path + hash;
    return href;
  };
}
