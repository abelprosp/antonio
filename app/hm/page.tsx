export default function HMPage() {
  return (
    <section className="page-hero full-bleed">
      <div className="page-hero-inner mx-auto max-w-5xl space-y-4 px-4">
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-semibold tracking-tight drop-shadow-sm" style={{ color: "var(--page-title-text)" }}>
            IA HM
          </h1>
        </div>

        <div className="iframe-container bg-white/92">
          {/* Cliente irá inserir aqui o iframe da IA */}
        </div>
      </div>
    </section>
  );
}
