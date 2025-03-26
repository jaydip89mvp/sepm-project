import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  ThemeProvider,
  createTheme,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Divider,
} from '@mui/material';
import {
  AccountCircle,
  ExitToApp,
  Person,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import EmployeeManagement from './sections/EmployeeManagement';
import CategoryManagement from './sections/CategoryManagement';
import OrderManagement from './sections/OrderManagement';
import PaymentManagement from './sections/PaymentManagement';
import ReportGeneration from './sections/ReportGeneration';
import Profile from '../Profile';

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

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState('employees');
  const [anchorEl, setAnchorEl] = useState(null);
  
  // Handle Profile Menu
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    setSelectedSection('profile');
    handleMenuClose();
  };

  const handleLogout = () => {
    // Add your logout logic here
    localStorage.removeItem('token'); // Remove auth token
    navigate('/login'); // Redirect to login page
  };

  const renderSection = () => {
    switch (selectedSection) {
      case 'profile':
        return <Profile />;
      case 'employees':
        return <EmployeeManagement />;
      case 'categories':
        return <CategoryManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'payments':
        return <PaymentManagement />;
      case 'reports':
        return <ReportGeneration />;
      default:
        return <EmployeeManagement />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="xl">
          {/* Header with Profile Menu */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ color: 'primary.main' }}>
              Manager Dashboard
            </Typography>
            
            <IconButton
              size="large"
              onClick={handleMenuOpen}
              color="primary"
              sx={{ ml: 2 }}
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
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleProfile}>
                <Person sx={{ mr: 2 }} /> Profile
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ExitToApp sx={{ mr: 2 }} /> Logout
              </MenuItem>
            </Menu>
          </Box>
          
          <Grid container spacing={3}>
            {/* Navigation Cards */}
            <Grid container item spacing={2} xs={12}>
              {['Employees', 'Categories', 'Orders', 'Payments', 'Reports'].map((section) => (
                <Grid item xs={12} sm={6} md={2.4} key={section}>
                  <Paper
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      cursor: 'pointer',
                      backgroundColor: selectedSection === section.toLowerCase() ? 'primary.main' : 'background.paper',
                      color: selectedSection === section.toLowerCase() ? 'white' : 'primary.main',
                      '&:hover': {
                        backgroundColor: 'primary.light',
                        color: 'white',
                      },
                    }}
                    onClick={() => setSelectedSection(section.toLowerCase())}
                  >
                    <Typography variant="h6">{section}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {/* Content Section */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, mt: 2 }}>
                {renderSection()}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default ManagerDashboard;