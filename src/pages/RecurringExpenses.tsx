import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from "@/components/ui/button";
import { RecurringExpenseForm } from '@/components/expenses/RecurringExpenseForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data
const mockCategories = [
  { id: "1", name: "Housing" },
  { id: "2", name: "Transportation" },
  { id: "3", name: "Utilities" },
  { id: "4", name: "Insurance" },
  { id: "5", name: "Groceries" },
  { id: "6", name: "Other" },
];

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

  const handleAddRecurringExpense = (values: any) => {
    if (editingExpense) {
      const updatedExpenses = recurringExpenses.map(expense => 
        expense.id === editingExpense.id 
          ? {
              ...expense,
              name: values.name,
              amount: values.amount,
              categoryId: values.categoryId,
              category: mockCategories.find(c => c.id === values.categoryId)?.name || "",
              dueDay: values.dueDay,
              description: values.description || "",
            }
          : expense
      );
      setRecurringExpenses(updatedExpenses);
      toast({
        title: "Recurring Expense Updated",
        description: "The recurring expense has been updated successfully.",
      });
    } else {
      const newRecurringExpense = {
        id: `${recurringExpenses.length + 1}`,
        name: values.name,
        amount: values.amount,
        categoryId: values.categoryId,
        category: mockCategories.find(c => c.id === values.categoryId)?.name || "",
        dueDay: values.dueDay,
        description: values.description || "",
      };
      setRecurringExpenses([...recurringExpenses, newRecurringExpense]);
      toast({
        title: "Recurring Expense Added",
        description: "New recurring expense has been added successfully.",
      });
    }
    setIsDialogOpen(false);
    setEditingExpense(null);
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
              <Button onClick={handleOpenDialog}>Add Recurring Expense</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingExpense ? 'Edit Recurring Expense' : 'Add New Recurring Expense'}</DialogTitle>
              </DialogHeader>
              <RecurringExpenseForm 
                onSubmit={handleAddRecurringExpense} 
                categories={mockCategories}
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
