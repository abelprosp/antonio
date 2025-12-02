"use client";

import { useEffect, useState } from "react";
import { getIframeUrl } from "../../utils/config/iframeUrls";

/**
 * Página IA HM - Página da IA HM
 * 
 * Esta página exibe um iframe com o conteúdo da IA HM.
 * A URL do iframe é configurável através da página de configurações
 * e é armazenada no localStorage.
 * 
 * Se não houver URL configurada, exibe uma mensagem pedindo
 * para configurar nas Configurações.
 * 
 * @returns Componente da página IA HM
 */
export default function HMPage() {
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
    setIframeUrl(getIframeUrl("hm"));
    
    /**
     * Handler para mudanças no localStorage de outras abas
     */
    const handleStorageChange = () => {
      setIframeUrl(getIframeUrl("hm"));
    };
    window.addEventListener("storage", handleStorageChange);
    
    /**
     * Polling para detectar mudanças no mesmo tab
     * Verifica a cada 5 segundos se a URL mudou (otimizado para performance)
     */
    const interval = setInterval(() => {
      const current = getIframeUrl("hm");
      if (current !== iframeUrl) {
        setIframeUrl(current);
      }
    }, 5000); // Intervalo aumentado para melhor performance

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
            IA HM
          </h1>
        </div>

        {/* Container do iframe */}
        <div className="iframe-container bg-white/92">
          {iframeUrl ? (
            // Se houver URL configurada, renderiza o iframe
            <iframe
              src={iframeUrl}
              className="w-full h-full min-h-[600px] border-0 rounded-xl"
              title="IA HM"
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