
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '@/utils/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  
  if (!isAuthenticated()) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
};
