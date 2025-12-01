"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Role = "admin" | "bluemilk" | "hm";

type UserRow = {
  id: string;
  email: string;
  name: string | null;
  role: Role | null;
};

const roles: { value: Role; label: string }[] = [
  { value: "admin", label: "Admin" },
  { value: "bluemilk", label: "BlueMilk" },
  { value: "hm", label: "HM" },
];

export default function AdminUsersManager() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [createStatus, setCreateStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [updateStatus, setUpdateStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [createMessage, setCreateMessage] = useState<string | null>(null);
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);

  const [createForm, setCreateForm] = useState({
    email: "",
    password: "",
    name: "",
    role: "hm" as Role,
  });

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedUser = useMemo(
    () => users.find((u) => u.id === selectedId),
    [users, selectedId],
  );

  const [updateForm, setUpdateForm] = useState({
    name: "",
    role: "hm" as Role,
    password: "",
  });

  const fetchUsers = async () => {
    setLoadingUsers(true);
    const res = await fetch("/api/admin/users", { method: "GET" });
    if (res.ok) {
      const data = (await res.json()) as { users: UserRow[] };
      setUsers(data.users);
    }
    setLoadingUsers(false);
  };

  useEffect(() => {
    void fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      setUpdateForm({
        name: selectedUser.name ?? "",
        role: (selectedUser.role as Role) ?? "hm",
        password: "",
      });
    }
  }, [selectedUser]);

  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreateStatus("loading");
    setCreateMessage(null);
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(createForm),
    });
    if (res.ok) {
      setCreateStatus("success");
      setCreateMessage("Usuário criado.");
      setCreateForm({ email: "", password: "", name: "", role: "hm" });
      void fetchUsers();
    } else {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setCreateStatus("error");
      setCreateMessage(data.error ?? "Erro ao criar usuário.");
    }
  };

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedId) return;
    setUpdateStatus("loading");
    setUpdateMessage(null);
    const res = await fetch("/api/admin/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: selectedId, ...updateForm }),
    });
    if (res.ok) {
      setUpdateStatus("success");
      setUpdateMessage("Usuário atualizado.");
      setUpdateForm((prev) => ({ ...prev, password: "" }));
      void fetchUsers();
    } else {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setUpdateStatus("error");
      setUpdateMessage(data.error ?? "Erro ao atualizar usuário.");
    }
  };

  return (
    <section className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-slate-900/20">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground">Gerenciar usuários</h2>
        <p className="text-muted text-sm">
          Criar, atualizar e revisar contas (apenas admins).
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Criar novo usuário</h3>
          <form onSubmit={handleCreate} className="space-y-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="create-name">
                Nome
              </label>
              <input
                id="create-name"
                type="text"
                value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                className="w-full rounded-xl border px-4 py-2.5 shadow-inner outline-none transition focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-300/30"
                style={{
                  borderColor: "var(--input-border)",
                  background: "var(--input-bg)",
                  color: "var(--input-text)",
                }}
                placeholder="Nome"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="create-role">
                Papel
              </label>
              <select
                id="create-role"
                value={createForm.role}
                onChange={(e) => setCreateForm({ ...createForm, role: e.target.value as Role })}
                className="w-full rounded-xl border px-4 py-2.5 shadow-inner outline-none transition focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-300/30"
                style={{
                  borderColor: "var(--input-border)",
                  background: "var(--input-bg)",
                  color: "var(--input-text)",
                }}
              >
                {roles.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="create-email">
                E-mail
              </label>
              <input
                id="create-email"
                type="email"
                required
                value={createForm.email}
                onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                className="w-full rounded-xl border px-4 py-2.5 shadow-inner outline-none transition focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-300/30"
                style={{
                  borderColor: "var(--input-border)",
                  background: "var(--input-bg)",
                  color: "var(--input-text)",
                }}
                placeholder="usuario@dominio.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="create-password">
                Senha
              </label>
              <input
                id="create-password"
                type="password"
                required
                value={createForm.password}
                onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                className="w-full rounded-xl border px-4 py-2.5 shadow-inner outline-none transition focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-300/30"
                style={{
                  borderColor: "var(--input-border)",
                  background: "var(--input-bg)",
                  color: "var(--input-text)",
                }}
                placeholder="Senha temporária"
              />
            </div>
            <div className="flex items-center gap-3 text-sm">
              <button
                type="submit"
                disabled={createStatus === "loading"}
                className="rounded-xl bg-cyan-500 px-4 py-2.5 font-semibold text-white shadow-soft transition hover:brightness-110 disabled:opacity-60"
              >
                {createStatus === "loading" ? "Salvando..." : "Criar usuário"}
              </button>
              {createMessage && (
                <span
                  className={`font-semibold ${
                    createStatus === "error" ? "text-amber-300" : "text-cyan-200"
                  }`}
                >
                  {createMessage}
                </span>
              )}
            </div>
          </form>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Atualizar usuário</h3>
            <button
              type="button"
              onClick={() => void fetchUsers()}
              className="text-xs font-semibold text-cyan-200 underline-offset-4 hover:underline"
              disabled={loadingUsers}
            >
              {loadingUsers ? "Atualizando..." : "Recarregar lista"}
            </button>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor="select-user">
              Selecionar usuário
            </label>
            <select
              id="select-user"
              value={selectedId ?? ""}
              onChange={(e) => setSelectedId(e.target.value || null)}
              className="w-full rounded-xl border px-4 py-2.5 shadow-inner outline-none transition focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-300/30"
              style={{
                borderColor: "var(--input-border)",
                background: "var(--input-bg)",
                color: "var(--input-text)",
              }}
            >
              <option value="">Escolha um usuário</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name ?? u.email} — {u.role ?? "sem papel"}
                </option>
              ))}
            </select>
          </div>

          {selectedUser ? (
            <form onSubmit={handleUpdate} className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="update-name">
                  Nome
                </label>
                <input
                  id="update-name"
                  type="text"
                  value={updateForm.name}
                  onChange={(e) => setUpdateForm({ ...updateForm, name: e.target.value })}
                  className="w-full rounded-xl border px-4 py-2.5 shadow-inner outline-none transition focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-300/30"
                  style={{
                    borderColor: "var(--input-border)",
                    background: "var(--input-bg)",
                    color: "var(--input-text)",
                  }}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="update-role">
                  Papel
                </label>
                <select
                  id="update-role"
                  value={updateForm.role}
                  onChange={(e) => setUpdateForm({ ...updateForm, role: e.target.value as Role })}
                  className="w-full rounded-xl border px-4 py-2.5 shadow-inner outline-none transition focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-300/30"
                  style={{
                    borderColor: "var(--input-border)",
                    background: "var(--input-bg)",
                    color: "var(--input-text)",
                  }}
                >
                  {roles.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="update-password">
                  Nova senha (opcional)
                </label>
                <input
                  id="update-password"
                  type="password"
                  value={updateForm.password}
                  onChange={(e) => setUpdateForm({ ...updateForm, password: e.target.value })}
                  className="w-full rounded-xl border px-4 py-2.5 shadow-inner outline-none transition focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-300/30"
                  style={{
                    borderColor: "var(--input-border)",
                    background: "var(--input-bg)",
                    color: "var(--input-text)",
                  }}
                  placeholder="Deixe em branco para manter"
                />
              </div>
              <div className="flex items-center gap-3 text-sm">
                <button
                  type="submit"
                  disabled={updateStatus === "loading"}
                  className="rounded-xl bg-cyan-500 px-4 py-2.5 font-semibold text-white shadow-soft transition hover:brightness-110 disabled:opacity-60"
                >
                  {updateStatus === "loading" ? "Salvando..." : "Atualizar usuário"}
                </button>
                {updateMessage && (
                  <span
                    className={`font-semibold ${
                      updateStatus === "error" ? "text-amber-300" : "text-cyan-200"
                    }`}
                  >
                    {updateMessage}
                  </span>
                )}
              </div>
            </form>
          ) : (
            <p className="text-sm text-muted">Selecione um usuário para editar.</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Usuários existentes</h3>
        <div className="overflow-auto rounded-xl border border-white/10 bg-white/5">
          <table className="min-w-full text-sm">
            <thead className="border-b border-white/10 text-left text-foreground/80">
              <tr>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">E-mail</th>
                <th className="px-4 py-3">Papel</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-white/5 transition hover:bg-white/5"
                  onClick={() => setSelectedId(u.id)}
                >
                  <td className="px-4 py-3 font-semibold text-foreground">
                    {u.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-foreground/80">{u.email}</td>
                  <td className="px-4 py-3 text-foreground/80">{u.role ?? "—"}</td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td className="px-4 py-3 text-muted" colSpan={3}>
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
