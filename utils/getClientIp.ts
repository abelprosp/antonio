import { NextRequest } from "next/server";

/**
 * Obtém o IP do cliente de forma segura
 */
export function getClientIp(request: NextRequest | Request): string {
  // Tenta obter do header X-Forwarded-For (quando atrás de proxy)
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    // Pega o primeiro IP da lista (o IP original do cliente)
    const ips = forwarded.split(",").map((ip) => ip.trim());
    return ips[0] || "unknown";
  }

  // Tenta obter do header X-Real-IP
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // Fallback para conexão direta (não recomendado em produção)
  if (request instanceof NextRequest) {
    return request.ip || "unknown";
  }

  return "unknown";
}

