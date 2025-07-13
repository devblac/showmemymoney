import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import { createApiRouter } from './routes/index.js';
import { InMemoryStorage } from './storage/InMemoryStorage.js';

export function createServer() {
  const app = express();
  const storage = new InMemoryStorage();

  // Middleware
  app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }));
  app.use(express.json());

  // Routes
  app.use('/api', createApiRouter(storage));

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
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
  const app = createServer();
  
  app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
    console.log(`Verificación de salud: http://localhost:${PORT}/health`);
  });
}