import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setError as setAuthError } from '../../redux/reducer/auth';
import { authService } from '../../services/authService';
import './LoginPage.css';

export const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, role, error: authError } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is already authenticated and navigate to appropriate dashboard
  useEffect(() => {
    if (isAuthenticated && role) {
      switch (role.toLowerCase()) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'manager':
          navigate('/manager/dashboard');
          break;
        case 'employee':
          navigate('/employee/dashboard');
          break;
        default:
          setError('Invalid role received');
          navigate('/login');
      }
    }
  }, [isAuthenticated, role, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear errors when user starts typing
    if (error) setError('');
    if (authError) dispatch(setAuthError(null));
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.password.trim()) {
      setError('Password is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    dispatch(setAuthError(null));
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      console.log('Submitting login form with email:', formData.email);
      const data = await authService.login(formData.email, formData.password);
      
      if (!data) {
        throw new Error('No response received from server');
      }

      if (!data.email || !data.role) {
        console.error('Invalid response data:', data);
        throw new Error('Invalid response from server: missing email or role');
      }

      console.log('Login successful, received data:', data);

      // Update Redux state with user data and role
      dispatch(setUser({ 
        user: { email: data.email }, 
        role: data.role 
      }));

      // Clear form
      setFormData({ email: '', password: '' });

    } catch (err) {
      console.error('Login error:', err);
      if (err.message.includes('Failed to fetch')) {
        setError('Unable to connect to the server. Please check if the server is running.');
      } else if (err.message.includes('non-JSON response')) {
        setError('Server error. Please try again later.');
      } else if (err.message.includes('Invalid email or password')) {
        setError('Invalid email or password. Please check your credentials.');
      } else {
        setError(err.message || 'An error occurred during login. Please try again.');
      }
      dispatch(setAuthError(err.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Sign in to your account</h2>
        <p className="subtitle">Inventory Management System</p>

        <form onSubmit={handleSubmit} className={isLoading ? 'form-loading' : ''}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              disabled={isLoading}
              autoComplete="username"
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
              autoComplete="current-password"
            />
          </div>

          {(error || authError) && (
            <div className="error-message">
              {error || authError}
            </div>
          )}

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
