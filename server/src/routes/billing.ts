import { Router } from 'express';
import { prisma } from '../server';
import { authenticateToken } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

export const billingRouter = Router();

billingRouter.get('/subscription', authenticateToken, asyncHandler(async (req, res) => {
  const subscription = await prisma.subscription.findUnique({
    where: { companyId: req.user!.companyId },
    include: { plan: true, invoices: { orderBy: { createdAt: 'desc' } } },
  });
  res.json({ subscription });
}));

billingRouter.get('/invoices', authenticateToken, asyncHandler(async (req, res) => {
  const invoices = await prisma.invoice.findMany({
    where: { companyId: req.user!.companyId },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ invoices });
}));

billingRouter.post('/upgrade', authenticateToken, asyncHandler(async (req, res) => {
  const { planId } = req.body;
  const subscription = await prisma.subscription.update({
    where: { companyId: req.user!.companyId },
    data: { planId, status: 'ACTIVE' },
  });
  res.json({ subscription });
}));

billingRouter.post('/cancel', authenticateToken, asyncHandler(async (req, res) => {
  const subscription = await prisma.subscription.update({
    where: { companyId: req.user!.companyId },
    data: { status: 'CANCELLED', cancelAtPeriodEnd: true },
  });
  res.json({ subscription });
}));
