import localFont from "next/font/local";

// Fontes da própria Santander (arquivos em public/fonts/). A Text carrega os rótulos
// e o texto dos botões; a Headline só aparece na palavra "Flame", que é display.
export const santanderText = localFont({
  src: [
    { path: "../../public/fonts/SantanderText-Light.ttf", weight: "300", style: "normal" },
    { path: "../../public/fonts/SantanderText-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/SantanderText-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-santander-text",
  display: "swap",
});

export const santanderHead = localFont({
  src: [{ path: "../../public/fonts/SantanderHeadline-Bold.ttf", weight: "700", style: "normal" }],
  variable: "--font-santander-head",
  display: "swap",
});

// Os 8 cards do Flame (FlameCards): títulos e textos em Regular; o "Aa" do card de
// tipografia parte do Light e engrossa com contorno até o peso do Bold.
// A anatomia do botão (FlameTokens): o "Aa" do card de tipografia é a fonte do próprio
// token, a Micro Text.
export const santanderMicro = localFont({
  src: [{ path: "../../public/fonts/SantanderMicroText-Regular.otf", weight: "400", style: "normal" }],
  variable: "--font-santander-micro",
  display: "swap",
});

export const santanderHeadline = localFont({
  src: [
    { path: "../../public/fonts/SantanderHeadline-Light.ttf", weight: "300", style: "normal" },
    { path: "../../public/fonts/SantanderHeadline-Regular.ttf", weight: "400", style: "normal" },
  ],
  variable: "--font-santander-headline",
  display: "swap",
});
