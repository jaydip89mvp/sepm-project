import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import { Home } from './pages/Home.jsx';
import { LoginPage } from './components/Auth/LoginPage.jsx';
import EmployeeDashboard from './components/Dashboard/EmployeeDashboard.jsx';
import ManagerDashboard from './components/Dashboard/ManagerDashboard.jsx';
import AdminDashboard from './components/Dashboard/AdminDashboard.jsx';
import Unauthorized from './pages/Unauthorized.jsx';

import ProtectedRoute from './components/Auth/ProtectedRoute.jsx'; // Corrected import name

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Routes - Admin */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>

        {/* Protected Routes - Employee */}
        <Route element={<ProtectedRoute allowedRoles={['employee']} />}>
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        </Route>

        {/* Protected Routes - Manager */}
        <Route element={<ProtectedRoute allowedRoles={['manager']} />}>
          <Route path="/manager/dashboard" element={<ManagerDashboard />} />
        </Route>

        {/* Catch-All Route */}
        <Route path="*" element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
