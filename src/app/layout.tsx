import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="it">
      <body className="antialiased">{children}</body>
    </html>
  );
}
