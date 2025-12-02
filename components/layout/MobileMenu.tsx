"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserRole, type UserRole } from "../../utils/config/useUserRole";

/**
 * Array com todos os links disponíveis no menu mobile
 * 
 * Mesma estrutura do Navbar, mas usado no menu mobile.
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
 * Componente MobileMenu - Menu hamburger para dispositivos móveis
 * 
 * Cria um menu lateral (drawer) que desliza da esquerda quando o botão
 * hamburger é clicado. Inclui um overlay escuro e fecha ao clicar fora
 * ou em um link.
 * 
 * O menu é renderizado em um portal para garantir z-index correto.
 * 
 * @returns Componente de menu mobile ou null se não houver links
 */
export default function MobileMenu() {
  // Estado que controla se o menu está aberto
  const [isOpen, setIsOpen] = useState(false);
  // Estado para verificar se o componente foi montado (necessário para portal)
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname(); // Rota atual
  const { role, loading } = useUserRole(); // Role do usuário

  // Marca o componente como montado após a primeira renderização
  useEffect(() => {
    setMounted(true);
  }, []);

  /**
   * Filtra os links baseado no role do usuário
   * 
   * Se estiver carregando, retorna array vazio.
   * Se não houver role, retorna array vazio.
   * Caso contrário, retorna apenas os links permitidos.
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

  /**
   * Conteúdo do menu (overlay + drawer)
   * 
   * Renderizado em um portal para garantir que fique acima de tudo.
   */
  const menuContent = (
    <>
      {/* Overlay escuro que aparece quando o menu está aberto - blur removido para performance */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 lg:hidden"
          onClick={() => setIsOpen(false)} // Fecha o menu ao clicar no overlay
          style={{ position: "fixed", zIndex: 9998 }}
        />
      )}

      {/* Menu drawer (gaveta lateral) - backdrop-blur removido para melhor performance */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 flex flex-col border-r shadow-lg transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full" // Desliza para dentro/fora
        }`}
        style={{
          background: "rgba(15, 23, 42, 0.98)", // Background sólido em vez de blur
          borderColor: "var(--header-border)",
          position: "fixed",
          zIndex: 9999, // Z-index alto para ficar acima de tudo
        }}
      >
        {/* Cabeçalho do menu com botão de fechar */}
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
          {/* Botão para fechar o menu */}
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

        {/* Lista de links de navegação */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {links.map((link) => {
              const isActive = pathname === link.href; // Verifica se é a página atual
              
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)} // Fecha o menu ao clicar em um link
                    className={`flex items-center rounded-lg border px-4 py-3 text-sm font-display font-semibold transition ${
                      isActive
                        ? // Estilo para link ativo
                          "border-cyan-300/60 bg-white/10 text-[var(--header-text)] shadow-[0_4px_12px_rgba(8,47,73,0.25)]"
                        : // Estilo para link inativo
                          "border-transparent text-[var(--nav-text)]/70 hover:border-white/20 hover:bg-white/5 hover:text-[var(--header-text)]"
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

  return (
    <>
      {/* Botão Hamburger - visível apenas em mobile (oculto em desktop) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)} // Alterna o estado do menu
        className="lg:hidden flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[var(--header-text)] transition hover:bg-white/10"
        aria-label="Abrir menu"
        aria-expanded={isOpen} // Indica se o menu está aberto (acessibilidade)
      >
        {/* Ícone que muda entre hamburger (3 linhas) e X (fechar) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-6 w-6"
        >
          {isOpen ? (
            // Ícone X quando aberto
            <path d="M6 18L18 6M6 6l12 12" />
          ) : (
            // Ícone hamburger quando fechado
            <path d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Renderiza o menu e overlay em um portal no body */}
      {/* Isso garante que o z-index funcione corretamente */}
      {mounted && typeof document !== "undefined" && createPortal(menuContent, document.body)}
    </>
  );
}
