import React, { useState } from 'react';
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
} from '@mui/material';
import { Delete, Add } from '@mui/icons-material';

const SupplierManagement = () => {
  // State for Suppliers
  const [suppliers, setSuppliers] = useState([
    { name: 'Supplier A', company: 'Company A' },
    { name: 'Supplier B', company: 'Company B' }
  ]);

  // State for Managing Form
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', company: '' });

  // Handle Add Supplier
  const handleSubmit = (e) => {
    e.preventDefault();
    setSuppliers([...suppliers, formData]);
    setOpen(false);
    setFormData({ name: '', company: '' });
  };

  // Handle Delete Supplier
  const handleDelete = (name) => {
    setSuppliers(suppliers.filter(sup => sup.name !== name));
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
