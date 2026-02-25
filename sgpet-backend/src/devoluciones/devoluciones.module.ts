// sgpet-backend/src/devoluciones/devoluciones.module.ts:
import { Module } from '@nestjs/common';
import { DevolucionesController } from './devoluciones.controller';
import { DevolucionesService } from './devoluciones.service';

@Module({
  controllers: [DevolucionesController],
  providers: [DevolucionesService]
})
export class DevolucionesModule { }
