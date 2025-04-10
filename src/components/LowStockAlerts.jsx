import React, { useState, useEffect } from 'react';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Box,
  Paper,
  CircularProgress,
  Divider,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Alert,
  Snackbar,
  IconButton,
  Tooltip,
  LinearProgress
} from '@mui/material';
import {
  Warning,
  Inventory,
  LocalShipping,
  Refresh,
  TrendingDown,
  TrendingUp,
  CheckCircle,
  Error
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import employeeService from '../services/employeeService';

const LowStockAlerts = () => {
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchLowStockAlerts();
  }, []);

  // Fetch low-stock products from the backend
  const fetchLowStockAlerts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await employeeService.getLowStockAlerts();
      if (response.success) {
        setLowStockProducts(response.data);
      } else {
        setError(response.message || 'Failed to fetch low stock alerts');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
      console.error('Error fetching low-stock products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchLowStockAlerts();
  };

  const handleRequestStock = (productId) => {
    navigate('/request-stock', { state: { productId } });
  };

  const handleCloseSnackbar = () => {
    setError('');
    setSuccess('');
  };

  // Calculate stock percentage
  const calculateStockPercentage = (stockLevel, reorderLevel) => {
    if (reorderLevel === 0) return 0;
    return Math.min(100, (stockLevel / reorderLevel) * 100);
  };

  // Get stock level color
  const getStockLevelColor = (stockLevel, reorderLevel) => {
    const percentage = calculateStockPercentage(stockLevel, reorderLevel);
    if (percentage <= 0) return 'error';
    if (percentage < 50) return 'warning';
    return 'success';
  };

  // Get stock level icon
  const getStockLevelIcon = (stockLevel, reorderLevel) => {
    const percentage = calculateStockPercentage(stockLevel, reorderLevel);
    if (percentage <= 0) return <Error fontSize="small" />;
    if (percentage < 50) return <Warning fontSize="small" />;
    return <CheckCircle fontSize="small" />;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography
          variant="h4"
          className="section-title"
          sx={{ fontWeight: 600, color: '#1f2937' }}
        >
          Low Stock Alerts
        </Typography>
        <Tooltip title="Refresh Alerts">
          <IconButton 
            onClick={handleRefresh} 
            color="primary"
            sx={{ 
              backgroundColor: 'rgba(79, 70, 229, 0.1)',
              '&:hover': { backgroundColor: 'rgba(79, 70, 229, 0.2)' }
            }}
          >
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {loading ? (
          <Box sx={{ width: '100%', mt: 2 }}>
            <LinearProgress sx={{ height: 8, borderRadius: 4 }} />
          </Box>
        ) : lowStockProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Paper className="card-3d" sx={{ p: 3, mb: 3 }}>
              <Box className="alert-3d alert-3d-success" sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#065f46' }}>
                  Great Job!
                </Typography>
                <Typography variant="body1" sx={{ color: '#065f46' }}>
                  No products are currently low in stock
                </Typography>
              </Box>
            </Paper>
          </motion.div>
        ) : (
          <Grid container spacing={3}>
            {lowStockProducts.map((product, index) => (
              <Grid item xs={12} md={6} key={product.productId}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="card-3d" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Inventory sx={{ color: '#4f46e5', mr: 1 }} />
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {product.name}
                          </Typography>
                        </Box>
                        <Chip
                          icon={getStockLevelIcon(product.stockLevel, product.reorderLevel)}
                          label={`${product.stockLevel} units`}
                          color={getStockLevelColor(product.stockLevel, product.reorderLevel)}
                          variant="outlined"
                          size="small"
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {product.description || 'No description available'}
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            Stock Level
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {product.stockLevel} / {product.reorderLevel} units
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={calculateStockPercentage(product.stockLevel, product.reorderLevel)} 
                          color={getStockLevelColor(product.stockLevel, product.reorderLevel)}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <TrendingDown sx={{ color: '#ef4444', mr: 1, fontSize: '1rem' }} />
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            Reorder Level
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {product.reorderLevel} units
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocalShipping sx={{ color: '#4f46e5', mr: 1, fontSize: '1rem' }} />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          Category: {product.mainCategory}
                          {product.subCategory && ` > ${product.subCategory}`}
                        </Typography>
                      </Box>
                    </CardContent>
                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <Button 
                        variant="contained" 
                        color="primary"
                        startIcon={<TrendingUp />}
                        onClick={() => handleRequestStock(product.productId)}
                        sx={{ 
                          borderRadius: '8px',
                          textTransform: 'none',
                          fontWeight: 600,
                          boxShadow: '0px 4px 10px rgba(79, 70, 229, 0.3)',
                          '&:hover': {
                            boxShadow: '0px 6px 15px rgba(79, 70, 229, 0.4)',
                          }
                        }}
                      >
                        Request Stock
                      </Button>
                    </CardActions>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}
      </motion.div>

      {/* Inventory Alert Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Paper className="card-3d" sx={{ p: 3, mt: 4 }}>
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: 600, color: '#1f2937' }}
          >
            Inventory Alert Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1" sx={{ mb: 2 }}>
            Products shown here have stock levels below their configured reorder thresholds.
            Consider restocking these items soon to avoid stockouts.
          </Typography>
          <Box className="alert-3d" sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              To request more stock, click the "Request Stock" button on any product card to notify suppliers.
            </Typography>
          </Box>
        </Paper>
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

export default LowStockAlerts;
