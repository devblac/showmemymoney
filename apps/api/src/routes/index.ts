import { Router } from 'express';
import { IStorage } from '../storage/IStorage.js';
import { createPortfolioRouter } from './portfolio.js';
import { createTransactionsRouter } from './transactions.js';
import { createQuotesRouter } from './quotes.js';
import { createValuationRouter } from './valuation.js';

export function createApiRouter(storage: IStorage): Router {
  const router = Router();

  router.use('/portfolio', createPortfolioRouter(storage));
  router.use('/transactions', createTransactionsRouter(storage));
  router.use('/quotes', createQuotesRouter(storage));
  router.use('/valuation', createValuationRouter(storage));

  return router;
}
