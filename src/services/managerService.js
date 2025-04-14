import axios from 'axios';

const API_URL = 'http://localhost:8080/manager';

// Create axios instance with default config
const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true
});

// Add authorization header
axiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            // Use Basic auth as the backend expects
            config.headers.Authorization = `Basic ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            // Only redirect if not already on login page to avoid infinite loop
            if (!window.location.pathname.includes('/login')) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

const managerService = {
    // Employee Management
    getEmployeeRoles: () => {
        return axiosInstance.get('/getemployeeroles');
    },

    addCategory: (category) => {
        return axiosInstance.post('/addcategories', category);
    },

    addEmployee: (employee) => {
        return axiosInstance.post('/addemployee', employee);
    },

    updateEmployee: (employee) => {
        return axiosInstance.put('/updateEmployee', employee);
    },

    getEmployee: (email) => {
        return axiosInstance.get(`/getemployee?email=${email}`);
    },

    getAllEmployees: () => {
        return axiosInstance.get('/getallemployees');
    },

    deleteEmployee: (email) => {
        return axiosInstance.put(`/deleteemployee?email=${email}`);
    },

    // Supplier Order Management
    addSupplierOrder: (order) => {
        return axiosInstance.post('/supplierorder/addorder', order);
    },

    updateSupplierOrderStatus: (id, status) => {
        return axiosInstance.put('/supplierorder/updatestatus', { id, status });
    },

    getSupplierOrders: () => {
        return axiosInstance.get('/supplierorder/all');
    },

    // Customer Order Management
    addCustomerOrder: (order) => {
        return axiosInstance.post('/customerorder/add', order);
    },

    updateCustomerOrderStatus: (id, status) => {
        return axiosInstance.put('/customerorder/updatestatus', { id, status });
    },

    getCustomerOrders: () => {
        return axiosInstance.get('/customerorder/all');
    },

    // Payment Management
    addPayment: (payment) => {
        return axiosInstance.post('/payment/add', payment);
    },

    updatePayment: (payment) => {
        return axiosInstance.put('/payment/update', payment);
    },

    getPayments: () => {
        return axiosInstance.get('/payment/all');
    },

    // Refill Management
    getRefills: (status) => {
        return axiosInstance.get(`/refill/getrefills?status=${status}`);
    },

    updateRefill: (refill) => {
        return axiosInstance.post('/refill/updaterefill', refill);
    },

    // Category Management
    getCategories: () => {
        return axiosInstance.get('/categories');
    },

    // Report Generation
    generateReport: (month, year) => {
        return axiosInstance.get(`/generatereport?month=${month}&year=${year}`, {
            responseType: 'blob'
        });
    },

    // Direct Employee Entry
    createDirectEmployee: async (employeeData) => {
        try {
            // Format the employee data
            const formattedData = {
                email: employeeData.email,
                name: `${employeeData.firstName} ${employeeData.lastName}`,
                password: employeeData.password,
                assigned: {
                    name: `EMPLOYEE_${employeeData.role}`,
                    description: `Employee role for ${employeeData.role} department`
                },
                active: true
            };

            const response = await axiosInstance.post('/addemployee', formattedData);
            
            if (response.status === 200) {
                return {
                    success: true,
                    message: 'Employee added successfully',
                    data: response.data
                };
            }
            throw new Error('Failed to add employee');
        } catch (error) {
            console.error('Error creating employee:', error);
            if (error.response) {
                switch (error.response.status) {
                    case 409:
                        return {
                            success: false,
                            message: 'Employee with this email already exists'
                        };
                    case 403:
                        return {
                            success: false,
                            message: 'Access denied. Please check your permissions.'
                        };
                    case 500:
                        return {
                            success: false,
                            message: 'Server error occurred while adding employee'
                        };
                    default:
                        return {
                            success: false,
                            message: error.response.data || 'Failed to add employee'
                        };
                }
            }
            return {
                success: false,
                message: 'Network error occurred'
            };
        }
    }
};

export default managerService;