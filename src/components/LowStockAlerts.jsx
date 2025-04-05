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
} from '@mui/material';
import { Warning } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const LowStockAlerts = () => {
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLowStockProducts();
  }, []);

  // Fetch low-stock products from the backend
  const fetchLowStockProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/products/low-stock'); // Adjust API endpoint
      setLowStockProducts(response.data);
    } catch (error) {
      console.error('Error fetching low-stock products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography
        variant="h4"
        className="section-title"
        sx={{ mb: 4, fontWeight: 600, color: '#1f2937', textAlign: 'center' }}
      >
        Low Stock Alerts
      </Typography>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Paper className="card-3d" sx={{ p: 3, mb: 3 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : lowStockProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Box className="alert-3d alert-3d-success" sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#065f46' }}>
                  Great Job!
                </Typography>
                <Typography variant="body1" sx={{ color: '#065f46' }}>
                  No products are currently low in stock
                </Typography>
              </Box>
            </motion.div>
          ) : (
            <List sx={{ width: '100%' }}>
              <AnimatePresence>
                {lowStockProducts.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="list-item-3d"
                    style={{ marginBottom: '0.75rem' }}
                  >
                    <ListItem alignItems="flex-start" sx={{ p: 0 }}>
                      <ListItemIcon sx={{ color: '#f59e0b', minWidth: '40px' }}>
                        <Warning fontSize="medium" />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                            {item.name}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Current Stock: <span style={{ fontWeight: 600, color: '#b91c1c' }}>{item.quantity}</span>
                              {item.threshold && (
                                <span style={{ marginLeft: '8px' }}>
                                  (Threshold: {item.threshold})
                                </span>
                              )}
                            </Typography>
                          </Box>
                        }
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Chip
                          label="Low Stock"
                          className="badge-3d badge-3d-warning"
                          sx={{ fontWeight: 600, ml: 2 }}
                        />
                      </Box>
                    </ListItem>
                  </motion.div>
                ))}
              </AnimatePresence>
            </List>
          )}
        </Paper>
      </motion.div>

      {/* Inventory Alert Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Paper className="card-3d" sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: 600, color: '#1f2937' }}
          >
            Inventory Alert Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1" sx={{ mb: 2 }}>
            Products shown here have stock levels below their configured thresholds.
            Consider restocking these items soon to avoid stockouts.
          </Typography>
          <Box className="alert-3d" sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              To request more stock, please use the "Request Stock" feature
              in the dashboard to notify suppliers.
            </Typography>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default LowStockAlerts;
