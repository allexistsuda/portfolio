import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { LangProvider } from "./i18n/lang";

const geist = Geist({
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Allexis Tsuda — Product Designer",
  description:
    "Product Designer focado em produtos digitais complexos, design system e IA aplicada ao processo de produto.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${geist.className} ${geistMono.variable}`}>
      <body className="bg-[#F2F2F2] text-[#0D0D0D] antialiased" suppressHydrationWarning>
        <LangProvider>{children}</LangProvider>
        <Analytics />
      </body>
    </html>
  );
}
