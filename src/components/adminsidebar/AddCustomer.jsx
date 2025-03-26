import React, { useState } from "react";
import { Card, CardContent, Typography, TextField, Button, Box } from "@mui/material";

const AddCustomer = () => {
  const [customer, setCustomer] = useState({ name: "", email: "", contact: "" });

  const handleAdd = () => {
    console.log("Added Customer:", customer);
    setCustomer({ name: "", email: "", contact: "" });
  };

  return (
    <Card sx={{ maxWidth: 500, mx: "auto", mt: 5, p: 2, borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
          Add New Customer
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField
            label="Full Name"
            variant="outlined"
            fullWidth
            value={customer.name}
            onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
          />
          <TextField
            label="Email Address"
            variant="outlined"
            type="email"
            fullWidth
            value={customer.email}
            onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
          />
          <TextField
            label="Contact Number"
            variant="outlined"
            type="tel"
            fullWidth
            value={customer.contact}
            onChange={(e) => setCustomer({ ...customer, contact: e.target.value })}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2, py: 1 }}
            fullWidth
            onClick={handleAdd}
          >
            Add Customer
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AddCustomer;
