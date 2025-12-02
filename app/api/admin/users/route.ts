import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { adminRateLimit } from "../../../../utils/security/rateLimit";
import { SecurityLogger } from "../../../../utils/security/securityLogger";
import { getClientIp } from "../../../../utils/security/getClientIp";

/**
 * Set com os roles válidos permitidos no sistema
 * 
 * Usado para validar se um role fornecido é válido.
 */
const allowedRoles = new Set(["admin", "bluemilk", "hm"]);

/**
 * Função assertAdmin - Verifica se o usuário é administrador
 * 
 * Esta função verifica:
 * 1. Se o usuário está autenticado
 * 2. Se o usuário tem o role "admin"
 * 
 * Se alguma verificação falhar, retorna um erro.
 * Se passar, retorna o cliente Supabase e o usuário.
 * 
 * @param request - Requisição do Next.js
 * @returns Objeto com supabase e user, ou objeto com error
 */
async function assertAdmin(request: NextRequest) {
  // Obtém o store de cookies do Next.js
  const cookieStore = cookies();
  
  // Cria cliente Supabase para o servidor usando cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Obtém todos os cookies
        getAll() {
          return cookieStore.getAll();
        },
        // Define todos os cookies
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    },
  );

  /**
   * Busca o usuário autenticado
   */
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  // Se houver erro de autenticação ou não houver usuário, retorna erro
  if (authError || !user) {
    const ip = getClientIp(request);
    // Registra tentativa de acesso não autorizado
    SecurityLogger.logUnauthorizedAccess("unknown", "/api/admin/users", ip);
    return { error: NextResponse.json({ error: "Não autenticado" }, { status: 401 }) };
  }

  /**
   * Busca o perfil do usuário para obter o role
   */
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  // Obtém o role do perfil ou dos metadados do usuário
  const requesterRole = profile?.role ?? (user.app_metadata as Record<string, string | undefined>)?.role;

  // Verifica se o role é "admin"
  if (requesterRole !== "admin") {
    const ip = getClientIp(request);
    // Registra tentativa de acesso não autorizado
    SecurityLogger.logUnauthorizedAccess(user.id, "/api/admin/users", ip);
    return { error: NextResponse.json({ error: "Apenas admin pode gerenciar usuários" }, { status: 403 }) };
  }

  // Se tudo estiver ok, retorna o cliente Supabase e o usuário
  return { supabase, user };
}

/**
 * Função getAdminClient - Cria cliente Supabase com service role key
 * 
 * Este cliente tem privilégios administrativos completos e pode:
 * - Criar usuários
 * - Atualizar usuários
 * - Acessar a tabela auth.users diretamente
 * 
 * ⚠️ ATENÇÃO: Este cliente deve ser usado apenas no servidor e nunca
 * exposto ao cliente, pois tem acesso total ao banco de dados.
 * 
 * @returns Cliente Supabase com privilégios administrativos
 * @throws Erro se as variáveis de ambiente não estiverem configuradas
 */
function getAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!serviceKey || !supabaseUrl) {
    throw new Error("Service role key ou URL não configuradas");
  }

  return createClient(supabaseUrl, serviceKey);
}

/**
 * Handler GET - Lista todos os usuários
 * 
 * Retorna uma lista de todos os usuários do sistema com:
 * - ID
 * - Nome
 * - Email
 * - Role
 * 
 * Requer autenticação como admin.
 * Aplica rate limiting.
 * 
 * @param request - Requisição do Next.js
 * @returns Lista de usuários ou erro
 */
