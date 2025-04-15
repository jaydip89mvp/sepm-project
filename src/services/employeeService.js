import axios from 'axios';

const API_URL = 'http://localhost:8080/employee';

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

const employeeService = {
    // Get product categories for employee
    getProductCategories: async () => {
        try {
            const response = await axiosInstance.get('/getproductcategory');
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return handleError(error);
        }
    },

    // Get product by ID
    getproduct: async (productId) => {
        try {
            const response = await axiosInstance.get('/getproduct', {
                data: { id: productId }
            });
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return handleError(error);
        }
    },
  
    getallproducts: async () => {
        try {
            const response = await axiosInstance.get('/getallproducts');
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return handleError(error);
        }
    },
    // Get low stock products
    getLowStockalert: async () => {
        try {
            const response = await axiosInstance.get('/getlowstockalert');
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return handleError(error);
        }
    },

    // Get low stock alerts
    getLowStockAlerts: async () => {
        try {
            const response = await axiosInstance.post('/getlowstockalert');
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return handleError(error);
        }
    },

    // Create new product
    createProduct: async (productData) => {
        try {
            // Format product data according to backend model
            const formattedProduct = {
                name: productData.name,
                mainCategory: productData.mainCategory,
                subCategory: productData.subCategory || '',
                description: productData.description || '',
                stockLevel: parseInt(productData.stockLevel) || 0,
                reorderLevel: parseInt(productData.reorderLevel) || 0,
                active: productData.active !== undefined ? productData.active : true
            };

            const response = await axiosInstance.post('/createnewproduct', formattedProduct);
            return {
                success: true,
                data: response.data,
                message: 'Product created successfully'
            };
        } catch (error) {
            return handleError(error);
        }
    },

    // Update product
    updateProduct: async (productData) => {
        try {
            // Format product data according to backend model
            const formattedProduct = {
                productId: productData.productId,
                name: productData.name,
                subCategory: productData.subCategory || '',
                stockLevel: parseInt(productData.stockLevel) || 0,
                reorderLevel: parseInt(productData.reorderLevel) || 0,

            };

            const response = await axiosInstance.put('/updateproduct', formattedProduct);
            return {
                success: true,
                data: response.data,
                message: 'Product updated successfully'
            };
        } catch (error) {
            return handleError(error);
        }
    },

    // Delete product
    deleteProduct: async (productId) => {
        try {
            const response = await axiosInstance.put('/deleteproduct', { id: productId });
            return {
                success: true,
                data: response.data,
                message: 'Product deleted successfully'
            };
        } catch (error) {
            return handleError(error);
        }
    },

    // Add refill request
    addRefillRequest: async (refillData) => {
        try {
            // Format refill data according to backend model
            const formattedRefill = {
                productId: refillData.productId,
                quantity: parseInt(refillData.quantity) || 0,
                priority: refillData.priority || 'NORMAL',
                additional: refillData.additional || '',
                cost: parseFloat(refillData.cost) || 0,
                price: parseFloat(refillData.price) || 0,
                status: 'PENDING'
            };

            const response = await axiosInstance.post('/addrefillrequest', formattedRefill);
            return {
                success: true,
                data: response.data,
                message: 'Refill request added successfully'
            };
        } catch (error) {
            return handleError(error);
        }
    },

    // Get refill requests
    getRefillRequests: async () => {
        try {
            const response = await axiosInstance.get('/getrefillrequests');
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return handleError(error);
        }
    },

    // Get stock history
    getStockHistory: async () => {
        try {
            const response = await axiosInstance.get('/stockhistory');
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return handleError(error);
        }
    },

    // Get product by ID with full details
    getProductDetails: async (productId) => {
        try {
            const response = await axiosInstance.get('/getproduct', {
                data: { id: productId }
            });
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return handleError(error);
        }
    },

    // Get all products for employee
    getAllProducts: async () => {
        try {
            const response = await axiosInstance.get('/getallproducts');
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return handleError(error);
        }
    },

    // Update product stock level
    updateProductStock: async (productId, quantity, type) => {
        try {
            const response = await axiosInstance.put('/updateproductstock', {
                productId: productId,
                quantity: parseInt(quantity),
                type: type // 'ADD' or 'REMOVE'
            });
            return {
                success: true,
                data: response.data,
                message: `Stock ${type === 'ADD' ? 'added' : 'removed'} successfully`
            };
        } catch (error) {
            return handleError(error);
        }
    }
};

export default employeeService; 