import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
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
  People,
  BarChart,
  Settings,
  Inventory,
  Delete,
  AddBox,
  Assignment,
  Group,
  AccountCircle,
  ExitToApp,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import AddCategory from '../adminsidebar/AddCategory';
import AddCustomer from '../adminsidebar/AddCustomer';
import AddManager from '../adminsidebar/AddManager';
import AddSupplier from '../adminsidebar/AddSupplier';
import DeleteCustomer from '../adminsidebar/DeleteCustomer';
import DeleteManager from '../adminsidebar/DeleteManager';
import DeleteSupplier from '../adminsidebar/DeleteSupplier';
import Report from '../adminsidebar/Report';
import ShowCustomers from '../adminsidebar/ShowCustomers';
import ShowManager from '../adminsidebar/ShowManager';
import ShowSupplier from '../adminsidebar/ShowSupplier';
import UpdateRole from '../adminsidebar/UpdateRole';

const AdminDashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState('dashboard');
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

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
    localStorage.removeItem('userData');
    navigate('/login');
    setLogoutDialogOpen(false);
  };

  const menuItems = [
    { id: 'dashboard', text: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'addCategory', text: 'Add New Category', icon: <AddBox /> },
    { id: 'addCustomer', text: 'Add Customer', icon: <People /> },
    { id: 'addManager', text: 'Add Manager', icon: <Group /> },
    { id: 'addSupplier', text: 'Add Supplier', icon: <Inventory /> },
    { id: 'deleteCustomer', text: 'Delete Customer', icon: <Delete /> },
    { id: 'deleteManager', text: 'Delete Manager', icon: <Delete /> },
    { id: 'deleteSupplier', text: 'Delete Supplier', icon: <Delete /> },
    { id: 'report', text: 'Generate Report', icon: <Assignment /> },
    { id: 'showCustomers', text: 'Show Customers', icon: <People /> },
    { id: 'showManager', text: 'Show Managers', icon: <Group /> },
    { id: 'showSupplier', text: 'Show Supplier', icon: <Inventory /> },
    { id: 'updateRole', text: 'Update Role', icon: <Settings /> },
  ];

  const renderContent = () => {
    switch (selectedMenu) {
      case 'dashboard':
        return <DashboardContent />;
      case 'addCategory':
        return <AddCategory />;
      case 'addCustomer':
        return <AddCustomer />;
      case 'addManager':
        return <AddManager />;
      case 'addSupplier':
        return <AddSupplier />;
      case 'deleteCustomer':
        return <DeleteCustomer />;
      case 'deleteManager':
        return <DeleteManager />;
      case 'deleteSupplier':
        return <DeleteSupplier />;
      case 'report':
        return <Report />;
      case 'showCustomers':
        return <ShowCustomers />;
      case 'showManager':
        return <ShowManager />;
      case 'showSupplier':
        return <ShowSupplier />;
      case 'updateRole':
        return <UpdateRole />;
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

const DashboardContent = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Total Users
          </Typography>
          <Typography variant="h4">1,250</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Active Managers
          </Typography>
          <Typography variant="h4">85</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Pending Approvals
          </Typography>
          <Typography variant="h4">23</Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default AdminDashboard;
