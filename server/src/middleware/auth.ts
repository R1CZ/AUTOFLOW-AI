import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, validateSession, TokenPayload } from '../utils/auth';
import { logger } from '../utils/logger';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

// JWT Authentication Middleware
export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (error) {
    logger.warn('Invalid access token', { error });
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

// Session Authentication Middleware
export async function authenticateSession(req: Request, res: Response, next: NextFunction) {
  const token = req.headers['x-session-token'] as string;

  if (!token) {
    return res.status(401).json({ error: 'Session token required' });
  }

  try {
    const user = await validateSession(token);
    if (!user) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId || undefined,
    };
    next();
  } catch (error) {
    logger.error('Session validation error', { error });
    return res.status(500).json({ error: 'Session validation failed' });
  }
}

// Role-Based Access Control Middleware
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      logger.warn('Unauthorized role access attempt', {
        userId: req.user.userId,
        requiredRoles: roles,
        actualRole: req.user.role,
      });
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
}

// Company Access Middleware (Multi-Tenancy)
export function requireCompanyAccess(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Super Admin can access all companies
  if (req.user.role === 'SUPER_ADMIN') {
    return next();
  }

  // Company Admin and User can only access their own company
  const requestedCompanyId = req.params.companyId || req.body.companyId;
  
  if (requestedCompanyId && requestedCompanyId !== req.user.companyId) {
    logger.warn('Unauthorized company access attempt', {
      userId: req.user.userId,
      userCompanyId: req.user.companyId,
      requestedCompanyId,
    });
    return res.status(403).json({ error: 'Access denied to this company' });
  }

  next();
}

// Maintenance Mode Middleware
export async function checkMaintenanceMode(req: Request, res: Response, next: NextFunction) {
  // Skip for super admin
  if (req.user?.role === 'SUPER_ADMIN') {
    return next();
  }

  // Skip health check endpoint
  if (req.path === '/health') {
    return next();
  }

  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    const maintenanceSetting = await prisma.platformSetting.findUnique({
      where: { key: 'maintenanceMode' },
    });

    if (maintenanceSetting?.value === true) {
      return res.status(503).json({
        error: 'Service temporarily unavailable',
        message: 'The platform is currently under maintenance. Please try again later.',
      });
    }

    next();
  } catch (error) {
    // If we can't check maintenance mode, allow the request
    next();
  }
}
