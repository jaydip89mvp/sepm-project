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
  IconButton,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import axios from "axios";

const API_URL = "https://api.example.com/managers";

const Managermanagement = () => {
  const [managers, setManagers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", role: "", contact: "", salary: "" });

  useEffect(() => {
    fetchManagers();
  }, []);

  const fetchManagers = async () => {
    try {
      const response = await axios.get(API_URL);
      setManagers(response.data);
    } catch (error) {
      console.error("Error fetching managers:", error);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      if (editMode) {
        await axios.put(`${API_URL}/${formData.email}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }
      fetchManagers();
      handleClose();
    } catch (error) {
      console.error("Error saving manager:", error);
    }
  };

  const handleDeleteManager = async (email) => {
    try {
      await axios.delete(`${API_URL}/${email}`);
      fetchManagers();
    } catch (error) {
      console.error("Error deleting manager:", error);
    }
  };

  const handleOpen = (manager = null) => {
    setEditMode(!!manager);
    setFormData(manager || { name: "", email: "", role: "", contact: "", salary: "" });
    setOpen(true);
  };

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
      <Button variant="contained" startIcon={<Add />} sx={{ mt: 3, mb: 2 }} onClick={() => handleOpen()}>
        Add Manager
      </Button>
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
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editMode ? "Edit Manager" : "Add Manager"}</DialogTitle>
        <DialogContent>
          <TextField label="Full Name" name="name" fullWidth variant="outlined" sx={{ mt: 2 }} value={formData.name} onChange={handleChange} />
          <TextField label="Email Address" name="email" fullWidth variant="outlined" sx={{ mt: 2 }} value={formData.email} onChange={handleChange} disabled={editMode} />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Role</InputLabel>
            <Select name="role" value={formData.role} onChange={handleChange}>
              <MenuItem value="Home Appliances">Home Appliances</MenuItem>
              <MenuItem value="Fashion">Fashion</MenuItem>
              <MenuItem value="Toys">Toys</MenuItem>
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
