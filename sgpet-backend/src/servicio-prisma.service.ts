// sgpet-backend/src/servicio-prisma.service.ts:
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from './generated/prisma/client';
@Injectable()
export class ServicioPrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy {
    async onModuleInit() {
    }

    async onModuleDestroy() {
    }
}