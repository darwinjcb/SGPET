// sgpet-backend/src/devoluciones/devoluciones.controller.ts:
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { DevolucionesService } from './devoluciones.service';
import { RegistrarDevolucionDto } from './registrar-devolucion.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('devoluciones')
export class DevolucionesController {
    constructor(private readonly devolucionesService: DevolucionesService) { }

    @Post()
    registrar(@Body() dto: RegistrarDevolucionDto) {
        return this.devolucionesService.registrar(dto);
    }
}