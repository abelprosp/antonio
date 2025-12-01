"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabaseBrowser } from "../../utils/supabaseBrowser";

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
  };

  return (
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

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-gray-200 dark:border-white/10 bg-white/90 dark:bg-white/5 p-6 shadow-lg shadow-gray-900/10 dark:shadow-slate-900/30"
      >
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-slate-200" htmlFor="email">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-white/15 bg-white/90 px-4 py-2.5 text-slate-900 shadow-inner outline-none transition focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-300/30"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-slate-200" htmlFor="password">
            Senha
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-white/15 bg-white/90 px-4 py-2.5 text-slate-900 shadow-inner outline-none transition focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-300/30"
          />
        </div>

        {error && (
          <p className="text-sm font-semibold text-amber-300">
            {error}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:brightness-110 disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
          <Link
            href="/"
            className="text-sm font-semibold text-gray-700 dark:text-slate-200 transition hover:text-gray-900 dark:hover:text-white"
          >
            Voltar
          </Link>
        </div>
      </form>
    </section>
  );
}

export default function LoginPage() {
  return (
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
  );
}
