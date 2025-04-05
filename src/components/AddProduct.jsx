import React, { useState, useEffect } from 'react';
import {
  Paper, Typography, TextField, Button, Grid2, Box,
  Alert, Snackbar, InputAdornment, CircularProgress
} from '@mui/material';
import { Inventory2, Category, PriceCheck, Warning } from '@mui/icons-material';
import { motion } from 'framer-motion';

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: '',
    subcategory: '',
    price: '',
    quantity: '',
    description: '',
  });

  const [errors, setErrors] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loadingLowStock, setLoadingLowStock] = useState(true);

  // Load low-stock products
  useEffect(() => {
    const fetchLowStock = async () => {
      try {
        const res = await fetch('/api/products/low-stock');
        const data = await res.json();
        setLowStockProducts(data);
      } catch (error) {
        console.error('Failed to fetch low stock:', error);
      } finally {
        setLoadingLowStock(false);
      }
    };
    fetchLowStock();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!product.name.trim()) newErrors.name = 'Product name is required';
    if (!product.subcategory.trim()) newErrors.subcategory = 'Subcategory is required';
    if (!product.price || product.price <= 0) newErrors.price = 'Valid price is required';
    if (!product.quantity || product.quantity < 0) newErrors.quantity = 'Valid quantity is required';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prevState => ({
      ...prevState,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setSnackbarMessage('Please fill all required fields correctly');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });

      if (response.ok) {
        setSnackbarMessage('Product added successfully!');
        setSnackbarSeverity('success');
        setProduct({ name: '', subcategory: '', price: '', quantity: '', description: '' });
      } else {
        throw new Error('Failed to add product');
      }
    } catch (error) {
      setSnackbarMessage('Error adding product. Please try again.');
      setSnackbarSeverity('error');
    }
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (_, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ maxWidth: 1000, margin: '0 auto' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Paper className="card-3d" sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" gutterBottom>Add New Product</Typography>

          <form onSubmit={handleSubmit}>
            <Grid2 container spacing={3}>
              <Grid2 item xs={12} sm={6}>
                <TextField
                  required fullWidth name="name" label="Product Name" value={product.name}
                  onChange={handleChange} error={!!errors.name} helperText={errors.name}
                  InputProps={{ startAdornment: (<InputAdornment position="start"><Inventory2 /></InputAdornment>) }}
                />
              </Grid2>
              <Grid2 item xs={12} sm={6}>
                <TextField
                  required fullWidth name="subcategory" label="Category" value={product.subcategory}
                  onChange={handleChange} error={!!errors.subcategory} helperText={errors.subcategory}
                  InputProps={{ startAdornment: (<InputAdornment position="start"><Category /></InputAdornment>) }}
                />
              </Grid2>
              <Grid2 item xs={12} sm={6}>
                <TextField
                  required fullWidth name="price" label="Price" type="number" value={product.price}
                  onChange={handleChange} error={!!errors.price} helperText={errors.price}
                  InputProps={{ startAdornment: (<InputAdornment position="start"><PriceCheck /></InputAdornment>) }}
                />
              </Grid2>
              <Grid2 item xs={12} sm={6}>
                <TextField
                  required fullWidth name="quantity" label="Initial Quantity" type="number"
                  value={product.quantity} onChange={handleChange}
                  error={!!errors.quantity} helperText={errors.quantity}
                />
              </Grid2>
              <Grid2 item xs={12}>
                <TextField
                  fullWidth multiline rows={4} name="description" label="Description"
                  value={product.description} onChange={handleChange}
                />
              </Grid2>
              <Grid2 item xs={12}>
                <Button
                  variant="contained" color="primary" type="submit" size="large"
                  className="btn-3d btn-3d-primary" sx={{ mt: 2 }}
                >
                  Add Product
                </Button>
              </Grid2>
            </Grid2>
          </form>
        </Paper>
      </motion.div>

      {/* LOW STOCK ALERTS */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Paper className="card-3d" sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}><Warning sx={{ mr: 1, color: 'orange' }} /> Low Stock Alerts</Typography>
          {loadingLowStock ? (
            <Box display="flex" justifyContent="center"><CircularProgress /></Box>
          ) : lowStockProducts.length === 0 ? (
            <Alert severity="success">All stock levels are healthy.</Alert>
          ) : (
            <Grid2 container spacing={2}>
              {lowStockProducts.map(product => (
                <Grid2 item xs={12} md={6} key={product._id}>
                  <Alert severity="warning">
                    <strong>{product.name}</strong> is below minimum quantity ({product.quantity} left).
                  </Alert>
                </Grid2>
              ))}
            </Grid2>
          )}
        </Paper>
      </motion.div>

      {/* INFO CARDS */}
      

      {/* SNACKBAR */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddProduct;
