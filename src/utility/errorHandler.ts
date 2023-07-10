import type { ErrorRequestHandler } from 'express';
import { ValidationError } from 'express-validation';
import multer from 'multer';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err.details);
  }
  if (err instanceof multer.MulterError) {
    return res.status(500).json('multer error');
  }
  return res.status(500).json(err);
  next();
};
