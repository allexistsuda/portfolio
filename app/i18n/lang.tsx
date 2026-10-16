"use client";

import { createContext, useContext, useEffect, useState, useSyncExternalStore } from "react";
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
  // O site é publicado em inglês. ?lang=pt abre a mesma página no conteúdo em português,
  // para revisar os textos antes de traduzir — não muda nada para quem chega pela URL limpa.
  // useSyncExternalStore e não useState+useEffect: evita o descompasso de hidratação
  // (o servidor não tem a query) e a renderização em cascata.
  const daUrl = useSyncExternalStore<Lang>(
    () => () => {},
    () => (new URLSearchParams(window.location.search).get("lang") === "pt" ? "pt" : "en"),
    () => "en",
  );
  // escolha feita em tempo de execução (o seletor do Nav) tem prioridade sobre a query
  const [escolha, setEscolha] = useState<Lang | null>(null);
  const lang = escolha ?? daUrl;
  const setLangState = setEscolha;

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
