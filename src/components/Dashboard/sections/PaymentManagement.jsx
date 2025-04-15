import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  Paper,
  Grid,
  Card,
  CardContent,
  Divider,
  Tabs,
  Tab,
  CircularProgress,
  Avatar
} from '@mui/material';
import { 
  Add as AddIcon, 
  Payment as PaymentIcon,
  Check as CheckIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import managerService from '../../../services/managerService';

const PaymentManagement = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    orderId: '',
    amount: '',
    orderType: '',
    status: 'PENDING'
  });
  const [paymentId, setPaymentId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  const [selectedPayment, setSelectedPayment] = useState(null);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setSelectedPayment(null);
    setFormData({
      orderId: '',
      amount: '',
      orderType: '',
      status: 'PENDING'
    });
    setPaymentId('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddPayment = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await managerService.addPayment({
        ...formData,
        amount: parseFloat(formData.amount)
      });
      setSnackbar({ open: true, message: 'Payment added successfully', severity: 'success' });
      setFormData({
        orderId: '',
        amount: '',
        orderType: '',
        status: 'PENDING'
      });
    } catch (error) {
      setSnackbar({ open: true, message: error.message || 'Error adding payment', severity: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetPayment = async () => {
    if (!paymentId) {
      setSnackbar({ open: true, message: 'Please enter a payment ID', severity: 'warning' });
      return;
    }

    setIsLoading(true);

    try {
      const response = await managerService.getPayment(paymentId);
      if (response.data) {
        setSelectedPayment(response.data);
        setFormData({
          orderId: response.data.orderId,
          amount: response.data.amount.toString(),
          orderType: response.data.orderType,
          status: response.data.status
        });
      }
    } catch (error) {
      setSnackbar({ open: true, message: error.message || 'Error fetching payment', severity: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePayment = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await managerService.updatePayment({
        ...formData,
        paymentId: selectedPayment.paymentId,
        amount: parseFloat(formData.amount)
      });
      setSnackbar({ open: true, message: 'Payment updated successfully', severity: 'success' });
      handleGetPayment(); // Refresh the payment details
    } catch (error) {
      setSnackbar({ open: true, message: error.message || 'Error updating payment', severity: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleReset = () => {
    setFormData({
      orderId: '',
      amount: '',
      orderType: '',
      status: 'PENDING'
    });
    setPaymentId('');
    setSelectedPayment(null);
  };

  return (
    <Box className="card-3d-soft" sx={{ p: 4, borderRadius: 3, backgroundColor: 'white' }}>
      <Box 
        className="section-title" 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2, 
          mb: 4 
        }}
      >
        <PaymentIcon 
          sx={{ 
            fontSize: 32, 
            color: 'primary.main',
            backgroundColor: 'primary.light',
            p: 1,
            borderRadius: '50%',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
          }} 
        />
        <Typography 
          variant="h4" 
          className="section-title"
          sx={{ 
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #4338ca 30%, #6366f1 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Payment Management
        </Typography>
      </Box>

      <Tabs 
        value={activeTab} 
        onChange={handleTabChange} 
        sx={{ 
          mb: 3,
          '& .MuiTabs-indicator': {
            background: 'linear-gradient(45deg, #4338ca 30%, #6366f1 90%)',
          },
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 'bold',
            '&.Mui-selected': {
              color: '#4338ca',
            },
          },
        }}
      >
        <Tab label="Add New Payment" />
        <Tab label="View/Update Payment" />
      </Tabs>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card className="card-3d" sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ 
                  background: 'linear-gradient(45deg, #4338ca 30%, #6366f1 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 'bold'
                }}>
                  Add New Payment
                </Typography>
                <Box component="form" onSubmit={handleAddPayment}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
            <TextField
                        label="Order ID"
                        name="orderId"
                        value={formData.orderId}
                        onChange={handleChange}
              required
              fullWidth
                        className="input-3d"
                        sx={{ 
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '&.Mui-focused fieldset': {
                              borderColor: '#6366f1',
                              borderWidth: 2
                            }
                          }
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
              label="Amount"
                        name="amount"
              type="number"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                        fullWidth
                        className="input-3d"
                        InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                        sx={{ 
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '&.Mui-focused fieldset': {
                              borderColor: '#6366f1',
                              borderWidth: 2
                            }
                          }
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Order Type</InputLabel>
                        <Select
                          name="orderType"
                          value={formData.orderType}
                          onChange={handleChange}
                          label="Order Type"
                          required
                          className="input-3d"
                          sx={{ 
                            borderRadius: 2,
                            '&.Mui-focused fieldset': {
                              borderColor: '#6366f1',
                              borderWidth: 2
                            }
                          }}
                        >
                          <MenuItem value="Supplier">Supplier</MenuItem>
                          <MenuItem value="Customer">Customer</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
              <Select
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                          label="Status"
                          required
                          className="input-3d"
                          sx={{ 
                            borderRadius: 2,
                            '&.Mui-focused fieldset': {
                              borderColor: '#6366f1',
                              borderWidth: 2
                            }
                          }}
                        >
                          <MenuItem value="PENDING">Pending</MenuItem>
                          <MenuItem value="COMPLETED">Completed</MenuItem>
              </Select>
            </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={isLoading}
                            fullWidth
                            className="btn-3d btn-3d-primary"
                            sx={{ 
                              background: 'linear-gradient(45deg, #4338ca 30%, #6366f1 90%)',
                              boxShadow: '0 6px 12px rgba(99, 102, 241, 0.3)',
                              borderRadius: 2,
                              textTransform: 'none',
                              fontWeight: 'bold',
                              py: 1.2,
                              px: 3
                            }}
                          >
                            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Add Payment'}
                          </Button>
                        </motion.div>
                        <Button
                          variant="outlined"
                          onClick={handleReset}
                          disabled={isLoading}
                          className="btn-3d"
                          sx={{ 
                            borderRadius: 2,
                            textTransform: 'none',
                            borderColor: 'rgba(99, 102, 241, 0.5)',
                            color: '#6366f1',
                            '&:hover': {
                              borderColor: '#6366f1',
                              backgroundColor: 'rgba(99, 102, 241, 0.05)'
                            }
                          }}
                        >
                          Reset
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card className="card-3d" sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ 
                  background: 'linear-gradient(45deg, #4338ca 30%, #6366f1 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 'bold'
                }}>
                  View/Update Payment
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      label="Payment ID"
                      value={paymentId}
                      onChange={(e) => setPaymentId(e.target.value)}
                      fullWidth
                      className="input-3d"
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&.Mui-focused fieldset': {
                            borderColor: '#6366f1',
                            borderWidth: 2
                          }
                        }
                      }}
                    />
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="contained"
                        onClick={handleGetPayment}
                        disabled={isLoading}
                        className="btn-3d btn-3d-primary"
                        sx={{ 
                          background: 'linear-gradient(45deg, #4338ca 30%, #6366f1 90%)',
                          boxShadow: '0 6px 12px rgba(99, 102, 241, 0.3)',
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 'bold',
                          py: 1.2,
                          px: 3
                        }}
                      >
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Get Payment'}
                      </Button>
                    </motion.div>
                  </Box>
                </Box>

                {selectedPayment && (
                  <>
                    <Box component="form" onSubmit={handleUpdatePayment}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            label="Order ID"
                            name="orderId"
                            value={formData.orderId}
                            onChange={handleChange}
                            required
                            fullWidth
                            className="input-3d"
                            sx={{ 
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&.Mui-focused fieldset': {
                                  borderColor: '#6366f1',
                                  borderWidth: 2
                                }
                              }
                            }}
                          />
                        </Grid>

                        <Grid item xs={12}>
            <TextField
                            label="Amount"
                            name="amount"
                            type="number"
                            value={formData.amount}
                            onChange={handleChange}
              required
              fullWidth
                            className="input-3d"
                            InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                            sx={{ 
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&.Mui-focused fieldset': {
                                  borderColor: '#6366f1',
                                  borderWidth: 2
                                }
                              }
                            }}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <FormControl fullWidth>
                            <InputLabel>Order Type</InputLabel>
                            <Select
                              name="orderType"
                              value={formData.orderType}
                              onChange={handleChange}
                              label="Order Type"
                              required
                              className="input-3d"
                              sx={{ 
                                borderRadius: 2,
                                '&.Mui-focused fieldset': {
                                  borderColor: '#6366f1',
                                  borderWidth: 2
                                }
                              }}
                            >
                              <MenuItem value="Supplier">Supplier</MenuItem>
                              <MenuItem value="Customer">Customer</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                          <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                              name="status"
                              value={formData.status}
                              onChange={handleChange}
                  label="Status"
                              required
                              className="input-3d"
                              sx={{ 
                                borderRadius: 2,
                                '&.Mui-focused fieldset': {
                                  borderColor: '#6366f1',
                                  borderWidth: 2
                                }
                              }}
                            >
                              <MenuItem value="PENDING">Pending</MenuItem>
                              <MenuItem value="COMPLETED">Completed</MenuItem>
                </Select>
              </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={isLoading}
              fullWidth
                                className="btn-3d btn-3d-primary"
                                sx={{ 
                                  background: 'linear-gradient(45deg, #4338ca 30%, #6366f1 90%)',
                                  boxShadow: '0 6px 12px rgba(99, 102, 241, 0.3)',
                                  borderRadius: 2,
                                  textTransform: 'none',
                                  fontWeight: 'bold',
                                  py: 1.2,
                                  px: 3
                                }}
                              >
                                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Update Payment'}
                              </Button>
                            </motion.div>
                            <Button
                              variant="outlined"
                              onClick={handleReset}
              disabled={isLoading}
                              className="btn-3d"
                              sx={{ 
                                borderRadius: 2,
                                textTransform: 'none',
                                borderColor: 'rgba(99, 102, 241, 0.5)',
                                color: '#6366f1',
                                '&:hover': {
                                  borderColor: '#6366f1',
                                  backgroundColor: 'rgba(99, 102, 241, 0.05)'
                                }
                              }}
                            >
                              Reset
            </Button>
          </Box>
                        </Grid>
                      </Grid>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h6" gutterBottom sx={{ 
                      background: 'linear-gradient(45deg, #4338ca 30%, #6366f1 90%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: 'bold'
                    }}>
                      Payment Details
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <Avatar 
                            sx={{ 
                              backgroundColor: 'primary.light',
                              color: 'primary.main',
                              fontWeight: 'bold',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                            }}
                          >
                            {selectedPayment.orderType?.substring(0, 1)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              Payment ID: {selectedPayment.paymentId}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {selectedPayment.orderType} Order
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Order ID
                        </Typography>
                        <Typography variant="body1">
                          {selectedPayment.orderId}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Amount
                        </Typography>
                        <Typography variant="body1">
                          ${selectedPayment.amount?.toFixed(2)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Status
                        </Typography>
                        <Typography 
                          variant="body1"
                          sx={{
                            color: selectedPayment.status === 'COMPLETED' ? 'success.main' : 'warning.main',
                            fontWeight: 'bold'
                          }}
                        >
                          {selectedPayment.status}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Payment Date
                        </Typography>
                        <Typography variant="body1">
                          {new Date(selectedPayment.paymentDate).toLocaleString()}
                        </Typography>
                      </Grid>
                    </Grid>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PaymentManagement;