// sgpet-backend/src/modulo-prisma.module.ts:
import { Global, Module } from '@nestjs/common';
import { ServicioPrismaService } from './servicio-prisma.service';

@Global()
@Module({
    providers: [ServicioPrismaService],
    exports: [ServicioPrismaService],
})
export class ModuloPrismaModule { }