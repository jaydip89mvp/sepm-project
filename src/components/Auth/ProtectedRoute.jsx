import { Navigate } from 'react-router-dom'

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token')
  const userRole = localStorage.getItem('userRole')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard based on role
    switch (userRole.toLowerCase()) {
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />
      case 'manager':
        return <Navigate to="/manager/dashboard" replace />
      case 'employee':
        return <Navigate to="/employee/dashboard" replace />
      default:
        return <Navigate to="/login" replace />
    }
  }

  return children
}