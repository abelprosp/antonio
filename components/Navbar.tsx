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

  return (
    <nav className="overflow-x-auto no-scrollbar">
      <ul className="flex flex-wrap items-center gap-3 text-sm font-display font-semibold text-[var(--nav-text)] whitespace-nowrap sm:gap-4">
        {links.map((link, idx) => {
          const isActive = pathname === link.href;
          const withDivider = idx > 0;
          return (
            <li
              key={link.href}
              className={`flex items-center ${
                withDivider ? "border-l border-white/5 pl-4" : ""
              }`}
            >
              <Link
                href={link.href}
                className={`relative inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 transition sm:px-4 ${
                  isActive
                    ? "border-cyan-300/60 bg-white/10 text-[var(--header-text)] shadow-[0_10px_30px_rgba(8,47,73,0.35)]"
                    : "border-transparent text-[var(--nav-text)]/80 hover:bg-white/10 hover:text-[var(--header-text)]"
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
  );
}
