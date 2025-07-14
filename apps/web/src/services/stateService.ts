import { localStorageService } from './localStorageService';
import { StorageType, AppState } from '../types/api';
import type { CashAccount, Security, Position, Quote, Settings } from '../types/api';

export const stateService = {
  getCurrentStorageType: (): StorageType => {
    return localStorageService.getStoragePreference();
  },

  updateState: async (updates: Partial<AppState>) => {
    const storageType = stateService.getCurrentStorageType();

    if (storageType === StorageType.LOCAL_STORAGE) {
      localStorageService.saveState(updates);
    }
  },
};
