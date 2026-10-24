import { IsEnum, IsOptional, IsEmail } from 'class-validator';
import { Role } from '../entities/role.enum.js';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
