/* Pruebas del Servicio de Prisma para NestJS */
// sgpet-backend/src/prisma.service.spec.ts:
import { Test, TestingModule } from '@nestjs/testing';
import { ServicioPrismaService } from './prisma.service';

describe('ServicioPrismaService', () => {
  let service: ServicioPrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServicioPrismaService],
    }).compile();

    service = module.get<ServicioPrismaService>(ServicioPrismaService);
  });

  afterAll(async () => {
    // Evita conexiones colgadas si llegó a conectar
    await service?.$disconnect().catch(() => undefined);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});