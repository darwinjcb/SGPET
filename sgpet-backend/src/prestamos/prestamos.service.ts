// sgpet-backend/src/prestamos/prestamos.service.ts:
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ServicioPrismaService } from '../prisma.service';
import { SolicitarPrestamoDto } from './solicitar-prestamo.dto';
import { AprobarPrestamoDto } from './aprobar-prestamo.dto';
import { RechazarPrestamoDto } from './rechazar-prestamo.dto';

type UserReq = { sub: number; rol: 'ADMIN' | 'DOCENTE' | 'ESTUDIANTE' };

@Injectable()
export class PrestamosService {
    constructor(private readonly prisma: ServicioPrismaService) { }

    async solicitar(dto: SolicitarPrestamoDto, user: UserReq) {
        if (user.rol === 'ADMIN') {
            throw new ForbiddenException('El administrador no solicita préstamos');
        }

        const equipo = await this.prisma.equipo.findUnique({ where: { id: dto.equipoId } });
        if (!equipo) throw new NotFoundException('Equipo no encontrado');

        if (!equipo.disponible || equipo.estado !== 'DISPONIBLE') {
            throw new BadRequestException('El equipo no está disponible');
        }

        return this.prisma.prestamo.create({
            data: {
                usuarioId: user.sub,
                equipoId: dto.equipoId,
                fechaDevolucion: new Date(dto.fechaDevolucion),
                observacion: dto.observacion,
            },
            include: {
                usuario: { select: { id: true, nombres: true, apellidos: true, rol: true } },
                equipo: { select: { id: true, codigo: true, nombre: true } },
            },
        });
    }

    async aprobar(prestamoId: number, dto: AprobarPrestamoDto) {
        // transacción: cambia préstamo + cambia equipo
        return this.prisma.$transaction(async (tx) => {
            const prestamo = await tx.prestamo.findUnique({ where: { id: prestamoId } });
            if (!prestamo) throw new NotFoundException('Préstamo no encontrado');

            if (prestamo.estado !== 'PENDIENTE') {
                throw new BadRequestException('Solo se puede aprobar un préstamo PENDIENTE');
            }

            const equipo = await tx.equipo.findUnique({ where: { id: prestamo.equipoId } });
            if (!equipo) throw new NotFoundException('Equipo no encontrado');

            if (!equipo.disponible || equipo.estado !== 'DISPONIBLE') {
                throw new BadRequestException('El equipo ya no está disponible');
            }

            await tx.equipo.update({
                where: { id: equipo.id },
                data: { estado: 'PRESTADO', disponible: false },
            });

            return tx.prestamo.update({
                where: { id: prestamoId },
                data: {
                    estado: 'APROBADO',
                    fechaAprobacion: new Date(),
                    fechaEntrega: new Date(),
                    observacion: dto.observacion ?? prestamo.observacion,
                },
                include: {
                    usuario: { select: { id: true, nombres: true, apellidos: true, rol: true } },
                    equipo: { select: { id: true, codigo: true, nombre: true } },
                },
            });
        });
    }

    async rechazar(prestamoId: number, dto: RechazarPrestamoDto) {
        const prestamo = await this.prisma.prestamo.findUnique({ where: { id: prestamoId } });
        if (!prestamo) throw new NotFoundException('Préstamo no encontrado');

        if (prestamo.estado !== 'PENDIENTE') {
            throw new BadRequestException('Solo se puede rechazar un préstamo PENDIENTE');
        }

        return this.prisma.prestamo.update({
            where: { id: prestamoId },
            data: {
                estado: 'RECHAZADO',
                fechaAprobacion: new Date(),
                observacion: dto.observacion ?? prestamo.observacion,
            },
        });
    }

    async listar(user: UserReq) {
        // Admin ve todo; docente/estudiante solo lo suyo
        const where = user.rol === 'ADMIN' ? {} : { usuarioId: user.sub };

        return this.prisma.prestamo.findMany({
            where,
            orderBy: { id: 'desc' },
            include: {
                usuario: { select: { id: true, nombres: true, apellidos: true, rol: true } },
                equipo: { select: { id: true, codigo: true, nombre: true } },
                devolucion: true,
            },
        });
    }
}
