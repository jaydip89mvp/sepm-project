import React, { useState, useEffect } from 'react';
import { Paper, Typography, Button, Box, CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import axios from 'axios';

const Report = () => {
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [months, setMonths] = useState([]);
  const [years, setYears] = useState([]);

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

  const generateReport = async () => {
    if (!month || !year) {
      setError('Please select both month and year.');
      return;
    }
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.get(`http://localhost:8080/admin/generateReport?month=${month}&year=${year}`, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 200) {
        setMessage(`Successfully generated report for ${months.find(m => m.value === month).label} ${year}`);
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

      <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormControl fullWidth>
          <InputLabel>Month</InputLabel>
          <Select value={month} onChange={(e) => setMonth(e.target.value)}>
            {months.map((m) => (
              <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Year</InputLabel>
          <Select value={year} onChange={(e) => setYear(e.target.value)}>
            {years.map((y) => (
              <MenuItem key={y} value={y}>{y}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          startIcon={<CalendarMonthIcon />}
          onClick={generateReport}
          sx={{ textTransform: 'none', fontWeight: 'bold', px: 3 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} /> : 'Generate Report'}
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
