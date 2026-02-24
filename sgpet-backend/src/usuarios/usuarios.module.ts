/* Módulo de Usuario para NestJS */
// sgpet-backend/src/usuarios/usuarios.module.ts:

import { Module } from '@nestjs/common';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';

@Module({
  controllers: [UsuariosController],
  providers: [UsuariosService],
})
export class UsuariosModule {}