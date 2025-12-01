"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "./supabaseBrowser";

export type UserRole = "admin" | "bluemilk" | "hm";

export function useUserRole() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRole() {
      try {
        let supabase;
        try {
          supabase = supabaseBrowser();
        } catch (configError) {
          console.error("Error fetching user role: Supabase not configured", configError);
          setRole(null);
          setLoading(false);
          return;
        }

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setRole(null);
          setLoading(false);
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();

        const userRole =
          profile?.role ?? (user.app_metadata as Record<string, string | undefined>)?.role;

        // Valida se o role é um dos valores permitidos
        if (userRole === "admin" || userRole === "bluemilk" || userRole === "hm") {
          setRole(userRole);
        } else {
          setRole(null);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        setRole(null);
      } finally {
        setLoading(false);
      }
    }

    void fetchRole();
  }, []);

  return { role, loading };
}

