import { StorageType, AppState, PortfolioDTO } from '../types/api';

const APP_STATE_KEY = 'smm_app_state';
const STORAGE_PREFERENCE_KEY = 'smm_storage_preference';

export const localStorageService = {
  saveState: (state: Partial<AppState> | PortfolioDTO) => {
    const currentState = localStorageService.getState();
    let newState;

    // Si recibimos un PortfolioDTO, lo convertimos al formato AppState
    if ('totalValuation' in state) {
      const portfolioDTO = state as PortfolioDTO;
      newState = {
        ...currentState,
        cash: portfolioDTO.cash,
        securities: portfolioDTO.securities,
        positions: portfolioDTO.positions.map(pos => ({
          securityId: pos.security.id,
          quantity: pos.quantity,
        })),
        quotes: portfolioDTO.quotes || currentState.quotes || portfolioDTO.positions.map(pos => ({
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

  initializeState: () => {
    const currentState = localStorageService.getState();
    
    // If we already have quotes for all securities, don't initialize
    if (currentState.securities.every(security => 
      currentState.quotes.some(quote => quote.securityId === security.id)
    )) {
      return;
    }

    // Initialize quotes for securities that don't have one
    const now = new Date();
    const defaultPrices: { [key: string]: number } = {
      'AAPL': 150.0,
      'GOOGL': 2800.0,
      'MSFT': 380.0,
      'BOND1': 1000.0,
    };

    const newQuotes = currentState.securities.map(security => ({
      securityId: security.id,
      price: defaultPrices[security.symbol] || 100.0, // default price if not in map
      at: now
    }));

    localStorageService.saveState({
      ...currentState,
      quotes: newQuotes
    });
  },

  setStoragePreference: (type: StorageType): void => {
    localStorage.setItem(STORAGE_PREFERENCE_KEY, type);
    // Initialize state when switching to localStorage
    if (type === StorageType.LOCAL_STORAGE) {
      localStorageService.initializeState();
    }
  },
};
