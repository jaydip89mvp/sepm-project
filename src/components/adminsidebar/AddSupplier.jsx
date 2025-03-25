import React, { useState } from 'react';
import { Paper, Typography, TextField, Button, Box } from '@mui/material';

const AddSupplier = () => {
  const [supplier, setSupplier] = useState({ name: '', company: '', contact: '' });

  const handleAdd = () => {
    console.log('Added Supplier:', supplier);
    setSupplier({ name: '', company: '', contact: '' });
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 2,
        maxWidth: 450,
        mx: 'auto',
        mt: 4,
        boxShadow: 3,
      }}
    >
      <Typography variant="h5" fontWeight="bold" color="primary" textAlign="center">
        Add New Supplier
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
        <TextField
          label="Supplier Name"
          variant="outlined"
          fullWidth
          value={supplier.name}
          onChange={(e) => setSupplier({ ...supplier, name: e.target.value })}
        />
        <TextField
          label="Company Name"
          variant="outlined"
          fullWidth
          value={supplier.company}
          onChange={(e) => setSupplier({ ...supplier, company: e.target.value })}
        />
        <TextField
          label="Contact Number"
          type="tel"
          variant="outlined"
          fullWidth
          value={supplier.contact}
          onChange={(e) => setSupplier({ ...supplier, contact: e.target.value })}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2, borderRadius: 2, textTransform: 'none', py: 1.2 }}
          onClick={handleAdd}
        >
          Add Supplier
        </Button>
      </Box>
    </Paper>
  );
};

export default AddSupplier;
