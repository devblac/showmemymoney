import { StorageType } from '../types/api';
import type { AppState } from '../types/api';

const APP_STATE_KEY = 'smm_app_state';
const STORAGE_PREFERENCE_KEY = 'smm_storage_preference';

export const localStorageService = {
  saveState: (state: Partial<AppState> | PortfolioDTO) => {
    const currentState = localStorageService.getState();
    let newState;

    // Si recibimos un PortfolioDTO, lo convertimos al formato AppState
    if ('totalValuation' in state) {
      newState = {
        ...currentState,
        cash: state.cash,
        securities: state.securities,
        positions: state.positions.map(pos => ({
          securityId: pos.security.id,
          quantity: pos.quantity,
        })),
        quotes: state.positions.map(pos => ({
          securityId: pos.security.id,
          price: pos.unitPrice,
          at: new Date(),
        })),
      };
    } else {
      newState = { ...currentState, ...state };
    }

    localStorage.setItem(APP_STATE_KEY, JSON.stringify(newState));
    console.log('Estado guardado en localStorage:', newState);
  },

  getState: (): AppState => {
    const stateStr = localStorage.getItem(APP_STATE_KEY);
    if (!stateStr) {
      return {
        cash: { balance: 0 },
        securities: [],
        positions: [],
        quotes: [],
        settings: {
          theme: 'light',
          storage: { type: StorageType.MEMORY },
          marketData: { source: 'hardcoded' },
        },
      };
    }
    return JSON.parse(stateStr);
  },

  hasState: (): boolean => {
    return localStorage.getItem(APP_STATE_KEY) !== null;
  },

  clearState: () => {
    localStorage.removeItem(APP_STATE_KEY);
  },

  getStoragePreference: (): StorageType => {
    const preference = localStorage.getItem(STORAGE_PREFERENCE_KEY);
    if (!preference) {
      // Si no hay preferencia, establecer memory como default
      localStorage.setItem(STORAGE_PREFERENCE_KEY, StorageType.MEMORY);
      return StorageType.MEMORY;
    }
    return preference as StorageType;
  },

  setStoragePreference: (type: StorageType): void => {
    localStorage.setItem(STORAGE_PREFERENCE_KEY, type);
  },
};
