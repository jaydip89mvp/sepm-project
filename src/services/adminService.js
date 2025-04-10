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
            
            // If the response is empty or invalid, return empty array
            if (!response.data) {
                console.warn('Empty response data received');
                return { data: [] };
            }

            // If the response is a string message (like "Access is denied"), return empty array
            if (typeof response.data === 'string') {
                console.warn('String response received:', response.data);
                return { data: [] };
            }

            // Ensure we have an array and filter for MANAGER_ roles
            let roles = Array.isArray(response.data) ? response.data : [response.data];
            roles = roles.filter(role => role && role.name && role.name.startsWith('MANAGER_'));
            
            console.log('Filtered manager roles:', roles);
            return { data: roles };
        } catch (error) {
            console.error('Error in getManagerRoles:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            throw error;
        }
    },

    // Add new category
    addCategory: async (category) => {
        try {
            if (!category.name) {
                throw new Error('Category name is required');
            }

            // Remove MANAGER_ prefix if it exists, then add it back to ensure consistency
            const cleanName = category.name.replace('MANAGER_', '');
            const categoryData = {
                name: cleanName, // Backend will add MANAGER_ prefix
                description: category.description || "Manager Category"
            };

            console.log('Adding category with data:', categoryData);
            
            const response = await axiosInstance.post('/addcategories', categoryData);
            console.log('Add category response:', response);

            // If the response indicates success
            if (response.status === 200) {
                // Wait a short moment before fetching updated categories
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Fetch updated categories
                const updatedResponse = await adminService.getManagerRoles();
                console.log('Updated categories after addition:', updatedResponse);

                // Verify the new category exists
                const newCategoryExists = updatedResponse.data.some(
                    role => role.name === `MANAGER_${cleanName}`
                );

                if (!newCategoryExists) {
                    console.warn('Added category not found in updated list');
                }
            }

            return response;
        } catch (error) {
            console.error('Error in addCategory:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            throw error;
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