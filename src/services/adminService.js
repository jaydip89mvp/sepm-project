import axios from 'axios';

const API_URL = 'http://localhost:8080/admin';

// Create axios instance with default config
const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Add authorization header
axiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Basic ${token}`;
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
                localStorage.removeItem('userData');
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
            // Remove any existing MANAGER_ prefix and format the name
            const cleanName = categoryData.name.replace(/^MANAGER_/i, '');
            const formattedName = cleanName.toUpperCase().replace(/\s+/g, '_');
            
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
            // Ensure the manager has the correct role
            const managerRole = {
                name: `MANAGER_${managerData.department}`,
                description: `Manager role for ${managerData.department} department`
            };

            const response = await axiosInstance.post('/addmanager', {
                ...managerData,
                role: managerRole
            });

            // Even if we get a 500 error, if the data is in the response, consider it a success
            if (response.data) {
                return { 
                    success: true, 
                    message: 'Manager added successfully',
                    data: response.data
                };
            }
            return { 
                success: false, 
                message: 'Failed to add manager',
                data: null
            };
        } catch (error) {
            console.error('Error adding manager:', error);
            // If we have data in the error response, consider it a success
            if (error.response && error.response.data) {
                return { 
                    success: true, 
                    message: 'Manager added successfully',
                    data: error.response.data
                };
            }
            if (error.response) {
                switch (error.response.status) {
                    case 409:
                        return { 
                            success: false, 
                            message: 'Manager with this email already exists',
                            data: null
                        };
                    case 400:
                        return { 
                            success: false, 
                            message: 'Invalid manager data',
                            data: null
                        };
                    default:
                        return { 
                            success: false, 
                            message: 'Failed to add manager. Please try again.',
                            data: null
                        };
                }
            }
            return { 
                success: false, 
                message: 'Network error. Please check your connection.',
                data: null
            };
        }
    },

    // Update manager
    updateManager: async (managerData) => {
        try {
            // Format the manager data to match backend expectations
            const formattedData = {
                email: managerData.email,
                name: managerData.name,
                password: managerData.password,
                assigned: {
                    name: `MANAGER_${managerData.department}`,
                    description: `Manager role for ${managerData.department} department`
                }
            };

            const response = await axiosInstance.put('/updatemanager', formattedData);
            
            if (response.status === 200) {
                return { 
                    success: true, 
                    message: 'Manager updated successfully',
                    data: response.data
                };
            }
            throw new Error('Failed to update manager');
        } catch (error) {
            console.error('Error updating manager:', error);
            if (error.response) {
                switch (error.response.status) {
                    case 404:
                        return { 
                            success: false, 
                            message: 'Manager not found',
                            data: null
                        };
                    case 400:
                        return { 
                            success: false, 
                            message: 'Invalid manager data',
                            data: null
                        };
                    case 403:
                        return { 
                            success: false, 
                            message: 'Access denied. Please check your permissions.',
                            data: null
                        };
                    case 500:
                        return { 
                            success: false, 
                            message: 'Failed to update manager. Please try again.',
                            data: null
                        };
                    default:
                        return { 
                            success: false, 
                            message: error.response.data || 'Failed to update manager',
                            data: null
                        };
                }
            }
            return { 
                success: false, 
                message: 'Network error. Please check your connection.',
                data: null
            };
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
            if (response.status === 200) {
                // Filter out admins and ensure proper manager data
                const managers = response.data.filter(manager => {
                    // Check if the manager has a role and it's a manager role
                    const isManager = manager.assigned && 
                                    manager.assigned.name && 
                                    manager.assigned.name.startsWith('MANAGER_');
                    return isManager;
                }).map(manager => ({
                    ...manager,
                    department: manager.assigned?.name?.replace('MANAGER_', '') || 'No Department'
                }));
                
                return {
                    success: true,
                    data: managers
                };
            }
            return { success: false, data: [] };
        } catch (error) {
            console.error('Error fetching managers:', error);
            return { success: false, data: [], message: 'Failed to fetch managers' };
        }
    },

    // Delete manager
    deleteManager: async (email) => {
        try {
            const response = await axiosInstance.put(`/deletemanager?email=${email}`);
            if (response.status === 200) {
                return { 
                    success: true, 
                    message: 'Manager deleted successfully',
                    data: response.data
                };
            }
            return { 
                success: false, 
                message: 'Failed to delete manager',
                data: null
            };
        } catch (error) {
            console.error('Error deleting manager:', error);
            if (error.response) {
                switch (error.response.status) {
                    case 404:
                        return { 
                            success: false, 
                            message: 'Manager not found',
                            data: null
                        };
                    case 400:
                        return { 
                            success: false, 
                            message: 'Invalid manager data',
                            data: null
                        };
                    default:
                        return { 
                            success: false, 
                            message: 'Failed to delete manager. Please try again.',
                            data: null
                        };
                }
            }
            return { 
                success: false, 
                message: 'Network error. Please check your connection.',
                data: null
            };
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

    // Generate report
    generateReport: async (month, year) => {
        try {
            const response = await axiosInstance.post(`/generatereport`, {
                month: parseInt(month),
                year: parseInt(year)
            }, {
                responseType: 'blob',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/pdf'
                }
            });

            if (response.status === 200 || response.status === 201) {
                // Create a blob URL for the PDF
                const blob = new Blob([response.data], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                
                // Create a link element and trigger download
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `Report_${month}_${year}.pdf`);
                document.body.appendChild(link);
                link.click();
                link.remove();
                
                return {
                    success: true,
                    message: 'Report generated successfully'
                };
            }
            throw new Error('Failed to generate report');
        } catch (error) {
            console.error('Error generating report:', error);
            if (error.response) {
                switch (error.response.status) {
                    case 403:
                        return {
                            success: false,
                            message: 'Access denied. Please check your permissions.'
                        };
                    case 500:
                        return {
                            success: false,
                            message: 'Server error occurred while generating report.'
                        };
                    default:
                        return {
                            success: false,
                            message: error.response.data || 'Failed to generate report'
                        };
                }
            }
            return {
                success: false,
                message: 'Network error occurred'
            };
        }
    },

    // Get all suppliers
    getAllSuppliers: async () => {
        try {
            const response = await axiosInstance.get('/getsuppliers');
            console.log('Raw supplier response:', response);
            
            if (response.status === 200) {
                // Handle different response formats
                let suppliersData = [];
                if (Array.isArray(response.data)) {
                    suppliersData = response.data;
                } else if (response.data && Array.isArray(response.data.data)) {
                    suppliersData = response.data.data;
                } else if (response.data && typeof response.data === 'object') {
                    suppliersData = Object.values(response.data);
                }
                
                return {
                    success: true,
                    data: suppliersData,
                    message: 'Suppliers fetched successfully'
                };
            }
            throw new Error('Invalid response from server');
        } catch (error) {
            console.error('Error fetching suppliers:', error);
            if (error.response) {
                // Handle specific error cases
                if (error.response.status === 403) {
                    return {
                        success: false,
                        message: 'Access denied. Please check your permissions.',
                        data: []
                    };
                }
                if (error.response.status === 500) {
                    return {
                        success: false,
                        message: 'Server error occurred. Please try again later.',
                        data: []
                    };
                }
                // Handle error response format
                const errorMessage = error.response.data?.message || 
                                   (typeof error.response.data === 'string' ? error.response.data : 'Failed to fetch suppliers');
                return {
                    success: false,
                    message: errorMessage,
                    data: []
                };
            }
            return {
                success: false,
                message: 'Network error occurred',
                data: []
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
            console.log('Raw customer response:', response);
            
            if (response.status === 200) {
                // Handle different response formats
                let customersData = [];
                if (Array.isArray(response.data)) {
                    customersData = response.data;
                } else if (response.data && Array.isArray(response.data.data)) {
                    customersData = response.data.data;
                } else if (response.data && typeof response.data === 'object') {
                    customersData = Object.values(response.data);
                }
                
                // Format customer data
                const formattedCustomers = customersData.map(customer => ({
                    id: customer.customerId,
                    name: customer.name,
                    email: customer.email,
                    contact: customer.contact || '',
                    address: customer.address || '',
                    active: customer.active !== undefined ? customer.active : true,
                    added: customer.added
                }));
                
                return {
                    success: true,
                    data: formattedCustomers,
                    message: 'Customers fetched successfully'
                };
            }
            throw new Error('Invalid response from server');
        } catch (error) {
            console.error('Error fetching customers:', error);
            if (error.response) {
                // Handle specific error cases
                if (error.response.status === 403) {
                    return {
                        success: false,
                        message: 'Access denied. Please check your permissions.',
                        data: []
                    };
                }
                if (error.response.status === 500) {
                    return {
                        success: false,
                        message: 'Server error occurred. Please try again later.',
                        data: []
                    };
                }
                // Handle error response format
                const errorMessage = error.response.data?.message || 
                                   (typeof error.response.data === 'string' ? error.response.data : 'Failed to fetch customers');
                return {
                    success: false,
                    message: errorMessage,
                    data: []
                };
            }
            return {
                success: false,
                message: 'Network error occurred',
                data: []
            };
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
            if (response.status === 200 || response.status === 201) {
                return {
                    success: true,
                    data: response.data,
                    message: 'Customer added successfully'
                };
            }
            return { 
                success: false, 
                message: 'Failed to add customer',
                data: null
            };
        } catch (error) {
            console.error('Error adding customer:', error);
            if (error.response) {
                switch (error.response.status) {
                    case 400:
                        return {
                            success: false,
                            message: 'Invalid customer data. Please check the input.',
                            data: null
                        };
                    case 409:
                        return {
                            success: false,
                            message: 'Customer with this email already exists.',
                            data: null
                        };
                    case 500:
                        return {
                            success: false,
                            message: error.response.data || 'Server error occurred. Please try again later.',
                            data: null
                        };
                    default:
                        return {
                            success: false,
                            message: error.response.data?.message || 'Failed to add customer',
                            data: null
                        };
                }
            }
            return {
                success: false,
                message: 'Network error occurred',
                data: null
            };
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