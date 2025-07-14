import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import { createPortfolioRouter } from './routes/portfolio.js';
import { createQuotesRouter } from './routes/quotes.js';
import { createTransactionsRouter } from './routes/transactions.js';
import { createValuationRouter } from './routes/valuation.js';
import { createSettingsRouter } from './routes/settings.js';
import { IStorage, StorageType } from './storage/IStorage.js';
import { InMemoryStorage } from './storage/InMemoryStorage.js';
import { LocalStorage } from './storage/LocalStorage.js';
import { StorageFactory } from './storage/StorageFactory.js';

declare global {
  var appStorage: IStorage;
}

const defaultStorageConfig = {
  type: StorageType.MEMORY,
};

export function createServer(storage: IStorage) {
  const app = express();

  app.use(
    cors({
      origin: 'http://localhost:5173',
      credentials: true,
    })
  );
  app.use(express.json());

  app.use('/api/portfolio', createPortfolioRouter(storage));
  app.use('/api/quotes', createQuotesRouter(storage));
  app.use('/api/transactions', createTransactionsRouter(storage));
  app.use('/api/valuation', createValuationRouter(storage));
  app.use('/api/settings', createSettingsRouter(storage));

  // Health check that includes storage type
  app.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      storageType: storage.constructor.name,
    });
  });

  // Error handling
  app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo salió mal' });
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
  });

  return app;
}

export function startServer() {
  const PORT = process.env.PORT || 3001;

  // Get storage preference from environment or default to memory
  const storageType = process.env.STORAGE_TYPE || 'memory';
  const storage = StorageFactory.createStorage({ type: storageType as StorageType });

  const app = createServer(storage);

  app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
    console.log(`Tipo de almacenamiento: ${storage.constructor.name}`);
    console.log(`Verificación de salud: http://localhost:${PORT}/health`);
  });
}
