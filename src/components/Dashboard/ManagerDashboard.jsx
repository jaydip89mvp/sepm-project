import React, { useState, lazy, Suspense } from 'react';
import {
  Box,
  Container,
  Typography,
  useTheme,
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
  People as EmployeeIcon,
  Category as CategoryIcon,
  ShoppingCart as OrderIcon,
  Payment as PaymentIcon,
  Assessment as ReportIcon,
  Logout as LogoutIcon,
  Person as ProfileIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { userNotExists } from '../../redux/reducer/auth';
import Dock from './Dock';

// Lazy load components
const EmployeeManagement = lazy(() => import('./sections/EmployeeManagement'));
const CategoryManagement = lazy(() => import('./sections/CategoryManagement'));
const OrderManagement = lazy(() => import('./sections/OrderManagement'));
const PaymentManagement = lazy(() => import('./sections/PaymentManagement'));
const ReportGeneration = lazy(() => import('./sections/ReportGeneration'));
const Profile = lazy(() => import('../Profile'));

const ManagerDashboard = () => {
  const theme = useTheme();
  const [selectedItem, setSelectedItem] = useState('employeeManagement');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    dispatch(userNotExists());
    navigate('/login');
  };

  const renderContent = () => {
    switch (selectedItem) {
      case 'employeeManagement':
        return <EmployeeManagement />;
      case 'categoryManagement':
        return <CategoryManagement />;
      case 'orderManagement':
        return <OrderManagement />;
      case 'paymentManagement':
        return <PaymentManagement />;
      case 'reportGeneration':
        return <ReportGeneration />;
      case 'profile':
        return <Profile />;
      default:
        return <Typography variant="h5">Page Not Found</Typography>;
    }
  };

  const dockItems = [
    { icon: <EmployeeIcon />, label: 'Employees', onClick: () => setSelectedItem('employeeManagement'), className: selectedItem === 'employeeManagement' ? 'active-dock-item' : '' },
    { icon: <CategoryIcon />, label: 'Categories', onClick: () => setSelectedItem('categoryManagement'), className: selectedItem === 'categoryManagement' ? 'active-dock-item' : '' },
    { icon: <OrderIcon />, label: 'Orders', onClick: () => setSelectedItem('orderManagement'), className: selectedItem === 'orderManagement' ? 'active-dock-item' : '' },
    { icon: <PaymentIcon />, label: 'Payments', onClick: () => setSelectedItem('paymentManagement'), className: selectedItem === 'paymentManagement' ? 'active-dock-item' : '' },
    { icon: <ReportIcon />, label: 'Reports', onClick: () => setSelectedItem('reportGeneration'), className: selectedItem === 'reportGeneration' ? 'active-dock-item' : '' },
    { icon: <ProfileIcon />, label: 'Profile', onClick: () => setSelectedItem('profile'), className: selectedItem === 'profile' ? 'active-dock-item' : '' },
    { icon: <LogoutIcon />, label: 'Logout', onClick: handleLogout, className: '' }
  ];

  return (
    <Box sx={{ position: 'relative', pb: 10, backgroundColor: 'background.default', overflow: 'hidden', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)', py: 3, px: 4, textAlign: 'center', borderRadius: '0 0 16px 16px', boxShadow: 3, mb: 4 }}>
        <Typography variant="h4" sx={{ color: 'common.white', fontWeight: 600, letterSpacing: 1 }}>
          Manager Dashboard
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
    </Box>
  );
};

export default ManagerDashboard;