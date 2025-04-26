
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
    <div className="h-screen border-r border-border/40 w-64 bg-sidebar-background flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">Salary Tracker</h1>
      </div>
      <ScrollArea className="flex-1 p-4">
        <nav className="space-y-2">
          <Button 
            variant={isActive("/dashboard") ? "secondary" : "ghost"} 
            className={cn(
              "w-full justify-start gap-2", 
              isActive("/dashboard") && "bg-sidebar-accent text-sidebar-accent-foreground"
            )}
            onClick={() => navigateWithYear('/dashboard')}
          >
            <Home size={18} />
            <span>Dashboard</span>
          </Button>

          <Button 
            variant={isActive("/expenses") ? "secondary" : "ghost"} 
            className={cn(
              "w-full justify-start gap-2", 
              isActive("/expenses") && "bg-sidebar-accent text-sidebar-accent-foreground"
            )}
            onClick={() => navigateWithYear('/expenses')}
          >
            <CreditCard size={18} />
            <span>Expenses</span>
          </Button>

          <Button 
            variant={isActive("/recurring") ? "secondary" : "ghost"} 
            className={cn(
              "w-full justify-start gap-2", 
              isActive("/recurring") && "bg-sidebar-accent text-sidebar-accent-foreground"
            )}
            onClick={() => navigateWithYear('/recurring')}
          >
            <Calendar size={18} />
            <span>Recurring</span>
          </Button>

          <Button 
            variant={isActive("/categories") ? "secondary" : "ghost"} 
            className={cn(
              "w-full justify-start gap-2", 
              isActive("/categories") && "bg-sidebar-accent text-sidebar-accent-foreground"
            )}
            onClick={() => navigateWithYear('/categories')}
          >
            <Tag size={18} />
            <span>Categories</span>
          </Button>

          <Button 
            variant={isActive("/reports") || isActive("/years") ? "secondary" : "ghost"} 
            className={cn(
              "w-full justify-start gap-2", 
              (isActive("/years") || isActive("/reports")) && "bg-sidebar-accent text-sidebar-accent-foreground"
            )}
            onClick={() => isActive("/reports") ? navigate('/years') : navigate(`/reports?year=${yearParam}`)}
          >
            <BarChart2 size={18} />
            <span>Reports</span>
          </Button>
        </nav>
      </ScrollArea>
      <div className="p-4 border-t border-border/40 space-y-2">
        <Button 
          variant={isActive("/settings") ? "secondary" : "ghost"} 
          className={cn(
            "w-full justify-start gap-2", 
            isActive("/settings") && "bg-sidebar-accent text-sidebar-accent-foreground"
          )}
          onClick={() => navigateWithYear('/settings')}
        >
          <Settings size={18} />
          <span>Settings</span>
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
}
