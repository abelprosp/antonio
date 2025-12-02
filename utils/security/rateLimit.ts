/**
 * Sistema de Rate Limiting (Limite de Taxa) em memória
 * 
 * Este módulo implementa um sistema de rate limiting simples que armazena
 * os dados em memória. Para produção com múltiplos servidores, considere
 * usar Redis ou outro serviço distribuído.
 * 
 * O rate limiting previne abuso da API limitando o número de requisições
 * que um identificador (geralmente IP) pode fazer em um período de tempo.
 */

/**
 * Configuração do rate limiter
 */
type RateLimitConfig = {
  windowMs: number; // Janela de tempo em milissegundos (ex: 60000 = 1 minuto)
  maxRequests: number; // Número máximo de requisições permitidas na janela
};

/**
 * Armazenamento de dados de rate limit para cada identificador
 */
type RateLimitStore = {
  count: number; // Número de requisições feitas
  resetTime: number; // Timestamp de quando a janela expira
};

/**
 * Map que armazena os dados de rate limit por identificador (IP, etc)
 * 
 * Chave: identificador (geralmente IP)
 * Valor: dados de rate limit
 */
const store = new Map<string, RateLimitStore>();

/**
 * Limpa entradas expiradas do store periodicamente
 * 
 * Executa a cada minuto para evitar que o Map cresça indefinidamente.
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of store.entries()) {
    // Se o resetTime já passou, remove a entrada
    if (value.resetTime < now) {
      store.delete(key);
    }
  }
}, 60000); // Limpa a cada 60 segundos (1 minuto)

/**
 * Função que cria um rate limiter com a configuração especificada
 * 
 * @param config - Configuração do rate limiter (janela de tempo e máximo de requisições)
 * @returns Função que verifica se uma requisição é permitida
 * 
 * @example
 * ```typescript
 * const limiter = rateLimit({ windowMs: 60000, maxRequests: 10 });
 * const result = limiter("192.168.1.1");
 * if (!result.allowed) {
 *   // Bloquear requisição
 * }
 * ```
 */
export function rateLimit(config: RateLimitConfig) {
  return (identifier: string): { allowed: boolean; remaining: number; resetTime: number } => {
    const now = Date.now();
    const key = identifier; // Geralmente o IP do cliente
    const entry = store.get(key);

    // Se não houver entrada ou a janela expirou, cria uma nova
    if (!entry || entry.resetTime < now) {
      // Nova janela de tempo
      const resetTime = now + config.windowMs;
      store.set(key, { count: 1, resetTime });
      return {
        allowed: true, // Permite a requisição
        remaining: config.maxRequests - 1, // Requisições restantes
        resetTime, // Quando a janela expira
      };
    }

    // Se o limite foi excedido, bloqueia a requisição
    if (entry.count >= config.maxRequests) {
      return {
        allowed: false, // Bloqueia a requisição
        remaining: 0, // Nenhuma requisição restante
        resetTime: entry.resetTime, // Quando a janela expira
      };
    }

    // Incrementa o contador e permite a requisição
    entry.count++;
    store.set(key, entry);

    return {
      allowed: true, // Permite a requisição
      remaining: config.maxRequests - entry.count, // Requisições restantes
      resetTime: entry.resetTime, // Quando a janela expira
    };
  };
}

/**
 * Rate limiter para rotas de API gerais
 * 
 * Permite 10 requisições por minuto por IP.
 * Use este para rotas de API normais.
 */
export const apiRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  maxRequests: 10, // 10 requisições
});

/**
 * Rate limiter mais restritivo para operações administrativas
 * 
 * Permite 5 requisições por minuto por IP.
 * Use este para rotas administrativas sensíveis.
 */
export const adminRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  maxRequests: 5, // 5 requisições
});
