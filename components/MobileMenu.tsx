"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserRole, type UserRole } from "../utils/useUserRole";

const allLinks: Array<{
  href: string;
  label: string;
  roles: readonly UserRole[];
}> = [
  { href: "/dashboard", label: "Dashboard", roles: ["admin"] as const },
  { href: "/bluemilk", label: "IA BlueMilk", roles: ["bluemilk", "admin"] as const },
  { href: "/hm", label: "IA HM", roles: ["hm", "admin"] as const },
];

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { role, loading } = useUserRole();

  const links = loading
    ? []
    : allLinks.filter((link) => {
        if (!role) return false;
        return link.roles.includes(role);
      });

  if (links.length === 0) {
    return null;
  }

  return (
    <>
      {/* Botão Hamburger - apenas mobile */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[var(--header-text)] transition hover:bg-white/10"
        aria-label="Abrir menu"
        aria-expanded={isOpen}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-6 w-6"
        >
          {isOpen ? (
            <path d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[45] bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Menu Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-[50] w-64 flex flex-col border-r backdrop-blur-md shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: "var(--header-bg)",
          borderColor: "var(--header-border)",
        }}
      >
        <div
          className="flex h-16 items-center justify-between border-b px-4"
          style={{ borderColor: "var(--header-border)" }}
        >
          <span
            className="text-lg font-display font-semibold"
            style={{ color: "var(--header-text)" }}
          >
            Menu
          </span>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--header-text)] transition hover:bg-white/10"
            aria-label="Fechar menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center rounded-lg border px-4 py-3 text-sm font-display font-semibold transition ${
                      isActive
                        ? "border-cyan-300/60 bg-white/10 text-[var(--header-text)] shadow-[0_4px_12px_rgba(8,47,73,0.25)]"
                        : "border-transparent text-[var(--nav-text)]/70 hover:border-white/20 hover:bg-white/5 hover:text-[var(--header-text)]"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}

