import React, { useState } from 'react';
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
  Grid2,
  Card,
  CardContent,
  CardHeader,
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
} from '@mui/icons-material';
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
          {renderContent()}
        </Container>
      </Box>
    </Box>
  );
};

const DashboardContent = () => {
  return (
    <Grid2 container spacing={3}>
      <Grid2 item xs={12} md={4}>
        <Card>
          <CardHeader title="Total Users" />
          <CardContent>
            <Typography variant="h4">1,250</Typography>
          </CardContent>
        </Card>
      </Grid2>
      <Grid2 item xs={12} md={4}>
        <Card>
          <CardHeader title="Active Managers" />
          <CardContent>
            <Typography variant="h4">85</Typography>
          </CardContent>
        </Card>
      </Grid2>
      <Grid2 item xs={12} md={4}>
        <Card>
          <CardHeader title="Pending Approvals" />
          <CardContent>
            <Typography variant="h4">23</Typography>
          </CardContent>
        </Card>
      </Grid2>
    </Grid2>
  );
};

export default AdminDashboard;
