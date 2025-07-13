import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container, AppBar, Toolbar, Typography } from '@mui/material';
import Dashboard from './pages/Dashboard.tsx';
import SecurityDetail from './pages/SecurityDetail.tsx';
import { NotificationProvider } from './components/NotificationProvider.tsx';

function App() {
  return (
    <NotificationProvider>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Gestor de Portafolio
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/security/:id" element={<SecurityDetail />} />
        </Routes>
      </Container>
    </NotificationProvider>
  );
}

export default App;