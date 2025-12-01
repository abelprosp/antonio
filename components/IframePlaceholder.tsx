"use client";

type IframePlaceholderProps = {
  label: string;
  description?: string;
  onRefresh?: () => void;
};

export default function IframePlaceholder({
  label,
  description,
  onRefresh,
}: IframePlaceholderProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-border/70 bg-card min-h-[600px] grid place-items-center text-center text-muted px-6 py-10 transition-all duration-300 hover:border-accent/50 hover:shadow-soft">
      <div className="absolute right-4 top-4">
        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex items-center gap-2 rounded-xl bg-accent/10 px-3 py-2 text-sm font-semibold text-accent transition hover:bg-accent/20"
        >
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
      <div className="flex flex-col items-center gap-4 animate-fade-in">
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
        <div className="space-y-2">
          <p className="text-lg font-semibold text-foreground">{label}</p>
          {description ? <p>{description}</p> : null}
          <p className="text-xs text-muted">
            {/* Cliente irá inserir aqui o iframe da IA */}
            Área pronta para receber o iframe.
          </p>
        </div>
      </div>
    </div>
  );
}
