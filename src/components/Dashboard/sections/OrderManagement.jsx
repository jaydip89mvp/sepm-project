import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Tabs,
    Tab,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    Alert,
    Snackbar,
    Grid,
    CircularProgress,
    Card,
    CardContent,
    Divider,
    Avatar
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { Chip } from '@mui/material';
import managerService from '../../../services/managerService';
import { motion } from 'framer-motion';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderType, setOrderType] = useState('supplier');
    const [formData, setFormData] = useState({
        supplierId: '',
        customerId: '',
        totalAmount: '',
        profitOnProducts: '',
        status: 'PENDING',
        products: [{ productId: '', quantity: '', priceAtOrder: '', costAtOrder: '' }],
        orderType: 'Supplier'
    });
    const [isLoading, setIsLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        fetchOrders();
        if (orderType === 'supplier') {
            fetchSuppliers();
        } else {
            fetchCustomers();
        }
    }, [orderType]);

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            let response;
            if (orderType === 'supplier') {
                response = await managerService.getSupplierOrders();
                showSnackbar('Order listing functionality is not available yet. You can still add new orders.', 'info');
            } else {
                response = await managerService.getCustomerOrders();
                showSnackbar('Order listing functionality is not available yet. You can still add new orders.', 'info');
            }
            setOrders(response.data || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
            showSnackbar('Error fetching orders. You can still add new orders.', 'error');
            setOrders([]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchSuppliers = async () => {
        // Since managers don't have access to admin endpoints, we'll use manual ID entry
        setSuppliers([]);
        showSnackbar('Please enter supplier ID manually', 'info');
    };

    const fetchCustomers = async () => {
        // Since managers don't have access to admin endpoints, we'll use manual ID entry
        setCustomers([]);
        showSnackbar('Please enter customer ID manually', 'info');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if ((orderType === 'supplier' ? !formData.supplierId : !formData.customerId) || formData.products.length === 0) {
            showSnackbar('Please fill in all required fields', 'error');
            return;
        }

        // Validate all products have required fields
        const invalidProduct = formData.products.find(product => 
            !product.productId || 
            !product.quantity || 
            !product.priceAtOrder || 
            !product.costAtOrder
        );

        if (invalidProduct) {
            showSnackbar('Please fill in all product details', 'error');
            return;
        }

        setIsLoading(true);
        try {
            if (orderType === 'supplier') {
                const orderData = {
                    supplierId: formData.supplierId,
                    products: formData.products.map(product => ({
                        productId: product.productId,
                        quantity: parseInt(product.quantity),
                        priceAtOrder: parseFloat(product.priceAtOrder),
                        costAtOrder: parseFloat(product.costAtOrder)
                    })),
                    totalAmount: parseFloat(formData.totalAmount)
                };
                await managerService.addSupplierOrder(orderData);
                showSnackbar('Supplier order added successfully', 'success');
            } else {
                const orderData = {
                    customerId: formData.customerId,
                    products: formData.products.map(product => ({
                        productId: product.productId,
                        quantity: parseInt(product.quantity),
                        priceAtOrder: parseFloat(product.priceAtOrder),
                        costAtOrder: parseFloat(product.costAtOrder)
                    })),
                    totalAmount: parseFloat(formData.totalAmount),
                    profitOnProducts: parseFloat(formData.profitOnProducts)
                };
                await managerService.addCustomerOrder(orderData);
                showSnackbar('Customer order added successfully', 'success');
            }
            setOpen(false);
            resetForm();
            fetchOrders();
        } catch (error) {
            console.error('Error processing order:', error);
            showSnackbar(error.response?.data || 'Error processing order', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (order) => {
        setSelectedOrder(order);
        setFormData({
            ...formData,
            supplierId: order.supplierId,
            customerId: order.customerId,
            totalAmount: order.totalAmount,
            status: order.status,
            orderType: order.orderType
        });
        setEditMode(true);
        setOpen(true);
    };

    const handleStatusUpdate = async (order, newStatus) => {
        if (!window.confirm(`Are you sure you want to update the order status to ${newStatus}?`)) {
            return;
        }

        setIsLoading(true);
        try {
            if (orderType === 'supplier') {
                await managerService.updateSupplierOrderStatus(order.orderId, newStatus);
            } else {
                await managerService.updateCustomerOrderStatus(order.orderId, newStatus);
            }
            showSnackbar('Order status updated successfully', 'success');
            fetchOrders();
        } catch (error) {
            console.error('Error updating order status:', error);
            const errorMessage = error.response?.data || 'Error updating order status';
            showSnackbar(errorMessage, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            supplierId: '',
            customerId: '',
            totalAmount: '',
            profitOnProducts: '',
            status: 'PENDING',
            products: [{ productId: '', quantity: '', priceAtOrder: '', costAtOrder: '' }],
            orderType: 'Supplier'
        });
        setEditMode(false);
        setSelectedOrder(null);
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({
            open: true,
            message,
            severity
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING':
                return 'warning';
            case 'COMPLETED':
                return 'success';
            case 'CANCELLED':
                return 'error';
            default:
                return 'info';
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this order?')) {
            return;
        }

        setIsLoading(true);
        try {
            if (orderType === 'supplier') {
                await managerService.deleteSupplierOrder(id);
            } else {
                await managerService.deleteCustomerOrder(id);
            }
            showSnackbar('Order deleted successfully', 'success');
            fetchOrders();
        } catch (error) {
            console.error('Error deleting order:', error);
            showSnackbar(error.response?.data?.message || 'Error deleting order', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleProductChange = (index, field, value) => {
        const newProducts = [...formData.products];
        newProducts[index] = {
            ...newProducts[index],
            [field]: value
        };
        
        // Calculate total amount and profit whenever quantity, price, or cost changes
        if (field === 'quantity' || field === 'priceAtOrder' || field === 'costAtOrder') {
            const total = newProducts.reduce((sum, product) => {
                const quantity = parseInt(product.quantity || 0);
                const price = parseFloat(product.priceAtOrder || 0);
                return sum + (quantity * price);
            }, 0);

            const totalCost = newProducts.reduce((sum, product) => {
                const quantity = parseInt(product.quantity || 0);
                const cost = parseFloat(product.costAtOrder || 0);
                return sum + (quantity * cost);
            }, 0);

            const profit = total - totalCost;
            
            setFormData({ 
                ...formData, 
                products: newProducts,
                totalAmount: total.toFixed(2),
                profitOnProducts: profit.toFixed(2)
            });
        } else {
            setFormData({ ...formData, products: newProducts });
        }
    };

    const addProduct = () => {
        setFormData({
            ...formData,
            products: [...formData.products, { 
                productId: '', 
                quantity: '', 
                priceAtOrder: '', 
                costAtOrder: '' 
            }]
        });
    };

    const removeProduct = (index) => {
        const newProducts = formData.products.filter((_, i) => i !== index);
        const total = newProducts.reduce((sum, product) => {
            const quantity = parseInt(product.quantity || 0);
            const price = parseFloat(product.priceAtOrder || 0);
            return sum + (quantity * price);
        }, 0);
        
        setFormData({ 
            ...formData, 
            products: newProducts,
            totalAmount: total.toFixed(2)
        });
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleReset = () => {
        resetForm();
    };

    const handleCloseSnackbar = () => {
        setSnackbar({
            ...snackbar,
            open: false
        });
    };

    return (
        <Box className="card-3d-soft" sx={{ p: 4, borderRadius: 3, backgroundColor: 'white' }}>
            <Box 
                className="section-title" 
                sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2, 
                    mb: 4 
                }}
            >
                <Add 
                    sx={{ 
                        fontSize: 32, 
                        color: 'primary.main',
                        backgroundColor: 'primary.light',
                        p: 1,
                        borderRadius: '50%',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }} 
                />
                <Typography 
                    variant="h4" 
                    className="section-title"
                    sx={{ 
                        fontWeight: 'bold',
                        background: 'linear-gradient(45deg, #4338ca 30%, #6366f1 90%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}
                >
                    Order Management
                </Typography>
            </Box>

            <Tabs 
                value={activeTab} 
                onChange={handleTabChange} 
                sx={{ 
                    mb: 3,
                    '& .MuiTabs-indicator': {
                        background: 'linear-gradient(45deg, #4338ca 30%, #6366f1 90%)',
                    },
                    '& .MuiTab-root': {
                        textTransform: 'none',
                        fontWeight: 'bold',
                        '&.Mui-selected': {
                            color: '#4338ca',
                        },
                    },
                }}
            >
                <Tab label="Add New Order" />
                <Tab label="View/Update Order" />
            </Tabs>

            {activeTab === 0 && (
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Card className="card-3d" sx={{ borderRadius: 3 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ 
                                    background: 'linear-gradient(45deg, #4338ca 30%, #6366f1 90%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    fontWeight: 'bold'
                                }}>
                                    Add New Order
                                </Typography>
                                <Box component="form" onSubmit={handleSubmit}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <FormControl fullWidth>
                                                <InputLabel>Order Type</InputLabel>
                                                <Select
                                                    name="orderType"
                                                    value={formData.orderType}
                                                    onChange={handleChange}
                                                    label="Order Type"
                                                    required
                                                    className="input-3d"
                                                    sx={{ 
                                                        borderRadius: 2,
                                                        '&.Mui-focused fieldset': {
                                                            borderColor: '#6366f1',
                                                            borderWidth: 2
                                                        }
                                                    }}
                                                >
                                                    <MenuItem value="Supplier">Supplier Order</MenuItem>
                                                    <MenuItem value="Customer">Customer Order</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <TextField
                                                label="Order ID"
                                                name="orderId"
                                                value={formData.orderId}
                                                onChange={handleChange}
                                                required
                                                fullWidth
                                                className="input-3d"
                                                sx={{ 
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2,
                                                        '&.Mui-focused fieldset': {
                                                            borderColor: '#6366f1',
                                                            borderWidth: 2
                                                        }
                                                    }
                                                }}
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <TextField
                                                label="Amount"
                                                name="amount"
                                                type="number"
                                                value={formData.amount}
                                                onChange={handleChange}
                                                required
                                                fullWidth
                                                className="input-3d"
                                                InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                                                sx={{ 
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2,
                                                        '&.Mui-focused fieldset': {
                                                            borderColor: '#6366f1',
                                                            borderWidth: 2
                                                        }
                                                    }
                                                }}
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <FormControl fullWidth>
                                                <InputLabel>Status</InputLabel>
                                                <Select
                                                    name="status"
                                                    value={formData.status}
                                                    onChange={handleChange}
                                                    label="Status"
                                                    required
                                                    className="input-3d"
                                                    sx={{ 
                                                        borderRadius: 2,
                                                        '&.Mui-focused fieldset': {
                                                            borderColor: '#6366f1',
                                                            borderWidth: 2
                                                        }
                                                    }}
                                                >
                                                    <MenuItem value="PENDING">Pending</MenuItem>
                                                    <MenuItem value="COMPLETED">Completed</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Box sx={{ display: 'flex', gap: 2 }}>
                                                <motion.div
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    <Button
                                                        type="submit"
                                                        variant="contained"
                                                        color="primary"
                                                        disabled={isLoading}
                                                        fullWidth
                                                        className="btn-3d btn-3d-primary"
                                                        sx={{ 
                                                            background: 'linear-gradient(45deg, #4338ca 30%, #6366f1 90%)',
                                                            boxShadow: '0 6px 12px rgba(99, 102, 241, 0.3)',
                                                            borderRadius: 2,
                                                            textTransform: 'none',
                                                            fontWeight: 'bold',
                                                            py: 1.2,
                                                            px: 3
                                                        }}
                                                    >
                                                        {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Add Order'}
                                                    </Button>
                                                </motion.div>
                                                <Button
                                                    variant="outlined"
                                                    onClick={handleReset}
                                                    disabled={isLoading}
                                                    className="btn-3d"
                                                    sx={{ 
                                                        borderRadius: 2,
                                                        textTransform: 'none',
                                                        borderColor: 'rgba(99, 102, 241, 0.5)',
                                                        color: '#6366f1',
                                                        '&:hover': {
                                                            borderColor: '#6366f1',
                                                            backgroundColor: 'rgba(99, 102, 241, 0.05)'
                                                        }
                                                    }}
                                                >
                                                    Reset
                                                </Button>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {activeTab === 1 && (
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Card className="card-3d" sx={{ borderRadius: 3 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ 
                                    background: 'linear-gradient(45deg, #4338ca 30%, #6366f1 90%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    fontWeight: 'bold'
                                }}>
                                    View/Update Order
                                </Typography>
                                <Box sx={{ mb: 3 }}>
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <TextField
                                            label="Order ID"
                                            value={formData.orderId}
                                            onChange={handleChange}
                                            fullWidth
                                            className="input-3d"
                                            sx={{ 
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: '#6366f1',
                                                        borderWidth: 2
                                                    }
                                                }
                                            }}
                                        />
                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Button
                                                variant="contained"
                                                onClick={() => {
                                                    setActiveTab(0);
                                                    handleEdit(selectedOrder);
                                                }}
                                                disabled={isLoading}
                                                className="btn-3d btn-3d-primary"
                                                sx={{ 
                                                    background: 'linear-gradient(45deg, #4338ca 30%, #6366f1 90%)',
                                                    boxShadow: '0 6px 12px rgba(99, 102, 241, 0.3)',
                                                    borderRadius: 2,
                                                    textTransform: 'none',
                                                    fontWeight: 'bold',
                                                    py: 1.2,
                                                    px: 3
                                                }}
                                            >
                                                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Get Order'}
                                            </Button>
                                        </motion.div>
                                    </Box>
                                </Box>

                                {selectedOrder && (
                                    <>
                                        <Box component="form" onSubmit={handleSubmit}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <FormControl fullWidth>
                                                        <InputLabel>Order Type</InputLabel>
                                                        <Select
                                                            name="orderType"
                                                            value={formData.orderType}
                                                            onChange={handleChange}
                                                            label="Order Type"
                                                            required
                                                            className="input-3d"
                                                            sx={{ 
                                                                borderRadius: 2,
                                                                '&.Mui-focused fieldset': {
                                                                    borderColor: '#6366f1',
                                                                    borderWidth: 2
                                                                }
                                                            }}
                                                        >
                                                            <MenuItem value="Supplier">Supplier Order</MenuItem>
                                                            <MenuItem value="Customer">Customer Order</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>

                                                <Grid item xs={12}>
                                                    <TextField
                                                        label="Amount"
                                                        name="amount"
                                                        type="number"
                                                        value={formData.amount}
                                                        onChange={handleChange}
                                                        required
                                                        fullWidth
                                                        className="input-3d"
                                                        InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                                                        sx={{ 
                                                            '& .MuiOutlinedInput-root': {
                                                                borderRadius: 2,
                                                                '&.Mui-focused fieldset': {
                                                                    borderColor: '#6366f1',
                                                                    borderWidth: 2
                                                                }
                                                            }
                                                        }}
                                                    />
                                                </Grid>

                                                <Grid item xs={12}>
                                                    <FormControl fullWidth>
                                                        <InputLabel>Status</InputLabel>
                                                        <Select
                                                            name="status"
                                                            value={formData.status}
                                                            onChange={handleChange}
                                                            label="Status"
                                                            required
                                                            className="input-3d"
                                                            sx={{ 
                                                                borderRadius: 2,
                                                                '&.Mui-focused fieldset': {
                                                                    borderColor: '#6366f1',
                                                                    borderWidth: 2
                                                                }
                                                            }}
                                                        >
                                                            <MenuItem value="PENDING">Pending</MenuItem>
                                                            <MenuItem value="COMPLETED">Completed</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>

                                                <Grid item xs={12}>
                                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                                        <motion.div
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                        >
                                                            <Button
                                                                type="submit"
                                                                variant="contained"
                                                                color="primary"
                                                                disabled={isLoading}
                                                                fullWidth
                                                                className="btn-3d btn-3d-primary"
                                                                sx={{ 
                                                                    background: 'linear-gradient(45deg, #4338ca 30%, #6366f1 90%)',
                                                                    boxShadow: '0 6px 12px rgba(99, 102, 241, 0.3)',
                                                                    borderRadius: 2,
                                                                    textTransform: 'none',
                                                                    fontWeight: 'bold',
                                                                    py: 1.2,
                                                                    px: 3
                                                                }}
                                                            >
                                                                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Update Order'}
                                                            </Button>
                                                        </motion.div>
                                                        <Button
                                                            variant="outlined"
                                                            onClick={handleReset}
                                                            disabled={isLoading}
                                                            className="btn-3d"
                                                            sx={{ 
                                                                borderRadius: 2,
                                                                textTransform: 'none',
                                                                borderColor: 'rgba(99, 102, 241, 0.5)',
                                                                color: '#6366f1',
                                                                '&:hover': {
                                                                    borderColor: '#6366f1',
                                                                    backgroundColor: 'rgba(99, 102, 241, 0.05)'
                                                                }
                                                            }}
                                                        >
                                                            Reset
                                                        </Button>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </Box>

                                        <Divider sx={{ my: 3 }} />

                                        <Typography variant="h6" gutterBottom sx={{ 
                                            background: 'linear-gradient(45deg, #4338ca 30%, #6366f1 90%)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            fontWeight: 'bold'
                                        }}>
                                            Order Details
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                    <Avatar 
                                                        sx={{ 
                                                            backgroundColor: 'primary.light',
                                                            color: 'primary.main',
                                                            fontWeight: 'bold',
                                                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                                                        }}
                                                    >
                                                        {selectedOrder.orderType?.substring(0, 1)}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                            Order ID: {selectedOrder.orderId}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {selectedOrder.orderType} Order
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    Amount
                                                </Typography>
                                                <Typography variant="body1">
                                                    ${selectedOrder.amount?.toFixed(2)}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    Status
                                                </Typography>
                                                <Typography 
                                                    variant="body1"
                                                    sx={{
                                                        color: selectedOrder.status === 'COMPLETED' ? 'success.main' : 'warning.main',
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    {selectedOrder.status}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    Order Date
                                                </Typography>
                                                <Typography variant="body1">
                                                    {new Date(selectedOrder.orderDate).toLocaleString()}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default OrderManagement;