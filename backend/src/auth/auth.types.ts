import { Role } from '../users/entities/user.entity.js';

export interface AuthUser {
  id: string;
  role: Role;
}

export interface JwtPayload {
  sub: string;
  role: Role;
}