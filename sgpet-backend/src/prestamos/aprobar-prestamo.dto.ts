// sgpet-backend/src/prestamos/aprobar-prestamo.dto.ts:
import { IsOptional, IsString } from 'class-validator';

export class AprobarPrestamoDto {
    @IsOptional()
    @IsString()
    observacion?: string;
}