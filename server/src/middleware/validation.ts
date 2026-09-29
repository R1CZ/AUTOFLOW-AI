import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { logger } from '../utils/logger';

// Validation middleware factory
export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        logger.warn('Validation error', { errors, path: req.path });

        return res.status(400).json({
          error: 'Validation failed',
          details: errors,
        });
      }
      next(error);
    }
  };
}

// Common validation schemas
import { z } from 'zod';

export const emailSchema = z.string().email('Invalid email address');
export const passwordSchema = z.string().min(8, 'Password must be at least 8 characters');
export const uuidSchema = z.string().uuid('Invalid UUID');

// Registration schema
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().min(2, 'Name must be at least 2 characters'),
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  industry: z.string().optional(),
  country: z.string().min(2, 'Country is required'),
  timezone: z.string().default('UTC'),
  planId: z.string().uuid('Invalid plan ID'),
});

// Login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

// User creation schema
export const createUserSchema = z.object({
  email: emailSchema,
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['USER', 'COMPANY_ADMIN']).default('USER'),
});

// Company update schema
export const updateCompanySchema = z.object({
  name: z.string().min(2).optional(),
  industry: z.string().optional(),
  timezone: z.string().optional(),
  country: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'TRIAL', 'PENDING']).optional(),
});

// Workflow creation schema
export const createWorkflowSchema = z.object({
  name: z.string().min(1, 'Workflow name is required'),
  description: z.string().optional(),
  triggerType: z.string().optional(),
});

// Workflow update schema
export const updateWorkflowSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'PAUSED', 'DISABLED']).optional(),
  triggerType: z.string().optional(),
  nodes: z.array(z.any()).optional(),
  connections: z.array(z.any()).optional(),
});

// Integration schema
export const createIntegrationSchema = z.object({
  provider: z.string().min(1, 'Provider is required'),
  name: z.string().min(1, 'Name is required'),
  config: z.record(z.any()).optional(),
});

// Webhook schema
export const createWebhookSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  url: z.string().url('Invalid URL'),
  events: z.array(z.string()).min(1, 'At least one event is required'),
});

// Notification schema
export const updateNotificationSchema = z.object({
  read: z.boolean().optional(),
});

// Platform settings schema
export const updatePlatformSettingsSchema = z.object({
  maintenanceMode: z.boolean().optional(),
  companySelfSignup: z.boolean().optional(),
  maxCompanies: z.number().int().positive().optional(),
  defaultTrialDays: z.number().int().positive().optional(),
  platformName: z.string().optional(),
  supportEmail: z.string().email().optional(),
});

// Pagination schema
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

// Search schema
export const searchSchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});
