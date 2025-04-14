import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Typography, 
  Button, 
  Box, 
  CircularProgress, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Snackbar,
  Alert,
  Grid,
  Card,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import adminService from '../../services/adminService';

const Report = () => {
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [months, setMonths] = useState([]);
  const [years, setYears] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // Months are 0-based
    const currentYear = today.getFullYear();
    const last12Months = [];

    for (let i = 0; i < 12; i++) {
      let date = new Date();
      date.setMonth(currentMonth - i - 1);
      last12Months.push({
        label: date.toLocaleString('default', { month: 'long' }),
        value: String(date.getMonth() + 1).padStart(2, '0')
      });
    }
    setMonths(last12Months);
    
    const yearOptions = [];
    for (let y = currentYear; y >= currentYear - 10; y--) {
      yearOptions.push(y);
    }
    setYears(yearOptions);
  }, []);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const generateReport = async () => {
    if (!month || !year) {
      showSnackbar('Please select both month and year.', 'error');
      return;
    }
    setLoading(true);
    setError('');
    setMessage('');
    setReportData(null);

    try {
      const response = await adminService.generateReport(month, year);

      if (response.success) {
        setReportData(response.data);
        showSnackbar(`Successfully generated report for ${months.find(m => m.value === month).label} ${year}`);
      } else {
        setError(response.message || 'Failed to generate report');
        showSnackbar(response.message || 'Failed to generate report', 'error');
      }
    } catch (error) {
      setError('Error generating report. Try again.');
      showSnackbar('Error generating report. Try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Box sx={{ p: 3 }}>
    <Paper
      elevation={4}
      sx={{
        p: 3,
        borderRadius: 2,
          maxWidth: 800,
        mx: 'auto',
        mt: 4,
        boxShadow: 3,
      }}
    >
        <Typography variant="h5" fontWeight="bold" color="primary" align="center" gutterBottom>
          Generate Admin Report
      </Typography>

      <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Month</InputLabel>
          <Select value={month} onChange={(e) => setMonth(e.target.value)}>
            {months.map((m) => (
              <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Year</InputLabel>
          <Select value={year} onChange={(e) => setYear(e.target.value)}>
            {years.map((y) => (
              <MenuItem key={y} value={y}>{y}</MenuItem>
            ))}
          </Select>
        </FormControl>
            </Grid>
          </Grid>
          
        <Button
          variant="contained"
          color="primary"
          startIcon={<CalendarMonthIcon />}
          onClick={generateReport}
            sx={{ textTransform: 'none', fontWeight: 'bold', px: 3, mt: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} /> : 'Generate Report'}
        </Button>
      </Box>

        {reportData && (
          <Box sx={{ mt: 4 }}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Report Summary
            </Typography>
            
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={2}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">
                      Total Orders
                    </Typography>
                    <Typography variant="h5">
                      {reportData.ordersTotal || 0}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={2}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">
                      Total Payments
                    </Typography>
                    <Typography variant="h5">
                      {formatCurrency(reportData.paymentsTotal || 0)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={2}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">
                      Customer Orders
                    </Typography>
                    <Typography variant="h5">
                      {reportData.ordersCustomer || 0}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={2}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">
                      Supplier Orders
                    </Typography>
                    <Typography variant="h5">
                      {reportData.ordersSupplier || 0}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                New Customers ({reportData.newCustomers?.length || 0})
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Customer Name</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reportData.newCustomers && reportData.newCustomers.length > 0 ? (
                      reportData.newCustomers.map((customer, index) => (
                        <TableRow key={index}>
                          <TableCell>{customer}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell>No new customers</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                New Suppliers ({reportData.newSuppliers?.length || 0})
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Supplier Name</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reportData.newSuppliers && reportData.newSuppliers.length > 0 ? (
                      reportData.newSuppliers.map((supplier, index) => (
                        <TableRow key={index}>
                          <TableCell>{supplier}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell>No new suppliers</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Customer Payments
        </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Customer</TableCell>
                      <TableCell align="right">Orders</TableCell>
                      <TableCell align="right">Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reportData.customerPaymentsMap && Object.entries(reportData.customerPaymentsMap).length > 0 ? (
                      Object.entries(reportData.customerPaymentsMap).map(([customer, data], index) => (
                        <TableRow key={index}>
                          <TableCell>{customer}</TableCell>
                          <TableCell align="right">{data.second.first}</TableCell>
                          <TableCell align="right">{formatCurrency(data.second.second)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3}>No customer payments data</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Supplier Payments
        </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Supplier</TableCell>
                      <TableCell align="right">Orders</TableCell>
                      <TableCell align="right">Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reportData.supplierPaymentsMap && Object.entries(reportData.supplierPaymentsMap).length > 0 ? (
                      Object.entries(reportData.supplierPaymentsMap).map(([supplier, data], index) => (
                        <TableRow key={index}>
                          <TableCell>{supplier}</TableCell>
                          <TableCell align="right">{data.second.first}</TableCell>
                          <TableCell align="right">{formatCurrency(data.second.second)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3}>No supplier payments data</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
      )}
    </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Report;
