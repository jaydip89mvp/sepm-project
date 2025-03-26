import React, { useState, useEffect } from 'react';
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
  Alert,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  CircularProgress,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Inventory,
  AddBox,
  Refresh,
  Warning,
  History,
  Send,
  Person,
  ExitToApp,
  AccountCircle,
} from '@mui/icons-material';
import Profile from '../Profile'; // Adjust the path if needed
import { useNavigate } from 'react-router-dom';

import AddProduct from '../AddProduct';
import UpdateStock from '../UpdateStock';
import LowStockAlerts from '../LowStockAlerts';
import StockHistory from '../StockHistory';
import RequestStock from '../RequestStock';
import ProductsTable from '../ProductsTable';

// Mock data to simulate backend responses
const mockProducts = [
  { productId: '1', name: 'Product 1', mainCategory: 'Electronics', quantity: 50, price: 299.99 },
  { productId: '2', name: 'Product 2', mainCategory: 'Furniture', quantity: 30, price: 199.99 },
];

const mockCategories = ['Electronics', 'Furniture', 'Clothing', 'Books'];

const EmployeeDashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState('dashboard');
  const [products, setProducts] = useState(mockProducts);
  const [categories, setCategories] = useState(mockCategories);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simulate API calls with loading state
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      // In real implementation, this would be an API call
      setProducts(mockProducts);
      setError(null);
    } catch (err) {
      setError('Failed to load products');
      console.error('Error fetching products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      // In real implementation, this would be an API call
      setCategories(mockCategories);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories');
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleAddProduct = (newProduct) => {
    setProducts([...products, { ...newProduct, productId: Date.now().toString() }]);
    setNotification({ type: 'success', message: 'Product added successfully!' });
  };

  const handleUpdateProduct = (updatedProduct) => {
    setProducts(products.map(p => 
      p.productId === updatedProduct.productId ? updatedProduct : p
    ));
    setNotification({ type: 'success', message: 'Product updated successfully!' });
  };

  const handleDeleteProduct = (productId) => {
    setProducts(products.filter(p => p.productId !== productId));
    setNotification({ type: 'success', message: 'Product deleted successfully!' });
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setLogoutDialogOpen(true);
    handleMenuClose();
  };

  const confirmLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    setLogoutDialogOpen(false);
  };

  const menuItems = [
    { id: 'dashboard', text: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'profile', text: 'Profile', icon: <Person /> },
    { id: 'products', text: 'View & Manage Products', icon: <Inventory /> },
    { id: 'addProduct', text: 'Add New Product', icon: <AddBox /> },
    { id: 'updateStock', text: 'Update Stock', icon: <Refresh /> },
    { id: 'lowStock', text: 'Low Stock Alerts', icon: <Warning /> },
    { id: 'stockHistory', text: 'Stock History', icon: <History /> },
    { id: 'requestStock', text: 'Request Stock Refill', icon: <Send /> },
  ];

  const renderContent = () => {
    if (isLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      );
    }

    switch (selectedMenu) {
      case 'profile':
        return <Profile />;
      case 'dashboard':
        return <DashboardContent 
          products={products}
          onDelete={handleDeleteProduct}
          onEdit={handleUpdateProduct}
        />;
      case 'products':
        return <ProductsTable 
          products={products} 
          onDelete={handleDeleteProduct} 
          onEdit={handleUpdateProduct}
        />;
      case 'addProduct':
        return <AddProduct 
          onAdd={handleAddProduct} 
          categories={categories}
          setNotification={setNotification}
        />;
      case 'updateStock':
        return <UpdateStock 
          products={products} 
          onUpdate={handleUpdateProduct}
          setNotification={setNotification}
        />;
      case 'lowStock':
        return <LowStockAlerts products={products} threshold={10} />;
      case 'stockHistory':
        return <StockHistory />;
      case 'requestStock':
        return <RequestStock 
          products={products}
          setNotification={setNotification}
        />;
      default:
        return <DashboardContent products={products} />;
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
            backgroundColor: '#f8f9fa',
            borderRight: '1px solid #e0e0e0',
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
      <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#fff' }}>
        <Container maxWidth="lg" sx={{ mt: 8 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <IconButton
              size="large"
              onClick={handleMenuOpen}
              color="primary"
            >
              <AccountCircle />
            </IconButton>
            
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={() => {
                setSelectedMenu('profile');
                handleMenuClose();
              }}>
                <Person sx={{ mr: 2 }} /> Profile
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ExitToApp sx={{ mr: 2 }} /> Logout
              </MenuItem>
            </Menu>
          </Box>
          {notification && (
            <Alert 
              severity={notification.type} 
              onClose={() => setNotification(null)}
              sx={{ mb: 2 }}
            >
              {notification.message}
            </Alert>
          )}
          {renderContent()}
        </Container>
      </Box>
      <Dialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
      >
        <DialogTitle>Are you sure you want to logout?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setLogoutDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={confirmLogout}
            color="primary"
            variant="contained"
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Dashboard Content Component
const DashboardContent = ({ products, onDelete, onEdit }) => {
  if (!products) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {/* Left Side */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ 
          p: 2, 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0' 
        }}>
          <Typography variant="h6" gutterBottom color="primary">
            Products Overview
          </Typography>
          <ProductsTable 
            products={products} 
            onDelete={onDelete}
            onEdit={onEdit}
          />
        </Paper>
      </Grid>

      {/* Right Side */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ 
          p: 2, 
          mb: 2, 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0' 
        }}>
          <Typography variant="h6" gutterBottom color="primary">
            Stock Management
          </Typography>
          <LowStockAlerts products={products} />
        </Paper>
        <Paper sx={{ 
          p: 2,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0'
        }}>
          <Typography variant="h6" gutterBottom color="primary">
            Recent Activities
          </Typography>
          <StockHistory limit={5} />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default EmployeeDashboard;