// sgpet-backend/src/equipos/update-equipo.dto.ts:
import { IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateEquipoDto {
    @IsOptional()
    @IsString()
    @MinLength(2)
    codigo?: string;

    @IsOptional()
    @IsString()
    @MinLength(2)
    nombre?: string;

    @IsOptional()
    @IsString()
    descripcion?: string;

    @IsOptional()
    @IsString()
    marca?: string;

    @IsOptional()
    @IsString()
    modelo?: string;

    @IsOptional()
    @IsString()
    numeroSerie?: string;

    @IsOptional()
    @IsInt()
    categoriaId?: number;
}