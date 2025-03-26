import React from 'react';
import { Paper, Typography, Button, Box, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const customers = [
    { name: 'Customer A', email: 'customerA@example.com' },
    { name: 'Customer B', email: 'customerB@example.com' }
];

const DeleteCustomer = () => {
    const handleDelete = (email) => {
        console.log(`Deleting customer with email: ${email}`);
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
                Delete Customer
            </Typography>
            <Box sx={{ mt: 2 }}>
                {customers.map((customer, index) => (
                    <Box
                        key={customer.email}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            p: 1,
                            borderRadius: 1,
                            bgcolor: 'background.paper',
                        }}
                    >
                        <Typography fontWeight="medium">{customer.name}</Typography>
                        <Button
                            variant="contained"
                            color="error"
                            size="small"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleDelete(customer.email)}
                            sx={{ textTransform: 'none' }}
                        >
                            Delete
                        </Button>
                    </Box>
                ))}
            </Box>
        </Paper>
    );
};

export default DeleteCustomer;
