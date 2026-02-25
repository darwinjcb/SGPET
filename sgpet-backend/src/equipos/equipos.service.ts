// sgpet-backend/src/equipos/equipos.service.ts:
import { Injectable, NotFoundException } from '@nestjs/common';
import { ServicioPrismaService } from '../prisma.service';
import { CreateEquipoDto } from './create-equipo.dto';
import { UpdateEquipoDto } from './update-equipo.dto';

@Injectable()
export class EquiposService {
    constructor(private readonly prisma: ServicioPrismaService) { }

    async create(dto: CreateEquipoDto) {
        return this.prisma.equipo.create({
            data: {
                codigo: dto.codigo,
                nombre: dto.nombre,
                descripcion: dto.descripcion,
                marca: dto.marca,
                modelo: dto.modelo,
                numeroSerie: dto.numeroSerie,
                categoriaId: dto.categoriaId,
            },
        });
    }

    findAll() {
        return this.prisma.equipo.findMany({
            include: { categoria: true },
            orderBy: { id: 'desc' },
        });
    }

    async findOne(id: number) {
        const equipo = await this.prisma.equipo.findUnique({
            where: { id },
            include: { categoria: true },
        });

        if (!equipo) throw new NotFoundException('Equipo no encontrado');
        return equipo;
    }

    async update(id: number, dto: UpdateEquipoDto) {
        await this.findOne(id);

        return this.prisma.equipo.update({
            where: { id },
            data: {
                codigo: dto.codigo,
                nombre: dto.nombre,
                descripcion: dto.descripcion,
                marca: dto.marca,
                modelo: dto.modelo,
                numeroSerie: dto.numeroSerie,
                categoriaId: dto.categoriaId,
            },
        });
    }

    async remove(id: number) {
        await this.findOne(id);
        return this.prisma.equipo.delete({ where: { id } });
    }
}