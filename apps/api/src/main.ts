import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';
import { securityConfig } from './config/security.config';
import { HttpsRedirectMiddleware } from './middleware/https-redirect.middleware';
import { SecurityHeadersMiddleware } from './middleware/security-headers.middleware';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Apply security middlewares
  app.use(new HttpsRedirectMiddleware().use.bind(new HttpsRedirectMiddleware()));
  app.use(new SecurityHeadersMiddleware().use.bind(new SecurityHeadersMiddleware()));

  // Trust proxy (important for HTTPS detection behind reverse proxy)
  app.getHttpAdapter().getInstance().set('trust proxy', true);

  // Serve static files from uploads directory
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // CORS configuration based on environment
  const isProduction = process.env.NODE_ENV === 'production';
  const corsConfig = isProduction 
    ? securityConfig.cors.production 
    : securityConfig.cors.development;

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or Postman)
      if (!origin) return callback(null, true);
      
      if (corsConfig.origins.includes(origin)) {
        callback(null, true);
      } else {
        // Log blocked CORS requests through audit service
        // This will be logged by the CORS middleware
        callback(new Error('Not allowed by CORS'));
      }
    },
    ...securityConfig.cors.options,
  });

  const port = process.env.PORT || 3333;
  await app.listen(port);
  
  // Use logger instead of console.log
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  logger.log(`🚀 API running on http://localhost:${port}`, 'Bootstrap');
}
bootstrap();
