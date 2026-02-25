// sgpet-backend/src/prestamos/rechazar-prestamo.dto.ts:
import { IsOptional, IsString } from 'class-validator';

export class RechazarPrestamoDto {
    @IsOptional()
    @IsString()
    observacion?: string;
}