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
  ButtonGroup
} from '@mui/material';
import {
  History as HistoryIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import axios from 'axios';

const StockHistory3D = ({ limit }) => {
  const [stockHistory, setStockHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStockHistory();
  }, []);

  const fetchStockHistory = async () => {
    try {
      const response = await axios.get('http://localhost:8080/stockHistory');
      setStockHistory(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch stock history');
      setLoading(false);
    }
  };

  const getFilteredHistory = () => {
    let filtered = stockHistory;

    if (searchTerm) {
      filtered = filtered.filter(record =>
        record.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.updatedBy.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    const now = new Date();
    if (activeFilter === 'recent') {
      const oneWeekAgo = new Date(now);
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      filtered = filtered.filter(record => new Date(record.date) >= oneWeekAgo);
    } else if (activeFilter === 'week') {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
      startOfWeek.setHours(0, 0, 0, 0);
      filtered = filtered.filter(record => new Date(record.date) >= startOfWeek);
    } else if (activeFilter === 'month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      filtered = filtered.filter(record => new Date(record.date) >= startOfMonth);
    }

    filtered = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (limit) filtered = filtered.slice(0, limit);
    return filtered;
  };

  const filteredHistory = getFilteredHistory();

  return (
    <Box>
      <Typography variant="h5" className="section-title">Stock Refill History</Typography>

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
            <Button onClick={() => setActiveFilter('all')} variant={activeFilter === 'all' ? 'contained' : 'outlined'} startIcon={<FilterListIcon />}>All</Button>
            <Button onClick={() => setActiveFilter('recent')} variant={activeFilter === 'recent' ? 'contained' : 'outlined'}>Last 7 Days</Button>
            <Button onClick={() => setActiveFilter('week')} variant={activeFilter === 'week' ? 'contained' : 'outlined'}>This Week</Button>
            <Button onClick={() => setActiveFilter('month')} variant={activeFilter === 'month' ? 'contained' : 'outlined'}>This Month</Button>
          </ButtonGroup>
        </Box>
      )}

      {loading ? (
        <Box className="loading-container"><CircularProgress /></Box>
      ) : error ? (
        <Typography color="error" sx={{ p: 2 }}>{error}</Typography>
      ) : filteredHistory.length === 0 ? (
        <Box className="empty-state-message">
          <HistoryIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
          <Typography variant="h6" color="text.secondary">No history records found</Typography>
          {searchTerm && <Typography variant="body2" color="text.disabled">Try a different search term or filter</Typography>}
        </Box>
      ) : (
        <Box className="table-3d-wrapper">
          <TableContainer component={Paper} elevation={0}>
            <Table className="table-3d" size="medium">
              <TableHead>
                <TableRow>
                  <TableCell className="table-header-cell">Date</TableCell>
                  <TableCell className="table-header-cell">Product</TableCell>
                  <TableCell className="table-header-cell">Category</TableCell>
                  <TableCell className="table-header-cell" align="right">Quantity</TableCell>
                  <TableCell className="table-header-cell">Supplier</TableCell>
                  <TableCell className="table-header-cell">Updated By</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredHistory.map(record => {
                  const recordDate = new Date(record.date);
                  const now = new Date();
                  const isRecent = now - recordDate < 7 * 24 * 60 * 60 * 1000;
                  return (
                    <TableRow key={record.id} className="table-row-3d">
                      <TableCell className="table-cell">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CalendarIcon sx={{ color: 'text.disabled', mr: 1, fontSize: 16 }} />
                          <Typography variant="body2">{format(recordDate, 'MMM dd, yyyy')}</Typography>
                          {isRecent && <Chip label="Recent" size="small" sx={{ ml: 1, height: 20, fontSize: '0.625rem', bgcolor: 'primary.main', color: 'white' }} />}
                        </Box>
                      </TableCell>
                      <TableCell className="table-cell"><Typography variant="body2">{record.productName}</Typography></TableCell>
                      <TableCell className="table-cell">
                        <Chip label={record.category} size="small" sx={{ fontSize: '0.75rem', bgcolor: 'rgba(25, 118, 210, 0.08)', color: 'primary.main' }} />
                      </TableCell>
                      <TableCell className="table-cell" align="right">
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{record.quantityOrdered} units</Typography>
                      </TableCell>
                      <TableCell className="table-cell"><Typography variant="body2">{record.supplierName}</Typography></TableCell>
                      <TableCell className="table-cell"><Typography variant="body2">{record.updatedBy}</Typography></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {!limit && (
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Typography variant="body2" color="text.secondary">Showing {filteredHistory.length} records</Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default StockHistory3D;