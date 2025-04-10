import React, { useState, lazy, Suspense } from 'react';
import { Box, Typography, Container, useTheme, Dialog, DialogTitle, DialogActions, Button, CircularProgress } from '@mui/material';
import {
  Category as CategoryIcon,
  LocalShipping as SupplierIcon,
  SupervisorAccount as ManagerIcon,
  Assessment as ReportIcon,
  Logout as LogoutIcon,
  People as CustomerIcon
} from '@mui/icons-material';

import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/reducer/auth';
import { authService } from '../../services/authService';
import Dock from './Dock';

// Lazy load components
const Categorymanagement = lazy(() => import('../adminsidebar/Categorymanagement'));
const Suppliermanagement = lazy(() => import('../adminsidebar/Suppliermanagement'));
const Customermanagement = lazy(() => import('../adminsidebar/Customermanagement'));
const Managermanagement = lazy(() => import('../adminsidebar/Managermanagement'));
const Report = lazy(() => import('../adminsidebar/Report'));

const AdminDashboard = () => {
  const theme = useTheme();
  const [selectedItem, setSelectedItem] = useState('categoryManagement');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      setError('Failed to logout. Please try again.');
    } finally {
      setIsLoading(false);
      setLogoutDialogOpen(false);
    }
  };

  const renderContent = () => {
    switch (selectedItem) {
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
      default:
        return <Typography variant="h5">Page Not Found</Typography>;
    }
  };

  const dockItems = [
    { icon: <CategoryIcon />, label: 'Categories', onClick: () => setSelectedItem('categoryManagement'), className: selectedItem === 'categoryManagement' ? 'active-dock-item' : '' },
    { icon: <SupplierIcon />, label: 'Suppliers', onClick: () => setSelectedItem('supplierManagement'), className: selectedItem === 'supplierManagement' ? 'active-dock-item' : '' },
    { icon: <ManagerIcon />, label: 'Managers', onClick: () => setSelectedItem('managerManagement'), className: selectedItem === 'managerManagement' ? 'active-dock-item' : '' },
    { icon: <CustomerIcon />, label: 'Customers', onClick: () => setSelectedItem('customerManagement'), className: selectedItem === 'customerManagement' ? 'active-dock-item' : '' },
    { icon: <ReportIcon />, label: 'Reports', onClick: () => setSelectedItem('report'), className: selectedItem === 'report' ? 'active-dock-item' : '' },
    { icon: <LogoutIcon />, label: 'Logout', onClick: () => setLogoutDialogOpen(true), className: '' }
  ];

  return (
    <Box sx={{ position: 'relative', pb: 10, backgroundColor: 'background.default', overflow: 'hidden', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)', py: 3, px: 4, textAlign: 'center', borderRadius: '0 0 16px 16px', boxShadow: 3, mb: 4 }}>
        <Typography variant="h4" sx={{ color: 'common.white', fontWeight: 600, letterSpacing: 1 }}>
          Admin Dashboard
        </Typography>
      </Box>

      {/* Main content */}
      <Container maxWidth="xl" sx={{ mb: 10, p: 4, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <Box sx={{ flex: 1, borderRadius: '12px', background: 'linear-gradient(135deg, #f3f4f6, #ffffff)', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', transition: 'all 0.3s ease-in-out', display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <Box sx={{ flexGrow: 1, overflowY: "auto", padding: 3 }}>
            <Suspense fallback={<Typography>Loading...</Typography>}>
              {renderContent()}
            </Suspense>
          </Box>
        </Box>
      </Container>

      {/* Dock */}
      <Dock items={dockItems} />

      {/* Logout Dialog */}
      <Dialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
      >
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogActions>
          <Button onClick={() => setLogoutDialogOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleLogout} color="primary" disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} /> : 'Logout'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;
