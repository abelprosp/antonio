"use client";

import { useEffect, useState } from "react";

const roles = [
  { value: "admin", label: "Admin (acessa tudo)" },
  { value: "bluemilk", label: "BlueMilk" },
  { value: "hm", label: "HM" },
];

export default function RolePicker() {
  const [role, setRole] = useState("admin");
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => {
    const current = document.cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("role="));
    if (current) {
      setRole(current.split("=")[1]);
    }
  }, []);

  const handleSave = () => {
    document.cookie = `role=${role}; path=/; max-age=2592000; SameSite=Lax`;
    setSaved(role);
    setTimeout(() => setSaved(null), 2400);
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">
        Perfil de acesso
      </label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full rounded-xl border border-white/15 bg-white px-4 py-2.5 text-slate-900 shadow-inner outline-none transition focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-300/30 sm:w-64"
        >
          {roles.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center justify-center rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:brightness-110"
        >
          Salvar perfil
        </button>
      </div>
      <p className="text-sm text-muted">
        Admin acessa todas as abas. BlueMilk e HM acessam apenas suas páginas.
      </p>
      {saved && (
        <p className="text-sm font-medium text-accent">
          Perfil salvo: {roles.find((r) => r.value === saved)?.label}
        </p>
      )}
    </div>
  );
}
