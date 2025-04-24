import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SalaryForm } from '@/components/settings/SalaryForm';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { salaryService } from '@/services/salaryService';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { formatCurrency } from '@/lib/utils';

const Settings = () => {
  const queryClient = useQueryClient();
  const [editingSalary, setEditingSalary] = useState<{id: number, amount: number, description: string} | null>(null);

  const { data: salaries = [] } = useQuery({
    queryKey: ['salaries'],
    queryFn: salaryService.getSalaries,
  });

  const createSalary = useMutation({
    mutationFn: (data: { amount: number; description: string }) => 
      salaryService.createSalary({ ...data, isActive: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salaries'] });
      toast.success('Salary created successfully');
    },
    onError: () => {
      toast.error('Failed to create salary');
    },
  });

  const updateSalary = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<{ amount: number; description: string; isActive: boolean }> }) =>
      salaryService.updateSalary(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salaries'] });
      toast.success('Salary updated successfully');
      setEditingSalary(null);
    },
    onError: () => {
      toast.error('Failed to update salary');
    },
  });

  const deleteSalary = useMutation({
    mutationFn: (id: number) => salaryService.deleteSalary(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salaries'] });
      toast.success('Salary deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete salary');
    },
  });

  const handleActivate = (id: number) => {
    // First, deactivate all salaries
    salaries.forEach((salary) => {
      if (salary.id && salary.isActive) {
        updateSalary.mutate({ id: salary.id, data: { isActive: false } });
      }
    });
    // Then, activate the selected salary
    updateSalary.mutate({ id, data: { isActive: true } });
  };

  const handleEditSalary = (salary: { id: number, amount: number, description: string }) => {
    setEditingSalary(salary);
  };

  const handleSaveEdit = (values: { amount: number, description: string }) => {
    if (editingSalary?.id) {
      updateSalary.mutate({ 
        id: editingSalary.id, 
        data: { 
          amount: values.amount,
          description: values.description 
        } 
      });
    }
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
            <div className="grid gap-6">
              {editingSalary ? (
                <Card className="bg-gradient-to-br from-card to-card/70 border-purple-900/20">
                  <CardHeader>
                    <CardTitle>Edit Salary</CardTitle>
                    <CardDescription>
                      Update your salary information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SalaryForm 
                      onSubmit={handleSaveEdit}
                      initialValues={{
                        amount: editingSalary.amount,
                        description: editingSalary.description
                      }}
                      buttonText="Update Salary"
                      isLoading={updateSalary.isPending}
                    />
                    <Button 
                      variant="outline" 
                      className="w-full mt-2"
                      onClick={() => setEditingSalary(null)}
                    >
                      Cancel
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-gradient-to-br from-card to-card/70 border-purple-900/20">
                  <CardHeader>
                    <CardTitle>Add New Salary</CardTitle>
                    <CardDescription>
                      Set up a new salary record
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SalaryForm 
                      onSubmit={(values) => createSalary.mutate(values)}
                      isLoading={createSalary.isPending}
                    />
                  </CardContent>
                </Card>
              )}

              <Card className="bg-gradient-to-br from-card to-card/70 border-purple-900/20">
                <CardHeader>
                  <CardTitle>Salary History</CardTitle>
                  <CardDescription>
                    View and manage your salary records
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {salaries.map((salary) => (
                      <div key={salary.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                        <div>
                          <p className="font-medium">{formatCurrency(salary.amount)}</p>
                          <p className="text-sm text-muted-foreground">{salary.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {!salary.isActive && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => salary.id && handleActivate(salary.id)}
                            >
                              Activate
                            </Button>
                          )}
                          {salary.isActive && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="pointer-events-none opacity-50"
                            >
                              Active
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => salary.id && handleEditSalary({
                              id: salary.id,
                              amount: salary.amount,
                              description: salary.description
                            })}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Salary</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this salary? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => salary.id && deleteSalary.mutate(salary.id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
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
