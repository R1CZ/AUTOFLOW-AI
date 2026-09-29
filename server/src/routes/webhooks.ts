import { Router } from 'express';
import { prisma } from '../server';
import { authenticateToken } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

export const webhooksRouter = Router();

webhooksRouter.get('/', authenticateToken, asyncHandler(async (req, res) => {
  const webhooks = await prisma.webhook.findMany({
    where: { companyId: req.user!.companyId },
  });
  res.json({ webhooks });
}));

webhooksRouter.post('/', authenticateToken, asyncHandler(async (req, res) => {
  const webhook = await prisma.webhook.create({
    data: { ...req.body, companyId: req.user!.companyId },
  });
  res.status(201).json({ webhook });
}));

webhooksRouter.delete('/:id', authenticateToken, asyncHandler(async (req, res) => {
  await prisma.webhook.delete({ where: { id: req.params.id } });
  res.json({ message: 'Deleted' });
}));
