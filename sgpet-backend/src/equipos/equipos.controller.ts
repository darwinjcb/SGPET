// sgpet-backend/src/equipos/equipos.controller.ts:
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards, } from '@nestjs/common';
import { EquiposService } from './equipos.service';
import { CreateEquipoDto } from './create-equipo.dto';
import { UpdateEquipoDto } from './update-equipo.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('equipos')
export class EquiposController {
    constructor(private readonly equiposService: EquiposService) { }

    @Post()
    create(@Body() dto: CreateEquipoDto) {
        return this.equiposService.create(dto);
    }

    @Get()
    findAll() {
        return this.equiposService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.equiposService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEquipoDto) {
        return this.equiposService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.equiposService.remove(id);
    }
}