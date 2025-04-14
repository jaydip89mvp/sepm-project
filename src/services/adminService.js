import axios from 'axios';

const API_URL = 'http://localhost:8080/admin';

// Create axios instance with default config
const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add authorization header
axiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        console.log('Current token (Basic Auth string):', token);
        if (token) {
            // Use Basic Auth scheme
            config.headers.Authorization = `Basic ${token}`;
            console.log('Request headers with Basic Auth:', config.headers);
        } else {
            console.warn('No token found in localStorage for Basic Auth');
        }
        return config;
    },
    error => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
    response => {
        console.log('Response interceptor:', {
            url: response.config.url,
            status: response.status,
            data: response.data
        });
        return response;
    },
    error => {
        console.error('Response interceptor error:', {
            url: error.config?.url,
            status: error.response?.status,
            data: error.response?.data
        });
        if (error.response && error.response.status === 401) {
            if (!window.location.pathname.includes('/login')) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

const adminService = {
    // Get manager roles
    getManagerRoles: async () => {
        try {
            console.log('Fetching manager roles...');
            const response = await axiosInstance.get('/getmanagerroles');
            console.log('Raw manager roles response:', response);

            if (response.status === 200) {
                // Handle both array and object response formats
                const roles = Array.isArray(response.data) ? response.data :
                            (response.data.data ? response.data.data : []);
                
                return {
                    success: true,
                    data: roles.map(role => {
                        // Clean the role name by removing any MANAGER_ prefix and converting to display format
                        const cleanName = role.name.replace(/^MANAGER_/, '');
                        const displayName = cleanName.split('_').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                        ).join(' ');
                        
                        return {
                            id: role.id || Math.random().toString(36).substr(2, 9),
                            name: role.name,
                            displayName: displayName,
                            color: role.color || `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`
                        };
                    })
                };
            }
            throw new Error('Invalid response from server');
        } catch (error) {
            console.error('Error in getManagerRoles:', error);
            if (error.response) {
                throw new Error(error.response.data?.message || 'Failed to fetch manager roles');
            } else if (error.request) {
                throw new Error('Network error - no response received');
            }
            throw error;
        }
    },

    // Add new category
    addCategory: async (categoryData) => {
        try {
            // Format the category name - just convert to uppercase and replace spaces with underscores
            // Don't add MANAGER_ prefix as it's added by the backend
            const formattedName = categoryData.name.toUpperCase().replace(/\s+/g, '_');
            
            const response = await axiosInstance.post('/addcategories', {
                name: formattedName
            });

            if (response.status === 200 || response.status === 201) {
                return {
                    success: true,
                    message: 'Category added successfully',
                    data: response.data
                };
            } else {
                throw new Error(response.data || 'Failed to add category');
            }
        } catch (error) {
            console.error('Error in addCategory:', error);
            if (error.response) {
                // Handle specific error cases
                if (error.response.status === 409) {
                    throw new Error('This category already exists. Please use a different name.');
                }
                throw new Error(error.response.data || 'Failed to add category');
            }
            throw new Error('Network error while adding category');
        }
    },

    // Add new manager
    addManager: async (managerData) => {
        try {
            const response = await axiosInstance.post('/addmanager', managerData);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Update manager
    updateManager: async (managerData) => {
        try {
            const response = await axiosInstance.put('/updatemanager', managerData);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Get manager by email
    getManager: async (email) => {
        try {
            const response = await axiosInstance.get(`/getmanager?email=${email}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Get all managers
    getAllManagers: async () => {
        try {
            const response = await axiosInstance.get('/getallmanagers');
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Delete manager
    deleteManager: async (email) => {
        try {
            const response = await axiosInstance.put(`/deletemanager?email=${email}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Handle common errors
    handleError: (error) => {
        const errorDetails = {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
            config: error.config
        };
        console.error('Error details:', errorDetails);
        
        if (error.response) {
            switch (error.response.status) {
                case 409:
                    return {
                        message: 'Category already exists',
                        status: 409
                    };
                case 403:
                    return {
                        message: 'Access denied. Please check your permissions.',
                        status: 403
                    };
                case 401:
                    return {
                        message: 'Authentication required. Please log in again.',
                        status: 401
                    };
                default:
                    return {
                        message: error.response.data || 'An error occurred',
                        status: error.response.status
                    };
            }
        }
        return {
            message: 'Network error occurred',
            status: 500
        };
    },

    generateReport: async (month, year) => {
        try {
            const response = await axios.post(`${API_URL}/admin/generatereport`, {
                month: parseInt(month),
                year: parseInt(year)
            });
            return {
                success: true,
                data: response.data,
                message: "Report generated successfully"
            };
        } catch (error) {
            console.error("Error generating report:", error);
            return {
                success: false,
                message: error.response?.data || "Failed to generate report"
            };
        }
    },

    // Get all suppliers
    getAllSuppliers: async () => {
        try {
            const response = await axiosInstance.get('/getsuppliers');
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('Error fetching suppliers:', error);
            return {
                success: false,
                message: error.response?.data || 'Failed to fetch suppliers'
            };
        }
    },

    // Get supplier by name
    getSupplierByName: async (name) => {
        try {
            const response = await axiosInstance.get('/getsupplierbyname', {
                data: { name }
            });
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('Error fetching supplier:', error);
            return {
                success: false,
                message: error.response?.data || 'Failed to fetch supplier'
            };
        }
    },

    // Add new supplier
    addSupplier: async (supplierData) => {
        try {
            const response = await axiosInstance.post('/addsupplier', supplierData);
            return {
                success: true,
                data: response.data,
                message: 'Supplier added successfully'
            };
        } catch (error) {
            console.error('Error adding supplier:', error);
            return {
                success: false,
                message: error.response?.data || 'Failed to add supplier'
            };
        }
    },

    // Update supplier
    updateSupplier: async (supplierData) => {
        try {
            const response = await axiosInstance.put('/updatesupplier', supplierData);
            return {
                success: true,
                data: response.data,
                message: 'Supplier updated successfully'
            };
        } catch (error) {
            console.error('Error updating supplier:', error);
            return {
                success: false,
                message: error.response?.data || 'Failed to update supplier'
            };
        }
    },

    // Delete supplier (deactivate)
    deleteSupplier: async (supplierId) => {
        try {
            const response = await axiosInstance.put('/deletesupplier', { id: supplierId });
            return {
                success: true,
                data: response.data,
                message: 'Supplier deactivated successfully'
            };
        } catch (error) {
            console.error('Error deactivating supplier:', error);
            return {
                success: false,
                message: error.response?.data || 'Failed to deactivate supplier'
            };
        }
    },

    // Get all customers
    getAllCustomers: async () => {
        try {
            const response = await axiosInstance.get('/getcustomers');
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return adminService.handleError(error);
        }
    },

    // Get customer by name
    getCustomerByName: async (name) => {
        try {
            const response = await axiosInstance.get('/getcustomerbyname', {
                data: { name }
            });
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return adminService.handleError(error);
        }
    },

    // Add a new customer
    addCustomer: async (customerData) => {
        try {
            const response = await axiosInstance.post('/addcustomer', customerData);
            return {
                success: true,
                data: response.data,
                message: 'Customer added successfully'
            };
        } catch (error) {
            return adminService.handleError(error);
        }
    },

    // Update an existing customer
    updateCustomer: async (customerData) => {
        try {
            const response = await axiosInstance.put('/updatecustomer', customerData);
            return {
                success: true,
                data: response.data,
                message: 'Customer updated successfully'
            };
        } catch (error) {
            return adminService.handleError(error);
        }
    },

    // Delete a customer
    deleteCustomer: async (customerId) => {
        try {
            const response = await axiosInstance.put('/deletecustomer', { id: customerId });
            return {
                success: true,
                data: response.data,
                message: 'Customer deleted successfully'
            };
        } catch (error) {
            return adminService.handleError(error);
        }
    }
};

export default adminService; 