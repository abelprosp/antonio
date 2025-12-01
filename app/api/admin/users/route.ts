import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { adminRateLimit } from "../../../../utils/rateLimit";
import { SecurityLogger } from "../../../../utils/securityLogger";
import { getClientIp } from "../../../../utils/getClientIp";

const allowedRoles = new Set(["admin", "bluemilk", "hm"]);

async function assertAdmin(request: NextRequest) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    const ip = getClientIp(request);
    SecurityLogger.logUnauthorizedAccess("unknown", "/api/admin/users", ip);
    return { error: NextResponse.json({ error: "Não autenticado" }, { status: 401 }) };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const requesterRole = profile?.role ?? (user.app_metadata as Record<string, string | undefined>)?.role;

  if (requesterRole !== "admin") {
    const ip = getClientIp(request);
    SecurityLogger.logUnauthorizedAccess(user.id, "/api/admin/users", ip);
    return { error: NextResponse.json({ error: "Apenas admin pode gerenciar usuários" }, { status: 403 }) };
  }

  return { supabase, user };
}

function getAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!serviceKey || !supabaseUrl) {
    throw new Error("Service role key ou URL não configuradas");
  }

  return createClient(supabaseUrl, serviceKey);
}

export async function GET(request: NextRequest) {
  // Rate limiting
  const ip = getClientIp(request);
  const rateLimitResult = adminRateLimit(ip);
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

  const adminCheck = await assertAdmin(request);
  if ("error" in adminCheck) return adminCheck.error;

  try {
    const adminClient = getAdminClient();
    const { data, error } = await adminClient
      .from("profiles")
      .select("id, name, role")
      .order("name", { nullsFirst: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // fetch emails from auth.users
    const { data: users, error: authError } = await adminClient.auth.admin.listUsers();
    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const emailMap = new Map(users.users.map((u) => [u.id, u.email ?? ""]));
    const combined =
      data?.map((p) => ({
        id: p.id,
        name: p.name,
        role: p.role,
        email: emailMap.get(p.id) ?? "",
      })) ?? [];

    SecurityLogger.info("users_listed", {
      userId: adminCheck.user.id,
      count: combined.length,
      ip,
    });

    const jsonResponse = NextResponse.json({ users: combined });
    jsonResponse.headers.set("X-RateLimit-Limit", "5");
    jsonResponse.headers.set("X-RateLimit-Remaining", String(rateLimitResult.remaining));
    jsonResponse.headers.set("X-RateLimit-Reset", String(rateLimitResult.resetTime));
    return jsonResponse;
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

// Validação de email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

// Validação de senha
function isValidPassword(password: string): boolean {
  // Mínimo 8 caracteres
  if (password.length < 8) return false;
  // Máximo 128 caracteres (limite razoável)
  if (password.length > 128) return false;
  return true;
}

// Sanitização de nome
function sanitizeName(name: string | undefined): string | undefined {
  if (!name) return undefined;
  // Remove caracteres perigosos e limita tamanho
  return name.trim().slice(0, 100).replace(/[<>\"']/g, "");
}

export async function POST(request: NextRequest) {
  // Rate limiting
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

  const adminCheck = await assertAdmin(request);
  if ("error" in adminCheck) return adminCheck.error;

  const body = await request.json();
  const { email, password, name, role } = body ?? {};

  // Validações
  if (!email || !password || !role || !allowedRoles.has(role)) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  // Validação de email
  const normalizedEmail = email.trim().toLowerCase();
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
    const { data: created, error: createError } = await adminClient.auth.admin.createUser({
      email: normalizedEmail,
      password,
      email_confirm: true,
      user_metadata: { name: sanitizedName },
      app_metadata: { role },
    });

    if (createError || !created.user) {
      return NextResponse.json(
        { error: createError?.message ?? "Falha ao criar usuário" },
        { status: 400 },
      );
    }

    const userId = created.user.id;

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

    SecurityLogger.logUserCreation(userId, adminCheck.user.id, normalizedEmail, ip);

    const jsonResponse = NextResponse.json({ success: true, userId });
    jsonResponse.headers.set("X-RateLimit-Limit", "5");
    jsonResponse.headers.set("X-RateLimit-Remaining", String(rateLimitResult.remaining));
    jsonResponse.headers.set("X-RateLimit-Reset", String(rateLimitResult.resetTime));
    return jsonResponse;
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  // Rate limiting
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

  const adminCheck = await assertAdmin(request);
  if ("error" in adminCheck) return adminCheck.error;

  const body = await request.json();
  const { id, name, role, password } = body ?? {};

  // Validação de ID (deve ser UUID válido)
  if (!id || typeof id !== "string" || id.length > 100) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  if (role && !allowedRoles.has(role)) {
    return NextResponse.json({ error: "Role inválido" }, { status: 400 });
  }

  // Validação de senha se fornecida
  if (password && !isValidPassword(password)) {
    return NextResponse.json(
      { error: "Senha deve ter entre 8 e 128 caracteres" },
      { status: 400 },
    );
  }

  // Sanitização de nome
  const sanitizedName = name !== undefined ? sanitizeName(name) : undefined;

  try {
    const adminClient = getAdminClient();

    if (password) {
      const { error: pwError } = await adminClient.auth.admin.updateUserById(id, {
        password,
      });
      if (pwError) {
        return NextResponse.json({ error: pwError.message }, { status: 400 });
      }
    }

    if (role || sanitizedName !== undefined) {
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

    const changes: Record<string, unknown> = {};
    if (role) changes.role = role;
    if (sanitizedName !== undefined) changes.name = sanitizedName;
    if (password) changes.password = "***"; // Não logar senha

    SecurityLogger.logUserUpdate(id, adminCheck.user.id, changes, ip);

    const jsonResponse = NextResponse.json({ success: true });
    jsonResponse.headers.set("X-RateLimit-Limit", "5");
    jsonResponse.headers.set("X-RateLimit-Remaining", String(rateLimitResult.remaining));
    jsonResponse.headers.set("X-RateLimit-Reset", String(rateLimitResult.resetTime));
    return jsonResponse;
  } catch (e) {
    SecurityLogger.error("user_update_error", {
      userId: adminCheck.user.id,
      targetId: id,
      error: (e as Error).message,
      ip,
    });
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
