import { NextRequest } from "next/server";

/**
 * Função getClientIp - Obtém o IP do cliente de forma segura
 * 
 * Esta função tenta obter o IP real do cliente, mesmo quando a aplicação
 * está atrás de um proxy ou load balancer. Ela verifica vários headers
 * HTTP comuns usados por proxies.
 * 
 * Ordem de verificação:
 * 1. X-Forwarded-For (header mais comum em proxies)
 * 2. X-Real-IP (header alternativo)
 * 3. request.ip (IP direto, se disponível)
 * 4. "unknown" (fallback)
 * 
 * @param request - Objeto Request ou NextRequest do Next.js
 * @returns IP do cliente ou "unknown" se não conseguir determinar
 * 
 * @example
 * ```typescript
 * const ip = getClientIp(request);
 * console.log(`Requisição de: ${ip}`);
 * ```
 */
export function getClientIp(request: NextRequest | Request): string {
  // Tenta obter do header X-Forwarded-For (usado quando atrás de proxy)
  // Este header pode conter múltiplos IPs separados por vírgula
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    // Pega o primeiro IP da lista (o IP original do cliente)
    // Os IPs adicionais são dos proxies intermediários
    const ips = forwarded.split(",").map((ip) => ip.trim());
    return ips[0] || "unknown";
  }

  // Tenta obter do header X-Real-IP (header alternativo usado por alguns proxies)
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // Fallback: tenta obter do request.ip (apenas para NextRequest)
  // Isso funciona apenas em conexões diretas, não recomendado em produção
  if (request instanceof NextRequest) {
    return request.ip || "unknown";
  }

  // Se não conseguir determinar o IP, retorna "unknown"
  return "unknown";
}
