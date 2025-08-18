import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';
import { securityConfig } from './config/security.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
        console.warn(`CORS blocked request from origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    ...securityConfig.cors.options,
  });

  const port = process.env.PORT || 3333;
  await app.listen(port);
  console.log(`🚀 API running on http://localhost:${port}`);
}
bootstrap();
