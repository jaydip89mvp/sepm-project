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
  Typography,
  IconButton,
  Tooltip,
  Chip,
  Grid,
  Avatar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  CircularProgress
} from "@mui/material";
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  SupervisorAccount as ManagerIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  CheckCircle as StatusIcon
} from "@mui/icons-material";
import { motion } from "framer-motion";
import axios from "axios";

const ManagerManagement = () => {
  const [managers, setManagers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentManager, setCurrentManager] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    active: true
  });

  // Fetch managers
  useEffect(() => {
    const fetchManagers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/managers');
        setManagers(response.data);
      } catch (error) {
        console.error('Error fetching managers:', error);
        // Fallback data if API fails
        setManagers([
          {
            id: 1,
            name: "John Thompson",
            email: "john.t@inventorysys.com",
            phone: "555-786-1234",
            department: "Electronics",
            active: true,
            avatar: "JT"
          },
          {
            id: 2,
            name: "Sarah Miller",
            email: "sarah.m@inventorysys.com",
            phone: "555-786-2345",
            department: "Home Goods",
            active: true,
            avatar: "SM"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchManagers();
  }, []);

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoadingDepartments(true);
        const response = await axios.get('/api/departments');
        setDepartments(response.data);
        
        // Update form default department if not already set
        if (!formData.department && response.data.length > 0) {
          setFormData(prev => ({
            ...prev,
            department: response.data[0]
          }));
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
        // Fallback data if API fails
        const fallbackDepts = ["Electronics", "Home Goods", "Clothing", "Food & Beverage", "Sporting Goods", "Beauty", "Toys"];
        setDepartments(fallbackDepts);
        
        // Update form default department if not already set
        if (!formData.department) {
          setFormData(prev => ({
            ...prev,
            department: fallbackDepts[0]
          }));
        }
      } finally {
        setLoadingDepartments(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleOpenDialog = (manager = null) => {
    if (manager) {
      setEditMode(true);
      setCurrentManager(manager);
      setFormData({
        name: manager.name,
        email: manager.email,
        phone: manager.phone,
        department: manager.department,
        active: manager.active
      });
    } else {
      setEditMode(false);
      setCurrentManager(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        department: departments[0],
        active: true
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSwitchChange = (e) => {
    setFormData({
      ...formData,
      active: e.target.checked
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editMode && currentManager) {
        // Update existing manager via API
        await axios.put(`/api/managers/${currentManager.id}`, formData);
        
        // Update UI
        const updatedManagers = managers.map(mgr => 
          mgr.id === currentManager.id 
            ? { 
                ...mgr, 
                ...formData, 
                avatar: currentManager.avatar // Preserve the existing avatar
              } 
            : mgr
        );
        setManagers(updatedManagers);
      } else {
        // Add new manager via API
        const avatar = formData.name.split(' ').map(n => n[0]).join('');
        const newManagerData = {
          ...formData,
          avatar
        };
        
        const response = await axios.post('/api/managers', newManagerData);
        const newManager = response.data;
        
        // If API fails to return data, create a local version
        if (!newManager) {
          const localNewManager = {
            id: Date.now(), // Use timestamp as temp ID
            ...newManagerData
          };
          setManagers([...managers, localNewManager]);
        } else {
          setManagers([...managers, newManager]);
        }
      }
      handleClose();
    } catch (error) {
      console.error('Error saving manager:', error);
      // Fallback for demo purposes
      if (editMode && currentManager) {
        const updatedManagers = managers.map(mgr => 
          mgr.id === currentManager.id 
            ? { ...mgr, ...formData, avatar: currentManager.avatar } 
            : mgr
        );
        setManagers(updatedManagers);
      } else {
        const newManager = {
          id: managers.length + 1,
          ...formData,
          avatar: formData.name.split(' ').map(n => n[0]).join('')
        };
        setManagers([...managers, newManager]);
      }
      handleClose();
    }
  };

  const handleDelete = async (id) => {
    try {
      // Delete manager via API
      await axios.delete(`/api/managers/${id}`);
      // Update UI
      setManagers(managers.filter(mgr => mgr.id !== id));
    } catch (error) {
      console.error('Error deleting manager:', error);
      // Fallback for demo purposes
      setManagers(managers.filter(mgr => mgr.id !== id));
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };



  return (
    <Box className="card-3d-soft" sx={{ p: 4, borderRadius: 3, backgroundColor: 'white' }}>
      <Box 
        className="section-title" 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2, 
          mb: 4 
        }}
      >
        <ManagerIcon 
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
          className="section-title"
          sx={{ 
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #4338ca 30%, #6366f1 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Manager Management
        </Typography>
      </Box>

      <motion.div
        className="glow-effect"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          className="btn-3d btn-3d-primary"
          onClick={() => handleOpenDialog()}
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
          Add New Manager
        </Button>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="data-table-3d"
        style={{ borderRadius: '1rem' }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress sx={{ color: 'primary.main' }} />
            <Typography sx={{ ml: 2, color: 'text.secondary' }}>Loading managers...</Typography>
          </Box>
        ) :  !managers && managers.length !== 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <ManagerIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
            <Typography sx={{ color: 'text.secondary', mb: 1 }}>No managers found</Typography>
            <Button 
              variant="outlined" 
              size="small"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{ mt: 2 }}
            >
              Add your first manager
            </Button>
          </Box>
        ) : (
          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <Table>
              <TableHead sx={{ backgroundColor: 'rgba(242, 242, 247, 0.8)' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Manager</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Department</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {managers.map((manager) => (
                <motion.tr
                  key={manager.id}
                  variants={itemVariants}
                  component={TableRow}
                  className="table-row-3d"
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
                          backgroundColor: manager.active ? 'primary.light' : 'grey.300',
                          color: manager.active ? 'primary.main' : 'text.secondary',
                          fontWeight: 'bold',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                        }}
                      >
                        {manager.avatar}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          {manager.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <EmailIcon fontSize="small" color="action" />
                            <Typography variant="caption" color="text.secondary">
                              {manager.email}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <PhoneIcon fontSize="small" color="action" />
                            <Typography variant="caption" color="text.secondary">
                              {manager.phone}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{manager.department}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={manager.active ? "Active" : "Inactive"} 
                      size="small" 
                      sx={{ 
                        backgroundColor: manager.active 
                          ? 'rgba(16, 185, 129, 0.1)' 
                          : 'rgba(239, 68, 68, 0.1)',
                        color: manager.active 
                          ? 'rgb(16, 185, 129)' 
                          : 'rgb(239, 68, 68)',
                        fontWeight: 500
                      }} 
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <Tooltip title="Edit Manager" arrow>
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleOpenDialog(manager)}
                          className="btn-3d"
                          sx={{ 
                            backgroundColor: 'rgba(99, 102, 241, 0.1)',
                            '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.2)' }
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Manager" arrow>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDelete(manager.id)}
                          className="btn-3d"
                          sx={{ 
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.2)' }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </motion.tr>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </motion.div>

      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="md"
        fullWidth
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
          {editMode ? 'Edit Manager' : 'Add New Manager'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Manager Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-3d"
                  variant="outlined"
                  required
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&.Mui-focused fieldset': {
                        borderColor: '#6366f1',
                        borderWidth: 2
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-3d"
                  variant="outlined"
                  required
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&.Mui-focused fieldset': {
                        borderColor: '#6366f1',
                        borderWidth: 2
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-3d"
                  variant="outlined"
                  required
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&.Mui-focused fieldset': {
                        borderColor: '#6366f1',
                        borderWidth: 2
                      }
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl 
                  fullWidth 
                  margin="normal"
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&.Mui-focused fieldset': {
                        borderColor: '#6366f1',
                        borderWidth: 2
                      }
                    }
                  }}
                >
                  <InputLabel id="department-label">Department</InputLabel>
                  <Select
                    labelId="department-label"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    label="Department"
                    required
                    disabled={loadingDepartments}
                  >
                    {loadingDepartments ? (
                      <MenuItem value="" disabled>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CircularProgress size={20} sx={{ mr: 1 }} />
                          Loading departments...
                        </Box>
                      </MenuItem>
                    ) : departments.length === 0 ? (
                      <MenuItem value="" disabled>No departments available</MenuItem>
                    ) : (
                      departments.map((dept, index) => (
                        <MenuItem key={index} value={dept}>{dept}</MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.active}
                      onChange={handleSwitchChange}
                      name="active"
                      color="primary"
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <StatusIcon fontSize="small" color={formData.active ? "primary" : "disabled"} />
                      <Typography>
                        {formData.active ? "Active Account" : "Inactive Account"}
                      </Typography>
                    </Box>
                  }
                />
              </Grid>
            </Grid>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 1 }}>
              <Button 
                onClick={handleClose}
                variant="outlined"
                className="btn-3d"
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  borderColor: 'rgba(99, 102, 241, 0.5)',
                  color: '#6366f1',
                  '&:hover': {
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.05)'
                  }
                }}
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                type="submit"
                className="btn-3d btn-3d-primary"
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #4338ca 30%, #6366f1 90%)',
                  boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)'
                }}
              >
                {editMode ? 'Update Manager' : 'Add Manager'}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ManagerManagement;