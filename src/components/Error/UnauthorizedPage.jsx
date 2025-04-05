import React from 'react';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="unauthorized-container">
      <h1>Unauthorized Access</h1>
      <p>You do not have permission to access this page.</p>
      <button onClick={() => navigate('/login')}>Return to Login</button>
    </div>
  );
};

 