import { Request, Response } from 'express';

declare global {
  namespace Express {
    interface Request {
      // Add any custom properties you need
    }
    interface Response {
      // Add any custom properties you need
    }
  }
} 