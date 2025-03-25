import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Import useSelector from react-redux
const ProtectedRoute = ({ allowedRoles }) => {
  const token = useSelector((state) => state.auth.token);
  const role = useSelector((state) => state.auth.role);

  console.log('Token:', token); // Debugging output
  console.log('Role:', role);   // Debugging output

  // If no token, redirect to login page
  

  // If role is not allowed, redirect to unauthorized page
  return allowedRoles.includes(role) ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};
export default ProtectedRoute;