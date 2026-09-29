import { Router, Request, Response } from 'express';
import { prisma } from '../server';
import {
  hashPassword,
  verifyPassword,
  generateAccessToken,
  generateRefreshToken,
  createSession,
  createRefreshToken,
  validateRefreshToken,
  revokeRefreshToken,
  createPasswordResetToken,
  validatePasswordResetToken,
  markPasswordResetTokenUsed,
  logAudit,
  TokenPayload,
} from '../utils/auth';
import { validate, registerSchema, loginSchema } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

export const authRouter = Router();

// ============================================================================
// REGISTER
// ============================================================================
authRouter.post(
  '/register',
  validate(registerSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password, name, companyName, industry, country, timezone, planId } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Check if company name already exists
    const existingCompany = await prisma.company.findFirst({ where: { name: companyName } });
    if (existingCompany) {
      return res.status(400).json({ error: 'Company name already exists' });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user and company in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create company
      const company = await tx.company.create({
        data: {
          name: companyName,
          industry,
          country,
          timezone,
          status: 'TRIAL',
        },
      });

      // Create user as company admin
      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          name,
          role: 'COMPANY_ADMIN',
          status: 'ACTIVE',
          companyId: company.id,
        },
      });

      // Update company admin ID
      await tx.company.update({
        where: { id: company.id },
        data: { adminId: user.id },
      });

      // Create trial subscription
      const plan = await tx.plan.findUnique({ where: { id: planId } });
      if (!plan) {
        throw new Error('Invalid plan ID');
      }

      const currentPeriodStart = new Date();
      const currentPeriodEnd = new Date();
      currentPeriodEnd.setDate(currentPeriodEnd.getDate() + (plan.trialDays || 14));

      await tx.subscription.create({
        data: {
          companyId: company.id,
          planId: plan.id,
          status: 'TRIAL',
          billingCycle: 'MONTHLY',
          currentPeriodStart,
          currentPeriodEnd,
        },
      });

      return { user, company };
    });

    // Generate tokens
    const tokenPayload: TokenPayload = {
      userId: result.user.id,
      email: result.user.email,
      role: result.user.role,
      companyId: result.user.companyId || undefined,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = await createRefreshToken(result.user.id);

    // Create session
    const sessionToken = await createSession(
      result.user.id,
      req.ip,
      req.get('user-agent')
    );

    // Log audit
    await logAudit(
      result.user.id,
      result.user.name,
      'user.registered',
      'user',
      result.user.id,
      result.company.id
    );

    logger.info('New user registered', { userId: result.user.id, email });

    res.status(201).json({
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role,
        companyId: result.user.companyId,
      },
      company: {
        id: result.company.id,
        name: result.company.name,
        industry: result.company.industry,
        status: result.company.status,
      },
      accessToken,
      refreshToken,
      sessionToken,
    });
  })
);

// ============================================================================
// LOGIN
// ============================================================================
authRouter.post(
  '/login',
  validate(loginSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { company: true },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if user is suspended
    if (user.status === 'SUSPENDED') {
      return res.status(403).json({ error: 'Account is suspended' });
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Generate tokens
    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId || undefined,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = await createRefreshToken(user.id);

    // Create session
    const sessionToken = await createSession(
      user.id,
      req.ip,
      req.get('user-agent')
    );

    // Log audit
    await logAudit(
      user.id,
      user.name,
      'user.login',
      'user',
      user.id,
      user.companyId || undefined
    );

    logger.info('User logged in', { userId: user.id, email });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        companyId: user.companyId,
      },
      company: user.company
        ? {
            id: user.company.id,
            name: user.company.name,
            status: user.company.status,
          }
        : null,
      accessToken,
      refreshToken,
      sessionToken,
    });
  })
);

// ============================================================================
// LOGOUT
// ============================================================================
authRouter.post(
  '/logout',
  asyncHandler(async (req: Request, res: Response) => {
    const sessionToken = req.headers['x-session-token'] as string;

    if (sessionToken) {
      await prisma.session.deleteMany({ where: { token: sessionToken } });
    }

    res.json({ message: 'Logged out successfully' });
  })
);

// ============================================================================
// REFRESH TOKEN
// ============================================================================
authRouter.post(
  '/refresh',
  asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token required' });
    }

    const user = await validateRefreshToken(refreshToken);
    if (!user) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    // Revoke old refresh token
    await revokeRefreshToken(refreshToken);

    // Generate new tokens
    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId || undefined,
    };

    const newAccessToken = generateAccessToken(tokenPayload);
    const newRefreshToken = await createRefreshToken(user.id);

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  })
);

// ============================================================================
// FORGOT PASSWORD
// ============================================================================
authRouter.post(
  '/forgot-password',
  asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Don't reveal if email exists
      return res.json({ message: 'If the email exists, a reset link has been sent' });
    }

    const resetToken = await createPasswordResetToken(user.id);

    // TODO: Send email with reset link
    // For now, just return the token (in production, send via email)
    logger.info('Password reset requested', { userId: user.id, email });

    res.json({
      message: 'If the email exists, a reset link has been sent',
      // In production, don't return the token
      resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined,
    });
  })
);

// ============================================================================
// RESET PASSWORD
// ============================================================================
authRouter.post(
  '/reset-password',
  asyncHandler(async (req: Request, res: Response) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const user = await validatePasswordResetToken(token);
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Update password
    const passwordHash = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    // Mark token as used
    await markPasswordResetTokenUsed(token);

    // Log audit
    await logAudit(
      user.id,
      user.name,
      'user.password_reset',
      'user',
      user.id,
      user.companyId || undefined
    );

    logger.info('Password reset successful', { userId: user.id });

    res.json({ message: 'Password reset successfully' });
  })
);

// ============================================================================
// GET CURRENT USER
// ============================================================================
authRouter.get(
  '/me',
  asyncHandler(async (req: Request, res: Response) => {
    const sessionToken = req.headers['x-session-token'] as string;

    if (!sessionToken) {
      return res.status(401).json({ error: 'Session token required' });
    }

    const session = await prisma.session.findUnique({
      where: { token: sessionToken },
      include: {
        user: {
          include: { company: true },
        },
      },
    });

    if (!session || session.expiresAt < new Date()) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    const { passwordHash, ...userWithoutPassword } = session.user;

    res.json({
      user: userWithoutPassword,
      company: session.user.company,
    });
  })
);
