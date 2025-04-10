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
  Chip
} from '@mui/material';
import { Edit, Delete, Save, Cancel, Search, CheckCircle, Warning } from '@mui/icons-material';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
// ...imports remain unchanged

const ProductsTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [updatedProduct, setUpdatedProduct] = useState({ name: '' });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:8080/products/${id}`);
        setProducts(products.filter((product) => product.id !== id));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product.id);
    setUpdatedProduct({ name: product.name });
  };

  const handleInputChange = (e) => {
    setUpdatedProduct({ ...updatedProduct, [e.target.name]: e.target.value });
  };

  const handleSave = async (id) => {
    try {
      await axios.put(`http://localhost:8080/products/${id}`, updatedProduct);
      setProducts(products.map((product) =>
        product.id === id ? { ...product, ...updatedProduct } : product
      ));
      setEditingProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setUpdatedProduct({ name: '' });
  };

  const filteredProducts = products.filter(product =>
    product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product?.category?.toLowerCase().includes(searchTerm.toLowerCase())
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
                    <TableCell>Quantity</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <AnimatePresence>
                    {filteredProducts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          <Typography variant="body1" color="text.secondary">
                            No products found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProducts.map((product, index) => (
                        <TableRow
                          key={product.id}
                          component={motion.tr}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <TableCell>{product.id}</TableCell>
                          <TableCell>
                            {editingProduct === product.id ? (
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
                          <TableCell>{product.category}</TableCell>
                          <TableCell>{product.quantity}</TableCell>
                          <TableCell>
                            {editingProduct === product.id ? (
                              <>
                                <Tooltip title="Save">
                                  <IconButton onClick={() => handleSave(product.id)} sx={{ color: '#059669' }}>
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
                                  <IconButton onClick={() => handleDelete(product.id)} sx={{ color: '#dc2626' }}>
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
    </Box>
  );
};

export default ProductsTable;
