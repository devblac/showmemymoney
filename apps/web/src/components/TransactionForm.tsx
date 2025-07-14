import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from '@mui/material';
import { Security } from '../types/api';
import { ExtendedPosition } from '../types/portfolio';
import { useTransactions } from '../hooks/useTransactions';

interface TransactionFormProps {
  security: Security;
  position: ExtendedPosition | null;
  currentPrice: number;
  cashBalance: number;
  onSuccess: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  security,
  position,
  currentPrice,
  cashBalance,
  onSuccess,
}) => {
  const [quantity, setQuantity] = useState(1);
  const { buy, sell, buyLoading, sellLoading } = useTransactions();

  const cost = quantity * currentPrice;
  const proceeds = quantity * currentPrice;
  const maxBuy = Math.floor(cashBalance / currentPrice);
  const maxSell = position?.quantity || 0;
  const canBuy = cost <= cashBalance;
  const canSell = quantity <= maxSell;

  const handleBuy = () => {
    if (!canBuy) return;
    buy({ securityId: security.id, quantity });
    onSuccess();
  };

  const handleSell = () => {
    if (!canSell) return;
    sell({ securityId: security.id, quantity });
    onSuccess();
  };

  return (
    <Card className="dark:bg-gray-800">
      <CardContent>
        <Typography variant="h6" gutterBottom className="text-gray-900 dark:text-white">
          Operar {security.symbol}
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
            Precio actual: ${currentPrice.toLocaleString()}
          </Typography>
          <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
            En cartera: {position?.quantity || 0} títulos
          </Typography>
          <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
            Efectivo disponible: ${cashBalance.toLocaleString()}
          </Typography>
        </Box>

        <TextField
          label="Cantidad"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          inputProps={{ min: 1 }}
          fullWidth
          sx={{ mb: 2 }}
          className="dark:bg-gray-700"
          InputProps={{
            className: "dark:text-white",
          }}
          InputLabelProps={{
            className: "dark:text-gray-300"
          }}
        />

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
            Costo de compra: ${cost.toLocaleString()}
          </Typography>
          <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
            Importe de venta: ${proceeds.toLocaleString()}
          </Typography>
        </Box>

        {!canBuy && quantity > 0 && (
          <Alert severity="warning" sx={{ mb: 2 }} className="dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-800">
            Fondos insuficientes. Máximo que puedes comprar: {maxBuy} títulos
          </Alert>
        )}

        {!canSell && quantity > maxSell && (
          <Alert severity="warning" sx={{ mb: 2 }} className="dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-800">
            Títulos insuficientes. Máximo que puedes vender: {maxSell} títulos
          </Alert>
        )}

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleBuy}
            disabled={!canBuy || buyLoading}
            className={`
              dark:bg-indigo-600 dark:hover:bg-indigo-700
              dark:disabled:bg-gray-700 dark:disabled:text-gray-400
              disabled:opacity-50
            `}
          >
            {buyLoading ? 'Comprando...' : 'Comprar'}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSell}
            disabled={!canSell || sellLoading}
            className={`
              dark:bg-purple-600 dark:hover:bg-purple-700
              dark:disabled:bg-gray-700 dark:disabled:text-gray-400
              disabled:opacity-50
            `}
          >
            {sellLoading ? 'Vendiendo...' : 'Vender'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};