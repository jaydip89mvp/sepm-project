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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import managerService from '../../../services/managerService';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    phoneNumber: '',
    role: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchEmployees();
    fetchRoles();
  }, []);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const response = await managerService.getAllEmployees();
      setEmployees(response.data || []);
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Error fetching employees', 'error');
      setEmployees([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await managerService.getEmployeeRoles();
      console.log(response);
      if (response.data && Array.isArray(response.data)) {
        setRoles(response.data);
      } else {
        console.error('Invalid roles data:', response.data);
        setRoles([]);
        showSnackbar('Error loading roles', 'error');
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      setRoles([]);
      showSnackbar(error.response?.data?.message || 'Error fetching roles', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.firstName || !formData.lastName || !formData.role) {
      showSnackbar('Please fill in all required fields', 'error');
      return;
    }
    
    setIsLoading(true);
    try {
      if (editMode) {
        await managerService.updateEmployee(formData);
        showSnackbar('Employee updated successfully', 'success');
      } else {
        await managerService.addEmployee(formData);
        showSnackbar('Employee added successfully', 'success');
      }
      setOpen(false);
      fetchEmployees();
      resetForm();
    } catch (error) {
      const errorData = managerService.handleError(error);
      showSnackbar(errorData.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (email) => {
    try {
      await managerService.deleteEmployee(email);
      showSnackbar('Employee deleted successfully', 'success');
      fetchEmployees();
    } catch (error) {
      const errorData = managerService.handleError(error);
      showSnackbar(errorData.message, 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      phoneNumber: '',
      role: ''
    });
    setEditMode(false);
    setSelectedEmployee(null);
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity
    });
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
              <TableCell>Role</TableCell>
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
                <TableCell>{employee.assigned?.name}</TableCell>
                <TableCell>{employee.phoneNumber}</TableCell>
                <TableCell>
                  <IconButton 
                    onClick={() => {
                      setSelectedEmployee(employee);
                      setFormData({
                        ...employee,
                        role: employee.assigned?.name
                      });
                      setEditMode(true);
                      setOpen(true);
                    }}
                    disabled={isLoading}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleDelete(employee.email)}
                    disabled={isLoading}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog 
        open={open} 
        onClose={() => {
          setOpen(false);
          resetForm();
        }}
        maxWidth="sm"
        fullWidth
      >
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
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              required
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                label="Role"
              >
                {Array.isArray(roles) && roles.length > 0 ? (
                  roles.map((role) => (
                    <MenuItem key={role.name} value={role.name}>
                      {role.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled value="">
                    No roles available
                  </MenuItem>
                )}
              </Select>
            </FormControl>
            {!editMode && (
              <TextField
                fullWidth
                margin="normal"
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
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
              disabled={isLoading}
            >
              {editMode ? 'Update' : 'Add'}
            </Button>
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

export default EmployeeManagement;