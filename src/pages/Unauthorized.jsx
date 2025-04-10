import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button, Typography, Box, Container } from '@mui/material';
import { logout } from '../redux/reducer/auth';

const Unauthorized = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleReturnToLogin = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        <Typography variant="h1" component="h1" gutterBottom>
          403
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          Unauthorized Access
        </Typography>
        <Typography variant="body1" paragraph>
          You do not have permission to access this page.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleReturnToLogin}
          sx={{ mt: 2 }}
        >
          Return to Login
        </Button>
      </Box>
    </Container>
  );
};

export default Unauthorized;
