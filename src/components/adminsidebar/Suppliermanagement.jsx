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
  Typography,
  IconButton,
  Tooltip,
  Chip,
  Grid,
  Avatar
} from "@mui/material";
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  LocalShipping as SupplierIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Check as CheckIcon,
  Close as CloseIcon
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useEffect } from "react";

// Mock data for suppliers (replace with API calls in production)
const mockSuppliers = [
  { 
    id: 1, 
    name: "TechSupplies Inc.", 
    contact: "John Smith", 
    email: "john@techsupplies.com", 
    phone: "555-123-4567", 
    address: "123 Tech Blvd, Silicon Valley, CA", 
    status: "Active",
    productsSupplied: 47
  },
  { 
    id: 2, 
    name: "Global Distribution Co.", 
    contact: "Sarah Johnson", 
    email: "sarah@globaldist.com", 
    phone: "555-234-5678", 
    address: "456 Global St, New York, NY", 
    status: "Active",
    productsSupplied: 32
  },
  { 
    id: 3, 
    name: "Quality Parts Ltd.", 
    contact: "Michael Brown", 
    email: "michael@qualityparts.com", 
    phone: "555-345-6789", 
    address: "789 Quality Ave, Chicago, IL", 
    status: "Inactive",
    productsSupplied: 18
  },
  { 
    id: 4, 
    name: "Sustainable Materials Co.", 
    contact: "Emily Davis", 
    email: "emily@sustainablematerials.com", 
    phone: "555-456-7890", 
    address: "101 Green St, Portland, OR", 
    status: "Active",
    productsSupplied: 25
  },
  { 
    id: 5, 
    name: "Fast Logistics Corp.", 
    contact: "David Wilson", 
    email: "david@fastlogistics.com", 
    phone: "555-567-8901", 
    address: "222 Speed Way, Dallas, TX", 
    status: "Active",
    productsSupplied: 36
  }
];

const SupplierManagement = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await fetch('https://fakeapi.com/suppliers');
        const data = await response.json();
        setSuppliers(data);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      }
    };

    fetchSuppliers();
  }, []);

  const handleOpenDialog = (supplier = null) => {
    if (supplier) {
      setEditMode(true);
      setCurrentSupplier(supplier);
      setFormData({
        name: supplier.name,
        email: supplier.email,
      });
    } else {
      setEditMode(false);
      setCurrentSupplier(null);
      setFormData({
        name: "",
        email: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode && currentSupplier) {
        const response = await fetch(`https://fakeapi.com/suppliers/${currentSupplier.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const updatedSupplier = await response.json();
        setSuppliers(suppliers.map(sup => (sup.id === currentSupplier.id ? updatedSupplier : sup)));
      } else {
        const response = await fetch('https://fakeapi.com/suppliers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const newSupplier = await response.json();
        setSuppliers([...suppliers, newSupplier]);
      }
      handleClose();
    } catch (error) {
      console.error('Error saving supplier:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`https://fakeapi.com/suppliers/${id}`, {
        method: 'DELETE',
      });
      setSuppliers(suppliers.filter(sup => sup.id !== id));
    } catch (error) {
      console.error('Error deleting supplier:', error);
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
        <SupplierIcon 
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
          Supplier Management
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
          Add New Supplier
        </Button>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="data-table-3d"
        style={{ borderRadius: '1rem' }}
      >
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Table>
            <TableHead sx={{ backgroundColor: 'rgba(242, 242, 247, 0.8)' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Supplier</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Contact</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {suppliers.map((supplier) => (
                <motion.tr
                  key={supplier.id}
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
                          backgroundColor: 'primary.light',
                          color: 'primary.main',
                          fontWeight: 'bold',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                        }}
                      >
                        {supplier.name.substring(0, 1)}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          {supplier.name}
                        </Typography>
                        
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: '500' }}>
                        {supplier.email}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <Tooltip title="Edit Supplier" arrow>
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleOpenDialog(supplier)}
                          className="btn-3d"
                          sx={{ 
                            backgroundColor: 'rgba(99, 102, 241, 0.1)',
                            '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.2)' }
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Supplier" arrow>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDelete(supplier.id)}
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
      </motion.div>

      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="md"
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
          {editMode ? 'Edit Supplier' : 'Add New Supplier'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Supplier Name"
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
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Contact Person"
                  name="contact"
                  value={formData.contact}
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
              <Grid item xs={12} md={6}>
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
                {editMode ? 'Update Supplier' : 'Add Supplier'}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default SupplierManagement;