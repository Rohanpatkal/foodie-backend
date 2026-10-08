import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { isValidEmail, isValidPassword } from '../utils/validation.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, password } = req.body;

      if (!name || typeof name !== 'string' || !name.trim()) {
        res.status(400).json({ success: false, message: 'Name is required' });
        return;
      }
      if (!email || !isValidEmail(email)) {
        res.status(400).json({ success: false, message: 'A valid email is required' });
        return;
      }
      if (!password || !isValidPassword(password)) {
        res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters long',
        });
        return;
      }

      const { user, token } = await AuthService.register({ name, email, password });

      res.cookie('token', token, COOKIE_OPTIONS);
      res.status(201).json({
        success: true,
        message: 'Account created successfully',
        data: { user, token },
      });
    } catch (err) {
      next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !isValidEmail(email)) {
        res.status(400).json({ success: false, message: 'Valid email is required' });
        return;
      }
      if (!password) {
        res.status(400).json({ success: false, message: 'Password is required' });
        return;
      }

      const { user, token } = await AuthService.login({ email, password });

      res.cookie('token', token, COOKIE_OPTIONS);
      res.status(200).json({
        success: true,
        message: 'Logged in successfully',
        data: { user, token },
      });
    } catch (err) {
      next(err);
    }
  }

  static async logout(_req: Request, res: Response): Promise<void> {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  }

  static async getMe(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const user = await AuthService.getProfile(req.user._id.toString());
      res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (err) {
      next(err);
    }
  }
}
