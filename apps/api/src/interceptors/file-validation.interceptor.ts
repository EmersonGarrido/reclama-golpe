import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as fs from 'fs/promises';
import * as path from 'path';
import { validateFileSize, sanitizeAndValidateFilename } from '../config/upload.config';

// File signatures (magic numbers) for validation
const FILE_SIGNATURES = {
  // Images
  'image/jpeg': [
    { offset: 0, signature: Buffer.from([0xFF, 0xD8, 0xFF]) }, // JPEG
  ],
  'image/png': [
    { offset: 0, signature: Buffer.from([0x89, 0x50, 0x4E, 0x47]) }, // PNG
  ],
  'image/gif': [
    { offset: 0, signature: Buffer.from([0x47, 0x49, 0x46, 0x38]) }, // GIF
  ],
  'image/webp': [
    { offset: 0, signature: Buffer.from('RIFF', 'ascii') },
    { offset: 8, signature: Buffer.from('WEBP', 'ascii') },
  ],
  // Documents
  'application/pdf': [
    { offset: 0, signature: Buffer.from('%PDF', 'ascii') }, // PDF
  ],
};

@Injectable()
export class FileValidationInterceptor implements NestInterceptor {
  private readonly logger = new Logger('FileValidationInterceptor');

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    
    // Check if request has files
    const files = request.files || (request.file ? [request.file] : []);
    
    if (files.length > 0) {
      for (const file of files) {
        try {
          // Validate file size
          validateFileSize(file);
          
          // Sanitize filename
          const sanitizedName = sanitizeAndValidateFilename(file.originalname);
          
          // Validate file content (magic numbers)
          await this.validateFileContent(file);
          
          // Log successful validation
          this.logger.log(`File validated successfully: ${sanitizedName} (${file.mimetype})`);
          
        } catch (error) {
          // Delete uploaded file if validation fails
          if (file.path) {
            try {
              await fs.unlink(file.path);
              this.logger.warn(`Deleted invalid file: ${file.path}`);
            } catch (unlinkError) {
              this.logger.error(`Failed to delete invalid file: ${file.path}`, unlinkError.stack);
            }
          }
          
          throw error;
        }
      }
    }
    
    return next.handle().pipe(
      map(data => {
        // Add file upload info to response if needed
        if (files.length > 0) {
          return {
            ...data,
            uploadedFiles: files.map(f => ({
              filename: f.filename,
              originalname: f.originalname,
              mimetype: f.mimetype,
              size: f.size,
            })),
          };
        }
        return data;
      }),
    );
  }

  private async validateFileContent(file: Express.Multer.File): Promise<void> {
    // Skip validation for text files
    if (file.mimetype === 'text/plain') {
      return;
    }

    const signatures = FILE_SIGNATURES[file.mimetype];
    
    if (!signatures) {
      // If we don't have signatures for this type, skip content validation
      this.logger.warn(`No signature validation for type: ${file.mimetype}`);
      return;
    }

    try {
      // Read the first 512 bytes of the file
      const fileBuffer = await fs.readFile(file.path);
      const header = fileBuffer.slice(0, 512);
      
      // Check if file matches expected signatures
      let isValid = true;
      
      for (const sig of signatures) {
        const fileSig = header.slice(sig.offset, sig.offset + sig.signature.length);
        
        if (!fileSig.equals(sig.signature)) {
          isValid = false;
          break;
        }
      }
      
      if (!isValid) {
        throw new BadRequestException(
          `Conteúdo do arquivo não corresponde ao tipo declarado: ${file.mimetype}`,
        );
      }
      
      // Additional security checks
      await this.performSecurityChecks(fileBuffer, file);
      
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      this.logger.error(`Error validating file content: ${error.message}`);
      throw new BadRequestException('Erro ao validar conteúdo do arquivo');
    }
  }

  private async performSecurityChecks(
    fileBuffer: Buffer,
    file: Express.Multer.File,
  ): Promise<void> {
    const fileContent = fileBuffer.toString('utf8', 0, Math.min(fileBuffer.length, 10000));
    
    // Check for embedded scripts or suspicious content
    const suspiciousPatterns = [
      /<script[\s>]/i,
      /<iframe[\s>]/i,
      /javascript:/i,
      /on\w+\s*=/i, // Event handlers
      /<embed[\s>]/i,
      /<object[\s>]/i,
      /eval\s*\(/i,
      /document\s*\./i,
      /window\s*\./i,
    ];
    
    // Only check for scripts in certain file types
    if (file.mimetype === 'text/plain' || file.mimetype.includes('image/svg')) {
      for (const pattern of suspiciousPatterns) {
        if (pattern.test(fileContent)) {
          throw new BadRequestException(
            'Arquivo contém conteúdo potencialmente malicioso',
          );
        }
      }
    }
    
    // Check for PHP tags (common in web shells)
    if (fileContent.includes('<?php') || fileContent.includes('<?=')) {
      throw new BadRequestException(
        'Arquivo contém código PHP não permitido',
      );
    }
    
    // Check for null bytes (can be used for path traversal)
    if (fileBuffer.includes(0x00)) {
      // Allow null bytes only in binary files (images, PDFs)
      if (!file.mimetype.startsWith('image/') && file.mimetype !== 'application/pdf') {
        throw new BadRequestException(
          'Arquivo contém caracteres nulos não permitidos',
        );
      }
    }
  }
}