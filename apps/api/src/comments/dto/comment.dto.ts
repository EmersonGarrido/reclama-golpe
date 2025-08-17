import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsUUID()
  @IsNotEmpty()
  scamId: string;
}

export class UpdateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}