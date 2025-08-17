import { IsString, IsOptional, MinLength, MaxLength, IsUrl } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @IsOptional()
  @IsUrl()
  avatar?: string;
}

export class ChangePasswordDto {
  @IsString()
  currentPassword: string;

  @IsString()
  @MinLength(6)
  newPassword: string;
}

export class UserResponseDto {
  id: string;
  email: string;
  name: string;
  bio?: string;
  avatar?: string;
  isAdmin: boolean;
  createdAt: Date;
  _count?: {
    scams: number;
    comments: number;
    likes: number;
  };
}