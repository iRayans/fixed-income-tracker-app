
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SalaryForm } from '@/components/settings/SalaryForm';

// Mock data
const mockSalary = {
  amount: 5000,
  effectiveDate: "2025-04-01"
};

const Settings = () => {
  const handleUpdateSalary = (values: any) => {
    console.log("Updating salary:", values);
    // In a real app, this would update the salary in the backend
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your profile and preferences</p>
        </header>

        <Tabs defaultValue="salary" className="w-full">
          <TabsList className="w-full max-w-md grid grid-cols-2 mb-6">
            <TabsTrigger value="salary">Salary</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>
          
          <TabsContent value="salary">
            <Card className="bg-gradient-to-br from-card to-card/70 border-purple-900/20">
              <CardHeader>
                <CardTitle>Salary Management</CardTitle>
                <CardDescription>
                  Update your monthly salary information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SalaryForm 
                  onSubmit={handleUpdateSalary}
                  initialValues={mockSalary}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="account">
            <Card className="bg-gradient-to-br from-card to-card/70 border-purple-900/20">
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Account settings will be available in a future update.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Settings;
