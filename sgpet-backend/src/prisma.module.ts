/* Módulo de Prisma para NestJS */
// sgpet-backend/src/prisma.module.ts:
import { Global, Module } from '@nestjs/common';
import { ServicioPrismaService } from './prisma.service';

@Global()
@Module({
  providers: [ServicioPrismaService],
  exports: [ServicioPrismaService],
})
export class ModuloPrismaModule {}