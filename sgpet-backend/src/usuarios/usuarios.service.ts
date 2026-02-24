/* Servicio de Usuario para NestJS */
// sgpet-backend/src/usuarios/usuarios.service.ts:

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from './create-usuario.dto';
import { UpdateUsuarioDto } from './update-usuario.dto';
import { ServicioPrismaService } from '../prisma.service';
@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: ServicioPrismaService) {}

  async create(dto: CreateUsuarioDto) {
    return this.prisma.usuario.create({
      data: {
        cedula: dto.cedula,
        nombres: dto.nombres,
        apellidos: dto.apellidos,
        email: dto.email,
        password: dto.password, // luego encriptamos
        //rol: dto.rol ?? 'ESTUDIANTE',
    rol: (dto.rol ?? 'ESTUDIANTE') as any,
      },
      select: {
        id: true,
        cedula: true,
        nombres: true,
        apellidos: true,
        email: true,
        rol: true,
        activo: true,
        createdAt: true,
      },
    });
  }

  async findAll() {
    return this.prisma.usuario.findMany({
      orderBy: { id: 'desc' },
      select: {
        id: true,
        cedula: true,
        nombres: true,
        apellidos: true,
        email: true,
        rol: true,
        activo: true,
        createdAt: true,
      },
    });
  }

  async findOne(id: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        cedula: true,
        nombres: true,
        apellidos: true,
        email: true,
        rol: true,
        activo: true,
        createdAt: true,
      },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return usuario;
  }

  async update(id: number, dto: UpdateUsuarioDto) {
    await this.findOne(id);

    return this.prisma.usuario.update({
      where: { id },
      data: {
        cedula: dto.cedula,
        nombres: dto.nombres,
        apellidos: dto.apellidos,
        email: dto.email,
        password: dto.password,
        rol: dto.rol,
        activo: dto.activo,
      },
      select: {
        id: true,
        cedula: true,
        nombres: true,
        apellidos: true,
        email: true,
        rol: true,
        activo: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.usuario.delete({
      where: { id },
      select: { id: true },
    });
  }
}