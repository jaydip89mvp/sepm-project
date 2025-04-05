import React, { useState, useEffect } from "react";
import axios from "axios";
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
  Avatar
} from "@mui/material";
import {
  Add as AddIcon,
  Category as CategoryIcon
} from "@mui/icons-material";
import { motion } from "framer-motion";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "" });

  useEffect(() => {
    axios.get("http://localhost:5000/api/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Failed to fetch categories:", err));
  }, []);

  const handleOpenDialog = () => {
    setFormData({ name: "" });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({ name: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      const res = await axios.post("http://localhost:5000/api/categories", {
        name: formData.name
      });
      setCategories([...categories, res.data]);
      handleClose();
    } catch (err) {
      console.error("Error adding category:", err);
    }
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
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Subcategories</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category) => (
                <motion.tr
                  key={category._id}
                  variants={itemVariants}
                  component={TableRow}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(242, 242, 247, 0.5)'
                    }
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{
                          backgroundColor: `${category.color || "#ddd"}20`,
                          color: category.color || "#333",
                          fontWeight: 'bold',
                          width: 36,
                          height: 36,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                        }}
                      >
                        {category.name?.substring(0, 1)}
                      </Avatar>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {category.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={<CategoryIcon fontSize="small" />}
                      label={`${category.subCategoryCount || 0} subcategories`}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        color: 'primary.main',
                        fontWeight: 500,
                        '& .MuiChip-icon': {
                          color: 'primary.main',
                          ml: 0.5
                        }
                      }}
                    />
                  </TableCell>
                </motion.tr>
              ))}
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
              onChange={(e) => setFormData({ name: e.target.value })}
              variant="outlined"
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
    </Box>
  );
};

export default CategoryManagement;
