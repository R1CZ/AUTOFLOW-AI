import { Router, Request, Response } from 'express';
import { prisma } from '../server';
import { authenticateToken, requireRole } from '../middleware/auth';
import { validate, createUserSchema } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import { hashPassword, logAudit } from '../utils/auth';

export const usersRouter = Router();

// Get all users (company-scoped)
usersRouter.get(
  '/',
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    const companyId = req.user!.companyId;
    
    const users = await prisma.user.findMany({
      where: { companyId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        lastLogin: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ users });
  })
);

// Create user
usersRouter.post(
  '/',
  authenticateToken,
  requireRole('SUPER_ADMIN', 'COMPANY_ADMIN'),
  validate(createUserSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { email, name, role } = req.body;
    const companyId = req.user!.companyId;

    // Check if email exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Generate temporary password
    const tempPassword = Math.random().toString(36).slice(-12);
    const passwordHash = await hashPassword(tempPassword);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        role,
        companyId,
        passwordHash,
        status: 'ACTIVE',
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
      },
    });

    await logAudit(
      req.user!.userId,
      req.user!.email,
      'user.created',
      'user',
      user.id,
      companyId
    );

    res.status(201).json({ user, tempPassword });
  })
);

// Get user by ID
usersRouter.get(
  '/:id',
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        lastLogin: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  })
);

// Update user
usersRouter.patch(
  '/:id',
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    const { name, status } = req.body;

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { name, status },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
      },
    });

    await logAudit(
      req.user!.userId,
      req.user!.email,
      'user.updated',
      'user',
      user.id,
      req.user!.companyId
    );

    res.json({ user });
  })
);

// Delete user
usersRouter.delete(
  '/:id',
  authenticateToken,
  requireRole('SUPER_ADMIN', 'COMPANY_ADMIN'),
  asyncHandler(async (req: Request, res: Response) => {
    await prisma.user.delete({ where: { id: req.params.id } });

    await logAudit(
      req.user!.userId,
      req.user!.email,
      'user.deleted',
      'user',
      req.params.id,
      req.user!.companyId
    );

    res.json({ message: 'User deleted' });
  })
);
