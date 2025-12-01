import Card from "../../components/Card";
import AdminUsersManager from "../../components/AdminUsersManager";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Configurações</h1>
      <p className="text-muted">
        Ajuste identidade do sistema e preferências visuais.
      </p>

      <Card className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Nome do sistema
            </label>
            <input
              type="text"
              placeholder="Visor Integrado"
              className="w-full rounded-xl border px-4 py-2.5 shadow-inner outline-none transition focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-300/30"
              style={{
                borderColor: "var(--input-border)",
                background: "var(--input-bg)",
                color: "var(--input-text)",
              }}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              URL base dos iframes
            </label>
            <input
              type="url"
              placeholder="https://minha-ia.com/embed/"
              className="w-full rounded-xl border px-4 py-2.5 shadow-inner outline-none transition focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-300/30"
              style={{
                borderColor: "var(--input-border)",
                background: "var(--input-bg)",
                color: "var(--input-text)",
              }}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            className="rounded-xl border border-border/70 px-4 py-2.5 text-sm font-medium text-foreground transition hover:border-accent/60 hover:text-accent"
          >
            Cancelar
          </button>
          <button
            type="button"
            className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:brightness-110"
          >
            Salvar preferências
          </button>
        </div>
      </Card>

      <AdminUsersManager />
    </div>
  );
}
