// sgpet-backend/src/auth/roles.guard.ts:
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, RolApp } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const rolesRequeridos = this.reflector.getAllAndOverride<RolApp[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Si no se definieron roles, se permite
    if (!rolesRequeridos || rolesRequeridos.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user as { rol?: RolApp } | undefined;

    if (!user?.rol) return false;

    return rolesRequeridos.includes(user.rol);
  }
}