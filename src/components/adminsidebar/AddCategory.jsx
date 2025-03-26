import React, { useState } from "react";
import { Paper, Typography, TextField, Button, Box, Card, CardContent } from "@mui/material";

const AddCategory = () => {
  const [category, setCategory] = useState({ name: "", description: "" });

  const handleAdd = () => {
    console.log("Added Category:", category);
    setCategory({ name: "", description: "" });
  };

  return (
    <Card sx={{ maxWidth: 500, mx: "auto", mt: 5, p: 2, borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
          Add New Category
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField
            label="Category Name"
            variant="outlined"
            fullWidth
            value={category.name}
            onChange={(e) => setCategory({ ...category, name: e.target.value })}
          />
          <TextField
            label="Description"
            variant="outlined"
            multiline
            rows={3}
            fullWidth
            value={category.description}
            onChange={(e) => setCategory({ ...category, description: e.target.value })}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2, py: 1 }}
            fullWidth
            onClick={handleAdd}
          >
            Add Category
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AddCategory;
