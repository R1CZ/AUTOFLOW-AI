import { Router } from 'express';
import { prisma } from '../server';
import { authenticateToken } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

export const executionsRouter = Router();

executionsRouter.get('/', authenticateToken, asyncHandler(async (req, res) => {
  const executions = await prisma.execution.findMany({
    where: { companyId: req.user!.companyId },
    include: { workflow: { select: { name: true } } },
    orderBy: { startedAt: 'desc' },
    take: 50,
  });
  res.json({ executions });
}));

executionsRouter.get('/:id', authenticateToken, asyncHandler(async (req, res) => {
  const execution = await prisma.execution.findUnique({
    where: { id: req.params.id },
    include: { logs: true, workflow: { select: { name: true } } },
  });
  if (!execution) return res.status(404).json({ error: 'Not found' });
  res.json({ execution });
}));
