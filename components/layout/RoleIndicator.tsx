"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "../../utils/auth/supabaseBrowser";

/**
 * Mapeamento de roles para labels exibidos
 */
const roleLabels: Record<string, string> = {
  admin: "Admin",
  bluemilk: "BlueMilk",
  hm: "HM",
};

/**
 * Componente RoleIndicator - Indicador de perfil do usuário
 * 
 * Exibe o nome/email do usuário logado e um menu dropdown com opções:
 * - Configurações
 * - Sair
 * 
 * Se o usuário não estiver logado, exibe um botão "Entrar".
 * 
 * @returns Componente de indicador de perfil
 */
export default function RoleIndicator() {
  // Estado de carregamento
  const [loading, setLoading] = useState(true);
  // Role do usuário
  const [role, setRole] = useState<string | null>(null);
  // Email do usuário
  const [email, setEmail] = useState<string | null>(null);
  // Nome do usuário
  const [name, setName] = useState<string | null>(null);
  // Estado que controla se o menu dropdown está aberto
  const [menuOpen, setMenuOpen] = useState(false);
  // Referência ao elemento do menu (para fechar ao clicar fora)
  const menuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  /**
   * Efeito que carrega os dados do usuário ao montar o componente
   */
  useEffect(() => {
    const load = async () => {
      const supabase = supabaseBrowser();
      
      // Busca o usuário autenticado
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Se não houver usuário, limpa os estados
      if (!user) {
        setRole(null);
        setEmail(null);
        setName(null);
        setLoading(false);
        return;
      }

      // Define o email do usuário
      setEmail(user.email ?? null);

      // Busca o perfil do usuário na tabela profiles
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, name")
        .eq("id", user.id)
        .maybeSingle();

      // Tenta obter o role do perfil, senão tenta dos metadados
      const resolvedRole =
        profile?.role ?? (user.app_metadata as Record<string, string | undefined>)?.role ?? null;

      setRole(resolvedRole);
      // Tenta obter o nome do perfil, senão tenta dos metadados do usuário
      setName(profile?.name ?? (user.user_metadata as Record<string, string | undefined>)?.name ?? null);
      setLoading(false);
    };

    void load();
  }, []);

  /**
   * Função que faz logout do usuário
   */
  const handleLogout = async () => {
    const supabase = supabaseBrowser();
    await supabase.auth.signOut();
    // Limpa os estados
    setRole(null);
    setEmail(null);
    setName(null);
    // Atualiza a página
    router.refresh();
  };

  // Label do role (ou "Sem perfil" se não houver)
  const label = role ? roleLabels[role] ?? role : "Sem perfil";
  // Nome para exibição (prioriza nome, depois email, depois "Usuário")
  const displayName = name || email || "Usuário";

  /**
   * Efeito que fecha o menu ao clicar fora dele
   */
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Se o clique foi fora do menu, fecha o menu
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    // Remove o listener ao desmontar
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Se não estiver carregando e não houver usuário, exibe botão "Entrar"
  if (!loading && !role && !email) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold shadow-sm transition"
        style={{
          borderColor: "var(--chip-border)",
          background: "var(--chip-bg)",
          color: "var(--header-text)",
        }}
      >
        {/* Indicador amarelo (não logado) */}
        <span className="h-2 w-2 rounded-full bg-amber-400" aria-hidden />
        Entrar
      </Link>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* Botão que exibe o nome do usuário e abre/fecha o menu */}
      <button
        type="button"
        onClick={() => setMenuOpen((v) => !v)} // Alterna o estado do menu
        className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold shadow-sm transition"
        style={{
          borderColor: "var(--chip-border)",
          background: "var(--chip-bg)",
          color: "var(--header-text)",
        }}
      >
        {/* Indicador ciano (logado) */}
        <span className="h-2 w-2 rounded-full bg-cyan-400" aria-hidden />
        <span>{displayName}</span>
      </button>

      {/* Menu dropdown que aparece quando menuOpen é true */}
      {menuOpen && (
        <div
          className="absolute right-0 mt-2 w-40 overflow-hidden rounded-xl border bg-white/90 text-sm shadow-xl"
          style={{ borderColor: "var(--chip-border)" }}
        >
          {/* Link para configurações */}
          <Link
            href="/settings"
            className="block px-3 py-2 text-slate-800 transition hover:bg-slate-100"
            onClick={() => setMenuOpen(false)} // Fecha o menu ao clicar
          >
            Configurações
          </Link>
          {/* Botão de logout */}
          <button
            type="button"
            onClick={async () => {
              setMenuOpen(false); // Fecha o menu
              await handleLogout(); // Faz logout
            }}
            className="flex w-full px-3 py-2 text-left text-slate-800 transition hover:bg-slate-100"
          >
            Sair
          </button>
        </div>
      )}
    </div>
  );
}
