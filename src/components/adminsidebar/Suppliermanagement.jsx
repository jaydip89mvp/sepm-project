import React, { useState, useEffect } from 'react';
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
  CircularProgress
} from '@mui/material';
import { Delete, Add } from '@mui/icons-material';
import axios from 'axios';

const API_URL = 'http://localhost:8080/admin/suppliers'; // Change this to your actual backend API endpoint

const SupplierManagement = () => {
  // State for Suppliers
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for Managing Form
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', company: '' });

  // Fetch suppliers from API on component mount
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get(API_URL);
        setSuppliers(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch suppliers');
        setLoading(false);
      }
    };
    fetchSuppliers();
  }, []);

  // Handle Add Supplier
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(API_URL, formData);
      setSuppliers([...suppliers, response.data]); // Update state with new supplier
      setOpen(false);
      setFormData({ name: '', company: '' });
    } catch (err) {
      alert('Failed to add supplier');
    }
  };

  // Handle Delete Supplier
  const handleDelete = async (name) => {
    try {
      await axios.delete(`${API_URL}/${name}`);
      setSuppliers(suppliers.filter(sup => sup.name !== name)); // Remove from state
    } catch (err) {
      alert('Failed to delete supplier');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" color="primary">Supplier Management</Typography>
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => setOpen(true)}
        sx={{ mb: 2 }}
      >
        Add Supplier
      </Button>

      {/* Show loading spinner */}
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Supplier</b></TableCell>
              <TableCell><b>Company</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {suppliers.map((sup) => (
              <TableRow key={sup.name}>
                <TableCell>{sup.name}</TableCell>
                <TableCell>{sup.company}</TableCell>
                <TableCell>
                  <IconButton color="error" onClick={() => handleDelete(sup.name)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Adding Supplier */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Add Supplier</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Supplier Name"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              label="Company Name"
              fullWidth
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              sx={{ mb: 2 }}
              required
            />
            <Button type="submit" variant="contained" sx={{ mt: 2 }} fullWidth>
              Add
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default SupplierManagement;
