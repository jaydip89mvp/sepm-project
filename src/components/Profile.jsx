import React from 'react';
import { Card, CardContent, Typography, Avatar, Box } from '@mui/material';

const Profile = () => {
  const name = 'Jaydip Kshirsagar';
  const role = 'admin';

  return (
    <Card sx={{ maxWidth: 345, margin: '20px auto', boxShadow: 3, borderRadius: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ width: 80, height: 80 }}>
            {name.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="h5" component="div">
            {name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {role}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Profile;
