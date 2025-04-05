import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/reducer/auth';
import { authService } from '../../services/authService';
import './LoginPage.css';

export const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = authService.getStoredUser();
    if (storedUser) {
      navigate(`/${storedUser.role.toLowerCase()}/dashboard`);
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await authService.login(formData.email, formData.password);
      
      if (!data || !data.email || !data.role) {
        throw new Error('Invalid response from server');
      }

      // Store user data
      localStorage.setItem('userData', JSON.stringify({
        email: data.email,
        role: data.role
      }));

      // Update Redux state
      dispatch(setUser({ 
        user: { email: data.email }, 
        role: data.role 
      }));

      // Clear form and navigate
      setFormData({ email: '', password: '' });
      navigate(`/${data.role.toLowerCase()}/dashboard`);

    } catch (err) {
      if (err.message.includes('Failed to fetch')) {
        setError('Unable to connect to the server. Please check if the server is running.');
      } else if (err.message.includes('non-JSON response')) {
        setError('Server error. Please try again later.');
      } else {
        setError(err.message || 'An error occurred during login. Please try again.');
      }
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

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
