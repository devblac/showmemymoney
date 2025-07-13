import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Position } from '../types/api';

interface PositionsTableProps {
  positions: Position[];
}

export const PositionsTable: React.FC<PositionsTableProps> = ({ positions }) => {
  const navigate = useNavigate();

  const handleOperateClick = (securityId: string) => {
    navigate(`/security/${securityId}?from=posicion`);
  };

  if (positions.length === 0) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography variant="body1" color="text.secondary">
          No tienes posiciones abiertas
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Instrumento</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell align="right">Cantidad</TableCell>
            <TableCell align="right">Precio unitario</TableCell>
            <TableCell align="right">Valuación</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {positions.map((position) => (
            <TableRow key={position.security.id}>
              <TableCell>
                <div>
                  <Typography variant="body1" fontWeight="medium">
                    {position.security.symbol}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {position.security.name}
                  </Typography>
                </div>
              </TableCell>
              <TableCell>
                <Chip 
                  label={position.security.type} 
                  size="small"
                  color={position.security.type === 'acción' ? 'primary' : 'secondary'}
                />
              </TableCell>
              <TableCell align="right">{position.quantity}</TableCell>
              <TableCell align="right">${position.unitPrice.toLocaleString()}</TableCell>
              <TableCell align="right">${position.valuation.toLocaleString()}</TableCell>
              <TableCell align="right">
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => handleOperateClick(position.security.id)}
                >
                  Operar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};