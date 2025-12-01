import { createServerClient } from "@supabase/auth-helpers-nextjs";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const accessRules: Record<string, string[]> = {
  "/dashboard": ["admin"],
  "/bluemilk": ["bluemilk", "admin"],
  "/hm": ["hm", "admin"],
  "/settings": ["admin"],
};

export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    const normalizedPath =
      pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;

    const isPublic =
      pathname.startsWith("/login") ||
      pathname.startsWith("/unauthorized") ||
      pathname.startsWith("/_next") ||
      pathname.startsWith("/api") ||
      pathname.startsWith("/favicon") ||
      pathname.startsWith("/assets");

    if (isPublic) {
      return NextResponse.next();
    }

    const response = NextResponse.next({
      request: { headers: request.headers },
    });

    // Verificar se as variáveis de ambiente estão configuradas
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Supabase environment variables are not configured");
      // Se não estiver configurado, permite acesso (para desenvolvimento)
      // Em produção, você pode querer redirecionar para uma página de erro
      return response;
    }

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value;
        },
        set(name, value, options) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name, options) {
          response.cookies.delete({ name, ...options });
        },
      },
    });

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("Error getting user:", userError);
      // Em caso de erro, redireciona para login
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      return NextResponse.redirect(redirectUrl);
    }

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

    const { data: profile } = await supabase
      .from("profiles")
      .select("role, name")
      .eq("id", user.id)
      .maybeSingle();

    const role = profile?.role ?? (user.app_metadata as Record<string, string | undefined>)?.role;

    const allowedRoles = accessRules[normalizedPath];
    if (allowedRoles) {
      if (role && allowedRoles.includes(role)) {
        return response;
      }
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/unauthorized";
      // Validação de pathname antes de passar como parâmetro
      if (pathname.startsWith("/") && !/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(pathname)) {
        redirectUrl.searchParams.set("from", pathname);
      }
      return NextResponse.redirect(redirectUrl);
    }

    // default: authenticated can pass
    return response;
  } catch (error) {
    console.error("Middleware error:", error);
    // Em caso de erro, redireciona para login
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    return NextResponse.redirect(redirectUrl);
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|assets).*)"],
};
