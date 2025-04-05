import React, { useEffect, useState } from "react";
import axios from "axios";
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

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", contact: "" });

  // Fetch customers on load
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("/api/customers");
      const cleanedData = res.data.map((customer) => ({
        ...customer,
        name: customer.name.split(",")[0].trim(), // Remove address from name
      }));
      setCustomers(cleanedData);
    } catch (err) {
      console.error("Error fetching customers:", err);
    }
  };

  const handleOpenDialog = (customer = null) => {
    if (customer) {
      setEditMode(true);
      setCurrentCustomer(customer);
      setFormData({
        name: customer.name,
        email: customer.email,
        contact: customer.contact,
      });
    } else {
      setEditMode(false);
      setCurrentCustomer(null);
      setFormData({ name: "", email: "", contact: "" });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.contact.trim()) return;

    const cleanedFormData = {
      ...formData,
      name: formData.name.split(",")[0].trim(), // Remove address before submitting
    };

    try {
      if (editMode && currentCustomer) {
        await axios.put(`/api/customers/${currentCustomer._id}`, cleanedFormData);
      } else {
        await axios.post("/api/customers", cleanedFormData);
      }
      fetchCustomers();
      handleClose();
    } catch (err) {
      console.error("Error saving customer:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/customers/${id}`);
      fetchCustomers();
    } catch (err) {
      console.error("Error deleting customer:", err);
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
                <TableCell sx={{ fontWeight: "bold" }}>Orders</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((customer) => (
                <motion.tr
                  key={customer._id}
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
                      <Typography variant="body2">{customer.contact}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={`${customer.totalOrders || 0} orders`}
                      size="small"
                      sx={{
                        backgroundColor: "rgba(99, 102, 241, 0.1)",
                        color: "primary.main",
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
                      <Tooltip title="Delete Customer" arrow>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(customer._id)}
                          sx={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}
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
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}>
              <Button variant="outlined" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" variant="contained">
                {editMode ? "Update" : "Add"}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CustomerManagement;
