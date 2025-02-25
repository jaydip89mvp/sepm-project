import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Home.css'

export const Home = () => {
  const navigate = useNavigate()

  return (
    <div className="landing-container">
      <div className="hero-section">
        <h1>Inventory Management System</h1>
        <p className="subtitle">Streamline your inventory operations with our powerful management solution</p>
        <button className="login-btn" onClick={() => navigate('/login')}>
          Login to Dashboard
        </button>
      </div>

      <div className="features-section">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Real-time Tracking</h3>
            <p>Monitor your inventory levels in real-time with accurate tracking</p>
          </div>
          <div className="feature-card">
            <h3>Stock Management</h3>
            <p>Efficiently manage stock levels, orders, and suppliers</p>
          </div>
          <div className="feature-card">
            <h3>Reports & Analytics</h3>
            <p>Generate detailed reports and insights for better decision making</p>
          </div>
          <div className="feature-card">
            <h3>User Management</h3>
            <p>Control access levels and manage team permissions</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home