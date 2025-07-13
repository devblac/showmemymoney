import React from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Typography, 
  Box, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  Chip,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { usePortfolio } from '../hooks/usePortfolio';
import { TransactionForm } from '../components/TransactionForm';
import { LoadingSpinner } from '../components/LoadingSpinner';

const SecurityDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { portfolio, isLoading, error, refetch } = usePortfolio();

  const handleBack = () => {
    // Return to the previous section if specified, otherwise default to 'posicion'
    const returnSection = searchParams.get('from') || 'posicion';
    navigate(`/?section=${returnSection}`);
  };

  const handleTransactionSuccess = () => {
    // Refresh the portfolio data
    refetch();
    
    // Navigate back to "Posición consolidada" after successful transaction
    navigate('/?section=posicion');
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">
          Error al cargar el portafolio: {error instanceof Error ? error.message : 'Error desconocido'}
        </Typography>
      </Box>
    );
  }

  if (!portfolio || !id) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>Instrumento no encontrado</Typography>
      </Box>
    );
  }

  const security = portfolio.securities.find(s => s.id === id);
  const position = portfolio.positions.find(p => p.security.id === id) || null;

  if (!security) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>Instrumento no encontrado</Typography>
      </Box>
    );
  }

  // Find current price from a quote (this would typically come from the backend)
  const currentPrice = position?.unitPrice || 150; // Default price for demo

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBack}
          sx={{ mb: 2 }}
        >
          Volver al panel
        </Button>
        
        <Typography variant="h4" component="h1" gutterBottom>
          {security.symbol} - {security.name}
        </Typography>
        
        <Chip 
          label={security.type} 
          size="medium"
          color={security.type === 'acción' ? 'primary' : 'secondary'}
        />
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Información del instrumento
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Símbolo
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {security.symbol}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Nombre
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {security.name}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Tipo
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {security.type}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Precio actual
                </Typography>
                <Typography variant="h6" color="primary">
                  ${currentPrice.toLocaleString()}
                </Typography>
              </Box>
              
              {position && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Tu posición
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {position.quantity} títulos
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
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