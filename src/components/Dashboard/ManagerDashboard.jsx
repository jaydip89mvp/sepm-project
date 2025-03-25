import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import EmployeeManagement from './sections/EmployeeManagement';
import CategoryManagement from './sections/CategoryManagement';
import OrderManagement from './sections/OrderManagement';
import PaymentManagement from './sections/PaymentManagement';
import ReportGeneration from './sections/ReportGeneration';

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
  const [selectedSection, setSelectedSection] = useState('employees');

  const renderSection = () => {
    switch (selectedSection) {
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
          <Typography variant="h4" sx={{ mb: 4, color: 'primary.main' }}>
            Manager Dashboard
          </Typography>
          
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