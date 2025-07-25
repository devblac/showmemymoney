import express, { Request, Response, Express } from 'express';
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
  const app: Express = express();

  const allowedOrigins = [
    'http://localhost:5173', // Local development
    'https://showmemymoney.onrender.com', // Production frontend URL
  ];

  app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
      ? allowedOrigins 
      : true,
    credentials: true
  }));
  app.use(express.json());

  app.use('/api/portfolio', createPortfolioRouter(storage));
  app.use('/api/quotes', createQuotesRouter(storage));
  app.use('/api/transactions', createTransactionsRouter(storage));
  app.use('/api/valuation', createValuationRouter(storage));
  app.use('/api/settings', createSettingsRouter(storage));

  // Health check that includes storage type
  app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
  });

  // Error handling
  app.use((err: Error, req: Request, res: Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
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
