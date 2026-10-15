import localFont from "next/font/local";

// A própria Santander Text do mockup (arquivos em public/fonts/). É ela que faz o contador casar
// com o número da referência: mesmo "9" de haste reta, mesmo "0" circular, mesmo cifrão.
// Regular bate em ~20px; o resto de ajuste fino de largura o contador faz sozinho (CountSpec.w).
export const santander = localFont({
  src: [
    { path: "../../public/fonts/SantanderText-Light.ttf", weight: "300", style: "normal" },
    { path: "../../public/fonts/SantanderText-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/SantanderText-Bold.ttf", weight: "700", style: "normal" },
  ],
  display: "block", // o contador precisa da fonte certa desde o 1º frame, nunca de um fallback
});
