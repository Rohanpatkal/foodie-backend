import { User, IUser } from '../models/User.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { signToken } from '../utils/jwt.js';

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export class AuthService {
  static async register(dto: RegisterDTO): Promise<{ user: Partial<IUser>; token: string }> {
    const email = dto.email.toLowerCase().trim();
    const existing = await User.findOne({ email });
    if (existing) {
      const err: any = new Error('An account with this email already exists');
      err.statusCode = 400;
      throw err;
    }

    const passwordHash = await hashPassword(dto.password);
    const user = await User.create({
      name: dto.name.trim(),
      email,
      passwordHash,
      role: 'customer',
    });

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  static async login(dto: LoginDTO): Promise<{ user: Partial<IUser>; token: string }> {
    const email = dto.email.toLowerCase().trim();
    const user = await User.findOne({ email });
    if (!user) {
      const err: any = new Error('Invalid email or password');
      err.statusCode = 401;
      throw err;
    }

    const valid = await comparePassword(dto.password, user.passwordHash);
    if (!valid) {
      const err: any = new Error('Invalid email or password');
      err.statusCode = 401;
      throw err;
    }

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  static async getProfile(userId: string): Promise<Partial<IUser>> {
    const user = await User.findById(userId).select('-passwordHash');
    if (!user) {
      const err: any = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }
    return user;
  }
}
