import type { Metadata } from "next";
import Home from "../page";
import HeroRastro from "../components/HeroRastro";

// Teste: a home de sempre, com o rastro de fotos no hero. Fora do Google.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function Teste() {
  return (
    <>
      <Home />
      <HeroRastro />
    </>
  );
}
