
import { Navigate, useLocation } from 'react-router-dom';
import { getAuthToken } from '@/utils/auth';
import { toast } from "@/components/ui/sonner";
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const [isValid, setIsValid] = useState(true);
  
  useEffect(() => {
    const token = getAuthToken();
    
    if (!token) {
      setIsValid(false);
      toast.error("Authentication required. Please log in.");
      return;
    }
    
    // Verify token is valid by making a simple request to an API endpoint
    const verifyToken = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1/auth', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            toast.error("Your session has expired. Please login again.");
          }
          setIsValid(false);
        }
      } catch (error) {
        console.error('Token validation error:', error);
        setIsValid(false);
        toast.error("Authentication error. Please login again.");
      }
    };
    
    verifyToken();
  }, []);
  
  if (!isValid) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
};
