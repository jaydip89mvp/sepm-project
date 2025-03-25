import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Container, Box } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const Unauthorized = () => {
  const navigate = useNavigate();

  const submithandler = () => {
    navigate('/login');
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 10,
          p: 4,
          textAlign: 'center',
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: '#f5f5f5',
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 60, color: 'error.main' }} />
        <Typography variant="h4" component="div" gutterBottom color="error">
          404 - Unauthorized Access
        </Typography>
        <Typography variant="body1" gutterBottom>
          You don't have permission to view this page.
        </Typography>
        <Button variant="contained" color="primary" onClick={submithandler}>
          Go to Login
        </Button>
      </Box>
    </Container>
  );
};

export default Unauthorized;
