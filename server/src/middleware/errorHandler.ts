import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Internal server error';
  let isOperational = true;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
  }

  // Log error
  if (isOperational) {
    logger.warn(`Operational error: ${message}`, {
      path: req.path,
      method: req.method,
      statusCode,
    });
  } else {
    logger.error('Programming error:', {
      error: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
    });
  }

  // Send response
  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

// 404 Handler
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    error: `Route ${req.originalUrl} not found`,
  });
};

// Async handler wrapper
export const asyncHandler = (fn: Function) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
