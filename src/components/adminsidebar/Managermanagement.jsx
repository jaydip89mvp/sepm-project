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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";

// Mock Data
const initialManagers = [
  { name: "Manager A", email: "managerA@example.com", role: "Electronics", contact: "1234567890", salary: "50000" },
  { name: "Manager B", email: "managerB@example.com", role: "Sports", contact: "9876543210", salary: "55000" }
];

const unassignedRoles = ["Home Appliances", "Fashion", "Toys"];

const Managermanagement = () => {
  const [managers, setManagers] = useState(initialManagers);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", role: "", contact: "", salary: "" });

  // Handle Input Change
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Add or Edit Manager
  const handleSubmit = () => {
    if (editMode) {
      setManagers(managers.map((m) => (m.email === formData.email ? formData : m)));
    } else {
      setManagers([...managers, formData]);
    }
    handleClose();
  };

  // Delete Manager
  const handleDeleteManager = (email) => setManagers(managers.filter((m) => m.email !== email));

  // Open Add/Edit Dialog
  const handleOpen = (manager = null) => {
    setEditMode(!!manager);
    setFormData(manager || { name: "", email: "", role: "", contact: "", salary: "" });
    setOpen(true);
  };

  // Close Dialog
  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setFormData({ name: "", email: "", role: "", contact: "", salary: "" });
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h4" color="primary" textAlign="center">
        Manager Management
      </Typography>

      {/* Add Manager Button */}
      <Button variant="contained" startIcon={<Add />} sx={{ mt: 3, mb: 2 }} onClick={() => handleOpen()}>
        Add Manager
      </Button>

      {/* Managers Table */}
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Contact</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Salary</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {managers.map((manager) => (
              <TableRow key={manager.email}>
                <TableCell>{manager.name}</TableCell>
                <TableCell>{manager.email}</TableCell>
                <TableCell>{manager.role}</TableCell>
                <TableCell>{manager.contact}</TableCell>
                <TableCell>₹{manager.salary}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpen(manager)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteManager(manager.email)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Manager Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editMode ? "Edit Manager" : "Add Manager"}</DialogTitle>
        <DialogContent>
          <TextField label="Full Name" name="name" fullWidth variant="outlined" sx={{ mt: 2 }} value={formData.name} onChange={handleChange} />
          <TextField label="Email Address" name="email" fullWidth variant="outlined" sx={{ mt: 2 }} value={formData.email} onChange={handleChange} />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Role</InputLabel>
            <Select name="role" value={formData.role} onChange={handleChange}>
              {unassignedRoles.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField label="Contact Number" name="contact" fullWidth variant="outlined" sx={{ mt: 2 }} value={formData.contact} onChange={handleChange} />
          <TextField label="Salary (₹)" name="salary" type="number" fullWidth variant="outlined" sx={{ mt: 2 }} value={formData.salary} onChange={handleChange} />
          <Box textAlign="right" sx={{ mt: 3 }}>
            <Button onClick={handleClose} sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              {editMode ? "Update" : "Add"}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Managermanagement;
