import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Alert,
  Snackbar,
  CircularProgress,
  InputAdornment
} from '@mui/material';
import {
  Inventory2,
  Add as AddIcon,
  ShoppingCart,
  Warning
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import employeeService from '../services/employeeService';

const RequestStock = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [priority, setPriority] = useState('NORMAL');
  const [additional, setAdditional] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const priorityOptions = [
    { value: 'LOW', label: 'Low Priority' },
    { value: 'NORMAL', label: 'Normal Priority' },
    { value: 'HIGH', label: 'High Priority' }
  ];

  // Fetch all products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await employeeService.getAllProducts();
        if (response.success) {
          setProducts(response.data || []);
        } else {
          setError('Failed to fetch products. Please try again.');
        }
      } catch (err) {
        setError('Network error. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleProductChange = (event) => {
    const productId = event.target.value;
    const product = products.find((p) => p.productId === productId);
    setSelectedProduct(product);

    if (product && product.reorderLevel) {
      const suggestedQuantity = Math.max(0, product.reorderLevel * 2 - product.stockLevel);
      setQuantity(suggestedQuantity.toString());
    } else {
      setQuantity('');
    }
  };

  const handleSubmitRequest = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const request = {
        productId: selectedProduct.productId,
        name: selectedProduct.name,
        stock: selectedProduct.stockLevel,
        additional: additional || '',
        quantity: parseInt(quantity),
        priority: priority,
        status: 'active'
      };

      const response = await employeeService.addRefillRequest(request);

      if (response.success) {
        setSuccess(`Request for ${selectedProduct.name} submitted successfully!`);
        setSelectedProduct(null);
        setQuantity('');
        setPriority('NORMAL');
        setAdditional('');
      } else {
        setError(`Failed to submit request for ${selectedProduct.name}`);
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    }
  };

  const validateForm = () => {
    if (!selectedProduct) {
      setError('Please select a product');
      return false;
    }

    if (!quantity || parseInt(quantity) <= 0) {
      setError('Please enter a valid quantity (greater than 0)');
      return false;
    }

    return true;
  };

  const handleCloseSnackbar = () => {
    setSuccess('');
    setError('');
  };

  return (
    <Box>
      <Typography
        variant="h4"
        className="section-title"
        sx={{ mb: 4, fontWeight: 600, textAlign: 'center' }}
      >
        Request New Stock
      </Typography>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper className="card-3d" sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Create Stock Request
              </Typography>

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <FormControl fullWidth className="input-3d">
                      <InputLabel id="product-select-label">Select Product</InputLabel>
                      <Select
                        labelId="product-select-label"
                        value={selectedProduct ? selectedProduct.productId : ''}
                        onChange={handleProductChange}
                        label="Select Product"
                        startAdornment={
                          <InputAdornment position="start">
                            <Inventory2 />
                          </InputAdornment>
                        }
                      >
                        <MenuItem value="">
                          <em>Select a product</em>
                        </MenuItem>
                        {products.map((product) => (
                          <MenuItem key={product.productId} value={product.productId}>
                            {product.name} ({product.stockLevel} in stock)
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {selectedProduct && (
                    <Grid item xs={12}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        Current Stock: {selectedProduct.stockLevel}
                      </Typography>
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <TextField
                      label="Quantity to Order"
                      type="number"
                      fullWidth
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      InputProps={{
                        className: 'input-3d',
                        startAdornment: (
                          <InputAdornment position="start">
                            <ShoppingCart />
                          </InputAdornment>
                        )
                      }}
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth className="input-3d">
                      <InputLabel id="priority-select-label">Priority</InputLabel>
                      <Select
                        labelId="priority-select-label"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        label="Priority"
                        startAdornment={
                          <InputAdornment position="start">
                            <Warning />
                          </InputAdornment>
                        }
                      >
                        {priorityOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Additional Notes"
                      multiline
                      rows={2}
                      fullWidth
                      value={additional}
                      onChange={(e) => setAdditional(e.target.value)}
                      className="input-3d"
                    />
                  </Grid>

                  <Grid item xs={12} sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleSubmitRequest}
                      className="btn-3d btn-3d-primary"
                      startIcon={<AddIcon />}
                    >
                      Submit Request
                    </Button>
                  </Grid>
                </Grid>
              )}
            </Paper>
          </Grid>
        </Grid>
      </motion.div>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" elevation={6}>
          {success}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" elevation={6}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RequestStock;