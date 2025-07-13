import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  InputAdornment,
  Alert,
} from '@mui/material';
import { Security, Position } from '../types/api';
import { useTransactions } from '../hooks/useTransactions';

interface TransactionFormProps {
  security: Security;
  position: Position | null;
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
  const [quantity, setQuantity] = useState<number>(1);
  const { buy, sell, buyLoading, sellLoading } = useTransactions();

  const cost = quantity * currentPrice;
  const proceeds = quantity * currentPrice;
  const maxBuy = Math.floor(cashBalance / currentPrice);
  const maxSell = position?.quantity || 0;

  const canBuy = quantity > 0 && cost <= cashBalance;
  const canSell = quantity > 0 && quantity <= maxSell;

  const handleBuy = () => {
    if (canBuy) {
      buy({ securityId: security.id, quantity });
      onSuccess();
    }
  };

  const handleSell = () => {
    if (canSell) {
      sell({ securityId: security.id, quantity });
      onSuccess();
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Operar {security.symbol}
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Precio actual: ${currentPrice.toLocaleString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            En cartera: {position?.quantity || 0} títulos
          </Typography>
          <Typography variant="body2" color="text.secondary">
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
        />

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2">
            Costo de compra: ${cost.toLocaleString()}
          </Typography>
          <Typography variant="body2">
            Importe de venta: ${proceeds.toLocaleString()}
          </Typography>
        </Box>

        {!canBuy && quantity > 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Fondos insuficientes. Máximo que puedes comprar: {maxBuy} títulos
          </Alert>
        )}

        {!canSell && quantity > maxSell && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Títulos insuficientes. Máximo que puedes vender: {maxSell} títulos
          </Alert>
        )}

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleBuy}
            disabled={!canBuy || buyLoading}
            fullWidth
          >
            {buyLoading ? 'Comprando...' : 'Comprar'}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSell}
            disabled={!canSell || sellLoading}
            fullWidth
          >
            {sellLoading ? 'Vendiendo...' : 'Vender'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};