// sgpet-backend/src/equipos/create-equipo.dto.ts:
import { IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateEquipoDto {
    @IsString()
    @MinLength(2)
    codigo!: string;

    @IsString()
    @MinLength(2)
    nombre!: string;

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

    @IsInt()
    categoriaId!: number;
}