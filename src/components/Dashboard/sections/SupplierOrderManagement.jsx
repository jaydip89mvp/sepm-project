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
  IconButton,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Divider,
  Tabs,
  Tab,
  Avatar
} from '@mui/material';
import { Edit, Add, LocalShipping, Check, Close } from '@mui/icons-material';
import { motion } from 'framer-motion';
import managerService from '../../../services/managerService';

const SupplierOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [formData, setFormData] = useState({
    supplierId: '',
    totalAmount: '',
    status: 'PENDING'
  });

  const [activeTab, setActiveTab] = useState(0);
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    fetchOrders();
    fetchSuppliers();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await managerService.getSupplierOrders();
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      showSnackbar(error.response?.data?.message || 'Error fetching orders', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await managerService.getAllSuppliers();
      setSuppliers(response.data || []);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      showSnackbar(error.response?.data?.message || 'Error fetching suppliers', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.supplierId || !formData.totalAmount) {
      showSnackbar('Please fill in all required fields', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const orderData = {
        supplierId: formData.supplierId,
        totalAmount: parseFloat(formData.totalAmount)
      };

      if (selectedOrder) {
        await managerService.updateSupplierOrderStatus(selectedOrder.id, formData.status);
        showSnackbar('Order updated successfully', 'success');
      } else {
        await managerService.addSupplierOrder(orderData);
        showSnackbar('Order added successfully', 'success');
      }
      setOpen(false);
      resetForm();
      fetchOrders();
    } catch (error) {
      console.error('Error processing order:', error);
      showSnackbar(error.response?.data?.message || 'Error processing order', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      supplierId: '',
      totalAmount: '',
      status: 'PENDING'
    });
    setEditMode(false);
    setSelectedOrder(null);
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'COMPLETED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleGetOrder = async () => {
    setIsLoading(true);
    try {
      const response = await managerService.getSupplierOrder(orderId);
      setSelectedOrder(response.data);
      setFormData({
        supplierId: response.data.supplierId,
        totalAmount: response.data.totalAmount,
        status: response.data.status
      });
      setEditMode(true);
      setOpen(true);
    } catch (error) {
      console.error('Error fetching order:', error);
      showSnackbar(error.response?.data?.message || 'Error fetching order', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
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
        <LocalShipping 
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
          Supplier Order Management
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
        <Tab label="Add New Order" />
        <Tab label="View/Update Order" />
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
                  Add New Supplier Order
                </Typography>
                <Box component="form" onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        label="Supplier ID"
                        name="supplierId"
                        value={formData.supplierId}
                        onChange={(e) => setFormData({...formData, supplierId: e.target.value})}
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
                        label="Total Amount"
                        name="totalAmount"
                        type="number"
                        value={formData.totalAmount}
                        onChange={(e) => setFormData({...formData, totalAmount: e.target.value})}
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
                        <InputLabel>Status</InputLabel>
                        <Select
                          name="status"
                          value={formData.status}
                          onChange={(e) => setFormData({...formData, status: e.target.value})}
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
                            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Add Order'}
                          </Button>
                        </motion.div>
                        <Button
                          variant="outlined"
                          onClick={resetForm}
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
                  View/Update Supplier Order
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      label="Order ID"
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
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
                        onClick={handleGetOrder}
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
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Get Order'}
                      </Button>
                    </motion.div>
                  </Box>
                </Box>

                {selectedOrder && (
                  <>
                    <Box component="form" onSubmit={handleSubmit}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            label="Supplier ID"
                            name="supplierId"
                            value={formData.supplierId}
                            onChange={(e) => setFormData({...formData, supplierId: e.target.value})}
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
                            label="Total Amount"
                            name="totalAmount"
                            type="number"
                            value={formData.totalAmount}
                            onChange={(e) => setFormData({...formData, totalAmount: e.target.value})}
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
                            <InputLabel>Status</InputLabel>
                            <Select
                              name="status"
                              value={formData.status}
                              onChange={(e) => setFormData({...formData, status: e.target.value})}
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
                                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Update Order'}
                              </Button>
                            </motion.div>
                            <Button
                              variant="outlined"
                              onClick={resetForm}
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
                      Order Details
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
                            S
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              Order ID: {selectedOrder.orderId}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Supplier Order
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Supplier ID
                        </Typography>
                        <Typography variant="body1">
                          {selectedOrder.supplierId}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Total Amount
                        </Typography>
                        <Typography variant="body1">
                          ${selectedOrder.totalAmount?.toFixed(2)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Status
                        </Typography>
                        <Typography 
                          variant="body1"
                          sx={{
                            color: selectedOrder.status === 'COMPLETED' ? 'success.main' : 'warning.main',
                            fontWeight: 'bold'
                          }}
                        >
                          {selectedOrder.status}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Order Date
                        </Typography>
                        <Typography variant="body1">
                          {new Date(selectedOrder.orderDate).toLocaleString()}
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

export default SupplierOrderManagement; 