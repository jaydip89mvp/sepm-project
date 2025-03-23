import React from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

const StockHistory = () => {
  // Mock data - replace with API call
  const stockHistory = [
    {
      id: 1,
      productName: 'Product 1',
      action: 'Added',
      quantity: 50,
      date: '2024-03-20',
      user: 'John Doe',
    },
    // Add more history entries
  ];

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Stock History
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Updated By</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stockHistory.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.date}</TableCell>
                <TableCell>{record.productName}</TableCell>
                <TableCell>{record.action}</TableCell>
                <TableCell>{record.quantity}</TableCell>
                <TableCell>{record.user}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default StockHistory;