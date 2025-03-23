import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Container,
  Paper,
  Grid,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Inventory,
  AddBox,
  Refresh,
  Warning,
  History,
  Send,
} from '@mui/icons-material';

import AddProduct from '../AddProduct';
import UpdateStock from '../UpdateStock';
import LowStockAlerts from '../LowStockAlerts';
import StockHistory from '../StockHistory';
import RequestStock from '../RequestStock';
import ProductsTable from '../ProductsTable';

const EmployeeDashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', text: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'products', text: 'View & Manage Products', icon: <Inventory /> },
    { id: 'addProduct', text: 'Add New Product', icon: <AddBox /> },
    { id: 'updateStock', text: 'Update Stock', icon: <Refresh /> },
    { id: 'lowStock', text: 'Low Stock Alerts', icon: <Warning /> },
    { id: 'stockHistory', text: 'Stock History', icon: <History /> },
    { id: 'requestStock', text: 'Request Stock Refill', icon: <Send /> },
  ];

  const renderContent = () => {
    switch (selectedMenu) {
      case 'dashboard':
        return <DashboardContent />;
      case 'products':
        return <ProductsTable />;
      case 'addProduct':
        return <AddProduct />;
      case 'updateStock':
        return <UpdateStock />;
      case 'lowStock':
        return <LowStockAlerts />;
      case 'stockHistory':
        return <StockHistory />;
      case 'requestStock':
        return <RequestStock />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ overflow: 'auto', mt: 8 }}>
          <List>
            {menuItems.map((item) => (
              <ListItemButton
                key={item.id}
                selected={selectedMenu === item.id}
                onClick={() => setSelectedMenu(item.id)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Container maxWidth="lg" sx={{ mt: 8 }}>
          {renderContent()}
        </Container>
      </Box>
    </Box>
  );
};

// Dashboard Content Component
const DashboardContent = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Dashboard Overview
        </Typography>
      </Grid>
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 2 }}>
          <ProductsTable />
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography>Stock Management</Typography>
        </Paper>
        <Paper sx={{ p: 2 }}>
          <Typography>Notifications</Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default EmployeeDashboard;