import type { ReactNode } from "react";
import "../globals.css";

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className="theme-dark">
      <body
        className="antialiased"
        style={{ background: "var(--body-bg)", color: "var(--body-text)" }}
      >
        <main className="min-h-screen flex items-start justify-center px-4 pt-8 pb-4">
          <div className="w-full max-w-4xl">{children}</div>
        </main>
      </body>
    </html>
  );
}
