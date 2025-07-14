import { IStorage, StorageConfig, StorageType } from './IStorage.js';
import { InMemoryStorage } from './InMemoryStorage.js';
import { LocalStorage } from './LocalStorage.js';
import { PostgresStorage } from './PostgresStorage.js';

export class StorageFactory {
  static createStorage(config: StorageConfig): IStorage {
    try {
      switch (config.type) {
        case StorageType.MEMORY:
          return new InMemoryStorage();
        case StorageType.LOCAL_STORAGE:
          return new LocalStorage();
        case StorageType.POSTGRESQL:
          if (!config.postgresql) {
            throw new Error('PostgreSQL configuration is required');
          }
          return new PostgresStorage(config.postgresql);
        default:
          console.warn(`Unknown storage type ${config.type}, falling back to InMemory storage`);
          return new InMemoryStorage();
      }
    } catch (error) {
      console.error('Failed to create storage:', error);
      console.warn('Falling back to InMemory storage');
      return new InMemoryStorage();
    }
  }
}
