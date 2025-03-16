import { Role } from '@prisma/client';

export type AuthRoles = Role;

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}
