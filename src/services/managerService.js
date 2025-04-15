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
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Get current manager's email from token
const getCurrentManagerEmail = () => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            // The token is already in base64 format, no need to decode
            const [email] = token.split(':');
            return email;
        } catch (error) {
            console.error('Error getting manager email:', error);
            return null;
        }
    }
    return null;
};

const managerService = {
    // Employee Management
    getEmployeeRoles: () => {
        return axiosInstance.get('/getemployeeroles');
    },

    addCategory: async (category) => {
        try {
            const roleData = {
                id: null,  // MongoDB will generate this
                name: category.name, // The backend will prefix with EMPLOYEE_
                addedby: null  // The backend will set this
            };
            const response = await axiosInstance.post('/addcategories', roleData);
            return response;
        } catch (error) {
            console.error('Error adding category:', error);
            throw error;
        }
    },

    getCategories: async () => {
        try {
            const response = await axiosInstance.get('/getemployeeroles');
            return response.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

    addEmployee: (employee) => {
        const formattedEmployee = {
            email: employee.email,
            password: employee.password,
            contact: employee.contact,
            salary: parseFloat(employee.salary || 0.0),
            assigned: {
                id: employee.role._id,
                name: employee.role.name,
                addedby: employee.role.addedby
            }
        };
        return axiosInstance.post('/addemployee', formattedEmployee);
    },

    updateEmployee: (employee) => {
        const formattedEmployee = {
            email: employee.email,
            contact: employee.contact,
            salary: parseFloat(employee.salary || 0.0),
            assigned: {
                id: employee.role._id,
                name: employee.role.name,
                addedby: employee.role.addedby
            }
        };
        return axiosInstance.put('/updateEmployee', formattedEmployee);
    },

    getEmployee: (email) => {
        return axiosInstance.post('/getemployee', { email });
    },

    getAllEmployees: () => {
        return axiosInstance.get('/getallemployees');
    },

    deleteEmployee: (email) => {
        return axiosInstance.put(`/deleteemployee?email=${email}`);
    },


    // Supplier Order Management
    addSupplierOrder: (order) => {
        const formattedOrder = {
            ...order,
            status: order.status || 'Pending'  // Ensure default status is set
        };
        return axiosInstance.post('/supplierorder/addorder', formattedOrder);
    },

    getSupplierOrders: (status = 'ALL') => {
        return axiosInstance.post('/supplierorder/getorders', { 
            status: status === 'ALL' ? status : status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
        });
    },

    updateSupplierOrderStatus: (id, status) => {
        // Ensure status is properly capitalized
        const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
        return axiosInstance.put('/supplierorder/updatestatus', {
            id,
            status: formattedStatus
        });
    },



    // Customer Order Management
    addCustomerOrder: (order) => {
        return axiosInstance.post('/customerorder/add', order);
    },

    getCustomerOrders: (status = 'ALL') => {
        return axiosInstance.post('/customerorder/getorders', { status });
    },

    updateCustomerOrderStatus: (id, status) => {
        return axiosInstance.put('/customerorder/updatestatus', {
            id,
            status
        });
    },

    // Payment Management
    getPayment: (id) => {
        return axiosInstance.post('/payment/getpayment', { id });
    },

    addPayment: (payment) => {
        const formattedPayment = {
            orderId: payment.orderId,
            amount: parseFloat(payment.amount || 0.0),
            orderType: payment.orderType, // "Supplier" or "Customer"
            status: payment.status || 'PENDING',
            paymentDate: payment.paymentDate || new Date().toISOString()
        };
        return axiosInstance.post('/payment/addpayment', formattedPayment);
    },

    updatePayment: (payment) => {
        const formattedPayment = {
            paymentId: payment.paymentId,
            orderId: payment.orderId,
            amount: parseFloat(payment.amount || 0.0),
            orderType: payment.orderType,
            status: payment.status,
            paymentDate: payment.paymentDate
        };
        return axiosInstance.put('/payment/updatepayment', formattedPayment);
    },

    // Refill Management
    getRefills: (status) => {
        return axiosInstance.post('/refill/getrefills', { status });
    },

    updateRefill: (refill) => {
        const formattedRefill = {
            id: refill.id,
            status: refill.status,
            updateDate: new Date().toISOString()
        };
        return axiosInstance.put('/refill/updaterefill', formattedRefill);
    },

    // Report Generation
    generateReport: (month, year) => {
        return axiosInstance.get(`/generatereport?month=${month}&year=${year}`, {
            responseType: 'blob'
        });
    }
};

export default managerService;