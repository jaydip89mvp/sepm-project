import React, { useState } from 'react';
import { Paper, Typography, Button, Box } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const Report = () => {
  const [reportType, setReportType] = useState('');

  const generateReport = (type) => {
    console.log(`Generating ${type} Report`);
    setReportType(type);
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
        >
          Monthly
        </Button>
        <Button
          variant={reportType === 'Yearly' ? 'contained' : 'outlined'}
          color="secondary"
          startIcon={<BarChartIcon />}
          onClick={() => generateReport('Yearly')}
          sx={{ textTransform: 'none', fontWeight: 'bold', px: 3 }}
        >
          Yearly
        </Button>
      </Box>

      {reportType && (
        <Typography sx={{ mt: 3, fontWeight: 'medium', color: 'text.secondary' }}>
          Selected Report: <strong>{reportType}</strong>
        </Typography>
      )}
    </Paper>
  );
};

export default Report;
