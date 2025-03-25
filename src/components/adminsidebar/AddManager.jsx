import React, { useState } from "react";
import { Card, CardContent, Typography, TextField, Button, Box, MenuItem } from "@mui/material";

const AddManager = () => {
  const [manager, setManager] = useState({
    name: "",
    email: "",
    role: "",
    contact: "",
    salary: "",
  });

  // Hardcoded unassigned categories for now
  const unassignedCategories = [
    { id: 1, name: "Electronics" },
    { id: 2, name: "Sports" },
    { id: 3, name: "Home Appliances" },
  ];

  const handleAdd = () => {
    console.log("Added Manager:", manager);
    setManager({ name: "", email: "", role: "", contact: "", salary: "" });
  };

  return (
    <Card sx={{ maxWidth: 500, mx: "auto", mt: 5, p: 2, borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
          Add New Manager
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField
            label="Full Name"
            variant="outlined"
            fullWidth
            value={manager.name}
            onChange={(e) => setManager({ ...manager, name: e.target.value })}
          />
          <TextField
            label="Email Address"
            variant="outlined"
            type="email"
            fullWidth
            value={manager.email}
            onChange={(e) => setManager({ ...manager, email: e.target.value })}
          />
          <TextField
            select
            label="Assigned Role"
            variant="outlined"
            fullWidth
            value={manager.role}
            onChange={(e) => setManager({ ...manager, role: e.target.value })}
          >
            {unassignedCategories.length > 0 ? (
              unassignedCategories.map((cat) => (
                <MenuItem key={cat.id} value={cat.name}>
                  {cat.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No unassigned categories</MenuItem>
            )}
          </TextField>
          <TextField
            label="Contact Number"
            variant="outlined"
            type="tel"
            fullWidth
            value={manager.contact}
            onChange={(e) => setManager({ ...manager, contact: e.target.value })}
          />
          <TextField
            label="Salary (₹)"
            variant="outlined"
            type="number"
            fullWidth
            value={manager.salary}
            onChange={(e) => setManager({ ...manager, salary: e.target.value })}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2, py: 1 }}
            fullWidth
            onClick={handleAdd}
            disabled={!manager.role}
          >
            Add Manager
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AddManager;
