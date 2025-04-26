
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { authService } from '@/services/authService';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkTokenValidity = async () => {
      const isValid = await authService.validateToken();
      
      if (!isValid) {
        navigate('/auth');
      } else {
        setIsLoading(false);
      }
    };

    checkTokenValidity();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 border-4 border-primary/30 border-t-primary animate-spin rounded-full"></div>
          <p className="text-sm text-muted-foreground">Loading your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/95 text-foreground flex">
      <AppSidebar />
      <main className="flex-1 p-8 overflow-auto animate-fade-in">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
