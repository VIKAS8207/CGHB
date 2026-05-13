import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { userRole } = useAuth();

  // If the user's role is not in the allowed list, redirect them
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Otherwise, render the requested page
  return <Outlet />;
};

export default ProtectedRoute;