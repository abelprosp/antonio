"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserRole } from "../../utils/config/useUserRole";

import type { UserRole } from "../../utils/config/useUserRole";

/**
 * Array com todos os links disponíveis na navegação
 * 
 * Cada link tem:
 * - href: URL da rota
 * - label: Texto exibido no menu
 * - roles: Array de roles que podem acessar este link
 */
const allLinks: Array<{
  href: string;
  label: string;
  roles: readonly UserRole[];
}> = [
  { href: "/dashboard", label: "Dashboard", roles: ["admin"] as const },
  { href: "/bluemilk", label: "IA BlueMilk", roles: ["bluemilk", "admin"] as const },
  { href: "/hm", label: "IA HM", roles: ["hm", "admin"] as const },
];

/**
 * Componente Navbar - Barra de navegação para desktop
 * 
 * Exibe os links de navegação baseados no role do usuário.
 * Apenas os links permitidos para o role atual são exibidos.
 * O link ativo (página atual) é destacado visualmente.
 * 
 * @returns Componente de navegação ou null se não houver links
 */
export default function Navbar() {
  const pathname = usePathname(); // Rota atual
  const { role, loading } = useUserRole(); // Role do usuário atual

  /**
   * Filtra os links baseado no role do usuário
   * 
   * Se estiver carregando, retorna array vazio.
   * Se não houver role, retorna array vazio.
   * Caso contrário, retorna apenas os links permitidos para o role.
   */
  const links = loading
    ? []
    : allLinks.filter((link) => {
        if (!role) return false;
        return link.roles.includes(role);
      });

  // Se não houver links permitidos, não renderiza nada
  if (links.length === 0) {
    return null;
  }

  return (
    <nav className="flex items-center justify-center w-full">
      <ul className="flex items-center gap-2 sm:gap-3">
        {links.map((link, idx) => {
          const isActive = pathname === link.href; // Verifica se é a página atual
          
          return (
            <li key={link.href} className="flex items-center">
              {/* Separador visual entre links (exceto antes do primeiro) */}
              {idx > 0 && (
                <span
                  className="mx-1 h-4 w-px bg-white/10 dark:bg-white/5"
                  aria-hidden="true"
                />
              )}
              
              {/* Link de navegação */}
              <Link
                href={link.href}
                className={`relative inline-flex items-center justify-center rounded-lg border px-3 py-2 text-sm font-display font-semibold transition-all duration-200 sm:px-4 sm:text-base ${
                  isActive
                    ? // Estilo para link ativo
                      "border-cyan-300/60 bg-white/10 text-[var(--header-text)] shadow-[0_4px_12px_rgba(8,47,73,0.25)]"
                    : // Estilo para link inativo
                      "border-transparent text-[var(--nav-text)]/70 hover:border-white/20 hover:bg-white/5 hover:text-[var(--header-text)]"
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
