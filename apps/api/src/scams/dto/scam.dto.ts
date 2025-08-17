import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsArray,
  IsDate,
  MinLength,
  MaxLength,
  IsUrl,
  IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ScamStatus } from '@prisma/client';

export class CreateScamDto {
  @IsString()
  @MinLength(10)
  @MaxLength(200)
  title: string;

  @IsString()
  @MinLength(50)
  description: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  category: string; // slug da categoria do banco de dados

  @IsOptional()
  @IsString()
  scammerName?: string;

  @IsOptional()
  @IsUrl()
  scammerWebsite?: string;

  @IsOptional()
  @IsString()
  scammerPhone?: string;

  @IsOptional()
  @IsEmail()
  scammerEmail?: string;

  @IsOptional()
  @IsNumber()
  amountLost?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateOccurred?: Date;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  evidence?: string[];
}

export class UpdateScamDto {
  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(50)
  description?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  category?: string; // slug da categoria do banco de dados

  @IsOptional()
  @IsEnum(ScamStatus)
  status?: ScamStatus;

  @IsOptional()
  @IsString()
  scammerName?: string;

  @IsOptional()
  @IsUrl()
  scammerWebsite?: string;

  @IsOptional()
  @IsString()
  scammerPhone?: string;

  @IsOptional()
  @IsEmail()
  scammerEmail?: string;

  @IsOptional()
  @IsNumber()
  amountLost?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateOccurred?: Date;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  evidence?: string[];
}

export class FilterScamsDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  category?: string; // slug da categoria do banco de dados

  @IsOptional()
  @IsEnum(ScamStatus)
  status?: ScamStatus;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  sortBy?: 'createdAt' | 'views' | 'likes' | 'comments';

  @IsOptional()
  @IsString()
  order?: 'asc' | 'desc';
}