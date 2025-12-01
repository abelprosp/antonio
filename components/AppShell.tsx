"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
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
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div
            className="flex items-center gap-3 text-lg font-display font-semibold tracking-tight drop-shadow-sm"
            style={{ color: "var(--header-text)" }}
          >
            <Image
              src="/assets/logo.png"
              alt="Logo"
              width={42}
              height={42}
              className="h-[42px] w-[42px]"
              priority
            />
            <span>Visor Integrado</span>
            <ThemeToggle />
          </div>
          <div className="flex items-center gap-3">
            <Navbar />
            <RoleIndicator />
          </div>
        </div>
      </header>

      <main className="min-h-screen pt-4 sm:pt-16">{children}</main>
    </div>
  );
}
