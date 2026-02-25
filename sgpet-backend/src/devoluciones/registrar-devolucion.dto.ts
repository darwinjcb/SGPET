// sgpet-backend/src/devoluciones/registrar-devolucion.dto.ts:
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

export enum EstadoDevolucionDto {
    BUENO = 'BUENO',
    CON_DANOS = 'CON_DANOS',
    NO_FUNCIONAL = 'NO_FUNCIONAL',
}

export class RegistrarDevolucionDto {
    @IsInt()
    prestamoId!: number;

    @IsEnum(EstadoDevolucionDto)
    estadoEquipoAlDevolver!: EstadoDevolucionDto;

    @IsOptional()
    @IsString()
    observacion?: string;
}