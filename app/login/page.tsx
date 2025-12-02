"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState, Suspense, useEffect, useRef } from "react";
import Image from "next/image";
import { supabaseBrowser } from "../../utils/auth/supabaseBrowser";
import AnimatedBackground from "../../components/effects/AnimatedBackground";
import ScanLine from "../../components/effects/ScanLine";
import GlitchEffect from "../../components/effects/GlitchEffect";

/**
 * Lista de URLs permitidas para redirecionamento após login
 * 
 * Esta lista previne ataques de open redirect, garantindo que
 * apenas rotas internas válidas possam ser usadas para redirecionamento.
 */
const ALLOWED_REDIRECT_PATHS = ["/dashboard", "/bluemilk", "/hm", "/settings"];

/**
 * Função isValidRedirect - Valida se um path de redirecionamento é seguro
 * 
 * Verifica:
 * 1. Se o path começa com / (rota relativa)
 * 2. Se não contém protocolos (http://, https://, javascript:, etc)
 * 3. Se está na lista de paths permitidos
 * 
 * @param path - Path a ser validado
 * @returns true se o path for válido e seguro, false caso contrário
 */
function isValidRedirect(path: string | null): boolean {
  if (!path) return true; // Se não houver path, usa o padrão
  // Verifica se o path começa com / e não contém caracteres perigosos
  if (!path.startsWith("/")) return false;
  // Verifica se não contém protocolos (http://, https://, javascript:, etc)
  if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(path)) return false;
  // Verifica se está na lista de paths permitidos
  return ALLOWED_REDIRECT_PATHS.includes(path);
}

