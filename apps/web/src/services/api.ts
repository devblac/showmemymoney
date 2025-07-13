import axios from 'axios';
import {
  PortfolioResponse,
  TransactionRequest,
  TransactionResponse,
  QuoteUpdateRequest,
} from '../types/api';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
);

export const portfolioApi = {
  getPortfolio: async (): Promise<PortfolioResponse> => {
    const response = await api.get<PortfolioResponse>('/portfolio');
    return response.data;
  },

  buySecurity: async (request: TransactionRequest): Promise<TransactionResponse> => {
    const response = await api.post<TransactionResponse>('/transactions/buy', request);
    return response.data;
  },

  sellSecurity: async (request: TransactionRequest): Promise<TransactionResponse> => {
    const response = await api.post<TransactionResponse>('/transactions/sell', request);
    return response.data;
  },

  updateQuote: async (request: QuoteUpdateRequest): Promise<TransactionResponse> => {
    const response = await api.patch<TransactionResponse>('/quotes', request);
    return response.data;
  },
};

export default api;