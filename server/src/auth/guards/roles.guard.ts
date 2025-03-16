import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/auth.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const request = context.switchToHttp().getRequest();
    const user = request?.user;
    if (!this.matchRoles(user?.role, roles))
      throw new UnauthorizedException('You do not have access!');
    return true;
  }

  private matchRoles(userRole: string | undefined, roles: string[]) {
    if (roles.length === 0) return true;
    return roles.some((role) => role === userRole);
  }
}
