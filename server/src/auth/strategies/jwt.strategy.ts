import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { type JwtPayload } from '../auth.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    if (process.env.JWT_SECRET)
      super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: process.env.JWT_SECRET,
      });
  }

  async validate(payload: any): Promise<JwtPayload> {
    return {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
      isActivated: !!payload.isActivated,
      isBanned: !!payload.isBanned,
    };
  }
}
