/**
 * Rate limiting simples em memória
 * Para produção, considere usar Redis ou outro serviço distribuído
 */

type RateLimitConfig = {
  windowMs: number; // Janela de tempo em milissegundos
  maxRequests: number; // Número máximo de requisições
};

type RateLimitStore = {
  count: number;
  resetTime: number;
};

const store = new Map<string, RateLimitStore>();

// Limpa entradas expiradas periodicamente
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of store.entries()) {
    if (value.resetTime < now) {
      store.delete(key);
    }
  }
}, 60000); // Limpa a cada minuto

export function rateLimit(config: RateLimitConfig) {
  return (identifier: string): { allowed: boolean; remaining: number; resetTime: number } => {
    const now = Date.now();
    const key = identifier;
    const entry = store.get(key);

    if (!entry || entry.resetTime < now) {
      // Nova janela de tempo
      const resetTime = now + config.windowMs;
      store.set(key, { count: 1, resetTime });
      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        resetTime,
      };
    }

    if (entry.count >= config.maxRequests) {
      // Limite excedido
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
      };
    }

    // Incrementa contador
    entry.count++;
    store.set(key, entry);

    return {
      allowed: true,
      remaining: config.maxRequests - entry.count,
      resetTime: entry.resetTime,
    };
  };
}

/**
 * Rate limiter para rotas de API
 * 10 requisições por minuto por IP
 */
export const apiRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  maxRequests: 10,
});

/**
 * Rate limiter mais restritivo para operações administrativas
 * 5 requisições por minuto por IP
 */
export const adminRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  maxRequests: 5,
});

