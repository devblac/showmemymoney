import React from 'react';
import { Typography, Box } from '@mui/material';
import { Security } from '../types/api';
import { SecuritiesTable } from './SecuritiesTable';

interface InversionesSectionProps {
  securities: Security[];
}

export const InversionesSection: React.FC<InversionesSectionProps> = ({ securities }) => {
  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }} className="dark:text-white">
        Inversiones disponibles
      </Typography>
      
      <Typography variant="body1" className="text-gray-600 dark:text-gray-300" sx={{ mb: 3 }}>
        Selecciona una inversión para comprar o vender
      </Typography>
      
      <SecuritiesTable securities={securities} />
    </Box>
  );
}; 