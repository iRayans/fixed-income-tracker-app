
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SalaryForm, SalaryFormValues } from '@/components/settings/SalaryForm';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Pencil, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { salaryService, Salary } from '@/services/salaryService';
import { formatCurrency } from '@/lib/utils';

const formatDate = (value?: string | null) => {
  if (!value) return '—';
  const date = new Date(value);
  return isNaN(date.getTime()) ? value : format(date, 'dd MMM yyyy');
};

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSalary, setEditingSalary] = useState<Salary | null>(null);
  const queryClient = useQueryClient();

  const today = new Date().toISOString().slice(0, 10);

  const { data: salaries = [], isLoading } = useQuery({
    queryKey: ['salaries'],
    queryFn: () => salaryService.getSalaries(),
    meta: { onError: () => toast.error('Failed to load salary history') },
  });

  const { data: currentSalary } = useQuery({
    queryKey: ['salary-effective', today],
    queryFn: () => salaryService.getEffectiveSalary(today),
  });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['salaries'] });
    queryClient.invalidateQueries({ queryKey: ['salary-effective'] });
  };

  const saveSalary = useMutation({
    mutationFn: async (values: SalaryFormValues) => {
      const payload = {
        amount: values.amount,
        description: values.description,
        effectiveFrom: values.effectiveFrom,
        effectiveTo: values.effectiveTo ? values.effectiveTo : null,
      };

      if (editingSalary?.id) {
        return salaryService.updateSalary(editingSalary.id, payload);
      }
      return salaryService.createSalary(payload);
    },
    onSuccess: () => {
      toast.success(editingSalary ? 'Salary updated' : 'New salary added');
      setDialogOpen(false);
      setEditingSalary(null);
      refresh();
    },
    onError: () => toast.error('Failed to save salary'),
  });

  const openCreate = () => {
    setEditingSalary(null);
    setDialogOpen(true);
  };

  const openEdit = (salary: Salary) => {
    setEditingSalary(salary);
    setDialogOpen(true);
  };

  const handleToggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle('dark', newDarkMode);
  };

  const handleToggleNotifications = () => setNotificationsEnabled(prev => !prev);

  const handleResetSettings = () => {
    setDarkMode(false);
    setNotificationsEnabled(true);
    document.documentElement.classList.remove('dark');
    toast.success('All settings have been reset to their default values.');
  };

  const sortedSalaries = [...salaries].sort((a, b) =>
    (b.effectiveFrom || '').localeCompare(a.effectiveFrom || '')
  );

  return (
    <AppLayout>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your application preferences</p>
        </header>

        <div className="grid gap-8">
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Salary</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Current salary:{' '}
                  <span className="text-foreground font-medium">
                    {currentSalary ? formatCurrency(currentSalary.amount) : '—'}
                  </span>
                </p>
              </div>
              <Button onClick={openCreate} size="sm">
                <Plus size={16} className="mr-1" />
                Add New Salary
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-muted-foreground">Loading salary history...</p>
              ) : sortedSalaries.length === 0 ? (
                <p className="text-muted-foreground">
                  No salary records yet. Add your first salary to get started.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Amount</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Effective From</TableHead>
                      <TableHead>Effective To</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedSalaries.map((salary) => (
                      <TableRow key={salary.id ?? salary.effectiveFrom}>
                        <TableCell className="font-medium">
                          {formatCurrency(salary.amount)}
                          {currentSalary?.id === salary.id && (
                            <Badge variant="secondary" className="ml-2">Current</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{salary.description}</TableCell>
                        <TableCell>{formatDate(salary.effectiveFrom)}</TableCell>
                        <TableCell>{formatDate(salary.effectiveTo)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(salary)}>
                            <Pencil size={16} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
                <Switch id="dark-mode" checked={darkMode} onCheckedChange={handleToggleDarkMode} />
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
                <Button variant="destructive" onClick={handleResetSettings}>
                  Reset All Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingSalary(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSalary ? 'Edit Salary' : 'Add New Salary'}</DialogTitle>
          </DialogHeader>
          <SalaryForm
            key={editingSalary?.id ?? 'new'}
            initialValues={
              editingSalary
                ? {
                    amount: editingSalary.amount,
                    description: editingSalary.description,
                    effectiveFrom: editingSalary.effectiveFrom?.slice(0, 10),
                    effectiveTo: editingSalary.effectiveTo?.slice(0, 10) ?? '',
                  }
                : undefined
            }
            buttonText={editingSalary ? 'Update Salary' : 'Add Salary'}
            isLoading={saveSalary.isPending}
            onSubmit={(values) => saveSalary.mutate(values)}
          />
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Settings;
