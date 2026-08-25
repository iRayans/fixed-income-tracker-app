import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { SalaryAdjustmentForm, SalaryAdjustmentFormValues } from '@/components/settings/SalaryAdjustmentForm';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SalaryForm, SalaryFormValues } from '@/components/settings/SalaryForm';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { salaryService, Salary } from '@/services/salaryService';
import { formatCurrency } from '@/lib/utils';
import { salaryAdjustmentService, SalaryAdjustment } from '@/services/salaryAdjustmentService';


const formatDate = (value?: string | null) => {
  if (!value) return '—';
  const date = new Date(value);
  return isNaN(date.getTime()) ? value : format(date, 'dd MMM yyyy');
};

const Settings = () => {
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

  const sortedSalaries = [...salaries].sort((a, b) =>
    (b.effectiveFrom || '').localeCompare(a.effectiveFrom || '')
  );

  const [adjustmentDialogOpen, setAdjustmentDialogOpen] = useState(false);
  const [editingAdjustment, setEditingAdjustment] = useState<SalaryAdjustment | null>(null);

  const { data: adjustments = [], isLoading: isAdjustmentsLoading } = useQuery({
    queryKey: ['salary-adjustments'],
    queryFn: () => salaryAdjustmentService.getAdjustments(),
    meta: { onError: () => toast.error('Failed to load salary adjustments') },
  });

  const saveAdjustment = useMutation({
    mutationFn: async (values: SalaryAdjustmentFormValues) => {
      const payload = {
        type: values.type,
        amount: values.amount,
        date: values.date,
        description: values.description || '',
      };

      if (editingAdjustment?.id) {
        return salaryAdjustmentService.updateAdjustment(editingAdjustment.id, payload);
      }
      return salaryAdjustmentService.createAdjustment(payload);
    },
    onSuccess: () => {
      toast.success(editingAdjustment ? 'Adjustment updated' : 'Adjustment added');
      setAdjustmentDialogOpen(false);
      setEditingAdjustment(null);
      queryClient.invalidateQueries({ queryKey: ['salary-adjustments'] });
    },
    onError: () => toast.error('Failed to save salary adjustment'),
  });

  const openCreateAdjustment = () => {
    setEditingAdjustment(null);
    setAdjustmentDialogOpen(true);
  };

  const openEditAdjustment = (adjustment: SalaryAdjustment) => {
    setEditingAdjustment(adjustment);
    setAdjustmentDialogOpen(true);
  };

  const sortedAdjustments = [...adjustments].sort((a, b) =>
    (b.date || '').localeCompare(a.date || '')
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
                          <div className="inline-flex items-center gap-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  aria-label="Edit salary"
                                  onClick={() => openEdit(salary)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="top">Edit</TooltipContent>
                            </Tooltip>
                          </div>
                        </TableCell>

                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Salary Adjustments</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Bonuses, deductions, and overtime
                </p>
              </div>
              <Button onClick={openCreateAdjustment} size="sm">
                <Plus size={16} className="mr-1" />
                Add Adjustment
              </Button>
            </CardHeader>
            <CardContent>
              {isAdjustmentsLoading ? (
                <p className="text-muted-foreground">Loading adjustments...</p>
              ) : sortedAdjustments.length === 0 ? (
                <p className="text-muted-foreground">
                  No adjustments yet. Add a bonus, deduction, or overtime record to get started.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedAdjustments.map((adjustment) => (
                      <TableRow key={adjustment.id}>
                        <TableCell>
                          <Badge variant={adjustment.type === 'DEDUCTION' ? 'destructive' : 'secondary'}>
                            {adjustment.type}
                          </Badge>
                        </TableCell>
                        <TableCell
                          className={`font-medium ${adjustment.amount < 0 ? 'text-destructive' : 'text-green-500'}`}
                        >
                          {formatCurrency(adjustment.amount)}
                        </TableCell>
                        <TableCell>{formatDate(adjustment.date)}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {adjustment.description || '—'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="inline-flex items-center gap-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  aria-label="Edit adjustment"
                                  onClick={() => openEditAdjustment(adjustment)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="top">Edit</TooltipContent>
                            </Tooltip>
                          </div>
                        </TableCell>

                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
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

      <Dialog
        open={adjustmentDialogOpen}
        onOpenChange={(open) => {
          setAdjustmentDialogOpen(open);
          if (!open) setEditingAdjustment(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAdjustment ? 'Edit Adjustment' : 'Add Salary Adjustment'}</DialogTitle>
          </DialogHeader>
          <SalaryAdjustmentForm
            key={editingAdjustment?.id ?? 'new'}
            initialValues={
              editingAdjustment
                ? {
                    type: editingAdjustment.type,
                    amount: Math.abs(editingAdjustment.amount),
                    date: editingAdjustment.date?.slice(0, 10),
                    description: editingAdjustment.description ?? '',
                  }
                : undefined
            }
            buttonText={editingAdjustment ? 'Update Adjustment' : 'Add Adjustment'}
            isLoading={saveAdjustment.isPending}
            onSubmit={(values) => saveAdjustment.mutate(values)}
          />
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Settings;