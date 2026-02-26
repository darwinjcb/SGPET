// sgpet-backend/src/reportes/reportes.controller.ts:
import { Controller, Get, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { ReportesService } from './reportes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard)
@Controller('reportes')
export class ReportesController {
    constructor(private readonly reportes: ReportesService) { }

    // 🔓 Accesible a cualquier usuario autenticado
    @Get('equipos-disponibles')
    equiposDisponibles() {
        return this.reportes.equiposDisponibles();
    }

    // 🔒 Solo ADMIN
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    @Get('prestamos-activos')
    prestamosActivos() {
        return this.reportes.prestamosActivos();
    }

    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    @Get('prestamos-retraso')
    prestamosEnRetraso() {
        return this.reportes.prestamosEnRetraso();
    }

    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    @Get('equipos-mantenimiento')
    equiposMantenimiento() {
        return this.reportes.equiposEnMantenimiento();
    }

    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    @Get('equipos-mas-prestados')
    equiposMasPrestados(@Query('top', ParseIntPipe) top: number) {
        return this.reportes.equiposMasPrestados(top);
    }

    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    @Get('usuarios-mas-prestamos')
    usuariosMasPrestamos(@Query('top', ParseIntPipe) top: number) {
        return this.reportes.usuariosConMasPrestamos(top);
    }
}