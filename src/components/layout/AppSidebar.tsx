
import React from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Home, 
  CreditCard, 
  Calendar, 
  Settings, 
  LogOut, 
  Tag, 
  BarChart2
} from "lucide-react";
import { clearAuth } from '@/utils/auth';
import { toast } from "@/components/ui/sonner";

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const yearParam = searchParams.get('year') || new Date().getFullYear().toString();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const handleLogout = () => {
    clearAuth();
    toast.success("You have been logged out successfully.");
    navigate('/auth');
  };

  const navigateWithYear = (path: string) => {
    // Preserve the year parameter when navigating
    navigate(`${path}?year=${yearParam}`);
  };

  return (
    <div className="h-screen border-r border-sidebar-border w-64 bg-sidebar-background flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gradient">Salary Tracker</h1>
      </div>
      <ScrollArea className="flex-1 px-3">
        <nav className="space-y-1.5 py-3">
          <Button 
            variant={isActive("/dashboard") ? "secondary" : "ghost"} 
            className={cn(
              "w-full justify-start gap-3 mb-1 font-medium", 
              isActive("/dashboard") ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/80 hover:text-sidebar-foreground"
            )}
            onClick={() => navigateWithYear('/dashboard')}
          >
            <Home size={18} />
            <span>Dashboard</span>
          </Button>

          <Button 
            variant={isActive("/expenses") ? "secondary" : "ghost"} 
            className={cn(
              "w-full justify-start gap-3 mb-1 font-medium", 
              isActive("/expenses") ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/80 hover:text-sidebar-foreground"
            )}
            onClick={() => navigateWithYear('/expenses')}
          >
            <CreditCard size={18} />
            <span>Expenses</span>
          </Button>

          <Button 
            variant={isActive("/recurring") ? "secondary" : "ghost"} 
            className={cn(
              "w-full justify-start gap-3 mb-1 font-medium", 
              isActive("/recurring") ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/80 hover:text-sidebar-foreground"
            )}
            onClick={() => navigateWithYear('/recurring')}
          >
            <Calendar size={18} />
            <span>Recurring</span>
          </Button>

          <Button 
            variant={isActive("/categories") ? "secondary" : "ghost"} 
            className={cn(
              "w-full justify-start gap-3 mb-1 font-medium", 
              isActive("/categories") ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/80 hover:text-sidebar-foreground"
            )}
            onClick={() => navigateWithYear('/categories')}
          >
            <Tag size={18} />
            <span>Categories</span>
          </Button>

          <Button 
            variant={isActive("/reports") || isActive("/years") ? "secondary" : "ghost"} 
            className={cn(
              "w-full justify-start gap-3 mb-1 font-medium", 
              (isActive("/years") || isActive("/reports")) ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/80 hover:text-sidebar-foreground"
            )}
            onClick={() => isActive("/reports") ? navigate('/years') : navigate(`/reports?year=${yearParam}`)}
          >
            <BarChart2 size={18} />
            <span>Reports</span>
          </Button>
        </nav>
      </ScrollArea>
      
      <div className="p-3 border-t border-sidebar-border/40 space-y-1.5 pt-3 pb-4">
        <Button 
          variant={isActive("/settings") ? "secondary" : "ghost"} 
          className={cn(
            "w-full justify-start gap-3 font-medium", 
            isActive("/settings") ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/80 hover:text-sidebar-foreground"
          )}
          onClick={() => navigateWithYear('/settings')}
        >
          <Settings size={18} />
          <span>Settings</span>
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 font-medium text-sidebar-foreground/80 hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
}
