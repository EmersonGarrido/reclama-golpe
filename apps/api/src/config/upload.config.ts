import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import sanitizeFilename = require('sanitize-filename');
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

// Allowed file types and their MIME types
export const ALLOWED_FILE_TYPES = {
  // Images
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'image/webp': ['.webp'],
  
  // Documents (for evidence)
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  
  // Text files
  'text/plain': ['.txt'],
};

// Maximum file sizes (in bytes)
export const MAX_FILE_SIZES = {
  image: 5 * 1024 * 1024, // 5MB for images
  document: 10 * 1024 * 1024, // 10MB for documents
  default: 5 * 1024 * 1024, // 5MB default
};

// Get max file size based on MIME type
const getMaxFileSize = (mimetype: string): number => {
  if (mimetype.startsWith('image/')) {
    return MAX_FILE_SIZES.image;
  }
  if (mimetype.startsWith('application/')) {
    return MAX_FILE_SIZES.document;
  }
  return MAX_FILE_SIZES.default;
};

// File filter function
const fileFilter = (
  req: any,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  // Check if file type is allowed
  if (!ALLOWED_FILE_TYPES[file.mimetype]) {
    return callback(
      new BadRequestException(
        `Tipo de arquivo não permitido. Tipos permitidos: ${Object.keys(ALLOWED_FILE_TYPES).join(', ')}`,
      ),
      false,
    );
  }

  // Check file extension
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = ALLOWED_FILE_TYPES[file.mimetype];
  
  if (!allowedExtensions.includes(ext)) {
    return callback(
      new BadRequestException(
        `Extensão de arquivo inválida para o tipo ${file.mimetype}`,
      ),
      false,
    );
  }

  callback(null, true);
};

// Storage configuration
const storage = diskStorage({
  destination: (req, file, cb) => {
    // Create different folders for different file types
    let folder = 'uploads/misc';
    
    if (file.mimetype.startsWith('image/')) {
      folder = 'uploads/images';
    } else if (file.mimetype.startsWith('application/')) {
      folder = 'uploads/documents';
    }
    
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    // Sanitize original filename
    const sanitized = sanitizeFilename(file.originalname);
    const nameWithoutExt = path.parse(sanitized).name;
    const extension = path.extname(sanitized);
    
    // Generate unique filename with UUID
    const uniqueName = `${nameWithoutExt}-${uuidv4()}${extension}`;
    
    cb(null, uniqueName);
  },
});

// Multer configuration
export const multerConfig: MulterOptions = {
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZES.default,
    files: 5, // Maximum 5 files per request
    fields: 10, // Maximum 10 fields
    fieldNameSize: 100, // Maximum field name size
    fieldSize: 1024, // Maximum field value size (1KB)
    headerPairs: 100, // Maximum header pairs
  },
};

// Validate file size based on type
export const validateFileSize = (
  file: Express.Multer.File,
): void => {
  const maxSize = getMaxFileSize(file.mimetype);
  
  if (file.size > maxSize) {
    throw new BadRequestException(
      `Arquivo muito grande. Tamanho máximo permitido: ${maxSize / (1024 * 1024)}MB`,
    );
  }
};

// Sanitize and validate filename
export const sanitizeAndValidateFilename = (filename: string): string => {
  // Remove any path traversal attempts
  const sanitized = sanitizeFilename(filename);
  
  // Check for suspicious patterns
  const suspiciousPatterns = [
    '../',
    '..\\',
    '%2e%2e',
    '0x2e',
    '..;',
    '..',
  ];
  
  for (const pattern of suspiciousPatterns) {
    if (sanitized.toLowerCase().includes(pattern)) {
      throw new BadRequestException('Nome de arquivo inválido detectado');
    }
  }
  
  // Limit filename length
  if (sanitized.length > 255) {
    throw new BadRequestException('Nome de arquivo muito longo');
  }
  
  // Check for valid characters
  const validFilenameRegex = /^[a-zA-Z0-9._\-\s]+$/;
  if (!validFilenameRegex.test(sanitized)) {
    throw new BadRequestException('Nome de arquivo contém caracteres inválidos');
  }
  
  return sanitized;
};