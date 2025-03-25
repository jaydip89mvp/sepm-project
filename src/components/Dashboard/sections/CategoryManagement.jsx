import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import { Add } from '@mui/icons-material';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([
    { name: 'Electronics' },
    { name: 'Clothing' },
    { name: 'Books' }
  ]);
  const [open, setOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    setCategories([...categories, { name: categoryName }]);
    setOpen(false);
    setCategoryName('');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" color="primary">Category Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
        >
          Add Category
        </Button>
      </Box>

      <Paper sx={{ p: 2 }}>
        <List>
          {categories.map((category, index) => (
            <ListItem key={index}>
              <ListItemText primary={category.name} />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Category</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              margin="normal"
              label="Category Name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
            <Button
              fullWidth
              variant="contained"
              type="submit"
              sx={{ mt: 2 }}
              disabled={loading}
            >
              Add Category
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CategoryManagement;