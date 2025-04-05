const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error('Server returned non-JSON response');
  }

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }
  
  return data;
};

export const authService = {
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      return handleResponse(response);
    } catch (error) {
      if (error.message === 'Server returned non-JSON response') {
        throw new Error('Server error. Please try again later.');
      }
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('userData');
  },

  getStoredUser: () => {
    try {
      const userData = localStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error reading stored user data:', error);
      return null;
    }
  },

  isAuthenticated: () => {
    return !!authService.getStoredUser();
  },

  getRole: () => {
    const user = authService.getStoredUser();
    return user ? user.role : null;
  }
};