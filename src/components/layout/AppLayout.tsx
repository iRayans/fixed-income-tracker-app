
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { authService } from '@/services/authService';
import { Button } from "@/components/ui/button";
import { Menu } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-background to-background/95 text-foreground">
      <AppSidebar mobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />

      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 z-30 flex items-center gap-3 border-b border-sidebar-border/40 bg-sidebar-background/90 backdrop-blur px-4 py-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </Button>
        <h1 className="text-lg font-bold text-gradient">Salary Tracker</h1>
      </header>

      <main className="ml-0 md:ml-64 min-h-screen p-4 md:p-8 animate-fade-in">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
