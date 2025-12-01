import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import AppShell from "../components/AppShell";

export const metadata: Metadata = {
  title: "Hub de IAs | Visor",
  description: "Estrutura base para visores de IA via iframe.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className="theme-dark">
      <body className="antialiased" style={{ background: "var(--body-bg)", color: "var(--body-text)" }}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
