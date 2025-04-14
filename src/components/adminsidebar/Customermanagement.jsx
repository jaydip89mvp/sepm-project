import React, { useEffect, useState } from "react";
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
  Avatar,
  Tooltip,
  Chip,
  CircularProgress,
  Snackbar,
  Alert,
  FormControlLabel,
  Switch,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import customerService from "../../services/customerService";

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    contact: "", 
    address: "",
    active: true 
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch customers on load
  useEffect(() => {
    fetchCustomers();
  }, []);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await customerService.getAllCustomers();
      if (response.success) {
        setCustomers(response.data);
      } else {
        showSnackbar(response.message || "Failed to fetch customers", "error");
      }
    } catch (err) {
      console.error("Error fetching customers:", err);
      showSnackbar("Error fetching customers. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (customer = null) => {
    if (customer) {
      setEditMode(true);
      setCurrentCustomer(customer);
      setFormData({
        name: customer.name,
        email: customer.email,
        contact: customer.contact || "",
        address: customer.address || "",
        active: customer.active !== undefined ? customer.active : true
      });
    } else {
      setEditMode(false);
      setCurrentCustomer(null);
      setFormData({ 
        name: "", 
        email: "", 
        contact: "", 
        address: "",
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (e) => {
    setFormData({
      ...formData,
      active: e.target.checked
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Name is required";
    if (!formData.email.trim()) return "Email is required";
    if (!formData.contact.trim()) return "Contact is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return "Invalid email format";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      showSnackbar(validationError, "error");
      return;
    }

    setSubmitting(true);
    try {
      let response;
      if (editMode && currentCustomer) {
        response = await customerService.updateCustomer({
          ...formData,
          customerId: currentCustomer.customerId
        });
      } else {
        response = await customerService.addCustomer(formData);
      }
      
      if (response.success) {
        showSnackbar(response.message || (editMode ? "Customer updated successfully" : "Customer added successfully"));
        fetchCustomers();
        handleClose();
      } else {
        showSnackbar(response.message || "Failed to save customer", "error");
      }
    } catch (err) {
      console.error("Error saving customer:", err);
      showSnackbar("Error saving customer. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to deactivate this customer?")) {
      return;
    }
    
    try {
      const response = await customerService.deleteCustomer(id);
      if (response.success) {
        showSnackbar(response.message || "Customer deactivated successfully");
        fetchCustomers();
      } else {
        showSnackbar(response.message || "Failed to deactivate customer", "error");
      }
    } catch (err) {
      console.error("Error deactivating customer:", err);
      showSnackbar("Error deactivating customer. Please try again.", "error");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 12 },
    },
  };

  if (loading && customers.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="card-3d-soft" sx={{ p: 4, borderRadius: 3, backgroundColor: "white" }}>
      {/* Header */}
      <Box
        className="section-title"
        sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}
      >
        <PersonIcon
          sx={{
            fontSize: 32,
            color: "primary.main",
            backgroundColor: "primary.light",
            p: 1,
            borderRadius: "50%",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          }}
        />
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            background: "linear-gradient(45deg, #4338ca 30%, #6366f1 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Customer Management
        </Typography>
      </Box>

      {/* Add Customer Button */}
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            mb: 3,
            background: "linear-gradient(45deg, #4338ca 30%, #6366f1 90%)",
            boxShadow: "0 6px 12px rgba(99, 102, 241, 0.3)",
            borderRadius: 2,
            textTransform: "none",
            fontWeight: "bold",
            py: 1.2,
            px: 3,
          }}
        >
          Add New Customer
        </Button>
      </motion.div>

      {/* Customer Table */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ borderRadius: "1rem" }}
      >
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead sx={{ backgroundColor: "rgba(242, 242, 247, 0.8)" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Contact</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((customer) => (
                <motion.tr
                  key={customer.customerId}
                  variants={itemVariants}
                  component={TableRow}
                  sx={{ "&:hover": { backgroundColor: "rgba(242, 242, 247, 0.5)" } }}
                >
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar sx={{ backgroundColor: "#eee", color: "#555" }}>
                        {customer.name[0]}
                      </Avatar>
                      <Typography fontWeight="bold">{customer.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <EmailIcon fontSize="small" sx={{ color: "text.secondary" }} />
                      <Typography variant="body2">{customer.email}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <PhoneIcon fontSize="small" sx={{ color: "text.secondary" }} />
                      <Typography variant="body2">{customer.contact || "N/A"}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={customer.active ? "Active" : "Inactive"}
                      size="small"
                      sx={{
                        backgroundColor: customer.active 
                          ? "rgba(34, 197, 94, 0.1)" 
                          : "rgba(239, 68, 68, 0.1)",
                        color: customer.active ? "success.main" : "error.main",
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                      <Tooltip title="Edit Customer" arrow>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenDialog(customer)}
                          sx={{ backgroundColor: "rgba(99, 102, 241, 0.1)" }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={customer.active ? "Deactivate Customer" : "Activate Customer"} arrow>
                        <IconButton
                          size="small"
                          color={customer.active ? "error" : "success"}
                          onClick={() => handleDelete(customer.customerId)}
                          sx={{ 
                            backgroundColor: customer.active 
                              ? "rgba(239, 68, 68, 0.1)" 
                              : "rgba(34, 197, 94, 0.1)" 
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

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            fontWeight: "bold",
            background: "linear-gradient(45deg, #4338ca 30%, #6366f1 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {editMode ? "Edit Customer" : "Add New Customer"}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ pt: 1 }}>
            <TextField
              fullWidth
              margin="normal"
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Contact Number"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              multiline
              rows={2}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.active}
                  onChange={handleSwitchChange}
                  name="active"
                />
              }
              label="Active"
              sx={{ mt: 2 }}
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}>
              <Button variant="outlined" onClick={handleClose} disabled={submitting}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                disabled={submitting}
                startIcon={submitting ? <CircularProgress size={20} /> : null}
              >
                {editMode ? "Update" : "Add"}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CustomerManagement;
