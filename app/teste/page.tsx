import type { Metadata } from "next";
import Home from "../page";
import HeroQueda from "../components/HeroQueda";

// Teste: a home de sempre, com as fotos caindo no hero. Fora do Google.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function Teste() {
  return (
    <>
      <Home />
      <HeroQueda />
    </>
  );
}
