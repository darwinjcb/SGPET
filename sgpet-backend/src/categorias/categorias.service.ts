// sgpet-backend/src/categorias/categorias.service.ts:
import { Injectable, NotFoundException } from '@nestjs/common';
import { ServicioPrismaService } from '../prisma.service';
import { CreateCategoriaDto } from './create-categoria.dto';
import { UpdateCategoriaDto } from './update-categoria.dto';

@Injectable()
export class CategoriasService {
    constructor(private readonly prisma: ServicioPrismaService) { }

    create(dto: CreateCategoriaDto) {
        return this.prisma.categoria.create({ data: { nombre: dto.nombre } });
    }

    findAll() {
        return this.prisma.categoria.findMany({ orderBy: { id: 'desc' } });
    }

    async findOne(id: number) {
        const categoria = await this.prisma.categoria.findUnique({ where: { id } });
        if (!categoria) throw new NotFoundException('Categoría no encontrada');
        return categoria;
    }

    async update(id: number, dto: UpdateCategoriaDto) {
        await this.findOne(id);
        return this.prisma.categoria.update({
            where: { id },
            data: { nombre: dto.nombre },
        });
    }

    async remove(id: number) {
        await this.findOne(id);
        return this.prisma.categoria.delete({ where: { id } });
    }
}
