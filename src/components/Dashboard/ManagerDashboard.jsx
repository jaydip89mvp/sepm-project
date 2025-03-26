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
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  CircularProgress,
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

const sections = [
  { id: 'employees', label: 'Employees', component: EmployeeManagement },
  { id: 'categories', label: 'Categories', component: CategoryManagement },
  { id: 'orders', label: 'Orders', component: OrderManagement },
  { id: 'payments', label: 'Payments', component: PaymentManagement },
  { id: 'reports', label: 'Reports', component: ReportGeneration },
];

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState('employees');
  const [anchorEl, setAnchorEl] = useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
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
    setLogoutDialogOpen(true);
    handleMenuClose();
  };

  const confirmLogout = async () => {
    try {
      setIsLoading(true);
      // Add your logout API call here if needed
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setLogoutDialogOpen(false);
      navigate('/login');
    } catch (error) {
      setError('Failed to logout. Please try again.');
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderSection = () => {
    try {
      if (selectedSection === 'profile') {
        return <Profile />;
      }

      const section = sections.find(s => s.id === selectedSection);
      if (!section) {
        return <EmployeeManagement />;
      }

      const Component = section.component;
      return <Component />;
    } catch (error) {
      console.error('Error rendering section:', error);
      return (
        <Typography color="error">
          An error occurred while loading this section. Please try again.
        </Typography>
      );
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

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
          
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <Grid container spacing={3}>
            {/* Navigation Cards */}
            <Grid container item spacing={2} xs={12}>
              {sections.map(({ id, label }) => (
                <Grid item xs={12} sm={6} md={2.4} key={id}>
                  <Paper
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      cursor: 'pointer',
                      backgroundColor: selectedSection === id ? 'primary.main' : 'background.paper',
                      color: selectedSection === id ? 'white' : 'primary.main',
                      '&:hover': {
                        backgroundColor: 'primary.light',
                        color: 'white',
                      },
                    }}
                    onClick={() => setSelectedSection(id)}
                  >
                    <Typography variant="h6">{label}</Typography>
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

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
      >
        <DialogTitle>Are you sure you want to logout?</DialogTitle>
        <DialogActions>
          <Button 
            onClick={() => setLogoutDialogOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmLogout}
            color="primary"
            variant="contained"
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Logout'}
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default ManagerDashboard;