export async function GET(request: NextRequest) {
  // Aplica rate limiting (5 requisições por minuto)
  const ip = getClientIp(request);
  const rateLimitResult = adminRateLimit(ip);
  
  // Se o rate limit foi excedido, retorna erro 429
  if (!rateLimitResult.allowed) {
    SecurityLogger.logRateLimitExceeded(ip, "/api/admin/users", ip);
    return NextResponse.json(
      { error: "Muitas requisições. Tente novamente mais tarde." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)),
          "X-RateLimit-Limit": "5",
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(rateLimitResult.resetTime),
        },
      },
    );
  }

  // Verifica se o usuário é admin
  const adminCheck = await assertAdmin(request);
  if ("error" in adminCheck) return adminCheck.error;

  try {
    // Cria cliente administrativo
    const adminClient = getAdminClient();
    
    // Busca todos os perfis da tabela profiles
    const { data, error } = await adminClient
      .from("profiles")
      .select("id, name, role")
      .order("name", { nullsFirst: true }); // Ordena por nome, nulls primeiro

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Busca emails da tabela auth.users (requer privilégios administrativos)
    const { data: users, error: authError } = await adminClient.auth.admin.listUsers();
    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // Cria um mapa de ID -> Email para facilitar a busca
    const emailMap = new Map(users.users.map((u) => [u.id, u.email ?? ""]));
    
    // Combina dados de profiles com emails de auth.users
    const combined =
      data?.map((p) => ({
        id: p.id,
        name: p.name,
        role: p.role,
        email: emailMap.get(p.id) ?? "", // Obtém email do mapa ou string vazia
      })) ?? [];

    // Registra a listagem de usuários
    SecurityLogger.info("users_listed", {
      userId: adminCheck.user.id,
      count: combined.length,
      ip,
    });

    // Retorna a lista de usuários com headers de rate limit
    const jsonResponse = NextResponse.json({ users: combined });
    jsonResponse.headers.set("X-RateLimit-Limit", "5");
    jsonResponse.headers.set("X-RateLimit-Remaining", String(rateLimitResult.remaining));
    jsonResponse.headers.set("X-RateLimit-Reset", String(rateLimitResult.resetTime));
    return jsonResponse;
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

/**
 * Função isValidEmail - Valida se um email é válido
 * 
 * Verifica:
 * - Formato básico de email (tem @ e domínio)
 * - Tamanho máximo de 255 caracteres
 * 
 * @param email - Email a ser validado
 * @returns true se o email for válido, false caso contrário
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

/**
 * Função isValidPassword - Valida se uma senha é válida
 * 
 * Verifica:
 * - Mínimo de 8 caracteres
 * - Máximo de 128 caracteres
 * 
 * @param password - Senha a ser validada
 * @returns true se a senha for válida, false caso contrário
 */
function isValidPassword(password: string): boolean {
  // Mínimo 8 caracteres
  if (password.length < 8) return false;
  // Máximo 128 caracteres (limite razoável)
  if (password.length > 128) return false;
  return true;
}

/**
 * Função sanitizeName - Sanitiza um nome para prevenir XSS
 * 
 * Remove caracteres perigosos e limita o tamanho.
 * 
 * @param name - Nome a ser sanitizado
 * @returns Nome sanitizado ou undefined se vazio
 */
function sanitizeName(name: string | undefined): string | undefined {
  if (!name) return undefined;
  // Remove caracteres perigosos e limita tamanho a 100 caracteres
  return name.trim().slice(0, 100).replace(/[<>\"']/g, "");
}

/**
 * Handler POST - Cria um novo usuário
 * 
 * Cria um novo usuário no sistema com:
 * - Email
 * - Senha
 * - Nome (opcional)
 * - Role
 * 
 * Requer autenticação como admin.
 * Aplica rate limiting.
 * Valida e sanitiza todos os dados de entrada.
 * 
 * @param request - Requisição do Next.js com body contendo email, password, name, role
 * @returns Sucesso ou erro
 */
export async function POST(request: NextRequest) {
  // Aplica rate limiting
  const ip = getClientIp(request);
  const rateLimitResult = adminRateLimit(ip);
  
  if (!rateLimitResult.allowed) {
    SecurityLogger.logRateLimitExceeded(ip, "/api/admin/users POST", ip);
    return NextResponse.json(
      { error: "Muitas requisições. Tente novamente mais tarde." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)),
          "X-RateLimit-Limit": "5",
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(rateLimitResult.resetTime),
        },
      },
    );
  }

  // Verifica se o usuário é admin
  const adminCheck = await assertAdmin(request);
  if ("error" in adminCheck) return adminCheck.error;

  // Obtém dados do body da requisição
  const body = await request.json();
  const { email, password, name, role } = body ?? {};

  // Validação básica: verifica se todos os campos obrigatórios estão presentes
  if (!email || !password || !role || !allowedRoles.has(role)) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  // Validação de email
  const normalizedEmail = email.trim().toLowerCase(); // Normaliza email
  if (!isValidEmail(normalizedEmail)) {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 });
  }

  // Validação de senha
  if (!isValidPassword(password)) {
    return NextResponse.json(
      { error: "Senha deve ter entre 8 e 128 caracteres" },
      { status: 400 },
    );
  }

  // Sanitização de nome
  const sanitizedName = sanitizeName(name);

  try {
    const adminClient = getAdminClient();
    
    // Cria o usuário na tabela auth.users
    const { data: created, error: createError } = await adminClient.auth.admin.createUser({
      email: normalizedEmail,
      password,
      email_confirm: true, // Confirma o email automaticamente
      user_metadata: { name: sanitizedName }, // Metadados do usuário
      app_metadata: { role }, // Metadados da aplicação (role)
    });

    if (createError || !created.user) {
      return NextResponse.json(
        { error: createError?.message ?? "Falha ao criar usuário" },
        { status: 400 },
      );
    }

    const userId = created.user.id;

    // Cria o perfil na tabela profiles
    const { error: profileError } = await adminClient
      .from("profiles")
      .upsert({ id: userId, name: sanitizedName ?? normalizedEmail, role })
      .select()
      .maybeSingle();

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message ?? "Falha ao salvar perfil" },
        { status: 400 },
      );
    }

    // Registra a criação do usuário
    SecurityLogger.logUserCreation(userId, adminCheck.user.id, normalizedEmail, ip);

    // Retorna sucesso com headers de rate limit
    const jsonResponse = NextResponse.json({ success: true, userId });
    jsonResponse.headers.set("X-RateLimit-Limit", "5");
    jsonResponse.headers.set("X-RateLimit-Remaining", String(rateLimitResult.remaining));
    jsonResponse.headers.set("X-RateLimit-Reset", String(rateLimitResult.resetTime));
    return jsonResponse;
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

