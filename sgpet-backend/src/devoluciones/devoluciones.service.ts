// sgpet-backend/src/devoluciones/devoluciones.service.ts:
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ServicioPrismaService } from '../prisma.service';
import { RegistrarDevolucionDto } from './registrar-devolucion.dto';

@Injectable()
export class DevolucionesService {
    constructor(private readonly prisma: ServicioPrismaService) { }

    async registrar(dto: RegistrarDevolucionDto) {
        return this.prisma.$transaction(async (tx) => {
            const prestamo = await tx.prestamo.findUnique({
                where: { id: dto.prestamoId },
            });

            if (!prestamo) throw new NotFoundException('Préstamo no encontrado');

            if (prestamo.estado !== 'APROBADO') {
                throw new BadRequestException('Solo se puede devolver un préstamo APROBADO');
            }

            // Evitar doble devolución
            const yaDevuelto = await tx.devolucion.findUnique({
                where: { prestamoId: dto.prestamoId },
            });
            if (yaDevuelto) throw new BadRequestException('Este préstamo ya fue devuelto');

            // 1) Crear devolución
            const devolucion = await tx.devolucion.create({
                data: {
                    prestamoId: dto.prestamoId,
                    estadoEquipoAlDevolver: dto.estadoEquipoAlDevolver as any,
                    observacion: dto.observacion,
                },
            });

            // 2) Actualizar préstamo
            await tx.prestamo.update({
                where: { id: dto.prestamoId },
                data: {
                    estado: 'DEVUELTO',
                    fechaEntrega: prestamo.fechaEntrega ?? new Date(),
                },
            });

            // 3) Actualizar equipo según estado devuelto
            const estadoEquipo =
                dto.estadoEquipoAlDevolver === 'BUENO' ? 'DISPONIBLE' : 'MANTENIMIENTO';

            const disponible = dto.estadoEquipoAlDevolver === 'BUENO';

            await tx.equipo.update({
                where: { id: prestamo.equipoId },
                data: {
                    estado: estadoEquipo as any,
                    disponible,
                },
            });

            return devolucion;
        });
    }
}