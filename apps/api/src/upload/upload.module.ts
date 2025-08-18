import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from '../config/upload.config';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    MulterModule.register(multerConfig),
    AuditModule,
  ],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}