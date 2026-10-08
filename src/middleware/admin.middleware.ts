import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware.js';

export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({
      success: false,
      message: 'Access forbidden: Admin privilege required.',
    });
    return;
  }
  next();
};
