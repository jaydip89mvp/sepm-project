import React, { useState } from "react";
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
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";

const Categorymanagement = () => {
  const [categories, setCategories] = useState([
    { name: "Electronics", description: "Devices and gadgets" },
    { name: "Clothing", description: "Apparel and accessories" },
    { name: "Books", description: "Educational and fictional books" },
  ]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim()) return;

    if (editMode !== false) {
      const updatedCategories = [...categories];
      updatedCategories[editMode] = formData;
      setCategories(updatedCategories);
    } else {
      setCategories([...categories, formData]);
    }

    handleClose();
  };

  const handleEdit = (index) => {
    setFormData(categories[index]);
    setEditMode(index);
    setOpen(true);
  };

  const handleDelete = (index) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({ name: "", description: "" });
    setEditMode(false);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 5 }}>
      <Typography variant="h4" color="primary" textAlign="center">
        Category Management
      </Typography>

      {/* Show Form Button */}
      <Button variant="contained" startIcon={<Add />} sx={{ mt: 3, mb: 2 }} onClick={() => setOpen(true)}>
        Add Category
      </Button>

      {/* Category List */}
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Category Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category, index) => (
              <TableRow key={index}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(index)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(index)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editMode !== false ? "Edit Category" : "Add New Category"}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              margin="normal"
              label="Category Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Description"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <Box textAlign="right" sx={{ mt: 3 }}>
              <Button onClick={handleClose} sx={{ mr: 2 }}>
                Cancel
              </Button>
              <Button variant="contained" color="primary" type="submit">
                {editMode !== false ? "Update Category" : "Add Category"}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Categorymanagement;
