// sgpet-backend/src/prestamos/prestamos.controller.ts:
import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards, } from '@nestjs/common';
import { PrestamosService } from './prestamos.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { SolicitarPrestamoDto } from './solicitar-prestamo.dto';
import { AprobarPrestamoDto } from './aprobar-prestamo.dto';
import { RechazarPrestamoDto } from './rechazar-prestamo.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('prestamos')
export class PrestamosController {
    constructor(private readonly prestamosService: PrestamosService) { }

    // DOCENTE/ESTUDIANTE solicitan
    @Roles('DOCENTE', 'ESTUDIANTE')
    @Post('solicitar')
    solicitar(@Body() dto: SolicitarPrestamoDto, @Req() req: any) {
        return this.prestamosService.solicitar(dto, req.user);
    }

    // ADMIN aprueba
    @Roles('ADMIN')
    @Patch(':id/aprobar')
    aprobar(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: AprobarPrestamoDto,
    ) {
        return this.prestamosService.aprobar(id, dto);
    }

    // ADMIN rechaza
    @Roles('ADMIN')
    @Patch(':id/rechazar')
    rechazar(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: RechazarPrestamoDto,
    ) {
        return this.prestamosService.rechazar(id, dto);
    }

    @Get()
    listar(@Req() req: any) {
        return this.prestamosService.listar(req.user);
    }
}