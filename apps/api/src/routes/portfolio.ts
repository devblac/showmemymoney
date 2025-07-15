import { Request, Response, Router } from 'express';
import { IStorage } from '../storage/IStorage.js';

export function createPortfolioRouter(storage: IStorage): Router {
  const router = Router();

  router.get('/', async (req: Request, res: Response) => {
    try {
      const portfolio = await storage.getPortfolioValue();
      res.json(portfolio);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el portafolio' });
    }
  });

  return router;
}
