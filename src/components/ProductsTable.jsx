import React, { useState, useEffect } from 'react';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Box,
  IconButton,
  Tooltip,
  CircularProgress,
  Paper,
  InputAdornment,
  Chip,
  Snackbar,
  Alert
} from '@mui/material';
import { Edit, Delete, Save, Cancel, Search, CheckCircle, Warning } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import employeeService from '../services/employeeService';

const ProductsTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [updatedProduct, setUpdatedProduct] = useState({
    name: '',
    mainCategory: '',
    subCategory: '',
    description: '',
    stockLevel: 0,
    reorderLevel: 0,
    active: true
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await employeeService.getProductCategories();
      if (response.success) {
        // For each category, fetch products
        const allProducts = [];
        for (const category of response.data) {
          const productResponse = await employeeService.getProduct({ id: category });
          if (productResponse.success && productResponse.data) {
            if (Array.isArray(productResponse.data)) {
              allProducts.push(...productResponse.data);
            } else {
              allProducts.push(productResponse.data);
            }
          }
        }
        setProducts(allProducts);
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

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await employeeService.deleteProduct(productId);
        if (response.success) {
          setProducts(products.filter((product) => product.productId !== productId));
          showSnackbar('Product deleted successfully');
        } else {
          showSnackbar(response.message || 'Failed to delete product', 'error');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        showSnackbar('Error deleting product', 'error');
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product.productId);
    setUpdatedProduct({
      productId: product.productId,
      name: product.name,
      mainCategory: product.mainCategory,
      subCategory: product.subCategory || '',
      description: product.description || '',
      stockLevel: product.stockLevel || 0,
      reorderLevel: product.reorderLevel || 0,
      active: product.active !== undefined ? product.active : true
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setUpdatedProduct(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleSave = async (productId) => {
    try {
      const response = await employeeService.updateProduct(updatedProduct);
      if (response.success) {
        setProducts(products.map((product) =>
          product.productId === productId ? { ...product, ...updatedProduct } : product
        ));
        setEditingProduct(null);
        showSnackbar('Product updated successfully');
      } else {
        showSnackbar(response.message || 'Failed to update product', 'error');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      showSnackbar('Error updating product', 'error');
    }
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setUpdatedProduct({
      name: '',
      mainCategory: '',
      subCategory: '',
      description: '',
      stockLevel: 0,
      reorderLevel: 0,
      active: true
    });
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

  const filteredProducts = products.filter(product =>
    product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product?.mainCategory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product?.subCategory?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box className="dashboard-container">
      <Box className="gradient-header" sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        <Typography variant="h4" className="dashboard-title section-title">
          Product Dashboard
        </Typography>
      </Box>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper className="card-3d content-card" sx={{ p: 3 }}>
          <TextField
            fullWidth
            placeholder="Search by name or category..."
            variant="outlined"
            className="input-3d"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              )
            }}
            sx={{ mb: 3 }}
          />

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer className="table-3d">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Stock Level</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <AnimatePresence>
                    {filteredProducts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <Typography variant="body1" color="text.secondary">
                            No products found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProducts.map((product, index) => (
                        <TableRow
                          key={product.productId}
                          component={motion.tr}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <TableCell>{product.productId}</TableCell>
                          <TableCell>
                            {editingProduct === product.productId ? (
                              <TextField
                                name="name"
                                value={updatedProduct.name}
                                onChange={handleInputChange}
                                fullWidth
                                className="input-3d"
                                size="small"
                              />
                            ) : (
                              <Typography sx={{ fontWeight: 500 }}>{product.name}</Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            {editingProduct === product.productId ? (
                              <TextField
                                name="mainCategory"
                                value={updatedProduct.mainCategory}
                                onChange={handleInputChange}
                                fullWidth
                                className="input-3d"
                                size="small"
                              />
                            ) : (
                              <Typography>
                                {product.mainCategory}
                                {product.subCategory && ` - ${product.subCategory}`}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            {editingProduct === product.productId ? (
                              <TextField
                                name="stockLevel"
                                type="number"
                                value={updatedProduct.stockLevel}
                                onChange={handleInputChange}
                                fullWidth
                                className="input-3d"
                                size="small"
                                InputProps={{ inputProps: { min: 0 } }}
                              />
                            ) : (
                              <Typography>
                                {product.stockLevel}
                                <Chip
                                  size="small"
                                  label={product.stockLevel <= product.reorderLevel ? 'Low Stock' : 'In Stock'}
                                  color={product.stockLevel <= product.reorderLevel ? 'warning' : 'success'}
                                  sx={{ ml: 1 }}
                                />
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              label={product.active ? 'Active' : 'Inactive'}
                              color={product.active ? 'success' : 'error'}
                            />
                          </TableCell>
                          <TableCell>
                            {editingProduct === product.productId ? (
                              <>
                                <Tooltip title="Save">
                                  <IconButton onClick={() => handleSave(product.productId)} sx={{ color: '#059669' }}>
                                    <Save />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Cancel">
                                  <IconButton onClick={handleCancel} sx={{ color: '#dc2626' }}>
                                    <Cancel />
                                  </IconButton>
                                </Tooltip>
                              </>
                            ) : (
                              <>
                                <Tooltip title="Edit">
                                  <IconButton onClick={() => handleEdit(product)} sx={{ color: '#4f46e5' }}>
                                    <Edit />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                  <IconButton onClick={() => handleDelete(product.productId)} sx={{ color: '#dc2626' }}>
                                    <Delete />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </TableContainer>
          )}
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

export default ProductsTable;
