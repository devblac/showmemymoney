import { useQuery } from '@tanstack/react-query';
import { portfolioApi } from '../services/api';
import { PortfolioDTO } from '../types/api';

export const usePortfolio = () => {
  const query = useQuery<PortfolioDTO>({
    queryKey: ['portfolio'],
    queryFn: portfolioApi.getPortfolio,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  return {
    portfolio: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};
