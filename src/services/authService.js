const API_URL = 'http://localhost:8080/api'

export const authService = {
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message)
      }
      
      return data
    } catch (error) {
      throw error
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userData')
  },

  getCurrentUser: () => {
    const userData = localStorage.getItem('userData')
    return userData ? JSON.parse(userData) : null
  },

  getToken: () => {
    return localStorage.getItem('token')
  },

  getUserRole: () => {
    return localStorage.getItem('userRole')
  }
}