import type { Request } from 'express';

export interface AuthenticatedUser {
  id: number;
  authId: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}
