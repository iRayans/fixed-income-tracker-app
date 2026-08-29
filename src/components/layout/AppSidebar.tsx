
import React, { useEffect, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Home, 
  CreditCard, 
  Calendar, 
  Settings, 
  LogOut, 
  Tag, 
  BarChart2,
  PiggyBank,
  X
} from "lucide-react";
import { clearAuth } from '@/utils/auth';
import { toast } from "@/components/ui/sonner";
import { useSelectedMonth } from '@/hooks/use-selected-month';

interface AppSidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function AppSidebar({ mobileOpen = false, onMobileClose }: AppSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { year, month } = useSelectedMonth();
  const monthQuery = `year=${year}&month=${month}`;

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  // Prevent body scrolling while the mobile drawer is open
  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);



  const handleLogoutClick = () => setLogoutDialogOpen(true);

  const handleLogoutConfirm = () => {
    clearAuth();
    toast.success("You have been logged out successfully.");
    setLogoutDialogOpen(false);
    onMobileClose?.();
    navigate('/auth');
  };

  const navigateWithYear = (path: string) => {
    // Preserve the year parameter when navigating
    onMobileClose?.();
    navigate(`${path}?${monthQuery}`);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      <aside
        role="navigation"
        aria-hidden={!mobileOpen ? undefined : false}
        className={cn(
          "fixed left-0 top-0 z-50 h-[100dvh] w-[82vw] max-w-[18rem] md:w-64 md:max-w-none border-r border-sidebar-border bg-sidebar-background flex flex-col transition-transform duration-300 md:z-40 safe-area-top safe-area-bottom",
          mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="px-4 py-4 md:p-6 flex items-center justify-between gap-2">
          <h1 className="text-xl md:text-2xl font-bold text-gradient truncate">Salary Tracker</h1>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-10 w-10 shrink-0 text-sidebar-foreground/80"
            onClick={onMobileClose}
            aria-label="Close menu"
          >
            <X size={18} />
          </Button>
        </div>

        <ScrollArea className="flex-1 px-3">
          <nav className="space-y-1.5 py-3">
            <Button 
              variant={isActive("/dashboard") ? "secondary" : "ghost"} 
              className={cn(
                "w-full justify-start gap-3 mb-1 h-11 font-medium", 
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
                "w-full justify-start gap-3 mb-1 h-11 font-medium", 
                isActive("/expenses") ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/80 hover:text-sidebar-foreground"
              )}
              onClick={() => navigateWithYear('/expenses')}
            >
              <CreditCard size={18} />
              <span>Expenses</span>
            </Button>

            <Button 
              variant={isActive("/savings") ? "secondary" : "ghost"} 
              className={cn(
                "w-full justify-start gap-3 mb-1 h-11 font-medium", 
                isActive("/savings") ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/80 hover:text-sidebar-foreground"
              )}
              onClick={() => navigateWithYear('/savings')}
            >
              <PiggyBank size={18} />
              <span>Savings</span>
            </Button>

            <Button 
              variant={isActive("/recurring") ? "secondary" : "ghost"} 
              className={cn(
                "w-full justify-start gap-3 mb-1 h-11 font-medium", 
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
                "w-full justify-start gap-3 mb-1 h-11 font-medium", 
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
                "w-full justify-start gap-3 mb-1 h-11 font-medium", 
                (isActive("/years") || isActive("/reports")) ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/80 hover:text-sidebar-foreground"
              )}
              onClick={() => {
                onMobileClose?.();
                isActive("/reports") ? navigate('/years') : navigate(`/reports?${monthQuery}`);
              }}
            >
              <BarChart2 size={18} />
              <span>Reports</span>
            </Button>
          </nav>
        </ScrollArea>
        
        <div className="mt-auto p-3 border-t border-sidebar-border/40 space-y-1.5 pt-3 pb-6">
          <Button 
            variant={isActive("/settings") ? "secondary" : "ghost"} 
            className={cn(
              "w-full justify-start gap-3 h-11 font-medium", 
              isActive("/settings") ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/80 hover:text-sidebar-foreground"
            )}
            onClick={() => navigateWithYear('/settings')}
          >
            <Settings size={18} />
            <span>Settings</span>
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 h-11 font-medium text-sidebar-foreground/80 hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogoutClick}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </Button>
        </div>

        <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Logout</DialogTitle>
              <DialogDescription>
                Are you sure you want to log out?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setLogoutDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleLogoutConfirm}>
                Logout
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </aside>
    </>
  );
}
