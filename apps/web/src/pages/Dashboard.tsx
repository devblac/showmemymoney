import React from 'react';
import { Box } from '@mui/material';
import { usePortfolio } from '../hooks/usePortfolio';
import { NavigationMenu } from '../components/NavigationMenu';
import { PosicionConsolidada } from '../components/PosicionConsolidada';
import { InversionesSection } from '../components/InversionesSection';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Routes, Route, useNavigate } from 'react-router-dom';
import PreferenciasSection from '../components/PreferenciasSection';
import SecurityDetail from './SecurityDetail';

export function Dashboard() {
  const { portfolio, isLoading, error } = usePortfolio();
  const navigate = useNavigate();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <div className="text-red-600 dark:text-red-400">
          Error al cargar el portafolio: {error instanceof Error ? error.message : 'Error desconocido'}
        </div>
      </Box>
    );
  }

  if (!portfolio) {
    return (
      <Box sx={{ p: 2 }}>
        <div className="text-gray-600 dark:text-gray-300">No hay datos del portafolio disponibles</div>
      </Box>
    );
  }

  const handleSectionChange = (section: 'posicion' | 'inversiones') => {
    navigate(section === 'posicion' ? '/' : '/inversiones');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <NavigationMenu onSectionChange={handleSectionChange} />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Routes>
          <Route 
            path="/" 
            element={
              <PosicionConsolidada 
                cash={portfolio.cash} 
                positions={portfolio.positions}
                totalValuation={portfolio.totalValuation}
              />
            } 
          />
          <Route 
            path="/inversiones" 
            element={<InversionesSection securities={portfolio.securities} />} 
          />
          <Route 
            path="/preferencias" 
            element={<PreferenciasSection />} 
          />
          <Route 
            path="/security/:id" 
            element={<SecurityDetail />} 
          />
        </Routes>
      </main>
    </div>
  );
}