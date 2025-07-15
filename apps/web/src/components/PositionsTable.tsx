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
import { ExtendedPosition } from '../types/portfolio';

interface PositionsTableProps {
  positions: ExtendedPosition[];
}

export const PositionsTable: React.FC<PositionsTableProps> = ({ positions }) => {
  const navigate = useNavigate();

  const handleOperateClick = (securityId: string) => {
    navigate(`/security/${securityId}?from=posicion`);
  };

  if (positions.length === 0) {
    return (
      <Paper sx={{ p: 2 }} className="dark:bg-gray-800">
        <Typography variant="body1" className="text-gray-600 dark:text-gray-300">
          No tienes posiciones abiertas
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} className="dark:bg-gray-800">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell className="dark:text-gray-200">Instrumento</TableCell>
            <TableCell className="dark:text-gray-200">Tipo</TableCell>
            <TableCell align="right" className="dark:text-gray-200">
              Cantidad
            </TableCell>
            <TableCell align="right" className="dark:text-gray-200">
              Precio unitario
            </TableCell>
            <TableCell align="right" className="dark:text-gray-200">
              Valuación
            </TableCell>
            <TableCell align="right" className="dark:text-gray-200">
              Acciones
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {positions.map(position => (
            <TableRow key={position.security.id} className="dark:border-gray-700">
              <TableCell className="dark:text-gray-200">
                <div>
                  <Typography variant="body1" fontWeight="medium" className="dark:text-gray-200">
                    {position.security.symbol}
                  </Typography>
                  <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                    {position.security.name}
                  </Typography>
                </div>
              </TableCell>
              <TableCell className="dark:text-gray-200">
                <Chip
                  label={position.security.type}
                  color={position.security.type === 'acción' ? 'primary' : 'secondary'}
                  size="small"
                  className={`dark:text-white ${
                    position.security.type === 'acción' ? 'dark:bg-blue-600' : 'dark:bg-purple-600'
                  }`}
                />
              </TableCell>
              <TableCell align="right" className="dark:text-gray-200">
                {position.quantity}
              </TableCell>
              <TableCell align="right" className="dark:text-gray-200">
                ${position.unitPrice.toLocaleString()}
              </TableCell>
              <TableCell align="right" className="dark:text-gray-200">
                ${position.valuation.toLocaleString()}
              </TableCell>
              <TableCell align="right">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleOperateClick(position.security.id)}
                  className="dark:text-gray-200 dark:border-gray-600 hover:dark:border-gray-400"
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
