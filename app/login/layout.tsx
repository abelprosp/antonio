import type { ReactNode } from "react";
import "../globals.css";

/**
 * Layout da página de login
 * 
 * Este layout é específico para a página de login e fornece
 * uma estrutura HTML completa (html e body), diferente do
 * layout principal da aplicação.
 * 
 * Características:
 * - Layout centralizado
 * - Tema escuro por padrão
 * - Estilos globais importados
 * 
 * @param children - Conteúdo da página de login
 * @returns Layout HTML completo para a página de login
 */
export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className="theme-dark">
      <body
        className="antialiased"
        style={{ background: "var(--body-bg)", color: "var(--body-text)" }}
      >
        {/* Container principal centralizado */}
        <main className="min-h-screen flex items-start justify-center px-4 pt-8 pb-4">
          <div className="w-full max-w-4xl">{children}</div>
        </main>
      </body>
    </html>
  );
}