import React from 'react';
import { CircularProgress, Box } from '@mui/material';

export const LoadingSpinner: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
      className="bg-white dark:bg-gray-900"
    >
      <CircularProgress className="text-indigo-600 dark:text-indigo-400" />
    </Box>
  );
};
