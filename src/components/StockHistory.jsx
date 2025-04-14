import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  TextField,
  InputAdornment,
  Button,
  ButtonGroup,
  Pagination,
  Stack,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  History as HistoryIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  CalendarToday as CalendarIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Print as PrintIcon
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import employeeService from '../services/employeeService';

const StockHistory = ({ limit }) => {
  const [stockHistory, setStockHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    fetchStockHistory();
  }, []);

  const fetchStockHistory = async () => {
    setLoading(true);
    try {
      const response = await employeeService.getStockHistory();
      if (response.success) {
        setStockHistory(response.data);
        setTotalRecords(response.data.length);
        setError('');
      } else {
        setError(response.message || 'Failed to fetch stock history');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchStockHistory();
  };

  const getFilteredHistory = () => {
    let filtered = stockHistory;

    if (searchTerm) {
      filtered = filtered.filter(record =>
        record.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.subcategory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.addedBy?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    const now = new Date();
    if (activeFilter === 'recent') {
      const oneWeekAgo = new Date(now);
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      filtered = filtered.filter(record => new Date(record.timestamp) >= oneWeekAgo);
    } else if (activeFilter === 'week') {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
      startOfWeek.setHours(0, 0, 0, 0);
      filtered = filtered.filter(record => new Date(record.timestamp) >= startOfWeek);
    } else if (activeFilter === 'month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      filtered = filtered.filter(record => new Date(record.timestamp) >= startOfMonth);
    }

    filtered = filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    if (limit) {
      filtered = filtered.slice(0, limit);
    } else {
      // Apply pagination
      const startIndex = (page - 1) * rowsPerPage;
      filtered = filtered.slice(startIndex, startIndex + rowsPerPage);
    }
    
    return filtered;
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleExportCSV = () => {
    const filteredData = getFilteredHistory();
    const csvContent = [
      ['Date', 'Product', 'Category', 'Subcategory', 'Quantity', 'Priority', 'Status', 'Added By'],
      ...filteredData.map(record => [
        format(new Date(record.timestamp), 'MM/dd/yyyy'),
        record.productName || '',
        record.category || '',
        record.subcategory || '',
        record.quantity || 0,
        record.priority || '',
        record.status || '',
        record.addedBy?.name || ''
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `stock_history_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING': return 'warning';
      case 'APPROVED': return 'success';
      case 'REJECTED': return 'error';
      case 'COMPLETED': return 'info';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toUpperCase()) {
      case 'LOW': return 'info';
      case 'NORMAL': return 'success';
      case 'HIGH': return 'warning';
      case 'URGENT': return 'error';
      default: return 'default';
    }
  };

  const filteredHistory = getFilteredHistory();
  const totalPages = Math.ceil(totalRecords / rowsPerPage);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" className="section-title">
          <HistoryIcon sx={{ mr: 1, verticalAlign: 'text-bottom' }} />
          Stock Refill History
        </Typography>
        
        <Box>
          <Tooltip title="Refresh">
            <IconButton onClick={handleRefresh} sx={{ mr: 1 }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export CSV">
            <IconButton onClick={handleExportCSV} sx={{ mr: 1 }}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Print">
            <IconButton onClick={handlePrint}>
              <PrintIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {!limit && (
        <Box className="search-container" sx={{ mb: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <TextField
            fullWidth
            placeholder="Search records..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
            sx={{ flex: 1 }}
          />
          <ButtonGroup variant="outlined" sx={{ height: '56px' }}>
            <Button 
              onClick={() => setActiveFilter('all')} 
              variant={activeFilter === 'all' ? 'contained' : 'outlined'} 
              startIcon={<FilterListIcon />}
            >
              All
            </Button>
            <Button 
              onClick={() => setActiveFilter('recent')} 
              variant={activeFilter === 'recent' ? 'contained' : 'outlined'}
            >
              Last 7 Days
            </Button>
            <Button 
              onClick={() => setActiveFilter('week')} 
              variant={activeFilter === 'week' ? 'contained' : 'outlined'}
            >
              This Week
            </Button>
            <Button 
              onClick={() => setActiveFilter('month')} 
              variant={activeFilter === 'month' ? 'contained' : 'outlined'}
            >
              This Month
            </Button>
          </ButtonGroup>
        </Box>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : filteredHistory.length === 0 ? (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          p: 5,
          backgroundColor: 'background.paper',
          borderRadius: 2,
          boxShadow: 1
        }}>
          <HistoryIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No history records found
          </Typography>
          {searchTerm && (
            <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
              Try a different search term or filter
            </Typography>
          )}
        </Box>
      ) : (
        <Box>
          <TableContainer component={Paper} sx={{ mb: 2, boxShadow: 3 }}>
            <Table size="medium">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Added By</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredHistory.map(record => {
                  const recordDate = new Date(record.timestamp);
                  const now = new Date();
                  const isRecent = now - recordDate < 7 * 24 * 60 * 60 * 1000;
                  
                  return (
                    <TableRow key={record.refillId} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CalendarIcon sx={{ color: 'text.disabled', mr: 1, fontSize: 16 }} />
                          <Typography variant="body2">
                            {format(recordDate, 'MMM dd, yyyy')}
                          </Typography>
                          {isRecent && (
                            <Chip 
                              label="Recent" 
                              size="small" 
                              sx={{ 
                                ml: 1, 
                                height: 20, 
                                fontSize: '0.625rem', 
                                bgcolor: 'primary.main', 
                                color: 'white' 
                              }} 
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {record.productName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="body2">
                            {record.category}
                          </Typography>
                          {record.subcategory && (
                            <Chip 
                              label={record.subcategory} 
                              size="small" 
                              sx={{ 
                                mt: 0.5, 
                                fontSize: '0.75rem', 
                                bgcolor: 'rgba(25, 118, 210, 0.08)', 
                                color: 'primary.main' 
                              }} 
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {record.quantity} units
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={record.priority || 'NORMAL'} 
                          size="small" 
                          color={getPriorityColor(record.priority)}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={record.status || 'PENDING'} 
                          size="small" 
                          color={getStatusColor(record.status)}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {record.addedBy?.name || 'Unknown'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {!limit && totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Stack spacing={2}>
                <Pagination 
                  count={totalPages} 
                  page={page} 
                  onChange={handlePageChange} 
                  color="primary" 
                />
              </Stack>
            </Box>
          )}

          {!limit && (
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Typography variant="body2" color="text.secondary">
                Showing {filteredHistory.length} of {totalRecords} records
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default StockHistory;