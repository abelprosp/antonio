"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserRole, type UserRole } from "../utils/useUserRole";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

type NavItem = {
  label: string;
  href: string;
  roles: readonly UserRole[];
  icon: React.ReactNode;
};

const allNavItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    roles: ["admin"] as const,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        className="h-5 w-5"
      >
        <path d="M3 13h6V3H3zM15 21h6V11h-6z" />
        <path d="M3 21h6v-5H3zM15 13h6V3h-6z" />
      </svg>
    ),
  },
  {
    label: "IA BlueMilk",
    href: "/bluemilk",
    roles: ["bluemilk", "admin"] as const,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        className="h-5 w-5"
      >
        <path d="M12 3 3 8l9 5 9-5z" />
        <path d="M3 13l9 5 9-5" />
        <path d="M3 18l9 5 9-5" />
      </svg>
    ),
  },
  {
    label: "IA HM",
    href: "/hm",
    roles: ["hm", "admin"] as const,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        className="h-5 w-5"
      >
        <path d="M12 3a9 9 0 1 0 9 9" />
        <path d="M12 7v5l3 3" />
      </svg>
    ),
  },
  {
    label: "Configurações",
    href: "/settings",
    roles: ["admin"] as const,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        className="h-5 w-5"
      >
        <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        <path d="m2.5 11.5 1.6.4a8 8 0 0 0 .6 1.6l-.9 1.4 1.2 1.2 1.4-.9a8 8 0 0 0 1.6.6l.4 1.6h1.7l.4-1.6a8 8 0 0 0 1.6-.6l1.4.9 1.2-1.2-.9-1.4a8 8 0 0 0 .6-1.6l1.6-.4v-1.7l-1.6-.4a8 8 0 0 0-.6-1.6l.9-1.4-1.2-1.2-1.4.9a8 8 0 0 0-1.6-.6l-.4-1.6h-1.7l-.4 1.6a8 8 0 0 0-1.6.6l-1.4-.9-1.2 1.2.9 1.4a8 8 0 0 0-.6 1.6l-1.6.4z" />
      </svg>
    ),
  },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { role, loading } = useUserRole();

  // Filtra itens de navegação baseado no role do usuário
  const navItems = loading
    ? []
    : allNavItems.filter((item) => {
        if (!role) return false;
        return item.roles.includes(role);
      });

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border/70 bg-card/95 px-4 py-6 shadow-soft backdrop-blur-md transition-transform duration-200 dark:border-border/50 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="mb-6 hidden items-center gap-3 px-2 lg:flex">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-accent to-indigo-500 text-white shadow-soft">
            IA
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.08em] text-muted">
              Visor Integrado
            </p>
            <p className="text-sm font-semibold text-foreground">Hub de IA</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-accent/15 text-accent shadow-sm"
                    : "text-muted hover:bg-accent/10 hover:text-foreground"
                }`}
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-lg border border-border/70 transition group-hover:border-accent/50 ${
                    isActive ? "border-accent/60 bg-accent/10 text-accent" : ""
                  }`}
                >
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="rounded-xl border border-dashed border-border/70 bg-card/60 p-3 text-xs text-muted">
          <p className="font-semibold text-foreground">Dica</p>
          <p>Insira iframes de IA nas páginas e use o modo escuro/claro.</p>
        </div>
      </aside>

      {isOpen ? (
        <button
          type="button"
          aria-label="Fechar menu"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
        />
      ) : null}
    </>
  );
}
