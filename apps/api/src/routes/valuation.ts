import { Router } from 'express';
import { IStorage } from '../storage/IStorage.js';
import { ValuationQuerySchema } from '../schemas/schemas.js';

export function createValuationRouter(storage: IStorage): Router {
  const router = Router();

  router.get('/', async (req, res) => {
    try {
      const { at } = ValuationQuerySchema.parse(req.query);
      const date = at ? new Date(at) : new Date();
      const valuation = await storage.getValuationAtDate(date);
      res.json(valuation);
    } catch (error) {
      if (error instanceof Error) {
        res.status(422).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error desconocido' });
      }
    }
  });

  return router;
}
