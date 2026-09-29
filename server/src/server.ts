import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { authRouter } from './routes/auth';
import { usersRouter } from './routes/users';
import { companiesRouter } from './routes/companies';
import { workflowsRouter } from './routes/workflows';
import { executionsRouter } from './routes/executions';
import { integrationsRouter } from './routes/integrations';
import { webhooksRouter } from './routes/webhooks';
import { notificationsRouter } from './routes/notifications';
import { billingRouter } from './routes/billing';
import { platformRouter } from './routes/platform';
import { auditRouter } from './routes/audit';

// Initialize Prisma Client
export const prisma = new PrismaClient();

// Create Express App
const app = express();
const PORT = process.env.PORT || 3001;

// ============================================================================
// MIDDLEWARE
// ============================================================================

// Security
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Body Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Request Logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});

// ============================================================================
// ROUTES
// ============================================================================

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/companies', companiesRouter);
app.use('/api/v1/workflows', workflowsRouter);
app.use('/api/v1/executions', executionsRouter);
app.use('/api/v1/integrations', integrationsRouter);
app.use('/api/v1/webhooks', webhooksRouter);
app.use('/api/v1/notifications', notificationsRouter);
app.use('/api/v1/billing', billingRouter);
app.use('/api/v1/platform', platformRouter);
app.use('/api/v1/audit', auditRouter);

// ============================================================================
// ERROR HANDLING
// ============================================================================

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global Error Handler
app.use(errorHandler);

// ============================================================================
// SERVER STARTUP
// ============================================================================

async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
    logger.info('✅ Database connected successfully');

    // Start server
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`🔗 API: http://localhost:${PORT}/api/v1`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful Shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();

export default app;
