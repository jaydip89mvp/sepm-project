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
    }
};

export default managerService;