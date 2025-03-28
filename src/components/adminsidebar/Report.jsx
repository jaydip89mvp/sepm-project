import React, { useState } from 'react';
import { Paper, Typography, Button, Box, CircularProgress } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import axios from 'axios';

const Report = () => {
  const [reportType, setReportType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const generateReport = async (type) => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.get(`http://localhost:8080/admin/generateReport?type=${type}`, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 200) {
        setReportType(type);
        setMessage(`Successfully generated ${type} report`);
      } else {
        setError('Failed to generate report');
      }
    } catch (error) {
      setError('Error generating report. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={4}
      sx={{
        p: 3,
        borderRadius: 2,
        maxWidth: 450,
        mx: 'auto',
        mt: 4,
        boxShadow: 3,
        textAlign: 'center',
      }}
    >
      <Typography variant="h5" fontWeight="bold" color="primary">
        Generate Report
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
        <Button
          variant={reportType === 'Monthly' ? 'contained' : 'outlined'}
          color="primary"
          startIcon={<CalendarMonthIcon />}
          onClick={() => generateReport('Monthly')}
          sx={{ textTransform: 'none', fontWeight: 'bold', px: 3 }}
          disabled={loading}
        >
          {loading && reportType === 'Monthly' ? <CircularProgress size={20} /> : 'Monthly'}
        </Button>
        <Button
          variant={reportType === 'Yearly' ? 'contained' : 'outlined'}
          color="secondary"
          startIcon={<BarChartIcon />}
          onClick={() => generateReport('Yearly')}
          sx={{ textTransform: 'none', fontWeight: 'bold', px: 3 }}
          disabled={loading}
        >
          {loading && reportType === 'Yearly' ? <CircularProgress size={20} /> : 'Yearly'}
        </Button>
      </Box>

      {message && (
        <Typography sx={{ mt: 3, fontWeight: 'medium', color: 'green' }}>
          {message}
        </Typography>
      )}
      {error && (
        <Typography sx={{ mt: 3, fontWeight: 'medium', color: 'red' }}>
          {error}
        </Typography>
      )}
    </Paper>
  );
};

export default Report;
