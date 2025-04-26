
import { Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { authService } from '@/services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkTokenValidity = async () => {
      const valid = await authService.validateToken();
      setIsValid(valid);
      setIsLoading(false);
    };

    checkTokenValidity();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isValid) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
};
