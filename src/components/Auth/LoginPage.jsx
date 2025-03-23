import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './LoginPage.css'

export const LoginPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }
const role='admin'
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (!formData.username || !formData.password) {
      setError('Please fill in all fields')
      setIsLoading(false)
      return
    }
    
      // Route based on user role
      switch (role) {
        case 'admin':
          navigate('/admin/dashboard')
          break
        case 'manager':
          navigate('/manager/dashboard')
          break
        case 'employee':
          navigate('/employee/dashboard')
          break
        default:
          throw new Error('Invalid role')
      }
    // try {
    //   const response = await fetch('http://localhost:8080/api/auth/login', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(formData)
    //   })

    //   const data = await response.json()

    //   if (!response.ok) {
    //     throw new Error(data.message || 'Login failed')
    //   }

    //   // Store the token and user info in localStorage
    //   localStorage.setItem('token', data.token)
    //   localStorage.setItem('userRole', data.role)
    //   localStorage.setItem('userData', JSON.stringify(data.user))
       
    //   const role='admin'
    //   // Route based on user role
    //   switch ('role') {
    //     case 'admin':
    //       navigate('/admin/dashboard')
    //       break
    //     case 'manager':
    //       navigate('/manager/dashboard')
    //       break
    //     case 'employee':
    //       navigate('/employee/dashboard')
    //       break
    //     default:
    //       throw new Error('Invalid role')
    //   }

    // } catch (err) {
    //   setError(err.message || 'Invalid username or password')
    // } finally {
    //   setIsLoading(false)
    // }
    
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Sign in to your account</h2>
        <p className="subtitle">Inventory Management System</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              disabled={isLoading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage