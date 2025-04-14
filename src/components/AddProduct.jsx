import React, { useEffect, useState } from 'react';
import {
  Paper, Typography, TextField, Button, Snackbar, Alert, Box,
  FormControl, InputLabel, Select, MenuItem, CircularProgress
} from '@mui/material';
import { Inventory2, Delete, Save } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import employeeService from '../services/employeeService';

const AddProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState({
    name: '',
    mainCategory: '',
    subCategory: '',
    description: '',
    stockLevel: 0,
    reorderLevel: 0,
    active: true
  });
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchCategories();
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await employeeService.getProductCategories();
      if (response.success) {
        setCategories(response.data);
      } else {
        showSnackbar(response.message || 'Failed to fetch categories', 'error');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      showSnackbar('Error fetching categories', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await employeeService.getProduct(productId);
      if (response.success) {
        setProduct(response.data);
      } else {
        showSnackbar(response.message || 'Failed to fetch product', 'error');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      showSnackbar('Error fetching product', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!product.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    if (!product.mainCategory) {
      newErrors.mainCategory = 'Category is required';
    }
    if (product.stockLevel < 0) {
      newErrors.stockLevel = 'Stock level cannot be negative';
    }
    if (product.reorderLevel < 0) {
      newErrors.reorderLevel = 'Reorder level cannot be negative';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showSnackbar('Please fix the errors in the form', 'error');
      return;
    }

    setLoading(true);
    try {
      let response;
      if (productId) {
        // Update existing product
        response = await employeeService.updateProduct({
          ...product,
          productId
        });
      } else {
        // Create new product
        response = await employeeService.createProduct(product);
      }

      if (response.success) {
        showSnackbar(response.message || (productId ? 'Product updated successfully' : 'Product created successfully'));
        setTimeout(() => navigate('/products'), 1500);
      } else {
        showSnackbar(response.message || 'Operation failed', 'error');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      showSnackbar('Error saving product', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await employeeService.deleteProduct(productId);
      if (response.success) {
        showSnackbar(response.message || 'Product deleted successfully');
        setTimeout(() => navigate('/products'), 1500);
      } else {
        showSnackbar(response.message || 'Failed to delete product', 'error');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      showSnackbar('Error deleting product', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = (_, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', p: 3 }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
      >
        <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            {productId ? 'Edit Product' : 'Add New Product'}
          </Typography>
          
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mb: 3 }}>
              <TextField
                fullWidth
                name="name"
                label="Product Name"
                value={product.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                required
                InputProps={{ 
                  startAdornment: <Inventory2 sx={{ mr: 1, color: 'primary.main' }} /> 
                }}
              />
              
              <FormControl fullWidth error={!!errors.mainCategory} required>
                <InputLabel>Category</InputLabel>
                <Select
                  name="mainCategory"
                  value={product.mainCategory}
                  onChange={handleChange}
                  label="Category"
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
                {errors.mainCategory && (
                  <Typography variant="caption" color="error">
                    {errors.mainCategory}
                  </Typography>
                )}
              </FormControl>
              
              <TextField
                fullWidth
                name="subCategory"
                label="Subcategory"
                value={product.subCategory}
                onChange={handleChange}
              />
              
              <TextField
                fullWidth
                name="description"
                label="Description"
                value={product.description}
                onChange={handleChange}
                multiline
                rows={2}
              />
              
              <TextField
                fullWidth
                name="stockLevel"
                label="Stock Level"
                type="number"
                value={product.stockLevel}
                onChange={handleChange}
                error={!!errors.stockLevel}
                helperText={errors.stockLevel}
                InputProps={{ inputProps: { min: 0 } }}
              />
              
              <TextField
                fullWidth
                name="reorderLevel"
                label="Reorder Level"
                type="number"
                value={product.reorderLevel}
                onChange={handleChange}
                error={!!errors.reorderLevel}
                helperText={errors.reorderLevel}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate('/products')}
                disabled={loading}
              >
                Cancel
              </Button>
              
              {productId && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Delete />}
                  onClick={handleDelete}
                  disabled={loading}
                >
                  Delete
                </Button>
              )}
              
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                disabled={loading}
              >
                {loading ? 'Saving...' : (productId ? 'Update Product' : 'Add Product')}
              </Button>
            </Box>
          </form>
        </Paper>
      </motion.div>

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

export default AddProduct;
