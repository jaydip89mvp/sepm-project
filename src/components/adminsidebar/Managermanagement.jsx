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
  IconButton,
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import employeeService from '../services/employeeService';

const ProductsTable = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    name: '',
    subCategory: '',
    stockLevel: 0,
    reorderLevel: 0,
    active: true
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await employeeService.getAllProducts();
      if (response.success) {
        setProducts(response.data || []);
      } else {
        showSnackbar(response.message || 'Failed to fetch products', 'error');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      showSnackbar('Error fetching products', 'error');
    } finally {
      setLoading(false);
    }
  };

  

  const handleOpenDialog = (product = null) => {
    if (product) {
      setEditMode(true);
      setFormData({
        name: product.name,
        subCategory: product.subCategory || '',
        stockLevel: product.stockLevel || 0,
        reorderLevel: product.reorderLevel || 0,
        active: product.active !== undefined ? product.active : true
      });
    } else {
      setEditMode(false);
      setFormData({
        name: '',
        subCategory: '',
        stockLevel: 0,
        reorderLevel: 0,
        active: true
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let response;
      if (editMode) {
        response = await employeeService.updateProduct(formData);
      } else {
        response = await employeeService.createProduct(formData);
      }

      if (response.success) {
        showSnackbar(response.message || (editMode ? 'Product updated successfully' : 'Product added successfully'));
        fetchProducts();
        handleClose();
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

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await employeeService.deleteProduct(productId);
        if (response.success) {
          showSnackbar('Product deleted successfully');
          fetchProducts();
        } else {
          showSnackbar(response.message || 'Failed to delete product', 'error');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        showSnackbar('Error deleting product', 'error');
      }
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Product Management
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => handleOpenDialog()}
        sx={{ mb: 3 }}
      >
        Add New Product
      </Button>
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>SubCategory</TableCell>
                <TableCell>Stock Level</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.productId}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.subCategory}</TableCell>
                  <TableCell>
                    {product.stockLevel}
                    <Chip
                      size="small"
                      label={product.stockLevel <= product.reorderLevel ? 'Low Stock' : 'In Stock'}
                      color={product.stockLevel <= product.reorderLevel ? 'warning' : 'success'}
                      sx={{ ml: 1 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={product.active ? 'Active' : 'Inactive'}
                      color={product.active ? 'success' : 'error'}
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleOpenDialog(product)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => handleDelete(product.productId)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Edit Product' : 'Add Product'}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Subcategory"
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Stock Level"
                  name="stockLevel"
                  type="number"
                  value={formData.stockLevel}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Reorder Level"
                  name="reorderLevel"
                  type="number"
                  value={formData.reorderLevel}
                  onChange={handleChange}
                  required
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={handleClose} sx={{ mr: 2 }}>
                Cancel
              </Button>
              <Button type="submit" variant="contained">
                {editMode ? 'Update' : 'Add'}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductsTable;