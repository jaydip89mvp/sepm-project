import React from 'react';
import { Card, CardContent, Typography, Avatar, Box } from '@mui/material';
import { motion } from 'framer-motion';

const Profile = () => {
  const name = 'Jaydip Kshirsagar';
  const role = 'Employee';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card 
        component={motion.div}
        whileHover={{ scale: 1.02 }}
        sx={{ maxWidth: 345, margin: '20px auto', boxShadow: 3, borderRadius: 2 }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Avatar sx={{ width: 80, height: 80 }}>
                {name.charAt(0).toUpperCase()}
              </Avatar>
            </motion.div>
            <Typography variant="h5" component="div">
              {name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {role}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Profile;
