import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    clearAuth();
    toast.success("You have been logged out successfully.");
    navigate('/auth');
  };

  return (
    
    <div className="h-screen border-r border-border/40 w-64 bg-sidebar-background flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">Salary Tracker</h1>
      </div>
      <ScrollArea className="flex-1 p-4">
        <nav className="space-y-2">
          <Link to="/dashboard">
            <Button 
              variant={isActive("/dashboard") ? "secondary" : "ghost"} 
              className={cn(
                "w-full justify-start gap-2", 
                isActive("/dashboard") && "bg-sidebar-accent text-sidebar-accent-foreground"
              )}
            >
              <Home size={18} />
              <span>Dashboard</span>
            </Button>
          </Link>
          <Link to="/expenses">
            <Button 
              variant={isActive("/expenses") ? "secondary" : "ghost"} 
              className={cn(
                "w-full justify-start gap-2", 
                isActive("/expenses") && "bg-sidebar-accent text-sidebar-accent-foreground"
              )}
            >
              <CreditCard size={18} />
              <span>Expenses</span>
            </Button>
          </Link>
          <Link to="/recurring">
            <Button 
              variant={isActive("/recurring") ? "secondary" : "ghost"} 
              className={cn(
                "w-full justify-start gap-2", 
                isActive("/recurring") && "bg-sidebar-accent text-sidebar-accent-foreground"
              )}
            >
              <Calendar size={18} />
              <span>Recurring</span>
            </Button>
          </Link>
          <Link to="/categories">
            <Button 
              variant={isActive("/categories") ? "secondary" : "ghost"} 
              className={cn(
                "w-full justify-start gap-2", 
                isActive("/categories") && "bg-sidebar-accent text-sidebar-accent-foreground"
              )}
            >
              <Tag size={18} />
              <span>Categories</span>
            </Button>
          </Link>
          <Link to="/reports">
            <Button 
              variant={isActive("/reports") ? "secondary" : "ghost"} 
              className={cn(
                "w-full justify-start gap-2", 
                isActive("/reports") && "bg-sidebar-accent text-sidebar-accent-foreground"
              )}
            >
              <BarChart2 size={18} />
              <span>Reports</span>
            </Button>
          </Link>
        </nav>
      </ScrollArea>
      <div className="p-4 border-t border-border/40 space-y-2">
        <Link to="/settings">
          <Button 
            variant={isActive("/settings") ? "secondary" : "ghost"} 
            className={cn(
              "w-full justify-start gap-2", 
              isActive("/settings") && "bg-sidebar-accent text-sidebar-accent-foreground"
            )}
          >
            <Settings size={18} />
            <span>Settings</span>
          </Button>
        </Link>
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
