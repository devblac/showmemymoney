import { localStorageService } from './localStorageService';
import { StorageType } from '../types/api';
import type { CashAccount, Security, Position, Quote, Settings } from '../types/api';

export const stateService = {
  getCurrentStorageType: (): StorageType => {
    return localStorageService.getStoragePreference();
  },

  updateState: async (updates: {
    cash?: CashAccount;
    securities?: Security[];
    positions?: Position[];
    quotes?: Quote[];
    settings?: Settings;
  }) => {
    const storageType = stateService.getCurrentStorageType();

    if (storageType === StorageType.LOCAL_STORAGE) {
      // Si es localStorage, actualizamos directamente
      localStorageService.saveState(updates);
    }
    // Si es MEMORY o POSTGRESQL, el backend ya se encarga de persistir los cambios
  },
};
