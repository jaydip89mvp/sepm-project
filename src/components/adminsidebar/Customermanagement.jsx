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

const Customermanagement = () => {
  const [customers, setCustomers] = useState([
    { name: "John Doe", email: "john@example.com", contact: "123-456-7890" },
    { name: "Jane Smith", email: "jane@example.com", contact: "987-654-3210" },
  ]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", contact: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.contact) {
      return;
    }

    if (editMode !== false) {
      const updatedCustomers = [...customers];
      updatedCustomers[editMode] = formData;
      setCustomers(updatedCustomers);
    } else {
      setCustomers([...customers, formData]);
    }

    handleClose();
  };

  const handleEdit = (index) => {
    setFormData(customers[index]);
    setEditMode(index);
    setOpen(true);
  };

  const handleDelete = (index) => {
    setCustomers(customers.filter((_, i) => i !== index));
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({ name: "", email: "", contact: "" });
    setEditMode(false);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 5 }}>
      <Typography variant="h4" color="primary" textAlign="center">
        Customer Management
      </Typography>

      {/* Show Form Button */}
      <Button variant="contained" startIcon={<Add />} sx={{ mt: 3, mb: 2 }} onClick={() => setOpen(true)}>
        Add customer
      </Button>

      {/* Customer List */}
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Contact</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer, index) => (
              <TableRow key={index}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.contact}</TableCell>
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
        <DialogTitle>{editMode !== false ? "Edit Customer" : "Add New Customer"}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              margin="normal"
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Contact Number"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            />
            <Box textAlign="right" sx={{ mt: 3 }}>
              <Button onClick={handleClose} sx={{ mr: 2 }}>
                Cancel
              </Button>
              <Button variant="contained" color="primary" type="submit">
                {editMode !== false ? "Update Customer" : "Add Customer"}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Customermanagement;
