import { Router } from 'express';
import { IStorage } from '../storage/IStorage.js';
import { QuoteUpdateRequestSchema } from '../schemas/schemas.js';

export function createQuotesRouter(storage: IStorage): Router {
  const router = Router();

  router.patch('/', async (req, res) => {
    try {
      const { securityId, price } = QuoteUpdateRequestSchema.parse(req.body);
      await storage.updateQuote({ securityId, price, at: new Date() });
      res.json({ success: true, message: 'Cotización actualizada con éxito' });
    } catch (error) {
      if (error instanceof Error) {
        res.status(422).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error desconocido' });
      }
    }
  });

  return router;
};