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
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Instrumento</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {securities.map((security) => (
            <TableRow key={security.id} hover>
              <TableCell>
                <div>
                  <Typography variant="body1" fontWeight="medium">
                    {security.symbol}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {security.name}
                  </Typography>
                </div>
              </TableCell>
              <TableCell>
                <Chip 
                  label={security.type} 
                  size="small"
                  color={security.type === 'acción' ? 'primary' : 'secondary'}
                />
              </TableCell>
              <TableCell align="right">
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => handleSecurityClick(security.id)}
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