/**
 * Logger de segurança para operações administrativas e eventos críticos
 */

type LogLevel = "info" | "warn" | "error";

type SecurityLog = {
  timestamp: string;
  level: LogLevel;
  event: string;
  userId?: string;
  ip?: string;
  userAgent?: string;
  details?: Record<string, unknown>;
};

function formatLog(log: SecurityLog): string {
  return JSON.stringify({
    ...log,
    timestamp: new Date().toISOString(),
  });
}

export class SecurityLogger {
  private static log(level: LogLevel, event: string, details?: SecurityLog["details"]) {
    const log: SecurityLog = {
      timestamp: new Date().toISOString(),
      level,
      event,
      ...details,
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

  static info(event: string, details?: SecurityLog["details"]) {
    this.log("info", event, details);
  }

  static warn(event: string, details?: SecurityLog["details"]) {
    this.log("warn", event, details);
  }

  static error(event: string, details?: SecurityLog["details"]) {
    this.log("error", event, details);
  }

  // Métodos específicos para eventos comuns
  static logUserCreation(userId: string, createdBy: string, email: string, ip?: string) {
    this.info("user_created", {
      userId,
      createdBy,
      email,
      ip,
    });
  }

  static logUserUpdate(userId: string, updatedBy: string, changes: Record<string, unknown>, ip?: string) {
    this.info("user_updated", {
      userId,
      updatedBy,
      changes,
      ip,
    });
  }

  static logFailedAuth(email: string, reason: string, ip?: string) {
    this.warn("auth_failed", {
      email,
      reason,
      ip,
    });
  }

  static logUnauthorizedAccess(userId: string, resource: string, ip?: string) {
    this.warn("unauthorized_access", {
      userId,
      resource,
      ip,
    });
  }

  static logRateLimitExceeded(identifier: string, endpoint: string, ip?: string) {
    this.warn("rate_limit_exceeded", {
      identifier,
      endpoint,
      ip,
    });
  }
}

