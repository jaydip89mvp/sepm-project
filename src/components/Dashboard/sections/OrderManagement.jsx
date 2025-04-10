import React, { useState, useEffect } from 'react';
import managerService from '../../../services/managerService';
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
    Grid
} from '@mui/material';
import { Add, Edit } from '@mui/icons-material';

const OrderManagement = () => {
    const [tabValue, setTabValue] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [orderType, setOrderType] = useState('');
    const [supplierOrders, setSupplierOrders] = useState([]);
    const [customerOrders, setCustomerOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [formData, setFormData] = useState({
        customerId: '',
        supplierId: '',
        products: [{ productId: '', quantity: 0, price: 0 }],
        status: 'PENDING',
        totalAmount: 0
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const [supplierResponse, customerResponse] = await Promise.all([
                managerService.getSupplierOrders(),
                managerService.getCustomerOrders()
            ]);
            setSupplierOrders(supplierResponse.data);
            setCustomerOrders(customerResponse.data);
        } catch (error) {
            showSnackbar(error.response?.data?.message || 'Error fetching orders', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleOpenDialog = (type, order = null) => {
        setOrderType(type);
        if (order) {
            setSelectedOrder(order);
            setFormData(order);
        } else {
            setSelectedOrder(null);
            setFormData({
                customerId: '',
                supplierId: '',
                products: [{ productId: '', quantity: 0, price: 0 }],
                status: 'PENDING',
                totalAmount: 0
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedOrder(null);
        setFormData({
            customerId: '',
            supplierId: '',
            products: [{ productId: '', quantity: 0, price: 0 }],
            status: 'PENDING',
            totalAmount: 0
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleProductChange = (index, field, value) => {
        const updatedProducts = [...formData.products];
        updatedProducts[index] = {
            ...updatedProducts[index],
            [field]: value
        };
        
        // Calculate total amount
        const totalAmount = updatedProducts.reduce((sum, product) => 
            sum + (product.quantity * product.price), 0
        );

        setFormData(prev => ({
            ...prev,
            products: updatedProducts,
            totalAmount
        }));
    };

    const addProductField = () => {
        setFormData(prev => ({
            ...prev,
            products: [...prev.products, { productId: '', quantity: 0, price: 0 }]
        }));
    };

    const removeProductField = (index) => {
        if (formData.products.length > 1) {
            const updatedProducts = formData.products.filter((_, i) => i !== index);
            setFormData(prev => ({
                ...prev,
                products: updatedProducts
            }));
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            if (selectedOrder) {
                if (orderType === 'supplier') {
                    await managerService.updateSupplierOrderStatus(selectedOrder.id, formData.status);
                } else {
                    await managerService.updateCustomerOrderStatus(selectedOrder.id, formData.status);
                }
                showSnackbar('Order status updated successfully', 'success');
            } else {
                if (orderType === 'supplier') {
                    await managerService.addSupplierOrder(formData);
                } else {
                    await managerService.addCustomerOrder(formData);
                }
                showSnackbar('Order created successfully', 'success');
            }
            handleCloseDialog();
            fetchOrders();
        } catch (error) {
            showSnackbar(error.response?.data?.message || 'Error processing order', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({
            open: true,
            message,
            severity
        });
    };

    const renderOrderTable = (orders, type) => (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Order ID</TableCell>
                        <TableCell>{type === 'supplier' ? 'Supplier ID' : 'Customer ID'}</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Total Amount</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order.id}>
                            <TableCell>{order.id}</TableCell>
                            <TableCell>{type === 'supplier' ? order.supplierId : order.customerId}</TableCell>
                            <TableCell>{order.status}</TableCell>
                            <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                            <TableCell>
                                <IconButton 
                                    onClick={() => handleOpenDialog(type, order)}
                                    disabled={isLoading}
                                >
                                    <Edit />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5" color="primary">Order Management</Typography>
            </Box>

            <Paper sx={{ width: '100%', mb: 2 }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                >
                    <Tab label="Supplier Orders" />
                    <Tab label="Customer Orders" />
                </Tabs>

                <Box sx={{ p: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                        onClick={() => handleOpenDialog(tabValue === 0 ? 'supplier' : 'customer')}
                        sx={{ mb: 2 }}
                    >
                        New {tabValue === 0 ? 'Supplier' : 'Customer'} Order
                    </Button>

                    {tabValue === 0 ? 
                        renderOrderTable(supplierOrders, 'supplier') : 
                        renderOrderTable(customerOrders, 'customer')}
                </Box>
            </Paper>

            <Dialog 
                open={openDialog} 
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    {selectedOrder ? 'Update Order Status' : `New ${orderType === 'supplier' ? 'Supplier' : 'Customer'} Order`}
                </DialogTitle>
                <DialogContent>
                    {!selectedOrder ? (
                        <>
                            <TextField
                                margin="normal"
                                name={orderType === 'supplier' ? 'supplierId' : 'customerId'}
                                label={orderType === 'supplier' ? 'Supplier ID' : 'Customer ID'}
                                fullWidth
                                value={orderType === 'supplier' ? formData.supplierId : formData.customerId}
                                onChange={handleInputChange}
                                required
                            />
                            {formData.products.map((product, index) => (
                                <Grid container spacing={2} key={index} sx={{ mt: 1 }}>
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            fullWidth
                                            label="Product ID"
                                            value={product.productId}
                                            onChange={(e) => handleProductChange(index, 'productId', e.target.value)}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField
                                            fullWidth
                                            label="Quantity"
                                            type="number"
                                            value={product.quantity}
                                            onChange={(e) => handleProductChange(index, 'quantity', parseInt(e.target.value))}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField
                                            fullWidth
                                            label="Price"
                                            type="number"
                                            value={product.price}
                                            onChange={(e) => handleProductChange(index, 'price', parseFloat(e.target.value))}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        <Button 
                                            onClick={() => removeProductField(index)}
                                            disabled={formData.products.length === 1}
                                            fullWidth
                                            variant="outlined"
                                            color="error"
                                        >
                                            Remove
                                        </Button>
                                    </Grid>
                                </Grid>
                            ))}
                            <Button
                                onClick={addProductField}
                                variant="outlined"
                                sx={{ mt: 2 }}
                            >
                                Add Product
                            </Button>
                            <Typography variant="h6" sx={{ mt: 2 }}>
                                Total Amount: ${formData.totalAmount.toFixed(2)}
                            </Typography>
                        </>
                    ) : (
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                label="Status"
                            >
                                <MenuItem value="PENDING">Pending</MenuItem>
                                <MenuItem value="PROCESSING">Processing</MenuItem>
                                <MenuItem value="COMPLETED">Completed</MenuItem>
                                <MenuItem value="CANCELLED">Cancelled</MenuItem>
                            </Select>
                        </FormControl>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary" disabled={isLoading}>
                        {selectedOrder ? 'Update Status' : 'Create Order'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert 
                    onClose={() => setSnackbar({ ...snackbar, open: false })} 
                    severity={snackbar.severity}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default OrderManagement;