import React, { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { usePortfolio } from '../hooks/usePortfolio';
import { NavigationMenu } from '../components/NavigationMenu';
import { PosicionConsolidada } from '../components/PosicionConsolidada';
import { InversionesSection } from '../components/InversionesSection';
import { LoadingSpinner } from '../components/LoadingSpinner';

const Dashboard: React.FC = () => {
  const { portfolio, isLoading, error } = usePortfolio();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentSection, setCurrentSection] = useState<'posicion' | 'inversiones'>('posicion');

  // Read section from URL parameters
  useEffect(() => {
    const section = searchParams.get('section');
    if (section === 'posicion' || section === 'inversiones') {
      setCurrentSection(section);
    }
  }, [searchParams]);

  const handleSectionChange = (section: 'posicion' | 'inversiones') => {
    setCurrentSection(section);
    setSearchParams({ section });
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

  if (!portfolio) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>No hay datos del portafolio disponibles</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Panel de control
      </Typography>
      
      <NavigationMenu 
        currentSection={currentSection}
        onSectionChange={handleSectionChange}
      />
      
      {currentSection === 'posicion' && (
        <PosicionConsolidada 
          cash={portfolio.cash} 
          positions={portfolio.positions}
          totalValuation={portfolio.totalValuation}
        />
      )}
      
      {currentSection === 'inversiones' && (
        <InversionesSection securities={portfolio.securities} />
      )}
    </Box>
  );
};

export default Dashboard;