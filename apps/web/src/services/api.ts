import axios from 'axios';
import type {
  PortfolioDTO,
  TransactionRequest,
  QuoteUpdateRequest,
  ValuationResponse,
  Settings,
  MarketDataConfig,
  StorageConfig,
} from '../types/api';
import { stateService } from './stateService';
import { localStorageService } from './localStorageService';
import { StorageType } from '../types/api';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  withCredentials: true,
});

export const portfolioApi = {
  getPortfolio: async (): Promise<PortfolioDTO> => {
    const storageType = stateService.getCurrentStorageType();

    if (storageType === StorageType.LOCAL_STORAGE) {
      const state = localStorageService.getState();
      // Calculamos la valuación total
      const totalValuation = state.positions.reduce((total, pos) => {
        const quote = state.quotes.find(q => q.securityId === pos.securityId);
        return total + (quote ? quote.price * pos.quantity : 0);
      }, state.cash.balance);

      // Construimos el DTO con el formato correcto
      return {
        cash: state.cash,
        securities: state.securities,
        positions: state.positions.map(pos => {
          const security = state.securities.find(s => s.id === pos.securityId)!;
          const quote = state.quotes.find(q => q.securityId === pos.securityId)!;
          return {
            security,
            quantity: pos.quantity,
            unitPrice: quote.price,
            valuation: quote.price * pos.quantity,
          };
        }),
        totalValuation,
      };
    }

    // Si no, obtenemos del backend
    const response = await api.get<PortfolioDTO>('/portfolio');
    // Actualizamos el estado local si es necesario
    await stateService.updateState({
      cash: response.data.cash,
      securities: response.data.securities,
      positions: response.data.positions,
      quotes: response.data.quotes,
    });
    return response.data;
  },

  transactBuy: async (request: TransactionRequest): Promise<void> => {
    const storageType = stateService.getCurrentStorageType();

    if (storageType === StorageType.LOCAL_STORAGE) {
      const state = localStorageService.getState();
      const quote = state.quotes.find(q => q.securityId === request.securityId)!;
      const cost = quote.price * request.quantity;

      // Actualizar cash
      state.cash.balance -= cost;

      // Actualizar o crear posición
      const existingPosition = state.positions.find(p => p.securityId === request.securityId);
      if (existingPosition) {
        existingPosition.quantity += request.quantity;
      } else {
        state.positions.push({
          securityId: request.securityId,
          quantity: request.quantity,
        });
      }

      localStorageService.saveState(state);
      return;
    }

    // Si no es localStorage, usar el backend
    await api.post('/transactions/buy', request);
  },

  transactSell: async (request: TransactionRequest): Promise<void> => {
    const storageType = stateService.getCurrentStorageType();

    if (storageType === StorageType.LOCAL_STORAGE) {
      const state = localStorageService.getState();

      // Encontrar la posición existente
      const existingPosition = state.positions.find(p => p.securityId === request.securityId);
      if (!existingPosition) {
        throw new Error('No tienes posición en este activo');
      }

      // Verificar que hay suficientes unidades para vender
      if (existingPosition.quantity < request.quantity) {
        throw new Error('No tienes suficientes unidades para vender');
      }

      // Encontrar el precio actual
      const quote = state.quotes.find(q => q.securityId === request.securityId);
      if (!quote) {
        throw new Error('No se encontró cotización para este activo');
      }

      // Calcular el valor de la venta
      const saleValue = quote.price * request.quantity;

      // Actualizar cash
      state.cash.balance += saleValue;

      // Actualizar posición
      existingPosition.quantity -= request.quantity;

      // Si la cantidad llega a 0, eliminar la posición
      if (existingPosition.quantity === 0) {
        state.positions = state.positions.filter(p => p.securityId !== request.securityId);
      }

      // Guardar el estado actualizado
      localStorageService.saveState(state);
      return;
    }

    // Si no es localStorage, usar el backend
    await api.post('/transactions/sell', request);
    // Después de una venta, actualizamos el portfolio completo
    await portfolioApi.getPortfolio();
  },

  updateQuote: async (request: QuoteUpdateRequest): Promise<void> => {
    await api.patch('/quotes', request);
    // Después de actualizar una quote, actualizamos el portfolio
    await portfolioApi.getPortfolio();
  },

  getValuationAtDate: async (date: Date): Promise<ValuationResponse> => {
    const response = await api.get<ValuationResponse>(`/quotes/valuation?at=${date.toISOString()}`);
    return response.data;
  },
};

export const settingsApi = {
  getSettings: async (): Promise<Settings> => {
    const response = await api.get<Settings>('/settings');
    await stateService.updateState({ settings: response.data });
    return response.data;
  },

  updateMarketDataConfig: async (config: MarketDataConfig): Promise<void> => {
    await api.patch('/settings/market-data', config);
    // Actualizamos las settings después de cambiar la configuración
    await settingsApi.getSettings();
  },

  updateStorageConfig: async (config: StorageConfig): Promise<void> => {
    await api.patch('/settings/storage', config);
    // Actualizamos las settings después de cambiar la configuración
    await settingsApi.getSettings();
  },

  getDebugSnapshot: async (): Promise<void> => {
    const response = await api.get('/settings/debug/snapshot');
    console.log('📊 InMemory Database Snapshot:', response.data);
    console.dir(response.data, { depth: null, colors: true });
  },
};
