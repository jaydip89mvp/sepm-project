import React, { useState, useEffect } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  IconButton
} from '@mui/material';
import { Add, Edit } from '@mui/icons-material';
import managerService from '../../../services/managerService';

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentForm, setPaymentForm] = useState({
    paymentId: '',
    amount: '',
    method: '',
    orderId: '',
    status: 'PENDING'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await managerService.getPayments();
      setPayments(response.data);
    } catch (error) {
      const errorData = managerService.handleError(error);
      showSnackbar(errorData.message, 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!paymentForm.amount || !paymentForm.method || !paymentForm.orderId) {
      showSnackbar('Please fill in all required fields', 'error');
      return;
    }

    setIsLoading(true);
    try {
      if (selectedPayment) {
        await managerService.updatePayment(paymentForm);
        showSnackbar('Payment updated successfully', 'success');
      } else {
        await managerService.addPayment(paymentForm);
        showSnackbar('Payment added successfully', 'success');
      }
      setOpen(false);
      resetForm();
      fetchPayments();
    } catch (error) {
      const errorData = managerService.handleError(error);
      showSnackbar(errorData.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setPaymentForm({
      paymentId: '',
      amount: '',
      method: '',
      orderId: '',
      status: 'PENDING'
    });
    setSelectedPayment(null);
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const paymentMethods = [
    'CREDIT_CARD',
    'DEBIT_CARD',
    'BANK_TRANSFER',
    'CASH',
    'UPI',
    'WALLET'
  ];

  const paymentStatuses = [
    'PENDING',
    'PROCESSING',
    'COMPLETED',
    'FAILED',
    'REFUNDED'
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" color="primary">Payment Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
          disabled={isLoading}
        >
          Add Payment
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Payment ID</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Method</TableCell>
              <TableCell>Order ID</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No payments found
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment) => (
                <TableRow key={payment.paymentId}>
                  <TableCell>{payment.paymentId}</TableCell>
                  <TableCell>${payment.amount.toFixed(2)}</TableCell>
                  <TableCell>{payment.method}</TableCell>
                  <TableCell>{payment.orderId}</TableCell>
                  <TableCell>{payment.status}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        setSelectedPayment(payment);
                        setPaymentForm(payment);
                        setOpen(true);
                      }}
                      disabled={isLoading}
                    >
                      <Edit />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog 
        open={open} 
        onClose={() => {
          setOpen(false);
          resetForm();
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{selectedPayment ? 'Edit Payment' : 'Add New Payment'}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              required
              fullWidth
              margin="normal"
              label="Amount"
              type="number"
              value={paymentForm.amount}
              onChange={(e) => setPaymentForm({...paymentForm, amount: parseFloat(e.target.value)})}
              inputProps={{ min: 0, step: 0.01 }}
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Payment Method</InputLabel>
              <Select
                value={paymentForm.method}
                onChange={(e) => setPaymentForm({...paymentForm, method: e.target.value})}
                label="Payment Method"
              >
                {paymentMethods.map((method) => (
                  <MenuItem key={method} value={method}>
                    {method.replace('_', ' ')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              required
              fullWidth
              margin="normal"
              label="Order ID"
              value={paymentForm.orderId}
              onChange={(e) => setPaymentForm({...paymentForm, orderId: e.target.value})}
            />
            {selectedPayment && (
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Status</InputLabel>
                <Select
                  value={paymentForm.status}
                  onChange={(e) => setPaymentForm({...paymentForm, status: e.target.value})}
                  label="Status"
                >
                  {paymentStatuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            <Button
              fullWidth
              variant="contained"
              type="submit"
              sx={{ mt: 2 }}
              disabled={isLoading}
            >
              {selectedPayment ? 'Update Payment' : 'Add Payment'}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PaymentManagement;