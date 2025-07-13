import { useMutation, useQueryClient } from '@tanstack/react-query';
import { portfolioApi } from '../services/api';
import { TransactionRequest } from '../types/api';
import { useNotification } from './useNotification';

export const useTransactions = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  const buyMutation = useMutation({
    mutationFn: portfolioApi.buySecurity,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      showNotification(data.message, 'success');
    },
    onError: (error) => {
      showNotification(error instanceof Error ? error.message : 'Error en la compra', 'error');
    },
  });

  const sellMutation = useMutation({
    mutationFn: portfolioApi.sellSecurity,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      showNotification(data.message, 'success');
    },
    onError: (error) => {
      showNotification(error instanceof Error ? error.message : 'Error en la venta', 'error');
    },
  });

  const buy = (request: TransactionRequest) => {
    buyMutation.mutate(request);
  };

  const sell = (request: TransactionRequest) => {
    sellMutation.mutate(request);
  };

  return {
    buy,
    sell,
    buyLoading: buyMutation.isPending,
    sellLoading: sellMutation.isPending,
  };
};