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
