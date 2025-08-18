import { Injectable, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { AuditLog, AuditAction } from '../config/logger.config';

@Injectable()
export class AuditService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  /**
   * Log an audit event
   */
  async logAudit(auditLog: AuditLog): Promise<void> {
    const logEntry = {
      ...auditLog,
      timestamp: auditLog.timestamp || new Date(),
      type: 'AUDIT',
    };

    if (auditLog.success) {
      this.logger.info('Audit Log', logEntry);
    } else {
      this.logger.warn('Audit Warning', logEntry);
    }
  }

  /**
   * Log authentication events
   */
  async logAuth(
    action: AuditAction,
    email: string,
    success: boolean,
    ip?: string,
    userAgent?: string,
    details?: any,
  ): Promise<void> {
    await this.logAudit({
      action,
      userEmail: email,
      success,
      ip,
      userAgent,
      details,
    });
  }

  /**
   * Log user actions
   */
  async logUserAction(
    action: AuditAction,
    userId: string,
    userEmail: string,
    details?: any,
    ip?: string,
    userAgent?: string,
  ): Promise<void> {
    await this.logAudit({
      action,
      userId,
      userEmail,
      success: true,
      ip,
      userAgent,
      details,
    });
  }

  /**
   * Log admin actions
   */
  async logAdminAction(
    action: AuditAction,
    adminId: string,
    adminEmail: string,
    targetResource?: string,
    details?: any,
    ip?: string,
  ): Promise<void> {
    await this.logAudit({
      action,
      userId: adminId,
      userEmail: adminEmail,
      success: true,
      ip,
      details: {
        ...details,
        targetResource,
        isAdmin: true,
      },
    });
  }

  /**
   * Log security events
   */
  async logSecurityEvent(
    action: AuditAction,
    ip: string,
    userAgent?: string,
    details?: any,
    userId?: string,
  ): Promise<void> {
    await this.logAudit({
      action,
      userId,
      success: false,
      ip,
      userAgent,
      details,
    });
  }

  /**
   * Log errors with context
   */
  async logError(
    error: Error,
    context?: string,
    userId?: string,
    details?: any,
  ): Promise<void> {
    this.logger.error('Application Error', {
      type: 'ERROR',
      message: error.message,
      stack: error.stack,
      context,
      userId,
      details,
      timestamp: new Date(),
    });
  }
}