import React, { useEffect, useState } from 'react';
import {
  Paper, Typography, TextField, Button, Snackbar, Alert, Box
} from '@mui/material';
import { Inventory2, Delete } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const AddProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({ name: '', subcategory: '', quantity: '' });
  const [errors, setErrors] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${productId}`);
        if (!res.ok) throw new Error('Failed to fetch product');
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
        setSnackbarMessage('Error loading product.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product.name.trim()) {
      setErrors({ name: 'Product name is required' });
      setSnackbarMessage('Please provide a valid product name.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: product.name }),
      });

      if (!res.ok) throw new Error('Failed to update product');
      setSnackbarMessage('Product name updated successfully!');
      setSnackbarSeverity('success');
    } catch (err) {
      setSnackbarMessage('Error updating product.');
      setSnackbarSeverity('error');
    } finally {
      setOpenSnackbar(true);
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm('Are you sure you want to delete this product?');
    if (!confirm) return;

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete product');
      setSnackbarMessage('Product deleted successfully!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      setTimeout(() => navigate('/products'), 1500);
    } catch (err) {
      setSnackbarMessage('Error deleting product.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = (_, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ maxWidth: 600, margin: '0 auto' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Paper sx={{ p: 4, mt: 4 }}>
          <Typography variant="h5" gutterBottom>Edit Product</Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth name="name" label="Product Name" value={product.name}
              onChange={handleChange} error={!!errors.name} helperText={errors.name} required
              InputProps={{ startAdornment: <Inventory2 sx={{ mr: 1 }} /> }}
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth name="subcategory" label="Category" value={product.subcategory}
              disabled sx={{ mb: 3 }}
            />
            <TextField
              fullWidth name="quantity" label="Quantity" value={product.quantity}
              disabled sx={{ mb: 3 }}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button type="submit" variant="contained" color="primary">
                Update Name
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={handleDelete}
              >
                Delete
              </Button>
            </Box>
          </form>
        </Paper>
      </motion.div>

      
    </Box>
  );
};

export default AddProduct;
