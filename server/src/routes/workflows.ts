import { Router, Request, Response } from 'express';
import { prisma } from '../server';
import { authenticateToken, requireRole } from '../middleware/auth';
import { validate, createWorkflowSchema, updateWorkflowSchema } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import { logAudit } from '../utils/auth';

export const workflowsRouter = Router();

// Get workflows
workflowsRouter.get(
  '/',
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    const companyId = req.user!.companyId;
    
    const workflows = await prisma.workflow.findMany({
      where: { companyId },
      include: {
        nodes: true,
        connections: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    res.json({ workflows });
  })
);

// Create workflow
workflowsRouter.post(
  '/',
  authenticateToken,
  validate(createWorkflowSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { name, description, triggerType, nodes, connections } = req.body;
    const companyId = req.user!.companyId;

    const workflow = await prisma.workflow.create({
      data: {
        name,
        description,
        triggerType,
        companyId,
        createdById: req.user!.userId,
        nodes: nodes ? { create: nodes } : undefined,
        connections: connections ? { create: connections } : undefined,
      },
      include: {
        nodes: true,
        connections: true,
      },
    });

    await logAudit(
      req.user!.userId,
      req.user!.email,
      'workflow.created',
      'workflow',
      workflow.id,
      companyId
    );

    res.status(201).json({ workflow });
  })
);

// Get workflow
workflowsRouter.get(
  '/:id',
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    const workflow = await prisma.workflow.findUnique({
      where: { id: req.params.id },
      include: {
        nodes: true,
        connections: true,
      },
    });

    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }

    res.json({ workflow });
  })
);

// Update workflow
workflowsRouter.patch(
  '/:id',
  authenticateToken,
  validate(updateWorkflowSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { name, description, status, triggerType, nodes, connections } = req.body;

    const workflow = await prisma.workflow.update({
      where: { id: req.params.id },
      data: {
        name,
        description,
        status,
        triggerType,
        version: { increment: 1 },
      },
      include: {
        nodes: true,
        connections: true,
      },
    });

    // Update nodes if provided
    if (nodes) {
      await prisma.workflowNode.deleteMany({ where: { workflowId: workflow.id } });
      await prisma.workflowNode.createMany({
        data: nodes.map((n: any) => ({ ...n, workflowId: workflow.id })),
      });
    }

    // Update connections if provided
    if (connections) {
      await prisma.workflowConnection.deleteMany({ where: { workflowId: workflow.id } });
      await prisma.workflowConnection.createMany({
        data: connections.map((c: any) => ({ ...c, workflowId: workflow.id })),
      });
    }

    await logAudit(
      req.user!.userId,
      req.user!.email,
      'workflow.updated',
      'workflow',
      workflow.id,
      req.user!.companyId
    );

    res.json({ workflow });
  })
);

// Delete workflow
workflowsRouter.delete(
  '/:id',
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    await prisma.workflow.delete({ where: { id: req.params.id } });

    await logAudit(
      req.user!.userId,
      req.user!.email,
      'workflow.deleted',
      'workflow',
      req.params.id,
      req.user!.companyId
    );

    res.json({ message: 'Workflow deleted' });
  })
);

// Execute workflow
workflowsRouter.post(
  '/:id/execute',
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    const workflow = await prisma.workflow.findUnique({
      where: { id: req.params.id },
      include: { nodes: true },
    });

    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }

    if (workflow.status !== 'ACTIVE') {
      return res.status(400).json({ error: 'Workflow is not active' });
    }

    // Create execution
    const execution = await prisma.execution.create({
      data: {
        workflowId: workflow.id,
        companyId: workflow.companyId,
        status: 'RUNNING',
        triggerType: 'manual',
        triggeredBy: req.user!.userId,
        totalNodes: workflow.nodes.length,
      },
    });

    // Update workflow stats
    await prisma.workflow.update({
      where: { id: workflow.id },
      data: {
        executionCount: { increment: 1 },
        lastExecuted: new Date(),
      },
    });

    // TODO: Implement actual workflow execution engine
    // For now, simulate execution
    setTimeout(async () => {
      await prisma.execution.update({
        where: { id: execution.id },
        data: {
          status: 'SUCCESS',
          completedAt: new Date(),
          duration: 1000,
          nodesExecuted: workflow.nodes.length,
        },
      });

      await prisma.workflow.update({
        where: { id: workflow.id },
        data: { successCount: { increment: 1 } },
      });
    }, 1000);

    res.json({ execution });
  })
);
