import React, { useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Autocomplete,
} from '@mui/material';

const UpdateStock = ({ products, onUpdate }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedProduct || !quantity) {
      setError('Please fill all required fields');
      return;
    }
    
    const newQuantity = selectedProduct.currentStock + parseInt(quantity);
    if (newQuantity < 0) {
      setError('Cannot reduce stock below 0');
      return;
    }
    
    onUpdate({
      ...selectedProduct,
      currentStock: newQuantity
    });
    
    // Reset form
    setSelectedProduct(null);
    setQuantity('');
    setError('');
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