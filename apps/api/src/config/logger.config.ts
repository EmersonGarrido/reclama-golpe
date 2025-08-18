import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';

const isProduction = process.env.NODE_ENV === 'production';

// Custom format for audit logs
const auditFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.ms(),
  nestWinstonModuleUtilities.format.nestLike('ReclamaGolpe', {
    colors: true,
    prettyPrint: true,
  }),
);

// File transport for audit logs
const auditTransport = new (winston.transports as any).DailyRotateFile({
  filename: 'logs/audit-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '30d',
  format: auditFormat,
  level: 'info',
});

// File transport for error logs
const errorTransport = new (winston.transports as any).DailyRotateFile({
  filename: 'logs/error-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '30d',
  format: auditFormat,
  level: 'error',
});

// File transport for general logs
const combinedTransport = new (winston.transports as any).DailyRotateFile({
  filename: 'logs/combined-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '7d',
  format: auditFormat,
});

// Console transport
const consoleTransport = new winston.transports.Console({
  format: consoleFormat,
  level: isProduction ? 'info' : 'debug',
});

export const loggerConfig = {
  level: isProduction ? 'info' : 'debug',
  format: auditFormat,
  transports: [
    consoleTransport,
    auditTransport,
    errorTransport,
    combinedTransport,
  ],
};

// Create the Winston logger instance
export const createLogger = () => {
  return winston.createLogger(loggerConfig);
};

// Audit log levels
export enum AuditAction {
  // Authentication
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
  LOGOUT = 'LOGOUT',
  REGISTER = 'REGISTER',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  PASSWORD_RESET = 'PASSWORD_RESET',
  
  // Scam operations
  SCAM_CREATED = 'SCAM_CREATED',
  SCAM_UPDATED = 'SCAM_UPDATED',
  SCAM_DELETED = 'SCAM_DELETED',
  SCAM_REPORTED = 'SCAM_REPORTED',
  SCAM_RESOLVED = 'SCAM_RESOLVED',
  SCAM_VERIFIED = 'SCAM_VERIFIED',
  
  // Admin operations
  ADMIN_ACCESS = 'ADMIN_ACCESS',
  ADMIN_UPDATE_USER = 'ADMIN_UPDATE_USER',
  ADMIN_DELETE_USER = 'ADMIN_DELETE_USER',
  ADMIN_CHANGE_SETTINGS = 'ADMIN_CHANGE_SETTINGS',
  
  // Security events
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  CORS_BLOCKED = 'CORS_BLOCKED',
  
  // User operations
  USER_PROFILE_UPDATE = 'USER_PROFILE_UPDATE',
  USER_ACCOUNT_DELETE = 'USER_ACCOUNT_DELETE',
  USER_COMMENT_CREATE = 'USER_COMMENT_CREATE',
  USER_COMMENT_DELETE = 'USER_COMMENT_DELETE',
}

// Audit log interface
export interface AuditLog {
  action: AuditAction;
  userId?: string;
  userEmail?: string;
  ip?: string;
  userAgent?: string;
  details?: any;
  success: boolean;
  timestamp?: Date;
}