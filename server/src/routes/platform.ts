import { Router } from 'express';
import { prisma } from '../server';
import { authenticateToken, requireRole } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

export const platformRouter = Router();

platformRouter.get('/stats', authenticateToken, requireRole('SUPER_ADMIN'), asyncHandler(async (req, res) => {
  const [totalCompanies, activeCompanies, totalUsers, totalWorkflows, totalExecutions] = await Promise.all([
    prisma.company.count(),
    prisma.company.count({ where: { status: 'ACTIVE' } }),
    prisma.user.count(),
    prisma.workflow.count(),
    prisma.execution.count(),
  ]);

  res.json({
    stats: {
      totalCompanies,
      activeCompanies,
      totalUsers,
      totalWorkflows,
      totalExecutions,
    },
  });
}));

platformRouter.get('/settings', authenticateToken, requireRole('SUPER_ADMIN'), asyncHandler(async (req, res) => {
  const settings = await prisma.platformSetting.findMany();
  const settingsMap = settings.reduce((acc, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {} as Record<string, any>);
  res.json({ settings: settingsMap });
}));

platformRouter.patch('/settings', authenticateToken, requireRole('SUPER_ADMIN'), asyncHandler(async (req, res) => {
  const updates = req.body;
  
  for (const [key, value] of Object.entries(updates)) {
    await prisma.platformSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  res.json({ message: 'Settings updated' });
}));

platformRouter.get('/companies', authenticateToken, requireRole('SUPER_ADMIN'), asyncHandler(async (req, res) => {
  const companies = await prisma.company.findMany({
    include: { users: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ companies });
}));
