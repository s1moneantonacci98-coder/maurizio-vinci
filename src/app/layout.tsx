import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Studio Maurizio Vinci — Portale",
  description:
    "Portale clienti e dashboard di gestione progetti per Studio Maurizio Vinci.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={inter.variable}>
      <body className="bg-white font-sans text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
