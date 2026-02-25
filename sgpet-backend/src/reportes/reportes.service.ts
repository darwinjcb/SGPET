// sgpet-backend/src/reportes/reportes.service.ts:
import { Injectable } from '@nestjs/common';
import { ServicioPrismaService } from '../prisma.service';

@Injectable()
export class ReportesService {
    constructor(private readonly prisma: ServicioPrismaService) { }

    prestamosActivos() {
        return this.prisma.prestamo.findMany({
            where: { estado: 'APROBADO' },
            orderBy: { id: 'desc' },
            include: {
                usuario: { select: { id: true, nombres: true, apellidos: true, rol: true } },
                equipo: { select: { id: true, codigo: true, nombre: true } },
            },
        });
    }

    prestamosEnRetraso() {
        return this.prisma.prestamo.findMany({
            where: {
                estado: 'APROBADO',
                fechaDevolucion: { lt: new Date() },
            },
            orderBy: { fechaDevolucion: 'asc' },
            include: {
                usuario: { select: { id: true, nombres: true, apellidos: true, rol: true } },
                equipo: { select: { id: true, codigo: true, nombre: true } },
            },
        });
    }

    equiposDisponibles() {
        return this.prisma.equipo.findMany({
            where: { estado: 'DISPONIBLE', disponible: true },
            orderBy: { id: 'desc' },
            include: { categoria: true },
        });
    }

    equiposEnMantenimiento() {
        return this.prisma.equipo.findMany({
            where: { estado: 'MANTENIMIENTO' },
            orderBy: { id: 'desc' },
            include: { categoria: true },
        });
    }
    async equiposMasPrestados(top: number) {
        const rows = await this.prisma.prestamo.groupBy({
            by: ['equipoId'],
            _count: { id: true }, // ✅ Prisma v7: contar por campo
            orderBy: { _count: { id: 'desc' } }, // ✅ ordenar por conteo
            take: top,
        });

        const ids = rows.map((r) => r.equipoId);

        const equipos = await this.prisma.equipo.findMany({
            where: { id: { in: ids } },
            select: { id: true, codigo: true, nombre: true },
        });

        const map = new Map(equipos.map((e) => [e.id, e]));

        return rows.map((r) => ({
            equipo: map.get(r.equipoId),
            totalPrestamos: r._count.id,
        }));
    }

    async usuariosConMasPrestamos(top: number) {
        const rows = await this.prisma.prestamo.groupBy({
            by: ['usuarioId'],
            _count: { id: true }, // ✅ contar préstamos
            orderBy: { _count: { id: 'desc' } },
            take: top,
        });

        const ids = rows.map((r) => r.usuarioId);

        const usuarios = await this.prisma.usuario.findMany({
            where: { id: { in: ids } },
            select: { id: true, nombres: true, apellidos: true, email: true, rol: true },
        });

        const map = new Map(usuarios.map((u) => [u.id, u]));

        return rows.map((r) => ({
            usuario: map.get(r.usuarioId),
            totalPrestamos: r._count.id,
        }));
    }
}