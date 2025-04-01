import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { type AuthRoles } from '../auth.types';
import { AccessGuard } from '../guards/access.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';

export const ROLES_KEY = 'roles';
export function Auth(
  ...options: {
    roles?: AuthRoles[];
    mustHaveAccess?: boolean;
  }[]
) {
  const roles = options[0]?.roles;
  const mustHaveAccess = options[0]?.mustHaveAccess;
  const guards = [JwtAuthGuard, RolesGuard, mustHaveAccess && AccessGuard];
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    UseGuards(...guards.filter((guard) => !!guard)),
  );
}
