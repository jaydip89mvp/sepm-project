import React, { useState, useEffect } from 'react';
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
  ListItemSecondaryAction,
  Paper,
  Typography,
  IconButton,
  Alert,
  Snackbar
} from '@mui/material';
import { Add, Edit } from '@mui/icons-material';
import managerService from '../../../services/managerService';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await managerService.getCategories();
      setCategories(response.data);
    } catch (error) {
      const errorData = managerService.handleError(error);
      showSnackbar(errorData.message, 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      showSnackbar('Please enter a category name', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const category = {
        name: categoryName.toUpperCase()
      };
      await managerService.addCategory(category);
      showSnackbar('Category added successfully', 'success');
      setOpen(false);
      setCategoryName('');
      fetchCategories();
    } catch (error) {
      const errorData = managerService.handleError(error);
      showSnackbar(errorData.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" color="primary">Category Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
          disabled={isLoading}
        >
          Add Category
        </Button>
      </Box>

      <Paper sx={{ p: 2 }}>
        <List>
          {categories.length === 0 ? (
            <ListItem>
              <ListItemText primary="No categories found" />
            </ListItem>
          ) : (
            categories.map((category) => (
              <ListItem key={category.name}>
                <ListItemText 
                  primary={category.name} 
                  secondary={`Added by: ${category.addedby?.name || 'System'}`}
                />
              </ListItem>
            ))
          )}
        </List>
      </Paper>

      <Dialog 
        open={open} 
        onClose={() => {
          setOpen(false);
          setCategoryName('');
          setSelectedCategory(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Category</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              margin="normal"
              label="Category Name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
              helperText="Category name will be converted to uppercase"
            />
            <Button
              fullWidth
              variant="contained"
              type="submit"
              sx={{ mt: 2 }}
              disabled={isLoading}
            >
              Add Category
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CategoryManagement;