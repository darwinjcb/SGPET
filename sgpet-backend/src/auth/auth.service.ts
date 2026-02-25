// sgpet-backend/src/auth/auth.service.ts:
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ServicioPrismaService } from '../prisma.service';
import { LoginDto } from './login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: ServicioPrismaService,
        private readonly jwt: JwtService,
    ) { }

    async login(dto: LoginDto) {
        const usuario = await this.prisma.usuario.findUnique({
            where: { email: dto.email },
        });

        if (!usuario || !usuario.activo) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const ok = await bcrypt.compare(dto.password, usuario.password);
        if (!ok) throw new UnauthorizedException('Credenciales inválidas');

        const payload = {
            sub: usuario.id,
            email: usuario.email,
            rol: usuario.rol,
        };

        return {
            access_token: await this.jwt.signAsync(payload),
            usuario: {
                id: usuario.id,
                nombres: usuario.nombres,
                apellidos: usuario.apellidos,
                email: usuario.email,
                rol: usuario.rol,
            },
        };
    }
}