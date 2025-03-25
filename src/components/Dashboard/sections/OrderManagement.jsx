import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  MenuItem,
} from '@mui/material';
import { Add } from '@mui/icons-material';

const OrderManagement = () => {
  const [tabValue, setTabValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [supplierOrders, setSupplierOrders] = useState([
    { id: '1', status: 'Pending' },
    { id: '2', status: 'Delivered' }
  ]);
  const [customerOrders, setCustomerOrders] = useState([
    { id: '1', customer: 'John Doe', status: 'Processing' },
    { id: '2', customer: 'Jane Smith', status: 'Delivered' }
  ]);
  const [orderForm, setOrderForm] = useState({
    id: '',
    status: '',
    items: [],
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleUpdateStatus = (orderId, status, isSupplier) => {
    if (isSupplier) {
      setSupplierOrders(supplierOrders.map(order => 
        order.id === orderId ? { ...order, status } : order
      ));
    } else {
      setCustomerOrders(customerOrders.map(order => 
        order.id === orderId ? { ...order, status } : order
      ));
    }
  };

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Supplier Orders" />
          <Tab label="Customer Orders" />
        </Tabs>
      </Box>

      {tabValue === 0 ? (
        <Box>
          <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
            Supplier Orders
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {supplierOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>
                      <Button 
                        onClick={() => handleUpdateStatus(order.id, 'Delivered', true)}
                        variant="outlined"
                        size="small"
                      >
                        Update Status
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ) : (
        <Box>
          <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
            Customer Orders
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {customerOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>
                      <Button 
                        onClick={() => handleUpdateStatus(order.id, 'Delivered', false)}
                        variant="outlined"
                        size="small"
                      >
                        Update Status
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
};

export default OrderManagement;