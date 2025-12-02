"use client";

import { useEffect, useState } from "react";
import { getIframeUrl } from "../../utils/config/iframeUrls";

/**
 * Página Dashboard - Página principal do administrador
 * 
 * Esta página exibe um iframe com o conteúdo do dashboard.
 * A URL do iframe é configurável através da página de configurações
 * e é armazenada no localStorage.
 * 
 * Se não houver URL configurada, exibe uma mensagem pedindo
 * para configurar nas Configurações.
 * 
 * @returns Componente da página Dashboard
 */
export default function DashboardPage() {
  // Estado que armazena a URL do iframe
  const [iframeUrl, setIframeUrl] = useState("");

  /**
   * Efeito que carrega a URL do iframe e monitora mudanças
   * 
   * Faz três coisas:
   * 1. Carrega a URL inicial do localStorage
   * 2. Escuta mudanças no localStorage (de outras abas)
   * 3. Faz polling para detectar mudanças na mesma aba
   */
  useEffect(() => {
    // Carrega a URL inicial
    setIframeUrl(getIframeUrl("dashboard"));
    
    /**
     * Handler para mudanças no localStorage de outras abas
     * 
     * O evento 'storage' só dispara quando outra aba/janela
     * modifica o localStorage.
     */
    const handleStorageChange = () => {
      setIframeUrl(getIframeUrl("dashboard"));
    };
    window.addEventListener("storage", handleStorageChange);
    
    /**
     * Polling para detectar mudanças no mesmo tab
     * 
     * Como o evento 'storage' não dispara na mesma aba,
     * fazemos um polling a cada segundo para verificar
     * se a URL mudou.
     */
    const interval = setInterval(() => {
      const current = getIframeUrl("dashboard");
      if (current !== iframeUrl) {
        setIframeUrl(current);
      }
    }, 1000); // Verifica a cada 1 segundo

    // Limpa os listeners ao desmontar
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [iframeUrl]);

  return (
    <section className="page-hero full-bleed">
      <div className="page-hero-inner mx-auto max-w-5xl space-y-4 px-4">
        {/* Título da página */}
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-semibold tracking-tight drop-shadow-sm" style={{ color: "var(--page-title-text)" }}>
            Dashboard
          </h1>
        </div>

        {/* Container do iframe */}
        <div className="iframe-container bg-white/92">
          {iframeUrl ? (
            // Se houver URL configurada, renderiza o iframe
            <iframe
              src={iframeUrl}
              className="w-full h-full min-h-[600px] border-0 rounded-xl"
              title="Dashboard IA"
              allow="fullscreen"
            />
          ) : (
            // Se não houver URL, exibe mensagem
            <div className="flex h-[600px] items-center justify-center text-gray-400">
              <p>Configure a URL do iframe nas Configurações</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}