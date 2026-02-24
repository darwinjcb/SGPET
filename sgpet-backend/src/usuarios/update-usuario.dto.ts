// sgpet-backend/src/usuarios/update-usuario.dto.ts:
import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import  { RolDto } from './create-usuario.dto';

export class UpdateUsuarioDto {
  @IsOptional()
  @IsString()
  cedula?: string;

  @IsOptional()
  @IsString()
  nombres?: string;

  @IsOptional()
  @IsString()
  apellidos?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsEnum(RolDto)
  rol?: RolDto;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
