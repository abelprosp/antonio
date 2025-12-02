import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import AppShell from "../components/layout/AppShell";

/**
 * Metadados da aplicação
 * 
 * Esses metadados são usados para SEO e aparecem nas abas do navegador,
 * compartilhamentos em redes sociais, etc.
 */
export const metadata: Metadata = {
  title: "Hub de IAs | Visor",
  description: "Estrutura base para visores de IA via iframe.",
};

/**
 * Layout raiz da aplicação
 * 
 * Este é o layout principal que envolve todas as páginas da aplicação.
 * Ele fornece:
 * - Estrutura HTML básica (html e body)
 * - Tema escuro por padrão
 * - Estilos globais
 * - AppShell (header, navegação, fundo animado)
 * 
 * @param children - Conteúdo da página atual
 * @returns Layout HTML completo da aplicação
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className="theme-dark">
      <body className="antialiased" style={{ background: "var(--body-bg)", color: "var(--body-text)" }}>
        {/* AppShell fornece header, navegação e fundo animado */}
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}