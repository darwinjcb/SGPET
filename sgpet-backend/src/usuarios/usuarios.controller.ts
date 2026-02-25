/* Controlador de Usuario para NestJS */
// sgpet-backend/src/usuarios/usuarios.controller.ts:
import { Body, Controller, Delete, Get, Param, Patch, Post, ParseIntPipe, } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './create-usuario.dto';
import { UpdateUsuarioDto } from './update-usuario.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('usuarios')
export class UsuariosController {
    constructor(private readonly usuariosService: UsuariosService) { }

    @Post()
    create(@Body() dto: CreateUsuarioDto) {
        return this.usuariosService.create(dto);
    }

    @Get()
    findAll() {
        return this.usuariosService.findAll();
    }


    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.usuariosService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateUsuarioDto,
    ) {
        return this.usuariosService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.usuariosService.remove(id);
    }
}