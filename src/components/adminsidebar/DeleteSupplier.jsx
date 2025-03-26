import React from 'react';
import { Paper, Typography, Button, Box, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const suppliers = [
    { name: 'Supplier A', company: 'Company A' },
    { name: 'Supplier B', company: 'Company B' }
];

const DeleteSupplier = () => {
    const handleDelete = (name) => {
        console.log(`Deleting supplier: ${name}`);
    };

    return (
        <Paper
            elevation={3}
            sx={{
                p: 3,
                borderRadius: 2,
                maxWidth: 500,
                mx: 'auto',
                mt: 4,
                boxShadow: 3,
            }}
        >
            <Typography variant="h5" fontWeight="bold" color="primary" textAlign="center">
                Delete Supplier
            </Typography>
            <Box sx={{ mt: 2 }}>
                {suppliers.map((supplier, index) => (
                    <Box key={supplier.name}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                p: 1.5,
                                borderRadius: 1,
                                bgcolor: 'background.paper',
                            }}
                        >
                            <Typography fontWeight="medium">
                                {supplier.name} - <Typography component="span" color="text.secondary">{supplier.company}</Typography>
                            </Typography>
                            <Button
                                variant="contained"
                                color="error"
                                size="small"
                                startIcon={<DeleteIcon />}
                                onClick={() => handleDelete(supplier.name)}
                                sx={{ textTransform: 'none' }}
                            >
                                Delete
                            </Button>
                        </Box>
                        {index < suppliers.length - 1 && <Divider sx={{ my: 1 }} />}
                    </Box>
                ))}
            </Box>
        </Paper>
    );
};

export default DeleteSupplier;
