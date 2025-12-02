"use client";

/**
 * Chave usada para armazenar as URLs dos iframes no localStorage
 */
const IFRAME_URLS_KEY = "iframe_urls";

/**
 * Tipo que define a estrutura das URLs dos iframes
 * 
 * Cada página pode ter uma URL de iframe configurável.
 */
export type IframeUrls = {
  dashboard: string; // URL do iframe do dashboard
  bluemilk: string; // URL do iframe do BlueMilk
  hm: string; // URL do iframe do HM
};

/**
 * URLs padrão (vazias) para cada página
 * 
 * Se não houver URL configurada, a página mostrará um placeholder.
 */
const defaultUrls: IframeUrls = {
  dashboard: "",
  bluemilk: "",
  hm: "",
};

/**
 * Função getIframeUrls - Obtém todas as URLs dos iframes do localStorage
 * 
 * Busca as URLs salvas no localStorage e retorna um objeto com todas elas.
 * Se não houver URLs salvas, retorna as URLs padrão (vazias).
 * 
 * @returns Objeto com as URLs dos iframes
 * 
 * @example
 * ```typescript
 * const urls = getIframeUrls();
 * console.log(urls.dashboard); // URL do dashboard ou ""
 * ```
 */
export function getIframeUrls(): IframeUrls {
  // Verifica se está no browser (localStorage só existe no browser)
  if (typeof window === "undefined") return defaultUrls;

  try {
    // Busca as URLs do localStorage
    const stored = localStorage.getItem(IFRAME_URLS_KEY);
    if (stored) {
      // Faz parse do JSON e mescla com as URLs padrão
      const parsed = JSON.parse(stored) as Partial<IframeUrls>;
      return { ...defaultUrls, ...parsed };
    }
  } catch (error) {
    // Se houver erro ao ler, registra e retorna padrão
    console.error("Error reading iframe URLs from localStorage:", error);
  }

  return defaultUrls;
}

/**
 * Função setIframeUrls - Salva URLs dos iframes no localStorage
 * 
 * Atualiza as URLs dos iframes no localStorage. Pode atualizar
 * apenas algumas URLs (parcial) ou todas de uma vez.
 * 
 * @param urls - Objeto com as URLs a serem salvas (pode ser parcial)
 * 
 * @example
 * ```typescript
 * setIframeUrls({ dashboard: "https://exemplo.com/dashboard" });
 * // Isso atualiza apenas a URL do dashboard, mantendo as outras
 * ```
 */
export function setIframeUrls(urls: Partial<IframeUrls>): void {
  // Verifica se está no browser
  if (typeof window === "undefined") return;

  try {
    // Obtém as URLs atuais
    const current = getIframeUrls();
    // Mescla com as novas URLs
    const updated = { ...current, ...urls };
    // Salva no localStorage
    localStorage.setItem(IFRAME_URLS_KEY, JSON.stringify(updated));
  } catch (error) {
    // Se houver erro ao salvar, registra
    console.error("Error saving iframe URLs to localStorage:", error);
  }
}

/**
 * Função getIframeUrl - Obtém a URL de um iframe específico
 * 
 * Busca a URL de uma página específica. Se não houver URL configurada,
 * retorna string vazia.
 * 
 * @param page - Nome da página (dashboard, bluemilk ou hm)
 * @returns URL do iframe ou string vazia
 * 
 * @example
 * ```typescript
 * const url = getIframeUrl("dashboard");
 * if (url) {
 *   // Renderiza iframe
 * } else {
 *   // Mostra placeholder
 * }
 * ```
 */
export function getIframeUrl(page: keyof IframeUrls): string {
  const urls = getIframeUrls();
  return urls[page] || "";
}
