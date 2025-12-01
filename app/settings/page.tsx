"use client";

import { useState, useEffect } from "react";
import Card from "../../components/Card";
import AdminUsersManager from "../../components/AdminUsersManager";
import { getIframeUrls, setIframeUrls, type IframeUrls } from "../../utils/iframeUrls";

export default function SettingsPage() {
  const [iframeUrls, setIframeUrlsState] = useState<IframeUrls>({
    dashboard: "",
    bluemilk: "",
    hm: "",
  });
  const [systemName, setSystemName] = useState("Visor Integrado");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const urls = getIframeUrls();
    setIframeUrlsState(urls);
  }, []);

  const handleSave = () => {
    setIframeUrls(iframeUrls);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 sm:px-6 lg:px-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
          Configurações
        </h1>
        <p className="text-sm text-muted sm:text-base">
          Ajuste identidade do sistema e URLs dos iframes para cada página.
        </p>
      </div>

      <Card className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground sm:text-base">
            Nome do sistema
          </label>
          <input
            type="text"
            value={systemName}
            onChange={(e) => setSystemName(e.target.value)}
            placeholder="Visor Integrado"
            className="w-full rounded-xl border px-4 py-2.5 text-sm shadow-inner outline-none transition focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-300/30 sm:text-base"
            style={{
              borderColor: "var(--input-border)",
              background: "var(--input-bg)",
              color: "var(--input-text)",
            }}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground sm:text-base">
            URLs dos Iframes
          </h3>
          <div className="grid gap-4 sm:grid-cols-1">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Dashboard
              </label>
              <input
                type="url"
                value={iframeUrls.dashboard}
                onChange={(e) =>
                  setIframeUrlsState({ ...iframeUrls, dashboard: e.target.value })
                }
                placeholder="https://dashboard-ia.com/embed/"
                className="w-full rounded-xl border px-4 py-2.5 text-sm shadow-inner outline-none transition focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-300/30 sm:text-base"
                style={{
                  borderColor: "var(--input-border)",
                  background: "var(--input-bg)",
                  color: "var(--input-text)",
                }}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                IA BlueMilk
              </label>
              <input
                type="url"
                value={iframeUrls.bluemilk}
                onChange={(e) =>
                  setIframeUrlsState({ ...iframeUrls, bluemilk: e.target.value })
                }
                placeholder="https://bluemilk-ia.com/embed/"
                className="w-full rounded-xl border px-4 py-2.5 text-sm shadow-inner outline-none transition focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-300/30 sm:text-base"
                style={{
                  borderColor: "var(--input-border)",
                  background: "var(--input-bg)",
                  color: "var(--input-text)",
                }}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                IA HM
              </label>
              <input
                type="url"
                value={iframeUrls.hm}
                onChange={(e) =>
                  setIframeUrlsState({ ...iframeUrls, hm: e.target.value })
                }
                placeholder="https://hm-ia.com/embed/"
                className="w-full rounded-xl border px-4 py-2.5 text-sm shadow-inner outline-none transition focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-300/30 sm:text-base"
                style={{
                  borderColor: "var(--input-border)",
                  background: "var(--input-bg)",
                  color: "var(--input-text)",
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={() => {
              const urls = getIframeUrls();
              setIframeUrlsState(urls);
              setSystemName("Visor Integrado");
            }}
            className="rounded-xl border border-border/70 px-4 py-2.5 text-sm font-medium text-foreground transition hover:border-accent/60 hover:text-accent sm:px-6"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:brightness-110 sm:px-6"
          >
            {saved ? "Salvo!" : "Salvar preferências"}
          </button>
        </div>
      </Card>

      <AdminUsersManager />
    </div>
  );
}
