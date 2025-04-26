
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { isAuthenticated } from '@/utils/auth';
import { toast } from "@/components/ui/sonner";
import { authService } from '@/services/authService';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated
  useEffect(() => {
    const verifyAuth = async () => {
      if (!isAuthenticated()) {
        toast.error("Please log in to access this page.");
        navigate('/auth');
      } else {
        // Additional check for token validity
        const tokenValid = await authService.checkTokenStatus();
        if (!tokenValid) {
          navigate('/auth');
        }
      }
      setIsLoading(false);
    };
    
    verifyAuth();
  }, [navigate]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
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
