// sgpet-backend/src/categorias/update-categoria.dto.ts:
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateCategoriaDto {
    @IsOptional()
    @IsString()
    @MinLength(2)
    nombre?: string;
}