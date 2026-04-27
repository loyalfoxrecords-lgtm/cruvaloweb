import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cruvalo — Noticias de Fútbol",
  description: "Las últimas noticias, resultados y clasificaciones del fútbol mundial. La Liga, Premier League, Champions League y más.",
  keywords: "fútbol, noticias fútbol, La Liga, Premier League, Champions League, resultados",
  openGraph: {
    title: "Cruvalo — Noticias de Fútbol",
    description: "Las últimas noticias del fútbol mundial",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
