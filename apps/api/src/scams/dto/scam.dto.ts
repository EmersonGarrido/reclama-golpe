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
import { ScamCategory, ScamStatus } from '@prisma/client';

export class CreateScamDto {
  @IsString()
  @MinLength(10)
  @MaxLength(200)
  title: string;

  @IsString()
  @MinLength(50)
  description: string;

  @IsEnum(ScamCategory)
  category: ScamCategory;

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
  @IsEnum(ScamCategory)
  category?: ScamCategory;

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
  @IsEnum(ScamCategory)
  category?: ScamCategory;

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