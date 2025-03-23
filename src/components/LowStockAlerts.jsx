import React from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
} from '@mui/material';
import { Warning } from '@mui/icons-material';

const LowStockAlerts = () => {
  // Mock data - replace with API call
  const lowStockItems = [
    { id: 1, name: 'Product 1', currentStock: 5, threshold: 10 },
    { id: 2, name: 'Product 2', currentStock: 3, threshold: 15 },
  ];

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Low Stock Alerts
      </Typography>
      <List>
        {lowStockItems.map((item) => (
          <ListItem key={item.id}>
            <ListItemIcon>
              <Warning color="warning" />
            </ListItemIcon>
            <ListItemText
              primary={item.name}
              secondary={`Current Stock: ${item.currentStock} (Threshold: ${item.threshold})`}
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
    </Paper>
  );
};

export default LowStockAlerts; // Make sure this line exists