"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserRole } from "../utils/useUserRole";

import type { UserRole } from "../utils/useUserRole";

const allLinks: Array<{
  href: string;
  label: string;
  roles: readonly UserRole[];
}> = [
  { href: "/dashboard", label: "Dashboard", roles: ["admin"] as const },
  { href: "/bluemilk", label: "IA BlueMilk", roles: ["bluemilk", "admin"] as const },
  { href: "/hm", label: "IA HM", roles: ["hm", "admin"] as const },
];

export default function Navbar() {
  const pathname = usePathname();
  const { role, loading } = useUserRole();

  // Filtra links baseado no role do usuário
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
    <nav className="flex items-center justify-center w-full">
      <ul className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
        {links.map((link, idx) => {
          const isActive = pathname === link.href;
          return (
            <li key={link.href} className="flex items-center">
              {idx > 0 && (
                <span
                  className="mx-0.5 sm:mx-1 h-4 w-px bg-white/10 dark:bg-white/5"
                  aria-hidden="true"
                />
              )}
              <Link
                href={link.href}
                className={`relative inline-flex items-center justify-center rounded-lg border px-2 py-1.5 text-xs sm:text-sm font-display font-semibold transition-all duration-200 sm:px-3 sm:py-2 lg:px-4 lg:text-base ${
                  isActive
                    ? "border-cyan-300/60 bg-white/10 text-[var(--header-text)] shadow-[0_4px_12px_rgba(8,47,73,0.25)]"
                    : "border-transparent text-[var(--nav-text)]/70 hover:border-white/20 hover:bg-white/5 hover:text-[var(--header-text)]"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="whitespace-nowrap">{link.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
