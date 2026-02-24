// sgpet-backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ModuloPrismaModule } from './modulo-prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ModuloPrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }