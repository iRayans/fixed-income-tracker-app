import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { RecurringExpenseForm } from '@/components/expenses/RecurringExpenseForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '@/services/categoryService';
import { recurringExpenseService, RecurringExpense } from '@/services/recurringExpenseService';

const RecurringExpenses = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<RecurringExpense | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getCategories,
  });

  const { data: recurringExpenses = [], isLoading } = useQuery({
    queryKey: ['recurringExpenses'],
    queryFn: recurringExpenseService.getRecurringExpenses,
  });

  const createRecurringExpenseMutation = useMutation({
    mutationFn: recurringExpenseService.createRecurringExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurringExpenses'] });
      toast({
        title: "Recurring Expense Added",
        description: "New recurring expense has been added successfully.",
      });
      setIsDialogOpen(false);
      setEditingExpense(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add recurring expense. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateRecurringExpenseMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<RecurringExpense> }) =>
      recurringExpenseService.updateRecurringExpense(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurringExpenses'] });
      toast({
        title: "Recurring Expense Updated",
        description: "The recurring expense has been updated successfully.",
      });
      setIsDialogOpen(false);
      setEditingExpense(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update recurring expense. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteRecurringExpenseMutation = useMutation({
    mutationFn: recurringExpenseService.deleteRecurringExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurringExpenses'] });
      toast({
        title: "Recurring Expense Deleted",
        description: "The recurring expense has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete recurring expense. Please try again.",
        variant: "destructive",
      });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) => 
      recurringExpenseService.toggleRecurringExpenseStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurringExpenses'] });
      toast({
        title: "Status Updated",
        description: "Recurring expense status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update recurring expense status. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (values: any) => {
    const expenseData = {
      name: values.name,
      amount: values.amount,
      categoryId: parseInt(values.categoryId),
      dueDayOfMonth: values.dueDay,
      description: values.description || "",
      isActive: true,
    };

    if (editingExpense?.id) {
      updateRecurringExpenseMutation.mutate({
        id: editingExpense.id,
        data: expenseData,
      });
    } else {
      createRecurringExpenseMutation.mutate(expenseData);
    }
  };

  const handleEdit = (expense: RecurringExpense) => {
    setEditingExpense(expense);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteRecurringExpenseMutation.mutate(id);
  };

  const handleToggleStatus = (id: number, currentStatus: boolean) => {
    if (id) {
      toggleStatusMutation.mutate({ id, isActive: !currentStatus });
    }
  };

  const formattedCategories = categories.map(category => ({
    id: String(category.id),
    name: category.name
  }));

  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Recurring Expenses</h1>
            <p className="text-muted-foreground">Manage your recurring monthly expenses</p>
          </div>
          
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingExpense(null);
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>Add Recurring Expense</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingExpense ? 'Edit Recurring Expense' : 'Add New Recurring Expense'}</DialogTitle>
            </DialogHeader>
            <RecurringExpenseForm 
              onSubmit={handleSubmit} 
              categories={formattedCategories}
              initialValues={editingExpense ? {
                name: editingExpense.name,
                amount: editingExpense.amount,
                categoryId: String(editingExpense.categoryId),
                dueDay: editingExpense.dueDayOfMonth,
                description: editingExpense.description,
              } : undefined}
              buttonText={editingExpense ? "Update Expense" : "Add Expense"}
            />
          </DialogContent>
        </Dialog>
        </header>

        <div className="rounded-lg border border-border/40 backdrop-blur-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Due Day</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-center">Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recurringExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-purple-500" />
                    {expense.name}
                  </TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>{expense.dueDayOfMonth}<sup>th</sup> of each month</TableCell>
                  <TableCell className="text-right">${expense.amount.toLocaleString()}</TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={expense.isActive}
                      onCheckedChange={() => expense.id && handleToggleStatus(expense.id, expense.isActive)}
                    />
                  </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(expense)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => expense.id && handleDelete(expense.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AppLayout>
  );
};

export default RecurringExpenses;
