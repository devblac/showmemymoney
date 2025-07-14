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
    <Card sx={{ mb: 3 }} className="dark:bg-gray-800">
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom className="dark:text-white">
          Portfolio Summary
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="body1" className="dark:text-gray-200">
            Cash Balance:{' '}
            <strong className="dark:text-white">${cash.balance.toLocaleString()}</strong>
          </Typography>
          <Typography variant="body1" className="dark:text-gray-200">
            Invested: <strong className="dark:text-white">${investedValue.toLocaleString()}</strong>
          </Typography>
          <Typography variant="body1" className="dark:text-gray-200">
            Total Valuation:{' '}
            <strong className="dark:text-white">${totalValuation.toLocaleString()}</strong>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
