"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "../auth/supabaseBrowser";

/**
 * Tipo que representa os roles disponíveis no sistema
 * 
 * - admin: Acesso total a todas as funcionalidades
 * - bluemilk: Acesso apenas à página BlueMilk
 * - hm: Acesso apenas à página HM
 */
export type UserRole = "admin" | "bluemilk" | "hm";

/**
 * Hook useUserRole - Obtém o role do usuário atual
 * 
 * Este hook busca o role do usuário autenticado no Supabase.
 * O role pode estar na tabela profiles ou nos metadados do usuário.
 * 
 * @returns Objeto com:
 *   - role: Role do usuário ou null se não houver
 *   - loading: Se está carregando os dados
 * 
 * @example
 * ```tsx
 * const { role, loading } = useUserRole();
 * if (loading) return <Loading />;
 * if (role === "admin") return <AdminPanel />;
 * ```
 */
export function useUserRole() {
  // Estado do role do usuário
  const [role, setRole] = useState<UserRole | null>(null);
  // Estado de carregamento
  const [loading, setLoading] = useState(true);

  // Efeito que busca o role ao montar o componente
  useEffect(() => {
    /**
     * Função assíncrona que busca o role do usuário
     */
    async function fetchRole() {
      try {
        // Tenta obter o cliente Supabase
        let supabase;
        try {
          supabase = supabaseBrowser();
        } catch (configError) {
          // Se houver erro de configuração, define role como null
          console.error("Error fetching user role: Supabase not configured", configError);
          setRole(null);
          setLoading(false);
          return;
        }

        // Busca o usuário autenticado
        const {
          data: { user },
        } = await supabase.auth.getUser();

        // Se não houver usuário, define role como null
        if (!user) {
          setRole(null);
          setLoading(false);
          return;
        }

        // Busca o perfil do usuário na tabela profiles
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();

        // Tenta obter o role do perfil, senão tenta dos metadados do usuário
        const userRole =
          profile?.role ?? (user.app_metadata as Record<string, string | undefined>)?.role;

        // Valida se o role é um dos valores permitidos
        // Isso garante type safety
        if (userRole === "admin" || userRole === "bluemilk" || userRole === "hm") {
          setRole(userRole);
        } else {
          // Se o role não for válido, define como null
          setRole(null);
        }
      } catch (error) {
        // Em caso de erro, registra e define role como null
        console.error("Error fetching user role:", error);
        setRole(null);
      } finally {
        // Sempre define loading como false ao finalizar
        setLoading(false);
      }
    }

    // Executa a função de busca
    void fetchRole();
  }, []);

  // Retorna o role e o estado de carregamento
  return { role, loading };
}
