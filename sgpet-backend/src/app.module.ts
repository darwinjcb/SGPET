// sgpet-backend/src/app.module.ts:
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ModuloPrismaModule } from './prisma.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { CategoriasModule } from './categorias/categorias.module';
import { EquiposModule } from './equipos/equipos.module';
import { PrestamosModule } from './prestamos/prestamos.module';
import { DevolucionesModule } from './devoluciones/devoluciones.module';
import { ReportesModule } from './reportes/reportes.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ModuloPrismaModule,
    UsuariosModule,
    AuthModule,
    CategoriasModule,
    EquiposModule,
    PrestamosModule,
    DevolucionesModule,
    ReportesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}