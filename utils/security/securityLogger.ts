/**
 * Logger de Segurança - Sistema de logging para eventos de segurança
 * 
 * Este módulo fornece uma classe para registrar eventos de segurança,
 * como tentativas de autenticação, acessos não autorizados, criação
 * de usuários, etc.
 * 
 * Em produção, você pode modificar os métodos para enviar os logs
 * para um serviço externo (como Sentry, LogRocket, etc).
 */

/**
 * Níveis de log disponíveis
 */
type LogLevel = "info" | "warn" | "error";

/**
 * Estrutura de um log de segurança
 */
type SecurityLog = {
  timestamp: string; // Data e hora do evento em ISO
  level: LogLevel; // Nível do log
  event: string; // Nome do evento (ex: "user_created", "auth_failed")
  userId?: string; // ID do usuário relacionado (opcional)
  ip?: string; // IP do cliente (opcional)
  userAgent?: string; // User agent do navegador (opcional)
  details?: Record<string, unknown>; // Detalhes adicionais (opcional)
};

/**
 * Formata um log para string JSON
 * 
 * @param log - Objeto de log a ser formatado
 * @returns String JSON do log
 */
function formatLog(log: SecurityLog): string {
  return JSON.stringify({
    ...log,
    timestamp: new Date().toISOString(), // Garante timestamp atualizado
  });
}

/**
 * Classe SecurityLogger - Logger para eventos de segurança
 * 
 * Fornece métodos estáticos para registrar diferentes tipos de eventos
 * de segurança. Todos os logs incluem timestamp e podem incluir
 * informações adicionais como userId, IP, etc.
 */
export class SecurityLogger {
  /**
   * Método privado que realiza o log
   * 
   * @param level - Nível do log (info, warn, error)
   * @param event - Nome do evento
   * @param details - Detalhes adicionais do evento
   */
  private static log(level: LogLevel, event: string, details?: SecurityLog["details"]) {
    const log: SecurityLog = {
      timestamp: new Date().toISOString(),
      level,
      event,
      ...details, // Espalha os detalhes adicionais
    };

    const formatted = formatLog(log);

    // Em produção, você pode enviar para um serviço de logging
    // Por enquanto, apenas console.log
    switch (level) {
      case "error":
        console.error(`[SECURITY ERROR] ${formatted}`);
        break;
      case "warn":
        console.warn(`[SECURITY WARN] ${formatted}`);
        break;
      case "info":
        console.info(`[SECURITY INFO] ${formatted}`);
        break;
    }
  }

  /**
   * Registra um evento de nível info
   * 
   * @param event - Nome do evento
   * @param details - Detalhes adicionais
   */
  static info(event: string, details?: SecurityLog["details"]) {
    this.log("info", event, details);
  }

  /**
   * Registra um evento de nível warn (aviso)
   * 
   * @param event - Nome do evento
   * @param details - Detalhes adicionais
   */
  static warn(event: string, details?: SecurityLog["details"]) {
    this.log("warn", event, details);
  }

  /**
   * Registra um evento de nível error (erro)
   * 
   * @param event - Nome do evento
   * @param details - Detalhes adicionais
   */
  static error(event: string, details?: SecurityLog["details"]) {
    this.log("error", event, details);
  }

  // ===== Métodos específicos para eventos comuns =====

  /**
   * Registra a criação de um usuário
   * 
   * @param userId - ID do usuário criado
   * @param createdBy - ID do usuário que criou
   * @param email - Email do usuário criado
   * @param ip - IP do cliente (opcional)
   */
  static logUserCreation(userId: string, createdBy: string, email: string, ip?: string) {
    this.info("user_created", {
      userId,
      createdBy,
      email,
      ip,
    });
  }

  /**
   * Registra a atualização de um usuário
   * 
   * @param userId - ID do usuário atualizado
   * @param updatedBy - ID do usuário que atualizou
   * @param changes - Objeto com as mudanças feitas
   * @param ip - IP do cliente (opcional)
   */
  static logUserUpdate(userId: string, updatedBy: string, changes: Record<string, unknown>, ip?: string) {
    this.info("user_updated", {
      userId,
      updatedBy,
      changes,
      ip,
    });
  }

  /**
   * Registra uma tentativa de autenticação falhada
   * 
   * @param email - Email usado na tentativa
   * @param reason - Motivo da falha
   * @param ip - IP do cliente (opcional)
   */
  static logFailedAuth(email: string, reason: string, ip?: string) {
    this.warn("auth_failed", {
      email,
      reason,
      ip,
    });
  }

  /**
   * Registra um acesso não autorizado
   * 
   * @param userId - ID do usuário que tentou acessar
   * @param resource - Recurso que tentou acessar
   * @param ip - IP do cliente (opcional)
   */
  static logUnauthorizedAccess(userId: string, resource: string, ip?: string) {
    this.warn("unauthorized_access", {
      userId,
      resource,
      ip,
    });
  }

  /**
   * Registra quando o rate limit foi excedido
   * 
   * @param identifier - Identificador (geralmente IP)
   * @param endpoint - Endpoint que foi acessado
   * @param ip - IP do cliente (opcional)
   */
  static logRateLimitExceeded(identifier: string, endpoint: string, ip?: string) {
    this.warn("rate_limit_exceeded", {
      identifier,
      endpoint,
      ip,
    });
  }
}
