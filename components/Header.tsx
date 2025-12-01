"use client";

import ThemeToggle from "./ThemeToggle";

type HeaderProps = {
  onMenuClick: () => void;
};

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border/70 bg-card/80 px-4 py-3 shadow-sm backdrop-blur-md dark:border-border/50">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 bg-card text-foreground transition hover:border-accent/60 hover:text-accent lg:hidden"
          onClick={onMenuClick}
          aria-label="Abrir menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-5 w-5"
        >
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-accent to-indigo-500 text-white shadow-soft dark:shadow-soft-dark">
            IA
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.08em] text-muted">
              Visor Integrado
            </p>
            <p className="text-sm font-semibold text-foreground">Hub de IA</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
}
