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
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import axios from 'axios';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([
    // Mock data for testing
    {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '123-456-7890'
    }
  ]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    phoneNumber: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // Comment out useEffect and fetchEmployees for now
  // useEffect(() => {
  //   fetchEmployees();
  // }, []);

  // const fetchEmployees = async () => {
  //   try {
  //     const response = await axios.get('/manager/getallemployees');
  //     setEmployees(response.data);
  //   } catch (error) {
  //     console.error('Error fetching employees:', error);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.firstName || !formData.lastName) {
      return;
    }
    
    // Modified to work without backend
    if (editMode) {
      // Update existing employee in the frontend
      setEmployees(employees.map(emp => 
        emp.email === formData.email ? formData : emp
      ));
    } else {
      // Add new employee to the frontend
      setEmployees([...employees, formData]);
    }
    setOpen(false);
    resetForm();
    
    // Comment out API calls
    // try {
    //   if (editMode) {
    //     await axios.put('/manager/updateEmployee', formData);
    //   } else {
    //     await axios.post('/manager/addemployee', formData);
    //   }
    //   setOpen(false);
    //   fetchEmployees();
    //   resetForm();
    // } catch (error) {
    //   console.error('Error:', error);
    // }
  };

  const handleDelete = async (email) => {
    // Modified to work without backend
    setEmployees(employees.filter(emp => emp.email !== email));
    
    // Comment out API call
    // try {
    //   await axios.put(`/manager/deleteemployee?email=${email}`);
    //   fetchEmployees();
    // } catch (error) {
    //   console.error('Error deleting employee:', error);
    // }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      phoneNumber: ''
    });
    setEditMode(false);
    setSelectedEmployee(null);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" color="primary">Employee Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
        >
          Add Employee
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.email}>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.firstName}</TableCell>
                <TableCell>{employee.lastName}</TableCell>
                <TableCell>{employee.phoneNumber}</TableCell>
                <TableCell>
                  <IconButton onClick={() => {
                    setSelectedEmployee(employee);
                    setFormData(employee);
                    setEditMode(true);
                    setOpen(true);
                  }}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(employee.email)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => {
        setOpen(false);
        resetForm();
      }}>
        <DialogTitle>{editMode ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              disabled={editMode}
            />
            <TextField
              fullWidth
              margin="normal"
              label="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            />
            {!editMode && (
              <TextField
                fullWidth
                margin="normal"
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            )}
            <TextField
              fullWidth
              margin="normal"
              label="Phone Number"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
            />
            <Button
              fullWidth
              variant="contained"
              type="submit"
              sx={{ mt: 2 }}
            >
              {editMode ? 'Update' : 'Add'}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default EmployeeManagement;