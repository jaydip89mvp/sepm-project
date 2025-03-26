import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid2,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import {
  Dashboard,
  AddBox,
  People,
  Inventory,
  Assignment,
  Group,
  AccountCircle,
} from '@mui/icons-material';

// Import only the available components
import Categorymanagement from '../adminsidebar/Categorymanagement';
import Customermanagement from '../adminsidebar/Customermanagement';
import Suppliermanagement from '../adminsidebar/Suppliermanagement';
import Managermanagement from '../adminsidebar/Managermanagement';
import Report from '../adminsidebar/Report';

// Theme for styling
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Blue
      light: '#42a5f5',
      dark: '#1565c0',
    },
    background: {
      default: '#ffffff',
      paper: '#f8f9fa',
    },
  },
});

const AdminDashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', text: 'Dashboard', icon: <Dashboard fontSize="large" /> },
    { id: 'categoryManagement', text: 'Category Management', icon: <AddBox fontSize="large" /> },
    { id: 'customerManagement', text: 'Customer Management', icon: <People fontSize="large" /> },
    { id: 'managerManagement', text: 'Manager Management', icon: <Group fontSize="large" /> },
    { id: 'supplierManagement', text: 'Supplier Management', icon: <Inventory fontSize="large" /> },
    { id: 'report', text: 'Generate Report', icon: <Assignment fontSize="large" /> },
    { id: 'profile', text: 'Profile', icon: <AccountCircle fontSize="large" /> },
  ];

  const renderContent = () => {
    switch (selectedMenu) {
      case 'dashboard':
        return <DashboardContent />;
      case 'categoryManagement':
        return <Categorymanagement />;
      case 'customerManagement':
        return <Customermanagement />;
      case 'managerManagement':
        return <Managermanagement />;
      case 'supplierManagement':
        return <Suppliermanagement />;
      case 'report':
        return <Report />;
      case 'profile':
        return <Typography variant="h5">Profile Section</Typography>;
      default:
        return <Typography variant="h5">Page Not Found</Typography>;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
        {/* Main Content */}
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Container maxWidth="xl">
            <Typography variant="h4" sx={{ mb: 4, color: 'primary.main', textAlign: 'center' }}>
              Admin Dashboard
            </Typography>

            {/* Navigation Cards */}
            <Grid2 container spacing={2} justifyContent="center">
              {menuItems.map((item) => (
                <Grid2 item xs={12} sm={6} md={3} key={item.id}>
                  <Paper
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: '120px', // Ensures uniform height
                      backgroundColor: selectedMenu === item.id ? 'primary.main' : 'background.paper',
                      color: selectedMenu === item.id ? 'white' : 'primary.main',
                      '&:hover': {
                        backgroundColor: 'primary.light',
                        color: 'white',
                      },
                    }}
                    onClick={() => setSelectedMenu(item.id)}
                  >
                    {item.icon}
                    <Typography variant="h6">{item.text}</Typography>
                  </Paper>
                </Grid2>
              ))}
            </Grid2>

            {/* Content Section */}
            <Paper sx={{ p: 3, mt: 2 }}>{renderContent()}</Paper>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

const DashboardContent = () => {
  return (
    <Grid2 container spacing={3} justifyContent="center">
      {[
        { title: 'Total Users', value: '1,250' },
        { title: 'Active Managers', value: '85' },
        { title: 'Pending Approvals', value: '23' },
        { title: 'Total Suppliers', value: '120' },
        { title: 'Total Reports Generated', value: '50' },
      ].map((item, index) => (
        <Grid2 item xs={12} sm={6} md={3} key={index}>
          <Paper sx={{ p: 3, textAlign: 'center', minHeight: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="h6">{item.title}</Typography>
            <Typography variant="h4">{item.value}</Typography>
          </Paper>
        </Grid2>
      ))}
    </Grid2>
  );
};

export default AdminDashboard;
