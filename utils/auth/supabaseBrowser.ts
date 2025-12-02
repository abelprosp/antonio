import { createBrowserClient } from "@supabase/auth-helpers-nextjs";

/**
 * Função supabaseBrowser - Cria cliente Supabase para uso no browser
 * 
 * Esta função cria e retorna um cliente Supabase configurado para uso
 * no lado do cliente (browser). Ela valida se as variáveis de ambiente
 * necessárias estão configuradas antes de criar o cliente.
 * 
 * As variáveis de ambiente necessárias são:
 * - NEXT_PUBLIC_SUPABASE_URL: URL do projeto Supabase
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY: Chave anônima do Supabase
 * 
 * @returns Cliente Supabase configurado
 * @throws Erro se as variáveis de ambiente não estiverem configuradas
 * 
 * @example
 * ```typescript
 * const supabase = supabaseBrowser();
 * const { data } = await supabase.auth.getUser();
 * ```
 */
export function supabaseBrowser() {
  // Obtém a URL do Supabase das variáveis de ambiente
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Obtém a chave anônima do Supabase das variáveis de ambiente
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Valida se as variáveis de ambiente estão configuradas
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase environment variables are not configured. Please check your .env.local file and ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set."
    );
  }

  // Cria e retorna o cliente Supabase
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
