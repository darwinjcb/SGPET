// sgpet-backend/src/reportes/reportes.controller.ts:
import { Controller, Get, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { ReportesService } from './reportes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('reportes')
export class ReportesController {
    constructor(private readonly reportes: ReportesService) { }

    @Get('prestamos-activos')
    prestamosActivos() {
        return this.reportes.prestamosActivos();
    }

    @Get('prestamos-retraso')
    prestamosEnRetraso() {
        return this.reportes.prestamosEnRetraso();
    }

    @Get('equipos-disponibles')
    equiposDisponibles() {
        return this.reportes.equiposDisponibles();
    }

    @Get('equipos-mantenimiento')
    equiposMantenimiento() {
        return this.reportes.equiposEnMantenimiento();
    }

    @Get('equipos-mas-prestados')
    equiposMasPrestados(@Query('top', ParseIntPipe) top: number) {
        return this.reportes.equiposMasPrestados(top);
    }

    @Get('usuarios-mas-prestamos')
    usuariosMasPrestamos(@Query('top', ParseIntPipe) top: number) {
        return this.reportes.usuariosConMasPrestamos(top);
    }
}
