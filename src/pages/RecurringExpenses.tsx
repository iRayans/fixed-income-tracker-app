import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from "@/components/ui/button";
import { RecurringExpenseForm } from '@/components/expenses/RecurringExpenseForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '@/services/categoryService';
import { recurringExpenseService, RecurringExpense } from '@/services/recurringExpenseService';

// Mock data
const mockRecurringExpenses = [
  { id: "1", name: "Apartment Rent", amount: 1500, categoryId: "1", category: "Housing", dueDay: 1, description: "Monthly rent payment" },
  { id: "2", name: "Car Payment", amount: 400, categoryId: "2", category: "Transportation", dueDay: 5, description: "Car loan payment" },
  { id: "3", name: "Internet", amount: 80, categoryId: "3", category: "Utilities", dueDay: 15, description: "Broadband service" },
  { id: "4", name: "Health Insurance", amount: 200, categoryId: "4", category: "Insurance", dueDay: 20, description: "Health coverage" },
];

const RecurringExpenses = () => {
  const [recurringExpenses, setRecurringExpenses] = useState(mockRecurringExpenses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getCategories,
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

  const handleAddRecurringExpense = (values: any) => {
    const newRecurringExpense = {
      name: values.name,
      amount: values.amount,
      categoryId: parseInt(values.categoryId),
      dueDayOfMonth: values.dueDay,
      description: values.description || "",
      isActive: true,
    };

    createRecurringExpenseMutation.mutate(newRecurringExpense);
  };

  const handleEdit = (expense: any) => {
    setEditingExpense(expense);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setRecurringExpenses(expenses => expenses.filter(expense => expense.id !== id));
    toast({
      title: "Recurring Expense Deleted",
      description: "The recurring expense has been deleted successfully.",
    });
  };

  const handleOpenDialog = () => {
    setEditingExpense(null);
    setIsDialogOpen(true);
  };

  const formattedCategories = categories.map(category => ({
    id: String(category.id),
    name: category.name
  }));

  return (
    <AppLayout>
      <div className="space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Recurring Expenses</h1>
            <p className="text-muted-foreground">Manage your recurring monthly expenses</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsDialogOpen(true)}>Add Recurring Expense</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingExpense ? 'Edit Recurring Expense' : 'Add New Recurring Expense'}</DialogTitle>
              </DialogHeader>
              <RecurringExpenseForm 
                onSubmit={handleAddRecurringExpense} 
                categories={formattedCategories}
                initialValues={editingExpense}
              />
            </DialogContent>
          </Dialog>
        </header>

        <div className="rounded-lg border border-border/40 backdrop-blur-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Due Day</TableHead>
                <TableHead className="text-right">Amount</TableHead>
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
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>{expense.dueDay}<sup>th</sup> of each month</TableCell>
                  <TableCell className="text-right">${expense.amount.toLocaleString()}</TableCell>
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
                      onClick={() => handleDelete(expense.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
};

export default RecurringExpenses;
