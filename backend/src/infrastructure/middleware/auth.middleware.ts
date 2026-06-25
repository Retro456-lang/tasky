import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '@/config/env.js';
import { UserModel } from '@/features/auth/models/user.model.js';
import { AppError } from './errorHandler.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    role: 'Superadmin' | 'Manager' | 'Employee';
  };
}

export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Authentication token missing or invalid', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as {
      userId: string;
      email: string;
      role: 'Superadmin' | 'Manager' | 'Employee';
    };

    const user = await UserModel.findById(decoded.userId).select('-passwordHash');
    if (!user) {
      throw new AppError('User no longer exists', 401);
    }

    (req as AuthenticatedRequest).user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    throw new AppError('Authentication failed', 401);
  }
}

export function requireRole(roles: ('Superadmin' | 'Manager' | 'Employee')[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user) {
      throw new AppError('Not authenticated', 401);
    }

    if (!roles.includes(authReq.user.role)) {
      throw new AppError('Forbidden: You do not have permission for this action', 403);
    }

    next();
  };
}
