import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Allexis Tsuda — Product Designer",
  description:
    "Product Designer com +15 anos de experiência, atuando de ponta a ponta na criação e evolução de produtos.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={geist.className}>
      <body className="bg-[#F6F6F5] text-[#0D0D0D] antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
