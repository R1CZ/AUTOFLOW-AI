import { Router } from 'express';
import { prisma } from '../server';
import { authenticateToken } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

export const companiesRouter = Router();

companiesRouter.get('/', authenticateToken, asyncHandler(async (req, res) => {
  const companies = await prisma.company.findMany({
    orderBy: { createdAt: 'desc' },
  });
  res.json({ companies });
}));

companiesRouter.get('/:id', authenticateToken, asyncHandler(async (req, res) => {
  const company = await prisma.company.findUnique({
    where: { id: req.params.id },
    include: { users: true, subscription: { include: { plan: true } } },
  });
  if (!company) return res.status(404).json({ error: 'Not found' });
  res.json({ company });
}));

companiesRouter.patch('/:id', authenticateToken, asyncHandler(async (req, res) => {
  const company = await prisma.company.update({
    where: { id: req.params.id },
    data: req.body,
  });
  res.json({ company });
}));