/**
 * Handler PUT - Atualiza um usuário existente
 * 
 * Atualiza um usuário existente. Pode atualizar:
 * - Nome
 * - Role
 * - Senha
 * 
 * Todos os campos são opcionais (pode atualizar apenas alguns).
 * 
 * Requer autenticação como admin.
 * Aplica rate limiting.
 * Valida e sanitiza todos os dados de entrada.
 * 
 * @param request - Requisição do Next.js com body contendo id e campos a atualizar
 * @returns Sucesso ou erro
 */
export async function PUT(request: NextRequest) {
  // Aplica rate limiting
  const ip = getClientIp(request);
  const rateLimitResult = adminRateLimit(ip);
  
  if (!rateLimitResult.allowed) {
    SecurityLogger.logRateLimitExceeded(ip, "/api/admin/users PUT", ip);
    return NextResponse.json(
      { error: "Muitas requisições. Tente novamente mais tarde." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)),
          "X-RateLimit-Limit": "5",
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(rateLimitResult.resetTime),
        },
      },
    );
  }

  // Verifica se o usuário é admin
  const adminCheck = await assertAdmin(request);
  if ("error" in adminCheck) return adminCheck.error;

  // Obtém dados do body da requisição
  const body = await request.json();
  const { id, name, role, password } = body ?? {};

  // Validação de ID (deve ser string válida, máximo 100 caracteres)
  if (!id || typeof id !== "string" || id.length > 100) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  // Validação de role (se fornecido, deve ser válido)
  if (role && !allowedRoles.has(role)) {
    return NextResponse.json({ error: "Role inválido" }, { status: 400 });
  }

  // Validação de senha (se fornecida)
  if (password && !isValidPassword(password)) {
    return NextResponse.json(
      { error: "Senha deve ter entre 8 e 128 caracteres" },
      { status: 400 },
    );
  }

  // Sanitização de nome (se fornecido)
  const sanitizedName = name !== undefined ? sanitizeName(name) : undefined;

  try {
    const adminClient = getAdminClient();

    // Se uma nova senha foi fornecida, atualiza a senha
    if (password) {
      const { error: pwError } = await adminClient.auth.admin.updateUserById(id, {
        password,
      });
      if (pwError) {
        return NextResponse.json({ error: pwError.message }, { status: 400 });
      }
    }

    // Se role ou nome foram fornecidos, atualiza o perfil
    if (role || sanitizedName !== undefined) {
      // Atualiza a tabela profiles
      const { error: profileError } = await adminClient
        .from("profiles")
        .upsert({
          id,
          name: sanitizedName,
          role,
        })
        .select()
        .maybeSingle();

      if (profileError) {
        return NextResponse.json({ error: profileError.message }, { status: 400 });
      }

      // Se role foi atualizado, também atualiza os metadados do usuário
      if (role) {
        const { error: metaError } = await adminClient.auth.admin.updateUserById(id, {
          app_metadata: { role },
          user_metadata: sanitizedName !== undefined ? { name: sanitizedName } : undefined,
        });
        if (metaError) {
          return NextResponse.json({ error: metaError.message }, { status: 400 });
        }
      }
    }

    // Prepara objeto com as mudanças para logging (sem incluir senha)
    const changes: Record<string, unknown> = {};
    if (role) changes.role = role;
    if (sanitizedName !== undefined) changes.name = sanitizedName;
    if (password) changes.password = "***"; // Não logar senha real

    // Registra a atualização do usuário
    SecurityLogger.logUserUpdate(id, adminCheck.user.id, changes, ip);

    // Retorna sucesso com headers de rate limit
    const jsonResponse = NextResponse.json({ success: true });
    jsonResponse.headers.set("X-RateLimit-Limit", "5");
    jsonResponse.headers.set("X-RateLimit-Remaining", String(rateLimitResult.remaining));
    jsonResponse.headers.set("X-RateLimit-Reset", String(rateLimitResult.resetTime));
    return jsonResponse;
  } catch (e) {
    // Em caso de erro, registra e retorna erro
    SecurityLogger.error("user_update_error", {
      userId: adminCheck.user.id,
      targetId: id,
      error: (e as Error).message,
      ip,
    });
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}