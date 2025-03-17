import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const queryParams = request.query;
    const user = request?.user;
    const userId = queryParams.userId;
    if (!user) throw new UnauthorizedException('You do not have access!');
    if (userId !== user.sub)
      throw new UnauthorizedException('You do not have access!');
    return true;
  }
}
