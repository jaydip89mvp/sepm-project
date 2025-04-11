import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Avatar,
  Snackbar,
  Alert,
  CircularProgress,
  IconButton
} from "@mui/material";
import {
  Add as AddIcon,
  Category as CategoryIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from "@mui/icons-material";
import { motion } from "framer-motion";
import adminService from "../../services/adminService";
import { alpha } from "@mui/material/styles";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    name: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  useEffect(() => {
    console.log('Component mounted, fetching categories...');
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await adminService.getManagerRoles();
      console.log('Categories response:', response);

      if (response && response.data) {
        // Transform the categories for display
        const transformedCategories = response.data.map(category => {
          const displayName = category.name.replace('MANAGER_', '').split('_').join(' ');
          return {
            id: category.id || Math.random().toString(36).substr(2, 9),
            name: category.name,
            displayName: displayName,
            color: category.color || `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`
          };
        });

        console.log('Transformed categories:', transformedCategories);
        setCategories(transformedCategories);
        showSnackbar('Categories loaded successfully', 'success');
      } else {
        console.warn('No categories found in response');
        setCategories([]);
        showSnackbar('No categories found', 'warning');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
      showSnackbar(error.message || 'Failed to load categories', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setFormData({ name: "" });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({ name: "" });
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showSnackbar("Category name is required", "error");
      return;
    }

    setIsLoading(true);
    try {
      const result = await adminService.addCategory({
        name: formData.name.trim()
      });
      
      // Show success message
      showSnackbar(result.message, "success");
      
      // Close dialog and reset form
      handleClose();
      
      // Refresh the categories list
      await fetchCategories();
      
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      showSnackbar(error.message || "Failed to add category", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCategory = (category) => {
    // TODO: Implement edit functionality
    showSnackbar("Edit functionality coming soon", "info");
  };

  const handleDeleteCategory = (categoryId) => {
    // TODO: Implement delete functionality
    showSnackbar("Delete functionality coming soon", "info");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 12 }
    }
  };

  return (
    <Box className="card-3d-soft" sx={{ p: 4, borderRadius: 3, backgroundColor: 'white' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mb: 4
        }}
      >
        <CategoryIcon
          sx={{
            fontSize: 32,
            color: 'primary.main',
            backgroundColor: 'primary.light',
            p: 1,
            borderRadius: '50%',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
          }}
        />
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #4338ca 30%, #6366f1 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Category Management
        </Typography>
      </Box>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          disabled={isLoading}
          sx={{
            mb: 3,
            background: 'linear-gradient(45deg, #4338ca 30%, #6366f1 90%)',
            boxShadow: '0 6px 12px rgba(99, 102, 241, 0.3)',
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 'bold',
            py: 1.2,
            px: 3
          }}
        >
          Add New Category
        </Button>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ borderRadius: '1rem' }}
      >
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Table>
            <TableHead sx={{ backgroundColor: 'rgba(242, 242, 247, 0.8)' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Category Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography variant="body1" color="textSecondary">
                      No categories found. Add a new category to get started.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          sx={{
                            bgcolor: category.color || '#1976d2',
                            width: 32,
                            height: 32
                          }}
                        >
                          {category.displayName ? category.displayName[0].toUpperCase() : '#'}
                        </Avatar>
                        <Typography variant="body1">
                          {category.displayName || 'Unnamed Category'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleEditCategory(category)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteCategory(category.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </motion.div>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          className: 'card-3d',
          sx: {
            borderRadius: 3,
            backgroundImage: 'linear-gradient(to bottom right, rgba(255,255,255,0.9), rgba(255,255,255,0.8))',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1), 0 1px 5px rgba(0,0,0,0.03), 0 0 0 1px rgba(255,255,255,0.4)'
          }
        }}
      >
        <DialogTitle sx={{
          pb: 1,
          background: 'linear-gradient(45deg, #4338ca 30%, #6366f1 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold',
          fontSize: '1.5rem'
        }}>
          Add New Category
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ pt: 1 }}>
            <TextField
              fullWidth
              margin="normal"
              label="Category Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              variant="outlined"
              disabled={isLoading}
              sx={{
                mb: 3,
                mt: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&.Mui-focused fieldset': {
                    borderColor: '#6366f1',
                    borderWidth: 2
                  }
                }
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                onClick={handleClose}
                variant="outlined"
                disabled={isLoading}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  borderColor: 'rgba(99, 102, 241, 0.5)',
                  color: '#6366f1',
                  '&:hover': {
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.05)'
                  },
                  mr: 1
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                type="submit"
                disabled={isLoading}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #4338ca 30%, #6366f1 90%)',
                  boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)'
                }}
              >
                Add Category
              </Button>
            </Box>
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
