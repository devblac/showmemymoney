import { Router } from 'express';
import { IStorage, StorageType } from '../storage/IStorage.js';
import { StorageFactory } from '../storage/StorageFactory.js';
import { z } from 'zod';
import { LocalStorage } from '../storage/LocalStorage.js';

const MarketDataConfigSchema = z.object({
  source: z.enum(['hardcoded', 'online']),
  broker: z.object({
    id: z.number(),
    dni: z.string(),
    user: z.string(),
    password: z.string()
  }).optional()
}).refine(data => {
  if (data.source === 'online' && !data.broker) {
    return false;
  }
  return true;
}, {
  message: "Broker configuration is required when using online data source"
});

const StorageConfigSchema = z.object({
  type: z.enum(['memory', 'localStorage', 'postgresql']),
  postgresql: z.object({
    host: z.string(),
    port: z.number(),
    database: z.string(),
    user: z.string(),
    password: z.string()
  }).optional()
}).refine(data => {
  if (data.type === 'postgresql' && !data.postgresql) {
    return false;
  }
  return true;
}, {
  message: "PostgreSQL configuration is required when using postgresql storage"
});

export function createSettingsRouter(storage: IStorage): Router {
  const router = Router();

  // Get current settings
  router.get('/', async (req, res) => {
    try {
      const settings = await storage.getSettings();
      res.json(settings);
    } catch (error) {
      if (error instanceof Error) {
        res.status(422).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error desconocido' });
      }
    }
  });

  // Update market data configuration
  router.patch('/market-data', async (req, res) => {
    try {
      const config = MarketDataConfigSchema.parse(req.body);
      await storage.updateMarketDataConfig(config);
      res.json({ success: true, message: 'Configuración actualizada con éxito' });
    } catch (error) {
      if (error instanceof Error) {
        res.status(422).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error desconocido' });
      }
    }
  });

  // Update storage configuration
  router.patch('/storage', async (req, res) => {
    try {
      const config = StorageConfigSchema.parse(req.body);
      
      // Update storage type in settings
      const currentSettings = await storage.getSettings();
      currentSettings.storage = config;
      await storage.updateSettings(currentSettings);

      res.json({ success: true, message: 'Storage configuration updated successfully' });
    } catch (error) {
      console.error('Error updating storage:', error);
      if (error instanceof Error) {
        res.status(422).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error desconocido' });
      }
    }
  });

  // Get database snapshot (for debugging)
  router.get('/debug/snapshot', async (req, res) => {
    try {
      const snapshot = {
        storageType: storage.constructor.name,
        data: {
          cash: await storage.getCashAccount(),
          securities: await storage.getSecurities(),
          positions: await storage.getPositions(),
          quotes: await storage.getQuotes(),
          settings: await storage.getSettings(),
          portfolio: await storage.getPortfolioValue()
        }
      };

      if (storage instanceof LocalStorage) {
        await (storage as LocalStorage).dumpState();
        console.log('🔍 Storage Type: LocalStorage');
      } else {
        console.log('🔍 Storage Type: InMemory');
      }
      
      res.json(snapshot);
    } catch (error) {
      console.error('Error getting snapshot:', error);
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error desconocido' });
      }
    }
  });

  return router;
} 