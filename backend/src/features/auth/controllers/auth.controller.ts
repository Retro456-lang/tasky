import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { UserModel } from '../models/user.model.js';
import { env } from '@/config/env.js';
import { AppError } from '@/infrastructure/middleware/errorHandler.js';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validators/auth.validator.js';

function generateToken(userId: string, email: string, role: string): string {
  return jwt.sign({ userId, email, role }, env.jwtSecret, {
    expiresIn: '24h',
  });
}

export async function register(req: Request, res: Response): Promise<void> {
  const data = registerSchema.parse(req.body);

  const existingUser = await UserModel.findOne({ email: data.email });
  if (existingUser) {
    throw new AppError('Email is already registered', 400);
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  const user = await UserModel.create({
    name: data.name,
    email: data.email,
    passwordHash,
    role: data.role,
  });

  const token = generateToken(user._id.toString(), user.email, user.role);

  res.status(201).json({
    token,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}

export async function login(req: Request, res: Response): Promise<void> {
  const data = loginSchema.parse(req.body);

  const user = await UserModel.findOne({ email: data.email });
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isMatch = await bcrypt.compare(data.password, user.passwordHash);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = generateToken(user._id.toString(), user.email, user.role);

  res.json({
    token,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}

export async function forgotPassword(req: Request, res: Response): Promise<void> {
  const data = forgotPasswordSchema.parse(req.body);

  const user = await UserModel.findOne({ email: data.email });
  if (!user) {
    throw new AppError('User not found with this email', 404);
  }

  // Generate a random token
  const resetToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour expiry
  await user.save();

  // Print token to console for easy development retrieval
  console.log(`\n=============================================`);
  console.log(`Password reset request for: ${user.email}`);
  console.log(`Reset Token: ${resetToken}`);
  console.log(`=============================================\n`);

  res.json({
    message: 'Password reset token generated successfully. In production, this would be sent to your email.',
    token: resetToken, // also return it in response for convenience in sandbox manual verification
  });
}

export async function resetPassword(req: Request, res: Response): Promise<void> {
  const data = resetPasswordSchema.parse(req.body);

  const user = await UserModel.findOne({
    resetPasswordToken: data.token,
    resetPasswordExpires: { $gt: new Date() },
  });

  if (!user) {
    throw new AppError('Password reset token is invalid or has expired', 400);
  }

  user.passwordHash = await bcrypt.hash(data.password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: 'Password has been reset successfully' });
}

export async function getMe(req: Request, res: Response): Promise<void> {
  const authReq = req as any;
  if (!authReq.user) {
    throw new AppError('Not authenticated', 401);
  }

  res.json({
    id: authReq.user.id,
    name: authReq.user.name,
    email: authReq.user.email,
    role: authReq.user.role,
  });
}
