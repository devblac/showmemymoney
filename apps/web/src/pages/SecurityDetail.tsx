import React from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Typography, Box, Button, Grid, Card, CardContent, Chip } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { usePortfolio } from '../hooks/usePortfolio';
import { TransactionForm } from '../components/TransactionForm';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Security, Position } from '../types/api';

const SecurityDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { portfolio, isLoading, error, refetch } = usePortfolio();

  const handleBack = () => {
    const from = searchParams.get('from') || 'posicion';
    navigate(from === 'posicion' ? '/' : '/inversiones');
  };

  const handleTransactionSuccess = () => {
    refetch();
    navigate('/');
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography className="text-red-600 dark:text-red-400">
          Error al cargar el portafolio:{' '}
          {error instanceof Error ? error.message : 'Error desconocido'}
        </Typography>
      </Box>
    );
  }

  if (!portfolio || !id) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography className="text-gray-600 dark:text-gray-300">
          Instrumento no encontrado
        </Typography>
      </Box>
    );
  }

  const security = portfolio.securities.find((s: Security) => s.id === id);
  const position = portfolio.positions.find((p) => p.security.id === id);

  if (!security) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography className="text-gray-600 dark:text-gray-300">
          Instrumento no encontrado
        </Typography>
      </Box>
    );
  }

  const currentPrice = position?.unitPrice || 150;

  return (
    <Box sx={{ p: 2 }} className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Button
        startIcon={<ArrowBack />}
        onClick={handleBack}
        sx={{ mb: 3 }}
        className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        Volver
      </Button>

      <Typography variant="h4" gutterBottom className="text-gray-900 dark:text-white mb-6">
        {security.symbol}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card className="dark:bg-gray-800">
            <CardContent>
              <Typography variant="h6" gutterBottom className="text-gray-900 dark:text-white">
                Información del instrumento
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                  Nombre
                </Typography>
                <Typography variant="body1" className="text-gray-900 dark:text-white font-medium">
                  {security.name}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                  Tipo
                </Typography>
                <Chip
                  label={security.type}
                  color={security.type === 'acción' ? 'primary' : 'secondary'}
                  size="small"
                  className="dark:bg-gray-700 dark:text-white"
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                  Precio actual
                </Typography>
                <Typography variant="h6" className="text-indigo-600 dark:text-indigo-400">
                  ${currentPrice.toLocaleString()}
                </Typography>
              </Box>

              {position && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                    Tu posición
                  </Typography>
                  <Typography variant="body1" className="text-gray-900 dark:text-white font-medium">
                    {position.quantity} títulos
                  </Typography>
                  <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                    Valuación: ${position.valuation.toLocaleString()}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <TransactionForm
            security={security}
            position={position}
            currentPrice={currentPrice}
            cashBalance={portfolio.cash.balance}
            onSuccess={handleTransactionSuccess}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default SecurityDetail;
