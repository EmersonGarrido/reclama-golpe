import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ScamsModule } from './scams/scams.module';
import { CategoriesModule } from './categories/categories.module';
import { CommentsModule } from './comments/comments.module';
import { AdminModule } from './admin/admin.module';
import { WebsocketModule } from './websocket/websocket.module';
import { UploadModule } from './upload/upload.module';
import { SavedScamsModule } from './saved-scams/saved-scams.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Rate limiting configuration
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 minute
      limit: 100, // 100 requests per minute for general endpoints
    }]),
    PrismaModule,
    AuthModule,
    UsersModule,
    ScamsModule,
    CategoriesModule,
    CommentsModule,
    AdminModule,
    WebsocketModule,
    UploadModule,
    SavedScamsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
