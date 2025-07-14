import { Router } from 'express';
import { IStorage } from '../storage/IStorage.js';
import { QuoteUpdateRequestSchema } from '../schemas/schemas.js';
import { z } from 'zod';

export function createQuotesRouter(storage: IStorage): Router {
  const router = Router();

  // Update a single quote
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

  // Bulk update quotes
  const BulkQuoteUpdateSchema = z.array(QuoteUpdateRequestSchema);

  router.patch('/bulk', async (req, res) => {
    try {
      const quotes = BulkQuoteUpdateSchema.parse(req.body);
      const now = new Date();

      await Promise.all(quotes.map(quote => storage.updateQuote({ ...quote, at: now })));

      res.json({
        success: true,
        message: `${quotes.length} cotizaciones actualizadas con éxito`,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(422).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error desconocido' });
      }
    }
  });

  // Get historical valuation
  router.get('/valuation', async (req, res) => {
    try {
      const dateStr = req.query.at;
      if (!dateStr || typeof dateStr !== 'string') {
        throw new Error('Se requiere el parámetro "at" con la fecha de valuación');
      }

      const at = new Date(dateStr);
      if (isNaN(at.getTime())) {
        throw new Error('Fecha inválida');
      }

      const valuation = await storage.getValuationAtDate(at);
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
