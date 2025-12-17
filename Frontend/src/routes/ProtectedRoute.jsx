import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ requireAdmin = false }) => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) return <Navigate to="/signin" replace />;
  if (requireAdmin && !isAdmin) return <Navigate to="/posts" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
