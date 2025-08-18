import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  BadRequestException,
  Req,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UploadService } from './upload.service';
import { FileValidationInterceptor } from '../interceptors/file-validation.interceptor';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('upload')
@UseGuards(JwtAuthGuard)
@UseInterceptors(FileValidationInterceptor)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('single')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any,
  ) {
    if (!file) {
      throw new BadRequestException('Arquivo não enviado');
    }

    const metadata = await this.uploadService.processUploadedFile(file, user.id);

    return {
      ...metadata,
      url: `/uploads/${file.filename}`,
    };
  }

  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files', 5))
  async uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @CurrentUser() user: any,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Nenhum arquivo enviado');
    }

    const processedFiles = await Promise.all(
      files.map(file => this.uploadService.processUploadedFile(file, user.id))
    );

    return processedFiles.map((metadata, index) => ({
      ...metadata,
      url: `/uploads/${files[index].filename}`,
    }));
  }

  @Get(':filename')
  async getFileInfo(@Param('filename') filename: string) {
    return this.uploadService.getFileInfo(filename);
  }

  @Delete(':filename')
  async deleteFile(
    @Param('filename') filename: string,
    @CurrentUser() user: any,
  ) {
    await this.uploadService.deleteFile(filename, user.id);
    return { message: 'Arquivo deletado com sucesso' };
  }
}