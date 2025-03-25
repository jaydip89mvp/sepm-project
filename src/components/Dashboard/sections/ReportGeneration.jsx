import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Paper,
  Typography,
  Snackbar,
  Alert
} from '@mui/material';
import { Download } from '@mui/icons-material';

const ReportGeneration = () => {
  const [reportParams, setReportParams] = useState({
    month: '',
    year: '',
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleGenerateReport = async () => {
    // Frontend-only validation and feedback
    if (!reportParams.month || !reportParams.year) {
      alert('Please fill in both month and year');
      return;
    }

    // Mock report generation
    console.log('Generating report for:', reportParams);
    setOpenSnackbar(true);

    // Comment out the actual API call for now
    // try {
    //   const response = await axios.get('/manager/generatereport', {
    //     params: reportParams,
    //     responseType: 'blob',
    //   });
      
    //   const url = window.URL.createObjectURL(new Blob([response.data]));
    //   const link = document.createElement('a');
    //   link.href = url;
    //   link.setAttribute('download', `report-${reportParams.month}-${reportParams.year}.pdf`);
    //   document.body.appendChild(link);
    //   link.click();
    //   link.remove();
    // } catch (error) {
    //   console.error('Error generating report:', error);
    // }
  };

  return (
    <Box>
      <Typography variant="h5" color="primary" sx={{ mb: 3 }}>
        Report Generation
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Box component="form" sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            label="Month"
            type="number"
            value={reportParams.month}
            onChange={(e) => setReportParams({...reportParams, month: e.target.value})}
            InputProps={{ inputProps: { min: 1, max: 12 } }}
          />
          <TextField
            label="Year"
            type="number"
            value={reportParams.year}
            onChange={(e) => setReportParams({...reportParams, year: e.target.value})}
            InputProps={{ inputProps: { min: 2000 } }}
          />
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={handleGenerateReport}
          >
            Generate Report
          </Button>
        </Box>
      </Paper>

      {/* Add feedback for user interaction */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="success" onClose={() => setOpenSnackbar(false)}>
          Report generation simulated! Month: {reportParams.month}, Year: {reportParams.year}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ReportGeneration;