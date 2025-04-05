import React, { useState } from 'react';
import { Box, Container, Typography, useTheme } from '@mui/material';
import {
  FaBoxOpen,
  FaPlus,
  FaSync,
  FaHistory,
  FaExclamationTriangle,
  FaCloudUploadAlt,
  FaUserAlt
} from 'react-icons/fa';
import {
  Category as CategoryIcon,
  LocalShipping as SupplierIcon,
  SupervisorAccount as ManagerIcon,
  Assessment as ReportIcon,
  Logout as LogoutIcon,
  People as CustomerIcon
} from '@mui/icons-material';
// Import Dock component
import Dock from './Dock';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/reducer/auth'; // ✅ correct action

// Import all Dashboard components
import ProductsTable from '../ProductsTable';
import AddProduct from '../AddProduct';
import UpdateStock from '../UpdateStock';
import RequestStock from '../RequestStock';
import LowStockAlerts from '../LowStockAlerts';
import Profile from '../Profile';
import StockHistory from '../StockHistory';

const EmployeeDashboard = () => {
  const theme = useTheme();
  // State to manage active section
  const [activeSection, setActiveSection] = useState('inventory');
const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  // Define dock items with icons and handlers
  const dockItems = [
    { 
      icon: <FaBoxOpen size={24} />, 
      label: 'Inventory', 
      onClick: () => setActiveSection('inventory'),
      className: activeSection === 'inventory' ? 'active-dock-item' : ''
    },
    { 
      icon: <FaPlus size={22} />, 
      label: 'Add Product', 
      onClick: () => setActiveSection('add-product'),
      className: activeSection === 'add-product' ? 'active-dock-item' : ''
    },
    { 
      icon: <FaSync size={22} />, 
      label: 'Update Stock', 
      onClick: () => setActiveSection('update-stock'),
      className: activeSection === 'update-stock' ? 'active-dock-item' : ''
    },
    { 
      icon: <FaCloudUploadAlt size={24} />, 
      label: 'Request Stock', 
      onClick: () => setActiveSection('request-stock'),
      className: activeSection === 'request-stock' ? 'active-dock-item' : ''
    },
    { 
      icon: <FaExclamationTriangle size={22} />, 
      label: 'Low Stock', 
      onClick: () => setActiveSection('low-stock'),
      className: activeSection === 'low-stock' ? 'active-dock-item' : ''
    },
    { 
      icon: <FaHistory size={22} />, 
      label: 'History', 
      onClick: () => setActiveSection('stock-history'),
      className: activeSection === 'stock-history' ? 'active-dock-item' : ''
    },
    { icon: <LogoutIcon />, label: 'Logout', onClick: handleLogout, className: '' }
  ];

  // Render active component based on activeSection
  const renderActiveComponent = () => {
    switch (activeSection) {
      case 'inventory':
        return <ProductsTable />;
      case 'add-product':
        return <AddProduct />;
      case 'update-stock':
        return <UpdateStock />;
      case 'request-stock':
        return <RequestStock />;
      case 'low-stock':
        return <LowStockAlerts />;
      case 'stock-history':
        return <StockHistory />;
      default:
        return <ProductsTable />;
    }
  };

  return (
    <Box
  sx={{
    position: 'relative',
    pb: 10,
    backgroundColor: 'background.default', // Ensures a theme-compatible background
    overflow:'hidden'
  }}
>
  {/* Header Section with Gradient */}
  <Box
    sx={{
      background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', // Blue gradient
      py: 3, // Vertical padding for better spacing
      px: 4, // Horizontal padding
      textAlign: 'center', // Centers text
      borderRadius: '0 0 16px 16px', // Smooth bottom border radius
      boxShadow: 3, // Adds subtle shadow for depth
    }}
  >
    <Typography
      variant="h4"
      sx={{
        color: 'common.white', // Ensures white text for contrast
        fontWeight: 600, // Makes the title bold
        letterSpacing: 1, // Slight spacing for better readability
      }}
    >
      Employee Dashboard
    </Typography>
  </Box>

  <Container 
  maxWidth="xl" 
  sx={{ 
    mb: 10, 
    p: 4, 
    
    overflow: "hidden", // Prevents external scrolling
    display: "flex",
    flexDirection: "column",
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.02)', 
      boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
    }
  }}
>
  <Box 
    sx={{
      flex: 1, // Ensures it takes available space
      borderRadius: '12px',
      background: 'linear-gradient(135deg, #f3f4f6, #ffffff)',
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease-in-out',
      display: "flex",
      flexDirection: "column",
      overflow: "hidden", // No outer scrolling
    }}
  >
    <Box 
      sx={{
        flexGrow: 1,
        overflowY: "auto", // Only subcomponents scroll
       
        padding: 2,
      }}
    >
      {renderActiveComponent()}
    </Box>
  </Box>
</Container>


      
      {/* Dock navigation */}
      <Dock items={dockItems} />
    </Box>
  );
};

export default EmployeeDashboard;