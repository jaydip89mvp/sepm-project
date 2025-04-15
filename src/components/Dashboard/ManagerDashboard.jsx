import React, { useState, lazy, Suspense } from 'react';
import { Box, Typography, Container, useTheme, Dialog, DialogTitle, DialogActions, Button, CircularProgress } from '@mui/material';
import {
    People as EmployeeIcon,
    ShoppingCart as OrderIcon,
    Payment as PaymentIcon,
    Category as CategoryIcon,
    Assessment as ReportIcon,
    Logout as LogoutIcon,
    ShoppingCart as ShoppingCartIcon
} from '@mui/icons-material';

import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/reducer/auth';
import { authService } from '../../services/authService';
import Dock from './Dock';
import SupplierOrderManagement from './sections/SupplierOrderManagement';

// Lazy load section components
const EmployeeManagement = lazy(() => import('./sections/EmployeeManagement'));
const OrderManagement = lazy(() => import('./sections/OrderManagement'));
const PaymentManagement = lazy(() => import('./sections/PaymentManagement'));
const CategoryManagement = lazy(() => import('./sections/CategoryManagement'));
const ReportGeneration = lazy(() => import('./sections/ReportGeneration'));

const ManagerDashboard = () => {
    const theme = useTheme();
    const [selectedItem, setSelectedItem] = useState('employeeManagement');
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
            case 'employeeManagement':
                return <EmployeeManagement />;
            case 'orderManagement':
                return <OrderManagement />;
            case 'supplierOrderManagement':
                return <SupplierOrderManagement />;
            case 'paymentManagement':
                return <PaymentManagement />;
            case 'categoryManagement':
                return <CategoryManagement />;
            case 'reportGeneration':
                return <ReportGeneration />;
            default:
                return <Typography variant="h5">Page Not Found</Typography>;
        }
    };

    const dockItems = [
        { 
            icon: <EmployeeIcon />, 
            label: 'Employees', 
            onClick: () => setSelectedItem('employeeManagement'), 
            className: selectedItem === 'employeeManagement' ? 'active-dock-item' : '' 
        },
        { 
            icon: <OrderIcon />, 
            label: 'Orders', 
            onClick: () => setSelectedItem('orderManagement'), 
            className: selectedItem === 'orderManagement' ? 'active-dock-item' : '' 
        },
        { 
            icon: <ShoppingCartIcon />,
            label: 'Supplier Orders',
            onClick: () => setSelectedItem('supplierOrderManagement'),
            className: selectedItem === 'supplierOrderManagement' ? 'active-dock-item' : ''
        },
        { 
            icon: <PaymentIcon />, 
            label: 'Payments', 
            onClick: () => setSelectedItem('paymentManagement'), 
            className: selectedItem === 'paymentManagement' ? 'active-dock-item' : '' 
        },
        { 
            icon: <CategoryIcon />, 
            label: 'Categories', 
            onClick: () => setSelectedItem('categoryManagement'), 
            className: selectedItem === 'categoryManagement' ? 'active-dock-item' : '' 
        },
        { 
            icon: <ReportIcon />, 
            label: 'Reports', 
            onClick: () => setSelectedItem('reportGeneration'), 
            className: selectedItem === 'reportGeneration' ? 'active-dock-item' : '' 
        },
        { 
            icon: <LogoutIcon />, 
            label: 'Logout', 
            onClick: () => setLogoutDialogOpen(true), 
            className: '' 
        }
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
                        <Suspense fallback={<CircularProgress />}>
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

export default ManagerDashboard;