"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState, Suspense, useEffect } from "react";
import Image from "next/image";
import { supabaseBrowser } from "../../utils/supabaseBrowser";
import AnimatedBackground from "../../components/AnimatedBackground";

// Lista de URLs permitidas para redirecionamento (prevenção de open redirect)
const ALLOWED_REDIRECT_PATHS = ["/dashboard", "/bluemilk", "/hm", "/settings"];

function isValidRedirect(path: string | null): boolean {
  if (!path) return true; // Se não houver path, usa o padrão
  // Verifica se o path começa com / e não contém caracteres perigosos
  if (!path.startsWith("/")) return false;
  // Verifica se não contém protocolos (http://, https://, javascript:, etc)
  if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(path)) return false;
  // Verifica se está na lista de paths permitidos
  return ALLOWED_REDIRECT_PATHS.includes(path);
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get("from");
  const redirectTo = isValidRedirect(rawRedirect) ? (rawRedirect ?? "/dashboard") : "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Por favor, insira um email válido");
      setLoading(false);
      return;
    }

    try {
      const supabase = supabaseBrowser();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      setLoading(false);

      if (signInError) {
        setError(signInError.message);
        return;
      }

      // força navegação completa para garantir sessão aplicada no middleware
      window.location.href = redirectTo;
    } catch (err) {
      setLoading(false);
      if (err instanceof Error) {
        if (err.message.includes("environment variables")) {
          setError("Erro de configuração: Variáveis do Supabase não encontradas. Verifique o arquivo .env.local e reinicie o servidor.");
        } else {
          setError(err.message);
        }
      } else {
        setError("Erro ao conectar com o servidor. Tente novamente.");
      }
    }
  };

  return (
    <section className="mx-auto flex min-h-0 max-w-lg flex-col justify-center gap-6 px-4 py-8">
      <div className="flex justify-center">
        <Image
          src="/assets/logo.png"
          alt="Logo"
          width={200}
          height={200}
          className="w-auto h-auto max-w-[300px] max-h-[300px]"
          priority
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-cyan-500/20 bg-slate-900/40 backdrop-blur-xl p-8 shadow-2xl shadow-cyan-500/10"
        style={{
          background: "linear-gradient(135deg, rgba(15, 23, 42, 0.6) 0%, rgba(30, 41, 59, 0.4) 100%)",
          boxShadow: "0 20px 60px rgba(6, 182, 212, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        }}
      >
        <h1 className="text-2xl font-display font-semibold text-center text-white mb-6">
          Entrar
        </h1>

        <div className="space-y-2">
          <label className="text-sm font-medium text-cyan-300/90 flex items-center gap-2" htmlFor="email">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            E-mail
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-cyan-500/30 bg-slate-800/50 backdrop-blur-sm px-4 py-3 text-white placeholder:text-slate-400 shadow-inner outline-none transition-all duration-200 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/30 focus:bg-slate-800/70"
            placeholder="seu@email.com"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-cyan-300/90 flex items-center gap-2" htmlFor="password">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Senha
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-cyan-500/30 bg-slate-800/50 backdrop-blur-sm px-4 py-3 text-white placeholder:text-slate-400 shadow-inner outline-none transition-all duration-200 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/30 focus:bg-slate-800/70"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 backdrop-blur-sm p-3">
            <p className="text-sm font-semibold text-amber-300 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </p>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition-all duration-200 hover:from-cyan-400 hover:to-blue-400 hover:shadow-cyan-400/40 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Entrando...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 mr-2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
                Entrar
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}

export default function LoginPage() {
  useEffect(() => {
    // Aplicar estilos ao body quando a página de login carregar
    document.body.style.background = "transparent";
    document.body.style.overflow = "hidden";
    document.body.style.margin = "0";
    document.body.style.padding = "0";

    // Limpar estilos quando sair da página
    return () => {
      document.body.style.background = "";
      document.body.style.overflow = "";
      document.body.style.margin = "";
      document.body.style.padding = "";
    };
  }, []);

  return (
    <div className="login-page">
      <AnimatedBackground />
      <div className="login-content">
        <Suspense fallback={
          <section className="mx-auto flex min-h-[70vh] max-w-lg flex-col justify-center gap-6 px-4">
            <div className="flex justify-center">
              <Image
                src="/assets/logo.png"
                alt="Logo"
                width={200}
                height={200}
                className="w-auto h-auto max-w-[300px] max-h-[300px]"
                priority
              />
            </div>
          </section>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
