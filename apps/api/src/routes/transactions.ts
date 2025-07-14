import { Router } from 'express';
import { IStorage } from '../storage/IStorage.js';
import { TransactionRequestSchema } from '../schemas/schemas.js';

export function createTransactionsRouter(storage: IStorage): Router {
  const router = Router();

  router.post('/buy', async (req, res) => {
    try {
      const { securityId, quantity } = TransactionRequestSchema.parse(req.body);
      await storage.transactBuy(securityId, quantity);
      res.json({ success: true, message: 'Compra realizada con éxito' });
    } catch (error) {
      if (error instanceof Error) {
        res.status(422).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error desconocido' });
      }
    }
  });

  router.post('/sell', async (req, res) => {
    try {
      const { securityId, quantity } = TransactionRequestSchema.parse(req.body);
      await storage.transactSell(securityId, quantity);
      res.json({ success: true, message: 'Venta realizada con éxito' });
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
