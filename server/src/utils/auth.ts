import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../server';
import { logger } from './logger';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d';
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '12');

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  companyId?: string;
}

// Password Hashing
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// JWT Token Generation
export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
}

// Session Management
export async function createSession(userId: string, ipAddress?: string, userAgent?: string) {
  const token = uuidv4();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

  await prisma.session.create({
    data: {
      token,
      userId,
      ipAddress,
      userAgent,
      expiresAt,
    },
  });

  return token;
}

export async function validateSession(token: string) {
  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session) return null;
  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { id: session.id } });
    return null;
  }

  return session.user;
}

export async function deleteSession(token: string) {
  await prisma.session.deleteMany({ where: { token } });
}

// Refresh Token Management
export async function createRefreshToken(userId: string) {
  const token = uuidv4();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

  await prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });

  return token;
}

export async function validateRefreshToken(token: string) {
  const refreshToken = await prisma.refreshToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!refreshToken) return null;
  if (refreshToken.revoked) return null;
  if (refreshToken.expiresAt < new Date()) {
    await prisma.refreshToken.delete({ where: { id: refreshToken.id } });
    return null;
  }

  return refreshToken.user;
}

export async function revokeRefreshToken(token: string) {
  await prisma.refreshToken.update({
    where: { token },
    data: { revoked: true },
  });
}

// Password Reset Token
export async function createPasswordResetToken(userId: string) {
  const token = uuidv4();
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour

  await prisma.passwordResetToken.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });

  return token;
}

export async function validatePasswordResetToken(token: string) {
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!resetToken) return null;
  if (resetToken.used) return null;
  if (resetToken.expiresAt < new Date()) {
    await prisma.passwordResetToken.delete({ where: { id: resetToken.id } });
    return null;
  }

  return resetToken.user;
}

export async function markPasswordResetTokenUsed(token: string) {
  await prisma.passwordResetToken.update({
    where: { token },
    data: { used: true },
  });
}

// Audit Logging
export async function logAudit(
  actorId: string,
  actorName: string,
  action: string,
  resource: string,
  resourceId: string,
  companyId?: string,
  details?: any,
  ipAddress?: string
) {
  try {
    await prisma.auditLog.create({
      data: {
        actorId,
        actorName,
        action,
        resource,
        resourceId,
        companyId,
        details,
        ipAddress,
      },
    });
  } catch (error) {
    logger.error('Failed to create audit log', { error, actorId, action });
  }
}
