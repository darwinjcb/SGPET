// sgpet-backend/src/usuarios/create-usuario.dto.ts:
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export enum RolDto {
  ADMIN = 'ADMIN',
  DOCENTE = 'DOCENTE',
  ESTUDIANTE = 'ESTUDIANTE',
}

export class CreateUsuarioDto {
  @IsOptional()
  @IsString()
  cedula?: string;

  @IsString()
  nombres!: string;

  @IsString()
  apellidos!: string;

  @IsEmail()
  email!: string;

  @MinLength(6)
  password!: string;

  @IsOptional()
  @IsEnum(RolDto)
  rol?: RolDto;
}