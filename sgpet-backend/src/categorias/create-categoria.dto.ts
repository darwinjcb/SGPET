// sgpet-backend/src/categorias/create-categoria.dto.ts:
import { IsString, MinLength } from 'class-validator';

export class CreateCategoriaDto {
    @IsString()
    @MinLength(2)
    nombre!: string;
}