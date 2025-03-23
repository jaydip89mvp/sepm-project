import React, { useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Autocomplete,
} from '@mui/material';

const UpdateStock = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState('');

  // Mock products data - replace with API call
  const products = [
    { id: 1, name: 'Product 1', currentStock: 100 },
    { id: 2, name: 'Product 2', currentStock: 50 },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add API call to update stock
    console.log('Update stock:', { product: selectedProduct, quantity });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Update Stock
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Autocomplete
              options={products}
              getOptionLabel={(option) => option.name}
              onChange={(_, newValue) => setSelectedProduct(newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Select Product" required />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Quantity to Add/Remove"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              helperText="Use negative values to remove stock"
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit">
              Update Stock
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default UpdateStock;