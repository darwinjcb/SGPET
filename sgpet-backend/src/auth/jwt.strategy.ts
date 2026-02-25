// sgpet-backend/src/auth/jwt.strategy.ts:
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

type JwtPayload = {
    sub: number;
    email: string;
    rol: 'ADMIN' | 'DOCENTE' | 'ESTUDIANTE';
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(config: ConfigService) {
        const secreto = config.get<string>('JWT_SECRET');
        if (!secreto) throw new Error('JWT_SECRET no está definida. Revisa tu .env');

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: secreto,
        });
    }

    async validate(payload: JwtPayload) {
        if (!payload?.sub) throw new UnauthorizedException('Token inválido');
        return payload;
    }
}