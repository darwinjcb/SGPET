// sgpet-backend/src/auth/roles.decorator.ts:
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export type RolApp = 'ADMIN' | 'DOCENTE' | 'ESTUDIANTE';

export const Roles = (...roles: RolApp[]) => SetMetadata(ROLES_KEY, roles);