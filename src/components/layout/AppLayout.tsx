
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { getAuthToken } from '@/utils/auth';
import { toast } from "@/components/ui/sonner";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated
  useEffect(() => {
    const token = getAuthToken();
    
    if (!token) {
      toast.error("Authentication required. Please log in.");
      navigate('/auth');
      return;
    }
    
    // Simple token validation
    const verifyToken = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1/auth/verify', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            toast.error("Your session has expired. Please login again.");
          }
          navigate('/auth');
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Token validation error:', error);
        toast.error("Authentication error. Please login again.");
        navigate('/auth');
        setIsLoading(false);
      }
    };
    
    verifyToken();
  }, [navigate]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      Loading...
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/95 text-foreground flex">
      <AppSidebar />
      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}
