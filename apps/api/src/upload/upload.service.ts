import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';
import { AuditService } from '../audit/audit.service';
import { AuditAction } from '../config/logger.config';

@Injectable()
export class UploadService {
  private readonly logger = new Logger('UploadService');
  private readonly uploadDir = path.join(process.cwd(), 'uploads');

  constructor(private readonly auditService: AuditService) {}

  /**
   * Process uploaded file with security checks
   */
  async processUploadedFile(
    file: Express.Multer.File,
    userId?: string,
  ): Promise<any> {
    try {
      // Generate file hash for integrity checking
      const fileHash = await this.generateFileHash(file.path);
      
      // Create file metadata
      const metadata = {
        originalName: file.originalname,
        filename: file.filename,
        mimetype: file.mimetype,
        size: file.size,
        hash: fileHash,
        uploadedAt: new Date(),
        uploadedBy: userId,
      };
      
      // Log file upload
      if (userId) {
        await this.auditService.logUserAction(
          AuditAction.USER_COMMENT_CREATE,
          userId,
          '',
          {
            action: 'file_upload',
            filename: file.originalname,
            size: file.size,
            type: file.mimetype,
          },
        );
      }
      
      this.logger.log(`File uploaded successfully: ${file.filename}`);
      
      return metadata;
    } catch (error) {
      this.logger.error(`Error processing uploaded file: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete uploaded file
   */
  async deleteFile(filename: string, userId?: string): Promise<void> {
    try {
      const filePath = path.join(this.uploadDir, filename);
      
      // Check if file exists
      await fs.access(filePath);
      
      // Delete file
      await fs.unlink(filePath);
      
      // Log file deletion
      if (userId) {
        await this.auditService.logUserAction(
          AuditAction.USER_COMMENT_DELETE,
          userId,
          '',
          {
            action: 'file_delete',
            filename,
          },
        );
      }
      
      this.logger.log(`File deleted: ${filename}`);
    } catch (error) {
      this.logger.error(`Error deleting file: ${error.message}`);
      throw new BadRequestException('Erro ao deletar arquivo');
    }
  }

  /**
   * Generate SHA256 hash of file
   */
  private async generateFileHash(filePath: string): Promise<string> {
    try {
      const fileBuffer = await fs.readFile(filePath);
      const hash = crypto.createHash('sha256');
      hash.update(fileBuffer);
      return hash.digest('hex');
    } catch (error) {
      this.logger.error(`Error generating file hash: ${error.message}`);
      throw new BadRequestException('Erro ao processar arquivo');
    }
  }

  /**
   * Clean up old uploads (run periodically)
   */
  async cleanupOldUploads(daysOld: number = 30): Promise<void> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);
      
      const uploadDirs = ['images', 'documents', 'misc'];
      
      for (const dir of uploadDirs) {
        const dirPath = path.join(this.uploadDir, dir);
        
        try {
          const files = await fs.readdir(dirPath);
          
          for (const file of files) {
            const filePath = path.join(dirPath, file);
            const stats = await fs.stat(filePath);
            
            if (stats.mtime < cutoffDate) {
              await fs.unlink(filePath);
              this.logger.log(`Deleted old file: ${file}`);
            }
          }
        } catch (error) {
          this.logger.warn(`Error cleaning directory ${dir}: ${error.message}`);
        }
      }
    } catch (error) {
      this.logger.error(`Error during cleanup: ${error.message}`);
    }
  }

  /**
   * Get file info securely
   */
  async getFileInfo(filename: string): Promise<any> {
    try {
      // Sanitize filename to prevent path traversal
      const sanitizedName = path.basename(filename);
      
      // Search in all upload directories
      const uploadDirs = ['images', 'documents', 'misc'];
      
      for (const dir of uploadDirs) {
        const filePath = path.join(this.uploadDir, dir, sanitizedName);
        
        try {
          const stats = await fs.stat(filePath);
          
          return {
            filename: sanitizedName,
            size: stats.size,
            createdAt: stats.birthtime,
            modifiedAt: stats.mtime,
            directory: dir,
          };
        } catch (error) {
          // File not found in this directory, continue
          continue;
        }
      }
      
      throw new BadRequestException('Arquivo não encontrado');
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Error getting file info: ${error.message}`);
      throw new BadRequestException('Erro ao buscar informações do arquivo');
    }
  }
}