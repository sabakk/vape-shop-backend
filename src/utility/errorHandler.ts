import type { ErrorRequestHandler } from 'express';
import { ValidationError } from 'express-validation';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err.details);
  }
  return res.status(500).json(err);
  next();
};
