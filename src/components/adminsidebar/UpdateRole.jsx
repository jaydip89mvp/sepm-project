import React, { useState, useEffect } from 'react';
import { Paper, Typography, Button, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const managers = [
  { name: 'Manager A', role: 'Role A', email: 'managerA@example.com' },
  { name: 'Manager B', role: 'Role B', email: 'managerB@example.com' }
];

const categories = ['Role A', 'Role B', 'Role C'];

const UpdateRole = () => {
  const [selectedManager, setSelectedManager] = useState('');
  const [availableCategories, setAvailableCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const assignedCategories = managers.map(manager => manager.role);
    setAvailableCategories(categories.filter(cat => !assignedCategories.includes(cat)));
  }, []);

  const handleUpdate = () => {
    console.log(`Updating ${selectedManager} to ${selectedCategory}`);
    setSelectedManager('');
    setSelectedCategory('');
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
      <Typography variant="h5" fontWeight="bold" color="primary" sx={{ mb: 3 }}>
        Update Manager Role
      </Typography>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Select Manager</InputLabel>
        <Select
          value={selectedManager}
          onChange={(e) => setSelectedManager(e.target.value)}
        >
          {managers.map(manager => (
            <MenuItem key={manager.email} value={manager.name}>
              {manager.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Select New Role</InputLabel>
        <Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {availableCategories.map(cat => (
            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant="contained"
        color="primary"
        sx={{ px: 4, py: 1 }}
        onClick={handleUpdate}
        disabled={!selectedManager || !selectedCategory}
      >
        Update Role
      </Button>
    </Paper>
  );
};

export default UpdateRole;
