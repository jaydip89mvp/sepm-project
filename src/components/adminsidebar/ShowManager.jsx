import React from 'react';
import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const managers = [
  { name: 'Manager A', role: 'Role A', email: 'managerA@example.com' },
  { name: 'Manager B', role: 'Role B', email: 'managerB@example.com' }
];

const ShowManagers = () => {
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
        Managers List
      </Typography>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {managers.map((manager, index) => (
              <TableRow key={index}>
                <TableCell>{manager.name}</TableCell>
                <TableCell>{manager.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ShowManagers;
