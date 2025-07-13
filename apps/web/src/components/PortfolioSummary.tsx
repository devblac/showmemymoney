import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { CashAccount } from '../types/api';

interface PortfolioSummaryProps {
  cash: CashAccount;
  totalValuation: number;
}

export const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({ cash, totalValuation }) => {
  const investedValue = totalValuation - cash.balance;
  
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Portfolio Summary
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="body1">
            Cash Balance: <strong>${cash.balance.toLocaleString()}</strong>
          </Typography>
          <Typography variant="body1">
            Invested: <strong>${investedValue.toLocaleString()}</strong>
          </Typography>
          <Typography variant="body1">
            Total Valuation: <strong>${totalValuation.toLocaleString()}</strong>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};