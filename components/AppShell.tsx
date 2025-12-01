"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import MobileMenu from "./MobileMenu";
import RoleIndicator from "./RoleIndicator";
import ThemeToggle from "./ThemeToggle";
import Image from "next/image";
import type { ReactNode } from "react";

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/login";

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen">
      <header
        className="relative z-40 border-b backdrop-blur-md shadow-lg sm:fixed sm:inset-x-0 sm:top-0"
        style={{ background: "var(--header-bg)", borderColor: "var(--header-border)" }}
      >
        <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-6">
          <div className="flex min-h-16 items-center justify-between gap-2 sm:gap-4">
            {/* Logo e título - lado esquerdo */}
            <div
              className="flex shrink-0 items-center gap-2 text-sm sm:text-base lg:text-lg font-display font-semibold tracking-tight"
              style={{ color: "var(--header-text)" }}
            >
              <Image
                src="/assets/logo.png"
                alt="Logo"
                width={36}
                height={36}
                className="h-9 w-9 shrink-0 sm:h-10 sm:w-10 lg:h-[42px] lg:w-[42px]"
                priority
              />
              <span className="hidden sm:inline">Visor Integrado</span>
              <span className="sm:hidden">Visor</span>
            </div>

            {/* Menu central - apenas desktop */}
            <div className="hidden flex-1 items-center justify-center min-w-0 px-1 sm:px-2 lg:flex">
              <Navbar />
            </div>

            {/* Menu hamburger - apenas mobile */}
            <div className="lg:hidden">
              <MobileMenu />
            </div>

            {/* Controles direito - simétrico */}
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <ThemeToggle />
              <RoleIndicator />
            </div>
          </div>
        </div>
      </header>

      <main className="min-h-screen pt-4 sm:pt-20">{children}</main>
    </div>
  );
}
