import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const { method, url, body, ip, headers } = request;
    const userAgent = headers['user-agent'] || '';
    const now = Date.now();

    // Don't log sensitive data
    const sanitizedBody = { ...body };
    if (sanitizedBody.password) {
      sanitizedBody.password = '[REDACTED]';
    }
    if (sanitizedBody.currentPassword) {
      sanitizedBody.currentPassword = '[REDACTED]';
    }
    if (sanitizedBody.newPassword) {
      sanitizedBody.newPassword = '[REDACTED]';
    }

    return next.handle().pipe(
      tap({
        next: () => {
          const responseTime = Date.now() - now;
          const { statusCode } = response;
          
          this.logger.info('HTTP Request', {
            method,
            url,
            statusCode,
            responseTime: `${responseTime}ms`,
            ip: ip || request.connection.remoteAddress,
            userAgent,
            userId: request.user?.id,
            body: method !== 'GET' ? sanitizedBody : undefined,
          });
        },
        error: (error) => {
          const responseTime = Date.now() - now;
          
          this.logger.error('HTTP Request Error', {
            method,
            url,
            statusCode: error.status || 500,
            responseTime: `${responseTime}ms`,
            ip: ip || request.connection.remoteAddress,
            userAgent,
            userId: request.user?.id,
            body: method !== 'GET' ? sanitizedBody : undefined,
            error: {
              name: error.name,
              message: error.message,
              stack: error.stack,
            },
          });
        },
      }),
    );
  }
}