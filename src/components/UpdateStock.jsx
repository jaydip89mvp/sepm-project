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
  Divider,
  InputAdornment,
  Chip
} from '@mui/material';
import {
  AddCircleOutline,
  RemoveCircleOutline,
  Inventory,
  LocalShipping,
  CheckCircle,
  Warning
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const UpdateStock = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [updateType, setUpdateType] = useState('add');
  const [quantity, setQuantity] = useState('');
  const [supplier, setSupplier] = useState('');
  const [note, setNote] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [currentStock, setCurrentStock] = useState(0);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
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

  // Update current stock when product selection changes
  useEffect(() => {
    if (selectedProduct) {
      const product = products.find(p => p.id.toString() === selectedProduct.toString());
      if (product) {
        setCurrentStock(product.quantity);
      }
    } else {
      setCurrentStock(0);
    }
  }, [selectedProduct, products]);

  const handleProductChange = (event) => {
    setSelectedProduct(event.target.value);
    setQuantity('');
    setError('');
  };

  const handleTypeChange = (event) => {
    setUpdateType(event.target.value);
    setQuantity('');
    setError('');
  };

  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
    setError('');
  };

  const handleSupplierChange = (event) => {
    setSupplier(event.target.value);
    setError('');
  };

  const handleNoteChange = (event) => {
    setNote(event.target.value);
  };

  const validateForm = () => {
    if (!selectedProduct) {
      setError('Please select a product');
      return false;
    }

    if (!quantity || quantity <= 0) {
      setError('Please enter a valid quantity (greater than 0)');
      return false;
    }

    if (updateType === 'remove' && parseInt(quantity) > currentStock) {
      setError(`Cannot remove ${quantity} units. Current stock is ${currentStock}`);
      return false;
    }

    if (updateType === 'add' && !supplier) {
      setError('Please enter a supplier name');
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const updatedQuantity = updateType === 'add' 
        ? parseInt(currentStock) + parseInt(quantity)
        : parseInt(currentStock) - parseInt(quantity);
      
      const response = await fetch(`/api/products/${selectedProduct}/update-stock`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quantity: updatedQuantity,
          supplier: supplier,
          note: note,
          updateType: updateType,
          quantityChanged: parseInt(quantity)
        }),
      });

      if (response.ok) {
        // Update products list with new stock quantity
        setProducts(products.map(product => 
          product.id.toString() === selectedProduct.toString()
            ? { ...product, quantity: updatedQuantity }
            : product
        ));
        
        setSuccess(`Stock successfully ${updateType === 'add' ? 'added to' : 'removed from'} inventory!`);
        
        // Reset form
        setQuantity('');
        setSupplier('');
        setNote('');
        
        // Update current stock
        setCurrentStock(updatedQuantity);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update stock. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    }
  };

  const handleCloseSnackbar = () => {
    setSuccess('');
    setError('');
  };

  // Stock level indicators
  const getStockLevelColor = (level) => {
    if (level <= 0) return 'error';
    if (level < 5) return 'warning';
    return 'success';
  };

  const getStockLevelIcon = (level) => {
    if (level <= 5) return <Warning fontSize="small" />;
    return <CheckCircle fontSize="small" />;
  };

  return (
    <Box>
      <Typography 
        variant="h4" 
        className="section-title"
        sx={{ mb: 4, fontWeight: 600, textAlign: 'center' }}
      >
        Update Inventory Stock
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
                Update Product Stock
              </Typography>
              
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <FormControl fullWidth className="input-3d">
                        <InputLabel id="product-select-label">Select Product</InputLabel>
                        <Select
                          labelId="product-select-label"
                          id="product-select"
                          value={selectedProduct}
                          onChange={handleProductChange}
                          label="Select Product"
                          startAdornment={
                            <InputAdornment position="start">
                              <Inventory />
                            </InputAdornment>
                          }
                        >
                          <MenuItem value="">
                            <em>Select a product</em>
                          </MenuItem>
                          {products.map((product) => (
                            <MenuItem key={product.id} value={product.id}>
                              {product.name} - Current Stock: {product.quantity}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    {selectedProduct && (
                      <>
                        <Grid item xs={12}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              Current Stock:
                            </Typography>
                            <Chip 
                              icon={getStockLevelIcon(currentStock)} 
                              label={`${currentStock} units`} 
                              color={getStockLevelColor(currentStock)}
                              variant="outlined"
                              sx={{ fontWeight: 500 }}
                            />
                          </Box>
                          <Divider sx={{ mb: 2 }} />
                        </Grid>
                        
                        <Grid item xs={12}>
                          <FormControl fullWidth className="input-3d">
                            <InputLabel id="update-type-label">Update Type</InputLabel>
                            <Select
                              labelId="update-type-label"
                              id="update-type"
                              value={updateType}
                              onChange={handleTypeChange}
                              label="Update Type"
                              startAdornment={
                                <InputAdornment position="start">
                                  {updateType === 'add' ? <AddCircleOutline /> : <RemoveCircleOutline />}
                                </InputAdornment>
                              }
                            >
                              <MenuItem value="add">Add Stock</MenuItem>
                              <MenuItem value="remove">Remove Stock</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        
                        <Grid item xs={12}>
                          <TextField
                            label="Quantity"
                            type="number"
                            fullWidth
                            value={quantity}
                            onChange={handleQuantityChange}
                            InputProps={{
                              className: "input-3d",
                              startAdornment: (
                                <InputAdornment position="start">
                                  {updateType === 'add' ? <AddCircleOutline /> : <RemoveCircleOutline />}
                                </InputAdornment>
                              ),
                            }}
                            required
                          />
                        </Grid>
                        
                        {updateType === 'add' && (
                          <Grid item xs={12}>
                            <TextField
                              label="Supplier"
                              fullWidth
                              value={supplier}
                              onChange={handleSupplierChange}
                              InputProps={{
                                className: "input-3d",
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <LocalShipping />
                                  </InputAdornment>
                                ),
                              }}
                              required
                            />
                          </Grid>
                        )}
                        
                        <Grid item xs={12}>
                          <TextField
                            label="Notes"
                            fullWidth
                            multiline
                            rows={3}
                            value={note}
                            onChange={handleNoteChange}
                            className="input-3d"
                            InputProps={{
                              className: "input-3d"
                            }}
                          />
                        </Grid>
                        
                        <Grid item xs={12} sx={{ mt: 2 }}>
                          <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            className="btn-3d btn-3d-primary"
                            sx={{ 
                              py: 1.5, 
                              fontSize: '1rem', 
                              borderRadius: '12px',
                              background: 'linear-gradient(45deg, #4338ca, #4f46e5)',
                              boxShadow: '0px 4px 10px rgba(79, 70, 229, 0.3)',
                              '&:hover': {
                                background: 'linear-gradient(45deg, #4f46e5, #6366f1)',
                                boxShadow: '0px 6px 15px rgba(79, 70, 229, 0.4)',
                              }
                            }}
                          >
                            {updateType === 'add' ? 'Add Stock' : 'Remove Stock'}
                          </Button>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </form>
              )}
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper className="card-3d" sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Inventory Management Guide
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#4f46e5' }}>
                  Adding New Stock
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  When receiving new inventory shipments, select the product, choose "Add Stock", 
                  enter the quantity received and provide the supplier information for tracking purposes.
                </Typography>
                
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#4f46e5' }}>
                  Removing Stock
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  If stock needs to be removed due to damage, losses, or manual adjustments, 
                  choose "Remove Stock" and specify the quantity to be deducted from the inventory.
                </Typography>
                
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#4f46e5' }}>
                  Stock Level Indicators
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip size="small" color="success" label="Good Stock" icon={<CheckCircle fontSize="small" />} />
                    <Typography variant="body2">Sufficient inventory level</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip size="small" color="warning" label="Low Stock" icon={<Warning fontSize="small" />} />
                    <Typography variant="body2">Inventory below minimum threshold</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip size="small" color="error" label="Out of Stock" icon={<Warning fontSize="small" />} />
                    <Typography variant="body2">No inventory available</Typography>
                  </Box>
                </Box>
                
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#4f46e5' }}>
                  Best Practices
                </Typography>
                <Typography variant="body2">
                  • Regularly reconcile physical inventory with system records<br />
                  • Add detailed notes for any non-standard inventory adjustments<br />
                  • Keep supplier information updated for easy reordering<br />
                  • Monitor low stock alerts to avoid stockouts
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </motion.div>
      
      {/* Success/Error messages */}
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

export default UpdateStock;