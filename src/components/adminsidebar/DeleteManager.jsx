import React from 'react';
import { Paper, Typography, Button, Box, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const managers = [
    { name: 'Manager A', role: 'Role A', email: 'managerA@example.com' },
    { name: 'Manager B', role: 'Role B', email: 'managerB@example.com' }
];

const DeleteManager = () => {
    const handleDelete = (email) => {
        console.log(`Deleting manager with email: ${email}`);
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
                Delete Manager
            </Typography>
            <Box sx={{ mt: 2 }}>
                {managers.map((manager, index) => (
                    <Box key={manager.email}>
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
                                {manager.name} - <Typography component="span" color="text.secondary">{manager.role}</Typography>
                            </Typography>
                            <Button
                                variant="contained"
                                color="error"
                                size="small"
                                startIcon={<DeleteIcon />}
                                onClick={() => handleDelete(manager.email)}
                                sx={{ textTransform: 'none' }}
                            >
                                Delete
                            </Button>
                        </Box>
                        {index < managers.length - 1 && <Divider sx={{ my: 1 }} />}
                    </Box>
                ))}
            </Box>
        </Paper>
    );
};

export default DeleteManager;
