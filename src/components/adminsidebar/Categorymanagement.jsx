import React, { useEffect, useState } from "react";
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
  IconButton,
  Typography,
  Avatar,
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Category as CategoryIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import adminService from "../../services/adminService";
import { alpha } from "@mui/material/styles";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch categories on load
  useEffect(() => {
    fetchCategories();
  }, []);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await adminService.getManagerRoles();
      if (response.success) {
        setCategories(response.data);
      } else {
        showSnackbar(response.message || "Failed to fetch categories", "error");
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      showSnackbar("Error fetching categories. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (category = null) => {
    if (category) {
      setEditMode(true);
      setCurrentCategory(category);
      setFormData({
        name: category.name.replace('MANAGER_', '')
      });
    } else {
      setEditMode(false);
      setCurrentCategory(null);
      setFormData({ name: "" });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Category name is required";
    if (formData.name.length < 3) return "Category name must be at least 3 characters";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      showSnackbar(validationError, "error");
      return;
    }

    setSubmitting(true);
    try {
      const response = await adminService.addCategory(formData);
      if (response.success) {
        showSnackbar(response.message || "Category added successfully");
        fetchCategories();
        handleClose();
      } else {
        showSnackbar(response.message || "Failed to add category", "error");
      }
    } catch (err) {
      console.error("Error adding category:", err);
      showSnackbar("Error adding category. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // const handleDelete = async (id) => {
  //   if (!window.confirm("Are you sure you want to delete this category?")) {
  //     return;
  //   }
    
  //   try {
  //     const response = await adminService.deleteCategory(id);
  //     if (response.success) {
  //       showSnackbar(response.message || "Category deleted successfully");
  //       fetchCategories();
  //     } else {
  //       showSnackbar(response.message || "Failed to delete category", "error");
  //     }
  //   } catch (err) {
  //     console.error("Error deleting category:", err);
  //     showSnackbar("Error deleting category. Please try again.", "error");
  //   }
  // };

  // const containerVariants = {
  //   hidden: { opacity: 0 },
  //   visible: {
  //     opacity: 1,
  //     transition: {
  //       staggerChildren: 0.1,
  //     },
  //   },
  // };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 12 },
    },
  };

  if (loading && categories.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="card-3d-soft" sx={{ p: 4, borderRadius: 3, backgroundColor: "white" }}>
      {/* Header */}
      <Box
        className="section-title"
        sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}
      >
        <CategoryIcon
          sx={{
            fontSize: 32,
            color: "primary.main",
            backgroundColor: "primary.light",
            p: 1,
            borderRadius: "50%",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          }}
        />
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            background: "linear-gradient(45deg, #4338ca 30%, #6366f1 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Category Management
        </Typography>
      </Box>

      {/* Add Category Button */}
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            mb: 3,
            background: "linear-gradient(45deg, #4338ca 30%, #6366f1 90%)",
            boxShadow: "0 6px 12px rgba(99, 102, 241, 0.3)",
            borderRadius: 2,
            textTransform: "none",
            fontWeight: "bold",
            py: 1.2,
            px: 3,
          }}
        >
          Add New Category
        </Button>
      </motion.div>

      {/* Category Table */}
      <motion.div
        initial="hidden"
        animate="visible"
        style={{ borderRadius: "1rem" }}
      >
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead sx={{ backgroundColor: "rgba(242, 242, 247, 0.8)" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Category</TableCell>
                {/* <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  Actions
                </TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category) => (
                <motion.tr
                  key={category.id}
                  variants={itemVariants}
                  component={TableRow}
                  sx={{ "&:hover": { backgroundColor: "rgba(242, 242, 247, 0.5)" } }}
                >
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar sx={{ backgroundColor: "#eee", color: "#555" }}>
                        {category.name.replace('MANAGER_', '')[0]}
                      </Avatar>
                      <Typography fontWeight="bold">
                        {category.name.replace('MANAGER_', '')}
                      </Typography>
                    </Box>
                  </TableCell>
                  {/* <TableCell align="right">
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                      <Tooltip title="Delete Category" arrow>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(category.id)}
                          sx={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell> */}
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </motion.div>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            fontWeight: "bold",
            background: "linear-gradient(45deg, #4338ca 30%, #6366f1 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {editMode ? "Edit Category" : "Add New Category"}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ pt: 1 }}>
            <TextField
              fullWidth
              margin="normal"
              label="Category Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              helperText="Enter a name for the new category"
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}>
              <Button variant="outlined" onClick={handleClose} disabled={submitting}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                disabled={submitting}
                startIcon={submitting ? <CircularProgress size={20} /> : null}
              >
                {editMode ? "Update" : "Add"}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CategoryManagement;
