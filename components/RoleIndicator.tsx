"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "../utils/supabaseBrowser";

const roleLabels: Record<string, string> = {
  admin: "Admin",
  bluemilk: "BlueMilk",
  hm: "HM",
};

export default function RoleIndicator() {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const supabase = supabaseBrowser();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setRole(null);
        setEmail(null);
        setName(null);
        setLoading(false);
        return;
      }

      setEmail(user.email ?? null);

      const { data: profile } = await supabase
        .from("profiles")
        .select("role, name")
        .eq("id", user.id)
        .maybeSingle();

      const resolvedRole =
        profile?.role ?? (user.app_metadata as Record<string, string | undefined>)?.role ?? null;

      setRole(resolvedRole);
      setName(profile?.name ?? (user.user_metadata as Record<string, string | undefined>)?.name ?? null);
      setLoading(false);
    };

    void load();
  }, []);

  const handleLogout = async () => {
    const supabase = supabaseBrowser();
    await supabase.auth.signOut();
    setRole(null);
    setEmail(null);
    setName(null);
    router.refresh();
  };

  const label = role ? roleLabels[role] ?? role : "Sem perfil";
  const displayName = name || email || "Usuário";

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

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
        <span className="h-2 w-2 rounded-full bg-amber-400" aria-hidden />
        Entrar
      </Link>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setMenuOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold shadow-sm transition"
        style={{
          borderColor: "var(--chip-border)",
          background: "var(--chip-bg)",
          color: "var(--header-text)",
        }}
      >
        <span className="h-2 w-2 rounded-full bg-cyan-400" aria-hidden />
        <span>{displayName}</span>
      </button>

      {menuOpen && (
        <div
          className="absolute right-0 mt-2 w-40 overflow-hidden rounded-xl border bg-white/90 text-sm shadow-xl"
          style={{ borderColor: "var(--chip-border)" }}
        >
          <Link
            href="/settings"
            className="block px-3 py-2 text-slate-800 transition hover:bg-slate-100"
            onClick={() => setMenuOpen(false)}
          >
            Configurações
          </Link>
          <button
            type="button"
            onClick={async () => {
              setMenuOpen(false);
              await handleLogout();
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
