import { create } from 'zustand';
import { Security, Position, CashAccount } from '../types/api';

interface PortfolioState {
  cash: CashAccount | null;
  positions: Position[];
  securities: Security[];
  totalValuation: number;
  loading: boolean;
  error: string | null;
  
  // Actions
  setPortfolio: (data: {
    cash: CashAccount;
    positions: Position[];
    securities: Security[];
    totalValuation: number;
  }) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  cash: null,
  positions: [],
  securities: [],
  totalValuation: 0,
  loading: false,
  error: null,
  
  setPortfolio: (data) => set({
    cash: data.cash,
    positions: data.positions,
    securities: data.securities,
    totalValuation: data.totalValuation,
    loading: false,
    error: null,
  }),
  
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }),
  clearError: () => set({ error: null }),
}));