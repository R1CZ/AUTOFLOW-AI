import { Router } from 'express';
import { prisma } from '../server';
import { authenticateToken } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

export const integrationsRouter = Router();

integrationsRouter.get('/', authenticateToken, asyncHandler(async (req, res) => {
  const integrations = await prisma.integration.findMany({
    where: { companyId: req.user!.companyId },
  });
  res.json({ integrations });
}));

integrationsRouter.post('/', authenticateToken, asyncHandler(async (req, res) => {
  const integration = await prisma.integration.create({
    data: { ...req.body, companyId: req.user!.companyId },
  });
  res.status(201).json({ integration });
}));

integrationsRouter.delete('/:id', authenticateToken, asyncHandler(async (req, res) => {
  await prisma.integration.delete({ where: { id: req.params.id } });
  res.json({ message: 'Deleted' });
}));
