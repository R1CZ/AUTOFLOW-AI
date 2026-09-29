import { Router } from 'express';
import { prisma } from '../server';
import { authenticateToken } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

export const notificationsRouter = Router();

notificationsRouter.get('/', authenticateToken, asyncHandler(async (req, res) => {
  const notifications = await prisma.notification.findMany({
    where: { userId: req.user!.userId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  res.json({ notifications });
}));

notificationsRouter.patch('/:id', authenticateToken, asyncHandler(async (req, res) => {
  const notification = await prisma.notification.update({
    where: { id: req.params.id },
    data: { read: true },
  });
  res.json({ notification });
}));

notificationsRouter.post('/mark-all-read', authenticateToken, asyncHandler(async (req, res) => {
  await prisma.notification.updateMany({
    where: { userId: req.user!.userId, read: false },
    data: { read: true },
  });
  res.json({ message: 'All marked as read' });
}));
