// sgpet-backend/src/auth/roles.decorator.ts:
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export type Rol = 'ADMIN' | 'DOCENTE' | 'ESTUDIANTE';

export const Roles = (...roles: Rol[]) => SetMetadata(ROLES_KEY, roles);