"use client";

/**
 * Props do componente IframePlaceholder
 */
type IframePlaceholderProps = {
  label: string; // Título principal do placeholder
  description?: string; // Descrição opcional
  onRefresh?: () => void; // Função opcional chamada ao clicar no botão de atualizar
};

/**
 * Componente IframePlaceholder - Placeholder para área de iframe
 * 
 * Exibe uma área reservada para iframes quando não há conteúdo configurado.
 * Mostra um ícone, mensagem e botão opcional para atualizar.
 * 
 * @param label - Título principal exibido
 * @param description - Descrição adicional (opcional)
 * @param onRefresh - Função chamada ao clicar em "Atualizar iframe" (opcional)
 * @returns Componente de placeholder para iframe
 */
export default function IframePlaceholder({
  label,
  description,
  onRefresh,
}: IframePlaceholderProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-border/70 bg-card min-h-[600px] grid place-items-center text-center text-muted px-6 py-10 transition-all duration-300 hover:border-accent/50 hover:shadow-soft">
      {/* Botão de atualizar no canto superior direito */}
      {onRefresh && (
        <div className="absolute right-4 top-4">
          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex items-center gap-2 rounded-xl bg-accent/10 px-3 py-2 text-sm font-semibold text-accent transition hover:bg-accent/20"
          >
            {/* Ícone de refresh */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-4 w-4"
            >
              <path d="M21 12a9 9 0 0 0-9-9" />
              <path d="M3 12a9 9 0 0 0 9 9" />
              <path d="M3 3v6h6" />
              <path d="m21 21-6-6" />
            </svg>
            Atualizar iframe
          </button>
        </div>
      )}
      
      {/* Conteúdo central do placeholder */}
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        {/* Ícone de iframe */}
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 text-accent shadow-inner">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            className="h-8 w-8"
          >
            <rect x="3" y="4" width="18" height="14" rx="3" ry="3" />
            <path d="M7 16h10" />
            <path d="M11 12h6" />
          </svg>
        </div>
        
        {/* Textos informativos */}
        <div className="space-y-2">
          <p className="text-lg font-semibold text-foreground">{label}</p>
          {description && <p>{description}</p>}
          <p className="text-xs text-muted">
            Área pronta para receber o iframe.
          </p>
        </div>
      </div>
    </div>
  );
}
