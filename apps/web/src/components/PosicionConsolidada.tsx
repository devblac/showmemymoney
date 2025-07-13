import React from 'react';
import { 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Divider 
} from '@mui/material';
import { AccountBalance, TrendingUp, AttachMoney } from '@mui/icons-material';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { CashAccount, Position } from '../types/api';
import { PositionsTable } from './PositionsTable';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface PosicionConsolidadaProps {
  cash: CashAccount;
  positions: Position[];
  totalValuation: number;
}

export const PosicionConsolidada: React.FC<PosicionConsolidadaProps> = ({
  cash,
  positions,
  totalValuation,
}) => {
  const positionsValue = totalValuation - cash.balance;

  // Create a comprehensive pie chart with cash + all individual positions
  const portfolioData = {
    labels: [
      'Efectivo disponible',
      ...positions.map(pos => pos.security.symbol)
    ],
    datasets: [
      {
        data: [
          cash.balance,
          ...positions.map(pos => pos.valuation)
        ],
        backgroundColor: [
          '#1976d2', // Primary blue for cash (first)
          '#ff6384', // Red
          '#36a2eb', // Blue
          '#ffce56', // Yellow
          '#4bc0c0', // Teal
          '#9966ff', // Purple
          '#ff9f40', // Orange
          '#ff6384', // Pink
          '#c9cbcf'  // Gray
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 10,
          usePointStyle: true,
          font: {
            size: 11
          },
          boxWidth: 12
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: $${value.toLocaleString()} (${percentage}%)`;
          }
        }
      }
    },
  };

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
        Posición consolidada
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Left side - Summary list */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 1.5, height: 260 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 0.5, fontSize: '1.1rem' }}>
              Resumen del patrimonio
            </Typography>
            <List dense sx={{ pt: 0 }}>
              <ListItem sx={{ py: 0.5, px: 0 }}>
                <ListItemIcon sx={{ minWidth: 35 }}>
                  <AttachMoney sx={{ color: 'primary.main', fontSize: '1.2rem' }} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="caption" color="text.secondary">
                      Efectivo disponible
                    </Typography>
                  }
                  secondary={
                    <Typography variant="h6" color="primary.main" sx={{ fontSize: '1.1rem' }}>
                      ${cash.balance.toLocaleString()}
                    </Typography>
                  }
                />
              </ListItem>
              
              <Divider sx={{ my: 0.25 }} />
              
              <ListItem sx={{ py: 0.5, px: 0 }}>
                <ListItemIcon sx={{ minWidth: 35 }}>
                  <TrendingUp sx={{ color: 'secondary.main', fontSize: '1.2rem' }} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="caption" color="text.secondary">
                      Inversiones
                    </Typography>
                  }
                  secondary={
                    <Typography variant="h6" color="secondary.main" sx={{ fontSize: '1.1rem' }}>
                      ${positionsValue.toLocaleString()}
                    </Typography>
                  }
                />
              </ListItem>
              
              <Divider sx={{ my: 0.25 }} />
              
              <ListItem sx={{ py: 0.5, px: 0 }}>
                <ListItemIcon sx={{ minWidth: 35 }}>
                  <AccountBalance sx={{ color: 'success.main', fontSize: '1.2rem' }} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="caption" color="text.secondary">
                      Patrimonio total
                    </Typography>
                  }
                  secondary={
                    <Typography variant="h6" color="success.main" sx={{ fontSize: '1.1rem' }}>
                      ${totalValuation.toLocaleString()}
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        
        {/* Right side - Single comprehensive chart */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 1.5, height: 260, overflow: 'hidden' }}>
            <Typography variant="h6" gutterBottom align="center" sx={{ mb: 0.5, fontSize: '1.1rem' }}>
              Composición del patrimonio
            </Typography>
            <Box sx={{ height: 220, position: 'relative', width: '100%' }}>
              <Pie data={portfolioData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 2 }} />
      
      {/* Positions Table */}
      <Typography variant="h6" gutterBottom sx={{ mb: 1.5, mt: 2 }}>
        Mis posiciones
      </Typography>
      <PositionsTable positions={positions} />
    </Box>
  );
}; 