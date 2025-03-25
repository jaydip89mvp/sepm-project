import React from 'react';
import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const suppliers = [
  { name: 'Supplier A', company: 'Company A' },
  { name: 'Supplier B', company: 'Company B' }
];

const ShowSupplier = () => {
  return (
    <Paper
      elevation={4}
      sx={{
        p: 3,
        borderRadius: 2,
        maxWidth: 500,
        mx: 'auto',
        mt: 4,
        boxShadow: 3,
        textAlign: 'center',
      }}
    >
      <Typography variant="h5" fontWeight="bold" color="primary" sx={{ mb: 2 }}>
        Suppliers List
      </Typography>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Supplier</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Company</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {suppliers.map((supplier, index) => (
              <TableRow key={index}>
                <TableCell>{supplier.name}</TableCell>
                <TableCell>{supplier.company}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ShowSupplier;
