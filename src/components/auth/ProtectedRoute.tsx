
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '@/utils/auth';
import { toast } from "@/components/ui/sonner";
import { useEffect, useState } from 'react';
import { authService } from '@/services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isValid, setIsValid] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated()) {
        toast.error("Please log in to access this page.");
        setIsValid(false);
      } else {
        // Additional check for token validity
        const tokenValid = await authService.checkTokenStatus();
        if (!tokenValid) {
          toast.error("Your session has expired. Please login again.");
          setIsValid(false);
        }
      }
      setIsChecking(false);
    };
    
    checkAuth();
  }, []);
  
  if (isChecking) {
    // Show a loading state while checking authentication
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
    </div>;
  }
  
  if (!isValid) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
};
