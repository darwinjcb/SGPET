// sgpet-backend/src/categorias/categorias.controller.ts:
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards, } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto } from './create-categoria.dto';
import { UpdateCategoriaDto } from './update-categoria.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('categorias')
export class CategoriasController {
    constructor(private readonly categoriasService: CategoriasService) { }

    @Post()
    create(@Body() dto: CreateCategoriaDto) {
        return this.categoriasService.create(dto);
    }

    @Get()
    findAll() {
        return this.categoriasService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.categoriasService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoriaDto) {
        return this.categoriasService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.categoriasService.remove(id);
    }
}