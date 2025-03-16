import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthRoles } from '../auth.types';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';

export const ROLES_KEY = 'roles';
export function Auth(...roles: AuthRoles[]) {
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    UseGuards(JwtAuthGuard, RolesGuard),
  );
}
