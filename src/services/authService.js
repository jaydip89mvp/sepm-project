const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    console.error('Server returned non-JSON response:', text);
    throw new Error(`Server error: ${response.status} ${response.statusText}. Response: ${text}`);
  }

  const data = await response.json();
  
  if (!response.ok) {
    const errorMessage = data.message || data.error || `Authentication failed with status ${response.status}`;
    console.error('Authentication error response:', data);
    throw new Error(errorMessage);
  }
  
  return data;
};

export const authService = {
  login: async (email, password) => {
    try {
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();
      console.log('Attempting login with email:', trimmedEmail);
      
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          email: trimmedEmail,
          password: trimmedPassword
        }),
      });

      console.log('Login response status:', response.status);

      if (response.status === 401) {
        throw new Error('Invalid email or password');
      }
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) { /* Ignore if not JSON */ }
        const errorMessage = errorData?.message || errorData?.error || `Login failed with status ${response.status}`;
        throw new Error(errorMessage);
      }

      const data = await handleResponse(response); 
      console.log('Login successful, received data:', data);

      if (!data.email || !data.role) {
         console.error("Login response missing required fields (email, role):", data);
         throw new Error("Invalid response data from server after login.");
      }

      const basicToken = btoa(`${trimmedEmail}:${trimmedPassword}`); 
      
      localStorage.setItem('token', basicToken); 
      
      localStorage.setItem('userData', JSON.stringify({
        email: data.email,
        role: data.role
      }));
      
      return { email: data.email, role: data.role }; 

    } catch (error) {
      console.error('Login error in authService:', error);
      throw error; 
    }
  },

  logout: async () => {
    try {
      const token = localStorage.getItem('token');

      if (token && API_URL) { 
         try {
            await fetch(`${API_URL}/logout`, {
               method: 'POST',
               headers: {
                  'Authorization': `Basic ${token}`,
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
               },
            });
            console.log('Logout signal sent to backend.');
         } catch (backendLogoutError) {
            console.warn('Failed to notify backend on logout:', backendLogoutError);
         }
      }
      
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      console.log('Client-side logout successful.');
      
      return true; 

    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      throw error; 
    }
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
    return !!localStorage.getItem('token') && !!authService.getStoredUser();
  },

  getRole: () => {
    const user = authService.getStoredUser();
    return user ? user.role : null;
  }
};