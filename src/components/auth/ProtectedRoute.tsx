
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '@/utils/auth';
import { toast } from "@/components/ui/sonner";
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  
  useEffect(() => {
    if (!isAuthenticated()) {
      toast.error("Your session has expired. Please login again.");
    }
  }, []);
  
  if (!isAuthenticated()) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
};
