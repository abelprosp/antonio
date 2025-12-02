"use client";

import { useEffect, useState } from "react";

/**
 * Array com os roles disponíveis para seleção
 * 
 * Usado apenas em desenvolvimento para testar diferentes permissões.
 */
const roles = [
  { value: "admin", label: "Admin (acessa tudo)" },
  { value: "bluemilk", label: "BlueMilk" },
  { value: "hm", label: "HM" },
];

/**
 * Componente RolePicker - Seletor de perfil (desenvolvimento)
 * 
 * Permite escolher um perfil e salvar em cookie.
 * Útil para testar diferentes níveis de acesso durante o desenvolvimento.
 * 
 * ⚠️ ATENÇÃO: Este componente é apenas para desenvolvimento.
 * Em produção, o role deve vir do banco de dados/Supabase.
 * 
 * @returns Componente de seletor de perfil
 */
export default function RolePicker() {
  // Role selecionado
  const [role, setRole] = useState("admin");
  // Role que foi salvo (para mostrar mensagem de confirmação)
  const [saved, setSaved] = useState<string | null>(null);

  /**
   * Efeito que carrega o role salvo no cookie ao montar
   */
  useEffect(() => {
    // Busca o cookie "role"
    const current = document.cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("role="));
    
    // Se encontrar, define como role inicial
    if (current) {
      setRole(current.split("=")[1]);
    }
  }, []);

  /**
   * Função que salva o role selecionado em um cookie
   * 
   * O cookie tem validade de 30 dias (2592000 segundos).
   */
  const handleSave = () => {
    // Salva o role no cookie
    document.cookie = `role=${role}; path=/; max-age=2592000; SameSite=Lax`;
    // Define como salvo para mostrar mensagem
    setSaved(role);
    // Remove a mensagem após 2.4 segundos
    setTimeout(() => setSaved(null), 2400);
  };

  return (
    <div className="space-y-3">
      {/* Label do campo */}
      <label className="text-sm font-medium text-foreground">
        Perfil de acesso
      </label>
      
      {/* Container com select e botão */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Select para escolher o role */}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)} // Atualiza o role ao mudar
          className="w-full rounded-xl border border-white/15 bg-white px-4 py-2.5 text-slate-900 shadow-inner outline-none transition focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-300/30 sm:w-64"
        >
          {roles.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Botão para salvar o role */}
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center justify-center rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:brightness-110"
        >
          Salvar perfil
        </button>
      </div>
      
      {/* Texto explicativo */}
      <p className="text-sm text-muted">
        Admin acessa todas as abas. BlueMilk e HM acessam apenas suas páginas.
      </p>
      
      {/* Mensagem de confirmação quando salvo */}
      {saved && (
        <p className="text-sm font-medium text-accent">
          Perfil salvo: {roles.find((r) => r.value === saved)?.label}
        </p>
      )}
    </div>
  );
}
