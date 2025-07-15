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
  Button,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Security } from '../types/api';

interface SecuritiesTableProps {
  securities: Security[];
}

export const SecuritiesTable: React.FC<SecuritiesTableProps> = ({ securities }) => {
  const navigate = useNavigate();

  const handleSecurityClick = (securityId: string) => {
    navigate(`/security/${securityId}?from=inversiones`);
  };

  return (
    <TableContainer component={Paper} className="dark:bg-gray-800">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell className="dark:text-gray-200">Instrumento</TableCell>
            <TableCell className="dark:text-gray-200">Tipo</TableCell>
            <TableCell align="right" className="dark:text-gray-200">
              Acciones
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {securities.map(security => (
            <TableRow key={security.id} hover className="dark:border-gray-700">
              <TableCell className="dark:text-gray-200">
                <div>
                  <Typography variant="body1" fontWeight="medium" className="dark:text-gray-200">
                    {security.symbol}
                  </Typography>
                  <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                    {security.name}
                  </Typography>
                </div>
              </TableCell>
              <TableCell className="dark:text-gray-200">
                <Chip
                  label={security.type}
                  color={security.type === 'acción' ? 'primary' : 'secondary'}
                  size="small"
                  className={`dark:text-white ${
                    security.type === 'acción' ? 'dark:bg-blue-600' : 'dark:bg-purple-600'
                  }`}
                />
              </TableCell>
              <TableCell align="right">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleSecurityClick(security.id)}
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
