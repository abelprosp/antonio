import Link from "next/link";

/**
 * Props da página Unauthorized
 */
type UnauthorizedPageProps = {
  searchParams: { from?: string }; // Parâmetro opcional indicando de onde veio
};

/**
 * Página Unauthorized - Página de acesso negado
 * 
 * Esta página é exibida quando um usuário tenta acessar uma rota
 * para a qual não tem permissão baseada no seu role.
 * 
 * Exibe uma mensagem explicativa e oferece opções para:
 * - Fazer login
 * - Ir para o Dashboard
 * 
 * @param searchParams - Parâmetros da URL, incluindo 'from' (rota que tentou acessar)
 * @returns Componente da página de acesso negado
 */
export default function UnauthorizedPage({
  searchParams,
}: UnauthorizedPageProps) {
  const from = searchParams.from; // Rota que o usuário tentou acessar

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center gap-6 px-4 text-center">
      {/* Mensagem principal */}
      <div className="space-y-3">
        {/* Subtítulo */}
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-500 dark:text-cyan-300">
          Acesso restrito
        </p>
        
        {/* Título */}
        <h1 className="text-3xl font-display font-semibold text-gray-900 dark:text-white drop-shadow-sm">
          Você não tem permissão para acessar esta área.
        </h1>
        
        {/* Mensagem adicional se houver informação sobre a rota */}
        {from && (
          <p className="text-gray-600 dark:text-slate-300">
            Acesse com uma conta que tenha permissão para{" "}
            <code className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
              {from}
            </code>
            .
          </p>
        )}
      </div>
      
      {/* Botões de ação */}
      <div className="flex flex-wrap justify-center gap-3 text-sm font-semibold">
        {/* Botão para fazer login */}
        <Link
          href="/login"
          className="rounded-xl bg-cyan-500 dark:bg-white/10 px-4 py-2 text-white dark:text-white ring-1 ring-cyan-500/40 dark:ring-cyan-300/40 transition hover:bg-cyan-600 dark:hover:bg-white/15"
        >
          Entrar
        </Link>
        
        {/* Botão para ir ao Dashboard */}
        <Link
          href="/dashboard"
          className="rounded-xl border border-gray-300 dark:border-white/15 px-4 py-2 text-gray-700 dark:text-slate-200 transition hover:border-cyan-500 dark:hover:border-cyan-300/40 hover:text-cyan-600 dark:hover:text-white"
        >
          Ir para Dashboard
        </Link>
      </div>
    </section>
  );
}