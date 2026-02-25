// sgpet-backend/src/prestamos/solicitar-prestamo.dto.ts:
import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class SolicitarPrestamoDto {
    @IsInt()
    equipoId!: number;
    @IsDateString()
    fechaDevolucion!: string;
    @IsOptional()
    @IsString()
    observacion?: string;
}