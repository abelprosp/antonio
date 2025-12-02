import { createServerClient } from "@supabase/auth-helpers-nextjs";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Regras de acesso - Define quais roles podem acessar cada rota
 * 
 * Cada rota tem um array de roles permitidos.
 * - admin: Pode acessar todas as rotas
 * - bluemilk: Pode acessar apenas /bluemilk
 * - hm: Pode acessar apenas /hm
 */
const accessRules: Record<string, string[]> = {
  "/dashboard": ["admin"], // Apenas admin pode acessar dashboard
  "/bluemilk": ["bluemilk", "admin"], // BlueMilk e admin podem acessar
  "/hm": ["hm", "admin"], // HM e admin podem acessar
  "/settings": ["admin"], // Apenas admin pode acessar configurações
};

/**
 * Middleware - Intercepta todas as requisições para verificar autenticação e autorização
 * 
 * Este middleware é executado antes de cada requisição e:
 * 1. Verifica se a rota é pública (não requer autenticação)
 * 2. Verifica se o usuário está autenticado
 * 3. Verifica se o usuário tem o role necessário para acessar a rota
 * 4. Redireciona para login se não autenticado
 * 5. Redireciona para /unauthorized se não autorizado
 * 
 * @param request - Requisição do Next.js
 * @returns Response com redirecionamento ou continuação da requisição
 */
export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    
    // Normaliza o pathname (remove barra final se houver)
    const normalizedPath =
      pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;

    /**
     * Verifica se a rota é pública (não requer autenticação)
     * 
     * Rotas públicas:
     * - /login: Página de login
     * - /unauthorized: Página de acesso negado
     * - /_next: Assets do Next.js
     * - /api: Rotas de API (têm sua própria autenticação)
     * - /favicon: Favicon
     * - /assets: Assets estáticos
     */
    const isPublic =
      pathname.startsWith("/login") ||
      pathname.startsWith("/unauthorized") ||
      pathname.startsWith("/_next") ||
      pathname.startsWith("/api") ||
      pathname.startsWith("/favicon") ||
      pathname.startsWith("/assets");

    // Se for rota pública, permite acesso sem verificação
    if (isPublic) {
      return NextResponse.next();
    }

    // Cria uma resposta que será modificada se necessário
    const response = NextResponse.next({
      request: { headers: request.headers },
    });

    // Verifica se as variáveis de ambiente do Supabase estão configuradas
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Supabase environment variables are not configured");
      // Se não estiver configurado, permite acesso (para desenvolvimento)
      // Em produção, você pode querer redirecionar para uma página de erro
      return response;
    }

    /**
     * Cria cliente Supabase para o servidor
     * 
     * Usa cookies para gerenciar a sessão do usuário.
     */
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        // Obtém um cookie
        get(name) {
          return request.cookies.get(name)?.value;
        },
        // Define um cookie
        set(name, value, options) {
          response.cookies.set({ name, value, ...options });
        },
        // Remove um cookie
        remove(name, options) {
          response.cookies.delete({ name, ...options });
        },
      },
    });

    /**
     * Busca o usuário autenticado
     */
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    // Se houver erro ao buscar usuário, redireciona para login
    if (userError) {
      console.error("Error getting user:", userError);
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      return NextResponse.redirect(redirectUrl);
    }

    // Se não houver usuário, redireciona para login com parâmetro 'from'
    if (!user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      
      // Validação de pathname antes de passar como parâmetro (prevenção de open redirect)
      // Apenas paths que começam com / e não contêm caracteres perigosos
      if (pathname.startsWith("/") && !/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(pathname)) {
        redirectUrl.searchParams.set("from", pathname);
      }
      return NextResponse.redirect(redirectUrl);
    }

    /**
     * Busca o perfil do usuário para obter o role
     */
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, name")
      .eq("id", user.id)
      .maybeSingle();

    // Obtém o role do perfil ou dos metadados do usuário
    const role = profile?.role ?? (user.app_metadata as Record<string, string | undefined>)?.role;

    /**
     * Verifica se a rota tem regras de acesso definidas
     */
    const allowedRoles = accessRules[normalizedPath];
    if (allowedRoles) {
      // Se o role do usuário está na lista de roles permitidos, permite acesso
      if (role && allowedRoles.includes(role)) {
        return response;
      }
      
      // Se não tiver permissão, redireciona para página de acesso negado
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/unauthorized";
      
      // Validação de pathname antes de passar como parâmetro
      if (pathname.startsWith("/") && !/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(pathname)) {
        redirectUrl.searchParams.set("from", pathname);
      }
      return NextResponse.redirect(redirectUrl);
    }

    // Se não houver regras específicas para a rota, permite acesso a usuários autenticados
    return response;
  } catch (error) {
    // Em caso de erro inesperado, registra e redireciona para login
    console.error("Middleware error:", error);
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    return NextResponse.redirect(redirectUrl);
  }
}

/**
 * Configuração do matcher do middleware
 * 
 * Define quais rotas o middleware deve interceptar.
 * Exclui:
 * - Arquivos estáticos do Next.js (_next/static)
 * - Imagens do Next.js (_next/image)
 * - Favicon
 * - Assets estáticos
 */
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|assets).*)"],
};