/**
 * Componente LoginForm - Formulário de login
 * 
 * Este componente renderiza o formulário de login com:
 * - Campo de email
 * - Campo de senha
 * - Validação de email
 * - Autenticação via Supabase
 * - Efeitos visuais (scanline, glitch em erros)
 * - Redirecionamento após login bem-sucedido
 * 
 * @returns Componente do formulário de login
 */
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Obtém o parâmetro 'from' da URL (rota que tentou acessar antes do login)
  const rawRedirect = searchParams.get("from");
  // Valida e define a rota de redirecionamento
  const redirectTo = isValidRedirect(rawRedirect) ? (rawRedirect ?? "/dashboard") : "/dashboard";
  
  // Estados do formulário
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // Estado que indica qual input está focado (para efeito de scanline)
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  // Referências aos inputs (não usadas atualmente, mas podem ser úteis)
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  /**
   * Handler do submit do formulário
   * 
   * Valida o email, faz autenticação no Supabase e redireciona se bem-sucedido.
   * 
   * @param event - Evento do formulário
   */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    // Validação básica de email usando regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Por favor, insira um email válido");
      setLoading(false);
      return;
    }

    try {
      const supabase = supabaseBrowser();
      // Tenta fazer login com email e senha
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(), // Normaliza o email
        password,
      });

      setLoading(false);

      // Se houver erro de autenticação, exibe a mensagem
      if (signInError) {
        setError(signInError.message);
        return;
      }

      // Efeito de sucesso antes de redirecionar (pequeno delay)
      setTimeout(() => {
        window.location.href = redirectTo;
      }, 500);

      // Força navegação completa para garantir sessão aplicada no middleware
      // Nota: há um setTimeout acima, então esta linha pode ser redundante
      window.location.href = redirectTo;
    } catch (err) {
      setLoading(false);
      if (err instanceof Error) {
        // Tratamento específico para erro de configuração
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
    <section className="mx-auto flex min-h-0 max-w-lg flex-col justify-start gap-4 px-4 pt-4 pb-6 overflow-visible">
      {/* Logo da aplicação */}
      <div className="flex justify-center -mb-1">
        <Image
          src="/assets/logo.png"
          alt="Logo"
          width={200}
          height={200}
          className="w-auto h-auto max-w-[300px] max-h-[300px] object-contain"
          priority
        />
      </div>

      {/* Formulário de login */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-cyan-500/20 bg-slate-900/40 backdrop-blur-xl p-8 shadow-2xl shadow-cyan-500/10 relative form-tech"
        style={{
          background: "linear-gradient(135deg, rgba(15, 23, 42, 0.6) 0%, rgba(30, 41, 59, 0.4) 100%)",
          boxShadow: "0 20px 60px rgba(6, 182, 212, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* Efeito de scanline no formulário */}
        <ScanLine />
        
        {/* Título com efeito de glitch se houver erro */}
        <GlitchEffect active={!!error}>
          <h1 className="text-2xl font-display font-semibold text-center text-white mb-6 typing-effect">
            Entrar
            <span className="cursor-blink">|</span>
          </h1>
        </GlitchEffect>

        {/* Campo de email */}
        <div className="space-y-2 relative">
          <label className="text-sm font-medium text-cyan-300/90 flex items-center gap-2" htmlFor="email">
            {/* Ícone de envelope com animação de pulso */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 icon-pulse">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            E-mail
          </label>
          <div className="relative input-wrapper">
            <input
              ref={emailInputRef}
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedInput("email")} // Marca como focado
              onBlur={() => setFocusedInput(null)} // Remove foco
              className="w-full rounded-lg border border-cyan-500/30 bg-slate-800/50 backdrop-blur-sm px-4 py-3 text-white placeholder:text-slate-400 shadow-inner outline-none transition-all duration-200 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/30 focus:bg-slate-800/70 input-tech"
              placeholder="seu@email.com"
            />
            {/* Efeito de scanline quando o input está focado */}
            {focusedInput === "email" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent scan-line-input" />
            )}
          </div>
        </div>

        {/* Campo de senha */}
        <div className="space-y-2 relative">
          <label className="text-sm font-medium text-cyan-300/90 flex items-center gap-2" htmlFor="password">
            {/* Ícone de cadeado com animação de pulso */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 icon-pulse">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Senha
          </label>
          <div className="relative input-wrapper">
            <input
              ref={passwordInputRef}
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedInput("password")} // Marca como focado
              onBlur={() => setFocusedInput(null)} // Remove foco
              className="w-full rounded-lg border border-cyan-500/30 bg-slate-800/50 backdrop-blur-sm px-4 py-3 text-white placeholder:text-slate-400 shadow-inner outline-none transition-all duration-200 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/30 focus:bg-slate-800/70 input-tech"
              placeholder="••••••••"
            />
            {/* Efeito de scanline quando o input está focado */}
            {focusedInput === "password" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent scan-line-input" />
            )}
          </div>
        </div>

        {/* Mensagem de erro com efeito de glitch */}
        {error && (
          <GlitchEffect active={true}>
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 backdrop-blur-sm p-3 error-tech">
              <p className="text-sm font-semibold text-amber-300 flex items-center gap-2">
                {/* Ícone de alerta */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </p>
            </div>
          </GlitchEffect>
        )}

        {/* Botão de submit */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition-all duration-200 hover:from-cyan-400 hover:to-blue-400 hover:shadow-cyan-400/40 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden button-tech"
          >
            {/* Efeito shimmer quando está carregando */}
            {loading && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            )}
            {loading ? (
              // Estado de carregamento
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Entrando...
              </>
            ) : (
              // Estado normal
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

/**
 * Componente LoginPage - Página de login completa
 * 
 * Este componente é a página principal de login que:
 * - Renderiza o fundo animado
 * - Aplica estilos especiais ao body
 * - Usa Suspense para carregamento assíncrono
 * - Renderiza o formulário de login
 * 
 * @returns Componente da página de login
 */
export default function LoginPage() {
  /**
   * Efeito que aplica estilos especiais ao body quando a página carrega
   * 
   * Remove o fundo padrão e ajusta overflow para melhor visualização
   * do fundo animado.
   */
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
      {/* Fundo animado com efeitos tecnológicos */}
      <AnimatedBackground />
      
      {/* Conteúdo do login */}
      <div className="login-content">
        {/* Suspense para carregamento assíncrono do formulário */}
        <Suspense fallback={
          // Fallback enquanto carrega (mostra apenas a logo)
          <section className="mx-auto flex min-h-0 max-w-lg flex-col justify-start gap-1 px-4 pt-4">
            <div className="flex justify-center -mb-1">
              <Image
                src="/assets/logo.png"
                alt="Logo"
                width={200}
                height={200}
                className="w-auto h-auto max-w-[300px] max-h-[300px] object-contain"
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