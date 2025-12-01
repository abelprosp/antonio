"use client";

import { useEffect, useState } from "react";
import { getIframeUrl } from "../../utils/iframeUrls";

export default function DashboardPage() {
  const [iframeUrl, setIframeUrl] = useState("");

  useEffect(() => {
    setIframeUrl(getIframeUrl("dashboard"));
    
    // Atualiza quando o localStorage muda
    const handleStorageChange = () => {
      setIframeUrl(getIframeUrl("dashboard"));
    };
    window.addEventListener("storage", handleStorageChange);
    
    // Polling para detectar mudanças no mesmo tab
    const interval = setInterval(() => {
      const current = getIframeUrl("dashboard");
      if (current !== iframeUrl) {
        setIframeUrl(current);
      }
    }, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [iframeUrl]);

  return (
    <section className="page-hero full-bleed">
      <div className="page-hero-inner mx-auto max-w-5xl space-y-4 px-4">
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-semibold tracking-tight drop-shadow-sm" style={{ color: "var(--page-title-text)" }}>
            Dashboard
          </h1>
        </div>

        <div className="iframe-container bg-white/92">
          {iframeUrl ? (
            <iframe
              src={iframeUrl}
              className="w-full h-full min-h-[600px] border-0 rounded-xl"
              title="Dashboard IA"
              allow="fullscreen"
            />
          ) : (
            <div className="flex h-[600px] items-center justify-center text-gray-400">
              <p>Configure a URL do iframe nas Configurações</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
