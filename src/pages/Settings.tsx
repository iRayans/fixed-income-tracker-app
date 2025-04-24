
import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SalaryForm } from '@/components/settings/SalaryForm';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { salaryService } from '@/services/salaryService';

// Fix the error by making sure we pass the correct types to updateSalary
const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [salary, setSalary] = useState({
    amount: 0,
    description: ''
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSalary = async () => {
      try {
        const data = await salaryService.getSalary();
        setSalary({
          amount: data.amount,
          description: data.description
        });
      } catch (error) {
        console.error('Error fetching salary:', error);
        toast({
          title: "Error",
          description: "Failed to load salary information.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSalary();
  }, [toast]);

  const handleUpdateSalary = async (values: { amount: number; description: string }) => {
    try {
      await salaryService.updateSalary({
        amount: values.amount,
        description: values.description
      });
      
      setSalary({
        amount: values.amount,
        description: values.description
      });
      
      toast({
        title: "Salary Updated",
        description: "Your salary information has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating salary:', error);
      toast({
        title: "Error",
        description: "Failed to update salary information.",
        variant: "destructive",
      });
    }
  };

  const handleToggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle('dark', newDarkMode);
    toast({
      title: newDarkMode ? "Dark Mode Enabled" : "Light Mode Enabled",
      description: `The application theme has been switched to ${newDarkMode ? 'dark' : 'light'} mode.`,
    });
  };

  const handleToggleNotifications = () => {
    const newNotificationsEnabled = !notificationsEnabled;
    setNotificationsEnabled(newNotificationsEnabled);
    toast({
      title: newNotificationsEnabled ? "Notifications Enabled" : "Notifications Disabled",
      description: `You will ${newNotificationsEnabled ? 'now receive' : 'no longer receive'} notifications.`,
    });
  };

  const handleResetSettings = () => {
    setDarkMode(false);
    setNotificationsEnabled(true);
    document.documentElement.classList.remove('dark');
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to their default values.",
    });
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your application preferences</p>
        </header>

        <div className="grid gap-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Salary Information</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading salary information...</p>
              ) : (
                <SalaryForm 
                  initialData={salary} 
                  onSubmit={handleUpdateSalary} 
                />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Appearance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable dark mode for a more comfortable viewing experience at night
                  </p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={darkMode}
                  onCheckedChange={handleToggleDarkMode}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="notifications">Enable Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications about your expenses and budget
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={notificationsEnabled}
                  onCheckedChange={handleToggleNotifications}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Reset Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Reset all settings to their default values. This action cannot be undone.
                </p>
                <Button 
                  variant="destructive" 
                  onClick={handleResetSettings}
                >
                  Reset All Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings;
