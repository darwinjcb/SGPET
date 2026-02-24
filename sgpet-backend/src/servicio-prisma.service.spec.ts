// sgpet-backend/src/servicio-prisma.service.spec.ts:
import { Test, TestingModule } from '@nestjs/testing';
import { ServicioPrismaService } from './servicio-prisma.service';

describe('ServicioPrismaService', () => {
  let service: ServicioPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServicioPrismaService],
    }).compile();

    service = module.get<ServicioPrismaService>(ServicioPrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
