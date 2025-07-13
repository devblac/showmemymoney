import React from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { AccountBalance, TrendingUp } from '@mui/icons-material';

interface NavigationMenuProps {
  currentSection: 'posicion' | 'inversiones';
  onSectionChange: (section: 'posicion' | 'inversiones') => void;
}

export const NavigationMenu: React.FC<NavigationMenuProps> = ({
  currentSection,
  onSectionChange,
}) => {
  const handleChange = (event: React.SyntheticEvent, newValue: 'posicion' | 'inversiones') => {
    onSectionChange(newValue);
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
      <Tabs
        value={currentSection}
        onChange={handleChange}
        variant="fullWidth"
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab
          icon={<AccountBalance />}
          label="Posición consolidada"
          value="posicion"
          sx={{ fontSize: '1rem', fontWeight: 'medium' }}
        />
        <Tab
          icon={<TrendingUp />}
          label="Inversiones"
          value="inversiones"
          sx={{ fontSize: '1rem', fontWeight: 'medium' }}
        />
      </Tabs>
    </Box>
  );
}; 