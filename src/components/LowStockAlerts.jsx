import React from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  CircularProgress,
} from '@mui/material';
import { Warning } from '@mui/icons-material';

const LowStockAlerts = ({ products = [], threshold = 10 }) => {
  // Handle loading state when products is undefined
  if (!Array.isArray(products)) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress />
      </Paper>
    );
  }

  const lowStockItems = products.filter(product => 
    product?.quantity < threshold
  );

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Low Stock Alerts
      </Typography>
      {lowStockItems.length === 0 ? (
        <Typography color="success.main" sx={{ p: 2 }}>
          No products are currently low in stock
        </Typography>
      ) : (
        <List>
          {lowStockItems.map((item) => (
            <ListItem key={item.id}>
              <ListItemIcon>
                <Warning color="warning" />
              </ListItemIcon>
              <ListItemText
                primary={item.name}
                secondary={`Current Stock: ${item.quantity} (Threshold: ${threshold})`}
              />
              <Chip
                label="Low Stock"
                color="warning"
                size="small"
                sx={{ ml: 2 }}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default LowStockAlerts;