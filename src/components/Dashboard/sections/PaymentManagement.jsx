import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';
import { Add } from '@mui/icons-material';

const PaymentManagement = () => {
  const [payments, setPayments] = useState([
    {
      paymentId: '1',
      amount: '1000',
      method: 'Credit Card',
      orderId: 'ORD001',
      status: 'Completed'
    },
    {
      paymentId: '2',
      amount: '750',
      method: 'PayPal',
      orderId: 'ORD002',
      status: 'Pending'
    }
  ]);
  const [open, setOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    paymentId: '',
    amount: '',
    method: '',
    orderId: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAddPayment = async (e) => {
    e.preventDefault();
    if (!paymentForm.amount || !paymentForm.method || !paymentForm.orderId) {
      setError('Please fill in all required fields');
      return;
    }

    const newPayment = {
      ...paymentForm,
      paymentId: `PAY${Math.floor(Math.random() * 1000)}`,
      status: 'Pending'
    };
    setPayments([...payments, newPayment]);
    setOpen(false);
    setPaymentForm({
      paymentId: '',
      amount: '',
      method: '',
      orderId: '',
    });
    setError(null);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" color="primary">Payment Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
        >
          Add Payment
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Payment ID</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Method</TableCell>
              <TableCell>Order ID</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No payments found
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment) => (
                <TableRow key={payment.paymentId}>
                  <TableCell>{payment.paymentId}</TableCell>
                  <TableCell>{payment.amount}</TableCell>
                  <TableCell>{payment.method}</TableCell>
                  <TableCell>{payment.orderId}</TableCell>
                  <TableCell>{payment.status}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Payment</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleAddPayment} sx={{ mt: 2 }}>
            <TextField
              required
              fullWidth
              margin="normal"
              label="Amount"
              type="number"
              value={paymentForm.amount}
              onChange={(e) => setPaymentForm({...paymentForm, amount: e.target.value})}
            />
            <TextField
              required
              fullWidth
              margin="normal"
              label="Method"
              value={paymentForm.method}
              onChange={(e) => setPaymentForm({...paymentForm, method: e.target.value})}
            />
            <TextField
              required
              fullWidth
              margin="normal"
              label="Order ID"
              value={paymentForm.orderId}
              onChange={(e) => setPaymentForm({...paymentForm, orderId: e.target.value})}
            />
            <Button
              fullWidth
              variant="contained"
              type="submit"
              sx={{ mt: 2 }}
              disabled={loading}
            >
              Add Payment
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PaymentManagement;