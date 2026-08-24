"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Lang = "pt" | "en";

type LangCtx = { lang: Lang; setLang: (l: Lang) => void; toggle: () => void };

const Ctx = createContext<LangCtx | null>(null);

const STORAGE_KEY = "lang";

export function LangProvider({ children }: { children: React.ReactNode }) {
  // Server render and first client render both use "pt" to avoid a hydration
  // mismatch; the stored preference is applied right after mount.
  const [lang, setLangState] = useState<Lang>("pt");

  useEffect(() => {
    const stored = (typeof window !== "undefined" &&
      window.localStorage.getItem(STORAGE_KEY)) as Lang | null;
    if (stored === "pt" || stored === "en") setLangState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {}
  };

  const toggle = () => setLang(lang === "pt" ? "en" : "pt");

  return <Ctx.Provider value={{ lang, setLang, toggle }}>{children}</Ctx.Provider>;
}

export function useLang() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}

/** Pick the value for the current language. */
export function useT() {
  const { lang } = useLang();
  return <T,>(pt: T, en: T): T => (lang === "pt" ? pt : en);
}
