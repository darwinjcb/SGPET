// sgpet-backend/src/auth/auth.module.ts:
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import type { StringValue } from 'ms';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secreto = config.get<string>('JWT_SECRET');
        if (!secreto) {
          throw new Error('JWT_SECRET no está definida. Revisa tu archivo .env');
        }

        return {
          secret: secreto,
          signOptions: {
            expiresIn: (config.get<string>('JWT_EXPIRES_IN') ?? '5d') as StringValue,
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule { }