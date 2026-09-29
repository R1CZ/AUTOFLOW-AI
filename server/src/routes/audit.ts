import { Router } from 'express';
import { prisma } from '../server';
import { authenticateToken, requireRole } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

export const auditRouter = Router();

auditRouter.get('/', authenticateToken, requireRole('SUPER_ADMIN', 'COMPANY_ADMIN'), asyncHandler(async (req, res) => {
  const where = req.user!.role === 'SUPER_ADMIN' 
    ? {} 
    : { companyId: req.user!.companyId };

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  res.json({ logs });
}));
