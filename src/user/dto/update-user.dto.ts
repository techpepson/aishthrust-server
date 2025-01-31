import { IsString, IsOptional, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  currentPassword?: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  newPassword?: string;
}
